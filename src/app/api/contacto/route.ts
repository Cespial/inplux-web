import { FIELD, LIMITS, NO_JS_TARGET, TOKEN_COOKIE } from "@/lib/contact/fields.mjs";
import { processSubmission } from "@/lib/contact/process.mjs";
import { clientIp, createRateLimiter } from "@/lib/contact/rate-limit.mjs";
import { createNonceStore } from "@/lib/contact/token.mjs";

/*
 * POST /api/contacto: recibe el formulario y lo envía por Resend.
 *
 * - Con JS el navegador manda JSON y recibe `{ ok }` / `{ ok:false, error }`.
 * - Sin JS el formulario nativo manda form-data y recibe un 303 a `/contacto`
 *   con un ancla que la página muestra con `:target`.
 *
 * Runtime Node por defecto (usa `node:crypto`). Solo exporta POST: Next
 * responde 405 a cualquier otro método.
 */

export const dynamic = "force-dynamic";

// Por instancia: ver los comentarios en `src/lib/contact/rate-limit.mjs` y
// `createNonceStore` en `src/lib/contact/token.mjs`.
const limiter = createRateLimiter();
const nonces = createNonceStore();

const JSON_TYPE = "application/json";
const FORM_TYPES = ["application/x-www-form-urlencoded", "multipart/form-data"];

const noStore = { "Cache-Control": "no-store" };

function json(status: number, body: unknown) {
  return Response.json(body, { status, headers: noStore });
}

/** Lee el cuerpo con tope: corta en cuanto pasa de `LIMITS.bodyMax`. */
async function readCapped(request: Request): Promise<Uint8Array | null> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > LIMITS.bodyMax) return null;
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > LIMITS.bodyMax) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function readCookie(header: string | null, name: string) {
  for (const part of header?.split(";") ?? []) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

/** Página de origen sin JS: el path del Referer, si es de este mismo sitio. */
function refererPath(request: Request) {
  const referer = request.headers.get("referer");
  if (!referer) return "";
  try {
    // Se compara con `Host`: detrás de un proxy `request.url` puede traer otro
    // nombre de host que el que vio el navegador.
    const url = new URL(referer);
    return url.host === request.headers.get("host") ? url.pathname : "";
  } catch {
    return "";
  }
}

function redirectNoJs(result: { status: number; body: { ok: boolean; error?: string } }) {
  let query = "enviado=1";
  let target: string = NO_JS_TARGET.sent;
  if (!result.body.ok) {
    const error = result.body.error ?? "send_failed";
    query = `error=${encodeURIComponent(error)}`;
    target =
      result.status === 400
        ? NO_JS_TARGET.invalid
        : result.status === 429
          ? NO_JS_TARGET.limited
          : NO_JS_TARGET.unavailable;
  }
  return new Response(null, {
    status: 303,
    headers: { ...noStore, Location: `/contacto?${query}#${target}` },
  });
}

export async function POST(request: Request) {
  const contentType = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const isJson = contentType === JSON_TYPE;
  const isForm = FORM_TYPES.includes(contentType);
  if (!isJson && !isForm) return json(415, { ok: false, error: "unsupported_media_type" });

  const bytes = await readCapped(request);
  if (!bytes) {
    return isJson
      ? json(413, { ok: false, error: "payload_too_large" })
      : redirectNoJs({ status: 400, body: { ok: false, error: "payload_too_large" } });
  }

  let fields: Record<string, unknown> = {};
  try {
    if (isJson) {
      const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("no es objeto");
      fields = parsed as Record<string, unknown>;
    } else {
      const form = await new Response(bytes as BodyInit, {
        headers: { "content-type": request.headers.get("content-type") ?? contentType },
      }).formData();
      for (const [key, value] of form.entries()) {
        if (typeof value === "string") fields[key] = value;
      }
      if (!fields[FIELD.page]) fields[FIELD.page] = refererPath(request);
    }
  } catch {
    return isJson
      ? json(400, { ok: false, error: "invalid_body" })
      : redirectNoJs({ status: 400, body: { ok: false, error: "invalid_body" } });
  }

  const result = await processSubmission({
    fields,
    cookieToken: readCookie(request.headers.get("cookie"), TOKEN_COOKIE),
    ip: clientIp(request.headers),
    env: process.env,
    limiter,
    nonces,
    fetchImpl: fetch,
  });

  return isJson ? json(result.status, result.body) : redirectNoJs(result);
}

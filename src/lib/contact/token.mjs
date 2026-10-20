import { createHmac, timingSafeEqual } from "node:crypto";
import { TOKEN_WINDOW } from "./fields.mjs";

/*
 * Marca de tiempo firmada: «emitida en T» + HMAC-SHA256. Prueba que quien
 * envía pidió el formulario a este servidor y esperó un mínimo antes de
 * enviarlo. No es un captcha: sube el costo del bot más simple, nada más.
 */

const DEV_SECRET = "inplux-contacto-solo-desarrollo";

/**
 * `CONTACT_FORM_SECRET`; si no existe, una derivada de `RESEND_API_KEY` (la
 * clave no viaja nunca, solo su HMAC); si tampoco, una constante que solo vale
 * fuera de producción. En producción sin ninguna de las dos devuelve null.
 * @param {Record<string, string | undefined>} env
 * @returns {string | null}
 */
export function resolveSecret(env) {
  if (env.CONTACT_FORM_SECRET) return env.CONTACT_FORM_SECRET;
  if (env.RESEND_API_KEY) {
    return createHmac("sha256", env.RESEND_API_KEY).update("inplux-contacto-v1").digest("hex");
  }
  if (env.NODE_ENV !== "production") return DEV_SECRET;
  return null;
}

/** @param {string} secret @param {number} issuedAt */
function signature(secret, issuedAt) {
  return createHmac("sha256", secret).update(`contacto:v1:${issuedAt}`).digest("base64url");
}

/** @param {string} secret @param {number} [now] */
export function issueToken(secret, now = Date.now()) {
  const issuedAt = Math.floor(now);
  return `${issuedAt}.${signature(secret, issuedAt)}`;
}

/**
 * @param {string} secret
 * @param {unknown} token
 * @param {number} [now]
 * @returns {{ ok: true } | { ok: false, reason: "missing" | "malformed" | "signature" | "too_fast" | "expired" }}
 */
export function verifyToken(secret, token, now = Date.now()) {
  if (typeof token !== "string" || token.length === 0) return { ok: false, reason: "missing" };
  const match = /^(\d{10,16})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match) return { ok: false, reason: "malformed" };

  const issuedAt = Number(match[1]);
  const expected = Buffer.from(signature(secret, issuedAt));
  const received = Buffer.from(match[2]);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return { ok: false, reason: "signature" };
  }

  const age = now - issuedAt;
  if (age < TOKEN_WINDOW.minAgeMs) return { ok: false, reason: "too_fast" };
  if (age > TOKEN_WINDOW.maxAgeMs) return { ok: false, reason: "expired" };
  return { ok: true };
}

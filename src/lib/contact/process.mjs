import { buildEmail, resolveMailConfig } from "./email.mjs";
import { FIELD } from "./fields.mjs";
import { resolveSecret, verifyToken } from "./token.mjs";
import { sanitizePage, validateContact } from "./validate.mjs";

/*
 * La decisión completa sobre un envío, sin HTTP: el route handler solo lee la
 * petición y traduce el resultado. Así las pruebas ejercitan cada camino sin
 * levantar Next ni llamar a Resend.
 *
 * Orden: trampa → límite por IP → secreto → marca de tiempo → validación →
 * clave de Resend → envío. Los rechazos antibot responden `{ ok: true }` sin
 * enviar: al bot no se le dice qué lo delató.
 */

/**
 * @typedef {{ status: number, body: { ok: true } | { ok: false, error: string }, outcome: string }} ContactResult
 * @typedef {(url: string, init: { method: string, headers: Record<string, string>, body: string, signal?: AbortSignal }) => Promise<{ ok: boolean, status: number }>} FetchLike
 */

/** @param {string} outcome @returns {ContactResult} */
const silent = (outcome) => ({ status: 200, body: { ok: true }, outcome });
/** @param {number} status @param {string} error @returns {ContactResult} */
const fail = (status, error) => ({ status, body: { ok: false, error }, outcome: error });

/**
 * @param {{
 *   fields: Record<string, unknown>,
 *   cookieToken?: string | null,
 *   ip: string,
 *   env: Record<string, string | undefined>,
 *   limiter: { hit(key: string, now?: number): boolean },
 *   fetchImpl: FetchLike,
 *   now?: number,
 *   log?: (message: string) => void,
 * }} options
 * @returns {Promise<ContactResult>}
 */
export async function processSubmission({
  fields,
  cookieToken = null,
  ip,
  env,
  limiter,
  fetchImpl,
  now = Date.now(),
  log = (message) => console.warn(message),
}) {
  const honeypot = fields[FIELD.honeypot];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    log("[contacto] descartado: campo trampa con valor");
    return silent("honeypot");
  }

  if (!limiter.hit(ip, now)) {
    log("[contacto] límite por IP alcanzado");
    return fail(429, "rate_limited");
  }

  const secret = resolveSecret(env);
  if (!secret) return fail(503, "not_configured");

  const bodyToken = fields[FIELD.token];
  const token = typeof bodyToken === "string" && bodyToken !== "" ? bodyToken : cookieToken;
  const check = verifyToken(secret, token, now);
  if (!check.ok) {
    log(`[contacto] descartado: marca de tiempo (${check.reason})`);
    return silent(`token_${check.reason}`);
  }

  const validation = validateContact({
    name: fields[FIELD.name],
    email: fields[FIELD.email],
    organization: fields[FIELD.organization],
    needType: fields[FIELD.needType],
    message: fields[FIELD.message],
  });
  if (!validation.ok) return fail(400, validation.error);

  const config = resolveMailConfig(env);
  if (!config.apiKey) return fail(503, "not_configured");

  const mail = buildEmail({
    ...validation.value,
    page: sanitizePage(fields[FIELD.page]),
    date: new Date(now),
  });

  try {
    const response = await fetchImpl(config.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: validation.value.email,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      log(`[contacto] Resend respondió ${response.status}`);
      return fail(503, "send_failed");
    }
  } catch {
    log("[contacto] no se pudo contactar a Resend");
    return fail(503, "send_failed");
  }

  return { status: 200, body: { ok: true }, outcome: "sent" };
}

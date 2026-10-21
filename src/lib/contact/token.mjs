import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { TOKEN_WINDOW } from "./fields.mjs";

/*
 * Marca de tiempo firmada: `issuedAt.nonce.firma`, con HMAC-SHA256 sobre la
 * fecha de emisión y un nonce aleatorio. Prueba que quien envía pidió el
 * formulario a este servidor, esperó un mínimo antes de enviarlo y no está
 * reutilizando una marca ya gastada (ver `createNonceStore`). No es un
 * captcha: sube el costo del bot más simple, nada más.
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

/** @param {string} secret @param {number} issuedAt @param {string} nonce */
function signature(secret, issuedAt, nonce) {
  return createHmac("sha256", secret)
    .update(`contacto:v2:${issuedAt}:${nonce}`)
    .digest("base64url");
}

/**
 * @param {string} secret
 * @param {number} [now]
 * @param {string} [nonce] solo para pruebas; por defecto 16 bytes aleatorios
 */
export function issueToken(secret, now = Date.now(), nonce = randomBytes(16).toString("base64url")) {
  const issuedAt = Math.floor(now);
  return `${issuedAt}.${nonce}.${signature(secret, issuedAt, nonce)}`;
}

/**
 * @param {string} secret
 * @param {unknown} token
 * @param {number} [now]
 * @returns {{ ok: true, nonce: string } | { ok: false, reason: "missing" | "malformed" | "signature" | "too_fast" | "expired" }}
 */
export function verifyToken(secret, token, now = Date.now()) {
  if (typeof token !== "string" || token.length === 0) return { ok: false, reason: "missing" };
  const match = /^(\d{10,16})\.([A-Za-z0-9_-]{22})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match) return { ok: false, reason: "malformed" };

  const issuedAt = Number(match[1]);
  const nonce = match[2];
  const expected = Buffer.from(signature(secret, issuedAt, nonce));
  const received = Buffer.from(match[3]);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return { ok: false, reason: "signature" };
  }

  const age = now - issuedAt;
  if (age < TOKEN_WINDOW.minAgeMs) return { ok: false, reason: "too_fast" };
  if (age > TOKEN_WINDOW.maxAgeMs) return { ok: false, reason: "expired" };
  return { ok: true, nonce };
}

/**
 * Registro de nonces ya gastados: una marca vale para UN envío.
 *
 * ⚠️ Igual que el límite por IP, es POR INSTANCIA y en memoria: otra
 * instancia de la función (o una recién arrancada) no conoce los nonces que
 * gastó esta. Frena el reenvío masivo contra una misma instancia; un
 * registro global necesitaría un almacén compartido.
 *
 * Cada nonce caduca con la ventana de la marca: pasado ese plazo la propia
 * marca ya no valida, así que no hace falta recordarlo más.
 *
 * @param {{ ttlMs?: number, maxEntries?: number }} [options]
 */
export function createNonceStore({ ttlMs = TOKEN_WINDOW.maxAgeMs, maxEntries = 50_000 } = {}) {
  /** @type {Map<string, number>} nonce → instante en que se gastó */
  const used = new Map();
  let lastSweep = 0;

  /** @param {number} now */
  function sweep(now) {
    for (const [nonce, at] of used) {
      if (now - at >= ttlMs) used.delete(nonce);
    }
    while (used.size > maxEntries) {
      const oldest = used.keys().next().value;
      if (oldest === undefined) break;
      used.delete(oldest);
    }
    lastSweep = now;
  }

  return {
    /** @param {string} nonce @param {number} [now] */
    has(nonce, now = Date.now()) {
      if (now - lastSweep > 60_000) sweep(now);
      const at = used.get(nonce);
      return at !== undefined && now - at < ttlMs;
    },
    /** @param {string} nonce @param {number} [now] */
    add(nonce, now = Date.now()) {
      used.set(nonce, now);
      if (used.size > maxEntries) sweep(now);
    },
    size() {
      return used.size;
    },
  };
}

import { LIMITS } from "./fields.mjs";

/**
 * Validación del lado del servidor. El navegador repite parte de estas reglas
 * con atributos HTML, pero la que decide es esta.
 */

const URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>"]+/gi;
// Formato práctico: algo@dominio.tld, sin espacios ni caracteres de control.
const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** @param {unknown} value */
function text(value) {
  return typeof value === "string" ? value.replace(CONTROL_CHARS, "").trim() : "";
}

/** Una línea: sin saltos (va al asunto y a cabeceras). @param {unknown} value */
function line(value) {
  return text(value).replace(/\s+/g, " ");
}

/** @param {string} value */
export function countUrls(value) {
  return (value.match(URL_PATTERN) ?? []).length;
}

/** @param {string} value */
export function isValidEmail(value) {
  return value.length <= LIMITS.emailMax && EMAIL_PATTERN.test(value);
}

/**
 * @typedef {{ name: string, email: string, organization: string, needType: string, message: string }} ContactInput
 * @typedef {"invalid_name" | "invalid_email" | "invalid_organization" | "invalid_message" | "too_many_links"} ValidationError
 */

/**
 * @param {Record<string, unknown>} raw
 * @returns {{ ok: true, value: ContactInput } | { ok: false, error: ValidationError }}
 */
export function validateContact(raw) {
  const name = line(raw.name);
  const email = line(raw.email).toLowerCase();
  const organization = line(raw.organization);
  const needType = line(raw.needType).slice(0, LIMITS.needTypeMax);
  const message = text(raw.message).replace(/\r\n?/g, "\n");

  if (name.length < LIMITS.nameMin || name.length > LIMITS.nameMax) {
    return { ok: false, error: "invalid_name" };
  }
  if (!isValidEmail(email)) return { ok: false, error: "invalid_email" };
  if (organization.length > LIMITS.organizationMax) {
    return { ok: false, error: "invalid_organization" };
  }
  if (message.length < LIMITS.messageMin || message.length > LIMITS.messageMax) {
    return { ok: false, error: "invalid_message" };
  }
  if (countUrls(message) > LIMITS.maxUrls) return { ok: false, error: "too_many_links" };

  return { ok: true, value: { name, email, organization, needType, message } };
}

/**
 * Ruta de origen: solo un path propio, nunca una URL ajena.
 * @param {unknown} value
 */
export function sanitizePage(value) {
  const page = line(value);
  if (!page.startsWith("/") || page.startsWith("//") || page.length > LIMITS.pageMax) return "";
  return page;
}

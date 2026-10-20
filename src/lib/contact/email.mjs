/*
 * El correo que llega a INPLUX. Todo lo que escribe el visitante pasa por
 * `escapeHtml` antes de entrar al HTML.
 */

export const RESEND_DEFAULT_URL = "https://api.resend.com/emails";
export const DEFAULT_TO = "cristian@inplux.co";
export const DEFAULT_FROM = "INPLUX <formulario@inplux.co>";

/** @param {unknown} value */
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Fecha en hora de Bogotá, p. ej. «20 de octubre de 2026, 3:04 p. m.». @param {Date} date */
export function formatBogota(date) {
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

/**
 * @param {Record<string, string | undefined>} env
 * @returns {{ apiKey: string | null, to: string, from: string, apiUrl: string }}
 */
export function resolveMailConfig(env) {
  return {
    apiKey: env.RESEND_API_KEY || null,
    to: env.CONTACT_TO || DEFAULT_TO,
    from: env.CONTACT_FROM || DEFAULT_FROM,
    // Solo para pruebas locales: apunta a un servidor que registra el cuerpo.
    apiUrl: env.RESEND_API_URL || RESEND_DEFAULT_URL,
  };
}

/**
 * @param {import("./validate.mjs").ContactInput & { page: string, date: Date }} input
 */
export function buildEmail({ name, email, organization, needType, message, page, date }) {
  const subject = ["Contacto inplux.co", name, organization].filter(Boolean).join(" · ");
  const when = formatBogota(date);
  const origin = page || "sin dato";
  const rows = [
    ["Nombre", name],
    ["Correo", email],
    ["Empresa o entidad", organization || "No indicada"],
    ["Tipo de necesidad", needType || "No indicado"],
    ["Página", origin],
    ["Fecha (hora de Bogotá)", when],
  ];

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Mensaje:",
    message,
    "",
    "Responde a este correo para escribirle directamente.",
  ].join("\n");

  const html = [
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#111">',
    '<table cellpadding="4" cellspacing="0" style="border-collapse:collapse">',
    ...rows.map(
      ([label, value]) =>
        `<tr><td style="color:#555;vertical-align:top"><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`,
    ),
    "</table>",
    '<p style="margin:16px 0 4px"><strong>Mensaje</strong></p>',
    `<div style="white-space:pre-wrap;border-left:3px solid #00d7ca;padding-left:12px">${escapeHtml(message)}</div>`,
    '<p style="margin-top:16px;color:#555">Responde a este correo para escribirle directamente.</p>',
    "</div>",
  ].join("");

  return { subject, text, html };
}

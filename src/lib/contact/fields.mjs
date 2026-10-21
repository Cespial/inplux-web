/*
 * Contrato del formulario de contacto que comparten el navegador, el route
 * handler y las pruebas. Sin dependencias de Node: el componente de cliente lo
 * importa para los `maxLength` y los nombres de campo.
 */

/** Rutas propias. La CSP (`connect-src 'self'`, `form-action 'self'`) las cubre. */
export const CONTACT_ENDPOINT = "/api/contacto";
export const CONTACT_TOKEN_ENDPOINT = "/api/contacto/token";

/** Nombres de campo del formulario. */
export const FIELD = Object.freeze({
  name: "name",
  email: "email",
  organization: "organization",
  needType: "needType",
  message: "challenge",
  /**
   * Campo trampa: oculto fuera de pantalla, una persona nunca lo llena. El
   * nombre no significa nada a propósito: uno como «empresa» o «web» casa con
   * las heurísticas de autocompletado y descartaría mensajes reales.
   */
  honeypot: "hp_ref_x7",
  /** Marca de tiempo firmada (la pone el navegador o, sin JS, la cookie). */
  token: "cf_token",
  /** Página desde donde se escribió. */
  page: "pagina",
});

export const LIMITS = Object.freeze({
  nameMin: 2,
  nameMax: 120,
  emailMax: 200,
  organizationMax: 160,
  needTypeMax: 120,
  messageMin: 10,
  messageMax: 4000,
  maxUrls: 3,
  pageMax: 200,
  /** Cuerpo de la petición, en bytes. */
  bodyMax: 16 * 1024,
});

/** Ventana válida de la marca de tiempo, en milisegundos. */
export const TOKEN_WINDOW = Object.freeze({
  minAgeMs: 3_000,
  maxAgeMs: 2 * 60 * 60 * 1000,
});

/** Cookie que pone `src/proxy.ts` en `/contacto` para el envío sin JS. */
export const TOKEN_COOKIE = "inplux_cf";

/**
 * Anclas de `/contacto` a las que redirige el envío sin JS (303). La página
 * las muestra con `:target`, así que funciona sin JavaScript y sin volverla
 * dinámica.
 */
export const NO_JS_TARGET = Object.freeze({
  sent: "contacto-enviado",
  invalid: "contacto-error-datos",
  limited: "contacto-error-limite",
  unavailable: "contacto-error-envio",
});

import type { WorkSlug } from "./work";

/**
 * Las capturas de página real, en un solo sitio.
 *
 * Hasta ahora cada pantalla que enmarcaba una captura escribía otra vez la ruta
 * del PNG, la fecha en que se tomó y su texto alternativo: `/trabajo` en
 * `ProjectShowcase.client.tsx` y `/capacidades` en su `page.tsx`, con dos
 * redacciones distintas del mismo `alt` y dos copias de la misma fecha, las dos
 * con un comentario que decía «copiada del acta». Una tercera pantalla —la
 * lámina de producto del deck— habría hecho tres copias de cada dato y ninguna
 * obligada a coincidir.
 *
 * Aquí viven una vez. Y `scripts/verify-captures.test.mjs` compara este módulo
 * contra `public/work/real-pages/capture-manifest.json` —fichero, fecha, URL de
 * origen y `sha256` recalculado— así que la copia que queda está sujeta a una
 * puerta en vez de a la memoria de quien edite.
 *
 * ⚠️ **Este módulo no importa `work.ts`** (solo su tipo, que se borra en
 * compilación) ni el acta en JSON: lo consume `ProjectShowcase.client.tsx`, que
 * es un componente cliente, y cualquiera de las dos cosas viajaría entera al
 * navegador. Es el mismo motivo por el que `work-format.ts` vive separado.
 */
export type WorkCapture = {
  /**
   * La URL viva que enmarca la captura, y la que se pinta en la barra del
   * navegador. **Tiene que ser una `source` del perfil**: `verificationDateFor`
   * revienta el build si no lo es, que es como la fecha del pie deja de poder
   * escribirse a mano.
   */
  sourceUrl: string;
  /** Ruta del PNG bajo `public/`. Del acta. */
  src: string;
  /** Fecha en que se tomó la captura, en ISO. Del acta. */
  capturedAt: `${number}-${number}-${number}`;
  /**
   * URL contra la que se tomó la captura, que no siempre es la de hoy. Del
   * acta. En Tribai difieren —se capturó `tribai.co/asistente`, que hoy
   * responde 301, y el asistente vive en `app.tribai.co`—, y tenerlas las dos
   * separadas es lo que permite que la prueba compare cada una con la suya.
   */
  capturedFrom: string;
  alt: string;
};

export const workCaptures = {
  gobia: {
    sourceUrl: "https://www.gobia.co/demo",
    src: "/work/real-pages/gobia-demo-2026-07-21.png",
    capturedAt: "2026-07-21",
    capturedFrom: "https://www.gobia.co/demo",
    alt: "Captura real de la demo pública de Gobia, con el mapa de Medellín y su panel fiscal.",
  },
  laudos: {
    sourceUrl: "https://laudos.co/?view=predecir",
    src: "/work/real-pages/laudos-prediccion-2026-07-21.png",
    capturedAt: "2026-07-21",
    capturedFrom: "https://laudos.co/?view=predecir",
    alt: "Captura real del Laboratorio de Predicción público de Laudos.",
  },
  tribai: {
    sourceUrl: "https://app.tribai.co/",
    src: "/work/real-pages/tribai-asistente-2026-07-21.png",
    capturedAt: "2026-07-21",
    capturedFrom: "https://tribai.co/asistente",
    alt: "Captura real del Asistente Tributario público de Tribai.",
  },
  kelsen: {
    sourceUrl: "https://kelsen.io/explorador?vigencia=modificado",
    src: "/work/real-pages/kelsen-explorador-2026-07-21.png",
    capturedAt: "2026-07-21",
    capturedFrom: "https://kelsen.io/explorador?vigencia=modificado",
    alt: "Captura real de la Biblioteca Legal pública de Kelsen con resultados del corpus jurídico.",
  },
  porkia: {
    sourceUrl: "https://porkia.co/#demo",
    src: "/work/real-pages/porkia-demo-2026-08-11.png",
    capturedAt: "2026-08-11",
    capturedFrom: "https://porkia.co/#demo",
    // El teléfono que se ve en la imagen lo dibuja porkia.co: la captura no
    // recrea ninguna interfaz, retrata la página pública tal como responde.
    alt: "Captura real de la demostración pública de Porkia, con las pantallas de la app recorribles desde el navegador.",
  },
} as const satisfies Record<WorkSlug, WorkCapture>;

/**
 * El tamaño real del archivo, que es también el techo: el optimizador no
 * amplía, así que pedirle `w=3840` a cualquiera de las cinco devuelve estos
 * mismos 1440×960. Va aquí y no escrito en cada `<Image>` porque es un dato del
 * conjunto, no de la pantalla que lo enmarca.
 */
export const CAPTURA_ANCHO = 1440;
export const CAPTURA_ALTO = 960;

/**
 * `https://www.gobia.co/demo` → `gobia.co/demo`.
 *
 * La URL que se pinta en la barra del navegador se DERIVA de la que se enmarca,
 * en vez de escribirse al lado: escritas eran dos cadenas que nadie obligaba a
 * describir el mismo sitio, y la barra podía anunciar un dominio y el enlace
 * llevar a otro.
 */
export function urlVisible(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

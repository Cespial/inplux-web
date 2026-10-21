/**
 * La pestaña de noticia del hero de la portada (PR Q, octubre de 2026).
 *
 * Es TEMPORAL: anuncia el viaje a San Francisco y Silicon Valley del 7 al 13
 * de diciembre de 2026 y deja de renderizarse sola pasado el último día. Vive
 * en su propio archivo —y no en el diccionario de copy— para que, cuando se
 * cambie la noticia o se retire, todo lo suyo salga junto: este archivo, el
 * componente `components/home/v5/NewsTab*`, su hoja, `public/brand/news/` y
 * `scripts/verify-news-tab.test.mjs`.
 *
 * Sin importaciones a propósito: `scripts/verify-build-output.mjs` lo carga
 * con Node a secas para saber si la pestaña tiene que estar en el HTML.
 */

/** Último día de la noticia, en hora de Colombia. */
export const NEWS_LAST_DAY = "2026-12-13";

/**
 * La medianoche siguiente al último día en hora de Colombia (UTC-5): desde
 * ese instante la pestaña ya no se renderiza.
 */
export const NEWS_EXPIRES = Date.parse("2026-12-14T00:00:00-05:00");

/** ¿Sigue vigente la noticia en el instante `now`? */
export function isNewsActive(now: number = Date.now()) {
  return now < NEWS_EXPIRES;
}

/** Un tramo del texto de la tarjeta; `strong` lo pinta en `<b>`. */
export type NewsSegment = { text: string; strong?: boolean };

export type NewsCopy = {
  /** Texto de la pestaña vertical. */
  tab: string;
  /** Nombre accesible de la pestaña: contiene el texto visible. */
  tabLabel: string;
  /** Rótulo sobre la foto de la placa. */
  plateCaption: string;
  /** Texto alternativo de la foto. */
  plateAlt: string;
  body: readonly NewsSegment[];
  date: string;
  /** Primer día, legible por máquina, para `<time>`. */
  dateTime: string;
  action: string;
};

/** La foto de la placa: 680×197 (≈ 3,46:1), servida a 2× sobre unos 312 px. */
export const NEWS_PLATE = {
  src: "/brand/news/golden-gate.webp",
  width: 680,
  height: 197,
} as const;

export const newsCopy: Record<"es" | "en", NewsCopy> = {
  es: {
    tab: "San Francisco · Dic",
    tabLabel: "Noticia: San Francisco · Dic",
    plateCaption: "San Francisco · Silicon Valley",
    plateAlt: "Puente Golden Gate al atardecer, con niebla baja sobre la bahía",
    body: [
      { text: "En diciembre " },
      { text: "vamos a San Francisco", strong: true },
      { text: " y Silicon Valley a conocer talento y comunidad latina en tecnología. ¿Construyes con IA en la Bahía? " },
      { text: "Tomemos un café.", strong: true },
    ],
    date: "7–13 de diciembre de 2026",
    dateTime: "2026-12-07",
    action: "Escríbenos",
  },
  en: {
    tab: "San Francisco · Dec",
    tabLabel: "News: San Francisco · Dec",
    plateCaption: "San Francisco · Silicon Valley",
    plateAlt: "Golden Gate Bridge at sunset, with low fog over the bay",
    body: [
      { text: "In December " },
      { text: "we're heading to San Francisco", strong: true },
      { text: " and Silicon Valley to meet Latino talent and community in tech. Building with AI in the Bay Area? " },
      { text: "Let's grab a coffee.", strong: true },
    ],
    date: "December 7–13, 2026",
    dateTime: "2026-12-07",
    action: "Write to us",
  },
};

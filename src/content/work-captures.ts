import type { WorkSlug } from "./work";

/**
 * Las capturas de página real, en un solo sitio.
 *
 * Hasta ahora cada pantalla que enmarcaba una captura escribía otra vez la ruta
 * del PNG, la fecha en que se tomó y su texto alternativo: `/trabajo` y
 * `/capacidades` en sus `page.tsx` (hoy `/trabajo` y `/como-trabajamos`), con dos
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
type CaptureBase = {
  /** Ruta del PNG bajo `public/`. Del acta. */
  src: string;
  /** Fecha en que se tomó (o se entregó) la imagen, en ISO. Del acta. */
  capturedAt: `${number}-${number}-${number}`;
  alt: string;
};

/** Una captura de navegador de una página pública del producto. */
export type PageCapture = CaptureBase & {
  kind: "page";
  /**
   * La URL viva que enmarca la captura, y la que se pinta en la barra del
   * navegador. **Tiene que ser una `source` del perfil**: `verificationDateFor`
   * revienta el build si no lo es, que es como la fecha del pie deja de poder
   * escribirse a mano.
   */
  sourceUrl: string;
  /**
   * URL contra la que se tomó la captura, que no siempre es la de hoy. Del
   * acta. En Tribai difieren —se capturó `tribai.co/asistente`, que hoy
   * responde 301, y el asistente vive en `app.tribai.co`—, y tenerlas las dos
   * separadas es lo que permite que la prueba compare cada una con la suya.
   */
  capturedFrom: string;
};

/**
 * Una imagen hecha con pantallas que entregó INPLUX, de una aplicación cuya
 * interfaz no se puede capturar en una página pública (MiMotoYa). No lleva URL
 * de origen porque no la hay: no se enmarca en un navegador ni se presenta como
 * captura de una página. El acta registra el archivo, su `sha256` y de qué
 * pantallas sale.
 */
export type DeliveredCapture = CaptureBase & {
  kind: "delivered";
  deliveredBy: "INPLUX";
  /**
   * El sitio público del producto, cuando lo tiene y aun así la serie sigue con
   * las pantallas entregadas: un sitio que PRESENTA una aplicación nativa no es
   * la aplicación, y capturarlo pondría una portada promocional donde las demás
   * fichas muestran el producto en uso. Es una excepción declarada, no un
   * permiso general: `verify-captures.test.mjs` exige que sea una fuente del
   * perfil y que el producto tenga pantallas entregadas en el acta. Sin este
   * campo, una imagen entregada sigue exigiendo un perfil sin fuentes.
   */
  publicSite?: string;
};

export type WorkCapture = PageCapture | DeliveredCapture;

export const workCaptures = {
  gobia: {
    kind: "page",
    sourceUrl: "https://www.gobia.co/demo",
    src: "/work/real-pages/gobia-demo-2026-07-21.png",
    capturedAt: "2026-07-21",
    capturedFrom: "https://www.gobia.co/demo",
    alt: "Captura real de la demo pública de Gobia, con el mapa de Medellín y su panel fiscal.",
  },
  laudos: {
    kind: "page",
    sourceUrl: "https://laudos.co/?view=predecir",
    src: "/work/real-pages/laudos-prediccion-2026-07-21.png",
    capturedAt: "2026-07-21",
    capturedFrom: "https://laudos.co/?view=predecir",
    alt: "Captura real del Laboratorio de Predicción público de Laudos.",
  },
  tribai: {
    kind: "page",
    sourceUrl: "https://app.tribai.co/",
    src: "/work/real-pages/tribai-asistente-2026-07-21.png",
    capturedAt: "2026-07-21",
    capturedFrom: "https://tribai.co/asistente",
    alt: "Captura real del Asistente Tributario público de Tribai.",
  },
  kelsen: {
    kind: "page",
    sourceUrl: "https://kelsen.io/explorador?vigencia=modificado",
    src: "/work/real-pages/kelsen-explorador-2026-07-21.png",
    capturedAt: "2026-07-21",
    capturedFrom: "https://kelsen.io/explorador?vigencia=modificado",
    alt: "Captura real de la Biblioteca Legal pública de Kelsen con resultados del corpus jurídico.",
  },
  porkia: {
    kind: "page",
    sourceUrl: "https://porkia.co/#demo",
    src: "/work/real-pages/porkia-demo-2026-08-11.png",
    capturedAt: "2026-08-11",
    capturedFrom: "https://porkia.co/#demo",
    // El teléfono que se ve en la imagen lo dibuja porkia.co: la captura no
    // recrea ninguna interfaz, retrata la página pública tal como responde.
    alt: "Captura real de la demostración pública de Porkia, con las pantallas de la app recorribles desde el navegador.",
  },
  mimotoya: {
    kind: "delivered",
    deliveredBy: "INPLUX",
    // Tres de las seis pantallas que entregó INPLUX el 26-oct-2026 (portada,
    // lugares con precio y tarifa), puestas lado a lado sobre el fondo de las
    // propias pantallas y al tamaño del resto de la serie. No es una captura de
    // navegador: es una aplicación nativa. Desde el 27-oct-2026 tiene sitio
    // público, pero el sitio la presenta, no es la aplicación; la serie sigue
    // con las pantallas y declara el sitio (ver `publicSite`).
    publicSite: "https://mimotoya.co",
    src: "/work/real-pages/mimotoya-pantallas-2026-10-26.png",
    capturedAt: "2026-10-26",
    alt: "Tres pantallas reales de la aplicación MiMotoYa entregadas por INPLUX: la portada, los lugares del casco urbano con su precio y la tarifa antes de pedir.",
  },
} as const satisfies Record<WorkSlug, WorkCapture>;

/** Una pantalla de la aplicación, tal como la entregó INPLUX (reducida para web). */
export type AppScreen = {
  src: string;
  /**
   * Fecha en que INPLUX entregó la pantalla. Del acta (`deliveredAt`). La ficha
   * la publica en el encabezado de las pantallas: con fuentes públicas el
   * perfil ya no tiene declaración de la que tomarla.
   */
  deliveredAt: `${number}-${number}-${number}`;
  width: number;
  height: number;
  alt: { es: string; en: string };
};

/**
 * Las pantallas de las aplicaciones cuya interfaz no se puede capturar en una
 * página pública, en el orden en que las entregó INPLUX. Son las seis de MiMotoYa (iPhone, 1290×2796,
 * entregadas el 26-oct-2026), reducidas a 645×1398 en WebP; el acta registra
 * el `sha256` del original y el del archivo publicado.
 */
export const appScreens: Partial<Record<WorkSlug, readonly AppScreen[]>> = {
  mimotoya: [
    {
      src: "/work/mimotoya/mimotoya-pantalla-01-2026-10-26.webp",
      deliveredAt: "2026-10-26",
      width: 645,
      height: 1398,
      alt: {
        es: "Portada de MiMotoYa: «El Motocarro de tu Municipio», Pácora, Caldas.",
        en: "MiMotoYa's opening screen: “El Motocarro de tu Municipio”, Pácora, Caldas.",
      },
    },
    {
      src: "/work/mimotoya/mimotoya-pantalla-02-2026-10-26.webp",
      deliveredAt: "2026-10-26",
      width: 645,
      height: 1398,
      alt: {
        es: "Pantalla «¿A dónde vas?», con la elección entre zona urbana y zona rural.",
        en: "The “Where are you going?” screen, choosing between the urban area and the rural area.",
      },
    },
    {
      src: "/work/mimotoya/mimotoya-pantalla-03-2026-10-26.webp",
      deliveredAt: "2026-10-26",
      width: 645,
      height: 1398,
      alt: {
        es: "Lugares del casco urbano, cada uno con su precio.",
        en: "Places in the town centre, each one with its price.",
      },
    },
    {
      src: "/work/mimotoya/mimotoya-pantalla-04-2026-10-26.webp",
      deliveredAt: "2026-10-26",
      width: 645,
      height: 1398,
      alt: {
        es: "Rutas a las veredas, con sus paradas y el precio de cada una.",
        en: "Routes to the rural villages, with their stops and the price of each one.",
      },
    },
    {
      src: "/work/mimotoya/mimotoya-pantalla-05-2026-10-26.webp",
      deliveredAt: "2026-10-26",
      width: 645,
      height: 1398,
      alt: {
        es: "El viaje en el mapa, cuántas personas van y la tarifa total antes de pedir.",
        en: "The trip on the map, how many people are going and the total fare before ordering.",
      },
    },
    {
      src: "/work/mimotoya/mimotoya-pantalla-06-2026-10-26.webp",
      deliveredAt: "2026-10-26",
      width: 645,
      height: 1398,
      alt: {
        es: "Buscando conductor: la aplicación avisa a los motocarros cercanos.",
        en: "Looking for a driver: the app notifies nearby motocarro drivers.",
      },
    },
  ],
};

/**
 * El tamaño real del archivo, que es también el techo: el optimizador no
 * amplía, así que pedirle `w=3840` a cualquiera de ellas devuelve estos
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

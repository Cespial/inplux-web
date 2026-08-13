import { workProfiles, type WorkSlug } from "./work";
import { DECK_COPY, DECK_SOURCES } from "./deck.copy";

export { DECK_COPY, DECK_SOURCES };

export type DeckSlideKind =
  | "portada"
  | "problema"
  | "tesis"
  | "metodo"
  | "espejo"
  | "evidencia"
  | "puente"
  | "producto"
  | "capacidades"
  | "como-empezamos"
  | "cierre";

type WorkProfileEntry = (typeof workProfiles)[number];

export type DeckSlide =
  | { n: number; id: string; kind: Exclude<DeckSlideKind, "producto">; titulo: string }
  | { n: number; id: string; kind: "producto"; titulo: string; perfil: WorkProfileEntry };

const APERTURA = [
  { id: "portada", kind: "portada", titulo: "De un problema real a software en producción" },
  { id: "problema", kind: "problema", titulo: "El promedio no es el riesgo" },
  { id: "tesis", kind: "tesis", titulo: "El software empieza en el problema" },
  { id: "metodo", kind: "metodo", titulo: "Cuatro tiempos" },
  { id: "espejo", kind: "espejo", titulo: "El mismo método, dos lecturas" },
  // ⚠️ El título del riel y del índice NO repite el conteo: sale del mismo
  // copy que el <h1> de la lámina, sin su punto final. Escrito a mano, «Trece»
  // vivía en dos casas y la prueba que lo sujeta —`verify-deck-reasons`— solo
  // miraba una: con una regla nueva en el verificador, la prueba mandaba
  // corregir `deck.copy.ts`, se corregía, la prueba pasaba, y el riel seguía
  // diciendo «Trece» mientras la lámina imprimía «14 reglas activas» dos
  // centímetros más abajo.
  {
    id: "evidencia",
    kind: "evidencia",
    titulo: DECK_COPY.evidencia.respuesta.replace(/\.$/, ""),
  },
  { id: "puente", kind: "puente", titulo: "Dominios que no se parecen, la misma fábrica" },
] as const;

const CIERRE = [
  { id: "capacidades", kind: "capacidades", titulo: "La fábrica por dentro" },
  { id: "como-empezamos", kind: "como-empezamos", titulo: "Los cuatro tiempos, con tu reto" },
  { id: "cierre", kind: "cierre", titulo: "Cuéntanos el problema" },
] as const;

/** Los ids de las láminas que no son de producto, para poder validar `sinLaminas`. */
const IDS_FIJOS: readonly string[] = [...APERTURA, ...CIERRE].map((entrada) => entrada.id);

/**
 * Arma el deck. Sin argumentos, con todos los perfiles de `work.ts` y todas las
 * láminas, que es el deck que se presenta por omisión.
 *
 * `soloPerfiles` recorta la serie de producto a un subconjunto —el deck de solo
 * legaltech, por ejemplo— **conservando el orden de `workProfiles`**: el orden
 * lo manda la fuente, no el orden en que se escriban los slugs aquí. Y la
 * numeración se recalcula sobre lo que queda, así que un deck recortado sigue
 * yendo de 1 a N sin huecos y la barra de progreso no promete láminas que no
 * existen.
 *
 * `sinLaminas` quita láminas de apertura o de cierre por su id. Existe porque
 * recortar los productos puede volver FALSA una lámina que no es de producto:
 * `puente` afirma «dominios que no se parecen» y con una serie de un solo
 * terreno esa frase deja de ser cierta (ver `PERFILES_LEGALTECH`). Quitarla es
 * una decisión de contenido, así que se declara donde se declara el deck y no
 * se esconde en el componente.
 *
 * Es un parámetro y no un segundo modelo a propósito: un `construirLegaltech()`
 * paralelo sería una segunda copia del orden, del reparto de apertura y cierre
 * y de la numeración, y las dos se separarían en la primera lámina que se
 * añadiera a una sola de ellas.
 *
 * ⚠️ Un slug o un id que no exista es un error, no una lámina que se salta en
 * silencio. Filtrar callando deja pasar una errata como un deck sin productos
 * —quince láminas se quedan en diez, la numeración sigue sin huecos, la prueba
 * pasa y nadie se entera hasta la sala— y deja pasar lo contrario: un
 * `sinLaminas: ["Puente"]` mal escrito que no quita nada y manda a la sala la
 * lámina que se quería quitar.
 */
export function construirDeck(
  soloPerfiles?: readonly WorkSlug[],
  sinLaminas: readonly string[] = [],
): DeckSlide[] {
  const perfiles =
    soloPerfiles === undefined
      ? workProfiles
      : workProfiles.filter((perfil) => soloPerfiles.includes(perfil.slug));

  if (soloPerfiles !== undefined) {
    const conocidos = new Set<string>(workProfiles.map((perfil) => perfil.slug));
    const desconocidos = soloPerfiles.filter((slug) => !conocidos.has(slug));
    if (desconocidos.length > 0) {
      throw new Error(`no hay perfil para: ${desconocidos.join(", ")}`);
    }
  }

  const desconocidas = sinLaminas.filter((id) => !IDS_FIJOS.includes(id));
  if (desconocidas.length > 0) {
    throw new Error(`no hay lámina para: ${desconocidas.join(", ")}`);
  }

  const slides: DeckSlide[] = [];
  let n = 0;

  for (const entrada of APERTURA) {
    if (sinLaminas.includes(entrada.id)) continue;
    n += 1;
    slides.push({ n, id: entrada.id, kind: entrada.kind, titulo: entrada.titulo });
  }

  // El orden de los productos es el de work.ts. Una sola fuente para el
  // orden: reordenar allí mueve el deck y /trabajo a la vez. El subconjunto
  // filtra, nunca reordena.
  for (const perfil of perfiles) {
    n += 1;
    slides.push({ n, id: perfil.slug, kind: "producto", titulo: perfil.name, perfil });
  }

  for (const entrada of CIERRE) {
    if (sinLaminas.includes(entrada.id)) continue;
    n += 1;
    slides.push({ n, id: entrada.id, kind: entrada.kind, titulo: entrada.titulo });
  }

  return slides;
}

/**
 * Los perfiles que una tira de láminas presenta, en su orden.
 *
 * ⚠️ **Existe para que ninguna lámina vuelva a leer `workProfiles` global.** La
 * figura del puente y las capas de la fábrica lo hacían, así que un deck
 * recortado enseñaba en su vitrina y en su capa de dominios los CINCO productos
 * mientras la serie de fichas traía cuatro: la lámina contradecía al deck que
 * la contenía, sin que nada fallara. Lo que se presenta sale del deck que se
 * está presentando, y de ningún otro sitio.
 */
export function perfilesDe(slides: readonly DeckSlide[]): WorkProfileEntry[] {
  return slides.filter((slide) => slide.kind === "producto").map((slide) => slide.perfil);
}

/**
 * Los productos que un deck presenta, en prosa y en su orden: «A, B, C y D».
 *
 * ⚠️ Lo arma `Intl.ListFormat` y no una plantilla escrita a mano: la conjunción
 * y las comas de una lista en español dependen de cuántos elementos haya, y una
 * plantilla con «, » y « y » cosidos deja de ser gramatical con uno solo. Los
 * nombres salen de `work.ts`; aquí no se escribe ninguno.
 *
 * Sirve para las descripciones de las rutas del deck dirigido, que es donde la
 * tarjeta del enlace tiene que decir QUÉ trae esa presentación sin afirmar nada
 * nuevo sobre INPLUX. Y de paso es una puerta: si mañana entra un producto que
 * no pertenece a esa sala, su nombre aparece en la descripción publicada y
 * `scripts/verify-build-output.mjs` —que la compara contra su espejo de
 * `work.ts`— lo canta en el HTML construido.
 */
export function nombresEnProsa(slides: readonly DeckSlide[]): string {
  return new Intl.ListFormat("es-CO", { style: "long", type: "conjunction" }).format(
    perfilesDe(slides).map((perfil) => perfil.name),
  );
}

export const SLIDES: readonly DeckSlide[] = construirDeck();
export const TOTAL_SLIDES = SLIDES.length;

/**
 * ⚠️ **Los cuatro productos del deck dirigido, y por qué son cuatro.**
 * Decisión del dueño del 11-ago-2026: Tribai (tributación), Gobia (gestión
 * pública), Kelsen (derecho) y Laudos (arbitraje) son el terreno de quien va a
 * estar en esa sala —ministros, directores, líderes del sector público—; Porkia
 * es una app de porcicultura y ahí no ayuda. La lista es una SELECCIÓN, no un
 * conteo: se escribe entera, no se deriva, y no hay ningún «cuatro» escrito
 * en ninguna parte que pueda quedarse atrás si mañana cambia.
 *
 * ⚠️ No se deriva de `category` ni de `interface.theme` a propósito: ninguno de
 * los dos campos dice qué es legaltech y qué no, así que derivarlo sería
 * inventar una clasificación y ponerla en boca de `work.ts`. Lo que sujeta esta
 * lista es `scripts/verify-deck-model.test.mjs` y, en el HTML construido,
 * `scripts/verify-build-output.mjs`.
 */
export const PERFILES_LEGALTECH = [
  "tribai",
  "gobia",
  "kelsen",
  "laudos",
] as const satisfies readonly WorkSlug[];

/**
 * ⚠️ **`puente` no entra en el deck dirigido, y es una decisión de contenido.**
 * La lámina pregunta «¿Ustedes son de un sector?» y responde «Dominios que no
 * se parecen. La misma fábrica.»: el argumento es que la fábrica NO es de un
 * sector. Con los cuatro perfiles de arriba —tributación, gestión pública,
 * derecho y arbitraje— la frase deja de ser cierta, y delante de un ministro
 * juega además en contra: a él le interesa lo contrario, que conocemos su
 * terreno.
 *
 * Se quita en vez de reescribirse porque el copy alternativo —«el mismo
 * terreno», «cuatro frentes de lo público»— sería una afirmación NUEVA sobre
 * INPLUX que no está en `deck.copy.ts`, `work.ts` ni `home.ts`, y esas las
 * firma el dueño. Quitar la lámina es la salida más conservadora que sigue
 * siendo cierta: el deck no dice nada que no pueda sostener. Si el dueño firma
 * un copy propio para la variante, `puente` vuelve —el mecanismo ya está: se
 * saca de `SIN_PUENTE` y la lámina lee su copy—.
 */
const SIN_PUENTE = ["puente"] as const;

export const SLIDES_LEGALTECH: readonly DeckSlide[] = construirDeck(
  PERFILES_LEGALTECH,
  SIN_PUENTE,
);

export function getSlideById(id: string): DeckSlide | undefined {
  return SLIDES.find((slide) => slide.id === id);
}

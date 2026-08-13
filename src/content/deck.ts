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

// ⚠️ Aquí vivía `como-empezamos` —«¿Y con lo mío?»—, y se quitó por lo que
// decía, no por lo que ocupaba: publicaba los cuatro tiempos de `method`
// PALABRA POR PALABRA, los mismos que la lámina 4. Dos láminas con el mismo
// texto en la misma presentación es algo que un cliente ve en la sala, y lo
// que la segunda añadía —«con tu reto»— lo dice el titular de la de método sin
// gastar una lámina. El presupuesto que liberó se lo lleva la figura del
// método, que es donde ese argumento se demuestra en vez de repetirse.
const CIERRE = [
  { id: "capacidades", kind: "capacidades", titulo: "La fábrica por dentro" },
  { id: "cierre", kind: "cierre", titulo: "Cuéntanos el problema" },
] as const;

/**
 * Arma el deck. Sin argumento, con todos los perfiles de `work.ts`, que es el
 * deck que se presenta por omisión.
 *
 * `soloPerfiles` recorta la serie de producto a un subconjunto —el deck de solo
 * legaltech, por ejemplo— **conservando el orden de `workProfiles`**: el orden
 * lo manda la fuente, no el orden en que se escriban los slugs aquí. Y la
 * numeración se recalcula sobre lo que queda, así que un deck recortado sigue
 * yendo de 1 a N sin huecos y la barra de progreso no promete láminas que no
 * existen.
 *
 * Es un parámetro y no un segundo modelo a propósito: un `construirLegaltech()`
 * paralelo sería una segunda copia del orden, del reparto de apertura y cierre
 * y de la numeración, y las dos se separarían en la primera lámina que se
 * añadiera a una sola de ellas.
 *
 * ⚠️ Un slug que no exista es un error, no un perfil que se salta en silencio.
 * Filtrar callando deja pasar una errata como un deck sin productos: el deck
 * entero se queda en su apertura y su cierre, la numeración sigue sin huecos,
 * la prueba pasa y nadie se entera hasta la sala.
 */
export function construirDeck(soloPerfiles?: readonly WorkSlug[]): DeckSlide[] {
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

  const slides: DeckSlide[] = [];
  let n = 0;

  for (const entrada of APERTURA) {
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
    n += 1;
    slides.push({ n, id: entrada.id, kind: entrada.kind, titulo: entrada.titulo });
  }

  return slides;
}

export const SLIDES: readonly DeckSlide[] = construirDeck();
export const TOTAL_SLIDES = SLIDES.length;

export function getSlideById(id: string): DeckSlide | undefined {
  return SLIDES.find((slide) => slide.id === id);
}

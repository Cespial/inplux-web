import { workProfiles } from "./work";
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
  { id: "evidencia", kind: "evidencia", titulo: "Trece cosas que este sitio no puede decir" },
  { id: "puente", kind: "puente", titulo: "Dominios que no se parecen, la misma fábrica" },
] as const;

const CIERRE = [
  { id: "capacidades", kind: "capacidades", titulo: "La fábrica por dentro" },
  { id: "como-empezamos", kind: "como-empezamos", titulo: "Los cuatro tiempos, con tu reto" },
  { id: "cierre", kind: "cierre", titulo: "Cuéntanos el problema" },
] as const;

function construir(): DeckSlide[] {
  const slides: DeckSlide[] = [];
  let n = 0;

  for (const entrada of APERTURA) {
    n += 1;
    slides.push({ n, id: entrada.id, kind: entrada.kind, titulo: entrada.titulo });
  }

  // El orden de los productos es el de work.ts. Una sola fuente para el
  // orden: reordenar allí mueve el deck y /trabajo a la vez.
  for (const perfil of workProfiles) {
    n += 1;
    slides.push({ n, id: perfil.slug, kind: "producto", titulo: perfil.name, perfil });
  }

  for (const entrada of CIERRE) {
    n += 1;
    slides.push({ n, id: entrada.id, kind: entrada.kind, titulo: entrada.titulo });
  }

  return slides;
}

export const SLIDES: readonly DeckSlide[] = construir();
export const TOTAL_SLIDES = SLIDES.length;

export function getSlideById(id: string): DeckSlide | undefined {
  return SLIDES.find((slide) => slide.id === id);
}

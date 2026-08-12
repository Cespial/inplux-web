import type { DeckSlide } from "@/content/deck";
import { Slide } from "./Slide";
import styles from "./deck.module.css";

export function SlideRenderer({
  slide,
}: {
  slide: DeckSlide;
  // Los motivos bajan desde la ruta y los consume la lámina de evidencia en
  // la Tarea 12. Se declaran aquí —sin desestructurar— para que el riel ya
  // los pase y esa tarea solo tenga que leerlos.
  motivos: readonly string[];
}) {
  // Sin `default` a propósito: TypeScript comprueba que están cubiertos
  // todos los kind, y añadir uno sin su rama rompe el build en vez de
  // pintar un hueco en producción.
  switch (slide.kind) {
    // La portada es la única lámina que titula con <h1>: es la que el riel
    // monta en el servidor, y `check:output` exige exactamente un <h1> por
    // página. Las demás láminas titulan con <h2>.
    case "portada":
      return (
        <Slide id={slide.id} titulo={slide.titulo}>
          <h1 className={styles.titulo}>{slide.titulo}</h1>
        </Slide>
      );
    case "problema":
    case "tesis":
    case "metodo":
    case "espejo":
    case "evidencia":
    case "puente":
    case "capacidades":
    case "como-empezamos":
    case "cierre":
      return (
        <Slide id={slide.id} titulo={slide.titulo}>
          <h2 className={styles.titulo}>{slide.titulo}</h2>
        </Slide>
      );
    case "producto":
      return (
        <Slide id={slide.id} titulo={slide.titulo}>
          <h2 className={styles.titulo}>{slide.perfil.name}</h2>
        </Slide>
      );
  }
}

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
  // Cada lámina titula con <h1>, no solo la portada. En el riel hay una sola
  // lámina viva a la vez, así que el documento tiene siempre exactamente un
  // <h1> y nombra lo que de verdad se está viendo; la saliente queda fuera
  // del árbol de accesibilidad por `aria-hidden` + `inert`. El HTML que se
  // construye trae uno solo porque el servidor solo monta la portada, que es
  // lo que mide `check:output`.
  //
  // Sin `default` a propósito: TypeScript comprueba que están cubiertos
  // todos los kind, y añadir uno sin su rama rompe el build en vez de
  // pintar un hueco en producción.
  switch (slide.kind) {
    case "portada":
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
        <Slide id={slide.id}>
          <h1 className={styles.titulo}>{slide.titulo}</h1>
        </Slide>
      );
    case "producto":
      return (
        <Slide id={slide.id}>
          <h1 className={styles.titulo}>{slide.perfil.name}</h1>
        </Slide>
      );
  }
}

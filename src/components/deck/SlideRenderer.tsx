import type { DeckSlide } from "@/content/deck";
import { MetodoSlide } from "./slides/MetodoSlide";
import { PortadaSlide } from "./slides/PortadaSlide";
import { ProblemaSlide } from "./slides/ProblemaSlide";
import { TesisSlide } from "./slides/TesisSlide";
import { Slide } from "./Slide";
import styles from "./deck.module.css";

export function SlideRenderer({
  slide,
}: {
  slide: DeckSlide;
  // Los motivos bajan desde la ruta y los consume la lámina de evidencia. Se
  // declaran aquí —sin desestructurar— para que el riel ya los pase.
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
    // Las láminas con cuerpo propio. El resto sigue en el grupo genérico
    // —solo su título— hasta que su tarea les toque; el `switch` sin `default`
    // garantiza que ninguna se quede sin rama.
    //
    // Ni `titulo` ni `perfil` bajan a estas: su texto sale de DECK_COPY, que es
    // más largo y más preciso que el título del modelo (el del modelo es el que
    // rotula la barra superior y el índice, y ahí tiene que caber en una
    // línea). Pasarles el título sería una prop que no usan.
    case "portada":
      return <PortadaSlide id={slide.id} />;
    case "problema":
      return <ProblemaSlide id={slide.id} />;
    case "tesis":
      return <TesisSlide id={slide.id} />;
    case "metodo":
      return <MetodoSlide id={slide.id} />;
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

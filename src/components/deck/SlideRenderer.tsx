import type { DeckSlide } from "@/content/deck";
import { EspejoSlide } from "./slides/EspejoSlide";
import { EvidenciaSlide } from "./slides/EvidenciaSlide";
import { MetodoSlide } from "./slides/MetodoSlide";
import { PortadaSlide } from "./slides/PortadaSlide";
import { ProblemaSlide } from "./slides/ProblemaSlide";
import { TesisSlide } from "./slides/TesisSlide";
import { Slide } from "./Slide";
import styles from "./deck.module.css";

export function SlideRenderer({
  slide,
  // Los motivos bajan desde la ruta —el único sitio donde se puede leer del
  // disco— y los consume la lámina de evidencia, que no puede escribirlos
  // como literales sin romper el build en su propia lista.
  motivos,
}: {
  slide: DeckSlide;
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
      return <EspejoSlide id={slide.id} />;
    // La única lámina que recibe algo más que su id, y por una razón concreta:
    // su contenido no existe en el código fuente. Se lee del verificador en
    // build, arriba del límite de cliente, y baja hasta aquí.
    case "evidencia":
      return <EvidenciaSlide id={slide.id} motivos={motivos} />;
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

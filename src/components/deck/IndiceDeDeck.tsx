import Link from "next/link";
import type { DeckSlide } from "@/content/deck";

/**
 * El índice de un deck: el enlace a su presentación y sus láminas en orden.
 *
 * Es lo único que queda cuando no hay JavaScript, y lo que se enseña cuando lo
 * que se quiere es ver de qué va el deck sin recorrerlo. Vive aquí, y no
 * copiado en cada ruta, porque hay más de un deck: la ruta pone la metadata
 * —que es suya— y esto pone el cuerpo.
 *
 * ⚠️ Cada índice enlaza a SU presentación (`hrefPresentacion`). Con la ruta
 * escrita dentro, el índice del deck dirigido mandaba a la presentación del
 * general y los fragmentos apuntaban a láminas de otro deck.
 */
export function IndiceDeDeck({
  slides,
  hrefPresentacion,
}: {
  slides: readonly DeckSlide[];
  hrefPresentacion: string;
}) {
  return (
    <main id="main-content" tabIndex={-1}>
      <h1>De un problema real a software en producción</h1>
      <Link href={hrefPresentacion}>Ver la presentación</Link>
      <ol>
        {slides.map((slide) => (
          <li key={slide.id}>
            <Link href={`${hrefPresentacion}#${slide.id}`}>{slide.titulo}</Link>
          </li>
        ))}
      </ol>
    </main>
  );
}

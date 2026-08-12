import type { DeckSlide } from "@/content/deck";
import styles from "./chrome.module.css";

/**
 * Reexporte por comodidad, igual que `ALTO_BARRA_SUPERIOR` en `TopBar.tsx`. La
 * constante vive en `./altos.ts`, que no importa CSS y por eso sí se puede
 * cargar desde `tsx --eval`.
 */
export { ALTO_BARRA_INFERIOR } from "./altos";

export function ProgressRail({
  slides,
  indice,
  ir,
  anterior,
  siguiente,
}: {
  slides: readonly DeckSlide[];
  indice: number;
  ir: (n: number) => void;
  anterior: () => void;
  siguiente: () => void;
}) {
  return (
    <nav className={styles.barraInferior} data-deck-chrome="inferior" aria-label="Láminas">
      <button
        className={styles.paso}
        type="button"
        onClick={anterior}
        disabled={indice === 0}
        aria-label="Lámina anterior"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <ol className={styles.hilo}>
        {slides.map((slide, n) => (
          <li className={styles.tramo} key={slide.id}>
            {/* El botón ocupa la banda entera; el hilo lo dibuja su ::after.
                `data-estado` reparte los tres colores: pendiente, visto y
                actual. */}
            <button
              className={styles.segmento}
              type="button"
              data-estado={n === indice ? "actual" : n < indice ? "visto" : "pendiente"}
              aria-current={n === indice ? "true" : undefined}
              aria-label={`Ir a ${slide.titulo}`}
              onClick={() => ir(n)}
            />
          </li>
        ))}
      </ol>

      <button
        className={styles.paso}
        type="button"
        onClick={siguiente}
        disabled={indice === slides.length - 1}
        aria-label="Lámina siguiente"
      >
        <span aria-hidden="true">›</span>
      </button>
    </nav>
  );
}

"use client";

import {
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { SLIDES, TOTAL_SLIDES } from "@/content/deck";
import styles from "./chrome.module.css";

/**
 * El índice de las láminas del modelo. `<dialog>` nativo con `showModal()`, el
 * mismo patrón de `src/components/site/ContactDialog.tsx`.
 *
 * ⚠️ Se monta solo cuando se pide, no siempre. `verify-build-output.mjs` exige
 * **cero** `<dialog>` en el HTML construido de /deck/presentacion; un diálogo
 * montado desde el primer render —aunque saliera cerrado— rompe `check:output`.
 * Por eso `showModal()` vive en el efecto de montaje y no en un manejador.
 */
export function IndexOverlay({
  indice,
  ir,
  alCerrar,
}: {
  indice: number;
  ir: (n: number) => void;
  alCerrar: () => void;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const nacioEnElFondo = useRef(false);

  useEffect(() => {
    const elemento = dialogo.current;
    if (elemento === null || elemento.open) return;
    elemento.showModal();
    // `showModal` deja el foco en el primer elemento enfocable —el botón de
    // cerrar—; se lleva al encabezado para que el lector anuncie de qué es el
    // diálogo antes que cómo se sale de él.
    titulo.current?.focus();
  }, []);

  const cerrar = () => dialogo.current?.close();

  // Pulsar el fondo cierra. La comprobación va en dos tiempos, como en
  // ContactDialog: un arrastre que empieza dentro del panel y termina fuera no
  // debe cerrar. El clic en el fondo llega con `target` = el propio <dialog>,
  // así que hay que mirar además las coordenadas.
  const fueraDelPanel = (
    evento: ReactMouseEvent<HTMLDialogElement> | ReactPointerEvent<HTMLDialogElement>,
  ) => {
    const caja = evento.currentTarget.getBoundingClientRect();
    return (
      evento.clientX < caja.left ||
      evento.clientX > caja.right ||
      evento.clientY < caja.top ||
      evento.clientY > caja.bottom
    );
  };

  return (
    <dialog
      className={styles.dialogo}
      ref={dialogo}
      aria-labelledby="deck-indice-titulo"
      onClose={alCerrar}
      onPointerDown={(evento) => {
        nacioEnElFondo.current = evento.target === evento.currentTarget && fueraDelPanel(evento);
      }}
      onClick={(evento) => {
        const cierra =
          nacioEnElFondo.current &&
          evento.target === evento.currentTarget &&
          fueraDelPanel(evento);
        nacioEnElFondo.current = false;
        if (cierra) cerrar();
      }}
    >
      <div className={styles.panel}>
        <div className={styles.cabecera}>
          <h2 className={styles.panelTitulo} id="deck-indice-titulo" ref={titulo} tabIndex={-1}>
            Las {TOTAL_SLIDES} láminas
          </h2>
          <button className={styles.cerrar} type="button" onClick={cerrar}>
            Cerrar
            <kbd className={styles.tecla} aria-hidden="true">
              esc
            </kbd>
          </button>
        </div>

        <div className={styles.cuerpo}>
          <ol className={styles.listaIndice}>
            {SLIDES.map((slide, n) => (
              <li key={slide.id}>
                {/* Se navega y se cierra por `close()`, no desmontando: así el
                    navegador devuelve el foco a quien abrió el índice cuando
                    el destino ya era la lámina visible, y lo pisa el efecto de
                    foco del riel cuando sí hubo cambio de lámina. */}
                <button
                  className={styles.itemIndice}
                  type="button"
                  data-actual={n === indice ? "si" : undefined}
                  aria-current={n === indice ? "true" : undefined}
                  onClick={() => {
                    ir(n);
                    cerrar();
                  }}
                >
                  <span className={styles.itemNumero}>{String(n + 1).padStart(2, "0")}</span>
                  <span>{slide.titulo}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </dialog>
  );
}

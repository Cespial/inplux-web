"use client";

import {
  Fragment,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import styles from "./chrome.module.css";

/** Los atajos, tal como los atiende `useDeckNav`. Si allí cambia una tecla, la
 *  lista queda mintiendo: es el único sitio donde se escriben para leerlas. */
const ATAJOS = [
  { teclas: ["→", "Av Pág", "espacio"], que: "Lámina siguiente" },
  { teclas: ["←", "Re Pág", "Mayús + espacio"], que: "Lámina anterior" },
  { teclas: ["Inicio"], que: "Primera lámina" },
  { teclas: ["Fin"], que: "Última lámina" },
  { teclas: ["i"], que: "Índice de las láminas" },
  { teclas: ["?"], que: "Esta ayuda" },
  { teclas: ["Esc"], que: "Cerrar lo que esté abierto" },
] as const;

/**
 * La lista de atajos. Mismo patrón que `IndexOverlay`: `<dialog>` nativo,
 * montado solo cuando se pide para que el HTML construido siga sin `<dialog>`.
 */
export function HelpOverlay({ alCerrar }: { alCerrar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const nacioEnElFondo = useRef(false);

  useEffect(() => {
    const elemento = dialogo.current;
    if (elemento === null || elemento.open) return;
    elemento.showModal();
    titulo.current?.focus();
  }, []);

  const cerrar = () => dialogo.current?.close();

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
      aria-labelledby="deck-ayuda-titulo"
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
          <h2 className={styles.panelTitulo} id="deck-ayuda-titulo" ref={titulo} tabIndex={-1}>
            Atajos de teclado
          </h2>
          <button className={styles.cerrar} type="button" onClick={cerrar}>
            Cerrar
            <kbd className={styles.tecla} aria-hidden="true">
              esc
            </kbd>
          </button>
        </div>

        <div className={styles.cuerpo}>
          <dl className={styles.listaAtajos}>
            {ATAJOS.map((atajo) => (
              // Fragment y no <div>: la retícula de dos columnas es del <dl> y
              // un envoltorio la partiría.
              <Fragment key={atajo.que}>
                <dt className={styles.atajoTeclas}>
                  {atajo.teclas.map((tecla) => (
                    <kbd className={styles.tecla} key={tecla}>
                      {tecla}
                    </kbd>
                  ))}
                </dt>
                <dd className={styles.atajoQue}>{atajo.que}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      </div>
    </dialog>
  );
}

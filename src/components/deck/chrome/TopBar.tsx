import styles from "./chrome.module.css";

/**
 * Alto de la barra superior, en píxeles.
 *
 * ⚠️ Fuente única. `PresentationDeck` la inyecta como `--deck-barra-superior`
 * y con esa variable —no con un `70px` escrito otra vez— reserva su espacio la
 * lámina en `deck.module.css`. El arnés de QA importa esta constante para
 * comprobar que ninguna caja de lámina se mete debajo de la barra: cambiarla
 * aquí mueve el CSS y la comprobación a la vez.
 */
export const ALTO_BARRA_SUPERIOR = 70;

export function TopBar({
  titulo,
  indice,
  total,
  alPedirIndice,
  alPedirAyuda,
}: {
  titulo: string;
  indice: number;
  total: number;
  alPedirIndice: () => void;
  alPedirAyuda: () => void;
}) {
  return (
    <div className={styles.barraSuperior} data-deck-chrome="superior">
      <p className={styles.marca}>INPLUX</p>

      {/* El título de la lámina, no un encabezado: el <h1> del documento es el
          de la lámina visible y aquí no puede haber un segundo. */}
      <p className={styles.tituloLamina}>{titulo}</p>

      <div className={styles.acciones}>
        <p className={styles.contador}>
          <span className={styles.contadorNumero}>{indice + 1}</span> / {total}
        </p>

        {/* Las pistas de tecla van `aria-hidden`: el nombre accesible del botón
            es «Índice», no «Índice i». La ayuda publica los atajos completos. */}
        <button
          className={styles.accion}
          type="button"
          aria-haspopup="dialog"
          onClick={alPedirIndice}
        >
          Índice
          <kbd className={styles.tecla} aria-hidden="true">
            i
          </kbd>
        </button>

        <button
          className={styles.accion}
          type="button"
          aria-haspopup="dialog"
          onClick={alPedirAyuda}
        >
          Atajos
          <kbd className={styles.tecla} aria-hidden="true">
            ?
          </kbd>
        </button>
      </div>
    </div>
  );
}

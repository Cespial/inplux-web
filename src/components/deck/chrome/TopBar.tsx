import styles from "./chrome.module.css";

/**
 * Reexporte por comodidad. La constante **vive en `./altos.ts`**, que no
 * importa CSS: este archivo sí, y `tsx --eval` —con el que el arnés de QA la
 * lee— no sabe cargar un `*.module.css`. Importarla de aquí funciona desde el
 * bundler; desde un script de Node hay que ir a `./altos`.
 */
export { ALTO_BARRA_SUPERIOR } from "./altos";

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

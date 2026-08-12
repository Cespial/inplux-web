import styles from "../deck.module.css";

/**
 * Las dos curvas de la tesis. Salen del MISMO punto —el mismo encargo, el
 * mismo equipo, el mismo presupuesto— y lo único que cambia es por dónde se
 * empezó:
 *
 *   · la de arriba arranca del requisito escrito: sube rápido, porque un
 *     documento se firma en una semana, y se aplana lejos de donde hacía
 *     falta llegar;
 *   · la de abajo arranca del problema entendido: los primeros tramos casi no
 *     se mueven, y luego adelanta a la otra y sigue subiendo.
 *
 * El CRUCE es el argumento de la lámina, así que es lo único que lleva un
 * nodo: hueco, relleno del fondo de la lámina y contorno teal.
 *
 * ⚠️ `viewBox` de relación fija y `max-width` explícito en el envoltorio
 * (`.curvas`), NUNCA `preserveAspectRatio="none"`. Este SVG tiene <circle>:
 * con los ejes escalados por separado, el nodo del cruce se deformaría en
 * óvalo en cuanto la columna cambiara de ancho, y un óvalo no se lee como un
 * nodo.
 *
 * ⚠️ Las dos etiquetas visibles NO salen de `src/content/deck.copy.ts`: hoy
 * ese archivo no tiene texto para las figuras. Son las dos palabras de la
 * propia respuesta de la lámina —«El software empieza en el problema, no en el
 * requisito»— porque una curva sin nombre no dice nada, y sin ellas la figura
 * sería decoración. Queda anotado para que el copy de figuras suba a
 * `deck.copy.ts` cuando ese archivo se pueda tocar; aquí no hay ninguna cifra
 * ni ninguna afirmación nueva.
 */

/** Los dos trazos pasan por este punto, y por eso se cruzan aquí de verdad. */
const CRUCE = { x: 228, y: 116 };

/** Los dos empiezan aquí, en el mismo punto. */
const ORIGEN = { x: 44, y: 246 };

const REQUISITO = `M${ORIGEN.x} ${ORIGEN.y} C 72 186 96 142 140 130 C 172 121 200 118 ${CRUCE.x} ${CRUCE.y} C 268 113 306 110 340 108`;
const PROBLEMA = `M${ORIGEN.x} ${ORIGEN.y} C 92 245 128 232 164 200 C 190 177 208 148 ${CRUCE.x} ${CRUCE.y} C 268 52 302 44 340 40`;

export function CurvasTesis() {
  return (
    <figure className={styles.figura}>
      <svg
        className={styles.curvas}
        viewBox="0 0 560 300"
        role="img"
        aria-labelledby="deck-tesis-curvas-titulo"
        focusable="false"
      >
        <title id="deck-tesis-curvas-titulo">
          Dos curvas que salen del mismo punto. La que empieza por el requisito sube rápido y se
          aplana; la que empieza por el problema arranca más lenta, la cruza y sigue subiendo. Un
          nodo hueco marca el cruce.
        </title>

        {/* El suelo: un hilo, sin escala ni marcas. No hay números que leer
            aquí, y una retícula con ticks prometería una medición que esto no
            es. */}
        <line
          className={styles.curvaBase}
          x1={ORIGEN.x}
          y1={ORIGEN.y}
          x2={344}
          y2={ORIGEN.y}
          vectorEffect="non-scaling-stroke"
        />
        <circle className={styles.curvaOrigen} cx={ORIGEN.x} cy={ORIGEN.y} r={4} />

        <path
          className={`${styles.curvaTrazo} ${styles.curvaRequisito}`}
          d={REQUISITO}
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
        <path
          className={`${styles.curvaTrazo} ${styles.curvaProblema}`}
          d={PROBLEMA}
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />

        {/* ⚠️ Este círculo es el ÚNICO trazo de la figura sin
            `non-scaling-stroke`, y es a propósito: ver la nota de
            `.curvaCruce` en deck.module.css. El aro tiene que guardar una
            proporción con su diámetro, y un trazo que no escala la rompe en
            cuanto cambia el tamaño de la pantalla. */}
        <circle className={styles.curvaCruce} cx={CRUCE.x} cy={CRUCE.y} r={7} />

        {/* Cada etiqueta a la altura exacta del final de su curva: no hace
            falta leyenda ni muestras de color para saber cuál es cuál. */}
        <text
          className={`${styles.curvaEtiqueta} ${styles.curvaEtiquetaRequisito}`}
          x={352}
          y={108}
          dominantBaseline="middle"
        >
          Requisito primero
        </text>
        <text
          className={`${styles.curvaEtiqueta} ${styles.curvaEtiquetaProblema}`}
          x={352}
          y={40}
          dominantBaseline="middle"
        >
          Problema primero
        </text>
      </svg>
    </figure>
  );
}

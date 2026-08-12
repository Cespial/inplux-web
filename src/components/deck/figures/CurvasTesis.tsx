import { DECK_COPY } from "@/content/deck";
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
 * Las dos etiquetas visibles salen de `DECK_COPY.tesis.figura`, pegadas a la
 * respuesta que espejan: son los dos sustantivos de «El software empieza en el
 * problema, no en el requisito», y solo significan algo junto a ella. Aquí
 * quedan el `x`/`y` de cada una, que es geometría, no texto.
 *
 * ⚠️ El `<title>` de abajo sí se queda escrito aquí, y no es un descuido: no
 * es copy, es el nombre accesible del dibujo —el equivalente de un `alt`—.
 * Describe trazos concretos, así que si se mudara lejos del SVG, el día que
 * alguien cambie una curva la descripción mentiría y nadie se enteraría.
 */

const { requisito, problema } = DECK_COPY.tesis.figura;

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

        {/* ⚠️ NINGUNA de las dos curvas lleva `vector-effect:
            non-scaling-stroke`, y quitarlo fue el arreglo de un fallo que llegó
            a estar publicado: las dos se pintaban a medias.

            `non-scaling-stroke` manda calcular el trazo —y con él el patrón de
            `stroke-dasharray`— en espacio de PANTALLA, mientras que la
            normalización de `pathLength={1}` está definida en espacio de
            usuario. Las dos convenciones no se componen: el guion de 1,02 acaba
            cubriendo `1,02 / escala` de la curva, así que a partir de la escala
            1,02 la cola se queda sin pintar y la curva termina mocha. Medido en
            la página, con el trazado ya terminado: 85 % pintado a 1920 px
            (escala 1,20), 96 % a 1470 y 99 % a 1440. En un proyector faltaba el
            último 15 % de las dos, que es justo donde una llega a su etiqueta y
            la otra se aplana.

            Sin el atributo, el guion se mide en las mismas unidades que la
            curva y las dos se pintan enteras a cualquier escala. Es pariente de
            la trampa ya registrada en este proyecto —`pathLength` y la cola del
            trazo sin pintar— y el precio es que el grosor pasa a escalar con el
            dibujo, que es exactamente lo que ya hacía el nodo del cruce. */}
        <path className={`${styles.curvaTrazo} ${styles.curvaRequisito}`} d={REQUISITO} pathLength={1} />
        <path className={`${styles.curvaTrazo} ${styles.curvaProblema}`} d={PROBLEMA} pathLength={1} />

        {/* El aro del cruce guarda una proporción con su diámetro, y por eso su
            trazo escala con el dibujo igual que el de las dos curvas: ver la
            nota de `.curvaCruce` en deck.module.css. El único trazo de la
            figura que sigue sin escalar es la línea base, que es un hilo de
            1 px y no tiene proporción que guardar. */}
        <circle className={styles.curvaCruce} cx={CRUCE.x} cy={CRUCE.y} r={7} />

        {/* Cada etiqueta a la altura exacta del final de su curva: no hace
            falta leyenda ni muestras de color para saber cuál es cuál. */}
        <text
          className={`${styles.curvaEtiqueta} ${styles.curvaEtiquetaRequisito}`}
          x={352}
          y={108}
          dominantBaseline="middle"
        >
          {requisito}
        </text>
        <text
          className={`${styles.curvaEtiqueta} ${styles.curvaEtiquetaProblema}`}
          x={352}
          y={40}
          dominantBaseline="middle"
        >
          {problema}
        </text>
      </svg>
    </figure>
  );
}

import type { CSSProperties } from "react";
import { DECK_COPY } from "@/content/deck";
import styles from "./seis-barras.module.css";

/**
 * Seis proyectos, uno por barra. Cinco se detienen en su marca y la sexta
 * sigue creciendo: lo que se anima es el MECANISMO, no el resultado. El
 * espectador ve por qué el promedio engaña —porque hay una cola que se lo
 * come— en vez de un número que sube porque sí.
 *
 * ⚠️ La figura no lleva eje, ni escala, ni números. La única referencia es la
 * línea vertical del presupuesto, y las seis barras se leen CONTRA ella. Un
 * eje con marcas prometería una medición que esto no es: las proporciones de
 * las cinco primeras son una disposición plausible, no un dato. El único dato
 * de la lámina es la cifra, y sale de `DECK_COPY.problema.cifra`, verificada
 * contra arXiv:1304.0265.
 */

/**
 * El compás de la lámina 2 vive aquí y solo aquí. El contador se engancha con
 * dos multiplicaciones (`T_CIFRA`) para que la cifra llegue a 200 exactamente
 * cuando la sexta barra deja de crecer, y el CSS de la figura recibe estos
 * mismos segundos en variables (`COMPAS`), de modo que en
 * `seis-barras.module.css` no hay escrito ni un número de tiempo.
 *
 * ⚠️ Si algún día un segundo de esta lámina aparece escrito en otro archivo,
 * la cifra y la figura se desincronizan el día que alguien toque uno de los
 * dos y no el otro. Todo sale de aquí.
 */
export const RITMO = {
  inicio: 0.35, // s antes de que entre la primera barra
  total: 2.6, // s de la secuencia completa
  arranqueCrecida: 0.25, // fracción de `total` en que la sexta empieza a desbordarse
  finCrecida: 0.95, // fracción de `total` en que se detiene
  // Lo que tarda cada barra en entrar y lo que separa a una de la siguiente.
  // ⚠️ La cascada entera tiene que caber ANTES de `arranqueCrecida`: la sexta
  // aterriza en inicio + 5·paso + entrada = 0,99 s y la crecida arranca en
  // 1,00 s. Si `entrada` o `paso` crecen, la sexta empezaría a desbordarse
  // mientras todavía está entrando y las dos transformaciones pelearían.
  entrada: 0.34, // s que tarda una barra en entrar
  paso: 0.06, // s entre el arranque de una barra y el de la siguiente
} as const;

/** Tres decimales: los segundos se escriben igual en el CSS y en el contador. */
const redondea = (segundos: number) => Math.round(segundos * 1000) / 1000;

export const T_CIFRA = {
  retraso: redondea(RITMO.inicio + RITMO.arranqueCrecida * RITMO.total),
  duracion: redondea((RITMO.finCrecida - RITMO.arranqueCrecida) * RITMO.total),
} as const;

/**
 * El mismo compás, en variables de CSS. Se pone en el `<svg>` —para que la
 * figura funcione sola— y en el bloque de la cifra desde `ProblemaSlide`, que
 * necesita `--inicio` para aparecer justo antes de que empiece la cascada.
 * Una sola definición, dos sitios donde se aplica.
 */
export const COMPAS = {
  "--inicio": `${RITMO.inicio}s`,
  "--paso": `${RITMO.paso}s`,
  "--dur": `${RITMO.entrada}s`,
  "--retrasoCrecida": `${T_CIFRA.retraso}s`,
  "--durCrecida": `${T_CIFRA.duracion}s`,
} as CSSProperties;

/* ── La geometría ─────────────────────────────────────────────────────────── */

const LIENZO = { ancho: 480, alto: 200 };
/** Donde nacen las seis barras. Todas empiezan en el mismo sitio. */
const X0 = 24;
/** El presupuesto aprobado, en unidades del lienzo. Es la unidad de la figura. */
const PRESUPUESTO = 140;
const ALTO = 14;
const PASO_Y = 28;
const Y0 = 12;

/**
 * Cada barra, en múltiplos del presupuesto. Las cinco primeras aterrizan a
 * caballo de la línea —ni todas por encima ni todas por debajo, porque ninguna
 * de las dos cosas la dice la fuente—; la sexta aterriza EXACTA en el
 * presupuesto y luego lo triplica.
 *
 * ⚠️ Que la sexta valga 1 no es decorativo: el fotograma final del desborde es
 * `scaleX(3)` sobre el presupuesto, o sea 200 % por encima, que es la cifra
 * que canta el contador. Cambiar este 1 desmiente el numeral.
 *
 * Y que aterrice exacta en la línea antes de dispararse es el argumento de la
 * lámina: mientras la cascada corre no hay forma de saber cuál de las seis es.
 */
const PROYECTOS = [0.94, 1.06, 0.88, 1.02, 0.91, 1];

const MARCA_X = X0 + PRESUPUESTO;
const ULTIMA = PROYECTOS.length - 1;
const FONDO_BARRAS = Y0 + ULTIMA * PASO_Y + ALTO;

export function SeisBarras() {
  return (
    <figure className={styles.figura}>
      <svg
        className={styles.lienzo}
        style={COMPAS}
        viewBox={`0 0 ${LIENZO.ancho} ${LIENZO.alto}`}
        role="img"
        aria-labelledby="deck-problema-barras-titulo"
        focusable="false"
      >
        {/* ⚠️ Este <title> NO sube a `deck.copy.ts`. No es copy: es el nombre
            accesible del dibujo, el equivalente de un `alt`. Describe trazos
            concretos, así que tiene que viajar con los trazos — si se mudara
            lejos del SVG, el día que alguien mueva una barra la descripción
            mentiría y nadie se enteraría. */}
        <title id="deck-problema-barras-titulo">
          Seis barras, una por proyecto, y una línea vertical que marca el presupuesto. Cinco se
          detienen junto a la línea; la sexta sigue creciendo hasta triplicarla.
        </title>

        {/* La única referencia de la figura. Discontinua a propósito: una línea
            entera se leería como el eje de una gráfica, y esto no tiene eje. */}
        <line className={styles.marca} x1={MARCA_X} y1={4} x2={MARCA_X} y2={FONDO_BARRAS + 8} />

        {PROYECTOS.map((factor, i) => (
          <rect
            key={`barra-${i}`}
            className={
              i === ULTIMA ? `${styles.barra} ${styles.barraDesbordada}` : styles.barra
            }
            x={X0}
            y={Y0 + i * PASO_Y}
            width={Math.round(PRESUPUESTO * factor)}
            height={ALTO}
            rx={1.5}
            // El instante de cada barra sale de aquí y solo de aquí: duración y
            // retraso base son COMUNES a las seis y lo único que las separa es
            // este índice. Una cascada con duraciones distintas por elemento
            // descoordina el contador.
            style={{ "--i": i } as CSSProperties}
          />
        ))}

        {/* Al pie del lienzo, lo más lejos posible del numeral: un <text> de
            SVG se hit-testea por su caja entera, así que uno pegado a un
            titular le regala un falso positivo al arnés. */}
        <text className={styles.marcaEtiqueta} x={MARCA_X} y={LIENZO.alto - 8} textAnchor="middle">
          {DECK_COPY.problema.figura.presupuesto}
        </text>
      </svg>
    </figure>
  );
}

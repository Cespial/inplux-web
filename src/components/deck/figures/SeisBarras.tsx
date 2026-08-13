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

/**
 * La relación del `viewBox` ES la altura de la figura, y por eso se toca aquí y
 * no en el CSS: el SVG entra a `width: 100%`, así que su alto en pantalla sale
 * de `ancho / alto` y del ancho de su caja, nada más.
 *
 * ⚠️ **960 × 200 (relación 4,8) sustituye a 480 × 168 (2,857), y el número no
 * es cosmético: es lo que permite que la figura ocupe LAS DOS COLUMNAS.** A
 * ancho completo (1.296 px a 1440) una relación de 2,857 daría 454 px de alto
 * y la lámina no cabría en el hueco entre barras; 4,8 da 270 px y sí cabe. En
 * el móvil, donde la lámina se apila y la figura mide 342 px de ancho, la misma
 * relación la baja de 120 px a 71 px, que es holgura en la lámina más ajustada
 * del deck.
 *
 * ⚠️ Lo que NO cambia es el grosor de barra en pantalla, porque lo fija la
 * escala horizontal (`ALTO × ancho/960`): 33,7 px a 1440 (antes 18), 45 px a
 * 1920 (antes 24) y 8,9 px a 390 (antes 10,0). La figura engorda en la sala y
 * se queda igual en el teléfono, que es el reparto que pide el diagnóstico —«a
 * dos metros lo que sobrevive es la masa»—.
 */
const LIENZO = { ancho: 960, alto: 200 };

/**
 * Todas las barras nacen en el borde del lienzo, no adentro: así el dibujo
 * comparte el margen izquierdo con el bloque de texto de la lámina y la lámina
 * tiene una sola vertical de arranque.
 */
const X0 = 0;
/** El presupuesto aprobado, en unidades del lienzo. Es la unidad de la figura. */
const PRESUPUESTO = 300;
const ALTO = 25;
/**
 * ⚠️ `PASO_Y` no puede bajar de `ALTO`: las barras se solaparían. Con estos
 * números las seis ocupan de y=6 a y=191 y quedan 9 unidades hasta el borde del
 * lienzo — que ya NO tienen que alojar la etiqueta del presupuesto, porque esa
 * etiqueta salió del SVG y además se mudó ARRIBA (ver `.marcaEtiqueta`).
 */
const PASO_Y = 32;
const Y0 = 6;

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

/**
 * La geometría que el CSS necesita, publicada como variables para que ningún
 * número viva en dos archivos:
 *
 *   --relacion  el tope de ancho de la figura se calcula como
 *               «alto disponible × relación» (ver el módulo). Si mañana el
 *               viewBox cambia, el tope se recalcula solo.
 *   --marcaX    la posición del rótulo `presupuesto`, en fracción del ancho
 *               del dibujo. Es la MISMA cuenta que sitúa la línea dentro del
 *               SVG, hecha una vez.
 */
const GEOMETRIA = {
  "--relacion": String(LIENZO.ancho / LIENZO.alto),
  "--marcaX": `${(MARCA_X / LIENZO.ancho) * 100}%`,
} as CSSProperties;

export function SeisBarras() {
  return (
    // ⚠️ **`COMPAS` va en el `<figure>`, no solo en el `<svg>`.** El rótulo del
    // presupuesto es hermano del SVG, y su `animation: aparece var(--dur) …`
    // necesita `--dur`. Puesto solo en el `<svg>`, en el `<span>` la `var()` no
    // resuelve, la declaración queda inválida en tiempo de valor computado y
    // colapsa entera a `animation-name: none`: el rótulo aparecería a opacidad
    // 1 en el fotograma cero, mientras la línea que rotula todavía está
    // entrando, y su línea del bloque de movimiento reducido no gobernaría
    // nada. En el `<figure>` lo heredan los dos.
    <figure className={styles.figura} style={{ ...GEOMETRIA, ...COMPAS }}>
      {/* ⚠️ **El rótulo va ENCIMA de las barras, y esto se decidió mirando la
          captura ampliada, no una medida.** Debajo, la marca discontinua llega
          hasta la unidad 191 y la sexta barra —teal, maciza, el objeto más
          contrastado de la lámina— la cruza y la tapa: lo único que ataba la
          palabra a su línea era un trozo de 6 unidades por debajo de la barra, y
          a 20 % de reducción ese trozo desaparece y `presupuesto` queda leyéndose
          como el pie de la barra que se desborda. La lámina acabaría rotulando
          el sobrecosto como si fuera el presupuesto, que es lo contrario de lo
          que dice. Arriba, la línea nace limpia y no hay nada entre la palabra y
          su marca.

          Y es HTML, fuera del SVG, por dos razones más:
          (a) Tamaño: dentro del lienzo el cuerpo se escala con el dibujo, y con
          960 unidades de ancho caía a 5,5 px en el móvil. Aquí es un `clamp` en
          rem —10,6 a 12,5 px— y obedece la preferencia de fuente del lector, que
          un <text> de SVG no obedece.
          (b) Arnés: un <text> de SVG se mide por su caja entera —límite
          declarado nº 5—, así que sacarlo quita de esta lámina la única fuente
          posible de falso positivo por texto.
          Va `aria-hidden` porque la palabra ya está dicha, con su contexto,
          dentro del <title> del dibujo: suelta en el orden de lectura sería un
          «presupuesto» sin oración. */}
      <span className={styles.marcaEtiqueta} aria-hidden="true">
        {DECK_COPY.problema.figura.presupuesto}
      </span>

      <svg
        className={styles.lienzo}
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
        <line className={styles.marca} x1={MARCA_X} y1={0} x2={MARCA_X} y2={FONDO_BARRAS + 6} />

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
            rx={2}
            // El instante de cada barra sale de aquí y solo de aquí: duración y
            // retraso base son COMUNES a las seis y lo único que las separa es
            // este índice. Una cascada con duraciones distintas por elemento
            // descoordina el contador.
            style={{ "--i": i } as CSSProperties}
          />
        ))}
      </svg>
    </figure>
  );
}

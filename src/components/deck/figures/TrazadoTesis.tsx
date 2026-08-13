import type { CSSProperties } from "react";
import { DECK_COPY } from "@/content/deck";
import styles from "./trazado-tesis.module.css";

/**
 * Las dos curvas de la tesis, a la anchura de la lámina.
 *
 * Salen del MISMO punto —el mismo encargo, el mismo equipo, el mismo
 * presupuesto— y lo único que cambia es por dónde se empezó:
 *
 *   · la del requisito escrito sube rápido, porque un documento se firma en
 *     una semana, y se aplana lejos de donde hacía falta llegar;
 *   · la del problema entendido casi no se mueve al principio, y luego
 *     adelanta a la otra y sigue subiendo.
 *
 * El CRUCE es el argumento de la lámina, así que es lo único que lleva nodo:
 * hueco, relleno del papel de la lámina y contorno teal.
 *
 * Lo que sustituye: la misma pareja de curvas encajada en media columna, con
 * un tope de 42 rem. Media columna daba 615 px de dibujo y dejaba la lámina en
 * 0,00 % de tinta en el sexto superior Y en el inferior: todo el contenido
 * encajonado en el tercio central. El dibujo no cambia de argumento; cambia de
 * sitio y gana materia.
 *
 * ⚠️ **Las dos cuñas no son sombreado: son la magnitud.** El hueco entre las
 * curvas ES la distancia entre las dos maneras de empezar, y cambia de signo
 * en el cruce. Por eso hay dos y no una, y por eso la de la izquierda va en
 * gris —ahí va ganando el requisito— y la de la derecha en teal.
 *
 * ⚠️ Y por eso las dos llevan CONTORNO de su propio color, no solo relleno.
 * Es la regla del catálogo, verificada en el fuente: `barras()` de
 * `estilo-s50/assets/figuras.js:111` pinta `fill-opacity="0.18"` **con**
 * `stroke` del mismo color. Aquí compra dos cosas concretas:
 *
 *   1. cierra el canto desnudo. La cuña teal termina a la derecha en un
 *      segmento vertical entre el final de una curva y el final de la otra que
 *      NINGÚN trazo dibuja —149 unidades—, y un relleno con un borde sin
 *      contorno es justo lo que esta gramática no tiene. Contorneada, ese
 *      canto pasa a ser lo que de verdad es: la distancia que queda entre las
 *      dos al final del recorrido;
 *   2. le da al hueco una marca que sobrevive la sala. El relleno solo, a la
 *      opacidad del catálogo, da 1,26:1 contra el papel: cuenta como tinta
 *      para la medida y se evapora a tres metros. El contorno va a color
 *      pleno —4,84:1 y 4,70:1— y es lo que queda cuando la lámina se proyecta.
 *      Una cuña que solo fuera tinte sería materia que mide y no comunica.
 *
 * En los demás bordes el contorno queda DEBAJO de su curva —3,2 unidades
 * contra las 4 del trazo— y no se ve: es la misma línea dibujada dos veces, y
 * eso es lo que se busca.
 *
 * ⚠️ `viewBox` de relación fija y `aspect-ratio` idéntico en la caja, NUNCA
 * `preserveAspectRatio="none"`. Este SVG tiene <circle>: con los ejes
 * escalados por separado, el nodo del cruce se deformaría en óvalo y un óvalo
 * no se lee como un nodo.
 *
 * ⚠️ **NINGUNA de las dos curvas lleva `vector-effect: non-scaling-stroke`, y
 * quitarlo fue el arreglo de un fallo que llegó a estar publicado: las dos se
 * pintaban a medias.** `non-scaling-stroke` manda calcular el trazo —y con él
 * el patrón de `stroke-dasharray`— en espacio de PANTALLA, mientras que la
 * normalización de `pathLength={1}` está definida en espacio de usuario. Las
 * dos convenciones no se componen: el guion de 1,02 acaba cubriendo
 * `1,02 / escala` de la curva, así que a partir de la escala 1,02 la cola se
 * queda sin pintar y la curva termina mocha. Medido en la página, con el
 * trazado ya terminado: 85 % pintado a 1920 px, 96 % a 1470 y 99 % a 1440. En
 * un proyector faltaba el último 15 % de las dos, que es justo donde una llega
 * a su etiqueta y la otra se aplana.
 *
 * ⚠️ **Aquí no hay ni un `<text>` de SVG, y es deliberado.** Los dos rótulos
 * son HTML colocados con las MISMAS constantes del lienzo. Dos motivos, los
 * dos ya escritos en el proyecto:
 *
 *   1. límite declarado nº 5 del arnés: un `<text>` de SVG se hit-testea por
 *      su CAJA entera, no por sus glifos. Comprobado sobre la versión anterior
 *      de esta misma figura: la caja de «Requisito primero» medía 181 × 22 px
 *      y los 60 de 60 puntos de la rejilla devolvían el `<text>`, aire entre
 *      letras incluido. Con cero `<text>`, no hay falso positivo que dar;
 *   2. `.curvaEtiqueta` dejó escrito y medido que un tamaño en unidades de
 *      lienzo no obedece la preferencia de fuente del lector, y que arreglarlo
 *      «exige sacar las dos etiquetas del SVG y maquetarlas en HTML junto a la
 *      figura, que es un rediseño de las dos figuras con su propia medición».
 *      Esto es ese rediseño: los rótulos vuelven a un `clamp()` normal del
 *      deck y desaparece el `calc(19.7px - 0.43 * min(1vw, 16px))`, que
 *      compensaba una escala que no es monótona con el ancho de la ventana.
 *
 * Las dos etiquetas visibles salen de `DECK_COPY.tesis.figura`, pegadas a la
 * respuesta que espejan: son los dos sustantivos de «El software empieza en el
 * problema, no en el requisito», y solo significan algo junto a ella. Aquí
 * quedan sus coordenadas, que son geometría y no texto.
 *
 * ⚠️ El `<title>` de abajo sí se queda escrito aquí, y no es un descuido: no
 * es copy, es el nombre accesible del dibujo —el equivalente de un `alt`—.
 * Describe trazos concretos, así que si se mudara lejos del SVG, el día que
 * alguien cambie una curva la descripción mentiría y nadie se enteraría.
 */

const { requisito, problema } = DECK_COPY.tesis.figura;

/**
 * El lienzo.
 *
 * ⚠️ **La relación la manda el ANCHO y el alto es la variable de ajuste, no al
 * revés.** La caja lleva `aspect-ratio` con estas mismas dos constantes y sin
 * `max-height`: así la relación es EXACTA siempre y los porcentajes de los dos
 * rótulos son de verdad las coordenadas de aquí. Con `max-height` la caja se
 * queda más ancha que su relación, el SVG se centra dentro con bandas a los
 * lados —`meet` no recorta— y cada rótulo se separa del final de su curva por
 * la mitad del sobrante.
 *
 * El precio de no llevar `max-height` es que la figura NO puede encoger sola
 * si el hueco bajo la cabecera es más corto que `ancho / relación`: se
 * desbordaría contra el riel. Por eso el alto está elegido contra el hueco
 * MEDIDO en las tres ventanas del arnés, y por eso el modo de fallo es
 * ruidoso: si alguien alarga la cabecera, el arnés canta «CHOCA CON LAS
 * BARRAS» en vez de dejar una lámina rota en silencio.
 */
const LIENZO = { ancho: 1600, alto: 430 };

/** Los dos trazos pasan por este punto, y por eso se cruzan aquí de verdad. */
const CRUCE = { x: 900, y: 224 };
/** Los dos empiezan aquí, en el mismo punto. */
const ORIGEN = { x: 150, y: 388 };
/** Donde muere cada curva, y donde empieza su rótulo. */
const FIN = { x: 1230, requisito: 216, problema: 102 };

const REQUISITO =
  `M${ORIGEN.x} ${ORIGEN.y} C 260 307 360 253 500 235 C 620 220 780 226 ${CRUCE.x} ${CRUCE.y}` +
  ` C 1010 222 1130 219 ${FIN.x} ${FIN.requisito}`;
const PROBLEMA =
  `M${ORIGEN.x} ${ORIGEN.y} C 320 385 430 369 540 335 C 670 295 790 261 ${CRUCE.x} ${CRUCE.y}` +
  ` C 1000 191 1130 146 ${FIN.x} ${FIN.problema}`;

/* Las dos cuñas cierran el hueco entre las curvas. La segunda mitad de cada
   una es la otra curva RECORRIDA AL REVÉS —los puntos de control van
   invertidos—, así que el borde de la cuña y el trazo son la misma línea y no
   pueden separarse por un redondeo. */
const CUNA_REQUISITO =
  `M${ORIGEN.x} ${ORIGEN.y} C 260 307 360 253 500 235 C 620 220 780 226 ${CRUCE.x} ${CRUCE.y}` +
  ` C 790 261 670 295 540 335 C 430 369 320 385 ${ORIGEN.x} ${ORIGEN.y} Z`;
const CUNA_PROBLEMA =
  `M${CRUCE.x} ${CRUCE.y} C 1000 191 1130 146 ${FIN.x} ${FIN.problema}` +
  ` L${FIN.x} ${FIN.requisito} C 1130 219 1010 222 ${CRUCE.x} ${CRUCE.y} Z`;

/**
 * El rótulo se ancla al final de su curva. Porcentajes del lienzo, calculados
 * aquí y no escritos a mano: mover `FIN` mueve la curva y el rótulo a la vez.
 */
const rotulo = (y: number) => ({
  left: `${((FIN.x + 26) / LIENZO.ancho) * 100}%`,
  top: `${(y / LIENZO.alto) * 100}%`,
});

/**
 * La relación baja al CSS desde las mismas constantes que dibujan las curvas.
 * Escribirla a mano en el módulo sería el sitio exacto donde las dos se
 * separarían el día que alguien cambie el lienzo.
 */
const CAJA = { "--relacion": `${LIENZO.ancho} / ${LIENZO.alto}` } as CSSProperties;

export function TrazadoTesis() {
  return (
    // ⚠️ `data-deck-llena` es el contrato con `.lamina` para que esta lámina
    // REPARTA el alto en vez de centrarlo: la cabecera ocupa lo que pide y la
    // figura se queda con el resto. Atributo global y no una clase porque la
    // regla vive en `deck.module.css` y las clases de un módulo van cifradas.
    // Es el mismo mecanismo que usa la fábrica de la lámina de capacidades.
    <figure className={styles.figura} data-deck-llena>
      <div className={styles.caja} style={CAJA}>
        <svg
          className={styles.lienzo}
          viewBox={`0 0 ${LIENZO.ancho} ${LIENZO.alto}`}
          role="img"
          aria-labelledby="deck-tesis-trazado-titulo"
          focusable="false"
        >
          <title id="deck-tesis-trazado-titulo">
            Dos curvas que salen del mismo punto sobre una línea de suelo. La que empieza por el
            requisito sube rápido y se aplana; la que empieza por el problema arranca más lenta, la
            cruza y sigue subiendo. El hueco entre las dos está sombreado a un lado y a otro del
            cruce, y un nodo hueco marca el cruce.
          </title>

          {/* Masa primero: las cuñas van debajo de todo trazo. */}
          <path className={`${styles.cuna} ${styles.cunaRequisito}`} d={CUNA_REQUISITO} />
          <path className={`${styles.cuna} ${styles.cunaProblema}`} d={CUNA_PROBLEMA} />

          {/* El suelo: un hilo, sin escala ni marcas. No hay números que leer
              aquí, y una retícula con ticks prometería una medición que esto
              no es. */}
          <line
            className={styles.suelo}
            x1={90}
            y1={ORIGEN.y}
            x2={LIENZO.ancho - 90}
            y2={ORIGEN.y}
            vectorEffect="non-scaling-stroke"
          />
          <circle className={styles.origen} cx={ORIGEN.x} cy={ORIGEN.y} r={5} />

          <path className={`${styles.trazo} ${styles.trazoRequisito}`} d={REQUISITO} pathLength={1} />
          <path className={`${styles.trazo} ${styles.trazoProblema}`} d={PROBLEMA} pathLength={1} />

          <circle className={styles.cruce} cx={CRUCE.x} cy={CRUCE.y} r={17} />
        </svg>

        {/* Los rótulos, en HTML y no en <text>. Cada uno a la altura exacta del
            final de su curva: no hace falta leyenda ni muestras de color para
            saber cuál es cuál. */}
        <p className={`${styles.rotulo} ${styles.rotuloRequisito}`} style={rotulo(FIN.requisito)}>
          {requisito}
        </p>
        <p className={`${styles.rotulo} ${styles.rotuloProblema}`} style={rotulo(FIN.problema)}>
          {problema}
        </p>
      </div>
    </figure>
  );
}

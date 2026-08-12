import styles from "../deck.module.css";

/**
 * La retícula de fondo de la portada: un solo hilo, y cuatro nodos sobre la
 * diagonal que marcan los cuatro tiempos del método sin nombrarlos.
 *
 * ⚠️ `preserveAspectRatio="… slice"`, NUNCA `none`. Aquí hay <circle>: con
 * `none` el navegador estira los ejes por separado y los nodos se deforman en
 * óvalos en cuanto la lámina deja de tener la proporción del viewBox. Con
 * `slice` la escala es la misma en los dos ejes —los círculos siguen siendo
 * círculos— y lo que sobra se recorta, que es justo lo que se espera de un
 * fondo a sangre.
 *
 * ⚠️ Y el anclaje es `xMaxYMin`, no `xMidYMid`, por una razón que solo se ve
 * en una captura: con el recorte centrado, dos de los nodos caían ENCIMA del
 * título —uno sobre la «ó» de «producción» en las tres pantallas—, y un punto
 * teal detrás de un glifo no se lee como retícula, se lee como una errata. El
 * arnés no lo ve: la malla es sorda al puntero y no tiene texto que muestrear,
 * así que sus dos vías de detección la ignoran. Esto lo caza la vista.
 *
 * Anclando el lienzo a la ESQUINA SUPERIOR DERECHA, el trozo que sobrevive al
 * recorte es el mismo en las tres pantallas —vertical arriba, apaisado a la
 * derecha— y los cuatro nodos se pueden poner donde el texto no llega nunca:
 * arriba a la derecha en apaisado, arriba en vertical. Verificado en 1440×900,
 * 1920×1080 y 390×844: el nodo más cercano al texto le deja 47 px.
 *
 * Si una tarea posterior ensancha el título o lo sube, esta holgura es lo
 * primero que hay que volver a mirar en la captura.
 */

const LADO = 900;
const PASO = 60;

/** Sin hilo en 0 ni en 900: pegado al filete de la barra superior, un hilo en
 *  el borde se lee como un borde doble. */
const HILOS = Array.from({ length: LADO / PASO - 1 }, (_, i) => (i + 1) * PASO);

/**
 * Los cuatro tiempos, sobre la diagonal y en intersecciones de la retícula: el
 * orden se lee sin una sola palabra, y ninguno pesa más que otro porque
 * ninguno se salta.
 */
const NODOS = [600, 660, 720, 780].map((x) => ({ x, y: 840 - x }));

export function MallaPortada() {
  return (
    <div className={styles.malla} aria-hidden="true">
      <svg
        className={styles.mallaTrazo}
        viewBox={`0 0 ${LADO} ${LADO}`}
        preserveAspectRatio="xMaxYMin slice"
        focusable="false"
      >
        {/* `vector-effect` mantiene el hilo en 1 px de pantalla pase lo que
            pase con la escala: sobre fondo claro el efecto es la precisión, y
            una retícula cuyo trazo engorda con el proyector deja de ser
            precisa y pasa a ser una rejilla. */}
        <g className={styles.mallaHilos} vectorEffect="non-scaling-stroke">
          {HILOS.map((v) => (
            <line key={`v${v}`} x1={v} y1={0} x2={v} y2={LADO} vectorEffect="non-scaling-stroke" />
          ))}
          {HILOS.map((h) => (
            <line key={`h${h}`} x1={0} y1={h} x2={LADO} y2={h} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        {NODOS.map((nodo) => (
          <circle key={nodo.x} className={styles.mallaNodo} cx={nodo.x} cy={nodo.y} r={5} />
        ))}
      </svg>
    </div>
  );
}

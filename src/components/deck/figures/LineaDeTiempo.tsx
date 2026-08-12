import type { CSSProperties } from "react";
import styles from "./linea-de-tiempo.module.css";

/**
 * Un tiempo del método. La forma es exactamente la de `method` en
 * `src/content/home.ts`: el deck no reescribe esos textos, los lee.
 */
export type PasoDeMetodo = {
  number: string;
  title: string;
  copy: string;
};

/**
 * El compás del pulso, y vive aquí y solo aquí.
 *
 * El pulso recorre la vía UNA vez y cada nodo se enciende justo cuando pasa
 * por él: por eso el retraso del nodo `i` no es un número escrito, es
 * `inicio + i · tramo`, y `tramo` sale de dividir el recorrido entre los
 * huecos que hay (`pasos − 1`). Mover el recorrido mueve los cuatro encendidos
 * a la vez; no hay forma de descoordinarlos.
 *
 * ⚠️ **El pulso no se repite, y no es una preferencia de estilo.** Dos razones,
 * las dos duras:
 *
 *  1. El arnés de QA espera a que la lámina esté EN REPOSO —`enReposo()` en
 *     `scripts/qa-deck.mjs` exige que ninguna animación del slot siga
 *     corriendo, con 15 s de tope—. Una animación `infinite` no termina nunca:
 *     la espera vence, la corrida revienta y esta lámina deja de medirse.
 *  2. Ninguna de las otras catorce se repite. Las curvas de la tesis se trazan
 *     una vez, las seis barras crecen una vez, la cifra sube una vez. Un bucle
 *     aquí sería el único del deck, y un bucle dice «esto da vueltas» — que es
 *     lo contrario de lo que afirma la lámina: cuatro tiempos, en orden, y
 *     ninguno se salta.
 */
const RITMO = {
  /** s antes de que el pulso salga del primer nodo. */
  inicio: 0.5,
  /** s que tarda en recorrer la vía entera, de nodo a nodo. */
  recorrido: 2.4,
  /** s que dura el encendido de un nodo. */
  encendido: 0.32,
} as const;

/**
 * La línea de tiempo del método: cuatro nodos en fila, una vía de un hilo y un
 * pulso que la recorre encendiéndolos en orden.
 *
 * ⚠️ **La vía y el pulso son CSS, no un SVG, y es deliberado.** Un SVG obligaba
 * a las tres cosas que este repo ya sabe que salen mal: rotular los nodos con
 * `<text>` de SVG —que el arnés hit-testea por su CAJA entera, no por sus
 * glifos, y regala un falso positivo a cualquier título que quede cerca—;
 * escalar el lienzo con `preserveAspectRatio="none"` para que la vía llegue de
 * borde a borde —lo que deforma cualquier círculo—; y hacer coincidir a mano
 * las abscisas del dibujo con las columnas de la rejilla de texto. Con los
 * nodos EN la rejilla, la coincidencia es estructural: el nodo `i` está en la
 * celda `i` porque es su celda.
 *
 * Por eso `column-gap` vale cero y el aire entre columnas lo pone el
 * `padding-inline` de cada celda: sin hueco entre pistas, el centro de la
 * columna `i` cae exactamente en `(i + ½)/n` del ancho, y los dos extremos de
 * la vía —`50 % / n` por cada lado— caen exactamente en el centro del primer y
 * del último nodo. Con `column-gap` distinto de cero esa cuenta deja de ser
 * exacta y la vía se descuelga de los nodos.
 *
 * Bajo 640 px la fila cede a una lista compacta por CSS, con EL MISMO DOM: no
 * hay una rama de JavaScript ni una segunda copia de los cuatro textos.
 */
export function LineaDeTiempo({ pasos }: { pasos: readonly PasoDeMetodo[] }) {
  const compas = {
    "--pasos": pasos.length,
    "--inicio": `${RITMO.inicio}s`,
    "--recorrido": `${RITMO.recorrido}s`,
    "--encendido": `${RITMO.encendido}s`,
  } as CSSProperties;

  return (
    <div className={styles.envoltura} style={compas}>
      <ol className={styles.pasos}>
        {pasos.map((paso, i) => (
          <li className={styles.paso} key={paso.number} style={{ "--i": i } as CSSProperties}>
            {/* El numeral queda fuera del árbol de accesibilidad: el orden ya
                lo dice la lista ordenada, y un lector de pantalla que anuncie
                «cero uno» antes de cada tiempo repite lo que la propia lista
                acaba de decir. Lo que aporta el numeral es visual —es el nodo
                por el que pasa el pulso—, no semántico. */}
            <span className={styles.nodo} aria-hidden="true">
              {paso.number}
            </span>
            <h2 className={styles.tituloPaso}>{paso.title}</h2>
            <p className={styles.copyPaso}>{paso.copy}</p>
          </li>
        ))}
      </ol>

      {/* La vía va DESPUÉS de los pasos en el DOM y se pinta DEBAJO de ellos:
          los nodos llevan `position: relative` y un aro del color del fondo,
          así que el hilo entra y sale de cada círculo recortado, sin nacer ni
          morir pegado al aro. Sin texto dentro, así que ni cuenta palabras ni
          puede tapar ninguna. */}
      <span className={styles.via} aria-hidden="true">
        <span className={styles.pulso} />
      </span>
    </div>
  );
}

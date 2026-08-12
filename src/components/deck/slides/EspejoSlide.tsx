import type { CSSProperties } from "react";
import { DECK_COPY } from "@/content/deck";
import { method } from "@/content/home";
import { Slide } from "../Slide";
import deck from "../deck.module.css";
import styles from "./espejo.module.css";

const { pregunta, respuesta, columnas } = DECK_COPY.espejo;

/**
 * Los dos lados, en el orden en que se leen. Es una lista y no dos constantes
 * sueltas porque todo lo que sigue —la colocación en la rejilla, el retraso de
 * entrada, el número de filas— se deriva de ella: añadir un tercer público
 * sería añadir una entrada aquí, no reescribir el CSS.
 */
const LADOS = [
  { clave: "empresa", ...columnas.empresa },
  { clave: "entidad", ...columnas.entidad },
] as const;

/**
 * Cuántas filas de datos tiene el lado más largo, más la cabecera. Es el número
 * de pistas de la rejilla en escritorio, y sale del copy: con `grid-auto-flow:
 * column` la rejilla necesita saber cuántas filas hay, y ese número no puede
 * estar escrito a mano en el CSS o una fila de más caería en la columna de al
 * lado.
 */
const TRAMOS = Math.max(...LADOS.map((lado) => lado.filas.length)) + 1;

/**
 * Lámina 5 · El espejo.
 *
 * El deck se presenta a dos públicos, así que una lámina responde «¿y esto cómo
 * se ve desde mi lado?» para los dos sin duplicar el guion.
 *
 * ⚠️ **Los dos lados llegan a la vez, con el mismo `--i`.** Si uno entrara
 * antes, la lámina afirmaría una prioridad que el copy no tiene: el argumento
 * ES la simetría. Por la misma razón las dos cabeceras comparten peso y tamaño
 * —una columna más grande que la otra dice que hay una audiencia preferida— y
 * la espina va centrada, no arrimada a un lado.
 *
 * ⚠️ **El numeral de cada fila no es decorativo: es el mismo tiempo del método
 * a los dos lados.** Sale de `method` en `home.ts`, la misma fuente que la
 * lámina 4, y es lo que convierte dos listas paralelas en dos lecturas de UNA
 * cosa. La fila 1 de empresa —«quién decide y con qué información»— y la fila 1
 * de entidad —«qué obliga la norma y quién responde»— son las dos maneras de
 * entender el reto. Si algún día `method` y estas filas dejan de tener el mismo
 * número de entradas, el numeral desaparece en vez de mentir.
 */
export function EspejoSlide({ id }: { id: string }) {
  return (
    <Slide id={id}>
      <div className={`${deck.bloque} ${deck.escalonado}`}>
        <p className={deck.pregunta}>{pregunta}</p>
        <h1 className={`${deck.respuesta} ${deck.respuestaCompacta}`}>{respuesta}</h1>
      </div>

      <div className={styles.rejilla} style={{ "--tramos": TRAMOS } as CSSProperties}>
        {LADOS.map((lado, indiceLado) => (
          <div
            key={lado.clave}
            className={`${styles.columna} ${indiceLado === 0 ? styles.columnaIzquierda : styles.columnaDerecha}`}
          >
            <h2 className={styles.cabecera}>{lado.titulo}</h2>
            {lado.filas.map((fila, i) => (
              <p
                className={styles.fila}
                key={fila}
                // `--i` es el compás —el mismo a los dos lados— y `--fila` es
                // la pista de la rejilla. Van los dos porque son dos cosas
                // distintas: la fila 1 de los dos lados comparte instante Y
                // comparte altura, y ninguna de las dos puede deducirse de la
                // otra con una operación que el CSS admita en una línea de
                // rejilla.
                style={{ "--i": i, "--fila": i + 2 } as CSSProperties}
              >
                {method[i] !== undefined && (
                  <span className={styles.tiempo} aria-hidden="true">
                    {method[i].number}
                  </span>
                )}
                <span className={styles.texto}>{fila}</span>
              </p>
            ))}
          </div>
        ))}

        {/* La espina. Va entre las dos columnas en el DOM porque en escritorio
            ocupa la pista central; en móvil desaparece con `display: none` y
            los dos lados se leen uno debajo del otro, completos. Sin texto
            dentro: no cuenta palabras y no puede tapar ninguna. */}
        <span className={styles.espina} aria-hidden="true" />
      </div>
    </Slide>
  );
}

import type { CSSProperties } from "react";
import { DECK_COPY } from "@/content/deck";
import { Slide } from "../Slide";
import deck from "../deck.module.css";
import styles from "./evidencia.module.css";

const { pregunta, respuesta, cuerpo, remate } = DECK_COPY.evidencia;

/**
 * Lámina 6 · Las cosas que este sitio no puede decir.
 *
 * Todo el mercado de fábricas de software enseña logos sin permiso y casos sin
 * fuente. Aquí el argumento no es un adjetivo: es que el build rechaza publicar
 * una lista de familias de frases, y eso un competidor no lo copia sin
 * reescribir su propio sitio.
 *
 * ⚠️ **La lista NO se escribe aquí, y no es una elegancia: es la única forma de
 * construir esta lámina.** Uno de los motivos coincide con su propio patrón
 * bloqueado, así que pegarlos como literales en este archivo rompe `npm run
 * build` en la línea que los enumera — en su propia lista. Llegan como prop
 * desde la ruta, que es componente de servidor y los lee del verificador con
 * `leerMotivos()`. Hay una prueba, `scripts/verify-deck-reasons.test.mjs`, que
 * falla si alguien los reintroduce a mano en este archivo, en su CSS, en el
 * copy o en el lector.
 *
 * ⚠️ **Y por eso este componente NO es `async` y no lee del disco.**
 * `PresentationDeck` es un componente cliente, y un componente async de
 * servidor no se puede renderizar desde uno cliente.
 *
 * ⚠️ **Los motivos no llevan viñeta, ni número, ni comillas, y eso está
 * medido.** A 390 px la columna da para unos 50 caracteres de mono y el motivo
 * más largo mide 36: catorce de margen. Cualquier marca delante se come un
 * tercio de esa holgura, y un motivo que envuelva parte la lista en dos ritmos
 * y empuja la lámina contra el riel. La marca de que esto es una lista la pone
 * la tipografía —mono, gris, una línea por regla—, no un glifo.
 */
export function EvidenciaSlide({ id, motivos }: { id: string; motivos: readonly string[] }) {
  return (
    <Slide id={id}>
      <div className={`${deck.bloque} ${deck.escalonado}`}>
        <p className={deck.pregunta}>{pregunta}</p>
        <h1 className={`${deck.respuesta} ${deck.respuestaCompacta}`}>{respuesta}</h1>
        <p className={deck.cuerpo}>{cuerpo}</p>
      </div>

      <ul className={styles.registro}>
        {motivos.map((motivo, i) => (
          <li className={styles.motivo} key={motivo} style={{ "--i": i } as CSSProperties}>
            {motivo}
          </li>
        ))}
      </ul>

      {/* `--n` es lo que hace que el remate entre DESPUÉS de la última línea
          sea cual sea el número de reglas: el retraso se calcula con el largo
          real de la lista, no con un catorce escrito que deja de ser verdad en
          cuanto el verificador gane o pierda una regla. */}
      <div className={styles.cierre} style={{ "--n": motivos.length } as CSSProperties}>
        {/* El recuento no es un adorno tipográfico: es el mismo número que
            acaba de recorrerse, y sale de la lista, no de una constante. El
            nombre del comando es el de `package.json`. Fuera del árbol de
            accesibilidad porque repite en jerga lo que el remate dice en
            palabras, y el número ya lo lleva el titular. */}
        <p className={styles.salida} aria-hidden="true">
          npm run check:content · {motivos.length} reglas activas
        </p>
        <p className={styles.remate}>{remate}</p>
      </div>
    </Slide>
  );
}

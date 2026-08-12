import { DECK_COPY } from "@/content/deck";
import { CurvasTesis } from "../figures/CurvasTesis";
import { Slide } from "../Slide";
import styles from "../deck.module.css";

const { pregunta, respuesta, cuerpo } = DECK_COPY.tesis;

/**
 * Lámina 3 · Tesis.
 *
 * La jerarquía al revés, en su forma más pura: la pregunta —«¿Dónde se decide
 * si un proyecto va a funcionar?»— es el montaje y va en cuerpo de mono; el
 * `<h1>` es la RESPUESTA, a 4,3 rem de serif.
 *
 * Texto y figura en dos columnas a partir de 62 rem, apilados por debajo. En
 * apaisado el ancho sobra y la altura no: puestos uno debajo del otro, la
 * figura empujaba la lámina contra el riel de progreso.
 */
export function TesisSlide({ id }: { id: string }) {
  return (
    <Slide id={id}>
      <div className={styles.tesisRejilla}>
        <div className={`${styles.bloque} ${styles.escalonado}`}>
          <p className={styles.pregunta}>{pregunta}</p>
          <h1 className={styles.respuesta}>{respuesta}</h1>
          <p className={styles.cuerpo}>{cuerpo}</p>
        </div>
        <CurvasTesis />
      </div>
    </Slide>
  );
}

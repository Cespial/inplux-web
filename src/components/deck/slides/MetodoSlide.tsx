import { DECK_COPY } from "@/content/deck";
import { method } from "@/content/home";
import { LineaDeTiempo } from "../figures/LineaDeTiempo";
import { Slide } from "../Slide";
import styles from "../deck.module.css";

const { pregunta, respuesta } = DECK_COPY.metodo;

/**
 * Lámina 4 · El método, con el pulso.
 *
 * ⚠️ **Los cuatro tiempos salen de `method` en `src/content/home.ts` y no se
 * reescriben aquí.** El sitio y el deck dicen lo mismo porque leen lo mismo: si
 * mañana el método cambia, cambian los dos a la vez o no cambia ninguno. Una
 * copia en `deck.copy.ts` sería una segunda verdad, y la lámina que presume de
 * método sería la primera en desmentirse.
 *
 * De ahí también que `DECK_COPY.metodo` traiga solo la pregunta y la respuesta:
 * es lo único de esta lámina que es del deck.
 *
 * La respuesta lleva el modificador de densidad. No es un rescate —la lámina
 * entra sin él—: a 4,3 rem el titular pesa cuatro veces y media la línea de
 * tiempo que resume, y un titular no debería medir eso sobre la figura que
 * introduce.
 */
export function MetodoSlide({ id }: { id: string }) {
  return (
    <Slide id={id}>
      <div className={`${styles.bloque} ${styles.escalonado}`}>
        <p className={styles.pregunta}>{pregunta}</p>
        <h1 className={`${styles.respuesta} ${styles.respuestaCompacta}`}>{respuesta}</h1>
      </div>

      <LineaDeTiempo pasos={method} />
    </Slide>
  );
}

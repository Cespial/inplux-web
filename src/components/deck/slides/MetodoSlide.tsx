import { DECK_COPY } from "@/content/deck";
import { method } from "@/content/home";
import { HazDelMetodo } from "../figures/HazDelMetodo";
import { Slide } from "../Slide";
import styles from "../deck.module.css";

const { pregunta, respuesta } = DECK_COPY.metodo;

/**
 * Lámina 4 · El método, como mecanismo.
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
 * ⚠️ **De los cuatro tiempos, la lámina publica el TÍTULO y no el desarrollo,
 * y esa poda es la mitad del encargo.** Con los cuatro párrafos puestos, esto
 * era una lista numerada de cuatro entradas —01/02/03/04, título y cuerpo—: un
 * índice con números, 2,97 % de tinta y el sexto de arriba y el de abajo a
 * 0,00 %. Cuatro párrafos al pie de una figura no la acompañan: la explican con
 * palabras, que es el trabajo que la figura tiene que hacer sola. Los cuatro
 * desarrollos siguen íntegros en la portada del sitio, que es donde se leen
 * sentado y no a cinco metros. Aquí el título ancla cada compuerta y el haz
 * carga el argumento.
 *
 * ⚠️ **Y el argumento de la figura no es el que tenía la lista.** Una lista
 * puede afirmar una secuencia; no puede afirmar que algo CAMBIA al recorrerla.
 * El haz sí: entra por la izquierda hecho `n + 1` hilos grises y rotos, cada
 * compuerta se lleva uno y alarga el guion de los que quedan, y de la última
 * sale un solo trazo teal, entero, que se va por el borde. Un reto entra y
 * sale software en producción, sin una palabra que lo diga.
 *
 * Dos hijos DIRECTOS de `<Slide>`, no un envoltorio, y es la misma razón que en
 * la tesis y en la fábrica: con `data-deck-llena` en el segundo —lo pone
 * `HazDelMetodo`— `.lamina` pasa a `align-content: stretch` y la figura recibe
 * TODO el alto sobrante, que es el mecanismo contra la banda muerta. Solo
 * funciona si la figura es hija directa. Un envoltorio además se comería el
 * `gap` de `.lamina`, que es lo que separa el texto de la figura.
 *
 * La respuesta lleva el modificador de densidad. No es un rescate —la lámina
 * entra sin él—: a 4,3 rem el titular pesa cuatro veces y media la figura que
 * introduce, y un titular no debería medir eso sobre lo que hay que mirar.
 */
export function MetodoSlide({ id }: { id: string }) {
  return (
    <Slide id={id}>
      <div className={`${styles.bloque} ${styles.escalonado}`}>
        <p className={styles.pregunta}>{pregunta}</p>
        <h1 className={`${styles.respuesta} ${styles.respuestaCompacta}`}>{respuesta}</h1>
      </div>

      <HazDelMetodo pasos={method} />
    </Slide>
  );
}

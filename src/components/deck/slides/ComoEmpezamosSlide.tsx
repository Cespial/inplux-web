import { DECK_COPY } from "@/content/deck";
import { method } from "@/content/home";
import { Slide } from "../Slide";
import deck from "../deck.module.css";
import styles from "./como-empezamos.module.css";

const { pregunta, respuesta } = DECK_COPY.comoEmpezamos;

/**
 * Los mismos cuatro tiempos, aplicados a tu reto.
 *
 * ⚠️ **Los tiempos salen de `method` en `src/content/home.ts`, la misma fuente
 * que la lámina del método y que la del espejo.** No se copian ni se reescriben:
 * el deck afirma «los MISMOS cuatro tiempos», así que tienen que ser
 * literalmente los mismos objetos. Una copia en `deck.copy.ts` sería una segunda
 * verdad, y esta lámina sería la primera en desmentirse.
 *
 * ⚠️ **No reutiliza `LineaDeTiempo`, y no es por variedad.** Esa figura es una
 * fila de nodos con una vía y un pulso que la recorre: su argumento es la
 * SECUENCIA —cuatro tiempos, y ninguno se salta—, y ese argumento ya se hizo.
 * Aquí el argumento es otro: los mismos cuatro, ya conocidos, puestos frente a
 * un reto que todavía no es nuestro. De ahí el registro: cuatro entradas de un
 * cuaderno, cada una con su filete a la izquierda, sin nodos, sin vía y sin
 * pulso. Y de ahí también que NO sea una escalera vertical, que es exactamente
 * la forma que `LineaDeTiempo` toma por debajo de 640 px: las dos láminas se
 * verían iguales en un teléfono.
 *
 * ⚠️ Ni este comentario ni el CSS dicen «lámina 14»: ese número es
 * 7 + los productos de `workProfiles` + 2, así que un producto nuevo en
 * `work.ts` lo movería y el rótulo empezaría a mentir.
 *
 * Sin `etiqueta` en `<Slide>`: todo lo que dice la lámina es texto real en el
 * DOM. El nombre de la región lo pone el slot del riel y el título visible el
 * <h1>.
 */
export function ComoEmpezamosSlide({ id }: { id: string }) {
  return (
    <Slide id={id}>
      <div className={`${deck.bloque} ${deck.escalonado}`}>
        <p className={deck.pregunta}>{pregunta}</p>
        <h1 className={`${deck.respuesta} ${deck.respuestaCompacta}`}>{respuesta}</h1>
      </div>

      {/* Una lista ordenada porque los cuatro tiempos van en orden, aunque el
          reparto en dos columnas los presente de dos en dos: el orden lo
          conserva el DOM y lo anuncia el lector de pantalla, y en pantalla se
          lee de izquierda a derecha y de arriba abajo, que es el mismo. */}
      <ol className={styles.registro}>
        {method.map((paso) => (
          <li className={styles.tiempo} key={paso.number}>
            {/* El numeral queda fuera del árbol de accesibilidad: la lista
                ordenada ya dice el orden, y anunciar «cero uno» antes de cada
                tiempo lo repite. Lo que aporta es visual. */}
            <span className={styles.numero} aria-hidden="true">
              {paso.number}
            </span>
            <h2 className={styles.tituloTiempo}>{paso.title}</h2>
            <p className={styles.copyTiempo}>{paso.copy}</p>
          </li>
        ))}
      </ol>
    </Slide>
  );
}

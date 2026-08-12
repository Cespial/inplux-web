import type { CSSProperties } from "react";
import { DECK_COPY } from "@/content/deck";
import { workProfiles } from "@/content/work";
import { Slide } from "../Slide";
import deck from "../deck.module.css";
import styles from "./puente.module.css";

const { pregunta, respuesta } = DECK_COPY.puente;

/**
 * Lámina 7 · El puente.
 *
 * Sin ella, lo que sigue son aplicaciones sueltas. Con ella, los mismos
 * productos son la evidencia de una sola afirmación: los dominios no se
 * parecen —tributación, gestión pública, derecho, arbitraje, porcicultura— y la
 * fábrica es la misma.
 *
 * ⚠️ **La rejilla se deriva del número de perfiles, no de un número escrito.**
 * En F0.5 ese defecto apareció seis veces. Aquí no hay ningún `repeat(N, …)`
 * con N literal ni ninguna regla que nombre una posición: las pistas las pone
 * `repeat(auto-fit, minmax(…, 1fr))`, que reparte las miniaturas que haya —las
 * de hoy, mañana las que sean— y colapsa las pistas vacías. Añadir un perfil a
 * `work.ts` añade una miniatura y una lámina de producto, y no hay que tocar
 * una sola línea de esta hoja.
 *
 * ⚠️ **Sin etiqueta de atribución en la miniatura.** Las fichas de producto la
 * llevan con su peso completo; repetirla en cada miniatura de aquí, en cuerpo
 * de pie, la convierte en ruido y quita sitio a lo único que esta lámina afirma, que es la
 * distancia entre los dominios.
 */
export function PuenteSlide({ id }: { id: string }) {
  return (
    <Slide id={id}>
      <div className={`${deck.bloque} ${deck.escalonado}`}>
        <p className={deck.pregunta}>{pregunta}</p>
        <h1 className={deck.respuesta}>{respuesta}</h1>
      </div>

      <ul className={styles.rejilla}>
        {workProfiles.map((perfil, i) => (
          <li className={styles.ficha} key={perfil.slug} style={{ "--i": i } as CSSProperties}>
            <span className={styles.dominio}>{perfil.category}</span>
            <span className={styles.nombre}>{perfil.name}</span>
          </li>
        ))}
      </ul>
    </Slide>
  );
}

import { DECK_COPY } from "@/content/deck";
import { MallaPortada } from "../figures/MallaPortada";
import { Slide } from "../Slide";
import styles from "../deck.module.css";

const { eyebrow, titulo, bajada } = DECK_COPY.portada;
const [PRIMERA, SEGUNDA] = titulo;

/**
 * Lámina 1 · Portada.
 *
 * El antetítulo va en `.pregunta` —el rótulo de mono de la escala— y el título
 * del deck en serif, con la segunda línea en la cursiva dibujada. Todo el
 * texto sale de `DECK_COPY.portada`; el corte en dos líneas también, porque
 * viene partido de ahí.
 *
 * La malla es lo único que no es texto, va delante en el DOM y detrás en la
 * pintura: `.bloque` lleva `z-index: 1` y `.malla` `z-index: 0`. Sin ese par,
 * un absoluto se pinta SOBRE el contenido en flujo aunque vaya antes.
 */
export function PortadaSlide({ id }: { id: string }) {
  return (
    <Slide id={id}>
      <MallaPortada />
      <div className={`${styles.bloque} ${styles.escalonado}`}>
        <p className={styles.pregunta}>{eyebrow}</p>
        <h1 className={styles.tituloPortada}>
          <span className={styles.tituloPortadaLinea}>{PRIMERA}</span>
          <em className={styles.tituloPortadaCursiva}>{SEGUNDA}</em>
        </h1>
        <p className={styles.cuerpo}>{bajada}</p>
      </div>
    </Slide>
  );
}

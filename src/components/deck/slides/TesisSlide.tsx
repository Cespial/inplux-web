import { DECK_COPY } from "@/content/deck";
import { TrazadoTesis } from "../figures/TrazadoTesis";
import { Slide } from "../Slide";
import styles from "../deck.module.css";
import propios from "./tesis.module.css";

const { pregunta, respuesta, cuerpo } = DECK_COPY.tesis;

/**
 * Lámina 3 · Tesis.
 *
 * La jerarquía al revés, en su forma más pura: la pregunta —«¿Dónde se decide
 * si un proyecto va a funcionar?»— es el montaje y va en cuerpo de mono; el
 * `<h1>` es la RESPUESTA, a 4,3 rem de serif.
 *
 * ⚠️ **La maquetación es de DOS FILAS, no de dos columnas, y eso es el encargo
 * entero.** Con texto y figura en columnas, la figura no podía pasar de 42 rem
 * y la lámina medía 0,00 % de tinta en el sexto superior Y en el inferior:
 * todo encajonado en el tercio central. En dos filas —cabecera a lo ancho
 * arriba, figura a lo ancho abajo— la figura pasa de 615 px a los 1.296 de la
 * lámina y las bandas de abajo dejan de estar vacías.
 *
 * ⚠️ Dos hijos DIRECTOS de <Slide>, no un envoltorio, y es la misma razón que
 * en la lámina de capacidades: con `data-deck-llena` en el segundo —lo pone
 * `TrazadoTesis`— `.lamina` pasa a `align-content: stretch` y la figura recibe
 * TODO el alto sobrante, que es el mecanismo contra la banda muerta. Solo
 * funciona si la figura es hija directa. Un envoltorio además se comería el
 * `gap` de `.lamina`, que es lo que separa el texto de la figura.
 *
 * La cabecera se parte en dos columnas —respuesta a la izquierda, cuerpo a la
 * derecha— para que su ALTURA sea la de la respuesta y no la suma de las dos.
 * Lo que se ahorra ahí se lo lleva la figura, que es lo que hay que mirar.
 *
 * ⚠️ Y de ahí `.respuestaCompacta`, que el comentario de su propio modificador
 * daba por innecesario aquí —«la escala está dimensionada para una lámina de
 * texto: portada, tesis»—. Eso valía cuando esta lámina era texto con media
 * columna de dibujo al lado. Ya no lo es. Medido contra el hueco real entre
 * barras a 1440 × 754, que es la ventana con la que se mide la densidad del
 * deck y la que tiene un portátil con la barra del navegador puesta: con la
 * respuesta a 4,3 rem la cabecera pide 269 px y la figura se sale 59 px por
 * debajo del riel. **A 1440 × 900 —una de las tres ventanas del arnés— cabía,
 * así que la corrida habría salido verde con la lámina rota en la sala.** Es
 * el mismo acantilado por el que ya se descartó una figura antes, y aquí se
 * cierra midiendo las dos alturas, no solo la del arnés.
 */
export function TesisSlide({ id }: { id: string }) {
  return (
    <Slide id={id}>
      <div className={propios.cabecera}>
        <div className={`${styles.bloque} ${styles.escalonado}`}>
          <p className={styles.pregunta}>{pregunta}</p>
          <h1 className={`${styles.respuesta} ${styles.respuestaCompacta}`}>{respuesta}</h1>
        </div>
        <p className={`${styles.cuerpo} ${propios.cuerpoColumna}`}>{cuerpo}</p>
      </div>

      <TrazadoTesis />
    </Slide>
  );
}

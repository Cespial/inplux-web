import { DECK_COPY, type DeckSlide } from "@/content/deck";
import { CapasFabrica } from "../figures/CapasFabrica";
import { Slide } from "../Slide";
import styles from "../deck.module.css";

const { pregunta, respuesta } = DECK_COPY.capacidades;

/**
 * La fábrica por dentro.
 *
 * ⚠️ Ni este comentario ni el CSS dicen «lámina 13»: el número de esta lámina
 * es 7 + los productos de `workProfiles` + 1, así que un producto nuevo en
 * `work.ts` lo movería y el rótulo empezaría a mentir en silencio. Las láminas
 * 1 a 7 sí pueden numerarse en sus archivos porque van ANTES de los productos;
 * de aquí en adelante, no.
 *
 * Una sola columna a todo el ancho, no la rejilla de dos de `tesis` y
 * `problema`. No es variedad por variedad: la figura son estratos
 * horizontales, y un estrato de media columna es una raya. A 1.440 px cruzan
 * los 1.296 px de la lámina y se leen como capas; en media columna medirían 615
 * y se leerían como subrayados.
 *
 * De ahí también `.respuestaCompacta`. Es el caso exacto para el que se
 * dimensionó (ver el modificador en `deck.module.css`): en una lámina de una
 * columna la respuesta a 4,3 rem ocupa sus 22ch —875 px de 1.296— y pesa más de
 * cuatro veces el mono que introduce. A 2,8 rem son ~570 px y sigue siendo el
 * titular.
 *
 * ⚠️ Dos hijos directos de <Slide>, no un envoltorio: el arnés mide la caja de
 * la lámina como la unión de los rects de los hijos DIRECTOS de la <section>,
 * así que con un envoltorio de más la medida seguiría saliendo igual, pero el
 * `gap` de `.lamina` —que es lo que separa el texto de la figura— dejaría de
 * aplicarse y habría que reponerlo a mano. Y con `data-deck-llena` en el
 * segundo hijo —lo pone `CapasFabrica`— `.lamina` pasa además a
 * `align-content: stretch` y la pila recibe TODO el alto sobrante: es el
 * mecanismo contra las dos bandas muertas, y solo funciona si la figura es hija
 * directa.
 *
 * Sin `etiqueta`: no hace falta un nombre propio para la región. El de
 * `problema` existe porque allí un dato viaja en una cifra que no se anuncia;
 * aquí todo lo que dice la lámina es texto real en el DOM, incluidas las cuatro
 * capas y los dominios. El nombre lo pone el slot del riel y el título visible
 * el <h1>.
 */
export function CapacidadesSlide({
  id,
  // Los perfiles bajan hasta la figura, que reparte SUS dominios: la lámina no
  // los mira, solo los encamina. Ver `CapasFabrica`.
  perfiles,
}: {
  id: string;
  perfiles: readonly Extract<DeckSlide, { kind: "producto" }>["perfil"][];
}) {
  return (
    <Slide id={id}>
      <div className={`${styles.bloque} ${styles.escalonado}`}>
        <p className={styles.pregunta}>{pregunta}</p>
        <h1 className={`${styles.respuesta} ${styles.respuestaCompacta}`}>{respuesta}</h1>
      </div>

      <CapasFabrica perfiles={perfiles} />
    </Slide>
  );
}

import { DECK_COPY } from "@/content/deck";
import { Slide } from "../Slide";
import styles from "../deck.module.css";
import cierre from "./cierre.module.css";

const { respuesta, correo, ciudad } = DECK_COPY.cierre;

/**
 * La lámina de cierre · el contacto.
 *
 * La última, y la única del deck SIN figura. No es un olvido: lo último que
 * tiene que quedar en la retina es la dirección de correo, y cualquier dibujo
 * —por callado que fuera— se llevaría parte de esa mirada. El aire que queda
 * alrededor no es un hueco por rellenar: es lo que deja la dirección sola.
 *
 * Tres piezas, en el orden en que se usan: la invitación (`<h1>`), el canal
 * (el `mailto`) y el lugar. Las tres salen de `DECK_COPY.cierre` y **no hay en
 * este componente ni una cadena que no venga de ahí** —ni `aria-label`, ni
 * `<title>`, ni rótulo de figura, ni `?subject=`—. Es la única lámina del deck
 * de la que se puede decir eso, y se puede justamente porque no tiene figura:
 * los rótulos de figura fueron el único copy que hubo que declarar aparte en
 * las láminas del problema y de la tesis.
 *
 * ⚠️ **Sin `.escalonado`, a propósito.** La entrada escalonada de la escala es
 * el orden de lectura, y aquí no hay ninguno que enseñar: una frase, una
 * dirección y un lugar, sin nada que compita. Lo que sí hay es un coste
 * medible: `.escalonado` deja al tercer hijo —la dirección— entrando hasta los
 * 780 ms (retardo 320 ms + 460 ms de duración), mientras que el propio slot del
 * riel termina de entrar a los 530 ms (150 ms de espera + 380 ms). Son 250 ms
 * de lámina puesta con la dirección todavía traslúcida, y esta es la lámina
 * que se mira con el teléfono en la mano. Después de un deck entero que
 * entra escalonado, que aquí deje de moverse es además el punto final.
 *
 * ⚠️ Si alguien añade una animación a `.bloque` o a `.respuesta` en
 * `deck.module.css`, esta lámina la hereda y la dirección volverá a aparecer
 * fundiéndose. Es la única forma de que entre movimiento aquí sin pasar por
 * este archivo.
 *
 * Sin `etiqueta` en `<Slide>`: el nombre accesible lo pone el slot del riel
 * —la posición y el título del modelo— y el `<h1>` dice lo mismo. Un
 * `aria-label` aquí repetiría el encabezado, que es contra lo que avisa la
 * documentación de `Slide.tsx`.
 *
 * ⚠️ Y por eso ni este comentario ni el CSS dicen «lámina 15» en ninguna
 * parte: el número de esta lámina es 7 + los productos de `workProfiles` + 3,
 * así que un producto nuevo en `work.ts` lo movería y el comentario empezaría
 * a mentir. Las láminas 1 a 7 sí pueden numerarse porque van ANTES de los
 * productos; esta no.
 */
export function CierreSlide({ id }: { id: string }) {
  return (
    <Slide id={id}>
      <div className={styles.bloque}>
        <h1 className={styles.respuesta}>{respuesta}</h1>

        {/* El texto del enlace ES la dirección, y el `href` la misma cadena
            con su esquema delante. Leído fuera de contexto —que es como lo lee
            quien navega por enlaces— dice exactamente a dónde lleva, el mismo
            criterio con el que la lámina del problema enlaza el nombre del
            artículo y no «arXiv:1304.0265».
            Sin `?subject=`: el asunto sería copy que no está en ningún archivo
            de contenido, y quien escribe ya sabe de qué va a escribir. */}
        <p className={cierre.correo}>
          <a className={cierre.correoEnlace} href={`mailto:${correo}`}>
            {correo}
          </a>
        </p>

        <p className={cierre.ciudad}>{ciudad}</p>
      </div>
    </Slide>
  );
}

import type { CSSProperties } from "react";
import { DECK_COPY } from "@/content/deck";
import { workProfiles } from "@/content/work";
import styles from "./capas-fabrica.module.css";

/**
 * La fábrica por dentro: cuatro capas apiladas, cada una un hilo de 1 px con su
 * rótulo. Tres son continuas e idénticas; la de las reglas del dominio está
 * PARTIDA en tantos tramos como dominios hay, y cada tramo lleva el suyo
 * escrito. Eso, y solo eso, es «la fábrica es la misma; cambia el dominio»:
 * no hay que leerlo, se ve.
 *
 * ⚠️ **No hay ni un conteo de productos en ningún sitio de esta figura.** No en
 * el copy, no en el CSS, no en un `aria-label`. El número de tramos sale de
 * `DOMINIOS`, y el CSS ni siquiera puede saberlo: la rejilla es
 * `repeat(auto-fit, …)`, que cuenta los hijos que le llegan. Ver el comentario
 * de `.dominios` en el módulo.
 *
 * ⚠️ Y NO hay ningún mapeo de capacidad→capa. Sería clasificar por la posición
 * de un elemento en un arreglo en vez de por su contenido, que es exactamente
 * el error que ya costó una vez. Las cuatro capas son una afirmación editorial
 * del deck —viven en `deck.copy.ts` y las firma quien firma el copy—; lo único
 * que esta figura DERIVA de los perfiles son los dominios.
 */

/**
 * El compás de la lámina vive aquí y solo aquí; al módulo de estilos llegan
 * cinco variables, así que en `capas-fabrica.module.css` no hay escrito ni un
 * número de tiempo.
 *
 * ⚠️ **`inicio` está atado a un número que vive en OTRO archivo y que no puedo
 * derivar.** La columna de texto entra con `.escalonado` de `deck.module.css`:
 * la respuesta arranca a 230 ms y dura 460 ms, o sea que aterriza en 690 ms. La
 * primera capa no puede empezar antes que eso o la pila le pelea la mirada al
 * titular, que es la jerarquía que sostiene toda la escala. De ahí 0,72 s. Si
 * alguien toca ese escalonado, este número hay que volver a mirarlo — y no hay
 * nada que avise. Es una dependencia declarada, no derivada.
 */
export const RITMO = {
  inicio: 0.72, // s antes de que entre la capa de abajo
  paso: 0.15, // s entre una capa y la de encima
  etiqueta: 0.42, // s que tarda un rótulo en aparecer
  regla: 0.62, // s que tarda un hilo en dibujarse
  // ⚠️ Lo que el nombre de un dominio espera a su propio rótulo. Tiene que ser
  // MENOR que `paso × (capas por encima de la variable)` = 0,30 s, o el reparto
  // de la capa del dominio se pintaría después de que la pila esté entera y la
  // secuencia dejaría de leerse como una sola.
  dominio: 0.28,
} as const;

export const COMPAS = {
  "--inicio": `${RITMO.inicio}s`,
  "--paso": `${RITMO.paso}s`,
  "--durEtiqueta": `${RITMO.etiqueta}s`,
  "--durRegla": `${RITMO.regla}s`,
  "--retrasoDominio": `${RITMO.dominio}s`,
} as CSSProperties;

/**
 * Los dominios, derivados de los perfiles. Nunca escritos.
 *
 * ⚠️ `new Set` no es defensivo por costumbre: esta capa reparte DOMINIOS, no
 * productos. Si dos perfiles llegaran a compartir `category`, escribirla dos
 * veces se leería como una errata en la sala. Hoy los cinco son distintos y el
 * `Set` no quita nada, que es justo la señal de que está bien puesto.
 *
 * El orden es el de `workProfiles`, que es el mismo de las fichas de producto
 * que acaban de pasar: quien vio esas láminas reconoce la secuencia.
 */
const DOMINIOS = [...new Set(workProfiles.map((perfil) => perfil.category))];

/**
 * De abajo arriba es el orden del compás —la pila se construye desde su
 * cimiento— y de arriba abajo es el del DOM y el de la pantalla, que tienen que
 * coincidir: quien lee con lector de pantalla oye las capas en el mismo orden
 * en que las ve quien mira. `desdeAbajo` conserva el índice del arreglo
 * original y es el único que llega al CSS, así que el retardo se calcula sin un
 * `:nth-child` que haya que rehacer el día que entre o salga una capa.
 */
const EN_PANTALLA = DECK_COPY.capacidades.capas
  .map((capa, desdeAbajo) => ({ capa, desdeAbajo }))
  .reverse();

export function CapasFabrica() {
  return (
    <ul className={styles.capas} style={COMPAS}>
      {EN_PANTALLA.map(({ capa, desdeAbajo }) => (
        <li
          key={capa.nombre}
          className={capa.dominios ? `${styles.capa} ${styles.capaVaria}` : styles.capa}
          // El instante de cada capa sale de aquí y solo de aquí: duración y
          // retraso base son COMUNES a las cuatro y lo único que las separa es
          // este índice.
          style={{ "--i": desdeAbajo } as CSSProperties}
        >
          <p className={styles.capaEtiqueta}>{capa.nombre}</p>

          {capa.dominios ? (
            <ul className={styles.dominios}>
              {DOMINIOS.map((dominio) => (
                <li key={dominio} className={styles.dominio}>
                  {dominio}
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

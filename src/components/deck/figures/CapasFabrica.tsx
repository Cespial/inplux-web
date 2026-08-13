import type { CSSProperties } from "react";
import { DECK_COPY } from "@/content/deck";
import { workProfiles } from "@/content/work";
import styles from "./capas-fabrica.module.css";

/**
 * La fábrica por dentro: N estratos apilados que llenan la lámina de arriba
 * abajo. Cada uno es un cuerpo con ALTURA —no una regla horizontal— relleno con
 * el rayado de sección de un dibujo técnico. Los estratos comunes cruzan la
 * lámina enteros; el que lleva `dominios: true` está PARTIDO en tantas piezas
 * como dominios hay, **con el mismo rayado**, y cada pieza lleva el suyo
 * escrito. Que la materia sea idéntica y el corte sea el único cambio es el
 * dibujo de «la fábrica es la misma; cambia el dominio».
 *
 * Lo que sustituye: cuatro hilos de 1 px con su rótulo encima. Cuatro
 * subrayados no se leen como un apilamiento, se leen como cuatro separadores;
 * les faltaba lo único que los haría capas, que es altura.
 *
 * ⚠️ **La figura NO da por buenas las cuatro capas de hoy.** Nada aquí sabe
 * cuántas son: los estratos son `flex: 1 1 0` dentro de una pila que recibe el
 * alto, así que reparten lo que haya. El techo son SEIS capas; con siete la
 * suma de los `min-height` se pasa del hueco entre barras y el arnés lo canta
 * (`CHOCA CON LAS BARRAS`), que es el modo de fallo que se busca: ruidoso, no
 * silencioso.
 *
 * ⚠️ **Ni un conteo escrito.** El número de estratos sale de
 * `DECK_COPY.capacidades.capas.length`; el de piezas, de los `category`
 * distintos de `workProfiles`. Los dos bajan al CSS como `--capas` y `--tramos`
 * y de ahí salen la rejilla, el compás y la duración de cada trazo.
 *
 * ⚠️ Y NO hay ningún mapeo capacidad→capa. Sería clasificar por la posición de
 * un elemento en un arreglo en vez de por su contenido, que es el error que ya
 * costó una vez. Las capas son una afirmación editorial que vive en
 * `deck.copy.ts` y la firma quien firma el copy; lo único que esta figura
 * DERIVA de los perfiles son los dominios.
 */

/**
 * El compás vive aquí y solo aquí; al módulo llegan siete variables y en
 * `capas-fabrica.module.css` no hay escrito ni un número de tiempo.
 *
 * ⚠️ `inicio` está atado a un número que vive en OTRO archivo y no se puede
 * derivar: la columna de texto entra con `.escalonado` de `deck.module.css`, la
 * respuesta arranca a 230 ms y dura 460, o sea que aterriza en 690 ms. El
 * primer estrato no puede empezar antes o la pila le pelea la mirada al
 * titular. De ahí 0,72 s. Si alguien toca ese escalonado, este número hay que
 * volver a mirarlo, y no hay nada que avise.
 */
export const RITMO = {
  inicio: 0.72, // s antes de que entre el estrato de abajo
  paso: 0.15, // s entre un estrato y el de encima
  etiqueta: 0.42, // s que tarda un rótulo en aparecer
  regla: 0.62, // s que tarda un estrato entero en rayarse de izquierda a derecha
  dominio: 0.28, // s que espera la capa partida antes de empezar a rayarse
} as const;

/**
 * Los dominios, derivados de los perfiles. Nunca escritos.
 *
 * ⚠️ `new Set` no es defensivo por costumbre: esta capa reparte DOMINIOS, no
 * productos. Si dos perfiles compartieran `category`, escribirla dos veces se
 * leería como una errata en la sala. Hoy los cinco son distintos y el `Set` no
 * quita nada, que es justo la señal de que está bien puesto.
 */
const DOMINIOS = [...new Set(workProfiles.map((perfil) => perfil.category))];

/**
 * De abajo arriba es el orden del compás —la pila se construye desde su
 * cimiento— y de arriba abajo es el del DOM y el de la pantalla, que tienen que
 * coincidir: quien lee con lector de pantalla oye los estratos en el mismo
 * orden en que los ve quien mira. `desdeAbajo` conserva el índice original y es
 * el único que llega al CSS, así que el retardo se calcula sin un `:nth-child`
 * que haya que rehacer el día que entre o salga una capa.
 */
const EN_PANTALLA = DECK_COPY.capacidades.capas
  .map((capa, desdeAbajo) => ({ capa, desdeAbajo }))
  .reverse();

const COMPAS = {
  "--capas": DECK_COPY.capacidades.capas.length,
  "--tramos": DOMINIOS.length,
  "--inicio": `${RITMO.inicio}s`,
  "--paso": `${RITMO.paso}s`,
  "--durEtiqueta": `${RITMO.etiqueta}s`,
  "--durRegla": `${RITMO.regla}s`,
  "--retrasoDominio": `${RITMO.dominio}s`,
} as CSSProperties;

/** Prefijo de los `id` del rayado. El sufijo sale siempre de un índice. */
const TRAMA = "deck-capacidades-trama";

/**
 * La materia de un estrato: un rayado de sección a 45°, paso de 7 px.
 *
 * ⚠️ **Sin `viewBox`**: el espacio de usuario del SVG es el de CSS, así que el
 * paso mide 7 px en las tres pantallas.
 *
 * ⚠️ **Y por eso el trazo se dibuja con `clip-path` y no con `scaleX`.** Un
 * `transform: scaleX(0 → 1)` sobre el propio `<svg>` comprime el patrón con él:
 * a `scaleX(0,2)` las líneas de 45° se ven a ~11° y el paso deja de medir 7 px.
 * El estado final salía bien y el defecto era transitorio, pero contradecía en
 * los 0,62 s del trazo el único argumento por el que esta figura no lleva
 * `viewBox` —que nada se escala, así que nada se puede deformar—. `clip-path:
 * inset()` descubre el rayado de izquierda a derecha sin tocar su geometría.
 *
 * ⚠️ Sin un solo `<text>`: un `<text>` de SVG lo mide el arnés por su caja
 * entera (límite declarado nº 5, `task-8-report.md` §10.3-10.4) y además
 * inflaría el recuento de palabras. Todos los rótulos de esta figura son HTML.
 */
function Trama({ id }: { id: string }) {
  return (
    <div className={styles.materia}>
      <svg className={styles.trama} aria-hidden="true" focusable="false">
        <defs>
          <pattern
            id={id}
            patternUnits="userSpaceOnUse"
            width="7"
            height="7"
            patternTransform="rotate(45)"
          >
            <line className={styles.tramaLinea} x1="0.5" y1="0" x2="0.5" y2="7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

export function CapasFabrica() {
  return (
    // ⚠️ `data-deck-llena` es el contrato con `.lamina` para que esta lámina
    // REPARTA el alto en vez de centrar. Atributo global y no una clase porque
    // la regla vive en `deck.module.css` y las clases de un módulo van
    // cifradas: el mismo mecanismo que `data-deck-chrome`.
    <ul className={styles.pila} style={COMPAS} data-deck-llena>
      {EN_PANTALLA.map(({ capa, desdeAbajo }) => (
        <li
          key={capa.nombre}
          className={capa.dominios ? `${styles.capa} ${styles.capaVaria}` : styles.capa}
          // El instante de cada estrato sale de aquí y solo de aquí: duración y
          // retraso base son COMUNES y lo único que los separa es este índice.
          style={{ "--i": desdeAbajo } as CSSProperties}
        >
          <p className={styles.capaEtiqueta}>{capa.nombre}</p>

          {capa.dominios ? (
            <ul className={styles.dominios}>
              {DOMINIOS.map((dominio, tramo) => (
                <li
                  key={dominio}
                  className={styles.dominio}
                  style={{ "--t": tramo } as CSSProperties}
                >
                  <p className={styles.dominioNombre}>{dominio}</p>
                  <Trama id={`${TRAMA}-${desdeAbajo}-${tramo}`} />
                </li>
              ))}
            </ul>
          ) : (
            <Trama id={`${TRAMA}-${desdeAbajo}`} />
          )}
        </li>
      ))}
    </ul>
  );
}

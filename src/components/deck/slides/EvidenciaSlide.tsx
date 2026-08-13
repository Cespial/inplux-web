import type { CSSProperties } from "react";
import { DECK_COPY } from "@/content/deck";
// El tipo, y solo el tipo: `import type` se borra antes del empaquetado, así
// que esta línea no arrastra `node:fs` al cliente. Lo que cruza el límite son
// datos ya leídos, no el lector.
import type { ReglaBloqueada } from "@/lib/banned-reasons.server";
import { Slide } from "../Slide";
import deck from "../deck.module.css";
import styles from "./evidencia.module.css";

const { pregunta, respuesta, cuerpo, remate, figura } = DECK_COPY.evidencia;

/**
 * El muro va en dos columnas a partir de 62 rem, y el número vive UNA vez.
 *
 * De aquí salen las dos cosas que tienen que coincidir o la rejilla se parte:
 * cuántas pistas pinta el CSS (`--columnas`) y en cuántas filas se reparten las
 * frases (`--filas`). Con `grid-auto-flow: column`, las filas son las que
 * mandan: doce frases en seis filas caen 6 + 6 y en el orden de lectura de
 * siempre —columna izquierda entera y luego la derecha—.
 */
const COLUMNAS = 2;

/**
 * El compás de la lámina, y vive aquí y solo aquí.
 *
 * Primero aterrizan las doce frases, casi a la vez: es lo que el sector dice, y
 * ya estaba dicho antes de que llegara nadie. Después, medio segundo más tarde,
 * baja la comprobación y las va tachando una por una. Ese segundo orden ES el
 * argumento —la lámina no afirma que seamos honestos, enseña una prueba
 * corriendo—, y por eso las dos cascadas tienen ritmos distintos: la de las
 * frases es rápida y pareja; la de los tachones se oye contar.
 *
 * ⚠️ Los segundos bajan al CSS en variables y no se escriben allí: el retardo
 * del cierre se calcula con el largo real de la lista (`--n`), de modo que el
 * día que el verificador gane una regla el remate sigue entrando después del
 * último tachón. Es el mismo patrón de `figures/SeisBarras.tsx`.
 */
const COMPAS = {
  "--fila-inicio": "0.32s",
  "--fila-paso": "0.03s",
  // El comando aparece antes que el primer tachón: la causa antes que el
  // efecto. Es lo único que se anima fuera del orden de arriba abajo.
  "--salida-inicio": "0.65s",
  "--tachon-inicio": "0.85s",
  "--tachon-paso": "0.05s",
  "--cierre-tras": "0.12s",
} as CSSProperties;

/**
 * Lámina 6 · Las frases que este sitio no puede escribir.
 *
 * ⚠️ **Aquí no se enseñan los nombres de las reglas, y ese es el encargo
 * entero.** Esos nombres son vocabulario del repositorio: dicen algo exacto a
 * quien mantiene el verificador y no dicen nada a nadie más. Seis de los trece
 * renglones que había aquí eran incomprensibles fuera del código. Lo que sí se
 * entiende sin explicación es la FRASE que cada regla caza —una cifra de
 * trayectoria, una promesa de plazo, una prueba social—, porque cualquiera que
 * haya recibido una propuesta de software las ha leído esta semana. El golpe es
 * reconocerlas.
 *
 * ⚠️ Y por eso este comentario no cita ninguna: citarla aquí rompería el build.
 * Escribir el ejemplo en el archivo que lo pinta es el error que la prueba de
 * más abajo caza, y lo cazó — este párrafo llevaba dos.
 *
 * ⚠️ **Las frases NO se escriben aquí, y no es una elegancia: es la única forma
 * de construir esta lámina.** Cada una coincide con su propio patrón bloqueado
 * —lo comprueba `verifyBannedExamples()` en el verificador—, así que pegarlas
 * como literales en este archivo, en su CSS o en el copy rompe `npm run build`
 * en la línea que las escribe. Llegan como prop desde la ruta, que es
 * componente de servidor y las lee del verificador con `leerReglas()`. Hay una
 * prueba, `scripts/verify-deck-reasons.test.mjs`, que recorre `src/` entero y
 * falla si alguna reaparece a mano.
 *
 * ⚠️ **Y por eso este componente NO es `async` y no lee del disco.**
 * `PresentationDeck` es un componente cliente, y un componente async de
 * servidor no se puede renderizar desde uno cliente.
 *
 * **La figura, y por qué es esta.** El mecanismo no es una promesa de
 * honestidad: es una prueba que RECHAZA. Eso tiene forma —un peine—: un raíl
 * vertical del que salen doce tachones, uno por frase. El raíl es la lista
 * recorriéndose y los tachones son lo que hace al pasar. La gramática de
 * `estilo-s50` se traduce, no se copia: el nodo es la frase, su etiqueta es
 * ella misma en tinta (nunca negro puro), el conector es el raíl gris de un
 * hilo y el único color de la lámina es el tachón, que es lo que la lámina
 * afirma. Cero rellenos, cero cajas, cero sombras.
 *
 * ⚠️ **El tachón es `<s>` y no un `<span>` con una raya pintada.** Si el módulo
 * de CSS no llegara —una regla de la que este deck depende en una sala ajena—,
 * lo que quedaría en pantalla con un `<span>` sería una lista limpia de doce
 * afirmaciones comerciales sin tachar: exactamente el sitio que esta lámina
 * dice no ser. Con `<s>`, el estilo por omisión del navegador las sigue
 * tachando.
 *
 * ⚠️ **La lista se nombra con el titular** (`aria-labelledby`). El tachón es
 * pintura y ningún lector de pantalla lo anuncia de forma fiable; sin nombre,
 * quien no ve la lámina oiría doce frases comerciales seguidas. Con el nombre,
 * las oye dentro de «Trece cosas que este sitio no puede decir». El `id` se
 * deriva del de la lámina: en el riel solo hay dos montadas a la vez y nunca
 * son la misma, así que no puede duplicarse.
 */
export function EvidenciaSlide({ id, reglas }: { id: string; reglas: readonly ReglaBloqueada[] }) {
  const idTitulo = `${id}-titulo`;
  // Las que se pueden citar. La que no —hoy una, y el copy del pie lo dice en
  // singular— no deja hueco en el muro: deja una línea que explica por qué.
  const frases = reglas.map((regla) => regla.ejemplo).filter((frase) => frase !== null);

  /**
   * La rejilla y el compás, una vez, en las tres piezas de la lámina.
   *
   * ⚠️ **`--columnas` va también en la cabecera y en el cierre, y no solo en el
   * muro.** Las tres se apoyan en las mismas dos pistas: sin esa variable
   * compartida, el cuerpo arrancaba 98 px a la derecha de las frases que tiene
   * debajo, y una lámina cuyo argumento es la precisión tenía tres arranques
   * distintos.
   */
  const rejilla = {
    ...COMPAS,
    "--columnas": COLUMNAS,
    "--filas": Math.ceil(frases.length / COLUMNAS),
    "--n": frases.length,
  } as CSSProperties;

  return (
    <Slide id={id}>
      {/* La cabecera se parte en dos columnas por la misma razón que la de la
          tesis: así su ALTURA es la de la respuesta y no la suma de respuesta
          más cuerpo, y lo que no gasta arriba se lo lleva el muro. */}
      <div className={styles.cabecera} style={rejilla}>
        <div className={`${deck.bloque} ${deck.escalonado}`}>
          <p className={deck.pregunta}>{pregunta}</p>
          <h1 id={idTitulo} className={`${deck.respuesta} ${deck.respuestaCompacta}`}>
            {respuesta}
          </h1>
        </div>
        <p className={`${deck.cuerpo} ${styles.cuerpoColumna}`}>{cuerpo}</p>
      </div>

      {/* ⚠️ `data-deck-llena` es el contrato con `.lamina`: la lámina pasa a
          repartir el alto en vez de centrarlo y este bloque se queda con todo
          lo que sobre. Solo funciona en un hijo DIRECTO de <Slide>.

          Ni `--filas` ni `--n` son números escritos: salen del largo real de la
          lista. El día que el verificador gane o pierda una regla, la rejilla se
          reparte sola y el cierre sigue entrando después del último tachón. */}
      <figure className={styles.muro} data-deck-llena style={rejilla}>
        {/* ⚠️ **El comando va ARRIBA, encima del raíl, y no al pie.** Es lo
            único de la lámina que nombra a quien tacha: puesto abajo, la figura
            enseñaba doce frases tachadas por nadie y había que leer el copy
            para saber quién las tacha. Encima del raíl, la lámina se lee de
            arriba abajo como lo que es —un comando, una lista que se recorre,
            doce rechazos— y entra medio segundo antes que el primer tachón,
            que es el orden en que ocurre.

            El recuento no es un adorno tipográfico: es el número de REGLAS
            —trece, las mismas del titular—, no el de renglones del muro, y sale
            de la lista, no de una constante. El nombre del comando es el de
            `package.json`. Fuera del árbol de accesibilidad porque repite en
            jerga lo que el remate dice en palabras, y el número ya lo lleva el
            titular. */}
        <p className={styles.salida} aria-hidden="true">
          npm run check:content · {reglas.length} reglas activas
        </p>

        <ul className={styles.registro} aria-labelledby={idTitulo}>
          {frases.map((frase, i) => (
            <li className={styles.fila} key={frase} style={{ "--i": i } as CSSProperties}>
              <s className={styles.frase}>{frase}</s>
            </li>
          ))}
        </ul>

        <figcaption className={styles.nota}>{figura.sinCita}</figcaption>
      </figure>

      <div className={styles.cierre} style={rejilla}>
        <p className={styles.remate}>{remate}</p>
      </div>
    </Slide>
  );
}

import type { CSSProperties } from "react";
import styles from "./haz-del-metodo.module.css";

/**
 * Un tiempo del método, con lo único que esta figura pinta de él.
 *
 * ⚠️ **`copy` no está, y la ausencia es la decisión.** `method` en
 * `src/content/home.ts` trae además un párrafo por tiempo, y la lámina los
 * publicaba los cuatro: cuatro títulos y cuatro desarrollos, o sea un índice
 * con números. En una lámina que es figura, esos cuatro párrafos compiten con
 * el dibujo y lo explican con palabras, que es exactamente lo que el dibujo
 * tiene que hacer solo. Los párrafos siguen íntegros en la portada del sitio,
 * que es donde se leen sentado.
 *
 * El tipo pide menos de lo que `method` da a propósito: así se ve de un
 * vistazo qué usa esta figura, y añadirle un campo al contenido no obliga a
 * tocar nada de aquí.
 */
export type TiempoDelMetodo = {
  number: string;
  title: string;
};

/**
 * El compás, y vive aquí y solo aquí.
 *
 * El pulso recorre el eje UNA vez y cada compuerta se enciende justo cuando
 * pasa por ella: por eso el retraso de la compuerta `i` no es un número
 * escrito, es `inicio + i · tramo`, y `tramo` sale de dividir el recorrido
 * entre los huecos que hay (`tiempos − 1`). Mover el recorrido mueve los
 * encendidos a la vez; no hay forma de descoordinarlos.
 *
 * ⚠️ **Nada de esto se repite, y no es una preferencia de estilo.** Dos
 * razones, las dos duras:
 *
 *  1. El arnés de QA espera a que la lámina esté EN REPOSO —`enReposo()` en
 *     `scripts/qa-deck.mjs` exige que ninguna animación del slot siga
 *     corriendo, con 15 s de tope—. Una animación `infinite` no termina nunca:
 *     la espera vence, la corrida revienta y **esta lámina deja de medirse en
 *     silencio**. No falla: desaparece de la medida.
 *  2. Ninguna de las otras trece se repite. Las curvas de la tesis se trazan
 *     una vez, las seis barras crecen una vez, la cifra sube una vez. Un bucle
 *     aquí sería el único del deck, y un bucle dice «esto da vueltas» — que es
 *     lo contrario de lo que afirma la lámina: cuatro tiempos, en orden, y
 *     ninguno se salta.
 *
 * `salida` es lo que tarda en tenderse el trazo que sale de la última
 * compuerta, y arranca cuando el pulso llega a ella: `inicio + recorrido`.
 */
const RITMO = {
  /** s antes de que el pulso salga de la primera compuerta. */
  inicio: 0.5,
  /** s que tarda en recorrer el eje entero, de la primera a la última. */
  recorrido: 2.4,
  /** s que dura el encendido de una compuerta. */
  encendido: 0.32,
  /** s que tarda en tenderse el trazo que sale. */
  salida: 0.75,
} as const;

/**
 * El lienzo del haz.
 *
 * ⚠️ **No tiene unidades reales y no puede tenerlas: este SVG se estira a su
 * caja con `preserveAspectRatio="none"`.** Aquí solo importan las
 * PROPORCIONES. Es legítimo justo porque en este dibujo no hay ni un círculo
 * ni un remate que una escala no uniforme pueda deformar —los aros son HTML,
 * en la rejilla— y porque todos los trazos llevan `non-scaling-stroke`, así
 * que su grosor se mide en pantalla y no lo toca la escala.
 *
 * Lo que compra estirarse: las abscisas del dibujo COINCIDEN con las columnas
 * de la rejilla de texto por construcción, no a mano. La compuerta `i` está en
 * `(i + ½)/n` del ancho tanto en el lienzo como en la rejilla, porque en las
 * dos es el centro de la columna `i`. Es la misma cuenta que sostenía la vía
 * de la figura anterior, y el motivo por el que `column-gap` vale cero.
 */
const LIENZO = { ancho: 1000, alto: 200 } as const;
const EJE = LIENZO.alto / 2;

/** Media altura del haz cuando llega, en unidades de lienzo. */
const BANDA = 92;

/**
 * Cuántos hilos por MEDIA banda se lleva cada compuerta. Es la única constante
 * de densidad de la figura y lo único que se elige a ojo; todo lo demás —el
 * paso entre hilos, cuántos hay en cada tramo, cuánto mide cada corte— sale de
 * ella y del número de tiempos.
 *
 * Se declara «por tiempo» y no «en total» para que la cuenta sea EXACTA con
 * cualquier `n`: con un total redondeado, `n` que no lo divida deja compuertas
 * que se llevan seis hilos y otras que se llevan ocho, y la figura dejaría de
 * afirmar lo que afirma —que cada tiempo se lleva la misma porción—.
 *
 * ⚠️ **Tres, y no cuatro, y se decidió en la captura.** Con cuatro el paso cae
 * a ~8,5 px de pantalla a 1440 × 754 y el haz empieza a leerse como un párrafo
 * de texto emborronado en vez de como materia — un guion corto a interlínea
 * corta ES la forma de un renglón—. Con tres el paso sube a ~11 px y la duda
 * desaparece. Se paga con tinta: 4,26 % → 3,5 %, que sigue muy por encima del
 * 2,79 % que medía la lista que esta figura sustituye.
 */
const HILOS_POR_TIEMPO = 3;

/** El centro de la compuerta `i`, que es el centro de su columna. */
const abscisa = (i: number, n: number) => ((i + 0.5) / n) * LIENZO.ancho;

/**
 * Media altura del haz en el tramo `s`, que es también la del corte de la
 * compuerta `s`.
 *
 * **Esta línea ES el argumento de la figura.** Cada compuerta se lleva
 * `BANDA / n` de haz, o sea una porción exacta del reto por tiempo, y después
 * de la última no queda nada: el haz vale cero y lo que sigue es un solo trazo.
 * Saltarse un tiempo no retrasa el lanzamiento — lo lanza con una cuarta parte
 * del problema todavía dentro. Eso es «y ninguno se salta» dicho en el dibujo
 * y no en el titular.
 */
const altura = (s: number, n: number) => (BANDA * (n - s)) / n;

/** Cuántos hilos lleva media banda en el tramo `s`. Es la altura, en pasos. */
const hilos = (s: number, n: number) => HILOS_POR_TIEMPO * (n - s);

/** La distancia entre dos hilos vecinos. La misma en todos los tramos. */
const paso = (n: number) => BANDA / (HILOS_POR_TIEMPO * n);

/**
 * La materia de un tramo: hilos horizontales, a paso constante, simétricos
 * respecto del eje.
 *
 * ⚠️ **Los hilos no se doblan ni se cruzan, y eso es deliberado.** El paso es
 * el mismo en todos los tramos, así que el hilo `k` de un tramo está a la
 * MISMA altura que el hilo `k` del siguiente: los que siguen, siguen rectos y
 * los que sobran se acaban contra el corte de la compuerta. No hay un solo
 * extremo suelto en el aire, no hace falta que nadie invente una curva para
 * unir dos alturas, y lo que se ve es exactamente lo que pasa: de cada
 * compuerta sale menos haz del que entró, y lo que sale no ha cambiado de
 * sitio.
 *
 * La segunda variable es el guion, que se DUPLICA en cada tramo: 7, 14, 28,
 * 56. La materia entra hecha pedazos y sale entera. Va en la misma dirección
 * que la primera y se lee sin contar nada.
 *
 * Todo depende de `n = tiempos`. En este archivo no hay un cuatro escrito.
 */
function tramo(s: number, n: number) {
  const x0 = s === 0 ? 0 : abscisa(s - 1, n);
  const x1 = abscisa(s, n);

  // Ningún hilo va SOBRE el eje: el eje es el carril del pulso y del trazo que
  // sale, y un hilo encima lo haría pasar por materia. Por eso el primer par
  // está a medio paso y la banda queda partida en dos mitades iguales.
  const trazos = Array.from(
    { length: hilos(s, n) },
    (_, k) => (k + 0.5) * paso(n),
  ).flatMap((desvio) => [`M${x0} ${EJE - desvio} H${x1}`, `M${x0} ${EJE + desvio} H${x1}`]);

  return { guion: `${7 * 2 ** s} 9`, trazos };
}

const TITULO_SVG = "deck-metodo-haz-titulo";

/**
 * El método como MECANISMO: un reto entra por la izquierda hecho pedazos y
 * sale por la derecha convertido en una sola cosa continua.
 *
 * Lo que sustituye, y por qué. La lámina era una lista numerada de cuatro
 * párrafos —01/02/03/04 con su título y su desarrollo—: un índice, no una
 * figura. Y decía «cuatro tiempos» sin enseñar qué hacen los cuatro tiempos:
 * una lista puede afirmar una secuencia, pero no puede afirmar que algo CAMBIA
 * al recorrerla. Eso es lo único que esta figura añade, y es todo el encargo.
 *
 * Medido a 1440 × 754 con el método de `comparacion-tensor.md` §0, contra el
 * build de la lista y el de esta figura:
 *
 *              tinta    croma   celdas muertas   sextos vacíos
 *   la lista   2,79 %   0,19 %      44 de 72     el de arriba y el de abajo
 *   el haz     3,68 %   0,75 %      29 de 72     ninguno
 *
 * Y eso QUITANDO los cuatro párrafos, que eran la mitad de la tinta de antes.
 * La materia no la pone el texto: la pone el dibujo.
 *
 * Cómo lo dice, sin una palabra:
 *
 *   · por la izquierda entra un haz ancho de hilos grises, rotos en pedazos
 *     cortos. Es el reto tal y como llega: mucho, disperso y sin forma;
 *   · cada compuerta lleva un CORTE vertical, y contra ese corte se acaban los
 *     hilos que ese tiempo se lleva —una porción exacta del haz, `1/n`—. Los
 *     que siguen, siguen rectos y con el guion el doble de largo: la materia
 *     pierde volumen y gana continuidad a la vez, y las dos cosas se ven;
 *   · después de la última no queda haz: queda UN trazo, entero, teal y más
 *     grueso, que se va por el borde de la lámina. Ni se detiene ni se cierra:
 *     eso es «lanzamos y evolucionamos».
 *
 * Contra sus vecinas, que es la otra condición. La tesis (lámina 3) son dos
 * curvas que DIVERGEN desde un origen común sobre un suelo, con dos cuñas de
 * masa: una trayectoria. El espejo (lámina 5) son dos columnas de filas con
 * una espina en medio: una tabla pareada. Esta es un flujo horizontal que
 * atraviesa compuertas y cambia de estado. Ninguna de las tres se parece a las
 * otras dos ni en el eje, ni en el número de cuerpos, ni en lo que afirma.
 *
 * ⚠️ **El contraste no descansa en ningún tinte flojo.** Lo que porta el
 * argumento es la FORMA —muchos hilos rotos contra uno entero— y los dos
 * estados van a color pleno: `--gray-400` da 4,84:1 contra el papel y `--teal`
 * 5,63:1. El único tono por debajo de 3:1 del dibujo es el eje en `--border`
 * (1,24:1), y ese solo ACOMPAÑA: es el carril por el que corre el pulso, y si
 * se borrara entero la figura seguiría diciendo lo mismo.
 *
 * ⚠️ **Aquí no hay ni un `<text>` de SVG, y es deliberado.** Límite declarado
 * nº 5 del arnés: un `<text>` se hit-testea por su CAJA entera, no por sus
 * glifos, y regala un falso positivo a cualquier título que quede cerca. Los
 * numerales y los títulos son HTML, en la rejilla, con su tamaño en `rem` —o
 * sea que obedecen la preferencia de fuente del lector—.
 *
 * Bajo 40 rem el haz se retira y quedan los aros y los títulos en una lista
 * vertical, con EL MISMO DOM: no hay una rama de JavaScript ni una segunda
 * copia de los cuatro textos.
 */
export function HazDelMetodo({ pasos }: { pasos: readonly TiempoDelMetodo[] }) {
  const n = pasos.length;
  const tramos = Array.from({ length: n }, (_, s) => tramo(s, n));
  // El corte de cada compuerta: el segmento vertical contra el que se acaban
  // los hilos que esa compuerta se lleva. Mide lo que mide el haz que llega,
  // así que los cuatro cortes dibujan por sí solos la escalera que baja.
  const cortes = Array.from({ length: n }, (_, i) => ({
    x: abscisa(i, n),
    alto: altura(i, n),
  }));

  const compas = {
    "--pasos": n,
    "--inicio": `${RITMO.inicio}s`,
    "--recorrido": `${RITMO.recorrido}s`,
    "--encendido": `${RITMO.encendido}s`,
    "--salida": `${RITMO.salida}s`,
  } as CSSProperties;

  return (
    // ⚠️ `data-deck-llena` es el contrato con `.lamina` para que la lámina
    // REPARTA el alto en vez de centrarlo: la cabecera ocupa lo que pide y la
    // figura se queda con el resto. Atributo global y no una clase porque la
    // regla vive en `deck.module.css` y las clases de un módulo van cifradas.
    // Es el mismo mecanismo de la tesis y de la fábrica.
    <figure className={styles.figura} data-deck-llena>
      <div className={styles.envoltura} style={compas}>
        {/* La materia. Va DEBAJO de todo —los aros llevan relleno del papel y
            un segundo aro del mismo color— así que cada hilo entra y sale
            recortado a unos puntos del borde de la compuerta, que es la
            gramática de conector del catálogo. Sin texto dentro: ni cuenta
            palabras ni puede tapar ninguna. */}
        <svg
          className={styles.haz}
          viewBox={`0 0 ${LIENZO.ancho} ${LIENZO.alto}`}
          preserveAspectRatio="none"
          role="img"
          aria-labelledby={TITULO_SVG}
          focusable="false"
        >
          <title id={TITULO_SVG}>
            Un haz ancho de hilos grises, rotos en pedazos cortos, entra por la izquierda y
            atraviesa una fila de cortes verticales, cada uno con un aro en el centro. En cada
            corte el haz pierde una parte de su altura y los hilos que siguen van menos rotos.
            Después del último corte no queda haz: sale un solo trazo continuo, en teal y más
            grueso, que se va por el borde derecho.
          </title>

          {tramos.map((t) => (
            <g
              className={styles.tramo}
              // El guion es único por tramo —se duplica en cada uno— así que
              // sirve de clave sin arrastrar el índice hasta aquí.
              key={t.guion}
              style={{ "--guion": t.guion } as CSSProperties}
            >
              {t.trazos.map((d) => (
                <path className={styles.hilo} d={d} key={d} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          ))}

          {/* Los cortes van DESPUÉS de los hilos: es la línea contra la que se
              acaban, así que tiene que verse encima de sus extremos. */}
          {cortes.map((corte) => (
            <line
              className={styles.corte}
              key={corte.x}
              vectorEffect="non-scaling-stroke"
              x1={corte.x}
              x2={corte.x}
              y1={EJE - corte.alto}
              y2={EJE + corte.alto}
            />
          ))}
        </svg>

        {/* El eje y el pulso. En CSS y no en el SVG por dos motivos: el eje va
            de la primera compuerta a la última —`50 % / n` por cada lado, que
            es la misma cuenta de las columnas— y el pulso necesita un hijo que
            se desplace en porcentaje del recorrido. Sin texto dentro. */}
        <span className={styles.eje} aria-hidden="true">
          <span className={styles.pulso} />
        </span>

        {/* Lo que sale. En CSS y no en el SVG a propósito: se tiende con un
            `scaleX`, así que NO necesita `stroke-dasharray` sobre un
            `pathLength` normalizado — que es justo la pareja que ya dejó las
            dos curvas de la tesis pintadas al 85 % en un proyector. Un trazo
            recto no tiene por qué pagar ese riesgo. */}
        <span className={styles.salida} aria-hidden="true" />

        {/* Una lista ordenada porque los cuatro tiempos van en orden, y el DOM
            es quien lo dice: en pantalla se leen de izquierda a derecha, que
            es el mismo orden. */}
        <ol className={styles.compuertas}>
          {pasos.map((paso, i) => (
            <li className={styles.compuerta} key={paso.number} style={{ "--i": i } as CSSProperties}>
              {/* El numeral queda fuera del árbol de accesibilidad: la lista
                  ordenada ya dice el orden, y anunciar «cero uno» antes de
                  cada tiempo lo repite. Lo que aporta es visual — es el aro
                  por el que pasa el haz. */}
              <span className={styles.aro} aria-hidden="true">
                {paso.number}
              </span>
              <h2 className={styles.tiempo}>{paso.title}</h2>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

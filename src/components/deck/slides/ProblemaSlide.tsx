import { DECK_COPY } from "@/content/deck";
import { Contador } from "../Contador.client";
import { COMPAS, SeisBarras, T_CIFRA } from "../figures/SeisBarras";
import { Slide } from "../Slide";
import styles from "../deck.module.css";

const { pregunta, respuesta, cifra, cuerpo, fuente } = DECK_COPY.problema;

/**
 * El nombre accesible de la lámina, y la contraparte exacta del `aria-hidden`
 * del contador: la cifra en movimiento no se anuncia, así que el dato tiene
 * que estar declarado COMPLETO y EN PALABRAS en algún sitio que sí se lea.
 *
 * ⚠️ No sale de `DECK_COPY` y no puede salir: es el mismo dato deletreado, no
 * otro texto. Si alguien tocara `cifra.valor` o `cifra.antetitulo`, esta frase
 * empezaría a mentir en silencio. Los tres números que dice —uno de cada seis,
 * doscientos por ciento— son los de `DECK_COPY.problema.cifra`, verificados
 * contra arXiv:1304.0265.
 *
 * ⚠️ **No empieza por el titular, a propósito.** Antes abría con «El promedio no
 * es el riesgo:», las mismas seis palabras del <h1>, y entrar en la región le
 * daba a un lector de pantalla la frase dos veces seguidas —exactamente la
 * región homónima contra la que avisa `Slide.tsx`—. Quitado el prefijo, el
 * nombre de la región dice lo que el <h1> no puede decir (el dato, en palabras)
 * y el <h1> dice lo suyo. No se pierde ni un dato: la cifra, la proporción y el
 * qué siguen enteros.
 */
const ETIQUETA =
  "Uno de cada seis proyectos de tecnología de la información se sale doscientos por ciento del presupuesto.";

/**
 * Lámina 2 · El problema.
 *
 * La lámina que instala el problema, y la única del deck con un dato duro
 * dentro. La cifra no sube sola: sube contra una figura que explica POR QUÉ el
 * promedio engaña. Cinco barras se detienen en la marca del presupuesto y la
 * sexta sigue creciendo; el numeral llega a 200 en el mismo instante en que
 * esa barra se detiene, porque los dos leen el mismo compás —`RITMO` en
 * `figures/SeisBarras.tsx`— y ninguno tiene un segundo escrito por su cuenta.
 *
 * El bloque de la cifra recibe `COMPAS` para poder aparecer con `--inicio`,
 * justo antes de que arranque la cascada. Es también lo que esconde el único
 * fotograma en que el contador pinta su valor final: se renderiza a 200 para
 * que no haya discrepancia de hidratación, y ese fotograma ocurre mientras el
 * bloque todavía está a opacidad 0.
 */
export function ProblemaSlide({ id }: { id: string }) {
  return (
    <Slide id={id} etiqueta={ETIQUETA}>
      <div className={styles.problemaRejilla}>
        <div className={`${styles.bloque} ${styles.escalonado}`}>
          <p className={styles.pregunta}>{pregunta}</p>
          <h1 className={styles.respuesta}>{respuesta}</h1>
          <p className={styles.cuerpo}>{cuerpo}</p>
          {/* ⚠️ El título del artículo va en `<span lang>`. El documento
              declara `es-CO` y sin esa marca un lector de pantalla en español
              pronuncia el título inglés con fonemas españoles (SC 3.1.2, AA).
              Es el enlace de la única fuente dura del deck: justo el texto que
              alguien va a querer leer para ir a comprobar la cifra.
              El idioma sale de la fuente, no de aquí. */}
          <p className={styles.pie}>
            <a className={styles.pieEnlace} href={fuente.url}>
              {fuente.label}{" "}
              <span lang={fuente.labelIdioma.lang}>{fuente.labelIdioma.texto}</span>
            </a>
            {` · ${fuente.muestra} · consultado `}
            {fuente.verifiedAt}
          </p>
        </div>

        <div className={styles.cifraBloque} style={COMPAS}>
          {/* ⚠️ El párrafo entero queda fuera del árbol de accesibilidad, no
              solo el numeral. Sus tres piezas son UNA frase partida alrededor
              de una cifra que no se anuncia —«1 de cada 6 · proyectos de TI se
              sale · 200 %»—, así que dejarlas expuestas le daría a un lector
              de pantalla una oración sin objeto. La misma frase, entera y en
              palabras, la dicen el `aria-label` de la lámina y el párrafo de
              cuerpo («uno de cada seis se va al 200 %»). No se pierde nada. */}
          <p className={styles.cifraTexto} aria-hidden="true">
            <span className={styles.cifraLinea}>{cifra.antetitulo}</span>
            <span className={styles.cifraLinea}>{cifra.pie}</span>
            <span className={styles.cifra}>
              <Contador
                hasta={cifra.valor}
                retraso={T_CIFRA.retraso}
                duracion={T_CIFRA.duracion}
                sufijo={cifra.sufijo}
              />
            </span>
          </p>
          <SeisBarras />
        </div>
      </div>
    </Slide>
  );
}

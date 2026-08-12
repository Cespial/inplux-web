import type { DeckSlide } from "@/content/deck";
import { Slide } from "../Slide";
import deck from "../deck.module.css";
import styles from "./producto.module.css";

/** El perfil que trae la lámina de producto, sin volver a nombrar su tipo. */
type Perfil = Extract<DeckSlide, { kind: "producto" }>["perfil"];

/**
 * La ficha de producto. Una sola lámina para todos los productos: la serie es
 * el argumento, así que las fichas tienen que ser IDÉNTICAS en forma para que
 * lo único que cambie sea el dominio. Es también la razón de que el modelo
 * repita el kind `producto` en láminas contiguas —`verify-deck-model.test.mjs`
 * lo exceptúa a propósito— y de que este archivo no sepa cuántas hay.
 *
 * ⚠️ **Aquí no se escribe ni una cadena de contenido.** Todo lo visible sale de
 * `workProfiles` en `src/content/work.ts`: el número, el dominio, el nombre, el
 * titular, el bloque de interfaz, la atribución, el estado y la fuente. No hay
 * copy de esta lámina en `deck.copy.ts` porque no hace falta ninguno — y por eso
 * añadir un producto a `work.ts` añade una lámina completa sin tocar una línea
 * de aquí.
 *
 * ⚠️ **Ni un conteo de productos, tampoco en los comentarios.** Esta lámina no
 * dice cuántos productos hay ni qué número ocupa en el deck: su posición es
 * 7 + el índice del perfil, y un producto nuevo la movería.
 *
 * El pie es el que sostiene la lámina entera: sin la fuente y su fecha, la
 * ficha sería una diapositiva de producto como cualquier otra. Con ella, cada
 * cosa que la lámina afirma se puede ir a comprobar — que es exactamente lo que
 * la lámina de la evidencia acaba de prometer.
 */
export function ProductoSlide({ id, perfil }: { id: string; perfil: Perfil }) {
  const fuente = perfil.sources[0];

  // ⚠️ **`perfil.partners` NO se pinta en el deck, y es una divergencia
  // deliberada respecto del sitio.** El sitio conserva la atribución de las
  // partes —`/trabajo/laudos` nombra a REDEK y su papel— y el deck la omite:
  // decisión del dueño del 11-ago-2026, escrita en el spec §13.6 y §2.1a, en el
  // plan y en `progress.md`. Antes se pintaba una lista de aliados filtrada, y
  // la ficha de arbitraje salía a la sala con un tercero nombrado.
  //
  // ⚠️ `DECK.md:201` dice lo contrario («donde haya socio real y confirmado, se
  // nombra como el sitio ya lo nombra»). Es el documento anterior y la decisión
  // 13.6 es posterior y más específica, así que manda 13.6 — pero la
  // contradicción entre los dos papeles sigue abierta y la cierra el dueño. Si
  // se revierte, se revierte AQUÍ y no volviendo a mostrar `description` ni
  // `attribution.statement`, que también traen el nombre.

  // ⚠️ **La métrica publicada no siempre es una cifra.** Hay productos cuya
  // métrica es una palabra, y una palabra en versal al cuerpo de la serie pesa
  // el doble que un número con sus huecos: medido a 390 px, la palabra tenía
  // más masa que el nombre del producto y la ficha se leía con dos titulares.
  // Se pregunta por la FORMA del valor, no por el producto: ningún nombre de
  // producto se escribe aquí y un producto nuevo cae solo del lado que le toca.
  const metricaEsCifra = /^\p{Nd}/u.test(perfil.interface.primaryMetric);

  return (
    <Slide id={id}>
      <div className={styles.rejilla}>
        <div className={`${deck.bloque} ${deck.escalonado}`}>
          {/* El numeral, el dominio y la madurez, en el registro de rótulo del
              deck. El numeral es el del perfil (`number`), no la posición de la
              lámina: es el mismo que rotula el producto en /trabajo.
              ⚠️ El estado sube aquí desde el pie a propósito. Abajo iba pegado
              a la atribución y a la fuente en un solo renglón —«Desarrollo de
              INPLUX · Beta cerrada · Sitio oficial de X · consultado …»—, y ese
              orden le presta a una DECLARACIÓN nuestra el peso de una cita: en
              cuatro de los cinco perfiles la fuente respalda lo que el producto
              publica, no quién lo construyó, y el propio `work.ts` lo dice. En
              el rótulo, la madurez se lee junto al dominio, que es lo que es. */}
          <p className={deck.pregunta}>
            {perfil.number} · {perfil.category} · {perfil.status.label}
          </p>

          <h1 className={deck.respuesta}>{perfil.name}</h1>

          {/* El titular del producto, que es su tesis en una línea. El deck no
              lo reescribe: lo lee de donde ya vive. */}
          <p className={deck.cuerpo}>{perfil.headline}</p>

          {/* El pie, con las dos cosas en dos renglones y no en uno: arriba
              quién lo hizo —una declaración de INPLUX—, abajo la fuente y su
              fecha —una cita, que es otra clase de cosa—. El salto lo da
              `.pieFuente`, que ya era un bloque. */}
          <p className={deck.pie}>
            {perfil.attribution.label}
            <span className={styles.pieFuente}>
              <a className={deck.pieEnlace} href={fuente.url}>
                {fuente.label}
              </a>
              {" · consultado "}
              {fuente.verifiedAt}
            </span>
          </p>
        </div>

        {/* El bloque de interfaz del producto: lo que su propia superficie
            pública muestra, con el mismo texto que /trabajo. No es una captura
            ni una promesa: son los rótulos y valores que el producto publica, y
            la fuente del pie es la que los respalda. */}
        <div className={styles.panel}>
          <p className={styles.panelRotulo}>{perfil.interface.eyebrow}</p>

          <p className={styles.metrica}>
            <span
              className={
                metricaEsCifra
                  ? styles.metricaValor
                  : `${styles.metricaValor} ${styles.metricaValorPalabra}`
              }
            >
              {perfil.interface.primaryMetric}
            </span>
            <span className={styles.metricaPie}>{perfil.interface.metricLabel}</span>
          </p>

          {/* Pares rótulo/valor: `<dl>` porque eso es exactamente lo que son, y
              así un lector de pantalla los anuncia emparejados en vez de como
              seis textos sueltos. El `<div>` que envuelve cada par es HTML
              válido dentro de un `<dl>` y es lo que permite maquetar la fila. */}
          <dl className={styles.datos}>
            {perfil.interface.items.map((item) => (
              <div className={styles.dato} key={item.label}>
                <dt className={styles.datoEtiqueta}>{item.label}</dt>
                <dd
                  className={
                    // `state` es opcional y cada producto declara acentuado
                    // solo el valor que él destaca, así que hay ítems que no
                    // traen el campo: se pregunta por su presencia, no se
                    // asume. Con `as const` en `work.ts` los que no lo
                    // declaran ni siquiera tienen la propiedad en su tipo.
                    "state" in item && item.state === "accent"
                      ? `${styles.datoValor} ${styles.datoValorAcento}`
                      : styles.datoValor
                  }
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Slide>
  );
}

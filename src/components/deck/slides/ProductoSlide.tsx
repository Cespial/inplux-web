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

  // ⚠️ **`partners` son las PARTES, no «nuestros aliados»**, y una de ellas
  // somos nosotros: el producto de arbitraje declara `REDEK · Criterio legal` y
  // `INPLUX · Desarrollo técnico`. Pintar la lista entera detrás de
  // `attribution.label` daba «Desarrollo técnico de INPLUX · … · INPLUX ·
  // Desarrollo técnico» —el mismo nombre y el mismo papel dos veces en el mismo
  // renglón—, que en la sala se lee como una errata. Visto en la captura, no en
  // el arnés: para él era una línea de texto más y dio `ok`.
  //
  // Se quita la parte que la atribución ya nombra, preguntándoselo a la propia
  // atribución en vez de escribir aquí a quién hay que excluir: así el día que
  // una ficha atribuya a otra casa, el filtro sigue siendo correcto y este
  // archivo no se entera.
  const aliados = perfil.partners.filter(
    (parte) => !perfil.attribution.label.includes(parte.name),
  );

  return (
    <Slide id={id}>
      <div className={styles.rejilla}>
        <div className={`${deck.bloque} ${deck.escalonado}`}>
          {/* El numeral y el dominio, en el registro de rótulo del deck. El
              numeral es el del perfil (`number`), no la posición de la lámina:
              es el mismo que rotula el producto en /trabajo. */}
          <p className={deck.pregunta}>
            {perfil.number} · {perfil.category}
          </p>

          <h1 className={deck.respuesta}>{perfil.name}</h1>

          {/* El titular del producto, que es su tesis en una línea. El deck no
              lo reescribe: lo lee de donde ya vive. */}
          <p className={deck.cuerpo}>{perfil.headline}</p>

          <p className={deck.pie}>
            {perfil.attribution.label} · {perfil.status.label}
            {/* Los aliados solo aparecen donde los hay. Se recorre la lista en
                vez de preguntar por el producto, así que un aliado nuevo en
                `work.ts` se pinta solo y ninguno se queda fuera. */}
            {aliados.map((aliado) => (
              <span key={aliado.name}>
                {" · "}
                {aliado.name} · {aliado.role}
              </span>
            ))}
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
            <span className={styles.metricaValor}>{perfil.interface.primaryMetric}</span>
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

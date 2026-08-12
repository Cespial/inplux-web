import Image from "next/image";
import type { WorkSource } from "@/content/work";
import {
  CAPTURA_ALTO,
  CAPTURA_ANCHO,
  urlVisible,
  type WorkCapture,
} from "@/content/work-captures";
import { formatShortDate, verificationDateFor } from "@/content/work-format";
import styles from "./captura-enmarcada.module.css";

/**
 * El ancho que la captura ocupa en la lámina, para `next/image`.
 *
 * ⚠️ **Se exporta porque la ruta lo necesita.** `/deck/presentacion` monta UNA
 * lámina cada vez, así que la captura de la ficha de producto no se pide al
 * abrir el deck: se pide al llegar a ella, en mitad de la presentación y con la
 * red de la sala. La ruta emite un `<link rel="preload">` por captura con el
 * `srcSet` que produce `getImageProps` con estos mismos valores; si el `sizes`
 * de allí y el de aquí se separaran, el navegador descargaría dos veces —la
 * precargada y la que de verdad usa— y la precarga costaría el doble en vez de
 * ahorrar. Por eso el número vive una vez y lo importan los dos.
 *
 * Los porcentajes salen de la rejilla de `producto.module.css`, medidos contra
 * los `clamp` reales del margen y del hueco: por encima de 62 rem la columna de
 * la evidencia es 0,475 de lo que queda entre márgenes —**588 px a 1440
 * (40,85 %), 798 px a 1920 (41,6 %) y 405 px a 992 (40,8 %)**—; por debajo la
 * lámina se apila y la captura ocupa el ancho entero menos los márgenes (342 px
 * sobre 390, o sea 87,7 %).
 *
 * ⚠️ **El 41 no es un redondeo cómodo: decide cuánto pesa el deck.** Los
 * candidatos que emite el optimizador saltan de 1.200 a 1.920, y a 1440 con DPR
 * 2 la caja pide 1.176 px de imagen. Con `42vw` el navegador calcula 1.210 y se
 * lleva el candidato de 1.920 —que devuelve el archivo entero, porque el
 * original topa en 1.440—: **198 KB las cinco**. Con `41vw` calcula 1.181, se
 * lleva el de 1.200 y son **152 KB, un 23 % menos**, sirviendo 1.200 px para una
 * caja que necesita 1.176: exacto, no recortado. Medido las dos veces con el
 * peso real de las respuestas.
 */
export const CAPTURA_SIZES = "(max-width: 62rem) 92vw, 41vw";

/**
 * Una captura de página real, enmarcada.
 *
 * **Por qué un marco y no una imagen a sangre.** Sobre fondo claro el contraste
 * de luminancia no separa la figura del fondo: una captura de interfaz clara da
 * ~1,05:1 contra el papel y no tiene silueta; una oscura da 11–14,5:1 y se lee
 * como un ladrillo pegado. Lo que separa es la **frontera cerrada** —un hilo,
 * un radio, una sombra mínima y la barra del navegador—, que es el sustituto
 * exacto del halo que en un deck oscuro hace la luz. Con el marco puesto da
 * igual que la captura sea la de Porkia (verde a sangre) o la de Kelsen (casi
 * blanca): las cinco se leen como el mismo objeto y la serie se conserva.
 *
 * **El pie es lo que la convierte en evidencia.** Sin él esto es una
 * ilustración de producto como cualquier otra. Con la URL en la barra, la fecha
 * en que se tomó y las fuentes del perfil con su verificación, cada cosa que la
 * lámina afirma se puede ir a comprobar.
 *
 * ⚠️ **Nada de esto se escribe: se deriva.** La URL visible sale de la que se
 * enmarca; la fecha, del acta; el número de fuentes, del propio perfil; y la
 * fecha de verificación, de `verificationDateFor`, que **revienta el build** si
 * la URL enmarcada no es exactamente una de las fuentes del perfil. Un
 * `sourceUrl` con un carácter de más no publica una fecha prestada: no compila.
 */
export function CapturaEnmarcada({
  captura,
  sources,
}: {
  captura: WorkCapture;
  sources: readonly WorkSource[];
}) {
  const fuentes = sources.length;

  return (
    <figure className={styles.captura}>
      <div className={styles.marco}>
        {/* La barra del navegador. Los tres puntos son decoración y no llevan
            texto, así que salen del árbol de accesibilidad; la URL sí es
            contenido y se lee. */}
        <p className={styles.cromo}>
          <span className={styles.puntos} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className={styles.url}>{urlVisible(captura.sourceUrl)}</span>
        </p>

        <Image
          className={styles.lienzo}
          src={captura.src}
          alt={captura.alt}
          width={CAPTURA_ANCHO}
          height={CAPTURA_ALTO}
          sizes={CAPTURA_SIZES}
        />
      </div>

      {/* El acta, FUERA del marco a propósito: dentro se ve lo que enseñaba la
          página, y aquí lo que decimos nosotros sobre ella. Mezclarlas metería
          texto nuestro dentro de algo que se presenta como una captura.
          El registro —mono en versalita, rótulo en gris y dato en tinta— es el
          mismo par rótulo/valor del panel de al lado, para que el pie se lea
          como un dato y no como una nota legal. */}
      <figcaption className={styles.acta}>
        <span>
          Captura de navegador · <b className={styles.dato}>{formatShortDate(captura.capturedAt)}</b>
        </span>
        <span>
          <b className={styles.dato}>{fuentes}</b> {fuentes === 1 ? "fuente" : "fuentes"} ·
          verificada <b className={styles.dato}>{verificationDateFor(sources, captura.sourceUrl)}</b>
        </span>
      </figcaption>
    </figure>
  );
}

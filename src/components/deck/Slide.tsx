import type { ReactNode } from "react";
import styles from "./deck.module.css";

/**
 * La caja de una lámina. `data-slide` es el contrato con el arnés de QA.
 *
 * Sin `aria-label` por defecto, a propósito: el nombre accesible de la lámina
 * lo pone el slot del riel —«12 de 14: Porkia»— y el título visible lo pone el
 * <h1> de dentro. Etiquetar además la <section> con el mismo texto la
 * convertía en una región homónima de su propio encabezado y dejaba al lector
 * de pantalla anunciando tres variaciones del mismo título.
 *
 * `etiqueta` queda para la lámina que algún día necesite un nombre PROPIO,
 * distinto del de su encabezado. Ninguna lo necesita hoy.
 */
export function Slide({
  id,
  children,
  etiqueta,
}: {
  id: string;
  children: ReactNode;
  etiqueta?: string;
}) {
  return (
    <section className={styles.lamina} data-slide={id} aria-label={etiqueta}>
      {children}
    </section>
  );
}

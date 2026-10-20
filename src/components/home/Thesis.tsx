import type { ReactNode } from "react";
import { homeCopyEs } from "@/content/copy/es";
import type { ThesisCopy } from "@/content/copy/types";
import homeStyles from "./home.module.css";
import styles from "./Thesis.module.css";

/**
 * La tesis en una frase, justo debajo del muro de clientes: primero la prueba,
 * después la afirmación. La cinta de cifras del hero se muda aquí (`children`),
 * porque las cifras son el argumento de la frase y no del titular.
 */
export function Thesis({
  copy = homeCopyEs.thesis,
  children,
}: {
  copy?: ThesisCopy;
  children?: ReactNode;
}) {
  return (
    <section id="tesis" className={styles.thesis} aria-labelledby="thesis-title">
      <div className={styles.inner}>
        <p className={`${homeStyles.eyebrow} ${homeStyles.eyebrowArrow}`}>{copy.eyebrow}</p>
        <h2 id="thesis-title" className={styles.statement}>
          {copy.lead} <em>{copy.emphasis}</em>
        </h2>
      </div>
      {children}
    </section>
  );
}

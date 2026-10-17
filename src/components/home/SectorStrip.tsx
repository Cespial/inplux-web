import Link from "next/link";
import { homeCopyEs } from "@/content/copy/es";
import type { SectorStripCopy } from "@/content/copy/types";
import styles from "./SectorStrip.module.css";

/**
 * La fila de sectores. Sustituye a los dos paneles de «Dónde trabajamos»:
 * una retícula hairline con una celda por sector, enlazada a su página cuando
 * la tiene. Conserva #donde-trabajamos; los otros fragmentos históricos de
 * la sección (#publico, #privado, #empresas) los pone la página justo antes,
 * donde `verify-public-content` los busca.
 */
export function SectorStrip({ copy = homeCopyEs.sectorStrip }: { copy?: SectorStripCopy }) {
  return (
    <section
      id="donde-trabajamos"
      className={styles.strip}
      aria-labelledby="sector-strip-title"
    >
      <div className={styles.grid} role="region" aria-label={copy.ariaLabel}>
        <div className={styles.intro}>
          <p>{copy.eyebrow}</p>
          <h2 id="sector-strip-title">{copy.title}</h2>
        </div>
        {copy.items.map((item) => {
          const content = (
            <>
              <span>{item.label}</span>
              <small>{item.detail}</small>
              {item.note ? <em>{item.note}</em> : <i aria-hidden="true">→</i>}
            </>
          );
          return item.href ? (
            <Link className={styles.item} href={item.href} key={item.label}>
              {content}
            </Link>
          ) : (
            <div className={`${styles.item} ${styles.itemMuted}`} key={item.label}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}

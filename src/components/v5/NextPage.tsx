import Link from "next/link";
import ui from "./v5.module.css";
import styles from "./NextPage.module.css";

/**
 * La línea final de una página que no termina en un cierre de contacto: a
 * dónde seguir leyendo. Un enlace, no un botón, para que no cuente como
 * disparador de contacto.
 */
export function NextPage({ href, label, note }: { href: string; label: string; note?: string }) {
  return (
    <nav className={styles.next} aria-label="Siguiente página">
      <div className={`${ui.wrap} ${styles.inner}`} data-reveal="quiet">
        <p className={ui.eyebrow}>Siguiente</p>
        <Link href={href} className={styles.link}>
          <span>{label}</span>
          <span aria-hidden="true">→</span>
        </Link>
        {note ? <p className={styles.note}>{note}</p> : null}
      </div>
    </nav>
  );
}

import type { ReactNode } from "react";
import ui from "./v5.module.css";
import styles from "./LegalShell.module.css";

/**
 * Página de texto largo (marca, estados del sistema, futuras legales): un
 * título, un subtítulo, la fecha de actualización y el cuerpo en una columna
 * de lectura. El `<h1>` es el de la ruta.
 */
export function LegalShell({
  eyebrow,
  title,
  subtitle,
  updated,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  updated?: { label: string; value: string };
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <header className={`${ui.wrap} ${styles.head}`}>
        <p className={ui.eyebrow}>{eyebrow}</p>
        <h1 className={ui.d2}>{title}</h1>
        {subtitle ? <p className={ui.lead}>{subtitle}</p> : null}
        {updated ? (
          <p className={styles.updated}>
            <span>{updated.label}</span> {updated.value}
          </p>
        ) : null}
      </header>
      <div className={`${ui.wrap} ${styles.body}`}>{children}</div>
    </div>
  );
}

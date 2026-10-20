import Link from "next/link";
import styles from "./StatRow.module.css";

/**
 * Cifras con fuente: tres columnas con el número grande, su unidad, una línea
 * de detalle y el enlace a lo que las sustenta. Ninguna cifra se escribe en la
 * página: llegan ya calculadas desde el contenido.
 */
export type Stat = {
  who?: string | null;
  value: string;
  unit: string;
  detail?: string;
  source: { label: string; href: string };
};

export function StatRow({
  items,
  ariaLabel,
  title,
  id,
}: {
  items: readonly Stat[];
  ariaLabel: string;
  title?: string;
  id?: string;
}) {
  return (
    <div className={styles.proof} id={id}>
      {title ? <p className={styles.proofTitle}>{title}</p> : null}
      <ul className={styles.cases} aria-label={ariaLabel} data-reveal-children="">
        {items.map((item) => (
          <li className={styles.case} key={item.source.href + item.unit}>
            {item.who ? <p className={styles.who}>{item.who}</p> : null}
            <strong>{item.value}</strong>
            <p className={styles.unit}>{item.unit}</p>
            {item.detail ? <p>{item.detail}</p> : null}
            <p className={styles.src}>
              {item.source.href.startsWith("#") ? (
                <a href={item.source.href}>{item.source.label}</a>
              ) : (
                <Link href={item.source.href}>{item.source.label}</Link>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

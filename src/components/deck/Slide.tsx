import type { ReactNode } from "react";
import styles from "./deck.module.css";

export function Slide({
  id,
  titulo,
  children,
  etiqueta,
}: {
  id: string;
  titulo: string;
  children: ReactNode;
  etiqueta?: string;
}) {
  return (
    <section className={styles.lamina} data-slide={id} aria-label={etiqueta ?? titulo}>
      {children}
    </section>
  );
}

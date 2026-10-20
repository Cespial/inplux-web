import styles from "./system-states.module.css";

/* Sin logo ni texto que parpadee en cargas cortas: solo la línea de carga. */
export default function Loading() {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <span className={styles.visuallyHidden}>Cargando página</span>
      <i aria-hidden="true" />
    </div>
  );
}

import Image from "next/image";
import styles from "./system-states.module.css";

export default function Loading() {
  return (
    <div className={styles.loading} role="status" aria-live="polite" aria-label="Cargando página">
      <div className={styles.loadingTop}>
        <Image
          src="/brand/logos/inplux-logo-horizontal-inverse.svg"
          alt="INPLUX"
          width={403}
          height={112}
          priority
        />
        <span>PREPARANDO EXPERIENCIA</span>
      </div>
      <div className={styles.loadingStage} aria-hidden="true">
        <span>CONTEXTO</span>
        <span>CRITERIO</span>
        <span>PRODUCTO</span>
        <i />
      </div>
      <p className={styles.loadingMessage}>Cargando la siguiente ruta…</p>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./system-states.module.css";

export default function GlobalError() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.focus();
  }, []);

  return (
    <html lang="es-CO">
      <body>
        <main
          ref={mainRef}
          className={styles.errorState}
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
        >
          <div className={styles.stateMeta}>
            <span>SYS / ERROR</span>
            <span>INPLUX FACTORY</span>
          </div>
          <div className={styles.stateCopy}>
            <p>La experiencia no pudo iniciar.</p>
            <h1>
              Volvamos a un estado <em>seguro.</em>
            </h1>
            <p>Recarga la página. Si el problema continúa, puedes volver al inicio.</p>
            <div className={styles.stateActions}>
              <button type="button" onClick={() => window.location.reload()}>
                Recargar <span aria-hidden="true">↻</span>
              </button>
              <Link href="/">Volver al inicio</Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

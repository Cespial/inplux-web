"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./system-states.module.css";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    console.error(error);
    mainRef.current?.focus();
  }, [error]);

  return (
    <main
      ref={mainRef}
      id="main-content"
      className={styles.errorState}
      role="alert"
      aria-live="assertive"
      tabIndex={-1}
    >
      <div className={styles.stateMeta}>
        <span>SYS / ERROR</span>
        <span>{error.digest ? `REF ${error.digest}` : "ESTADO RECUPERABLE"}</span>
      </div>
      <div className={styles.stateCopy}>
        <p>La ruta encontró una interrupción.</p>
        <h1>
          Podemos intentar de <em>nuevo.</em>
        </h1>
        <p>
          Tu información no se envió ni se perdió desde esta pantalla. Reintenta la
          carga o vuelve al inicio.
        </p>
        <div className={styles.stateActions}>
          <button type="button" onClick={reset}>
            Reintentar <span aria-hidden="true">↻</span>
          </button>
          <Link href="/">Volver al inicio</Link>
        </div>
      </div>
    </main>
  );
}

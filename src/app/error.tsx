"use client";

import { useEffect, useRef } from "react";
import { Button, buttonClass, v5 as ui } from "@/components/v5/primitives";
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
    <div className={ui.root}>
      <main
        ref={mainRef}
        id="main-content"
        className={styles.state}
        role="alert"
        aria-live="assertive"
        tabIndex={-1}
      >
        <div className={`${ui.wrap} ${styles.stateInner}`}>
          <p className={ui.eyebrow}>{error.digest ? `Error · ref. ${error.digest}` : "Error"}</p>
          <h1 className={ui.d2}>
            Algo falló al cargar <em>esta página.</em>
          </h1>
          <p className={ui.lead}>
            No se envió ni se perdió nada desde esta pantalla. Intenta de nuevo o vuelve al inicio.
          </p>
          <div className={ui.actions}>
            <button type="button" className={buttonClass("primary")} onClick={reset}>
              Reintentar
            </button>
            <Button href="/">Volver al inicio</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

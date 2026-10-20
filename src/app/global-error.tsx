"use client";

import { useEffect, useRef } from "react";
import { buttonClass, v5 as ui } from "@/components/v5/primitives";
import "./globals.css";
import styles from "./system-states.module.css";

export default function GlobalError() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.focus();
  }, []);

  return (
    <html lang="es-CO">
      <body>
        <div className={ui.root}>
          <main
            ref={mainRef}
            className={styles.state}
            role="alert"
            aria-live="assertive"
            tabIndex={-1}
          >
            <div className={`${ui.wrap} ${styles.stateInner}`}>
              <p className={ui.eyebrow}>Error</p>
              <h1 className={ui.d2}>
                El sitio no pudo <em>iniciar.</em>
              </h1>
              <p className={ui.lead}>Recarga la página. Si el problema sigue, vuelve al inicio.</p>
              <div className={ui.actions}>
                <button
                  type="button"
                  className={buttonClass("primary")}
                  onClick={() => window.location.reload()}
                >
                  Recargar
                </button>
                {/* Un <a> y no <Link>: aquí el enrutador puede ser lo que falló. */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a className={buttonClass("ghost")} href="/">
                  Volver al inicio
                </a>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

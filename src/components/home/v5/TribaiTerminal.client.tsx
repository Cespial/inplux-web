"use client";

import { useSyncExternalStore } from "react";
import type { HomeCopy } from "@/content/copy/types";
import styles from "./home-v5.module.css";

/*
 * La terminal decorativa de Tribai en la portada. El marco (barra y caja) sale
 * en el HTML del servidor; las líneas de la llamada y la respuesta se montan en
 * el cliente. Es decoración —`role="img"` con su etiqueta—, y así el texto de
 * una respuesta de ejemplo no forma parte del texto de la página. La caja
 * reserva su alto en CSS para que montar las líneas no mueva nada.
 */
const subscribeNoop = () => () => {};

export function TribaiTerminal({ copy }: { copy: HomeCopy["v5"]["products"] }) {
  // `false` en el servidor y durante la hidratación; `true` en cuanto el cliente manda.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  return (
    <div className={styles.term} role="img" aria-label={copy.terminalAriaLabel}>
      <div className={styles.termBar}>
        <i>
          <span />
          <span />
          <span />
        </i>
        <p>tribai-mcp</p>
        <span>200 OK</span>
      </div>
      <pre>
        {mounted ? (
          <>
            <span className={`${styles.ln} ${styles.c}`}># {copy.terminalCall}</span>
            <span className={styles.ln}>
              <span className={styles.k}>tools/call</span> <span className={styles.u}>vigencia_articulo</span>
            </span>
            <span className={styles.ln}>
              {"{ "}
              <span className={styles.s}>&quot;articulo&quot;</span>: <span className={styles.s}>&quot;240&quot;</span>,{" "}
              <span className={styles.s}>&quot;norma&quot;</span>: <span className={styles.s}>&quot;Estatuto Tributario&quot;</span>
              {" }"}
            </span>
            <span className={styles.ln}> </span>
            <span className={`${styles.ln} ${styles.c}`}># {copy.terminalAnswer}</span>
            <span className={styles.ln}>{"{"}</span>
            <span className={styles.ln}>
              {"  "}
              <span className={styles.s}>&quot;titulo&quot;</span>:{" "}
              <span className={styles.s}>&quot;Tarifa general para personas jurídicas&quot;</span>,
            </span>
            <span className={`${styles.ln} ${styles.hl}`}>
              {"  "}
              <span className={styles.s}>&quot;tarifa&quot;</span>: <span className={styles.n}>0.35</span>,
            </span>
            <span className={`${styles.ln} ${styles.hl}`}>
              {"  "}
              <span className={styles.s}>&quot;modificado_por&quot;</span>:{" "}
              <span className={styles.s}>&quot;Ley 2277 de 2022, art. 10&quot;</span>,
            </span>
            <span className={styles.ln}>
              {"  "}
              <span className={styles.s}>&quot;vigente&quot;</span>: <span className={styles.n}>true</span>,
            </span>
            <span className={styles.ln}>
              {"  "}
              <span className={styles.s}>&quot;fuente&quot;</span>:{" "}
              <span className={styles.u}>&quot;secretariasenado.gov.co/…/estatuto_tributario&quot;</span>
            </span>
            <span className={styles.ln}>{"}"}</span>
          </>
        ) : null}
      </pre>
    </div>
  );
}

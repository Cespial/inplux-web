"use client";

import { useState } from "react";
import styles from "./LogoWall.module.css";

/**
 * Detiene y reanuda las cintas del muro. Un movimiento que dura más de cinco
 * segundos necesita un control para pararlo (WCAG 2.2.2): pausar al pasar el
 * cursor no le sirve a quien navega con teclado o con el dedo. El estado va
 * en `data-paused` de la sección, y el CSS congela las tres cintas con él.
 */
export function WallPause({ pause, play }: { pause: string; play: string }) {
  const [paused, setPaused] = useState(false);

  return (
    <button
      type="button"
      className={styles.pause}
      aria-pressed={paused}
      onClick={(event) => {
        const next = !paused;
        event.currentTarget.closest("section")?.toggleAttribute("data-paused", next);
        setPaused(next);
      }}
    >
      {paused ? play : pause}
    </button>
  );
}

"use client";

import { useEffect, useRef } from "react";
import ui from "./v5.module.css";

/**
 * El montaje del hero: diez tomas de dos segundos con corte seco.
 *
 * El video no lleva `autoPlay`: arranca al montar sólo si la persona no pidió
 * reducir el movimiento, y si lo pidió se queda en el póster. El orden de las
 * fuentes es el de peso: AV1, HEVC para Safari, y H.264 de 720p en pantallas
 * estrechas antes del de 1080p. Los créditos de cada toma están en
 * `public/media/CREDITOS.md`.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reduce.matches) {
        video.pause();
      } else {
        video.play().catch(() => {
          // Sin permiso de reproducción automática: queda el póster.
        });
      }
    };
    sync();
    reduce.addEventListener("change", sync);
    return () => reduce.removeEventListener("change", sync);
  }, []);

  return (
    <div className={ui.mediaBg} aria-hidden="true">
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/hero-poster.jpg"
      >
        <source src="/media/hero-av1.mp4" type='video/mp4; codecs="av01.0.08M.08"' />
        <source src="/media/hero-hevc.mp4" type='video/mp4; codecs="hvc1"' />
        <source src="/media/hero-720.mp4" type="video/mp4" media="(max-width: 760px)" />
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

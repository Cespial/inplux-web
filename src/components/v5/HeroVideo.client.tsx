"use client";

import { useEffect, useRef } from "react";
import ui from "./v5.module.css";

/**
 * El montaje de fondo de un hero: tomas de dos segundos con corte seco.
 *
 * El video no lleva `autoPlay`: arranca al montar sólo si la persona no pidió
 * reducir el movimiento, y si lo pidió se queda en el póster. El orden de las
 * fuentes es el de peso: AV1, HEVC para Safari, y H.264 de 720p en pantallas
 * estrechas antes del de 1080p. Los créditos de cada toma están en
 * `public/media/CREDITOS.md`.
 *
 * Sin props pinta el montaje de la portada; cada página puede traer el suyo.
 */
export type HeroVideoSource = {
  src: string;
  type: string;
  media?: string;
};

export const HOME_HERO_VIDEO = {
  poster: "/media/hero-poster.jpg",
  sources: [
    { src: "/media/hero-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
    { src: "/media/hero-hevc.mp4", type: 'video/mp4; codecs="hvc1"' },
    { src: "/media/hero-720.mp4", type: "video/mp4", media: "(max-width: 760px)" },
    { src: "/media/hero.mp4", type: "video/mp4" },
  ],
} as const satisfies { poster: string; sources: readonly HeroVideoSource[] };

export function HeroVideo({
  poster = HOME_HERO_VIDEO.poster,
  sources = HOME_HERO_VIDEO.sources,
}: {
  poster?: string;
  sources?: readonly HeroVideoSource[];
}) {
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
      <video ref={ref} muted loop playsInline preload="metadata" poster={poster}>
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} media={source.media} />
        ))}
      </video>
    </div>
  );
}

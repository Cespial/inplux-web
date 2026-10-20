"use client";

import { useEffect, useRef } from "react";
import { preload } from "react-dom";
import ui from "./v5.module.css";

export type HeroVideoSource = {
  src: string;
  type: string;
  /** Consulta de medios que limita la fuente (p. ej. la de 720p a pantallas estrechas). */
  media?: string;
};

/** El montaje de la portada: diez tomas de dos segundos con corte seco. */
export const HOME_HERO_VIDEO = {
  poster: "/media/hero-poster.jpg",
  sources: [
    { src: "/media/hero-720.mp4", type: "video/mp4", media: "(max-width: 760px)" },
    { src: "/media/hero-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
    { src: "/media/hero-hevc.mp4", type: 'video/mp4; codecs="hvc1"' },
    { src: "/media/hero.mp4", type: "video/mp4" },
  ],
} as const satisfies { poster: string; sources: readonly HeroVideoSource[] };

/**
 * Video de fondo de un hero. Sin props pinta el montaje de la portada; otra
 * página pasa su póster y sus fuentes.
 *
 * El video no lleva `autoPlay`: arranca al montar sólo si la persona no pidió
 * reducir el movimiento, y si lo pidió se queda en el póster. El orden de las
 * fuentes es el de peso: el 720p con su `media` va antes que las de 1080p para
 * que un teléfono no baje el archivo grande. Los créditos de cada toma están
 * en `public/media/CREDITOS.md`.
 *
 * El póster no va en el atributo `poster`, que admite una sola URL: va en un
 * `<picture>` detrás del video, en AVIF y WebP a tres anchos, con el JPEG de
 * 1920 como respaldo. Es el elemento más grande del primer pintado, así que
 * se precarga y pide prioridad alta. `poster` es la ruta del JPEG; las demás
 * variantes salen de ella por nombre (`scripts/hero-posters.mjs`).
 */
const POSTER_WIDTHS = [828, 1280, 1920] as const;

function posterSrcSet(poster: string, format: "avif" | "webp") {
  const base = poster.replace(/\.jpg$/, "");
  return POSTER_WIDTHS.map((width) => `${base}-${width}.${format} ${width}w`).join(", ");
}

export function HeroVideo({
  poster = HOME_HERO_VIDEO.poster,
  sources = HOME_HERO_VIDEO.sources,
}: {
  poster?: string;
  sources?: readonly HeroVideoSource[];
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const avif = posterSrcSet(poster, "avif");
  preload(poster, { as: "image", type: "image/avif", imageSrcSet: avif, imageSizes: "100vw", fetchPriority: "high" });

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reduce.matches) {
        video.pause();
      } else {
        video.play().catch(() => {
          // Sin permiso de reproducción automática: queda el póster detrás.
        });
      }
    };
    sync();
    reduce.addEventListener("change", sync);
    return () => reduce.removeEventListener("change", sync);
  }, []);

  return (
    <div className={ui.mediaBg} aria-hidden="true">
      <picture>
        <source type="image/avif" srcSet={avif} sizes="100vw" />
        <source type="image/webp" srcSet={posterSrcSet(poster, "webp")} sizes="100vw" />
        <img src={poster} alt="" width={1920} height={1080} fetchPriority="high" decoding="async" />
      </picture>
      <video ref={ref} muted loop playsInline preload="metadata">
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} media={source.media} />
        ))}
      </video>
    </div>
  );
}

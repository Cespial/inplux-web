"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import ui from "./v5.module.css";

export type HeroVideoSource = {
  src: string;
  type: string;
  /**
   * Consulta de medios que limita la fuente. Una fuente con `media` sólo se
   * ofrece cuando la consulta coincide; si alguna coincide, se ofrecen sólo
   * ésas y se descartan las que no llevan `media` (las de escritorio).
   */
  media?: string;
};

/** Pantallas estrechas: teléfonos y tabletas pequeñas en vertical. */
export const MOBILE_MEDIA = "(max-width: 760px)";

/** El complemento de `MOBILE_MEDIA`: donde el póster del hero es el LCP. */
const DESKTOP_MEDIA = "(min-width: 761px)";

/** El montaje de la portada: diez tomas de dos segundos con corte seco. */
export const HOME_HERO_VIDEO = {
  poster: "/media/hero-poster.jpg",
  sources: [
    { src: "/media/hero-480.mp4", type: "video/mp4", media: MOBILE_MEDIA },
    { src: "/media/hero-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
    { src: "/media/hero-hevc.mp4", type: 'video/mp4; codecs="hvc1"' },
    { src: "/media/hero.mp4", type: "video/mp4" },
  ],
} as const satisfies { poster: string; sources: readonly HeroVideoSource[] };

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * Con «ahorro de datos» activo o una conexión lenta (2G, 3G) el video no se
 * monta y la banda se queda en el póster. `navigator.connection` sólo existe
 * en Chromium; donde no está, se asume que la conexión permite el video.
 */
function connectionAllowsVideo() {
  const { connection } = navigator as Navigator & { connection?: NetworkInformation };
  if (!connection) return true;
  if (connection.saveData === true) return false;
  const type = connection.effectiveType;
  return type !== "slow-2g" && type !== "2g" && type !== "3g";
}

/** Las fuentes que aplican a esta pantalla (ver `HeroVideoSource.media`). */
function pickSources(sources: readonly HeroVideoSource[]) {
  const bound = sources.filter((source) => source.media && window.matchMedia(source.media).matches);
  return bound.length > 0 ? bound : sources.filter((source) => !source.media);
}

/**
 * Video de fondo de un hero. Sin props pinta el montaje de la portada; otra
 * página pasa su póster y sus fuentes.
 *
 * El HTML del servidor no lleva `<video>`: sólo el póster. Al montar, el
 * componente mira la conexión y la pantalla y entonces monta el video con las
 * fuentes que tocan —la de 480p en un teléfono, las de 1080p por códec en
 * escritorio— o no lo monta si la persona pidió ahorrar datos o la red es
 * lenta. Así un teléfono nunca pide el archivo grande ni, con ahorro de datos,
 * ningún archivo. Sin JavaScript queda el póster.
 *
 * El video no lleva `autoPlay`: arranca al montar sólo si la persona no pidió
 * reducir el movimiento, y si lo pidió se queda en el póster. Los créditos de
 * cada toma están en `public/media/CREDITOS.md`.
 *
 * El póster no va en el atributo `poster`, que admite una sola URL: va en un
 * `<picture>` detrás del video, en AVIF y WebP a tres anchos, con el JPEG de
 * 1920 como respaldo. `poster` es la ruta del JPEG; las demás variantes salen
 * de ella por nombre (`scripts/hero-posters.mjs`).
 *
 * La prioridad depende de la pantalla. En escritorio el hero mide menos que la
 * ventana y el póster es el elemento del LCP: se precarga con prioridad alta
 * (la precarga lleva `media`, así que sólo existe ahí). En un teléfono el hero
 * ocupa la ventana entera y Chrome no cuenta como LCP una imagen de ese tamaño
 * —lo es el logo del encabezado—; con prioridad alta el póster sólo le quitaba
 * ancho de banda al logo, a la fuente y al JavaScript, así que ahí se pide con
 * prioridad baja. Se ve igual: cambia el orden de la red, no el pintado.
 *
 * Con `lazy` (una banda a mitad de página) nada de eso: el póster carga
 * perezoso, el video no pide ni sus metadatos (`preload="none"`) hasta que la
 * banda queda a 300 px del viewport, y se pausa cuando sale.
 */
const POSTER_WIDTHS = [828, 1280, 1920] as const;

function posterSrcSet(poster: string, format: "avif" | "webp") {
  const base = poster.replace(/\.jpg$/, "");
  return POSTER_WIDTHS.map((width) => `${base}-${width}.${format} ${width}w`).join(", ");
}

export function HeroVideo({
  poster = HOME_HERO_VIDEO.poster,
  sources = HOME_HERO_VIDEO.sources,
  lazy = false,
}: {
  poster?: string;
  sources?: readonly HeroVideoSource[];
  lazy?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState<readonly HeroVideoSource[] | null>(null);
  const avif = posterSrcSet(poster, "avif");
  if (!lazy) {
    preload(poster, {
      as: "image",
      type: "image/avif",
      imageSrcSet: avif,
      imageSizes: "100vw",
      fetchPriority: "high",
      media: DESKTOP_MEDIA,
    });
  }

  const sourceKey = sources.map((source) => source.src).join("|");
  useEffect(() => {
    if (!connectionAllowsVideo()) return;
    setActive(pickSources(sources));
    // `sources` llega del servidor: se compara por sus rutas y no por identidad.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let near = !lazy;
    const sync = () => {
      if (reduce.matches || !near) {
        video.pause();
      } else {
        if (video.preload === "none") video.preload = "metadata";
        video.play().catch(() => {
          // Sin permiso de reproducción automática: queda el póster detrás.
        });
      }
    };
    const observer = lazy
      ? new IntersectionObserver(
          ([entry]) => {
            near = entry.isIntersecting;
            sync();
          },
          { rootMargin: "300px 0px" },
        )
      : null;
    observer?.observe(video);
    sync();
    reduce.addEventListener("change", sync);
    return () => {
      observer?.disconnect();
      reduce.removeEventListener("change", sync);
    };
  }, [lazy, active]);

  return (
    <div className={ui.mediaBg} aria-hidden="true">
      <picture>
        <source type="image/avif" srcSet={avif} sizes="100vw" />
        <source type="image/webp" srcSet={posterSrcSet(poster, "webp")} sizes="100vw" />
        <img
          src={poster}
          alt=""
          width={1920}
          height={1080}
          // Baja también arriba del pliegue: en escritorio manda la precarga.
          fetchPriority="low"
          loading={lazy ? "lazy" : undefined}
          decoding="async"
        />
      </picture>
      {active ? (
        <video ref={ref} muted loop playsInline preload={lazy ? "none" : "metadata"}>
          {active.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      ) : null}
    </div>
  );
}

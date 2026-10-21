import type { ReactNode } from "react";
import { HeroVideo, type HeroVideoSource } from "./HeroVideo.client";
import { cx, v5 as ui } from "./primitives";
import styles from "./VideoBand.module.css";

/**
 * Banda de video a sangre a mitad de página, como la segunda de la portada de
 * PRIMERO: el montaje detrás, un velo que oscurece de derecha a izquierda y el
 * título con su párrafo alineados a la derecha (a la izquierda en móvil). El
 * video es perezoso —no se pide hasta que la banda se acerca— y con
 * `prefers-reduced-motion` se queda en el póster. `children` va debajo del
 * video, sobre negro, para lo que necesita leerse quieto (las cifras).
 */
export function VideoBand({
  id,
  className,
  eyebrow,
  title,
  lead,
  poster,
  sources,
  children,
}: {
  id: string;
  /** Para ajustar una instancia (alto del escenario, aire inferior) sin tocar las demás. */
  className?: string;
  eyebrow: string;
  title: ReactNode;
  lead: string;
  poster: string;
  sources: readonly HeroVideoSource[];
  children?: ReactNode;
}) {
  const titleId = `${id}-title`;
  return (
    <section id={id} className={cx(styles.band, className)} aria-labelledby={titleId}>
      <div className={styles.stage}>
        <HeroVideo poster={poster} sources={sources} lazy />
        <div className={cx(ui.wrap, styles.copy)} data-reveal-children="">
          <p className={ui.eyebrow}>{eyebrow}</p>
          <h2 className={ui.d2} id={titleId}>
            {title}
          </h2>
          <p className={ui.lead}>{lead}</p>
        </div>
      </div>
      {children ? (
        <div className={ui.wrap} data-reveal-band="">
          {children}
        </div>
      ) : null}
    </section>
  );
}

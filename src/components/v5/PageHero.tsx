import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { HeroVideo, type HeroVideoSource } from "./HeroVideo.client";
import css from "./PageHero.module.css";
import ui from "./v5.module.css";

/**
 * El hero de una página: el único `<h1>` de la ruta, con ojo, lead y acciones
 * sobre un medio opcional (video del sitio, una imagen a sangre o nada).
 *
 * `titleLines` pinta el título en dos líneas controladas, como en la portada;
 * `title` acepta un nodo libre para los heros de una sola frase. `aside` pone
 * una figura a la derecha del texto (el mockup de una ficha de producto).
 */
export type HeroMedia =
  | { kind: "video"; poster?: string; sources?: readonly HeroVideoSource[] }
  | { kind: "image"; src: string; alt: string; width: number; height: number; priority?: boolean }
  | { kind: "none" };

export function PageHero({
  id,
  eyebrow,
  title,
  titleLines,
  lead,
  leadMuted,
  actions,
  media = { kind: "none" },
  crumbs,
  crumbsLabel = "Ruta",
  aside,
  className,
}: {
  id?: string;
  eyebrow: string;
  title?: ReactNode;
  titleLines?: readonly [string, string];
  lead: ReactNode;
  leadMuted?: ReactNode;
  actions?: ReactNode;
  media?: HeroMedia;
  crumbs?: readonly { label: string; href?: string }[];
  /** Nombre accesible de las migas, en el idioma de la página. */
  crumbsLabel?: string;
  aside?: ReactNode;
  className?: string;
}) {
  const text = (
    <>
      {crumbs ? (
        <nav className={ui.crumbs} aria-label={crumbsLabel}>
          {crumbs.map((crumb, index) => (
            <span key={crumb.label}>
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {crumb.href ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                <span aria-current={index === crumbs.length - 1 ? "page" : undefined}>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      ) : null}
      <p className={ui.eyebrow}>{eyebrow}</p>
      <h1 className={ui.d1}>
        {titleLines ? (
          <>
            <span>{titleLines[0]}</span>
            <span>{titleLines[1]}</span>
          </>
        ) : (
          title
        )}
      </h1>
      <p className={ui.lead}>
        {lead}
        {leadMuted ? (
          <>
            {" "}
            <span className={ui.muted}>{leadMuted}</span>
          </>
        ) : null}
      </p>
      {actions ? <div className={ui.actions}>{actions}</div> : null}
    </>
  );

  return (
    <div className={`${ui.hero}${className ? ` ${className}` : ""}`} id={id} data-header-theme="dark">
      {media.kind === "video" ? <HeroVideo poster={media.poster} sources={media.sources} /> : null}
      {media.kind === "image" ? (
        <div className={ui.mediaBg} aria-hidden="true">
          <Image
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            priority={media.priority}
            sizes="100vw"
          />
        </div>
      ) : null}
      {aside ? (
        <div className={`${ui.wrap} ${css.split}`}>
          <div className={ui.heroInner}>{text}</div>
          <div className={css.aside} data-reveal="media">
            {aside}
          </div>
        </div>
      ) : (
        <div className={`${ui.wrap} ${ui.heroInner}`}>{text}</div>
      )}
    </div>
  );
}

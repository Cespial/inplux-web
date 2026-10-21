"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { ContactLink, type ContactSource } from "@/components/site/ContactLink";
import { NEWS_EXPIRES, NEWS_PLATE, type NewsCopy } from "@/content/noticia";
import css from "./NewsTab.module.css";

/** Pantallas donde la tarjeta empieza cerrada para no tapar el hero. */
const COMPACT_MEDIA = "(max-width: 760px)";
const STORAGE_KEY = "inplux:news-sf";

function readStored(): boolean | null {
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY);
    return value === "open" ? true : value === "closed" ? false : null;
  } catch {
    return null;
  }
}

function writeStored(open: boolean) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, open ? "open" : "closed");
  } catch {
    // Navegación privada o almacenamiento bloqueado: el estado no se recuerda.
  }
}

/**
 * La pestaña vertical y su tarjeta de vidrio.
 *
 * Antes de hidratar —y sin JS— la tarjeta se ve abierta y su enlace lleva a
 * /contacto. Con JS, el CSS la cierra en móvil desde el primer pintado
 * (`scripting: enabled`) y el efecto fija el estado: el recordado en la
 * sesión o, si no hay, abierta en escritorio y cerrada en móvil.
 */
export function NewsTabClient({
  copy,
  source,
  fallbackHref,
}: {
  copy: NewsCopy;
  source: ContactSource;
  fallbackHref: string;
}) {
  const cardId = useId();
  // `null`: todavía sin decidir; manda el CSS por ancho de pantalla.
  const [open, setOpen] = useState<boolean | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    // Estado que solo existe en el navegador: se lee una vez al montar.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (Date.now() >= NEWS_EXPIRES) {
      setExpired(true);
      return;
    }
    setOpen(readStored() ?? !window.matchMedia(COMPACT_MEDIA).matches);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const toggle = useCallback(() => {
    setOpen((current) => {
      const next = !(current ?? !window.matchMedia(COMPACT_MEDIA).matches);
      writeStored(next);
      return next;
    });
  }, []);

  if (expired) return null;

  return (
    <div className={css.news} data-open={open === null ? undefined : String(open)} data-news-tab="">
      <div className={css.card} id={cardId}>
        <div className={css.plate}>
          {/* eslint-disable-next-line @next/next/no-img-element -- 16 KB fijos: el optimizador no gana nada y añadiría una petición al servidor */}
          <img
            src={NEWS_PLATE.src}
            width={NEWS_PLATE.width}
            height={NEWS_PLATE.height}
            alt={copy.plateAlt}
            decoding="async"
            fetchPriority="low"
          />
          <span>{copy.plateCaption}</span>
        </div>
        <p className={css.text}>
          {copy.body.map((segment) =>
            segment.strong ? <b key={segment.text}>{segment.text}</b> : segment.text,
          )}
        </p>
        <p className={css.meta}>
          <time dateTime={copy.dateTime}>{copy.date}</time>
          <ContactLink className={css.action} source={source} fallbackHref={fallbackHref}>
            {copy.action} <span aria-hidden="true">→</span>
          </ContactLink>
        </p>
      </div>
      <button
        type="button"
        className={css.tab}
        aria-expanded={open ?? true}
        aria-controls={cardId}
        aria-label={copy.tabLabel}
        onClick={toggle}
      >
        <span className={css.dot} aria-hidden="true" />
        {copy.tab}
      </button>
    </div>
  );
}

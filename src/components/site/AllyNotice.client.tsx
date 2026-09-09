"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { homeCopyEs } from "@/content/copy/es";
import type { AllyNoticeCopy } from "@/content/copy/types";
import { ALLY_NOTICE_EXPIRES, DIA_D_ALLIES, DIA_D_URL } from "@/content/dia-d";
import styles from "./AllyNotice.module.css";

/**
 * Marca de que alguien ya vio el aviso. Lleva el año del evento para que, si
 * hubiera una edición siguiente, la clave nueva no herede el cierre de esta.
 */
const SEEN_KEY = "inplux:aviso-dia-d-2026";

/** El aviso no interrumpe el modo presentación. */
const SILENT_PATHS = ["/deck"];

/** Lo que tarda en abrirse, para que la portada pinte antes que el aviso. */
const OPEN_DELAY_MS = 700;

function yaLoVio() {
  // En navegación privada leer `localStorage` puede lanzar. Ante la duda, se
  // muestra: es preferible repetir el aviso a tragárselo en silencio.
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function recordarQueLoVio() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* sin almacenamiento el aviso volverá a salir; no es motivo para romper */
  }
}

export function AllyNotice({
  copy = homeCopyEs.allyNotice,
}: {
  copy?: AllyNoticeCopy;
}) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openTimerRef = useRef<number | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previousOverflowRef = useRef({ body: "", html: "" });

  const silent = SILENT_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  const cerrar = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  /*
   * Las tres condiciones —evento pasado, aviso ya visto, ruta en silencio— se
   * resuelven aquí y no en el render. Dos de ellas sólo se pueden saber en el
   * cliente (`localStorage` y el reloj), y decidirlas al renderizar haría que
   * el HTML del servidor y el del cliente discreparan. El diálogo cerrado no
   * pinta nada ni carga sus imágenes, así que dejarlo montado no cuesta.
   */
  useEffect(() => {
    if (silent) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (Date.now() >= ALLY_NOTICE_EXPIRES) return;
    if (yaLoVio()) return;

    openTimerRef.current = window.setTimeout(() => {
      openTimerRef.current = null;
      if (!dialog.isConnected || dialog.open) return;
      previousOverflowRef.current = {
        body: document.body.style.overflow,
        html: document.documentElement.style.overflow,
      };
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      dialog.showModal();
      /*
       * El foco va al título, no al botón de cerrar. Al abrir, el navegador lo
       * pondría en el primer elemento enfocable —la ✕— y quien use lector de
       * pantalla oiría «cerrar» antes que el anuncio. Es lo mismo que hace el
       * diálogo de contacto.
       */
      titleRef.current?.focus();
    }, OPEN_DELAY_MS);

    return () => {
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
    };
  }, [silent]);

  /*
   * `close` cubre las tres salidas —Esc, el botón y el clic en el fondo—
   * porque el elemento nativo las encamina todas por aquí. Devolver el scroll
   * y anotar el cierre en un solo sitio evita que una de las tres se olvide.
   */
  const alCerrar = useCallback(() => {
    document.body.style.overflow = previousOverflowRef.current.body;
    document.documentElement.style.overflow = previousOverflowRef.current.html;
    recordarQueLoVio();
  }, []);

  if (silent) return null;

  return (
    <dialog
      aria-label={copy.dialogLabel}
      className={styles.dialog}
      onClose={alCerrar}
      /*
       * El clic en el fondo cierra: el `::backdrop` no recibe eventos propios,
       * pero un clic fuera del panel llega al propio `<dialog>`, y el panel
       * detiene los suyos.
       */
      onClick={(event) => {
        if (event.target === dialogRef.current) cerrar();
      }}
      ref={dialogRef}
    >
      <div className={styles.panel}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true">✦</span>
            {copy.eyebrow}
          </p>
          <button
            aria-label={copy.closeLabel}
            className={styles.close}
            onClick={cerrar}
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <h2 className={styles.title} ref={titleRef} tabIndex={-1}>
          {copy.title}
        </h2>
        <p className={styles.lead}>{copy.lead}</p>

        <dl className={styles.facts}>
          <div>
            <dt>{copy.whenLabel}</dt>
            <dd>{copy.when}</dd>
          </div>
          <div>
            <dt>{copy.whereLabel}</dt>
            <dd>{copy.where}</dd>
          </div>
          <div>
            <dt>{copy.roleLabel}</dt>
            <dd>{copy.role}</dd>
          </div>
        </dl>

        <div className={styles.allies}>
          <p className={styles.alliesEyebrow}>{copy.alliesEyebrow}</p>
          <ul className={styles.allyList}>
            {DIA_D_ALLIES.map((ally) => {
              const note = copy.allyNotes[ally.id];
              const logo = (
                <Image
                  alt={ally.name}
                  height={ally.height}
                  sizes="120px"
                  src={ally.src}
                  width={ally.width}
                />
              );
              return (
                <li key={ally.id} title={note ? `${ally.name} — ${note}` : ally.name}>
                  {ally.href ? (
                    <a href={ally.href} rel="noreferrer" target="_blank">
                      {logo}
                    </a>
                  ) : (
                    logo
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.actions}>
          <a
            className={styles.cta}
            href={DIA_D_URL}
            rel="noreferrer"
            target="_blank"
          >
            {copy.cta}
            <span aria-hidden="true">↗</span>
          </a>
          <button className={styles.dismiss} onClick={cerrar} type="button">
            {copy.dismiss}
          </button>
        </div>
      </div>
    </dialog>
  );
}

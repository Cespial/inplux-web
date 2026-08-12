"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
// El tipo se borra en compilación; la función viene de un módulo sin datos.
// Importar `verificationDateFor` desde `@/content/work` metía el literal
// completo de `workProfiles` en el chunk cliente de `/trabajo`.
import type { WorkProfile, WorkSlug } from "@/content/work";
import { urlVisible, workCaptures } from "@/content/work-captures";
import { formatShortDate, verificationDateFor } from "@/content/work-format";
import styles from "./ProjectShowcase.module.css";

type InputMode = "keyboard" | "pointer";

/**
 * Lo que esta vitrina añade a la captura: cómo se llama la pantalla en su
 * pestaña y en la fila de metadatos. La ruta del PNG, la fecha en que se tomó,
 * la URL que se enmarca y el texto alternativo NO se escriben aquí: salen de
 * `workCaptures`, que es el único sitio donde viven y el que la prueba
 * `verify-captures` compara contra el acta. Antes estaban escritos aquí y otra
 * vez en `/capacidades`, con dos redacciones distintas del mismo `alt`.
 */
type ScreenLabels = {
  screenLabel: string;
  surfaceLabel: string;
};

const profileOrder = [
  "gobia",
  "laudos",
  "tribai",
  "kelsen",
  "porkia",
] as const satisfies readonly WorkSlug[];

const screenLabels = {
  gobia: {
    screenLabel: "Demo pública de Medellín",
    surfaceLabel: "Centro de mando fiscal",
  },
  laudos: {
    screenLabel: "Laboratorio de Predicción",
    surfaceLabel: "Análisis arbitral",
  },
  tribai: {
    screenLabel: "Asistente Tributario",
    surfaceLabel: "Consulta con fuentes",
  },
  kelsen: {
    screenLabel: "Biblioteca Legal de Colombia",
    surfaceLabel: "Explorador jurídico",
  },
  porkia: {
    screenLabel: "Demostración navegable",
    surfaceLabel: "Finca porcícola",
  },
} as const satisfies Record<WorkSlug, ScreenLabels>;

/**
 * La captura de un producto con lo que esta vitrina le añade.
 *
 * Función y no un mapa precalculado: un mapa habría que armarlo con
 * `Object.fromEntries`, que devuelve `Record<string, …>` y obliga a un `as` que
 * se traga justo el error que importa —una clave de menos—. Así lo comprueba el
 * tipo en cada llamada y no hay nada que afirmar.
 */
function paginaReal(slug: WorkSlug) {
  const captura = workCaptures[slug];
  return {
    ...captura,
    ...screenLabels[slug],
    displayUrl: urlVisible(captura.sourceUrl),
  };
}

type ProjectShowcaseProps = {
  profiles: readonly WorkProfile[];
};

export function ProjectShowcase({ profiles }: ProjectShowcaseProps) {
  const [activeSlug, setActiveSlug] = useState<WorkSlug>(profileOrder[0]);
  const [inputMode, setInputMode] = useState<InputMode>("keyboard");
  const rootId = useId().replaceAll(":", "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const pillRef = useRef<HTMLSpanElement | null>(null);
  const tablistRef = useRef<HTMLDivElement | null>(null);
  const pointerIntentRef = useRef(false);
  const orderedProfiles = profileOrder.flatMap((slug) => {
    const profile = profiles.find((candidate) => candidate.slug === slug);
    return profile ? [profile] : [];
  });
  const activeIndex = profileOrder.indexOf(activeSlug);
  const activeProfile =
    orderedProfiles.find((profile) => profile.slug === activeSlug) ??
    orderedProfiles[0];

  function movePill(index: number, animate: boolean) {
    const pill = pillRef.current;
    const tab = tabRefs.current[index];

    if (!pill || !tab) return;

    if (!animate) {
      const previousTransition = pill.style.transition;
      pill.style.transition = "none";
      pill.style.transform = `translateX(${tab.offsetLeft}px)`;
      pill.style.width = `${tab.offsetWidth}px`;
      void pill.offsetWidth;
      pill.style.transition = previousTransition;
      return;
    }

    pill.style.transform = `translateX(${tab.offsetLeft}px)`;
    pill.style.width = `${tab.offsetWidth}px`;
  }

  useLayoutEffect(() => {
    movePill(activeIndex, inputMode === "pointer");
  }, [activeIndex, inputMode]);

  useLayoutEffect(() => {
    const tablist = tablistRef.current;
    if (!tablist) return;

    const observer = new ResizeObserver(() => movePill(activeIndex, false));
    observer.observe(tablist);
    return () => observer.disconnect();
  }, [activeIndex]);

  function activateProject(slug: WorkSlug, mode: InputMode, focus = false) {
    setInputMode(mode);
    setActiveSlug(slug);

    if (focus) {
      tabRefs.current[profileOrder.indexOf(slug)]?.focus();
    }
  }

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    slug: WorkSlug,
  ) {
    const currentIndex = profileOrder.indexOf(slug);
    let nextIndex: number | undefined;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % profileOrder.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + profileOrder.length) % profileOrder.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = profileOrder.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    activateProject(profileOrder[nextIndex], "keyboard", true);
  }

  if (!activeProfile) return null;

  const activePage = paginaReal(activeProfile.slug);

  return (
    <section id="pantallas" className={styles.showcase} aria-labelledby={`${rootId}-title`}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>
          <span>01</span> Páginas reales
        </p>
        <div>
          <h2 id={`${rootId}-title`}>
            Entre al producto desde su <em>pantalla real.</em>
          </h2>
          <p>
            Estas vistas fueron capturadas directamente de las páginas públicas de
            cada producto. No reconstruimos su interfaz: mostramos la superficie
            oficial disponible en la fecha indicada.
          </p>
        </div>
      </div>

      <div className={styles.showcaseFrame} data-input={inputMode}>
        <div className={styles.frameTopline}>
          <div>
            <span aria-hidden="true" />
            <p>PÁGINA REAL / SITIO OFICIAL</p>
          </div>
          <p>CAPTURA DE NAVEGADOR · {formatShortDate(activePage.capturedAt)}</p>
        </div>

        <div
          ref={tablistRef}
          className={styles.tTabs}
          role="tablist"
          aria-label="Seleccionar página pública de producto"
          aria-orientation="horizontal"
        >
          <span ref={pillRef} className={styles.tTabsPill} aria-hidden="true" />
          {orderedProfiles.map((profile, index) => {
            const selected = profile.slug === activeSlug;
            const page = paginaReal(profile.slug);

            return (
              <button
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                key={profile.slug}
                id={`${rootId}-${profile.slug}-tab`}
                className={styles.tTab}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${rootId}-${profile.slug}-panel`}
                tabIndex={selected ? 0 : -1}
                onPointerDown={() => {
                  pointerIntentRef.current = true;
                }}
                onClick={() => {
                  const mode = pointerIntentRef.current ? "pointer" : "keyboard";
                  pointerIntentRef.current = false;
                  activateProject(profile.slug, mode);
                }}
                onKeyDown={(event) => handleTabKeyDown(event, profile.slug)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{profile.name}</strong>
                <small>{page.surfaceLabel}</small>
              </button>
            );
          })}
        </div>

        <div className={styles.projectMeta}>
          <div className={styles.projectIdentity}>
            <span>{activePage.screenLabel}</span>
            <strong>{activeProfile.shortDescription}</strong>
          </div>
          <div className={styles.projectActions}>
            <p data-confirmed={activeProfile.attribution.state === "confirmed"}>
              <span aria-hidden="true" />
              {activeProfile.attribution.label}
            </p>
            <Link href={`/trabajo/${activeProfile.slug}`}>
              Evidencia y fuentes <span aria-hidden="true">↗</span>
            </Link>
            <a href={activePage.sourceUrl} target="_blank" rel="noreferrer">
              Abrir página real <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {orderedProfiles.map((profile) => {
          const selected = profile.slug === activeSlug;
          const page = paginaReal(profile.slug);

          return (
            <div
              key={profile.slug}
              id={`${rootId}-${profile.slug}-panel`}
              className={styles.screenStage}
              role="tabpanel"
              aria-labelledby={`${rootId}-${profile.slug}-tab`}
              hidden={!selected}
            >
              <div className={styles.browserFrame}>
                <div className={styles.browserChrome} aria-hidden="true">
                  <div>
                    <span />
                    <span />
                    <span />
                  </div>
                  <p>{page.displayUrl}</p>
                  <b>↗</b>
                </div>

                <a
                  className={styles.captureLink}
                  href={page.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Abrir sitio vivo: página pública real de ${profile.name}`}
                >
                  <span className={styles.captureViewport}>
                    <Image
                      src={page.src}
                      alt={page.alt}
                      fill
                      priority={profile.slug === "gobia"}
                      sizes="(max-width: 768px) 100vw, (max-width: 1600px) 88vw, 1500px"
                    />
                  </span>
                  <span className={styles.openCue}>
                    ABRIR SITIO VIVO <b aria-hidden="true">↗</b>
                  </span>
                </a>

                <div className={styles.captureCaption}>
                  <p>
                    <span aria-hidden="true" />
                    CAPTURA REAL · {profile.name.toUpperCase()}
                  </p>
                  <p>
                    URL OFICIAL · VERIFICADA{" "}
                    {verificationDateFor(profile.sources, page.sourceUrl)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        <footer className={styles.disclosure}>
          <p>
            <span aria-hidden="true">●</span>
            Captura real de una página pública; no es una recreación ni un mockup.
          </p>
          <p>LA FUENTE INTERACTIVA SE ABRE EN OTRA PESTAÑA</p>
        </footer>
      </div>
    </section>
  );
}

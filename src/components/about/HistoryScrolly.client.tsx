"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "@/app/nosotros/nosotros.module.css";

const chapters = [
  {
    id: "origen",
    index: "01",
    period: "2000",
    dateTime: "2000",
    code: "TRAYECTORIA / 01",
    kicker: "El origen del criterio",
    title: "Antes de la empresa, estuvo el contexto.",
    copy:
      "La trayectoria del equipo comienza en 2000, acompañando organizaciones en contextos tributarios, financieros e institucionales. Esa experiencia hoy orienta una disciplina: entender personas, reglas y operación antes de decidir qué cambiar.",
    evidence: "TRAYECTORIA DEL EQUIPO / DESDE 2000",
    visual: "origin",
  },
  {
    id: "formalizacion",
    index: "02",
    period: "2023",
    dateTime: "2023",
    code: "INPLUX S.A.S. / 02",
    kicker: "La empresa toma forma",
    title: "La experiencia se formalizó como INPLUX.",
    copy:
      "En 2023 se formaliza INPLUX S.A.S. en Medellín. La empresa reúne conocimiento de dominio, diseño, producto, software, datos e inteligencia artificial bajo una misma dirección.",
    evidence: "INPLUX S.A.S. / MEDELLÍN / 2023",
    visual: "foundation",
  },
  {
    id: "estratos",
    index: "03",
    period: "2026",
    dateTime: "2026",
    code: "IDENTIDAD / 03",
    kicker: "Una marca pensada como sistema",
    title: "Una identidad para una forma de trabajar.",
    copy:
      "En 2026, INPLUX documenta Estratos como su símbolo principal: tres barras ascendentes que representan capas de conocimiento e impulso. La identidad ordena una marca pensada como sistema.",
    evidence: "SISTEMA DE MARCA / 2026",
    visual: "identity",
  },
  {
    id: "fabrica",
    index: "04",
    period: "HOY",
    code: "FÁBRICA / 04",
    kicker: "La forma actual de entregar",
    title: "Contexto, producto e ingeniería en una sola conversación.",
    copy:
      "Hoy INPLUX se presenta como una fábrica de software a la medida para empresas y entidades. Contexto, producto, diseño, ingeniería, datos e inteligencia artificial participan en una misma conversación de entrega.",
    evidence: "POSICIONAMIENTO ACTUAL / INPLUX.CO",
    visual: "factory",
  },
  {
    id: "evidencia",
    index: "05",
    period: "HOY",
    code: "TRABAJO VISIBLE",
    kicker: "La tesis se puede recorrer",
    title: "Dominios distintos, el mismo criterio de entrega.",
    copy:
      "Los productos que este sitio documenta son desarrollos de INPLUX, en dominios que no se parecen entre sí. Cuando la responsabilidad se reparte, el perfil lo dice: en Laudos, INPLUX realiza el desarrollo técnico y REDEK aporta el criterio legal. Junto a esa autoría, cada perfil publica el estado que el producto sostiene y las fuentes que lo respaldan, con la fecha en que se revisaron.",
    evidence: "DESARROLLOS DE INPLUX / FUENTE Y FECHA",
    visual: "work",
    // Un enlace por perfil publicado: el capítulo enuncia la idea y deja que
    // los enlaces hagan de directorio, que es el trabajo de `/trabajo`. La
    // lista no se deriva de `workProfiles` a propósito: este es un componente
    // cliente y esa importación arrastraría el arreglo completo de perfiles al
    // chunk del navegador (la misma razón por la que existe `work-format.ts`).
    links: [
      { href: "/trabajo/gobia", label: "Ver Gobia" },
      { href: "/trabajo/laudos", label: "Ver Laudos" },
      { href: "/trabajo/tribai", label: "Ver Tribai" },
      { href: "/trabajo/kelsen", label: "Ver Kelsen" },
      { href: "/trabajo/porkia", label: "Ver Porkia" },
    ],
  },
  {
    id: "direccion",
    index: "06",
    period: "AHORA",
    code: "DIRECCIÓN / 06",
    kicker: "La responsabilidad tiene nombre",
    title: "Las decisiones críticas conservan responsables.",
    copy:
      "Jaime Alonso Cano Pino dirige la estrategia y el criterio tributario, financiero e institucional como CEO y fundador. Cristian Espinal lidera producto, arquitectura tecnológica e inteligencia artificial como CTO.",
    evidence: "DIRECCIÓN / JAIME CANO + CRISTIAN ESPINAL",
    visual: "leadership",
  },
] as const;

type Chapter = (typeof chapters)[number];
type VisualKind = Chapter["visual"];

function VisualLayer({ kind }: { kind: VisualKind }) {
  if (kind === "origin") {
    return (
      <div className={styles.historyOriginGraphic}>
        <span>MEDELLÍN / COLOMBIA</span>
        <strong>El criterio comienza en el contexto.</strong>
        <span>TRAYECTORIA / 2000</span>
      </div>
    );
  }

  if (kind === "foundation") {
    return (
      <div className={styles.historyFoundationGraphic}>
        <Image
          src="/brand/logos/inplux-logo-horizontal-inverse.svg"
          alt=""
          width={310}
          height={88}
        />
        <div>
          <span>MEDELLÍN / CO</span>
          <span>FORMALIZACIÓN / 2023</span>
        </div>
        <strong>CRITERIO + PRODUCTO + INGENIERÍA</strong>
      </div>
    );
  }

  if (kind === "identity") {
    return (
      <div className={styles.historyIdentityGraphic}>
        <div className={styles.historyStrataMark} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <span>IDENTIDAD / 2026</span>
          <strong>ESTRATOS</strong>
          <p>Tres barras ascendentes: conocimiento, norma e impulso.</p>
        </div>
      </div>
    );
  }

  if (kind === "work") {
    return (
      <div className={styles.historyWorkGraphic}>
        <article>
          <span>GOBIA / PILOTO ACTIVO</span>
          <strong>Información municipal</strong>
          <div aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </article>
        <article>
          <span>LAUDOS / BETA ABIERTA</span>
          <strong>Búsqueda jurídica</strong>
          <div aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </article>
      </div>
    );
  }

  if (kind === "leadership") {
    return (
      <div className={styles.historyLeadershipGraphic}>
        <article>
          <span>DIR–01 / CEO Y FUNDADOR</span>
          <strong>Jaime Alonso Cano Pino</strong>
          <p>Estrategia y criterio institucional.</p>
        </article>
        <article>
          <span>DIR–02 / CTO</span>
          <strong>Cristian Espinal</strong>
          <p>Producto, arquitectura e IA.</p>
        </article>
      </div>
    );
  }

  return (
    <div className={styles.historyNowGraphic}>
      <span>CONTEXTO</span>
      <span>PRODUCTO</span>
      <span>INGENIERÍA</span>
      <strong>DIRECCIÓN HUMANA</strong>
      <i aria-hidden="true" />
    </div>
  );
}

function HistoryStage({ activeIndex, compact = false }: { activeIndex: number; compact?: boolean }) {
  const activeChapter = chapters[activeIndex];
  const stageChapters = compact ? [activeChapter] : chapters;

  return (
    <div
      className={`${styles.historyStage} ${compact ? styles.historyStageCompact : ""}`}
      data-visual={activeChapter.visual}
      aria-hidden="true"
    >
      <Image
        className={styles.historyStageImage}
        src="/brand/about/contexto-medellin.webp"
        alt=""
        fill
        quality={88}
        sizes={compact ? "(max-width: 980px) 100vw, 1px" : "(max-width: 980px) 1px, 54vw"}
      />
      <span className={styles.historyStageShade} />
      <span className={styles.historyStageGrid} />

      <div className={styles.historyStageHeader}>
        <span>INPLUX / ARCHIVO VIVO</span>
        <span>CAPÍTULO {activeChapter.index} / 06</span>
      </div>

      <div className={styles.historyVisualStack}>
        {stageChapters.map((chapter) => (
          <div
            className={styles.historyVisualLayer}
            data-active={chapter.id === activeChapter.id ? "true" : "false"}
            key={chapter.id}
          >
            <VisualLayer kind={chapter.visual} />
          </div>
        ))}
      </div>

      <div className={styles.historyStageFooter}>
        <span>{activeChapter.period}</span>
        <strong>{activeChapter.code}</strong>
      </div>
    </div>
  );
}

export function HistoryScrolly() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepsRef = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;
        const nextIndex = Number((visibleEntry.target as HTMLElement).dataset.historyIndex);
        if (!Number.isNaN(nextIndex)) setActiveIndex(nextIndex);
      },
      {
        rootMargin: "-38% 0px -42% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );

    stepsRef.current.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.historyScrolly}>
      <nav className={styles.historyProgress} aria-label="Capítulos de la historia de INPLUX">
        <span>HISTORIA / 06 CAPÍTULOS</span>
        <ol>
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <a
                href={`#historia-${chapter.id}`}
                aria-current={activeIndex === index ? "step" : undefined}
                aria-label={`${chapter.index}. ${chapter.title}`}
              >
                <span>{chapter.index}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className={styles.historyLayout}>
        <ol className={styles.historySteps}>
          {chapters.map((chapter, index) => (
            <li
              id={`historia-${chapter.id}`}
              className={styles.historyStep}
              data-active={activeIndex === index ? "true" : "false"}
              data-history-index={index}
              ref={(element) => {
                stepsRef.current[index] = element;
              }}
              key={chapter.id}
            >
              <div className={styles.historyStepMeta}>
                <span>{chapter.index}</span>
                {"dateTime" in chapter ? (
                  <time dateTime={chapter.dateTime}>{chapter.period}</time>
                ) : (
                  <span>{chapter.period}</span>
                )}
              </div>
              <div className={styles.historyStepCopy}>
                <p>{chapter.kicker}</p>
                <h3>{chapter.title}</h3>
                <p>{chapter.copy}</p>
                {"links" in chapter ? (
                  <div className={styles.historyStepLinks}>
                    {chapter.links.map((link) => (
                      <Link href={link.href} key={link.href}>
                        {link.label} <span aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
                <footer>{chapter.evidence}</footer>
              </div>
              <div className={styles.historyMobileStage}>
                <HistoryStage activeIndex={index} compact />
              </div>
            </li>
          ))}
        </ol>

        <aside className={styles.historySticky} aria-hidden="true">
          <HistoryStage activeIndex={activeIndex} />
        </aside>
      </div>
    </div>
  );
}

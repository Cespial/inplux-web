import type { Metadata } from "next";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import {
  Anchor,
  Band,
  Button,
  CloseBand,
  MailRow,
  SectionHead,
  Timeline,
  buttonClass,
  v5 as ui,
} from "@/components/v5/primitives";
import { homeCopyEs } from "@/content/copy/es";
import { breadcrumbJsonLdDocument, type Crumb } from "@/lib/breadcrumbs";
import styles from "./como-trabajamos.module.css";

/**
 * `/como-trabajamos` (octubre de 2026): la página que reúne lo que antes se
 * repartía entre `/fabrica` (el método y los compromisos) y `/capacidades` (las
 * capas). Es corta a propósito, como las páginas de producto de primero.com:
 * hero, una frase, las fases, los compromisos y el cierre. Las capas y la
 * evidencia viven en `/trabajo`. Las dos rutas viejas redirigen aquí con 308
 * desde `next.config.ts`, y sus anclas históricas —`#producto`, `#modernizacion`,
 * `#ia`, `#integracion`, `#sector-publico`— siguen resolviendo como anclas
 * invisibles sobre la sección más cercana.
 *
 * Las fases son las mismas que publica la portada: salen de `homeCopyEs` para
 * que las dos pantallas no cuenten dos procesos distintos.
 */

const SITE_URL = "https://inplux.co";
const PAGE_URL = `${SITE_URL}/como-trabajamos`;

export const metadata: Metadata = {
  title: "Cómo trabajamos — del diagnóstico a la operación",
  description:
    "Cómo INPLUX lleva un proceso a producción: diagnóstico, piloto, producción y operación, con un entregable en cada fase y el criterio de tu equipo en cada decisión.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Cómo trabajamos | INPLUX",
    description:
      "Diagnóstico, piloto, producción y operación: cuatro fases con entregable, sobre los sistemas que ya operas.",
    url: PAGE_URL,
    siteName: "INPLUX",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/brand/og/og-como-trabajamos.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "INPLUX · Cómo trabajamos. Del diagnóstico a la operación.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo trabajamos | INPLUX",
    description:
      "Diagnóstico, piloto, producción y operación: cuatro fases con entregable, sobre los sistemas que ya operas.",
    images: [
      {
        url: "/brand/og/og-como-trabajamos.jpg",
        alt: "INPLUX · Cómo trabajamos. Del diagnóstico a la operación.",
      },
    ],
  },
};

const process = homeCopyEs.v5.process;

/** Los compromisos de la antigua `/fabrica`, en dos tiempos. */
const commitments = [
  {
    label: "Punto de partida",
    lineA: "El problema,",
    lineB: "antes que la herramienta.",
    copy: "No empezamos escogiendo una tecnología. Empezamos por qué ocurre, quién lo vive y qué debería cambiar.",
  },
  {
    label: "Alcance",
    lineA: "Una primera versión,",
    lineB: "en uso.",
    copy: "Acotamos el alcance para poner algo útil en operación y aprender de la evidencia, no para simular que todo quedó resuelto.",
  },
  {
    label: "Equipo",
    lineA: "Una sola conversación,",
    lineB: "de producto.",
    copy: "Contexto, experiencia, software, datos y pruebas se revisan juntos, para que la intención no se pierda entre entregables.",
  },
  {
    label: "Control",
    lineA: "La decisión,",
    lineB: "de tu equipo.",
    copy: "La inteligencia artificial acelera tareas especializadas. Tu equipo conserva el criterio, la validación y la responsabilidad.",
  },
] as const;

const crumbs: Crumb[] = [{ label: "Inicio", href: "/" }, { label: "Cómo trabajamos" }];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  name: "Cómo trabajamos",
  url: PAGE_URL,
  description: metadata.description,
  inLanguage: "es-CO",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
};

export default function ComoTrabajamosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLdDocument(crumbs, PAGE_URL)) }}
      />
      <ContactDialogProvider>
        <V5Page className={styles.root}>
          <main id="main-content" tabIndex={-1}>
            <section id="inicio" aria-labelledby="how-title">
              <PageHero
                className={styles.hero}
                eyebrow="Cómo trabajamos"
                title={<span id="how-title">Trabajamos contigo desde el diagnóstico hasta que opera.</span>}
                lead="Nuestros ingenieros trabajan dentro de los sistemas y de los equipos del cliente."
                leadMuted="Cada fase termina con algo que se puede usar y revisar, y la decisión sigue siendo de quien ya la tenía."
                crumbs={crumbs}
                media={{
                  kind: "video",
                  poster: "/media/como-poster.jpg",
                  sources: [
                    { src: "/media/como-720.mp4", type: "video/mp4", media: "(max-width: 760px)" },
                    { src: "/media/como-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
                    { src: "/media/como-hevc.mp4", type: 'video/mp4; codecs="hvc1"' },
                    { src: "/media/como.mp4", type: "video/mp4" },
                  ],
                }}
                actions={
                  <>
                    <ContactLink
                      className={buttonClass("primary")}
                      fallbackHref="/contacto"
                      source="how-we-work-hero"
                    >
                      Empezar un proyecto
                    </ContactLink>
                    <Button href="#fases">
                      Ver las fases <span aria-hidden="true">↓</span>
                    </Button>
                  </>
                }
              />
            </section>

            <Band as="div" className={styles.statement}>
              <p className={`${ui.d2} ${styles.statementText}`}>
                Construir rápido solo sirve si construimos <em>lo correcto.</em>
              </p>
            </Band>

            <Band id="fases" plus labelledBy="phases-title" className={styles.phases}>
              <SectionHead
                id="phases-title"
                eyebrow={process.eyebrow}
                title={
                  <>
                    Cuatro fases. <em>Un entregable en cada una.</em>
                  </>
                }
                lead="Entramos por un proceso concreto y lo llevamos hasta que opera con tu equipo. Ninguna fase termina en una presentación: termina en algo que se usa."
                align="center"
              />
              <Timeline phases={process.phases} deliverableLabel={process.deliverableLabel} />
            </Band>

            {/* Anclas históricas de /capacidades: las capas se cuentan ahora en /trabajo. */}
            <Anchor id="producto" />
            <Anchor id="modernizacion" />
            <Anchor id="ia" />
            <Anchor id="integracion" />

            <Band id="compromisos" tone="light" labelledBy="commitments-title" className={styles.commitments}>
              <SectionHead
                id="commitments-title"
                eyebrow="Lo que cuidamos"
                title={
                  <>
                    Velocidad <em>con responsabilidad.</em>
                  </>
                }
              />
              <ol className={styles.commitmentList} aria-label="Cuatro compromisos">
                {commitments.map((item, index) => (
                  <li key={item.label} style={{ "--i": index } as React.CSSProperties}>
                    <span className={styles.commitmentLabel}>{item.label}</span>
                    <p className={styles.commitmentLines} aria-hidden="true">
                      <span>{item.lineA}</span>
                      <span>{item.lineB}</span>
                    </p>
                    <h3 className={styles.visuallyHidden}>{`${item.lineA} ${item.lineB}`}</h3>
                    <p className={styles.commitmentCopy}>{item.copy}</p>
                  </li>
                ))}
              </ol>
            </Band>

            <Anchor id="sector-publico" />
            <CloseBand
              id="contacto"
              titleId="closing-title"
              eyebrow="El siguiente paso"
              title={
                <>
                  Trae el problema. <em>Construimos el sistema.</em>
                </>
              }
              lead="No necesitas llegar con requisitos ni arquitectura. Empezamos por quién vive el problema y qué debería cambiar."
            >
              <MailRow>
                <ContactLink
                  className={buttonClass("primary")}
                  fallbackHref="/contacto"
                  source="how-we-work-closing"
                >
                  Empezar un proyecto <span aria-hidden="true">→</span>
                </ContactLink>
                <Button href="mailto:gerencia@inplux.co">gerencia@inplux.co</Button>
              </MailRow>
            </CloseBand>
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

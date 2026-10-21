import type { Metadata } from "next";
import { languageAlternates } from "@/content/i18n";
import Image from "next/image";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import {
  Band,
  Button,
  CloseBand,
  MailRow,
  SectionHead,
  buttonClass,
  v5 as ui,
} from "@/components/v5/primitives";
import { personId, profileUrl, teamMembers } from "@/content/team";
import { breadcrumbJsonLd, type Crumb } from "@/lib/breadcrumbs";
import styles from "./nosotros.module.css";
import { nosotrosSocialImage, twitterImage } from "@/lib/social-cards";

/*
 * `/nosotros` (octubre de 2026): corta a propósito, como la página de compañía
 * de primero.com. Video, de dónde venimos, tres razones para confiar, qué
 * estamos construyendo y el cierre. Quién dirige vive en `/equipo`; cómo
 * trabajamos, en `/como-trabajamos`.
 *
 * El párrafo de origen acredita a REDEK: `verify-build-output` lo exige porque
 * es la única prosa del sitio que resume la autoría de todos los productos.
 */

export const metadata: Metadata = {
  title: "Nosotros — construimos con criterio, desde Medellín",
  description:
    "INPLUX desarrolla e implementa la transformación con IA de empresas e instituciones en Latinoamérica.",
  alternates: {
    canonical: "https://inplux.co/nosotros",
    languages: languageAlternates("/nosotros"),
  },
  openGraph: {
    title: "Construimos con criterio, desde Medellín | INPLUX",
    description:
      "INPLUX desarrolla e implementa la transformación con IA de empresas e instituciones en Latinoamérica.",
    url: "https://inplux.co/nosotros",
    siteName: "INPLUX",
    locale: "es_CO",
    type: "website",
    images: [nosotrosSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Construimos con criterio, desde Medellín | INPLUX",
    description:
      "INPLUX desarrolla e implementa la transformación con IA de empresas e instituciones en Latinoamérica.",
    images: [twitterImage(nosotrosSocialImage)],
  },
};

const reasons = [
  {
    label: "Operadores con criterio",
    title: "Venimos de la operación, no de la demo.",
    copy:
      "Tributación, hacienda pública, economía e ingeniería. Sabemos qué pasa cuando una respuesta no se puede verificar.",
  },
  {
    label: "Independientes",
    title: "Sin proveedor ni modelo por defecto.",
    copy:
      "Elegimos la nube, el modelo y la infraestructura por el problema, y lo dejamos documentado para que puedas cambiarlo.",
  },
  {
    label: "Ingeniería local",
    title: "Dentro de tu equipo, no al otro lado de un ticket.",
    copy:
      "Nuestros ingenieros trabajan en tus sistemas y con tus personas, desde el diagnóstico hasta que el sistema opera.",
  },
] as const;

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://inplux.co/nosotros#page",
  name: "Construimos con criterio, desde Medellín",
  url: "https://inplux.co/nosotros",
  description:
    "INPLUX desarrolla e implementa la transformación con IA de empresas e instituciones en Latinoamérica.",
  mainEntity: {
    "@id": "https://inplux.co/#organization",
  },
};

const crumbs: Crumb[] = [{ label: "Inicio", href: "/" }, { label: "Nosotros" }];

const aboutSupportingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbJsonLd(crumbs, "https://inplux.co/nosotros"),
    // Referencia por `@id` canónico, no una definición nueva: la persona se
    // define una sola vez en /equipo/[slug]. Repetir aquí un `@id` distinto
    // crearía una entidad paralela con el mismo nombre.
    ...teamMembers.map((leader) => ({
      "@type": "Person",
      "@id": personId(leader.slug),
      name: leader.name,
      url: profileUrl(leader.slug),
      jobTitle: leader.jobTitle,
      description: leader.focus,
      sameAs: [...leader.sameAs],
      worksFor: {
        "@id": "https://inplux.co/#organization",
      },
    })),
  ],
};

export default function Nosotros() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSupportingJsonLd) }}
      />
      <ContactDialogProvider>
        <V5Page className={styles.root}>
          <main id="main-content" tabIndex={-1}>
            <section id="inicio" aria-labelledby="about-title">
              <PageHero
                className={styles.hero}
                eyebrow="Nosotros"
                title={<span id="about-title">Construimos con criterio, desde Medellín.</span>}
                lead="INPLUX desarrolla e implementa la transformación con IA de empresas e instituciones en Latinoamérica."
                leadMuted="Productos propios en producción y equipos que los implementan dentro de la operación del cliente."
                crumbs={crumbs}
                media={{
                  kind: "video",
                  poster: "/media/nosotros-poster.jpg",
                  sources: [
                    { src: "/media/nosotros-720.mp4", type: "video/mp4", media: "(max-width: 760px)" },
                    { src: "/media/nosotros-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
                    { src: "/media/nosotros-hevc.mp4", type: 'video/mp4; codecs="hvc1"' },
                    { src: "/media/nosotros.mp4", type: "video/mp4" },
                  ],
                }}
                actions={
                  <>
                    <Button href="/equipo" variant="primary">
                      Conocer al equipo
                    </Button>
                    <Button href="#origen">
                      De dónde venimos <span aria-hidden="true">↓</span>
                    </Button>
                  </>
                }
              />
            </section>

            <Band id="origen" labelledBy="origin-title" className={styles.origin}>
              <SectionHead
                id="origin-title"
                eyebrow="De dónde venimos"
                title={
                  <>
                    Dos oficios en la misma <em>mesa.</em>
                  </>
                }
              />
              <div className={styles.originBody}>
                <div className={styles.originText}>
                  <p>
                    INPLUX nació en Medellín en 2023 de dos oficios que rara vez se sientan juntos: la
                    gestión tributaria e institucional y la ingeniería de software. Los productos que
                    este sitio documenta son desarrollos de INPLUX en dominios que no se parecen entre
                    sí. Cuando la responsabilidad se reparte, el perfil lo dice: en Laudos, INPLUX
                    realiza el desarrollo técnico y REDEK aporta el criterio legal.
                  </p>
                  <blockquote className={styles.quote}>
                    <p className={ui.d2}>
                      Desde Medellín, <em>para Latinoamérica.</em>
                    </p>
                  </blockquote>
                </div>
                <figure className={styles.originFigure} data-reveal="media">
                  <Image
                    src="/brand/about/mesa-de-criterio.webp"
                    alt=""
                    width={960}
                    height={1200}
                    sizes="(max-width: 760px) 92vw, 34vw"
                  />
                </figure>
              </div>
            </Band>

            <Band id="razones" tone="light" labelledBy="reasons-title" className={styles.reasons}>
              <SectionHead
                id="reasons-title"
                eyebrow="Por qué confiar"
                title={
                  <>
                    Tres cosas que no <em>delegamos.</em>
                  </>
                }
              />
              <ul className={styles.reasonList} aria-label="Tres razones">
                {reasons.map((reason) => (
                  <li key={reason.label}>
                    <span className={styles.reasonLabel}>{reason.label}</span>
                    <h3>{reason.title}</h3>
                    <p>{reason.copy}</p>
                  </li>
                ))}
              </ul>
            </Band>

            <Band id="construimos" labelledBy="building-title" className={styles.building}>
              <SectionHead
                id="building-title"
                eyebrow="Qué estamos construyendo"
                title={
                  <>
                    Sistemas que una institución pueda <em>auditar.</em>
                  </>
                }
                lead={
                  <>
                    Productos que conectan los sistemas de registro de una entidad con modelos de
                    lenguaje, y dejan cada respuesta con su fuente, cada acción con su registro y
                    cada decisión en manos de quien ya la tenía. Primero en tributación, salud y
                    gestión pública; después, en cualquier sector donde la norma y el dato se cruzan.
                  </>
                }
              />
            </Band>

            <CloseBand
              id="contacto"
              titleId="closing-title"
              eyebrow="El siguiente paso"
              title={
                <>
                  Construyamos lo que <em>sigue.</em>
                </>
              }
              lead="Cuéntanos el problema, quién lo vive y qué debería cambiar. No necesitas llegar con requisitos ni alcance definido."
            >
              <MailRow>
                <ContactLink
                  className={buttonClass("primary")}
                  fallbackHref="/contacto"
                  source="about-closing"
                >
                  Empezar una conversación
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

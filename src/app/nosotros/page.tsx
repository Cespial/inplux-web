import type { Metadata } from "next";
import Link from "next/link";
import { CriterionFlow } from "@/components/about/CriterionFlow.client";
import { HistoryScrolly } from "@/components/about/HistoryScrolly.client";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { personId, profileUrl, teamMembers } from "@/content/team";
import styles from "./nosotros.module.css";

export const metadata: Metadata = {
  title: "Nosotros — el criterio detrás de la fábrica",
  description:
    "Conoce la trayectoria, los principios y las personas que convierten contexto, producto e ingeniería en software útil.",
  alternates: {
    canonical: "https://inplux.co/nosotros",
  },
  openGraph: {
    title: "El criterio detrás de la fábrica | INPLUX",
    description:
      "La trayectoria, los principios y las personas detrás de la fábrica de software de INPLUX.",
    url: "https://inplux.co/nosotros",
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/brand/og/og-nosotros.png",
        width: 1200,
        height: 630,
        alt: "INPLUX, el criterio detrás de la fábrica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "El criterio detrás de la fábrica | INPLUX",
    description:
      "La trayectoria, los principios y las personas detrás de la fábrica de software de INPLUX.",
    images: [
      {
        url: "/brand/og/og-nosotros.png",
        alt: "INPLUX, el criterio detrás de la fábrica",
      },
    ],
  },
};

const principles = [
  {
    number: "01",
    title: "Entender antes de construir.",
    copy:
      "El contexto, las personas y las reglas del problema guían cada decisión de producto y tecnología.",
  },
  {
    number: "02",
    title: "Hacer visible la evidencia.",
    copy:
      "Diferenciamos lo que está en producción, en piloto, en beta o todavía en desarrollo.",
  },
  {
    number: "03",
    title: "Mantener dirección humana.",
    copy:
      "La IA participa en tareas especializadas; el equipo conserva el criterio, la validación y la responsabilidad.",
  },
  {
    number: "04",
    title: "Diseñar para evolucionar.",
    copy:
      "Una primera versión útil inicia un producto que puede mejorar con evidencia de su operación.",
  },
] as const;

const leaders = teamMembers;

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://inplux.co/nosotros#page",
  name: "El criterio detrás de la fábrica",
  url: "https://inplux.co/nosotros",
  description:
    "La trayectoria, los principios y las personas detrás de la fábrica de software de INPLUX.",
  mainEntity: {
    "@id": "https://inplux.co/#organization",
  },
};

const aboutSupportingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": "https://inplux.co/nosotros#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://inplux.co/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Nosotros",
          item: "https://inplux.co/nosotros",
        },
      ],
    },
    // Referencia por `@id` canónico, no una definición nueva: la persona se
    // define una sola vez en /equipo/[slug]. Repetir aquí un `@id` distinto
    // crearía una entidad paralela con el mismo nombre.
    ...leaders.map((leader) => ({
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
        <div className={styles.aboutRoot}>
          <SiteHeader inverseOnTop />
          <main id="main-content" tabIndex={-1}>
            <section
              className={styles.hero}
              aria-labelledby="about-title"
              data-header-theme="dark"
            >
              <div className={styles.heroCopy}>
                <div className={styles.heroCopyInner}>
                  <p className={styles.eyebrow}>
                    <span>00</span> Nosotros
                  </p>
                  <h1 id="about-title">
                    El criterio detrás de la <em>fábrica.</em>
                  </h1>
                  <p className={styles.heroLead}>
                    No empezamos por la tecnología. Empezamos por comprender qué ocurre,
                    quién lo vive y qué debería cambiar.
                  </p>
                  <p className={styles.heroBody}>
                    INPLUX reúne experiencia institucional, pensamiento de producto e
                    ingeniería para convertir problemas reales en software que pueda usarse,
                    medirse y evolucionar.
                  </p>
                  <div className={styles.heroFacts} aria-label="Datos de INPLUX">
                    <span>MEDELLÍN / COLOMBIA</span>
                    <span>DESDE 2023</span>
                    <span>DIRECCIÓN HUMANA</span>
                  </div>
                </div>
                <a className={styles.heroScroll} href="#trayectoria">
                  Ver de dónde viene el criterio <span aria-hidden="true">↓</span>
                </a>
              </div>
              <CriterionFlow />
            </section>

            <section
              id="trayectoria"
              className={styles.trajectory}
              aria-labelledby="trajectory-title"
            >
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>
                  <span>01</span> Trayectoria
                </p>
                <h2 id="trajectory-title">
                  El criterio no apareció de la <em>nada.</em>
                </h2>
                <p>
                  Esta es la historia verificable detrás de la fábrica: la trayectoria del
                  equipo, la formalización de INPLUX y la forma actual de construir.
                </p>
              </div>
              <HistoryScrolly />
            </section>

            <section
              className={styles.operatingSystem}
              aria-labelledby="system-title"
              data-header-theme="dark"
            >
              <div className={styles.sectionHeadingDark}>
                <p className={styles.eyebrow}>
                  <span>02</span> Una sola fábrica
                </p>
                <h2 id="system-title">
                  Tres formas de pensar. Un solo <em>sistema.</em>
                </h2>
                <p>
                  No entregamos una estrategia por un lado y código por otro. Contexto,
                  producto e ingeniería comparten la misma dirección.
                </p>
              </div>

              <div className={styles.systemMap} aria-label="Sistema de trabajo de INPLUX">
                <div className={styles.systemMapHeader}>
                  <span>INPLUX FACTORY / OPERATING MODEL</span>
                  <span>RESPONSABILIDAD ACTIVA</span>
                </div>
                <div className={styles.systemNodes}>
                  <article>
                    <span>01</span>
                    <h3>Contexto</h3>
                    <p>Personas, reglas, operación y fricciones.</p>
                  </article>
                  <article>
                    <span>02</span>
                    <h3>Producto</h3>
                    <p>Prioridades, experiencia, alcance y validación.</p>
                  </article>
                  <article>
                    <span>03</span>
                    <h3>Ingeniería</h3>
                    <p>Arquitectura, software, datos y calidad.</p>
                  </article>
                </div>
                <div className={styles.humanDirection}>
                  <span>DIRECCIÓN HUMANA</span>
                  <p>
                    La inteligencia artificial amplifica capacidades. Las decisiones
                    críticas siguen teniendo responsables identificables.
                  </p>
                </div>
              </div>

              <div className={styles.principlesGrid}>
                {principles.map((principle) => (
                  <article key={principle.number}>
                    <span>{principle.number}</span>
                    <h3>{principle.title}</h3>
                    <p>{principle.copy}</p>
                  </article>
                ))}
              </div>
            </section>

            <section
              className={styles.leadership}
              aria-labelledby="leadership-title"
            >
              <div className={styles.leadershipHeading}>
                <p className={styles.eyebrow}>
                  <span>03</span> Dirección humana
                </p>
                <h2 id="leadership-title">
                  Personas que pueden explicar —y asumir— cada <em>decisión.</em>
                </h2>
                <p>
                  No usamos retratos generados ni escondemos la responsabilidad detrás de
                  “la IA”. Estas son las personas que dirigen la fábrica.
                </p>
              </div>

              <div className={styles.leaderGrid}>
                {leaders.map((leader) => (
                  <article key={leader.code}>
                    <div className={styles.leaderMeta}>
                      <span>{leader.code}</span>
                      <span>{leader.role}</span>
                    </div>
                    <h3>{leader.name}</h3>
                    <p className={styles.leaderFocus}>{leader.focus}</p>
                    <p className={styles.leaderBio}>{leader.bio}</p>
                    <Link href={`/equipo/${leader.slug}`}>
                      Ver trayectoria y publicaciones
                    </Link>
                    <a href={leader.linkedin} target="_blank" rel="noreferrer">
                      Ver perfil en LinkedIn <span aria-hidden="true">↗</span>
                    </a>
                  </article>
                ))}
              </div>
            </section>

            <section
              className={styles.closing}
              aria-labelledby="closing-title"
              data-header-theme="dark"
            >
              <div className={styles.closingMeta}>
                <span>04 / EL SIGUIENTE PROBLEMA</span>
                <span>CONVERSACIÓN → CRITERIO → PRODUCTO</span>
              </div>
              <div className={styles.closingBody}>
                <h2 id="closing-title">
                  Construyamos lo que <em>sigue.</em>
                </h2>
                <div>
                  <p>
                    Cuéntanos el problema, quién lo vive y qué debería cambiar. No necesitas
                    llegar con requisitos ni con el alcance definido.
                  </p>
                  <ContactLink
                    className={styles.closingButton}
                    fallbackHref="/contacto"
                    source="about-closing"
                  >
                    Empezar una conversación <span aria-hidden="true">→</span>
                  </ContactLink>
                </div>
              </div>
            </section>
          </main>
          <SiteFooter />
        </div>
      </ContactDialogProvider>
    </>
  );
}

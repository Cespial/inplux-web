import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import {
  Anchor,
  Band,
  Button,
  CardGrid,
  CloseBand,
  MailRow,
  RowsList,
  SectionHead,
  Timeline,
  buttonClass,
  v5 as ui,
} from "@/components/v5/primitives";
import { homeCopyEs } from "@/content/copy/es";
import { sectorProfiles } from "@/content/sectores";
import { getWorkProfile } from "@/content/work";
import { CAPTURA_ALTO, CAPTURA_ANCHO, urlVisible, workCaptures } from "@/content/work-captures";
import { formatShortDate, verificationDateFor } from "@/content/work-format";
import styles from "./como-trabajamos.module.css";

/**
 * `/como-trabajamos` (octubre de 2026): la página que reúne lo que antes se
 * repartía entre `/fabrica` (el método y los compromisos) y `/capacidades` (las
 * capas y la evidencia). Las dos rutas viejas redirigen aquí con 308 desde
 * `next.config.ts`, y sus anclas históricas —`#producto`, `#modernizacion`,
 * `#ia`, `#integracion`, `#sector-publico`— siguen resolviendo en esta página.
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
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/brand/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "INPLUX, de un problema real a software en producción",
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
        url: "/brand/og/og-default.png",
        alt: "INPLUX, de un problema real a software en producción",
      },
    ],
  },
};

const process = homeCopyEs.v5.process;

/** Las cuatro capas que componen cada sistema. Los `id` son las anclas históricas de `/capacidades`. */
const layers = [
  {
    id: "producto",
    code: "UI / FLOW",
    title: "Producto",
    trigger: "Cuando alguien necesita usar, decidir o completar algo mejor.",
    output: "Una experiencia útil y medible.",
  },
  {
    id: "modernizacion",
    code: "STATE / RULES",
    title: "Operación",
    trigger: "Cuando el trabajo depende de pasos, reglas e información dispersa.",
    output: "Un flujo visible y trazable.",
  },
  {
    id: "ia",
    code: "SOURCE / REVIEW",
    title: "Conocimiento e IA",
    trigger: "Cuando leer, buscar o documentar consume el criterio del equipo.",
    output: "Asistencia revisable, con fuentes.",
  },
  {
    id: "integracion",
    code: "API / EVENT",
    title: "Integración",
    trigger: "Cuando una acción cruza sistemas, datos o permisos distintos.",
    output: "Un recorrido continuo y observable.",
  },
] as const;

/**
 * Capturas de páginas públicas, no ilustraciones. Ruta, fecha y `alt` salen de
 * `workCaptures`; la fecha de verificación de la fuente, de `work.ts` vía
 * `verificationDateFor`, que revienta el build si la URL no es una fuente del
 * perfil.
 */
const evidence = [
  {
    slug: "gobia",
    headline: "Una operación municipal reunida en un centro de mando.",
    attribution: "Solución de INPLUX · atribución pública confirmada en gobia.co",
  },
  {
    slug: "tribai",
    headline: "Una consulta tributaria que no se separa de su fuente.",
    attribution: "Desarrollo de INPLUX · la autoría la declaramos nosotros",
  },
  {
    slug: "kelsen",
    headline: "Una biblioteca jurídica abierta, filtrable por vigencia.",
    attribution: "Desarrollo de INPLUX · la autoría la declaramos nosotros",
  },
  {
    slug: "laudos",
    headline: "Conocimiento arbitral convertido en una herramienta explorable.",
    attribution: "Desarrollo técnico: INPLUX · criterio legal: REDEK",
  },
] as const;

const evidenceItems = evidence.map((item) => {
  const profile = getWorkProfile(item.slug);
  if (!profile) throw new Error(`Evidencia sin perfil en work.ts: ${item.slug}`);
  const captura = workCaptures[item.slug];
  return {
    ...item,
    name: profile.name,
    category: profile.category,
    statusLabel: profile.status.label,
    image: captura.src,
    imageAlt: captura.alt,
    sourceUrl: captura.sourceUrl,
    capturedLabel: formatShortDate(captura.capturedAt),
    verifiedLabel: verificationDateFor(profile.sources, captura.sourceUrl),
  };
});

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

const sectorRows = sectorProfiles.map((sector) => ({
  title: sector.name,
  detail: sector.lead,
  href: `/sectores/${sector.slug}`,
}));

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
                crumbs={[{ label: "Inicio", href: "/" }, { label: "Cómo trabajamos" }]}
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

            <Band id="capas" tone="light" labelledBy="layers-title" className={styles.layers}>
              <SectionHead
                id="layers-title"
                eyebrow="Qué construimos"
                title={
                  <>
                    Cuatro capas. <em>Una sola responsabilidad.</em>
                  </>
                }
                lead="Cada una resuelve una tensión distinta y entra solo cuando mejora el recorrido completo. La combinación cambia con el problema; el estándar de producto, no."
              />
              <CardGrid className={styles.layerGrid}>
                {layers.map((layer, index) => (
                  <article key={layer.id} id={layer.id} className={styles.layer}>
                    <p className={styles.layerMeta}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <b>{layer.code}</b>
                    </p>
                    <h3>{layer.title}</h3>
                    <dl>
                      <div>
                        <dt>Aparece cuando</dt>
                        <dd>{layer.trigger}</dd>
                      </div>
                      <div>
                        <dt>Deja listo</dt>
                        <dd>{layer.output}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </CardGrid>
            </Band>

            <Band id="evidencia" labelledBy="evidence-title" className={styles.evidence}>
              <SectionHead
                id="evidence-title"
                eyebrow="Evidencia"
                title={
                  <>
                    Se entiende mejor <em>cuando ya está funcionando.</em>
                  </>
                }
                link={{ href: "/trabajo", label: "Ver los productos" }}
              />
              <div className={styles.evidenceGrid}>
                {evidenceItems.map((item) => (
                  <article key={item.slug} className={styles.evidenceItem}>
                    <figure className={styles.browser}>
                      <div className={styles.browserBar} aria-hidden="true">
                        <span />
                        <span />
                        <span />
                        <p>{urlVisible(item.sourceUrl)}</p>
                      </div>
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        width={CAPTURA_ANCHO}
                        height={CAPTURA_ALTO}
                        sizes="(max-width: 760px) 92vw, 46vw"
                      />
                      <figcaption>
                        Captura pública {item.capturedLabel} · fuente verificada {item.verifiedLabel}
                      </figcaption>
                    </figure>
                    <div className={styles.evidenceCopy}>
                      <p className={ui.meta}>
                        {item.category} · {item.statusLabel}
                      </p>
                      <h3>{item.name}</h3>
                      <p>{item.headline}</p>
                      <small>{item.attribution}</small>
                      <Link href={`/trabajo/${item.slug}`}>
                        Ver perfil y fuentes <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </Band>

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
            <Band id="sectores" labelledBy="sectors-title" className={styles.sectors}>
              <SectionHead
                id="sectors-title"
                eyebrow="Dónde trabajamos"
                title={
                  <>
                    El mismo método, <em>en cada sector.</em>
                  </>
                }
              />
              <RowsList items={sectorRows} />
            </Band>

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

import type { Metadata } from "next";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { PressArchive } from "@/components/site/PressStories";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { pressStories, type PressStory } from "@/content/press";
import styles from "./prensa.module.css";

const canonicalUrl = "https://inplux.co/prensa";
const pageDescription =
  "Cobertura, conversaciones públicas, investigación y columnas firmadas vinculadas con INPLUX y su equipo, siempre con la fuente original a la vista.";

const sortedPressStories: PressStory[] = [...pressStories].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);
const sourceCount = new Set(pressStories.map((story) => story.outlet)).size;
const mediaCount = pressStories.filter((story) => story.category === "Medios").length;
const publicStageCount = pressStories.filter(
  (story) => story.category === "Escenarios públicos",
).length;
const researchCount = pressStories.filter(
  (story) => story.category === "Investigación",
).length;
const signedIdeasCount = pressStories.filter(
  (story) => story.category === "Ideas firmadas",
).length;

export const metadata: Metadata = {
  title: "Prensa y conversaciones",
  description: pageDescription,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "Prensa y conversaciones | INPLUX",
    description:
      "Cobertura, escenarios públicos, investigaciones y columnas del equipo, organizados por categoría y enlazados a su fuente original.",
    url: canonicalUrl,
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/brand/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "INPLUX, prensa y conversaciones",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prensa y conversaciones | INPLUX",
    description:
      "Cobertura, escenarios públicos, investigaciones y columnas del equipo, organizados por categoría y enlazados a su fuente original.",
    images: [
      {
        url: "/brand/og/og-default.png",
        alt: "INPLUX, prensa y conversaciones",
      },
    ],
  },
};

const pressCollectionJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: "Prensa y conversaciones | INPLUX",
      description: pageDescription,
      inLanguage: "es-CO",
      mainEntity: {
        "@id": `${canonicalUrl}#archivo`,
      },
    },
    {
      "@type": "ItemList",
      "@id": `${canonicalUrl}#archivo`,
      url: `${canonicalUrl}#press-archive-title`,
      numberOfItems: sortedPressStories.length,
      itemListElement: sortedPressStories.map((story, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item:
          story.category === "Investigación"
            ? {
                "@type": "ScholarlyArticle",
                "@id": story.href,
                url: story.href,
                name: story.sourceTitle ?? story.title,
                headline: story.title,
                datePublished: story.publishedAt,
                description: story.summary,
                author: story.byline
                  ? story.byline.split(" · ").map((name) => ({
                      "@type": "Person",
                      name,
                    }))
                  : undefined,
                creativeWorkStatus: story.editorialStatus,
                publisher: {
                  "@type": "Organization",
                  name: story.outlet,
                },
              }
            : story.format === "Panel"
              ? {
                  "@type": "Event",
                  "@id": story.href,
                  url: story.href,
                  name: story.sourceTitle ?? story.title,
                  startDate: story.publishedAt,
                  eventAttendanceMode:
                    "https://schema.org/OfflineEventAttendanceMode",
                  location: {
                    "@type": "Place",
                    name: "Medellín, Colombia",
                  },
                  organizer: {
                    "@type": "Organization",
                    name: story.outlet,
                  },
                  performer: story.byline
                    ? {
                        "@type": "Person",
                        name: story.byline,
                      }
                    : undefined,
                }
              : {
                  "@type": "Article",
                  "@id": story.href,
                  url: story.href,
                  name: story.sourceTitle ?? story.title,
                  headline: story.title,
                  datePublished: story.publishedAt,
                  description: story.summary,
                  author:
                    story.category === "Ideas firmadas" && story.byline
                      ? {
                          "@type": "Person",
                          name: story.byline,
                        }
                      : undefined,
                  creativeWorkStatus: story.editorialStatus,
                  publisher: {
                    "@type": "Organization",
                    name: story.outlet,
                  },
                },
      })),
    },
  ],
};

export default function Prensa() {
  return (
    <ContactDialogProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pressCollectionJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader inverseOnTop />
      <main id="main-content" tabIndex={-1}>
        <section
          className={styles.hero}
          data-header-theme="dark"
          aria-labelledby="press-title"
        >
          <div className={styles.heroGrid} aria-hidden="true" />
          <span className={styles.heroWord} aria-hidden="true">
            CIRCULACIÓN
          </span>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p>
                <span aria-hidden="true" />
                Prensa y conversaciones
              </p>
              <h1 id="press-title">
                Ideas que siguen trabajando después de la <em>conversación.</em>
              </h1>
              <p className={styles.intro}>
                Cobertura, escenarios públicos, investigación abierta y columnas
                firmadas. Cada publicación ocupa su categoría; ninguna aparece sin
                fecha, título y enlace original consultable.
              </p>
            </div>

            <aside className={styles.latest} aria-label="Composición editorial del archivo">
              <div className={styles.latestTop}>
                <span>Archivo por categoría</span>
                <span>URL + fecha revisadas</span>
              </div>
              <dl className={styles.latestMetrics}>
                <div>
                  <dt>En medios</dt>
                  <dd>{String(mediaCount).padStart(2, "0")}</dd>
                </div>
                <div>
                  <dt>Escenario</dt>
                  <dd>{String(publicStageCount).padStart(2, "0")}</dd>
                </div>
                <div>
                  <dt>Investigación</dt>
                  <dd>{String(researchCount).padStart(2, "0")}</dd>
                </div>
                <div>
                  <dt>Ideas firmadas</dt>
                  <dd>{String(signedIdeasCount).padStart(2, "0")}</dd>
                </div>
              </dl>
              <div className={styles.latestNote}>
                <p>Criterio editorial</p>
                <strong>No llamamos prensa a todo.</strong>
                <span>
                  Las columnas propias y los trabajos sin revisión por pares están
                  identificados antes de abrir su fuente.
                </span>
              </div>
            </aside>
          </div>
          <div className={styles.heroFoot}>
            <span>INPLUX / ARCHIVO ABIERTO</span>
            <span>{sourceCount} repositorios o publicaciones · {pressStories.length} enlaces</span>
            <a href="#press-archive-title">Explorar el archivo ↓</a>
          </div>
        </section>

        <PressArchive />
      </main>
      <SiteFooter />
    </ContactDialogProvider>
  );
}

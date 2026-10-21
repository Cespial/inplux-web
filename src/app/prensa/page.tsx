import type { Metadata } from "next";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import { NextPage } from "@/components/v5/NextPage";
import { Band, SectionHead, v5 as ui } from "@/components/v5/primitives";
import {
  eventFormats,
  isOwnStory,
  ownStoryUrl,
  pressCategories,
  pressStories,
  type PressStory,
} from "@/content/press";
import { findTeamMemberInByline, personId } from "@/content/team";
import { breadcrumbJsonLdDocument, type Crumb } from "@/lib/breadcrumbs";
import styles from "./prensa.module.css";

/*
 * `/prensa` (octubre de 2026): una foto real de un escenario y las piezas en
 * tarjetas con el medio, el titular y la fecha, enlazadas a su fuente. La
 * prosa propia se reduce al hero; el archivo es el contenido.
 *
 * Las seis piezas más recientes van en `<main>`. El resto del archivo se
 * renderiza fuera de `<main>`, oculto por CSS hasta que el enlace «Ver todo el
 * archivo» lo convierte en destino (`:target`): funciona sin JavaScript y no
 * forma parte del texto principal de la página hasta que alguien lo pide.
 */

const canonicalUrl = "https://inplux.co/prensa";
const pageDescription =
  "Cobertura, conversaciones públicas, investigación y columnas firmadas vinculadas con INPLUX y su equipo, siempre con la fuente original a la vista.";

const sortedPressStories: PressStory[] = [...pressStories].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);

/** La foto del hero: la pieza más reciente con fotografía real de un escenario. */
const heroStory = sortedPressStories.find(
  (story) => story.visualKind === "photo" && story.image,
);

/** Las seis más recientes van a la vista; el resto del archivo, plegado. */
const LATEST_COUNT = 6;
const latestStories = sortedPressStories.slice(0, LATEST_COUNT);
const archivedStories = sortedPressStories.slice(LATEST_COUNT);

const groupedStories = pressCategories
  .map((category) => ({
    ...category,
    stories: archivedStories.filter((story) => story.category === category.label),
  }))
  .filter((category) => category.stories.length > 0);

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
    siteName: "INPLUX",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/brand/og/og-prensa.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
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
        url: "/brand/og/og-prensa.jpg",
        alt: "INPLUX, prensa y conversaciones",
      },
    ],
  },
};

/**
 * Nodo `Person` para el autor de una pieza del archivo.
 *
 * Cuando el byline corresponde a alguien del equipo se emite el `@id` canónico
 * definido en /equipo/[slug]. Sin él, cada una de las piezas firmadas creaba un
 * `Person` anónimo distinto: Google veía tantas personas homónimas como
 * publicaciones, en lugar de una sola con un cuerpo de trabajo atribuido.
 *
 * Los autores externos siguen emitiéndose sólo con `name`, que es lo correcto:
 * no nos corresponde asignarles identidad dentro de nuestro grafo.
 */
function authorNode(byline: string) {
  const member = findTeamMemberInByline(byline);
  return member
    ? { "@type": "Person", "@id": personId(member.slug), name: member.name }
    : { "@type": "Person", name: byline };
}

const crumbs: Crumb[] = [{ label: "Inicio", href: "/" }, { label: "Prensa" }];

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
      url: `${canonicalUrl}#archivo`,
      numberOfItems: sortedPressStories.length,
      itemListElement: sortedPressStories.map((story, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item:
          story.category === "Investigación"
            ? {
                "@type": "ScholarlyArticle",
                "@id": ownStoryUrl(story),
                url: ownStoryUrl(story),
                name: story.sourceTitle ?? story.title,
                headline: story.title,
                datePublished: story.publishedAt,
                description: story.summary,
                author: story.byline
                  ? story.byline.split(" · ").map(authorNode)
                  : undefined,
                creativeWorkStatus: story.editorialStatus,
                publisher: {
                  "@type": "Organization",
                  name: story.outlet,
                },
              }
            : eventFormats.has(story.format)
              ? {
                  "@type": "Event",
                  "@id": ownStoryUrl(story),
                  url: ownStoryUrl(story),
                  name: story.sourceTitle ?? story.title,
                  startDate: story.publishedAt,
                  eventAttendanceMode:
                    "https://schema.org/OfflineEventAttendanceMode",
                  location: {
                    "@type": "Place",
                    name: story.place ?? "Medellín, Colombia",
                  },
                  organizer: {
                    "@type": "Organization",
                    name: story.outlet,
                  },
                  performer: story.byline ? authorNode(story.byline) : undefined,
                }
              : {
                  "@type": "Article",
                  "@id": ownStoryUrl(story),
                  url: ownStoryUrl(story),
                  name: story.sourceTitle ?? story.title,
                  headline: story.title,
                  datePublished: story.publishedAt,
                  description: story.summary,
                  author:
                    story.category === "Ideas firmadas" && story.byline
                      ? authorNode(story.byline)
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

function StoryCard({ story }: { story: PressStory }) {
  return (
    <li className={styles.card}>
      <a
        href={story.href}
        {...(isOwnStory(story) ? {} : { target: "_blank", rel: "noreferrer" })}
        aria-label={`${story.title} — ${story.outlet}`}
      >
        <span className={styles.outlet}>{story.outlet}</span>
        <strong className={styles.title}>{story.title}</strong>
        {story.editorialStatus ? (
          <span className={styles.status}>{story.editorialStatus}</span>
        ) : null}
        <span className={styles.cardMeta}>
          <span>{story.format}</span>
          {story.byline ? <span>{story.byline}</span> : null}
          <time dateTime={story.publishedAt}>{story.publishedLabel}</time>
        </span>
        <span className={styles.arrow} aria-hidden="true">
          {isOwnStory(story) ? "→" : "↗"}
        </span>
      </a>
    </li>
  );
}

export default function Prensa() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pressCollectionJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLdDocument(crumbs, canonicalUrl)) }}
      />
      <ContactDialogProvider>
        <V5Page className={styles.root}>
          <main id="main-content" tabIndex={-1}>
            <section id="inicio" aria-labelledby="press-title">
              <PageHero
                className={styles.hero}
                eyebrow="Prensa y conversaciones"
                title={<span id="press-title">Lo que se ha publicado sobre nuestro trabajo.</span>}
                lead="Cobertura, escenarios públicos, investigación abierta y columnas firmadas."
                leadMuted="Cada pieza con su fecha, su medio y el enlace a la fuente. Las columnas propias y los trabajos sin revisión por pares van identificados."
                crumbs={crumbs}
                media={
                  heroStory?.image
                    ? {
                        kind: "image",
                        src: heroStory.image,
                        alt: heroStory.imageAlt ?? heroStory.title,
                        width: 1050,
                        height: 1400,
                        priority: true,
                      }
                    : { kind: "none" }
                }
              />
            </section>

            <Band id="archivo" labelledBy="archive-title" className={styles.archive}>
              <SectionHead
                id="archive-title"
                eyebrow={`Archivo con fuente · ${String(pressStories.length).padStart(2, "0")}`}
                title={
                  <>
                    Cada pieza, con su <em>fuente.</em>
                  </>
                }
              />
              <ul className={styles.cards}>
                {latestStories.map((story) => (
                  <StoryCard key={story.slug} story={story} />
                ))}
              </ul>
              {archivedStories.length > 0 ? (
                <p className={styles.moreLink}>
                  <a href="#archivo-completo">
                    Ver todo el archivo
                    <span>{String(archivedStories.length).padStart(2, "0")} piezas más</span>
                  </a>
                </p>
              ) : null}
              <p className={styles.pressRoom}>
                Solicitudes de prensa: <a href="mailto:gerencia@inplux.co?subject=Solicitud%20de%20prensa%20-%20INPLUX">gerencia@inplux.co</a>
              </p>
            </Band>
            <NextPage href="/nosotros" label="Nosotros" />
          </main>
          {archivedStories.length > 0 ? (
            <Band id="archivo-completo" labelledBy="archivo-completo-title" className={styles.full}>
              <SectionHead
                id="archivo-completo-title"
                eyebrow={`Archivo completo · ${String(archivedStories.length).padStart(2, "0")} piezas más`}
                title={
                  <>
                    El resto del <em>archivo.</em>
                  </>
                }
              />
              <nav className={styles.filters} aria-label="Secciones del archivo">
                {groupedStories.map((category) => (
                  <a key={category.id} href={`#${category.id}`}>
                    {category.label}
                    <span>{String(category.stories.length).padStart(2, "0")}</span>
                  </a>
                ))}
              </nav>
              {groupedStories.map((category) => (
                <section
                  key={category.id}
                  id={category.id}
                  className={styles.group}
                  aria-labelledby={`${category.id}-title`}
                >
                  <header className={styles.groupHead}>
                    <h3 id={`${category.id}-title`}>{category.label}</h3>
                    <p className={ui.small}>{category.description}</p>
                  </header>
                  <ul className={styles.cards}>
                    {category.stories.map((story) => (
                      <StoryCard key={story.slug} story={story} />
                    ))}
                  </ul>
                </section>
              ))}
              <p className={styles.moreLink}>
                <a href="#archivo">
                  Volver a las piezas recientes <span aria-hidden="true">↑</span>
                </a>
              </p>
            </Band>
          ) : null}
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

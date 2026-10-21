import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { NextPage } from "@/components/v5/NextPage";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import { Band, Button } from "@/components/v5/primitives";
import { ownStoryUrl, pressStories, type PressStory } from "@/content/press";
import { breadcrumbJsonLd, type Crumb } from "@/lib/breadcrumbs";
import styles from "./nota.module.css";

/*
 * `/prensa/[slug]`: las notas que escribimos nosotros. El resto del archivo de
 * /prensa enlaza a su fuente externa; aquí solo entran las piezas con
 * `article` en press.ts, y cada una lleva su portada, su texto y el enlace al
 * producto en vivo.
 */

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

type OwnStory = PressStory & { article: NonNullable<PressStory["article"]>; image: string };

const ownStories = (pressStories as readonly PressStory[]).filter(
  (story): story is OwnStory => Boolean(story.article && story.image),
);

const findStory = (slug: string) => ownStories.find((story) => story.slug === slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return ownStories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = findStory(slug);
  if (!story) return {};

  const url = ownStoryUrl(story);
  const ogImage = {
    url: `/brand/og/og-prensa-${story.slug}.jpg`,
    width: 1200,
    height: 630,
    alt: story.title,
  };

  return {
    title: story.title,
    description: story.article.dek,
    alternates: { canonical: url },
    openGraph: {
      title: `${story.title} | INPLUX`,
      description: story.article.dek,
      url,
      siteName: "INPLUX S.A.S.",
      locale: "es_CO",
      type: "article",
      publishedTime: story.publishedAt,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${story.title} | INPLUX`,
      description: story.article.dek,
      images: [{ url: ogImage.url, alt: ogImage.alt }],
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const story = findStory(slug);
  if (!story) notFound();

  const { article } = story;
  const url = ownStoryUrl(story);
  const crumbs: Crumb[] = [
    { label: "Inicio", href: "/" },
    { label: "Prensa", href: "/prensa" },
    { label: story.title },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#nota`,
        url,
        headline: story.title,
        description: article.dek,
        datePublished: story.publishedAt,
        image: `https://inplux.co${story.image}`,
        inLanguage: "es-CO",
        author: { "@id": "https://inplux.co/#organization" },
        publisher: { "@id": "https://inplux.co/#organization" },
        about: { "@type": "Organization", name: article.client.name },
        mentions: { "@type": "WebSite", name: article.product.label, url: article.product.href },
      },
      breadcrumbJsonLd(crumbs, url),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ContactDialogProvider>
        <V5Page className={styles.root}>
          <main id="main-content" tabIndex={-1}>
            <section id="inicio" aria-labelledby="note-title">
              <PageHero
                className={styles.hero}
                eyebrow={`${story.category} · ${story.format} · ${story.publishedLabel}`}
                title={<span id="note-title">{story.title}</span>}
                lead={article.dek}
                crumbs={crumbs}
                actions={
                  <Button href={article.product.href} variant="primary" external>
                    Ver {article.product.label}
                  </Button>
                }
              />
            </section>

            <Band id="nota" labelledBy="note-title">
              <figure className={styles.cover}>
                <Image
                  src={story.image}
                  alt={story.imageAlt ?? story.title}
                  width={1600}
                  height={900}
                  priority
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </figure>

              <div className={styles.body}>
                <div className={styles.prose}>
                  {article.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>

                <aside className={styles.aside} aria-label="Ficha del proyecto">
                  <div className={styles.client}>
                    <span className={styles.logo}>
                      <Image
                        src={article.client.logo.src}
                        alt={article.client.name}
                        width={article.client.logo.width}
                        height={article.client.logo.height}
                      />
                    </span>
                    <p>{article.client.place}</p>
                  </div>
                  <dl className={styles.facts}>
                    {article.facts.map((fact) => (
                      <div key={fact.label}>
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <a className={styles.product} href={article.product.href} target="_blank" rel="noreferrer">
                    {article.product.label} <span aria-hidden="true">↗</span>
                  </a>
                </aside>
              </div>
            </Band>
            <NextPage href="/prensa" label="Prensa y conversaciones" />
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

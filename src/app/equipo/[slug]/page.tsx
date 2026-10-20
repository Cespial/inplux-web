import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import { Band, Button, SectionHead } from "@/components/v5/primitives";
import { pressStories } from "@/content/press";
import {
  getTeamMember,
  personId,
  profileUrl,
  teamMembers,
} from "@/content/team";
import { breadcrumbJsonLd, type Crumb } from "@/lib/breadcrumbs";
import styles from "./perfil.module.css";

type TeamProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return teamMembers.map((member) => ({ slug: member.slug }));
}

/**
 * Publicaciones firmadas por la persona.
 *
 * Se busca el nombre legal y sus variantes como subcadena del byline porque
 * press.ts mezcla nombres limpios, coautorías separadas por “·” y notas en
 * prosa (“Entrevista a …”).
 */
function publicationsFor(slug: string) {
  const member = getTeamMember(slug);
  if (!member) return [];
  const candidates = [member.name, ...member.alternateName];

  return pressStories
    .filter((story) =>
      candidates.some((candidate) => story.byline?.includes(candidate)),
    )
    .slice()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function generateMetadata({
  params,
}: TeamProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMember(slug);

  if (!member) {
    return {};
  }

  const title = `${member.name} — ${member.jobTitle}`;
  const description = member.disambiguatingDescription;
  const url = profileUrl(member.slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${member.name} — ${member.jobTitle} | INPLUX`,
      description,
      url,
      siteName: "INPLUX S.A.S.",
      locale: "es_CO",
      type: "profile",
      images: [
        {
          url: "/brand/og/og-nosotros.png",
          width: 1200,
          height: 630,
          alt: `${member.name}, ${member.jobTitle} de INPLUX`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${member.name} — ${member.jobTitle} | INPLUX`,
      description,
      images: [
        {
          url: "/brand/og/og-nosotros.png",
          alt: `${member.name}, ${member.jobTitle} de INPLUX`,
        },
      ],
    },
  };
}

export default async function TeamProfile({ params }: TeamProfilePageProps) {
  const { slug } = await params;
  const member = getTeamMember(slug);

  if (!member) {
    notFound();
  }

  const publications = publicationsFor(member.slug);
  const url = profileUrl(member.slug);
  const id = personId(member.slug);

  const crumbs: Crumb[] = [
    { label: "Inicio", href: "/" },
    { label: "Equipo", href: "/equipo" },
    { label: member.name },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${url}#webpage`,
        url,
        name: `${member.name} — ${member.jobTitle} de INPLUX`,
        description: member.disambiguatingDescription,
        isPartOf: { "@id": "https://inplux.co/#website" },
        about: { "@id": id },
        mainEntity: { "@id": id },
      },
      {
        "@type": "Person",
        "@id": id,
        name: member.name,
        alternateName: [...member.alternateName],
        givenName: member.givenName,
        familyName: member.familyName,
        jobTitle: member.jobTitle,
        description: member.focus,
        disambiguatingDescription: member.disambiguatingDescription,
        url,
        worksFor: { "@id": "https://inplux.co/#organization" },
        knowsAbout: [...member.knowsAbout],
        sameAs: [...member.sameAs],
        workLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Medellín",
            addressRegion: "Antioquia",
            addressCountry: "CO",
          },
        },
        ...(publications.length > 0
          ? { subjectOf: publications.map((story) => ({ "@id": story.href })) }
          : {}),
      },
      breadcrumbJsonLd(crumbs, url),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactDialogProvider>
        <V5Page className={styles.root}>
          <main id="main-content" tabIndex={-1}>
            <section id="inicio" aria-labelledby="profile-title">
              <PageHero
                className={styles.hero}
                eyebrow={`${member.code} · ${member.role}`}
                title={<span id="profile-title">{member.name}</span>}
                lead={member.focus}
                crumbs={crumbs}
                actions={
                  <>
                    <Button href={member.linkedin} variant="primary" external>
                      LinkedIn
                    </Button>
                    <Button href={member.secondaryLink.href} external>
                      {member.secondaryLink.label} <span aria-hidden="true">↗</span>
                    </Button>
                  </>
                }
              />
            </section>

            <Band id="trayectoria" labelledBy="profile-bio">
              <SectionHead
                id="profile-bio"
                eyebrow="Trayectoria"
                title={
                  <>
                    Lo que hace y <em>desde dónde.</em>
                  </>
                }
              />
              <div className={styles.bio}>
                <div className={styles.prose}>
                  {member.profileBio.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
                <aside className={styles.aside} aria-label="Áreas y perfiles">
                  <div>
                    <h3>Áreas de trabajo</h3>
                    <ul className={styles.tags}>
                      {member.knowsAbout.map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>Perfiles</h3>
                    <ul className={styles.profiles}>
                      {member.sameAs.map((href) => (
                        <li key={href}>
                          <a href={href} rel="me noopener" target="_blank">
                            {new URL(href).hostname.replace(/^www\./, "")}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            </Band>

            {publications.length > 0 ? (
              <Band id="publicaciones" tone="light" labelledBy="profile-publications">
                <SectionHead
                  id="profile-publications"
                  eyebrow="Publicaciones y participaciones"
                  title={
                    <>
                      Con la fuente <em>a la vista.</em>
                    </>
                  }
                  link={{ href: "/prensa", label: "Ver el archivo de prensa" }}
                />
                <ol className={styles.publications}>
                  {publications.map((story) => (
                    <li key={story.slug}>
                      <a href={story.href} rel="noopener" target="_blank">
                        {story.title}
                      </a>
                      <p>
                        {story.outlet} · {story.format} ·{" "}
                        <time dateTime={story.publishedAt}>{story.publishedLabel}</time>
                      </p>
                    </li>
                  ))}
                </ol>
              </Band>
            ) : null}
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

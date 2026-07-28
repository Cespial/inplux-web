import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { pressStories } from "@/content/press";
import {
  getTeamMember,
  personId,
  profileUrl,
  teamMembers,
} from "@/content/team";
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
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
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
          {
            "@type": "ListItem",
            position: 3,
            name: member.name,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactDialogProvider>
        <div className={styles.profileRoot}>
          <SiteHeader inverseOnTop />
          <main id="main-content" tabIndex={-1}>
            <section
              className={styles.hero}
              aria-labelledby="profile-title"
              data-header-theme="dark"
            >
              <div className={styles.shell}>
                <p className={styles.eyebrow}>
                  <span>{member.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{member.role}</span>
                </p>
                <h1 className={styles.title} id="profile-title">
                  {member.name}
                </h1>
                <p className={styles.focus}>{member.focus}</p>
              </div>
            </section>

            <section className={styles.body} aria-labelledby="profile-bio">
              <div className={styles.shell}>
                <h2 className={styles.sectionTitle} id="profile-bio">
                  Trayectoria
                </h2>
                <div className={styles.prose}>
                  {member.profileBio.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>

                <h2 className={styles.sectionTitle}>Áreas de trabajo</h2>
                <ul className={styles.tags}>
                  {member.knowsAbout.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>

                <h2 className={styles.sectionTitle}>Perfiles</h2>
                <ul className={styles.links}>
                  {member.sameAs.map((href) => (
                    <li key={href}>
                      <a href={href} rel="me noopener" target="_blank">
                        {new URL(href).hostname.replace(/^www\./, "")}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {publications.length > 0 ? (
              <section
                className={styles.publications}
                aria-labelledby="profile-publications"
              >
                <div className={styles.shell}>
                  <h2 className={styles.sectionTitle} id="profile-publications">
                    Publicaciones y participaciones
                  </h2>
                  <p className={styles.note}>
                    Enlaces a la fuente original. El archivo completo está en{" "}
                    <Link href="/prensa">Prensa</Link>.
                  </p>
                  <ol className={styles.publicationList}>
                    {publications.map((story) => (
                      <li key={story.slug}>
                        <a href={story.href} rel="noopener" target="_blank">
                          {story.title}
                        </a>
                        <p className={styles.publicationMeta}>
                          <span>{story.outlet}</span>
                          <span aria-hidden="true">·</span>
                          <span>{story.format}</span>
                          <span aria-hidden="true">·</span>
                          <time dateTime={story.publishedAt}>
                            {story.publishedLabel}
                          </time>
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            ) : null}

            <section className={styles.back} aria-label="Continuar navegando">
              <div className={styles.shell}>
                <Link className={styles.backLink} href="/nosotros">
                  Volver a Nosotros
                </Link>
              </div>
            </section>
          </main>
          <SiteFooter />
        </div>
      </ContactDialogProvider>
    </>
  );
}

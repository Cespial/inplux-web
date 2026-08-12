import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ProductInterface } from "@/components/work/ProductInterface.client";
import { getWorkProfile, workProfiles } from "@/content/work";
import { getWorkSocialImageUrl } from "@/app/api/og/trabajo/social-card";
import styles from "./profile.module.css";

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return workProfiles.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getWorkProfile(slug);

  if (!profile) {
    return {};
  }

  const socialTitle = `${profile.name} — perfil de producto | INPLUX`;
  const socialDescription = `${profile.shortDescription} Estado: ${profile.status.label}. Atribución: ${profile.attribution.label}.`;
  const socialImage = getWorkSocialImageUrl(profile.slug);
  const socialImageAlt = `${profile.name}: ${profile.status.label}. ${profile.attribution.label}.`;

  return {
    title: `${profile.name} — perfil de producto`,
    description: `${profile.shortDescription} Estado: ${profile.status.label}. Atribución: ${profile.attribution.label}.`,
    alternates: {
      canonical: `https://inplux.co/trabajo/${profile.slug}`,
    },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url: `https://inplux.co/trabajo/${profile.slug}`,
      siteName: "INPLUX S.A.S.",
      locale: "es_CO",
      type: "website",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: socialImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [
        {
          url: socialImage,
          alt: socialImageAlt,
        },
      ],
    },
  };
}

function formatVerifiedDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(`${value}T00:00:00Z`))
    .replace(".", "")
    .toUpperCase();
}

export default async function ProductProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const profile = getWorkProfile(slug);

  if (!profile) {
    notFound();
  }

  const currentIndex = workProfiles.findIndex(
    (item) => item.slug === profile.slug,
  );
  const nextProfile = workProfiles[(currentIndex + 1) % workProfiles.length];

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${profile.name} — perfil de producto`,
    url: `https://inplux.co/trabajo/${profile.slug}`,
    description: profile.shortDescription,
    isPartOf: {
      "@type": "CollectionPage",
      name: "Trabajo y productos — evidencia y atribución",
      url: "https://inplux.co/trabajo",
    },
    dateModified: profile.sources[0]?.verifiedAt,
    mainEntity: {
      "@type": "SoftwareApplication",
      name: profile.name,
      applicationCategory: profile.category,
      url: profile.access.href,
      description: profile.shortDescription,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
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
              <div className={styles.heroCopy}>
                <div>
                  <Link className={styles.backLink} href="/trabajo">
                    <span aria-hidden="true">←</span> Trabajo y productos
                  </Link>
                  <p className={styles.eyebrow}>
                    <span>{profile.number}</span> Perfil de producto /{" "}
                    {profile.category}
                  </p>
                  <h1 id="profile-title">{profile.name}</h1>
                  <p className={styles.heroHeadline}>{profile.headline}</p>
                  <p className={styles.heroDescription}>{profile.description}</p>
                </div>
                <div className={styles.heroFacts}>
                  <div>
                    <span>ESTADO</span>
                    <strong>{profile.status.label}</strong>
                  </div>
                  <div>
                    <span>ACCESO</span>
                    <strong>{profile.access.label}</strong>
                  </div>
                  <div>
                    <span>ATRIBUCIÓN</span>
                    <strong>{profile.attribution.label}</strong>
                  </div>
                </div>
              </div>
              <ProductInterface profile={profile} />
            </section>

            <section className={styles.reading} aria-labelledby="reading-title">
              <div className={styles.readingHeading}>
                <p className={styles.eyebrow}>
                  <span>01</span> Cómo leer este perfil
                </p>
                <h2 id="reading-title">
                  Capacidad, estado y atribución son cosas <em>distintas.</em>
                </h2>
              </div>
              <div className={styles.readingGrid}>
                <article>
                  <span>01 / PRODUCTO</span>
                  <h3>{profile.shortDescription}</h3>
                  <p>
                    Esta descripción resume lo que puede observarse en la superficie
                    pública del producto.
                  </p>
                </article>
                <article>
                  <span>02 / ESTADO</span>
                  <h3>{profile.status.label}</h3>
                  <p>{profile.status.detail}</p>
                </article>
                <article
                  data-attribution={profile.attribution.state}
                  className={styles.attributionCard}
                >
                  <span>03 / ATRIBUCIÓN</span>
                  <h3>{profile.attribution.label}</h3>
                  <p>{profile.attribution.statement}</p>
                </article>
              </div>
            </section>

            <section
              className={styles.capabilities}
              aria-labelledby="capabilities-title"
            >
              <div className={styles.capabilityHeading}>
                <p className={styles.eyebrow}>
                  <span>02</span> Qué hace
                </p>
                <h2 id="capabilities-title">
                  Una lectura del <em>producto.</em>
                </h2>
                <p>
                  Capacidades descritas desde la información pública disponible.
                  No representan resultados medidos ni promesas comerciales.
                </p>
              </div>
              <ol className={styles.capabilityGrid}>
                {profile.capabilities.map((capability, index) => (
                  <li key={capability.title}>
                    <span>0{index + 1}</span>
                    <div>
                      <h3>{capability.title}</h3>
                      <p>{capability.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {profile.partners.length > 0 ? (
              <section className={styles.partners} aria-labelledby="partners-title">
                <div>
                  <p className={styles.eyebrow}>
                    <span>03</span> Responsabilidades
                  </p>
                  <h2 id="partners-title">
                    Un producto, roles <em>visibles.</em>
                  </h2>
                </div>
                <div className={styles.partnerList}>
                  {profile.partners.map((partner, index) => (
                    <article key={partner.name}>
                      <span>0{index + 1}</span>
                      <strong>{partner.name}</strong>
                      <p>{partner.role}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            <section className={styles.evidence} aria-labelledby="evidence-title">
              <div className={styles.evidenceIntro}>
                <p className={styles.eyebrow}>
                  <span>{profile.partners.length > 0 ? "04" : "03"}</span> Registro
                  de evidencia
                </p>
                <h2 id="evidence-title">
                  Qué sostiene este <em>perfil.</em>
                </h2>
                <p>
                  La tabla reúne las fuentes públicas de este perfil, con lo que
                  respalda cada una y la fecha en que se revisó por última vez.
                  La autoría del producto es una declaración de INPLUX: cuando
                  además está publicada en la fuente, la columna «Qué respalda»
                  lo dice.
                </p>
              </div>
              <table
                className={styles.evidenceTable}
                aria-labelledby="evidence-title"
              >
                <thead>
                  <tr className={styles.evidenceHead}>
                    <th scope="col">Fuente</th>
                    <th scope="col">Qué respalda</th>
                    <th scope="col">Verificada</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.sources.map((source, index) => (
                    <tr key={source.url}>
                      <th scope="row">
                        <div>
                          <small aria-hidden="true">0{index + 1}</small>
                          <a href={source.url} target="_blank" rel="noreferrer">
                            {source.label} <span aria-hidden="true">↗</span>
                          </a>
                        </div>
                      </th>
                      <td>
                        <p>{source.supports}</p>
                      </td>
                      <td>
                        <time dateTime={source.verifiedAt}>
                          {formatVerifiedDate(source.verifiedAt)}
                        </time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.evidenceNote}>
                <span>NOTA / METODOLOGÍA</span>
                <p>
                  La interfaz mostrada arriba es una demostración editorial construida
                  para explicar el tipo de experiencia. No es una captura, no reproduce
                  datos reales y no cuenta como evidencia del producto.
                </p>
              </div>
            </section>

            <section className={styles.access} aria-labelledby="access-title">
              <div>
                <p className={styles.eyebrow}>
                  <span>{profile.partners.length > 0 ? "05" : "04"}</span> Acceso
                </p>
                <h2 id="access-title">Conocer {profile.name} en su propia fuente.</h2>
                <p>{profile.access.detail}</p>
              </div>
              <a href={profile.access.href} target="_blank" rel="noreferrer">
                Ir al producto <span aria-hidden="true">↗</span>
              </a>
            </section>

            <nav className={styles.nextProfile} aria-label="Siguiente perfil">
              <div>
                <span>SIGUIENTE PERFIL / {nextProfile.number}</span>
                <p>{nextProfile.category}</p>
              </div>
              <Link href={`/trabajo/${nextProfile.slug}`}>
                {nextProfile.name} <span aria-hidden="true">↗</span>
              </Link>
            </nav>
          </main>
          <SiteFooter />
        </div>
      </ContactDialogProvider>
    </>
  );
}

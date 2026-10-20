import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { Band, Button, Chip, CloseBand, MailRow, SectionHead, buttonClass, statusTone } from "@/components/v5/primitives";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import { CapabilityRail } from "@/components/work/CapabilityRail.client";
import { ProductInterface } from "@/components/work/ProductInterface.client";
import { productMockups } from "@/components/work/ProductMockups";
import { getWorkProfile, workProfiles } from "@/content/work";
import { formatShortDate } from "@/content/work-format";
import { getWorkSocialImageUrl } from "@/app/api/og/trabajo/social-card";
import styles from "./profile.module.css";

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return workProfiles.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
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
    description: socialDescription,
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
      images: [{ url: socialImage, width: 1200, height: 630, alt: socialImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [{ url: socialImage, alt: socialImageAlt }],
    },
  };
}

export default async function ProductProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const profile = getWorkProfile(slug);

  if (!profile) {
    notFound();
  }

  const currentIndex = workProfiles.findIndex((item) => item.slug === profile.slug);
  const nextProfile = workProfiles[(currentIndex + 1) % workProfiles.length];
  const Mockup = productMockups[profile.slug];

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${profile.name} — perfil de producto`,
    url: `https://inplux.co/trabajo/${profile.slug}`,
    description: profile.shortDescription,
    isPartOf: {
      "@type": "CollectionPage",
      name: "Productos propios — Tribai, Gobia, Kelsen, Laudos y Porkia",
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
        <V5Page>
          <main id="main-content" tabIndex={-1}>
            <PageHero
              id="inicio"
              crumbs={[{ label: "Inicio", href: "/" }, { label: "Productos", href: "/trabajo" }, { label: profile.name }]}
              eyebrow={`${profile.number} · ${profile.category}`}
              title={profile.headline}
              lead={profile.description}
              aside={<Mockup profile={profile} animate />}
              actions={
                <>
                  <Button href={profile.access.href} variant="primary" external>
                    {profile.access.label}
                  </Button>
                  <Chip dot tone={statusTone(profile.status.label)}>
                    {profile.status.label}
                  </Chip>
                </>
              }
            />

            <Band labelledBy="facts-title" className={styles.stage}>
              <h2 id="facts-title" className={styles.visuallyHidden}>
                {profile.name}: estado, acceso y atribución
              </h2>
              <dl className={styles.facts}>
                <div>
                  <dt>Estado</dt>
                  <dd>{profile.status.label}</dd>
                  <p>{profile.status.detail}</p>
                </div>
                <div>
                  <dt>Acceso</dt>
                  <dd>{profile.access.label}</dd>
                </div>
                <div data-attribution={profile.attribution.state}>
                  <dt>Atribución</dt>
                  <dd>{profile.attribution.label}</dd>
                  <p>{profile.attribution.statement}</p>
                </div>
              </dl>
              <div className={styles.stageFrame}>
                <ProductInterface profile={profile} />
              </div>
            </Band>

            <Band labelledBy="capabilities-title" className={styles.capabilities}>
              <SectionHead
                id="capabilities-title"
                eyebrow="Qué hace"
                title={`Una lectura de ${profile.name}.`}
              />
              <CapabilityRail
                items={profile.capabilities}
                ariaLabel={`Capacidades de ${profile.name}`}
              />
            </Band>

            {profile.partners.length > 0 ? (
              <Band labelledBy="partners-title">
                <SectionHead
                  id="partners-title"
                  eyebrow="Responsabilidades"
                  title="Un producto, roles visibles."
                />
                <ol className={styles.partners}>
                  {profile.partners.map((partner, index) => (
                    <li key={partner.name}>
                      <span>{`0${index + 1}`}</span>
                      <strong>{partner.name}</strong>
                      <p>{partner.role}</p>
                    </li>
                  ))}
                </ol>
              </Band>
            ) : null}

            <Band tone="light" labelledBy="evidence-title">
              <SectionHead
                id="evidence-title"
                eyebrow="Registro de evidencia"
                title="Qué sostiene este perfil."
                lead="Cada fuente pública, lo que respalda y cuándo la revisamos."
              />
              <div className={styles.tableWrap}>
                <table className={styles.evidence} aria-labelledby="evidence-title">
                  <thead>
                    <tr>
                      <th scope="col">Fuente</th>
                      <th scope="col">Qué respalda</th>
                      <th scope="col">Verificada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.sources.map((source, index) => (
                      <tr key={source.url}>
                        <th scope="row">
                          <small aria-hidden="true">{`0${index + 1}`}</small>
                          <a href={source.url} target="_blank" rel="noreferrer">
                            {source.label} <span aria-hidden="true">↗</span>
                          </a>
                        </th>
                        <td>{source.supports}</td>
                        <td>
                          <time dateTime={source.verifiedAt}>{formatShortDate(source.verifiedAt)}</time>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={styles.note}>
                La interfaz de arriba es una demostración editorial: no es una captura ni cuenta como
                evidencia.
              </p>
            </Band>

            <CloseBand
              id="contacto"
              titleId="closing-title"
              eyebrow="El siguiente producto"
              title={
                <>
                  ¿Un problema parecido en tu <em>operación?</em>
                </>
              }
              lead="Cuéntanos el problema y quién lo vive. Si un producto propio aplica, lo adaptamos; si no, lo construimos."
            >
              <MailRow>
                <ContactLink
                  className={buttonClass("primary")}
                  fallbackHref="/contacto"
                  source="work-closing"
                >
                  Empezar un proyecto
                </ContactLink>
                <Button href={`/trabajo/${nextProfile.slug}`} variant="ghost">
                  Siguiente: {nextProfile.name} <span aria-hidden="true">→</span>
                </Button>
              </MailRow>
            </CloseBand>
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

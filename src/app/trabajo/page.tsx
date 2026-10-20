import type { Metadata } from "next";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import {
  Band,
  Button,
  Card,
  CardGrid,
  Chip,
  CloseBand,
  FeatureSplit,
  MailRow,
  Placeholder,
  buttonClass,
  statusTone,
  v5,
} from "@/components/v5/primitives";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import { productMockups } from "@/components/work/ProductMockups";
import { portfolio } from "@/content/home";
import { workProfiles, type WorkSlug } from "@/content/work";
import { getWorkSocialImageUrl } from "@/app/api/og/trabajo/social-card";
import styles from "./trabajo.module.css";

const pageTitle = "Productos propios — Tribai, Gobia, Kelsen, Laudos y Porkia";
const pageDescription =
  "Seis productos construidos y operados por INPLUX, cada uno con sus fuentes públicas y la fecha en que las revisamos.";
const workSocialImage = getWorkSocialImageUrl("directorio");
const workSocialDescription =
  "Cada producto documentado, con sus fuentes públicas y su fecha de verificación.";
const workSocialImageAlt =
  "INPLUX, directorio de trabajo y productos con fuentes verificadas";

// El orden editorial: Tribai abre porque es el producto público más usado y
// cierra Porkia, el perfil más nuevo. No es el orden de `work.ts`.
const order = ["tribai", "gobia", "kelsen", "laudos", "porkia"] as const satisfies readonly WorkSlug[];
const products = order.flatMap((slug) => {
  const profile = workProfiles.find((candidate) => candidate.slug === slug);
  return profile ? [profile] : [];
});
const inDevelopment = portfolio.filter((item) => item.stage === "En desarrollo");

/** La línea de cierre de cada bloque: lo que el producto deja en manos de quien lo usa. */
const closingLine: Record<WorkSlug, string> = {
  tribai: "El criterio sigue siendo del contador. Tribai le pone la fuente al lado.",
  gobia: "La decisión sigue siendo del municipio. Gobia la deja medible.",
  kelsen: "La tesis sigue siendo del abogado. Kelsen conserva la ruta.",
  laudos: "La lectura sigue siendo del árbitro. Laudos ordena el corpus.",
  porkia: "La finca la lleva quien la trabaja. Porkia reemplaza el cuaderno.",
};

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "https://inplux.co/trabajo",
  },
  openGraph: {
    title: `${pageTitle} | INPLUX`,
    description: workSocialDescription,
    url: "https://inplux.co/trabajo",
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [{ url: workSocialImage, width: 1200, height: 630, alt: workSocialImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | INPLUX`,
    description: workSocialDescription,
    images: [{ url: workSocialImage, alt: workSocialImageAlt }],
  },
};

const workJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: pageTitle,
  url: "https://inplux.co/trabajo",
  description: pageDescription,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: products.map((profile, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: profile.name,
      url: `https://inplux.co/trabajo/${profile.slug}`,
    })),
  },
};

export default function TrabajoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workJsonLd) }}
      />
      <ContactDialogProvider>
        <V5Page>
          <main id="main-content" tabIndex={-1}>
            <PageHero
              id="inicio"
              eyebrow="Productos propios"
              title="Seis productos construidos y operados por INPLUX."
              lead="Cada uno nació de un problema de un cliente y hoy funciona por su cuenta."
              leadMuted="Lo que ves abajo sale de sus páginas públicas, con la fecha en que lo revisamos."
              actions={
                <>
                  <Button href="#p-tribai" variant="primary">
                    Ver los productos
                  </Button>
                  <Button href="#contacto" variant="ghost">
                    Empezar un proyecto <span aria-hidden="true">↓</span>
                  </Button>
                </>
              }
            />

            <Band id="productos" labelledBy="products-statement" className={styles.statement}>
              <p className={styles.statementText} id="products-statement">
                Cada producto, con su <em>fuente</em> y su estado a la vista.
              </p>

              {products.map((profile, index) => {
                const Mockup = productMockups[profile.slug];
                return (
                  <FeatureSplit
                    key={profile.slug}
                    id={`p-${profile.slug}`}
                    reverse={index % 2 === 1}
                    kicker={
                      <>
                        {profile.category}{" "}
                        <Chip dot tone={statusTone(profile.status.label)}>
                          {profile.status.label}
                        </Chip>
                      </>
                    }
                    title={profile.name}
                    lead={profile.headline}
                    extra={
                      <>
                        <ul className={styles.bullets}>
                          {profile.capabilities.slice(0, 3).map((capability) => (
                            <li key={capability.title}>
                              <strong>{capability.title}.</strong> {capability.description}
                            </li>
                          ))}
                        </ul>
                        <p className={styles.closingLine}>{closingLine[profile.slug]}</p>
                      </>
                    }
                    actions={
                      <>
                        <Button href={`/trabajo/${profile.slug}`} variant="ghost">
                          Ver {profile.name} <span aria-hidden="true">→</span>
                        </Button>
                        {profile.slug === "tribai" ? <Chip>Tribai MCP · ejemplo ilustrativo</Chip> : null}
                      </>
                    }
                    media={<Mockup profile={profile} />}
                  />
                );
              })}

              {inDevelopment.length > 0 ? (
                <>
                  <p className={`${v5.eyebrow} ${styles.moreTitle}`}>En desarrollo</p>
                  <CardGrid className={styles.devGrid}>
                    {inDevelopment.map((item) => (
                      <Card
                        key={item.name}
                        id={`p-${item.name.toLowerCase()}`}
                        media={<Placeholder>En desarrollo</Placeholder>}
                        meta={`${item.category} · ${item.stage}`}
                        title={item.name}
                        text={item.description}
                      />
                    ))}
                  </CardGrid>
                </>
              ) : null}
            </Band>

            <CloseBand
              id="contacto"
              titleId="closing-title"
              eyebrow="El siguiente producto"
              title={
                <>
                  Construyamos lo que <em>sigue.</em>
                </>
              }
              lead="Cuéntanos el problema, quién lo vive y qué debería cambiar. No necesitas tener los requisitos ni el alcance definidos."
            >
              <MailRow>
                <ContactLink
                  className={buttonClass("primary")}
                  fallbackHref="/contacto"
                  source="work-closing"
                >
                  Empezar un proyecto
                </ContactLink>
                <Button href="/nosotros" variant="ghost">
                  Quiénes somos <span aria-hidden="true">→</span>
                </Button>
              </MailRow>
            </CloseBand>
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

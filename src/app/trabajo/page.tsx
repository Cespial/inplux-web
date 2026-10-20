import type { Metadata } from "next";
import Link from "next/link";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import {
  Band,
  Button,
  Card,
  CardGrid,
  Chip,
  CloseBand,
  MailRow,
  Placeholder,
  buttonClass,
  statusTone,
  v5,
} from "@/components/v5/primitives";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import { portfolio } from "@/content/home";
import { workProfiles, type WorkSlug } from "@/content/work";
import { getWorkSocialImageUrl } from "@/app/api/og/trabajo/social-card";
import { breadcrumbJsonLdDocument, type Crumb } from "@/lib/breadcrumbs";
import styles from "./trabajo.module.css";

const pageTitle = "Productos propios — Tribai, Gobia, Kelsen, Laudos y Porkia";
const pageDescription =
  "Cinco productos construidos y operados por INPLUX, y uno en desarrollo, cada uno con sus fuentes públicas y la fecha en que las revisamos.";
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

const crumbs: Crumb[] = [{ label: "Inicio", href: "/" }, { label: "Productos" }];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLdDocument(crumbs, "https://inplux.co/trabajo")) }}
      />
      <ContactDialogProvider>
        <V5Page>
          <main id="main-content" tabIndex={-1}>
            <PageHero
              id="inicio"
              eyebrow="Productos propios"
              crumbs={crumbs}
              title="Cinco productos construidos y operados por INPLUX."
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

              {/* Un índice: nombre, una línea y el enlace. El detalle vive en cada ficha. */}
              <ol className={styles.index}>
                {products.map((profile) => (
                  <li key={profile.slug} id={`p-${profile.slug}`} className={styles.row}>
                    <span className={styles.rowNumber} aria-hidden="true">{profile.number}</span>
                    <div className={styles.rowBody}>
                      <p className={v5.kicker}>
                        {profile.category}{" "}
                        <Chip dot tone={statusTone(profile.status.label)}>
                          {profile.status.label}
                        </Chip>
                      </p>
                      <h3 className={styles.rowTitle}>
                        <Link href={`/trabajo/${profile.slug}`}>{profile.name}</Link>
                      </h3>
                      <p className={styles.rowLine}>{profile.shortDescription}</p>
                    </div>
                    <Link href={`/trabajo/${profile.slug}`} className={styles.rowLink}>
                      Ver {profile.name} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ol>

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

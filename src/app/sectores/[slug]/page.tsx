import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectorView } from "@/components/pages/SectorView";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { V5Page } from "@/components/v5/V5Page";
import { languageAlternates } from "@/content/i18n";
import { sectorPageUi } from "@/content/page-ui";
import { getSectorProfile, sectorProfiles } from "@/content/sectores";
import { getWorkProfile, workDirectory } from "@/content/work";
import { breadcrumbJsonLd, type Crumb } from "@/lib/breadcrumbs";
import styles from "@/components/pages/Sector.module.css";

const ui = sectorPageUi.es;

/**
 * Páginas de sector: `/sectores/[slug]`, una plantilla para las cuatro.
 *
 * El orden sigue el de una página de industria de octubre de 2026: imagen a
 * sangre con el nombre del sector y un lead «IA para X, Y y Z.»; un reclamo con
 * tres promesas de dos tiempos; los productos propios que aplican; la norma
 * donde la hay; y una sola invitación al final. Salud conserva, además, sus
 * piezas con estado, en una línea cada una.
 *
 * Tres disparadores de contacto por página —cabecera, hero y cierre—: es lo
 * que `verify-build-output` cuenta para cada sector.
 */

type SectorPageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = "https://inplux.co";

export const dynamicParams = false;

export function generateStaticParams() {
  return sectorProfiles.map((sector) => ({ slug: sector.slug }));
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSectorProfile(slug);
  if (!sector) return {};

  const url = `${SITE_URL}/sectores/${sector.slug}`;
  const socialTitle = `${sector.title} | INPLUX`;
  /* La tarjeta se pinta con `scripts/og-cards.mjs` sobre la foto del hero. */
  const socialImage = `/brand/og/og-sector-${sector.slug}.jpg`;
  const socialImageAlt = `INPLUX · ${sector.name}. ${sector.lead}`;

  return {
    title: sector.title,
    description: sector.description,
    alternates: { canonical: url, languages: languageAlternates(`/sectores/${sector.slug}`) },
    openGraph: {
      title: socialTitle,
      description: sector.description,
      url,
      siteName: "INPLUX S.A.S.",
      locale: "es_CO",
      type: "website",
      images: [{ url: socialImage, width: 1200, height: 630, alt: socialImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: sector.description,
      images: [{ url: socialImage, alt: socialImageAlt }],
    },
  };
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = getSectorProfile(slug);
  if (!sector) notFound();

  const url = `${SITE_URL}/sectores/${sector.slug}`;
  const status = Object.fromEntries(workDirectory.map((entry) => [entry.name, entry.status]));
  const products = sector.products
    .map((productSlug) => getWorkProfile(productSlug))
    .filter((profile): profile is NonNullable<typeof profile> => Boolean(profile));

  /*
   * `Service` y no `Product`: la página describe lo que hacemos para un tipo
   * de organización. El proveedor es la organización del layout y la página
   * cuelga del sitio por su `@id`. Sin cobertura geográfica: es una afirmación
   * que el sitio no publica. El catálogo son las piezas documentadas, o las
   * promesas cuando el sector no tiene piezas con estado.
   */
  const offers = sector.capabilities
    ? sector.capabilities.map((capability) => ({
        name: capability.title,
        description: capability.description,
      }))
    : sector.promises.map((promise) => ({
        name: promise.label,
        description: `${promise.lineA} ${promise.lineB}`,
      }));

  const crumbs: Crumb[] = [{ label: ui.home, href: "/" }, { label: ui.sectors }, { label: sector.name }];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: sector.title,
        description: sector.description,
        inLanguage: "es-CO",
        dateModified: sector.verifiedAt,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        primaryImageOfPage: `${SITE_URL}${sector.hero.image}`,
        about: { "@id": `${url}#service` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: sector.title,
        serviceType: sector.serviceType,
        description: sector.intro,
        provider: { "@id": `${SITE_URL}/#organization` },
        audience: {
          "@type": "Audience",
          audienceType: sector.audienceType,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: ui.catalogName(sector.name),
          itemListElement: offers.map((offer) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", ...offer },
          })),
        },
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
            <SectorView
              lang="es"
              sector={sector}
              products={products}
              statusByName={status}
              statusLabel={(value) => value}
              crumbs={crumbs}
              workHref="/trabajo"
              productBasePath="/trabajo"
              contactHref="/contacto"
              heroSource="sector-hero"
              closingSource="sector-closing"
            />
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

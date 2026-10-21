import type { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "@/components/pages/Sector.module.css";
import { SectorView } from "@/components/pages/SectorView";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { V5Page } from "@/components/v5/V5Page";
import { SITE_URL, htmlLang } from "@/content/i18n";
import { sectorPageUi } from "@/content/page-ui";
import { capabilityStatusEn, getSectorProfileEn, sectorProfilesEn } from "@/content/sectores.en";
import { enSite } from "@/content/site.en";
import { directoryStatusEn, getWorkProfileEn } from "@/content/work.en";
import { breadcrumbJsonLd, type Crumb } from "@/lib/breadcrumbs";
import { englishPageMetadata } from "@/lib/metadata.en";

/**
 * `/en/sectors/[slug]`: el par inglés de `/sectores/[slug]`, con slugs en
 * inglés (`public-sector`, `health`, `legal-tax`, `business`) y la misma
 * plantilla (`SectorView`). Tres disparadores de contacto, como en español.
 */

type SectorPageProps = {
  params: Promise<{ slug: string }>;
};

const ui = sectorPageUi.en;

export const dynamicParams = false;

export function generateStaticParams() {
  return sectorProfilesEn.map((sector) => ({ slug: sector.enSlug }));
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSectorProfileEn(slug);
  if (!sector) return {};

  return englishPageMetadata({
    esPath: `/sectores/${sector.slug}`,
    title: sector.title,
    description: sector.description,
    socialTitle: `${sector.title} | INPLUX`,
    socialDescription: sector.description,
    /* La tarjeta se pinta con `scripts/og-cards.mjs` sobre la foto del hero. */
    image: `/brand/og/og-en-sector-${sector.enSlug}.jpg`,
    imageAlt: `INPLUX · ${sector.name}. ${sector.lead}`,
  });
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = getSectorProfileEn(slug);
  if (!sector) notFound();

  const url = `${SITE_URL}/en/sectors/${sector.enSlug}`;
  const products = sector.products
    .map((productSlug) => getWorkProfileEn(productSlug))
    .filter((profile): profile is NonNullable<typeof profile> => Boolean(profile));

  const offers = sector.capabilities
    ? sector.capabilities.map((capability) => ({
        name: capability.title,
        description: capability.description,
      }))
    : sector.promises.map((promise) => ({
        name: promise.label,
        description: `${promise.lineA} ${promise.lineB}`,
      }));

  const crumbs: Crumb[] = [enSite.homeCrumb, { label: ui.sectors }, { label: sector.name }];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: sector.title,
        description: sector.description,
        inLanguage: htmlLang.en,
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
        audience: { "@type": "Audience", audienceType: sector.audienceType },
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
      <ContactDialogProvider copy={enSite.contactDialog} formCopy={enSite.contactForm}>
        <V5Page
          className={styles.root}
          headerCopy={enSite.header}
          footerCopy={enSite.footer}
          desktopContactSource={enSite.headerSources.desktop}
          mobileContactSource={enSite.headerSources.mobile}
        >
          <main id="main-content" tabIndex={-1}>
            <SectorView
              lang="en"
              sector={sector}
              products={products}
              statusByName={directoryStatusEn}
              statusLabel={(value) => capabilityStatusEn[value as keyof typeof capabilityStatusEn] ?? value}
              crumbs={crumbs}
              workHref="/en/work"
              productBasePath="/en/work"
              contactHref="/en/contact"
              heroSource="en-sector-hero"
              closingSource="en-sector-closing"
            />
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

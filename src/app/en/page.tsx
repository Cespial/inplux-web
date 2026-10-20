import type { Metadata } from "next";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { HomeHero } from "@/components/home/HomeHero";
import { HeroStats } from "@/components/home/HeroStats";
import { HowWeWork } from "@/components/home/HowWeWork";
import { PartnerWall } from "@/components/home/PartnerWall";
import { Thesis } from "@/components/home/Thesis";
import { ClientWall, ProofRibbon } from "@/components/home/HomeSections";
import { ProductBlocks } from "@/components/home/ProductBlocks";
import { SectorStrip } from "@/components/home/SectorStrip";
import { TeamLeaders } from "@/components/home/TeamLeaders";
import { CopyEmailButton } from "@/components/home/CopyEmailButton.client";
import { FactoryPressStories } from "@/components/site/PressStories";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { homeCopyEn } from "@/content/copy/en";
import styles from "@/components/home/home.module.css";

/**
 * HOME en inglés.
 *
 * Misma página que `/`, mismos componentes y mismos identificadores de
 * fragmento; cambia el idioma y la entidad que firma: INPLUX LLC, con sede en
 * Miami, presta los servicios en el exterior y el equipo de ingeniería de
 * INPLUX S.A.S. los ejecuta desde Medellín.
 *
 * El `<html lang>` lo fija el layout raíz para todo el sitio, así que el idioma
 * de esta ruta se declara en su contenedor y en los `hreflang` recíprocos.
 */

const copy = homeCopyEn;

const languageAlternates = {
  "es-CO": "https://inplux.co",
  "en-US": "https://inplux.co/en",
  "x-default": "https://inplux.co",
};

const socialTitle = "AI transformation that reaches production.";
const socialImageAlt =
  "INPLUX, from a real problem to software in production";

export const metadata: Metadata = {
  title: {
    absolute: "AI development and implementation company in Miami, Florida | INPLUX",
  },
  description:
    "INPLUX LLC is a Miami-based AI development and implementation company. We develop and implement the AI transformation of companies and institutions across Latin America. Expert people direct the critical decisions.",
  alternates: {
    canonical: "https://inplux.co/en",
    languages: languageAlternates,
  },
  openGraph: {
    title: socialTitle,
    description:
      "See the products INPLUX develops and implements with companies and institutions across Latin America.",
    url: "https://inplux.co/en",
    siteName: "INPLUX S.A.S.",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/brand/og/og-default.png",
        width: 1200,
        height: 630,
        alt: socialImageAlt,
      },
    ],
  },
  twitter: {
    title: socialTitle,
    description: "We develop and implement the AI transformation of companies and institutions across Latin America.",
    images: [{ url: "/brand/og/og-default.png", alt: socialImageAlt }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://inplux.co/en#webpage",
      name: "INPLUX, AI development and implementation in Miami",
      url: "https://inplux.co/en",
      inLanguage: "en-US",
      isPartOf: { "@id": "https://inplux.co/#website" },
    },
    {
      "@type": "Organization",
      "@id": "https://inplux.co/en#organization-us",
      name: "INPLUX LLC",
      legalName: "INPLUX LLC",
      url: "https://inplux.co/en",
      email: "gerencia@inplux.co",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Miami",
        addressRegion: "FL",
        addressCountry: "US",
      },
      parentOrganization: { "@id": "https://inplux.co/#organization" },
    },
  ],
};

export default function EnglishHome() {
  const heroContactCta = (
    <ContactLink
      aria-label={copy.contact.heroCtaAriaLabel}
      fallbackHref="#contacto"
      source="en-home-hero"
    >
      {copy.contact.cta}
    </ContactLink>
  );

  const offerContactCta = (
    <ContactLink
      className={styles.contactOffer}
      fallbackHref="#contacto"
      source="en-home-offer"
    >
      {`${copy.contact.cta} `}<span aria-hidden="true">→</span>
    </ContactLink>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactDialogProvider
        copy={copy.contactDialog}
        formCopy={copy.contactForm}
      >
        <div className={styles.homeRoot} lang={copy.htmlLang}>
          <SiteHeader
            copy={copy.header}
            desktopContactSource="en-header-desktop"
            inverseOnTop
            mobileContactSource="en-header-mobile"
          />
          <main id="main-content" tabIndex={-1}>
            <section id="inicio">
              <HomeHero copy={copy.hero} primaryCta={heroContactCta} />
            </section>

            <ClientWall copy={copy.experienceRail} heading={copy.clientWall} />

            <Thesis copy={copy.thesis}>
              <HeroStats copy={copy.heroStats} />
            </Thesis>

            <HowWeWork copy={copy.howWeWork} />

            <ProofRibbon copy={copy.experienceRail} productHrefPrefix="#p-" />
            <ProductBlocks copy={copy.products} railCopy={copy.experienceRail} />

            <span id="publico" className={styles.anchor} aria-hidden="true" />
            <span id="privado" className={styles.anchor} aria-hidden="true" />
            <span id="empresas" className={styles.anchor} aria-hidden="true" />
            <SectorStrip copy={copy.sectorStrip} />
            <PartnerWall copy={copy.partnerWall} />
            <FactoryPressStories copy={copy.press} />
            <TeamLeaders copy={copy.team} />

            <section id="contacto" className={styles.contact} aria-labelledby="contact-title">
              <div className={styles.contactInner}>
                <div className={styles.contactCopy}>
                  <p>{copy.contact.eyebrow}</p>
                  <h2 id="contact-title">
                    {copy.contact.titleLead}<em>{copy.contact.titleEmphasis}</em>
                  </h2>
                  <p>{copy.contact.lead}</p>
                  {offerContactCta}
                  <div className={styles.contactDirect}>
                    <a id="contact-email" href="mailto:gerencia@inplux.co">
                      {copy.contact.email}
                    </a>
                    <CopyEmailButton
                      className={styles.contactCopyButton}
                      email={copy.contact.email}
                      targetId="contact-email"
                      label={copy.contact.copyAction}
                      doneLabel={copy.contact.copyDone}
                    />
                    <a
                      href="https://www.linkedin.com/company/inplux"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {copy.contact.linkedInLabel}
                    </a>
                    {copy.contact.locations.map((location) => (
                      <span key={location}>{location}</span>
                    ))}
                  </div>
                  {copy.contact.entityStatement ? (
                    <p className={styles.contactEntity}>{copy.contact.entityStatement}</p>
                  ) : null}
                </div>
              </div>
            </section>
          </main>
          <SiteFooter copy={copy.footer} />
        </div>
      </ContactDialogProvider>
    </>
  );
}

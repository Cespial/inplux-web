import type { Metadata } from "next";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { FactoryScrolly } from "@/components/home/FactoryScrolly.client";
import { HomeHero } from "@/components/home/HomeHero";
import {
  ApiChapter,
  BuildNarrative,
  ExperienceRail,
  SectorPanel,
} from "@/components/home/HomeSections";
import { SolutionsShowcase } from "@/components/home/SolutionsShowcase.client";
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

const socialTitle = "From a real problem to software in production.";
const socialImageAlt =
  "INPLUX, from a real problem to software in production";

export const metadata: Metadata = {
  title: {
    absolute: "Custom software factory in Miami, Florida | INPLUX",
  },
  description:
    "INPLUX LLC is a Miami-based custom software factory. We design, build and evolve software for companies and public institutions. AI accelerates the work; expert people direct the critical decisions.",
  alternates: {
    canonical: "https://inplux.co/en",
    languages: languageAlternates,
  },
  openGraph: {
    title: socialTitle,
    description:
      "See how INPLUX turns concrete needs into digital products that can be used and improved.",
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
    description: "A custom software factory for companies and public institutions.",
    images: [{ url: "/brand/og/og-default.png", alt: socialImageAlt }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://inplux.co/en#webpage",
      name: "INPLUX, custom software factory in Miami",
      url: "https://inplux.co/en",
      inLanguage: "en-US",
      isPartOf: { "@id": "https://inplux.co/#organization" },
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
            <ExperienceRail copy={copy.experienceRail} />

            <FactoryScrolly copy={copy.factoryScrolly} />

            <SolutionsShowcase copy={copy.solutions} />
            <ApiChapter copy={copy.apiChapter} />

            <section
              id="donde-trabajamos"
              className={styles.sectors}
              aria-labelledby="sectors-title"
            >
              <div className={styles.sectorsHeading}>
                <p>{copy.sectors.eyebrow}</p>
                <h2 id="sectors-title">{copy.sectors.title}</h2>
              </div>
              <div className={styles.sectorSplit}>
                <div id="publico">
                  <SectorPanel copy={copy.sectors} kind="public" />
                </div>
                <div id="privado">
                  <SectorPanel copy={copy.sectors} kind="private" />
                </div>
              </div>
            </section>

            <BuildNarrative copy={copy.build} />
            <FactoryPressStories copy={copy.press} />

            <section id="contacto" className={styles.contact} aria-labelledby="contact-title">
              <div className={styles.contactInner}>
                <div className={styles.contactCopy}>
                  <p>{copy.contact.eyebrow}</p>
                  <h2 id="contact-title">
                    {copy.contact.titleLead}<em>{copy.contact.titleEmphasis}</em>
                  </h2>
                  <p>{copy.contact.lead}</p>
                  <p className={styles.contactEntity}>
                    {copy.contact.entityStatement}
                  </p>
                  {offerContactCta}
                  <div className={styles.contactDirect}>
                    <a href="mailto:gerencia@inplux.co">gerencia@inplux.co</a>
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

import type { Metadata } from "next";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { CopyEmailButton } from "@/components/home/CopyEmailButton.client";
import {
  V5Audit,
  V5Hero,
  V5Latam,
  V5Press,
  V5Process,
  V5Products,
  V5Sectors,
  V5Team,
} from "@/components/home/v5/HomeV5";
import { LogoWall } from "@/components/v5/LogoWall";
import { Anchor, CloseBand, MailRow, buttonClass, v5 } from "@/components/v5/primitives";
import { V5Page } from "@/components/v5/V5Page";
import { homeCopyEn } from "@/content/copy/en";
import { homeSocialImageEn, socialSiteName, twitterImage } from "@/lib/social-cards";

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
    siteName: socialSiteName,
    locale: "en_US",
    alternateLocale: ["es_CO"],
    type: "website",
    images: [homeSocialImageEn],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: "We develop and implement the AI transformation of companies and institutions across Latin America.",
    images: [twitterImage(homeSocialImageEn)],
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
      className={buttonClass("primary")}
      fallbackHref="#contacto"
      source="en-home-hero"
    >
      {copy.contact.cta}
    </ContactLink>
  );

  const offerContactCta = (
    <ContactLink
      className={buttonClass("ghost")}
      fallbackHref="#contacto"
      source="en-home-offer"
    >
      {copy.contact.cta} <span aria-hidden="true">→</span>
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
        <V5Page
          lang={copy.htmlLang}
          headerCopy={copy.header}
          footerCopy={copy.footer}
          desktopContactSource="en-header-desktop"
          mobileContactSource="en-header-mobile"
        >
          <main id="main-content" tabIndex={-1}>
            <section id="inicio">
              <V5Hero copy={copy} primaryCta={heroContactCta} lang="en" />
            </section>

            <LogoWall copy={copy.experienceRail} heading={copy.clientWall} />

            {/* Fragmentos históricos de «Qué hacemos» y del motor: siguen resolviendo. */}
            <Anchor id="servicios" />
            <Anchor id="motor" />
            <V5Process copy={copy} />

            <Anchor id="trabajo-real" />
            <V5Products copy={copy} />

            {/* La tesis vive ahora en la banda de video: su fragmento sigue resolviendo. */}
            <Anchor id="tesis" />
            <V5Latam copy={copy} lang="en" />

            {/* Fragmentos históricos de «Dónde trabajamos»: siguen resolviendo. */}
            <Anchor id="publico" />
            <Anchor id="privado" />
            <Anchor id="empresas" />
            <V5Sectors copy={copy} />

            <V5Audit copy={copy} />
            <V5Press copy={copy} />
            <V5Team copy={copy} />

            <CloseBand
              id="contacto"
              titleId="contact-title"
              eyebrow={copy.v5.contactEyebrow}
              title={
                <>
                  {copy.contact.titleLead}<em>{copy.contact.titleEmphasis}</em>
                </>
              }
              lead={copy.contact.lead}
              footnote={copy.contact.entityStatement ?? copy.contact.locations.join(" · ")}
            >
              <MailRow>
                <a id="contact-email" className={v5.mail} href="mailto:gerencia@inplux.co">
                  {copy.contact.email}
                </a>
                <CopyEmailButton
                  className={buttonClass("ghost")}
                  email={copy.contact.email}
                  targetId="contact-email"
                  label={copy.contact.copyAction}
                  doneLabel={copy.contact.copyDone}
                />
                <a
                  className={buttonClass("ghost")}
                  href="https://www.linkedin.com/company/inplux"
                  target="_blank"
                  rel="noreferrer"
                >
                  {copy.contact.linkedInLabel}
                </a>
              </MailRow>
              {offerContactCta}
            </CloseBand>
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

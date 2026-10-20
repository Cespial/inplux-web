import type { Metadata } from "next";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { PartnerWall } from "@/components/home/PartnerWall";
import { ClientWall } from "@/components/home/HomeSections";
import { CopyEmailButton } from "@/components/home/CopyEmailButton.client";
import {
  V5Audit,
  V5Hero,
  V5Press,
  V5Process,
  V5Products,
  V5Sectors,
  V5Team,
  V5Thesis,
  v5Styles as v5,
} from "@/components/home/v5/HomeV5";
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
      className={`${v5.btn} ${v5.primary}`}
      fallbackHref="#contacto"
      source="en-home-hero"
    >
      {copy.contact.cta}
    </ContactLink>
  );

  const offerContactCta = (
    <ContactLink
      className={`${v5.btn} ${v5.ghost}`}
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
        <div className={`${styles.homeRoot} ${v5.root}`} lang={copy.htmlLang}>
          <SiteHeader
            copy={copy.header}
            desktopContactSource="en-header-desktop"
            inverseOnTop
            mobileContactSource="en-header-mobile"
          />
          <main id="main-content" tabIndex={-1}>
            <section id="inicio">
              <V5Hero copy={copy} primaryCta={heroContactCta} />
            </section>

            <ClientWall copy={copy.experienceRail} heading={copy.clientWall} />

            <V5Thesis copy={copy} lang="en" />

            {/* Fragmentos históricos de «Qué hacemos» y del motor: siguen resolviendo. */}
            <span id="servicios" className={styles.anchor} aria-hidden="true" />
            <span id="motor" className={styles.anchor} aria-hidden="true" />
            <V5Process copy={copy} />

            <span id="trabajo-real" className={styles.anchor} aria-hidden="true" />
            <V5Products copy={copy} />

            {/* Fragmentos históricos de «Dónde trabajamos»: siguen resolviendo. */}
            <span id="publico" className={styles.anchor} aria-hidden="true" />
            <span id="privado" className={styles.anchor} aria-hidden="true" />
            <span id="empresas" className={styles.anchor} aria-hidden="true" />
            <V5Sectors copy={copy} />

            <V5Audit copy={copy} />
            <PartnerWall copy={copy.partnerWall} />
            <V5Press copy={copy} />
            <V5Team copy={copy} />

            <section id="contacto" className={v5.close} aria-labelledby="contact-title">
              <span className={`${v5.plus} ${v5.tl}`} aria-hidden="true">+</span>
              <span className={`${v5.plus} ${v5.tr}`} aria-hidden="true">+</span>
              <span className={`${v5.plus} ${v5.bl}`} aria-hidden="true">+</span>
              <span className={`${v5.plus} ${v5.br}`} aria-hidden="true">+</span>
              <div className={`${v5.wrap} ${v5.closeInner}`}>
                <p className={v5.eyebrow}>{copy.v5.contactEyebrow}</p>
                <h2 className={v5.d1} id="contact-title">
                  {copy.contact.titleLead}<em>{copy.contact.titleEmphasis}</em>
                </h2>
                <p className={v5.lead}>{copy.contact.lead}</p>
                <div className={v5.mailRow}>
                  <a id="contact-email" className={v5.mail} href="mailto:gerencia@inplux.co">
                    {copy.contact.email}
                  </a>
                  <CopyEmailButton
                    className={`${v5.btn} ${v5.ghost}`}
                    email={copy.contact.email}
                    targetId="contact-email"
                    label={copy.contact.copyAction}
                    doneLabel={copy.contact.copyDone}
                  />
                  <a
                    className={`${v5.btn} ${v5.ghost}`}
                    href="https://www.linkedin.com/company/inplux"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {copy.contact.linkedInLabel}
                  </a>
                </div>
                {offerContactCta}
                <p className={v5.entity}>
                  {copy.contact.entityStatement ?? copy.contact.locations.join(" · ")}
                </p>
              </div>
            </section>
          </main>
          <SiteFooter copy={copy.footer} />
        </div>
      </ContactDialogProvider>
    </>
  );
}

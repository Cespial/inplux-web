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
import { homeCopyEs } from "@/content/copy/es";
import styles from "@/components/home/home.module.css";

export const metadata: Metadata = {
  title: "INPLUX | Transformación con IA que llega a producción",
  description:
    "Desarrollamos e implementamos la transformación con IA de empresas e instituciones en Latinoamérica. Productos propios en producción y equipos que los implementan.",
  alternates: {
    canonical: "https://inplux.co",
    languages: {
      "es-CO": "https://inplux.co",
      "en-US": "https://inplux.co/en",
      "x-default": "https://inplux.co",
    },
  },
};

/*
 * El `@id` del sitio es el que los perfiles de /equipo citan en `isPartOf`
 * desde julio de 2026; hasta la portada v2 nadie lo definía y la referencia
 * apuntaba al vacío. El editor es la organización que declara el layout.
 */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://inplux.co/#website",
  name: "INPLUX",
  alternateName: "INPLUX S.A.S.",
  url: "https://inplux.co",
  inLanguage: "es-CO",
  publisher: { "@id": "https://inplux.co/#organization" },
};

const copy = homeCopyEs;

/**
 * Portada v2.1 (octubre de 2026): hero → con quién (muro) → tesis con cifras
 * → cómo trabajamos → qué (productos) → dónde → prensa → quién responde, y
 * nada en ella que no salga de un archivo de contenido.
 *
 * Los identificadores de fragmento se conservan aunque la sección cambie de
 * forma: circulan en enlaces publicados y `verify-build-output` los exige.
 */
export default function Home() {
  const heroContactCta = (
    <ContactLink
      aria-label={copy.contact.heroCtaAriaLabel}
      fallbackHref="#contacto"
      source="home-hero"
    >
      {copy.contact.cta}
    </ContactLink>
  );

  const offerContactCta = (
    <ContactLink
      className={styles.contactOffer}
      fallbackHref="#contacto"
      source="home-offer"
    >
      {`${copy.contact.cta} `}<span aria-hidden="true">→</span>
    </ContactLink>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <ContactDialogProvider>
        <div className={styles.homeRoot}>
          <SiteHeader inverseOnTop />
          <main id="main-content" tabIndex={-1}>
            <section id="inicio">
              <HomeHero primaryCta={heroContactCta} />
            </section>

            <ClientWall />

            <Thesis>
              <HeroStats />
            </Thesis>

            <span id="servicios" className={styles.anchor} aria-hidden="true" />
            <span id="motor" className={styles.anchor} aria-hidden="true" />
            <HowWeWork />

            <ProofRibbon productHrefPrefix="#p-" />
            <ProductBlocks />

            {/* Fragmentos históricos de «Dónde trabajamos»: siguen resolviendo. */}
            <span id="publico" className={styles.anchor} aria-hidden="true" />
            <span id="privado" className={styles.anchor} aria-hidden="true" />
            <span id="empresas" className={styles.anchor} aria-hidden="true" />
            <SectorStrip />
            <PartnerWall />
            <FactoryPressStories />
            <TeamLeaders />

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
          <SiteFooter />
        </div>
      </ContactDialogProvider>
    </>
  );
}

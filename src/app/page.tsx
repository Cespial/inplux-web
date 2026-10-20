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
 * Portada v5 (20 de octubre de 2026): hero en video → con quién (muro) →
 * tesis con cifras publicadas → del diagnóstico a producción → productos →
 * sectores → auditoría y tecnología → prensa → quién responde → contacto. Las
 * secciones viven en `components/home/v5` y nada en ellas sale de otro lugar
 * que no sea un archivo de contenido.
 *
 * Los identificadores de fragmento se conservan aunque la sección cambie de
 * forma: circulan en enlaces publicados y `verify-build-output` los exige.
 */
export default function Home() {
  const heroContactCta = (
    <ContactLink
      aria-label={copy.contact.heroCtaAriaLabel}
      className={`${v5.btn} ${v5.primary}`}
      fallbackHref="#contacto"
      source="home-hero"
    >
      {copy.contact.cta}
    </ContactLink>
  );

  const offerContactCta = (
    <ContactLink
      className={`${v5.btn} ${v5.ghost}`}
      fallbackHref="#contacto"
      source="home-offer"
    >
      {copy.contact.cta} <span aria-hidden="true">→</span>
    </ContactLink>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <ContactDialogProvider>
        <div className={`${styles.homeRoot} ${v5.root}`}>
          <SiteHeader inverseOnTop />
          <main id="main-content" tabIndex={-1}>
            <section id="inicio">
              <V5Hero copy={copy} primaryCta={heroContactCta} />
            </section>

            <ClientWall copy={copy.experienceRail} heading={copy.clientWall} />

            <V5Thesis copy={copy} lang="es" />

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
          <SiteFooter />
        </div>
      </ContactDialogProvider>
    </>
  );
}

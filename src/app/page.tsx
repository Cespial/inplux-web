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
import { homeCopyEs } from "@/content/copy/es";

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
 * del diagnóstico a producción → productos → banda de video «Desde Medellín,
 * para Latinoamérica» con las cifras publicadas → tarjetas de sector →
 * auditoría y tecnología → prensa → quién responde → contacto. Las
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
      className={buttonClass("primary")}
      fallbackHref="#contacto"
      source="home-hero"
    >
      {copy.contact.cta}
    </ContactLink>
  );

  const offerContactCta = (
    <ContactLink
      className={buttonClass("ghost")}
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
        <V5Page>
          <main id="main-content" tabIndex={-1}>
            <section id="inicio">
              <V5Hero copy={copy} primaryCta={heroContactCta} />
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
            <V5Latam copy={copy} lang="es" />

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

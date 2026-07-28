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
import styles from "@/components/home/home.module.css";

export const metadata: Metadata = {
  title: "INPLUX | Fábrica de software a la medida",
  description:
    "Diseñamos, construimos y evolucionamos software a la medida para empresas y entidades. La IA acelera el trabajo; personas expertas dirigen las decisiones críticas.",
  alternates: { canonical: "https://inplux.co" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "INPLUX",
  alternateName: "INPLUX S.A.S.",
  url: "https://inplux.co",
};

export default function Home() {
  const heroContactCta = (
    <ContactLink
      aria-label="Empezar un proyecto"
      fallbackHref="#contacto"
      source="home-hero"
    >
      Empezar un proyecto
    </ContactLink>
  );

  const offerContactCta = (
    <ContactLink
      className={styles.contactOffer}
      fallbackHref="#contacto"
      source="home-offer"
    >
      Empezar un proyecto <span aria-hidden="true">→</span>
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
            <ExperienceRail />

            <span id="servicios" className={styles.anchor} aria-hidden="true" />
            <span id="motor" className={styles.anchor} aria-hidden="true" />
            <FactoryScrolly />

            <SolutionsShowcase />
            <ApiChapter />

            <section
              id="donde-trabajamos"
              className={styles.sectors}
              aria-labelledby="sectors-title"
            >
              <div className={styles.sectorsHeading}>
                <p>04 / DÓNDE TRABAJAMOS</p>
                <h2 id="sectors-title">Dos contextos. Un mismo estándar de producto.</h2>
              </div>
              <div className={styles.sectorSplit}>
                <div id="publico">
                  <SectorPanel kind="public" />
                </div>
                <div id="privado">
                  <span id="empresas" className={styles.anchor} aria-hidden="true" />
                  <SectorPanel kind="private" />
                </div>
              </div>
            </section>

            <BuildNarrative />
            <FactoryPressStories />

            <section id="contacto" className={styles.contact} aria-labelledby="contact-title">
              <div className={styles.contactInner}>
                <div className={styles.contactCopy}>
                  <p>08 / EL SIGUIENTE PRODUCTO</p>
                  <h2 id="contact-title">
                    Construyamos lo que <em>sigue.</em>
                  </h2>
                  <p>
                    Cuéntanos el problema, quién lo vive y qué debería cambiar. No necesitas
                    tener los requisitos ni el alcance definidos.
                  </p>
                  {offerContactCta}
                  <div className={styles.contactDirect}>
                    <a href="mailto:gerencia@inplux.co">gerencia@inplux.co</a>
                    <a
                      href="https://www.linkedin.com/company/inplux"
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn ↗
                    </a>
                    <span>Medellín, Antioquia · Colombia</span>
                  </div>
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

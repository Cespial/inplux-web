import type { Metadata } from "next";
import Image from "next/image";
import styles from "@/app/nosotros/nosotros.module.css";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import {
  Band,
  Button,
  CloseBand,
  MailRow,
  SectionHead,
  buttonClass,
  v5 as ui,
} from "@/components/v5/primitives";
import { SITE_URL, htmlLang } from "@/content/i18n";
import { aboutEn as copy } from "@/content/nosotros.en";
import { enSite } from "@/content/site.en";
import { personId, profileUrl, teamMembers } from "@/content/team";
import { breadcrumbJsonLd, type Crumb } from "@/lib/breadcrumbs";
import { englishPageMetadata } from "@/lib/metadata.en";

/*
 * `/en/about`: el par inglés de `/nosotros`. Mismas secciones, mismo crédito a
 * REDEK en el origen (`verify-build-output` lo exige en las dos) y la nota de
 * entidad de INPLUX LLC en el cierre. El equipo vive en `/equipo`, que se
 * publica solo en español: el botón lo dice con `hrefLang`.
 */

const PAGE_URL = `${SITE_URL}/en/about`;

export const metadata: Metadata = englishPageMetadata({
  esPath: "/nosotros",
  title: copy.meta.title,
  description: copy.meta.description,
  socialTitle: copy.meta.socialTitle,
  socialDescription: copy.meta.socialDescription,
  image: "/brand/og/og-en-about.jpg",
  imageAlt: copy.meta.imageAlt,
});

const crumbs: Crumb[] = [enSite.homeCrumb, { label: copy.crumb }];

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${PAGE_URL}#page`,
  name: copy.meta.jsonLdName,
  url: PAGE_URL,
  description: copy.meta.socialDescription,
  inLanguage: htmlLang.en,
  mainEntity: { "@id": `${SITE_URL}/#organization` },
};

const aboutSupportingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbJsonLd(crumbs, PAGE_URL),
    // Las personas se citan por su `@id` canónico, definido en /equipo/[slug].
    ...teamMembers.map((leader) => ({
      "@type": "Person",
      "@id": personId(leader.slug),
      name: leader.name,
      url: profileUrl(leader.slug),
      sameAs: [...leader.sameAs],
      worksFor: { "@id": `${SITE_URL}/#organization` },
    })),
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSupportingJsonLd) }}
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
            <section id="inicio" aria-labelledby="about-title">
              <PageHero
                className={styles.hero}
                eyebrow={copy.hero.eyebrow}
                title={<span id="about-title">{copy.hero.title}</span>}
                lead={copy.hero.lead}
                leadMuted={copy.hero.leadMuted}
                crumbs={crumbs}
                crumbsLabel={enSite.crumbsLabel}
                media={{
                  kind: "video",
                  poster: "/media/nosotros-poster.jpg",
                  sources: [
                    { src: "/media/nosotros-720.mp4", type: "video/mp4", media: "(max-width: 760px)" },
                    { src: "/media/nosotros-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
                    { src: "/media/nosotros-hevc.mp4", type: 'video/mp4; codecs="hvc1"' },
                    { src: "/media/nosotros.mp4", type: "video/mp4" },
                  ],
                }}
                actions={
                  <>
                    <Button href="/equipo" hrefLang="es" variant="primary">
                      {copy.hero.teamCta}
                    </Button>
                    <Button href="#origen">
                      {copy.hero.originCta} <span aria-hidden="true">↓</span>
                    </Button>
                  </>
                }
              />
            </section>

            <Band id="origen" labelledBy="origin-title" className={styles.origin}>
              <SectionHead
                id="origin-title"
                eyebrow={copy.origin.eyebrow}
                title={
                  <>
                    {copy.origin.titleLead}<em>{copy.origin.titleEmphasis}</em>
                  </>
                }
              />
              <div className={styles.originBody}>
                <div className={styles.originText}>
                  <p>{copy.origin.body}</p>
                  <blockquote className={styles.quote}>
                    <p className={ui.d2}>
                      {copy.origin.quoteLead}<em>{copy.origin.quoteEmphasis}</em>
                    </p>
                  </blockquote>
                </div>
                <figure className={styles.originFigure} data-reveal="media">
                  <Image
                    src="/brand/about/mesa-de-criterio.webp"
                    alt=""
                    width={960}
                    height={1200}
                    sizes="(max-width: 760px) 92vw, 34vw"
                  />
                </figure>
              </div>
            </Band>

            <Band id="razones" tone="light" labelledBy="reasons-title" className={styles.reasons}>
              <SectionHead
                id="reasons-title"
                eyebrow={copy.reasons.eyebrow}
                title={
                  <>
                    {copy.reasons.titleLead}<em>{copy.reasons.titleEmphasis}</em>
                  </>
                }
              />
              <ul className={styles.reasonList} aria-label={copy.reasons.ariaLabel}>
                {copy.reasons.items.map((reason) => (
                  <li key={reason.label}>
                    <span className={styles.reasonLabel}>{reason.label}</span>
                    <h3>{reason.title}</h3>
                    <p>{reason.copy}</p>
                  </li>
                ))}
              </ul>
            </Band>

            <Band id="construimos" labelledBy="building-title" className={styles.building}>
              <SectionHead
                id="building-title"
                eyebrow={copy.building.eyebrow}
                title={
                  <>
                    {copy.building.titleLead}<em>{copy.building.titleEmphasis}</em>
                  </>
                }
                lead={copy.building.lead}
              />
            </Band>

            <CloseBand
              id="contacto"
              titleId="closing-title"
              eyebrow={copy.closing.eyebrow}
              title={
                <>
                  {copy.closing.titleLead}<em>{copy.closing.titleEmphasis}</em>
                </>
              }
              lead={copy.closing.lead}
              footnote={enSite.entityStatement}
            >
              <MailRow>
                <ContactLink
                  className={buttonClass("primary")}
                  fallbackHref="/en/contact"
                  source="en-about-closing"
                >
                  {copy.closing.cta}
                </ContactLink>
                <Button href="mailto:gerencia@inplux.co">gerencia@inplux.co</Button>
              </MailRow>
            </CloseBand>
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

import type { Metadata } from "next";
import styles from "@/app/como-trabajamos/como-trabajamos.module.css";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import {
  Anchor,
  Band,
  Button,
  CloseBand,
  MailRow,
  SectionHead,
  Timeline,
  buttonClass,
  v5 as ui,
} from "@/components/v5/primitives";
import { howWeWorkEn as copy } from "@/content/como-trabajamos.en";
import { SITE_URL, htmlLang } from "@/content/i18n";
import { enSite } from "@/content/site.en";
import { breadcrumbJsonLdDocument, type Crumb } from "@/lib/breadcrumbs";
import { englishPageMetadata } from "@/lib/metadata.en";

/**
 * `/en/how-we-work`: el par inglés de `/como-trabajamos`, con la misma
 * estructura, las mismas anclas históricas y las mismas primitivas v5. Cambia
 * el copy (`como-trabajamos.en.ts`) y la entidad que firma: INPLUX LLC.
 */

const PAGE_URL = `${SITE_URL}/en/how-we-work`;

export const metadata: Metadata = englishPageMetadata({
  esPath: "/como-trabajamos",
  title: copy.meta.title,
  description: copy.meta.description,
  socialTitle: copy.meta.socialTitle,
  socialDescription: copy.meta.socialDescription,
  image: "/brand/og/og-en-how-we-work.jpg",
  imageAlt: copy.meta.imageAlt,
});

const crumbs: Crumb[] = [enSite.homeCrumb, { label: copy.crumb }];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  name: copy.meta.jsonLdName,
  url: PAGE_URL,
  description: copy.meta.description,
  inLanguage: htmlLang.en,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
};

export default function HowWeWorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLdDocument(crumbs, PAGE_URL)) }}
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
            <section id="inicio" aria-labelledby="how-title">
              <PageHero
                className={styles.hero}
                eyebrow={copy.hero.eyebrow}
                title={<span id="how-title">{copy.hero.title}</span>}
                lead={copy.hero.lead}
                leadMuted={copy.hero.leadMuted}
                crumbs={crumbs}
                crumbsLabel={enSite.crumbsLabel}
                media={{
                  kind: "video",
                  poster: "/media/como-poster.jpg",
                  sources: [
                    { src: "/media/como-720.mp4", type: "video/mp4", media: "(max-width: 760px)" },
                    { src: "/media/como-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
                    { src: "/media/como-hevc.mp4", type: 'video/mp4; codecs="hvc1"' },
                    { src: "/media/como.mp4", type: "video/mp4" },
                  ],
                }}
                actions={
                  <>
                    <ContactLink
                      className={buttonClass("primary")}
                      fallbackHref="/en/contact"
                      source="en-how-we-work-hero"
                    >
                      {copy.hero.cta}
                    </ContactLink>
                    <Button href="#fases">
                      {copy.hero.phasesCta} <span aria-hidden="true">↓</span>
                    </Button>
                  </>
                }
              />
            </section>

            <Band as="div" className={styles.statement}>
              <p className={`${ui.d2} ${styles.statementText}`}>
                {copy.statement.lead}<em>{copy.statement.emphasis}</em>
              </p>
            </Band>

            <Band id="fases" plus labelledBy="phases-title" className={styles.phases}>
              <SectionHead
                id="phases-title"
                eyebrow={copy.phases.process.eyebrow}
                title={
                  <>
                    {copy.phases.titleLead}<em>{copy.phases.titleEmphasis}</em>
                  </>
                }
                lead={copy.phases.lead}
                align="center"
              />
              <Timeline
                phases={copy.phases.process.phases}
                deliverableLabel={copy.phases.process.deliverableLabel}
              />
            </Band>

            {/* Las anclas históricas de la página española también resuelven aquí. */}
            <Anchor id="producto" />
            <Anchor id="modernizacion" />
            <Anchor id="ia" />
            <Anchor id="integracion" />

            <Band id="compromisos" tone="light" labelledBy="commitments-title" className={styles.commitments}>
              <SectionHead
                id="commitments-title"
                eyebrow={copy.commitments.eyebrow}
                title={
                  <>
                    {copy.commitments.titleLead}<em>{copy.commitments.titleEmphasis}</em>
                  </>
                }
              />
              <ol className={styles.commitmentList} aria-label={copy.commitments.ariaLabel}>
                {copy.commitments.items.map((item, index) => (
                  <li key={item.label} style={{ "--i": index } as React.CSSProperties}>
                    <span className={styles.commitmentLabel}>{item.label}</span>
                    <p className={styles.commitmentLines} aria-hidden="true">
                      <span>{item.lineA}</span>
                      <span>{item.lineB}</span>
                    </p>
                    <h3 className={styles.visuallyHidden}>{`${item.lineA} ${item.lineB}`}</h3>
                    <p className={styles.commitmentCopy}>{item.copy}</p>
                  </li>
                ))}
              </ol>
            </Band>

            <Anchor id="sector-publico" />
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
                  source="en-how-we-work-closing"
                >
                  {copy.closing.cta} <span aria-hidden="true">→</span>
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

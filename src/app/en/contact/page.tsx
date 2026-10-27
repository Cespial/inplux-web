import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/contacto/contacto.module.css";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactForm } from "@/components/site/ContactForm";
import { NextPage } from "@/components/v5/NextPage";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import { Band, v5 as ui } from "@/components/v5/primitives";
import { contactEn as copy } from "@/content/contacto.en";
import { SITE_URL, htmlLang } from "@/content/i18n";
import { enSite } from "@/content/site.en";
import { breadcrumbJsonLdDocument, type Crumb } from "@/lib/breadcrumbs";
import { englishPageMetadata } from "@/lib/metadata.en";

/*
 * `/en/contact`: el par inglés de `/contacto`. El mismo formulario —envío a
 * `/api/contacto`, marca de tiempo firmada, campo trampa y caída a `mailto:`—
 * con su copy en inglés. El route handler no cambia: el correo que llega al
 * equipo dice «Página: /en/contact» porque el formulario manda la ruta.
 */

const PAGE_URL = `${SITE_URL}/en/contact`;

export const metadata: Metadata = englishPageMetadata({
  esPath: "/contacto",
  title: copy.meta.title,
  description: copy.meta.description,
  socialTitle: copy.meta.socialTitle,
  socialDescription: copy.meta.socialDescription,
  twitterDescription: copy.meta.twitterDescription,
  image: "/brand/og/og-en-contact.jpg",
  imageAlt: copy.meta.imageAlt,
});

const crumbs: Crumb[] = [enSite.homeCrumb, { label: copy.crumb }];

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: copy.meta.jsonLdName,
  url: PAGE_URL,
  inLanguage: htmlLang.en,
  mainEntity: { "@id": `${SITE_URL}/#organization` },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
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
            <section id="inicio" aria-labelledby="contact-title">
              <PageHero
                className={styles.hero}
                eyebrow={copy.hero.eyebrow}
                title={<span id="contact-title">{copy.hero.title}</span>}
                lead={copy.hero.lead}
                leadMuted={copy.hero.leadMuted}
                crumbs={crumbs}
                crumbsLabel={enSite.crumbsLabel}
              />
            </section>

            <Band id="escribir" labelledBy="form-title" className={styles.contact}>
              <div className={styles.grid}>
                <div className={styles.direct}>
                  <p className={ui.eyebrow}>{copy.direct.eyebrow}</p>
                  <h2 className={ui.d2} id="form-title">
                    {copy.direct.titleLead}<em>{copy.direct.titleEmphasis}</em>
                  </h2>
                  <ul className={styles.channels} aria-label={copy.direct.channelsLabel}>
                    <li>
                      <a href="mailto:gerencia@inplux.co">gerencia@inplux.co</a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/company/inpluxco" target="_blank" rel="noreferrer">
                        LinkedIn <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                    {enSite.locations.map((location) => (
                      <li key={location}>{location}</li>
                    ))}
                  </ul>
                  <p className={styles.security}>
                    <Link href="/en/security">{copy.direct.security}</Link>
                  </p>
                </div>
                <div className={styles.panel}>
                  {copy.noJsNotices.map((notice) => (
                    <p key={notice.id} id={notice.id} className={styles.notice} tabIndex={-1}>
                      {notice.text}
                    </p>
                  ))}
                  <ContactForm context="section" copy={enSite.contactForm} />
                </div>
              </div>
            </Band>
            <NextPage
              href="/en/how-we-work"
              label={copy.next.label}
              eyebrow={enSite.next.eyebrow}
              ariaLabel={enSite.next.ariaLabel}
            />
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

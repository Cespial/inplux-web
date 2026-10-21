import type { Metadata } from "next";
import styles from "@/app/seguridad/seguridad.module.css";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { LegalShell } from "@/components/v5/LegalShell";
import { NextPage } from "@/components/v5/NextPage";
import { V5Page } from "@/components/v5/V5Page";
import { SITE_URL, htmlLang } from "@/content/i18n";
import { securityEn as copy } from "@/content/seguridad.en";
import { enSite } from "@/content/site.en";
import { englishPageMetadata } from "@/lib/metadata.en";

/*
 * `/en/security`: el par inglés de `/seguridad`. Las mismas afirmaciones,
 * aprobadas por la dirección, y las mismas normas citadas por su nombre
 * oficial. No sumes sellos, certificaciones, porcentajes ni promesas de
 * disponibilidad: `verify-build-output` vigila las dos versiones.
 */

const PAGE_URL = `${SITE_URL}/en/security`;

export const metadata: Metadata = englishPageMetadata({
  esPath: "/seguridad",
  title: copy.meta.title,
  description: copy.meta.description,
  socialTitle: copy.meta.socialTitle,
  socialDescription: copy.meta.socialDescription,
  image: "/brand/og/og-en-security.jpg",
  imageAlt: copy.meta.imageAlt,
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  name: copy.meta.jsonLdName,
  url: PAGE_URL,
  description: copy.meta.description,
  inLanguage: htmlLang.en,
  dateModified: "2026-10-20",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
};

const { sections } = copy;
const toc = (Object.keys(sections) as (keyof typeof sections)[]).map((id) => [id, sections[id].toc] as const);

export default function SecurityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactDialogProvider copy={enSite.contactDialog} formCopy={enSite.contactForm}>
        <V5Page
          headerCopy={enSite.header}
          footerCopy={enSite.footer}
          desktopContactSource={enSite.headerSources.desktop}
          mobileContactSource={enSite.headerSources.mobile}
        >
          <main id="main-content" tabIndex={-1}>
            <LegalShell
              eyebrow={copy.shell.eyebrow}
              title={
                <>
                  {copy.shell.titleLead}<em>{copy.shell.titleEmphasis}</em>
                </>
              }
              subtitle={copy.shell.subtitle}
              updated={{ label: copy.shell.updatedLabel, value: copy.shell.updatedValue }}
            >
              <nav className={styles.toc} aria-label={copy.tocLabel}>
                {toc.map(([id, label]) => (
                  <a key={id} href={`#${id}`}>
                    {label}
                  </a>
                ))}
              </nav>

              {(["encryption", "access", "separation", "models", "region"] as const).map((id) => (
                <section key={id} className={styles.section} aria-labelledby={id}>
                  <h2 id={id}>{sections[id].title}</h2>
                  <p>{sections[id].body}</p>
                </section>
              ))}

              <section className={styles.section} aria-labelledby="regulation">
                <h2 id="regulation">{sections.regulation.title}</h2>
                <p>
                  {sections.regulation.lead}
                  <a
                    href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981"
                    target="_blank"
                    rel="noreferrer"
                    hrefLang="es"
                  >
                    {sections.regulation.law}
                  </a>
                  {sections.regulation.lawGloss}
                  <a
                    href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%20No.%20866%20de%202021.pdf"
                    target="_blank"
                    rel="noreferrer"
                    hrefLang="es"
                  >
                    {sections.regulation.resolution}
                  </a>
                  {sections.regulation.resolutionGloss}
                </p>
              </section>

              <section className={styles.section} aria-labelledby="vulnerabilities">
                <h2 id="vulnerabilities">{sections.vulnerabilities.title}</h2>
                <p>
                  {sections.vulnerabilities.lead}
                  <a href={`mailto:gerencia@inplux.co?subject=${encodeURIComponent(sections.vulnerabilities.mailSubject)}`}>
                    gerencia@inplux.co
                  </a>
                  {sections.vulnerabilities.tail}
                </p>
              </section>
            </LegalShell>
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

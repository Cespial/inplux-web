import type { Metadata } from "next";
import { getWorkSocialImageUrl } from "@/app/api/og/trabajo/social-card";
import { WorkIndexView } from "@/components/pages/WorkIndexView";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { V5Page } from "@/components/v5/V5Page";
import { portfolio } from "@/content/home";
import { SITE_URL, htmlLang } from "@/content/i18n";
import { workIndexUi } from "@/content/page-ui";
import { enSite } from "@/content/site.en";
import type { WorkSlug } from "@/content/work";
import { inDevelopmentEn, workProfilesEn } from "@/content/work.en";
import { breadcrumbJsonLdDocument, type Crumb } from "@/lib/breadcrumbs";
import { englishPageMetadata } from "@/lib/metadata.en";

/**
 * `/en/work`: el par inglés de `/trabajo`, con la misma plantilla
 * (`WorkIndexView`) y los perfiles de `work.en.ts`.
 */

const ui = workIndexUi.en;
const PAGE_URL = `${SITE_URL}/en/work`;

const order = ["tribai", "gobia", "kelsen", "laudos", "porkia"] as const satisfies readonly WorkSlug[];
const products = order.flatMap((slug) => {
  const profile = workProfilesEn.find((candidate) => candidate.slug === slug);
  return profile ? [profile] : [];
});
const inDevelopment = portfolio
  .filter((item) => item.stage === "En desarrollo")
  .flatMap((item) => {
    const text = inDevelopmentEn[item.name];
    return text ? [{ name: item.name, ...text }] : [];
  });

export const metadata: Metadata = englishPageMetadata({
  esPath: "/trabajo",
  title: ui.pageTitle,
  description: ui.pageDescription,
  socialTitle: `${ui.pageTitle} | INPLUX`,
  socialDescription: ui.socialDescription,
  image: getWorkSocialImageUrl("directorio", "en"),
  imageAlt: ui.socialImageAlt,
});

const crumbs: Crumb[] = [enSite.homeCrumb, { label: ui.crumb }];

const workJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: ui.pageTitle,
  url: PAGE_URL,
  description: ui.pageDescription,
  inLanguage: htmlLang.en,
  about: { "@id": `${SITE_URL}/#organization` },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: products.map((profile, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: profile.name,
      url: `${PAGE_URL}/${profile.slug}`,
    })),
  },
};

export default function WorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLdDocument(crumbs, PAGE_URL)) }}
      />
      <ContactDialogProvider copy={enSite.contactDialog} formCopy={enSite.contactForm}>
        <V5Page
          headerCopy={enSite.header}
          footerCopy={enSite.footer}
          desktopContactSource={enSite.headerSources.desktop}
          mobileContactSource={enSite.headerSources.mobile}
        >
          <main id="main-content" tabIndex={-1}>
            <WorkIndexView
              lang="en"
              profiles={products}
              inDevelopment={inDevelopment}
              crumbs={crumbs}
              basePath="/en/work"
              contactHref="/en/contact"
              contactSource="en-work-closing"
              aboutHref="/en/about"
              closingFootnote={enSite.entityStatement}
            />
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

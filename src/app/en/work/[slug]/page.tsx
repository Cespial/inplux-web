import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkSocialImageUrl } from "@/app/api/og/trabajo/social-card";
import { ProductProfileView } from "@/components/pages/ProductProfileView";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { V5Page } from "@/components/v5/V5Page";
import { SITE_URL, htmlLang } from "@/content/i18n";
import { productProfileUi, workIndexUi } from "@/content/page-ui";
import { enSite } from "@/content/site.en";
import { profileEvidenceDate } from "@/content/work";
import { getWorkProfileEn, workProfilesEn } from "@/content/work.en";
import { breadcrumbJsonLdDocument, type Crumb } from "@/lib/breadcrumbs";
import { englishPageMetadata } from "@/lib/metadata.en";

/**
 * `/en/work/[slug]`: el par inglés de `/trabajo/[slug]`, mismos slugs y misma
 * plantilla (`ProductProfileView`). Los nombres de producto no se traducen.
 */

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

const ui = productProfileUi.en;

export const dynamicParams = false;

export function generateStaticParams() {
  return workProfilesEn.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getWorkProfileEn(slug);
  if (!profile) return {};

  const description = ui.socialDescription(
    profile.shortDescription,
    profile.status.label,
    profile.attribution.label,
  );

  return englishPageMetadata({
    esPath: `/trabajo/${profile.slug}`,
    title: `${profile.name} — ${ui.titleSuffix}`,
    description,
    socialTitle: `${profile.name} — ${ui.titleSuffix} | INPLUX`,
    socialDescription: description,
    image: getWorkSocialImageUrl(profile.slug, "en"),
    imageAlt: `${profile.name}: ${profile.status.label}. ${profile.attribution.label}.`,
  });
}

export default async function ProductProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const profile = getWorkProfileEn(slug);
  if (!profile) notFound();

  const currentIndex = workProfilesEn.findIndex((item) => item.slug === profile.slug);
  const nextProfile = workProfilesEn[(currentIndex + 1) % workProfilesEn.length];
  const url = `${SITE_URL}/en/work/${profile.slug}`;

  const crumbs: Crumb[] = [
    enSite.homeCrumb,
    { label: ui.products, href: "/en/work" },
    { label: profile.name },
  ];

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${profile.name} — ${ui.titleSuffix}`,
    url,
    description: profile.shortDescription,
    inLanguage: htmlLang.en,
    isPartOf: {
      "@type": "CollectionPage",
      name: workIndexUi.en.pageTitle,
      url: `${SITE_URL}/en/work`,
    },
    about: { "@id": `${SITE_URL}/#organization` },
    dateModified: profileEvidenceDate(profile),
    mainEntity: {
      "@type": "SoftwareApplication",
      name: profile.name,
      applicationCategory: profile.category,
      // Sin acceso público no hay URL que dar: la propiedad se omite.
      ...(profile.access.href ? { url: profile.access.href } : {}),
      description: profile.shortDescription,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLdDocument(crumbs, url)) }}
      />
      <ContactDialogProvider copy={enSite.contactDialog} formCopy={enSite.contactForm}>
        <V5Page
          headerCopy={enSite.header}
          footerCopy={enSite.footer}
          desktopContactSource={enSite.headerSources.desktop}
          mobileContactSource={enSite.headerSources.mobile}
        >
          <main id="main-content" tabIndex={-1}>
            <ProductProfileView
              lang="en"
              profile={profile}
              nextProfile={nextProfile}
              crumbs={crumbs}
              basePath="/en/work"
              contactHref="/en/contact"
              contactSource="en-work-closing"
              closingFootnote={enSite.entityStatement}
            />
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

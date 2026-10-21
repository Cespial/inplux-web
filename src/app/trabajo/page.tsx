import type { Metadata } from "next";
import { getWorkSocialImageUrl } from "@/app/api/og/trabajo/social-card";
import { WorkIndexView } from "@/components/pages/WorkIndexView";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { V5Page } from "@/components/v5/V5Page";
import { portfolio } from "@/content/home";
import { languageAlternates } from "@/content/i18n";
import { workIndexUi } from "@/content/page-ui";
import { workProfiles, type WorkSlug } from "@/content/work";
import { breadcrumbJsonLdDocument, type Crumb } from "@/lib/breadcrumbs";

const ui = workIndexUi.es;

const pageTitle = ui.pageTitle;
const pageDescription = ui.pageDescription;
const workSocialImage = getWorkSocialImageUrl("directorio");
const workSocialDescription = ui.socialDescription;
const workSocialImageAlt = ui.socialImageAlt;

// El orden editorial: Tribai abre porque es el producto público más usado y
// cierra Porkia, el perfil más nuevo. No es el orden de `work.ts`.
const order = ["tribai", "gobia", "kelsen", "laudos", "porkia"] as const satisfies readonly WorkSlug[];
const products = order.flatMap((slug) => {
  const profile = workProfiles.find((candidate) => candidate.slug === slug);
  return profile ? [profile] : [];
});
const inDevelopment = portfolio
  .filter((item) => item.stage === "En desarrollo")
  .map((item) => ({
    name: item.name,
    category: item.category,
    stage: item.stage ?? "",
    description: item.description,
  }));

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "https://inplux.co/trabajo",
    languages: languageAlternates("/trabajo"),
  },
  openGraph: {
    title: `${pageTitle} | INPLUX`,
    description: workSocialDescription,
    url: "https://inplux.co/trabajo",
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [{ url: workSocialImage, width: 1200, height: 630, alt: workSocialImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | INPLUX`,
    description: workSocialDescription,
    images: [{ url: workSocialImage, alt: workSocialImageAlt }],
  },
};

const crumbs: Crumb[] = [{ label: ui.home, href: "/" }, { label: ui.crumb }];

const workJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: pageTitle,
  url: "https://inplux.co/trabajo",
  description: pageDescription,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: products.map((profile, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: profile.name,
      url: `https://inplux.co/trabajo/${profile.slug}`,
    })),
  },
};

export default function TrabajoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLdDocument(crumbs, "https://inplux.co/trabajo")) }}
      />
      <ContactDialogProvider>
        <V5Page>
          <main id="main-content" tabIndex={-1}>
            <WorkIndexView
              lang="es"
              profiles={products}
              inDevelopment={inDevelopment}
              crumbs={crumbs}
              basePath="/trabajo"
              contactHref="/contacto"
              contactSource="work-closing"
              aboutHref="/nosotros"
            />
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

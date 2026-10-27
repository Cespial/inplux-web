import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkSocialImageUrl } from "@/app/api/og/trabajo/social-card";
import { ProductProfileView } from "@/components/pages/ProductProfileView";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { V5Page } from "@/components/v5/V5Page";
import { languageAlternates } from "@/content/i18n";
import { productProfileUi, workIndexUi } from "@/content/page-ui";
import { getWorkProfile, profileEvidenceDate, workProfiles } from "@/content/work";
import { breadcrumbJsonLdDocument, type Crumb } from "@/lib/breadcrumbs";

const ui = productProfileUi.es;

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return workProfiles.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getWorkProfile(slug);

  if (!profile) {
    return {};
  }

  const socialTitle = `${profile.name} — ${ui.titleSuffix} | INPLUX`;
  const socialDescription = ui.socialDescription(
    profile.shortDescription,
    profile.status.label,
    profile.attribution.label,
  );
  const socialImage = getWorkSocialImageUrl(profile.slug);
  const socialImageAlt = `${profile.name}: ${profile.status.label}. ${profile.attribution.label}.`;

  return {
    title: `${profile.name} — ${ui.titleSuffix}`,
    description: socialDescription,
    alternates: {
      canonical: `https://inplux.co/trabajo/${profile.slug}`,
      languages: languageAlternates(`/trabajo/${profile.slug}`),
    },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url: `https://inplux.co/trabajo/${profile.slug}`,
      siteName: "INPLUX",
      locale: "es_CO",
      type: "website",
      images: [{ url: socialImage, width: 1200, height: 630, type: "image/png", alt: socialImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [{ url: socialImage, alt: socialImageAlt }],
    },
  };
}

export default async function ProductProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const profile = getWorkProfile(slug);

  if (!profile) {
    notFound();
  }

  const currentIndex = workProfiles.findIndex((item) => item.slug === profile.slug);
  const nextProfile = workProfiles[(currentIndex + 1) % workProfiles.length];
  const crumbs: Crumb[] = [
    { label: ui.home, href: "/" },
    { label: ui.products, href: "/trabajo" },
    { label: profile.name },
  ];

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${profile.name} — ${ui.titleSuffix}`,
    url: `https://inplux.co/trabajo/${profile.slug}`,
    description: profile.shortDescription,
    isPartOf: {
      "@type": "CollectionPage",
      name: workIndexUi.es.pageTitle,
      url: "https://inplux.co/trabajo",
    },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLdDocument(crumbs, `https://inplux.co/trabajo/${profile.slug}`)) }}
      />
      <ContactDialogProvider>
        <V5Page>
          <main id="main-content" tabIndex={-1}>
            <ProductProfileView
              lang="es"
              profile={profile}
              nextProfile={nextProfile}
              crumbs={crumbs}
              basePath="/trabajo"
              contactHref="/contacto"
              contactSource="work-closing"
            />
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

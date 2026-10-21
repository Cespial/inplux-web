import type { Metadata } from "next";
import { SITE_URL, enPathOf, languageAlternates } from "@/content/i18n";

/**
 * Metadatos de una página inglesa con par en español. Cada página escribe su
 * copy; aquí se arma lo que es igual en todas: canonical, hreflang recíproco
 * (el mismo bloque que publica su par), `og:locale` y la tarjeta.
 */
export function englishPageMetadata({
  esPath,
  title,
  description,
  socialTitle,
  socialDescription,
  twitterDescription = socialDescription,
  image,
  imageAlt,
}: {
  /** Ruta del par español: de ahí salen la URL inglesa y el hreflang. */
  esPath: string;
  title: string;
  description: string;
  socialTitle: string;
  socialDescription: string;
  twitterDescription?: string;
  image: string;
  imageAlt: string;
}): Metadata {
  const url = `${SITE_URL}${enPathOf(esPath)}`;
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(esPath) },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url,
      siteName: "INPLUX S.A.S.",
      locale: "en_US",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: twitterDescription,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}

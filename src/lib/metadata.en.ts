import type { Metadata } from "next";
import { SITE_URL, enPathOf, languageAlternates } from "@/content/i18n";
import { jpegSocialImage, socialSiteName, twitterImage } from "@/lib/social-cards";

/**
 * Metadatos de una página inglesa con par en español. Cada página escribe su
 * copy; aquí se arma lo que es igual en todas: canonical, hreflang recíproco
 * (el mismo bloque que publica su par), `og:locale`, `og:site_name` (el de
 * `social-cards.ts`) y la tarjeta: un JPEG de `og-cards.mjs` o
 * `/api/og/trabajo/[key]?lang=en`, que es PNG.
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
  image: string | { url: string; alt: string };
  imageAlt?: string;
}): Metadata {
  const url = `${SITE_URL}${enPathOf(esPath)}`;
  const card =
    typeof image === "string"
      ? image.endsWith(".jpg")
        ? jpegSocialImage(image, imageAlt ?? "")
        : { url: image, width: 1200, height: 630, type: "image/png", alt: imageAlt ?? "" }
      : image;
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(esPath) },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url,
      siteName: socialSiteName,
      locale: "en_US",
      type: "website",
      images: [card],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: twitterDescription,
      images: [twitterImage(card)],
    },
  };
}

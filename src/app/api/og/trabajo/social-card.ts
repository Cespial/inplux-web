import type { Lang } from "@/content/i18n";
import {
  getWorkProfile,
  workProfiles,
  type WorkProfile,
  type WorkSlug,
} from "@/content/work";
import { getWorkProfileEn } from "@/content/work.en";

export type WorkSocialKey = "directorio" | WorkSlug;

type DirectorySocialCard = {
  key: "directorio";
  kind: "directory";
  title: string;
  description: string;
  eyebrow: string;
  status: string;
  attribution: string;
  sourceCount: number;
  version: string;
};

type ProfileSocialCard = {
  key: WorkSlug;
  kind: "profile";
  title: string;
  description: string;
  eyebrow: string;
  category: string;
  status: string;
  attribution: string;
  attributionState: WorkProfile["attribution"]["state"];
  version: string;
};

export type WorkSocialCard = (DirectorySocialCard | ProfileSocialCard) & {
  lang: Lang;
  /** Las etiquetas fijas de la tarjeta, en su idioma. */
  labels: SocialCardLabels;
};

type SocialCardLabels = {
  ownProduct: string;
  ownProducts: string;
  publicSources: string;
  footer: (version: string) => string;
};

const cardLabels: Record<Lang, SocialCardLabels> = {
  es: {
    ownProduct: "PRODUCTO PROPIO",
    ownProducts: "PRODUCTOS PROPIOS",
    publicSources: "FUENTES PÚBLICAS",
    footer: (version) => `INPLUX.CO/TRABAJO · VERIFICADO ${version}`,
  },
  en: {
    ownProduct: "OUR OWN PRODUCT",
    ownProducts: "OUR OWN PRODUCTS",
    publicSources: "PUBLIC SOURCES",
    footer: (version) => `INPLUX.CO/EN/WORK · VERIFIED ${version}`,
  },
};

/** `?lang=en` pinta la tarjeta inglesa; cualquier otro valor, la española. */
export function socialCardLang(value: string | null): Lang {
  return value === "en" ? "en" : "es";
}

const siteUrl = "https://inplux.co";

/**
 * La versión del diseño de la tarjeta. La URL social lleva `?v=` para que las
 * redes vuelvan a pedir la imagen cuando cambia: hasta octubre de 2026 solo se
 * movía con la verificación de las fuentes, y un rediseño de la tarjeta se
 * quedaba cacheado con la versión vieja. Se compara con la verificación más
 * reciente y gana la fecha mayor.
 */
export const workSocialDesignVersion = "2026-10-20";

function newer(a: string, b: string) {
  return a > b ? a : b;
}

function latestVerification(profile: WorkProfile) {
  return profile.sources.reduce(
    (latest, source) =>
      source.verifiedAt > latest ? source.verifiedAt : latest,
    "0000-00-00",
  );
}

export function isWorkSocialKey(value: string): value is WorkSocialKey {
  return value === "directorio" || Boolean(getWorkProfile(value));
}

export function getWorkSocialCard(key: WorkSocialKey, lang: Lang = "es"): WorkSocialCard {
  const labels = cardLabels[lang];
  if (key === "directorio") {
    const sourceCount = workProfiles.reduce(
      (total, profile) => total + profile.sources.length,
      0,
    );
    const version = workProfiles.reduce(
      (latest, profile) => {
        const profileVersion = latestVerification(profile);
        return profileVersion > latest ? profileVersion : latest;
      },
      "0000-00-00",
    );

    const directory =
      lang === "en"
        ? {
            title: "Our own products",
            description: "Every product, with its public sources and verification date.",
            eyebrow: "DIRECTORY / EVIDENCE",
            status: `${workProfiles.length} DOCUMENTED PRODUCTS`,
            attribution: "EVERY FACT WITH ITS SOURCE",
          }
        : {
            title: "Productos propios",
            description:
              "Cada producto, con sus fuentes públicas y su fecha de verificación.",
            eyebrow: "DIRECTORIO / EVIDENCIA",
            status: `${workProfiles.length} PRODUCTOS DOCUMENTADOS`,
            attribution: "CADA DATO CON SU FUENTE",
          };

    return {
      key,
      kind: "directory",
      ...directory,
      sourceCount,
      version: newer(version, workSocialDesignVersion),
      lang,
      labels,
    };
  }

  const profile = lang === "en" ? getWorkProfileEn(key) : getWorkProfile(key);

  // `key` has already been narrowed to the controlled set above.
  if (!profile) {
    throw new Error(`Perfil social no disponible: ${key}`);
  }

  return {
    key: profile.slug,
    kind: "profile",
    title: profile.name,
    description: profile.shortDescription,
    eyebrow: lang === "en" ? "PRODUCTS / WORK" : "PRODUCTOS / TRABAJO",
    category: profile.category,
    status: profile.status.label,
    attribution: profile.attribution.label,
    attributionState: profile.attribution.state,
    version: newer(latestVerification(profile), workSocialDesignVersion),
    lang,
    labels,
  };
}

/**
 * La URL de la tarjeta. La inglesa es la misma ruta con `?lang=en`: una sola
 * plantilla, dos idiomas, y la española conserva su URL de siempre.
 */
export function getWorkSocialImageUrl(key: WorkSocialKey, lang: Lang = "es") {
  const card = getWorkSocialCard(key, lang);
  const langQuery = lang === "en" ? "lang=en&" : "";
  return `${siteUrl}/api/og/trabajo/${key}?${langQuery}v=${card.version}`;
}


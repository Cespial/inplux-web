import type { Lang } from "@/content/i18n";
import {
  getWorkProfile,
  profileEvidenceDate,
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
  /** La verificación de fuentes más reciente, la fecha que se imprime. */
  verifiedAt: string;
  /** La versión de la URL (`?v=`): la verificación o el diseño, la mayor. */
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
  verifiedAt: string;
  version: string;
};

export type WorkSocialCard = (DirectorySocialCard | ProfileSocialCard) & {
  lang: Lang;
  /**
   * El pie de la tarjeta, ya escrito. «VERIFICADO <fecha>» cuando la fecha es
   * la de una fuente pública; «DECLARADO POR INPLUX <fecha>» cuando el perfil no
   * tiene fuentes y la fecha es la de la declaración (MiMotoYa la tuvo hasta
   * el 27-oct-2026): la tarjeta no afirma una verificación que no hubo.
   */
  footer: string;
  /** Las etiquetas fijas de la tarjeta, en su idioma. */
  labels: SocialCardLabels;
};

type SocialCardLabels = {
  ownProduct: string;
  ownProducts: string;
  publicSources: string;
  footer: (verifiedAt: string) => string;
  footerDeclared: (declaredAt: string) => string;
};

const cardLabels: Record<Lang, SocialCardLabels> = {
  es: {
    ownProduct: "PRODUCTO PROPIO",
    ownProducts: "PRODUCTOS PROPIOS",
    publicSources: "FUENTES PÚBLICAS",
    footer: (verifiedAt) => `INPLUX.CO/TRABAJO · VERIFICADO ${verifiedAt}`,
    footerDeclared: (declaredAt) => `INPLUX.CO/TRABAJO · DECLARADO POR INPLUX ${declaredAt}`,
  },
  en: {
    ownProduct: "OUR OWN PRODUCT",
    ownProducts: "OUR OWN PRODUCTS",
    publicSources: "PUBLIC SOURCES",
    footer: (verifiedAt) => `INPLUX.CO/EN/WORK · VERIFIED ${verifiedAt}`,
    footerDeclared: (declaredAt) => `INPLUX.CO/EN/WORK · STATED BY INPLUX ${declaredAt}`,
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
// «.2»: la segunda tarjeta del 20-oct-2026 (PR N), con la captura del
// mockup. La comparación es de texto: «2026-10-20.2» gana a «2026-10-20» y
// pierde contra cualquier verificación posterior.
export const workSocialDesignVersion = "2026-10-20.2";

function newer(a: string, b: string) {
  return a > b ? a : b;
}

/**
 * La fecha del perfil: su verificación más reciente o, sin fuentes, la de la
 * declaración de INPLUX (`profileEvidenceDate`). Mueve también el `?v=`.
 */
function latestVerification(profile: WorkProfile) {
  return profileEvidenceDate(profile);
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
    // Dos fechas distintas a propósito. La que se IMPRIME es la verificación
    // de fuentes públicas más reciente: una declaración de INPLUX no es una
    // verificación y la tarjeta no la presenta como tal. La que mueve el `?v=`
    // incluye también las declaraciones, porque un perfil nuevo sin fuentes
    // (así entró MiMotoYa) cambia la tarjeta y las redes tienen que volver a
    // pedirla.
    const verifiedAt = workProfiles
      .flatMap((profile) => profile.sources.map((source) => source.verifiedAt))
      .reduce((latest, date) => newer(date, latest), "0000-00-00");
    const version = workProfiles.reduce(
      (latest, profile) => newer(latestVerification(profile), latest),
      verifiedAt,
    );

    const directory =
      lang === "en"
        ? {
            title: "Our own products",
            description: "Every product, with its evidence and the date we reviewed it.",
            eyebrow: "DIRECTORY / EVIDENCE",
            status: `${workProfiles.length} DOCUMENTED PRODUCTS`,
            attribution: "EVERY FACT WITH ITS SOURCE",
          }
        : {
            title: "Productos propios",
            description: "Cada producto, con su evidencia y la fecha en que la revisamos.",
            eyebrow: "DIRECTORIO / EVIDENCIA",
            status: `${workProfiles.length} PRODUCTOS DOCUMENTADOS`,
            attribution: "CADA DATO CON SU FUENTE",
          };

    return {
      key,
      kind: "directory",
      ...directory,
      sourceCount,
      verifiedAt,
      version: newer(version, workSocialDesignVersion),
      lang,
      labels,
      footer: labels.footer(verifiedAt),
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
    verifiedAt: latestVerification(profile),
    version: newer(latestVerification(profile), workSocialDesignVersion),
    lang,
    labels,
    footer:
      profile.sources.length > 0
        ? labels.footer(latestVerification(profile))
        : labels.footerDeclared(latestVerification(profile)),
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


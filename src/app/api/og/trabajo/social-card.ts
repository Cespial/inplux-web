import {
  getWorkProfile,
  workProfiles,
  type WorkProfile,
  type WorkSlug,
} from "@/content/work";

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
  eyebrow: "PRODUCTOS / TRABAJO";
  category: string;
  status: string;
  attribution: string;
  attributionState: WorkProfile["attribution"]["state"];
  version: string;
};

export type WorkSocialCard = DirectorySocialCard | ProfileSocialCard;

const siteUrl = "https://inplux.co";

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

export function getWorkSocialCard(key: WorkSocialKey): WorkSocialCard {
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

    return {
      key,
      kind: "directory",
      title: "Trabajo y productos",
      description:
        "Cuatro productos, cada uno con sus fuentes públicas y su fecha de verificación.",
      eyebrow: "DIRECTORIO / EVIDENCIA",
      status: `${workProfiles.length} PERFILES DOCUMENTADOS`,
      attribution: "CADA DATO CON SU FUENTE",
      sourceCount,
      version,
    };
  }

  const profile = getWorkProfile(key);

  // `key` has already been narrowed to the controlled set above.
  if (!profile) {
    throw new Error(`Perfil social no disponible: ${key}`);
  }

  return {
    key: profile.slug,
    kind: "profile",
    title: profile.name,
    description: profile.shortDescription,
    eyebrow: "PRODUCTOS / TRABAJO",
    category: profile.category,
    status: profile.status.label,
    attribution: profile.attribution.label,
    attributionState: profile.attribution.state,
    version: latestVerification(profile),
  };
}

export function getWorkSocialImageUrl(key: WorkSocialKey) {
  const card = getWorkSocialCard(key);
  return `${siteUrl}/api/og/trabajo/${key}?v=${card.version}`;
}


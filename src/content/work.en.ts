import { workProfiles, type WorkProfile, type WorkSlug } from "@/content/work";

/**
 * Los perfiles de producto en inglés, para `/en/work` y `/en/work/[slug]`.
 *
 * Solo se traduce el texto. Todo lo que es dato —slug, número, enlaces, URL y
 * fecha de cada fuente, tema de la interfaz, socios— sale del perfil español
 * de `work.ts`, que sigue siendo la fuente de verdad: si una fuente se vuelve
 * a verificar allí, la ficha inglesa publica la fecha nueva sin tocar este
 * archivo. Las cifras son las mismas, escritas con la puntuación del inglés.
 *
 * Los nombres de producto no se traducen.
 */

type ProfileText = {
  category: string;
  shortDescription: string;
  headline: string;
  description: string;
  status: { label: string; detail: string };
  access: { label: string; detail: string };
  attribution: { label: string; statement: string };
  partnerRoles: readonly string[];
  capabilities: WorkProfile["capabilities"];
  interface: Pick<WorkProfile["interface"], "eyebrow" | "primaryMetric" | "metricLabel"> & {
    items: readonly { label: string; value: string }[];
  };
  sources: readonly { label: string; supports: string }[];
  /** Solo para el perfil sin fuentes públicas: la declaración de INPLUX, traducida. */
  declaration?: { label: string; supports: string };
};

const developedBy = (name: string, published: string) =>
  `${name} is developed by INPLUX. We state the authorship ourselves: the sources in this profile support what the product publishes —${published}—, not who built it.`;

const text: Record<WorkSlug, ProfileText> = {
  tribai: {
    category: "Tax",
    shortDescription: "Tax research with sources, validity and tools in plain view.",
    headline: "Find tax judgment without losing the source.",
    description:
      "Tribai brings tax research and tools together in an environment built to check the basis and validity of the information.",
    status: {
      label: "Public product",
      detail: "The site and its tools are publicly accessible.",
    },
    access: {
      label: "Open assistant",
      detail: "The tax assistant can be explored publicly on the official domain.",
    },
    attribution: {
      label: "Developed by INPLUX",
      statement: developedBy("Tribai", "capabilities, interface and availability"),
    },
    partnerRoles: [],
    capabilities: [
      {
        title: "Research with context",
        description: "The answer comes with references that let you keep reviewing.",
      },
      {
        title: "Visible sources",
        description:
          "The product shows where the information comes from, so reading doesn't end in an isolated answer.",
      },
      {
        title: "Validity",
        description: "The interface shows whether tax information is still in force.",
      },
      {
        title: "Tools",
        description: "It includes specialized utilities that support tax research.",
      },
    ],
    interface: {
      eyebrow: "RESEARCH / TAX",
      primaryMetric: "4",
      metricLabel: "verified sources",
      items: [
        { label: "Art. 383 ET", value: "In force" },
        { label: "Confidence", value: "88% · High" },
        { label: "Calculation", value: "7/7 matches" },
      ],
    },
    sources: [
      {
        label: "Tribai official site",
        supports:
          "Public existence of the product, tax focus, research, sources, validity and tools.",
      },
      {
        label: "Tribai public assistant",
        supports: "Public availability of the tax assistant interface shown in the screenshot.",
      },
    ],
  },
  gobia: {
    category: "Public management",
    shortDescription: "Municipal information and follow-up in a single environment.",
    headline: "Make a municipality's operation visible.",
    description:
      "Gobia organizes municipal information and follow-up to help read what happens inside a public organization. Its site publicly states that it is an INPLUX solution and offers a product demo.",
    status: {
      label: "Active pilot",
      detail: "Status published by the product at the time of verification.",
    },
    access: {
      label: "Open demo",
      detail: "The public demo lets you explore the command center with Medellín data.",
    },
    attribution: {
      label: "INPLUX solution",
      statement:
        "The relationship with INPLUX is publicly declared on Gobia's site. This profile documents that attribution without turning it into a claim about results.",
    },
    partnerRoles: [],
    capabilities: [
      {
        title: "Municipal reading",
        description: "Brings together information usually spread across departments and reports.",
      },
      {
        title: "Follow-up",
        description: "Shows issues, owners and statuses from a shared view.",
      },
      {
        title: "Operational traceability",
        description: "Keeps enough context to understand how each front is moving.",
      },
      {
        title: "Demo",
        description: "The product has a public path to see how it works.",
      },
    ],
    interface: {
      eyebrow: "MUNICIPALITY / OPERATIONS",
      primaryMetric: "16+",
      metricLabel: "connected sources",
      items: [
        { label: "Tax collection", value: "89.5% of target" },
        { label: "FUT report", value: "15 minutes" },
        { label: "Municipal tax code", value: "Active beta" },
      ],
    },
    sources: [
      {
        label: "Gobia official site",
        supports:
          "Product description, public attribution to INPLUX, pilot status and demo availability.",
      },
      {
        label: "Gobia public demo",
        supports:
          "Public availability of the map and the fiscal command center shown in the screenshot.",
      },
    ],
  },
  kelsen: {
    category: "Law",
    shortDescription: "Legal analysis, drafting and monitoring with traceability.",
    headline: "Work with legal knowledge along a verifiable path.",
    description:
      "Kelsen offers capabilities to research, analyze, draft and monitor legal work while keeping traceability.",
    status: {
      label: "Public explorer",
      detail: "The legal library and its filters are publicly accessible.",
    },
    access: {
      label: "Open explorer",
      detail: "The legal library can be explored publicly at kelsen.io.",
    },
    attribution: {
      label: "Developed by INPLUX",
      statement: developedBy("Kelsen", "capabilities, library and availability"),
    },
    partnerRoles: [],
    capabilities: [
      {
        title: "Analysis",
        description: "Organizes the study of legal documents and questions on one working surface.",
      },
      {
        title: "Drafting",
        description: "Supports building documents while keeping the research context.",
      },
      {
        title: "Monitoring",
        description: "Follows relevant matters and changes within legal work.",
      },
      {
        title: "Traceability",
        description: "Shows the path between a statement, its document and its source.",
      },
    ],
    interface: {
      eyebrow: "CASE FILE / ANALYSIS",
      primaryMetric: "PATH",
      metricLabel: "verifiable document trail",
      items: [
        { label: "Analysis", value: "Document and context" },
        { label: "Drafting", value: "Linked evidence" },
        { label: "Monitoring", value: "Official source" },
      ],
    },
    sources: [
      {
        label: "Kelsen official site",
        supports:
          "Public presentation of legal analysis, drafting, monitoring and traceability capabilities.",
      },
      {
        label: "Kelsen public explorer",
        supports:
          "Public availability of the legal library, search, filters and corpus results; it is the exact view used in the screenshot.",
      },
    ],
  },
  laudos: {
    category: "Arbitration",
    shortDescription: "Search across arbitral awards and arbitration case law, with legal judgment.",
    headline: "Explore arbitration knowledge with structure.",
    description:
      "Laudos offers search across arbitral awards and arbitration case law. Its site credits the technical development to INPLUX and the legal judgment to REDEK, and presents the product as an open beta.",
    status: {
      label: "Open beta",
      detail: "Status and access mode published by the product.",
    },
    access: {
      label: "Open lab",
      detail: "The Prediction Lab can be explored publicly in the open beta.",
    },
    attribution: {
      label: "Technical development by INPLUX",
      statement:
        "The public attribution separates responsibilities: INPLUX does the technical development and REDEK brings the legal judgment.",
    },
    partnerRoles: ["Legal judgment", "Technical development"],
    capabilities: [
      {
        title: "Specialized search",
        description: "Explore arbitral awards and case law from a domain-oriented query.",
      },
      {
        title: "Legal judgment",
        description:
          "The product's structure is developed together with a counterpart specialized in the field.",
      },
      {
        title: "Reading results",
        description: "Organizes matches and references so the analysis of the document can continue.",
      },
      {
        title: "Open beta",
        description: "Access lets you observe and evaluate the product while it keeps evolving.",
      },
    ],
    interface: {
      eyebrow: "ARBITRATION / SEARCH",
      primaryMetric: "5,447",
      metricLabel: "documents in the corpus",
      items: [
        { label: "Arbitral awards", value: "2,660" },
        { label: "Council of State", value: "2,787" },
        { label: "Coverage", value: "1985–2026" },
      ],
    },
    sources: [
      {
        label: "Laudos official site",
        supports:
          "Product purpose, open beta and the split attribution between INPLUX and REDEK.",
      },
      {
        label: "Laudos Prediction Lab",
        supports: "Public availability of the arbitration analysis form shown in the screenshot.",
      },
    ],
  },
  porkia: {
    category: "Pig farming",
    shortDescription: "Batches, feed, herd health and the accounts of a pig farm in one app.",
    headline: "Run a pig farm without going back to the notebook.",
    description:
      "Porkia brings batch tracking, feed, herd health and the accounts of a pig farm into a mobile app that works offline and keeps the data on the phone.",
    status: {
      label: "Closed beta",
      detail: "The site signs up pig farmers in Antioquia for a closed beta.",
    },
    access: {
      label: "Open demo",
      detail:
        "The app's screens can be browsed publicly in the browser, with sample data. The app is not shipped yet: the site signs people up for the closed beta and says it will send the link when it is ready.",
    },
    attribution: {
      label: "Developed by INPLUX",
      statement: developedBy("Porkia", "capabilities, demo and access mode"),
    },
    partnerRoles: [],
    capabilities: [
      {
        title: "Batches and growth",
        description:
          "Records each sow batch with its litters, the animals' weight and fattening progress.",
      },
      {
        title: "Feed and storage",
        description: "Tracks feed bags and their consumption by batch, and warns when stock runs low.",
      },
      {
        title: "Health plan",
        description:
          "Schedules vaccines, deworming and inspections, and reminds you of each one on the day it is due.",
      },
    ],
    interface: {
      eyebrow: "FARM / PIGS",
      primaryMetric: "PIG",
      metricLabel: "tracked from the day it is born",
      items: [
        { label: "Feed", value: "Bags and consumption" },
        { label: "Health", value: "Scheduled plan" },
        { label: "Accounts", value: "Income per batch" },
      ],
    },
    sources: [
      {
        label: "Porkia official site",
        supports:
          "Public existence of the product, its scope over batches, feed, health and accounts, offline operation and the closed beta for pig farmers in Antioquia.",
      },
      {
        label: "Porkia public demo",
        supports:
          "Public availability of the browsable demo with sample data; it is the exact view used in the screenshot.",
      },
    ],
  },
  mimotoya: {
    category: "Mobility",
    shortDescription: "Order a motocarro in Pácora, Caldas, with the price clear before you leave.",
    headline: "Order a motocarro with the price clear from the start.",
    description:
      "MiMotoYa is an iOS and Android app that people in Pácora, Caldas, use to order a motocarro —the three-wheeled moto-taxi of the town—: they pick a place in the town centre or a route to the rural villages, see the fare before ordering, and the app notifies nearby drivers.",
    status: {
      label: "Open beta",
      detail:
        "The app is in open beta and is being tested with drivers in Pácora before it opens to the whole municipality.",
    },
    access: {
      label: "Open site",
      detail: "The public site presents the app, its fares and the municipality where it runs.",
    },
    attribution: {
      label: "Developed by INPLUX",
      statement:
        "MiMotoYa is developed by INPLUX, and its public site says so in the footer. The screens in this profile were provided by INPLUX.",
    },
    partnerRoles: [],
    capabilities: [
      {
        title: "Places with a price",
        description: "Every neighbourhood and spot in the town centre shows its fare before you order.",
      },
      {
        title: "Routes to the villages",
        description: "Rural routes list their stops, and the price changes with how far you go.",
      },
      {
        title: "Fare before ordering",
        description:
          "You say how many people are going and the app shows the total fare before you confirm the trip.",
      },
      {
        title: "A nearby driver",
        description:
          "When you order, the app notifies nearby motocarro drivers and shows how the search is going.",
      },
    ],
    interface: {
      eyebrow: "TRIP / MOTOCARRO",
      primaryMetric: "FARE",
      metricLabel: "in view before ordering",
      items: [
        { label: "Town centre", value: "Places with a price" },
        { label: "Rural villages", value: "Routes by stop" },
        { label: "Order", value: "Nearby drivers notified" },
      ],
    },
    sources: [
      {
        label: "MiMotoYa official site",
        supports:
          "Public existence of the app, the test with drivers in Pácora before it opens to the whole municipality, the official fare set by the mayor's office with cash payment, choosing a place or route before ordering, and the attribution of the development to INPLUX.",
      },
    ],
  },
};

function translate(profile: WorkProfile): WorkProfile {
  const t = text[profile.slug];
  return {
    ...profile,
    category: t.category,
    shortDescription: t.shortDescription,
    headline: t.headline,
    description: t.description,
    status: t.status,
    access: { ...profile.access, ...t.access },
    attribution: { ...profile.attribution, ...t.attribution },
    partners: profile.partners.map((partner, index) => ({
      ...partner,
      role: t.partnerRoles[index] ?? partner.role,
    })),
    capabilities: t.capabilities,
    interface: {
      ...profile.interface,
      eyebrow: t.interface.eyebrow,
      primaryMetric: t.interface.primaryMetric,
      metricLabel: t.interface.metricLabel,
      items: profile.interface.items.map((item, index) => ({
        ...item,
        label: t.interface.items[index]?.label ?? item.label,
        value: t.interface.items[index]?.value ?? item.value,
      })),
    },
    sources: profile.sources.map((source, index) => ({
      ...source,
      label: t.sources[index]?.label ?? source.label,
      supports: t.sources[index]?.supports ?? source.supports,
    })),
    ...(profile.declaration
      ? { declaration: { ...profile.declaration, ...t.declaration } }
      : {}),
  };
}

/** Los perfiles en inglés, en el mismo orden que `workProfiles`. */
export const workProfilesEn: readonly WorkProfile[] = workProfiles.map(translate);

export function getWorkProfileEn(slug: string) {
  return workProfilesEn.find((profile) => profile.slug === slug);
}

/** Lo que el directorio lista como «en desarrollo», en inglés (de `home.ts`). */
// Vacío desde el 26-oct-2026: MiMotoYa, el único producto que estaba aquí,
// tiene perfil propio (y desde el 27-oct-2026 está en beta abierta). Se
// conserva para el siguiente que entre sin perfil.
export const inDevelopmentEn: Record<string, { category: string; stage: string; description: string }> = {};

/** Estado de `workDirectory` en inglés, por nombre de producto (las tarjetas de sector). */
export const directoryStatusEn: Record<string, string> = Object.fromEntries(
  workProfilesEn.map((profile) => [profile.name, profile.status.label]),
);

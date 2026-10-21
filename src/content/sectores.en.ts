import { sectorSlugEn, type SectorSlugEn } from "@/content/i18n";
import {
  sectorProfiles,
  type SectorCapabilityStatus,
  type SectorProfile,
  type SectorSlug,
} from "@/content/sectores";

/**
 * Las páginas de sector en inglés: `/en/sectors/[slug]`, con los slugs de
 * `i18n.ts` (`public-sector`, `health`, `legal-tax`, `business`).
 *
 * Solo se traduce el texto. Imágenes, productos que aplican, enlaces a la
 * norma y fecha de revisión salen del perfil español de `sectores.ts`. Las
 * normas colombianas se citan por su nombre oficial en español; la glosa en
 * inglés va en `detail`. Igual que en español, ningún cliente se nombra.
 */

type SectorText = Pick<
  SectorProfile,
  | "name"
  | "title"
  | "description"
  | "eyebrow"
  | "lead"
  | "audience"
  | "claim"
  | "intro"
  | "promises"
  | "serviceType"
  | "audienceType"
  | "closing"
> & {
  heroAlt: string;
  capabilities?: readonly { title: string; description: string; hrefLabel?: string }[];
  frameworkDetails?: readonly string[];
};

const text: Record<SectorSlug, SectorText> = {
  salud: {
    name: "Health",
    title: "Software for clinics and healthcare providers",
    description:
      "What INPLUX builds for healthcare providers in Colombia: a patient app, a remote monitoring center, clinical record integration, a help desk, dashboards and custom systems.",
    eyebrow: "Sector",
    lead: "AI for patients, remote monitoring and clinical records.",
    audience:
      "For clinics, hospitals and healthcare provider networks in Colombia.",
    heroAlt:
      "A clinician checks a tablet next to a patient's monitor, in the light of a large window.",
    claim: "Software around the clinical record the provider already has.",
    intro:
      "We build what is missing around the systems already in operation, with the clinical team deciding on every alert.",
    promises: [
      { label: "Patients", lineA: "Every patient,", lineB: "supported." },
      { label: "Remote monitoring", lineA: "Every alert,", lineB: "answered." },
      { label: "Clinical record", lineA: "Every data point,", lineB: "at its source." },
    ],
    serviceType: "Custom software development for healthcare providers",
    audienceType: "Healthcare provider institutions, clinics, hospitals and provider networks",
    capabilities: [
      {
        title: "Patient app",
        description:
          "Appointments, results, authorizations and requests (PQR-F) from the phone, with access for caregivers.",
      },
      {
        title: "Remote monitoring center",
        description: "Traffic-light alerts, patient record, care script and closure with an outcome.",
      },
      {
        title: "Clinical record integration",
        description:
          "Scheduling, waiting list, requests (PQRS) and lab on top of the system the provider already runs.",
      },
      {
        title: "Help desk and support",
        description: "Password-free tickets, threaded email and visible response agreements.",
      },
      {
        title: "Dashboards and custom systems",
        description: "Control rooms, billing, RIPS service records and care modules.",
      },
      {
        title: "Amparo.help",
        description:
          "A prototype for resolving disputes with insurers, with the decision in human hands.",
        hrefLabel: "Open Amparo.help",
      },
    ],
    frameworkDetails: [
      "Minimum data set and interoperability of the electronic health record.",
      "RIPS service records as support for the electronic health invoice.",
      "Licensing conditions for healthcare providers.",
      "Sensitive data: express authorization, encryption and access logs.",
    ],
    closing: {
      title: "Tell us which system you already have and what is missing around it.",
      lead: "We start with the real operation: which clinical record you use, how many sites and what hurts today.",
    },
  },
  publico: {
    name: "Public sector",
    title: "AI for municipalities and public entities",
    description:
      "What INPLUX builds for municipalities, local governments and public finance: sourced fiscal information, procurement review and performance tracking, with the team approving every step.",
    eyebrow: "Sector",
    lead: "AI for municipal finance, procurement and performance tracking.",
    audience:
      "For municipalities, finance departments, local governments and oversight bodies that need to see their operation with figures they can defend.",
    heroAlt:
      "A public servant reviews a printed form at a service window, with a citizen seen from behind and a Colombian flag in the background.",
    claim: "Public operations, visible and with every decision backed.",
    intro:
      "We work on the systems the entity already runs —budget, tax collection, procurement, records— and leave every figure with its source and every review with its log. What is automated is traced; what is decided, the public servant decides.",
    promises: [
      { label: "Tax collection", lineA: "Every taxpayer,", lineB: "located." },
      { label: "Procurement", lineA: "Every file,", lineB: "checked." },
      { label: "Tracking", lineA: "Every goal,", lineB: "with its figure." },
    ],
    serviceType: "AI development and implementation for public entities",
    audienceType: "Municipalities, local governments, finance departments and oversight bodies",
    frameworkDetails: [
      "Transparency and access to public information: what is published, how and with what traceability.",
      "Public procurement rules that every check on a file has to respect.",
      "Personal data protection: taxpayer and citizen data require authorization, encryption and access logs.",
    ],
    closing: {
      title: "Tell us which system the entity already runs and which figure doesn't add up.",
      lead: "We start with one concrete process: collecting a tax, a sample of contracts or a goals dashboard. That is enough to size what comes next.",
    },
  },
  "legal-tributario": {
    name: "Legal and tax",
    title: "AI for law firms, accountants and legal teams",
    description:
      "What INPLUX builds for law firms, accountants and legal teams: tax research with the official source, legal validity, case law and comparable arbitral awards.",
    eyebrow: "Sector",
    lead: "AI for legal research, validity and case law.",
    audience:
      "For law firms, accountants, statutory auditors and legal teams who answer for what they sign and need the source in every answer.",
    heroAlt:
      "Hands annotate a printed statute with a pen on a wooden desk, with case files and codes in the background.",
    claim: "Judgment with a source, inside the lawyer's and the accountant's workflow.",
    intro:
      "We connect the Tax Code, doctrine and case law in force with the tools your team already uses. Every answer comes with the article, the date and the official link; the decision stays with whoever signs.",
    promises: [
      { label: "Regulation", lineA: "Every article,", lineB: "with its validity." },
      { label: "Case law", lineA: "Every criterion,", lineB: "with its ruling." },
      { label: "Arbitration", lineA: "Every award,", lineB: "comparable." },
    ],
    serviceType: "AI for tax, legal and arbitration research",
    audienceType: "Law firms, accountants, statutory auditors and legal teams",
    closing: {
      title: "Tell us which question keeps coming back and where the answer lives today.",
      lead: "We start with the questions your team answers every week: which law, which doctrine, which ruling. That tells us what to connect first.",
    },
  },
  empresas: {
    name: "Business",
    title: "AI for business operations",
    description:
      "What INPLUX builds for private companies: digital products, internal tools and reconciled data on top of the systems they already run, with critical decisions in the team's hands.",
    eyebrow: "Sector",
    lead: "AI for operations, data and digital products.",
    audience:
      "For companies with a real operation —plant, farm, service, sales— that want a product or an internal tool the team will adopt.",
    heroAlt:
      "A supervisor walks across a plant floor with a tablet, between machines and yellow safety lines.",
    claim: "Products and internal tools the operation adopts.",
    intro:
      "We start with one concrete process and build on the systems you already run: the ERP, the spreadsheet everyone relies on, the team chat. What is automated is logged, and anything critical goes through a person before it runs.",
    promises: [
      { label: "Operations", lineA: "Every process,", lineB: "measured." },
      { label: "Data", lineA: "Every source,", lineB: "reconciled." },
      { label: "Product", lineA: "Every idea,", lineB: "in production." },
    ],
    serviceType: "Digital product development and AI implementation for companies",
    audienceType: "Private companies with their own operation: industry, agriculture, services and retail",
    closing: {
      title: "Tell us which process hurts and which system it lives in today.",
      lead: "We start with one concrete operation and its data: what gets recorded, where and who reviews it. That is enough to size a pilot people can use.",
    },
  },
};

export type EnglishSectorProfile = SectorProfile & { enSlug: SectorSlugEn };

function translate(sector: SectorProfile): EnglishSectorProfile {
  const t = text[sector.slug];
  return {
    ...sector,
    enSlug: sectorSlugEn[sector.slug],
    name: t.name,
    title: t.title,
    description: t.description,
    eyebrow: t.eyebrow,
    lead: t.lead,
    audience: t.audience,
    hero: { ...sector.hero, alt: t.heroAlt },
    claim: t.claim,
    intro: t.intro,
    promises: t.promises,
    serviceType: t.serviceType,
    audienceType: t.audienceType,
    capabilities: sector.capabilities?.map((capability, index) => ({
      ...capability,
      title: t.capabilities?.[index]?.title ?? capability.title,
      description: t.capabilities?.[index]?.description ?? capability.description,
      hrefLabel: t.capabilities?.[index]?.hrefLabel ?? capability.hrefLabel,
    })),
    framework: sector.framework?.map((item, index) => ({
      ...item,
      detail: t.frameworkDetails?.[index] ?? item.detail,
    })),
    closing: t.closing,
  };
}

/** Los cuatro sectores en inglés, en el orden de `sectorProfiles`. */
export const sectorProfilesEn: readonly EnglishSectorProfile[] = sectorProfiles.map(translate);

export function getSectorProfileEn(enSlug: string) {
  return sectorProfilesEn.find((sector) => sector.enSlug === enSlug);
}

/** Estado de una pieza: la clave española gobierna el estilo; esto es lo que se lee. */
export const capabilityStatusEn: Record<SectorCapabilityStatus, string> = {
  "En operación": "In operation",
  "En construcción": "Under construction",
  Prototipo: "Prototype",
  Oferta: "Offer",
};

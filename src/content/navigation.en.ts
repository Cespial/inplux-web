import type { NavigationEntry, NavigationItem } from "@/content/copy/types";

/**
 * La navegación pública en inglés (octubre de 2026): los mismos tres grupos que
 * `navigation.ts` —productos, sectores y empresa— con destinos bajo `/en`.
 *
 * Las páginas que solo existen en español (el equipo y la prensa) se enlazan en
 * su versión española, marcadas con `hrefLang: "es"`, y la descripción lo dice.
 * Los nombres de producto no se traducen.
 */

const spanishOnly = (label: string, href: string, description: string): NavigationItem => ({
  label,
  href,
  hrefLang: "es",
  description,
});

export const sectorNavigationEn = [
  {
    label: "Public sector",
    href: "/en/sectors/public-sector",
    description: "Municipalities, local governments and municipal finance.",
  },
  {
    label: "Health",
    href: "/en/sectors/health",
    description: "Healthcare providers: patients, remote monitoring and clinical records.",
  },
  {
    label: "Legal and tax",
    href: "/en/sectors/legal-tax",
    description: "Firms, accountants and legal teams, with source and validity.",
  },
  {
    label: "Business",
    href: "/en/sectors/business",
    description: "Operations, data and digital products for private companies.",
  },
] as const satisfies readonly NavigationItem[];

export const companyNavigationEn = [
  {
    label: "About",
    href: "/en/about",
    description: "Who we are and the judgment we build with.",
  },
  spanishOnly("Team", "/equipo", "Who leads and who answers for each product. In Spanish."),
  {
    label: "How we work",
    href: "/en/how-we-work",
    description: "From diagnosis to operation, with a deliverable in every phase.",
  },
  spanishOnly("Press", "/prensa", "What has been published about our work. In Spanish."),
] as const satisfies readonly NavigationItem[];

/** Mismo orden y mismos nombres que `productNavigation`; el build exige biyección con `work.ts`. */
export const productNavigationEn = [
  ["Tribai", "/en/work/tribai"],
  ["Gobia", "/en/work/gobia"],
  ["Kelsen", "/en/work/kelsen"],
  ["Laudos", "/en/work/laudos"],
  ["Porkia", "/en/work/porkia"],
  ["MiMotoYa", "/en/work/mimotoya"],
] as const;

const productDescriptionsEn: Record<(typeof productNavigationEn)[number][0], string> = {
  Tribai: "Tax judgment with the official source behind every answer.",
  Gobia: "A municipality's operation, visible and followed up.",
  Kelsen: "Legal knowledge with a verifiable path.",
  Laudos: "Arbitration knowledge, structured to predict and search.",
  Porkia: "A pig farm run without going back to the notebook.",
  MiMotoYa: "A motocarro in Pácora, with the price clear before you leave.",
};

export const productMenuEn = productNavigationEn.map(([label, href]) => ({
  label,
  href,
  description: productDescriptionsEn[label],
})) satisfies readonly NavigationItem[];

export const siteNavigationEn = [
  {
    label: "Products",
    items: productMenuEn,
    more: { label: "All products", href: "/en/work" },
  },
  { label: "Sectors", items: sectorNavigationEn },
  { label: "Company", items: companyNavigationEn },
] as const satisfies readonly NavigationEntry[];

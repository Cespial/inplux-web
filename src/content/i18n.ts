/**
 * Los dos idiomas del sitio y los pares de rutas que existen en ambos.
 *
 * Desde el 20-oct-2026 el sitio se publica completo en inglés bajo `/en`,
 * salvo las páginas que siguen solo en español: el equipo y sus perfiles, la
 * prensa y sus notas, la guía de marca y los decks. Este módulo es la única
 * fuente de esa correspondencia y la leen tres superficies:
 *
 * - los metadatos de cada página (`alternates.languages`, el hreflang
 *   recíproco con `x-default` al español);
 * - el selector de idioma de la cabecera, que solo aparece en una página con
 *   par y lleva a su equivalente, no a la portada;
 * - el `<html lang>` del layout raíz.
 *
 * No importa nada de `sectores.ts` ni de `work.ts`: la cabecera es un
 * componente cliente y este archivo viaja al navegador. Por eso el mapa de
 * sectores se escribe aquí literal; `sectores.en.ts` lo consume y el build
 * comprueba que cada sector tenga su par.
 */

export type Lang = "es" | "en";

export const SITE_URL = "https://inplux.co";

/** Valor de `<html lang>` y de `inLanguage` por idioma. */
export const htmlLang: Record<Lang, string> = { es: "es-CO", en: "en" };

/** Claves de `hreflang`, las mismas que publicaba la portada desde julio de 2026. */
export const hreflangKey: Record<Lang, string> = { es: "es-CO", en: "en-US" };

/** Slug español del sector → slug inglés. */
export const sectorSlugEn = {
  publico: "public-sector",
  salud: "health",
  "legal-tributario": "legal-tax",
  empresas: "business",
} as const;

export type SectorSlugEs = keyof typeof sectorSlugEn;
export type SectorSlugEn = (typeof sectorSlugEn)[SectorSlugEs];

const sectorSlugEs = Object.fromEntries(
  Object.entries(sectorSlugEn).map(([es, en]) => [en, es]),
) as Record<SectorSlugEn, SectorSlugEs>;

export function sectorSlugToEs(slug: string): SectorSlugEs | undefined {
  return (sectorSlugEs as Record<string, SectorSlugEs>)[slug];
}

/** Los productos que tienen ficha en los dos idiomas, con el mismo slug. */
const productSlugs = ["tribai", "gobia", "kelsen", "laudos", "porkia", "mimotoya"] as const;

/** Rutas fijas con par: español → inglés. */
const staticPairs: ReadonlyArray<readonly [string, string]> = [
  ["/", "/en"],
  ["/como-trabajamos", "/en/how-we-work"],
  ["/trabajo", "/en/work"],
  ["/nosotros", "/en/about"],
  ["/seguridad", "/en/security"],
  ["/contacto", "/en/contact"],
  ...productSlugs.map((slug) => [`/trabajo/${slug}`, `/en/work/${slug}`] as const),
  ...Object.entries(sectorSlugEn).map(
    ([es, en]) => [`/sectores/${es}`, `/en/sectors/${en}`] as const,
  ),
];

const esToEn = new Map(staticPairs);
const enToEs = new Map(staticPairs.map(([es, en]) => [en, es]));

/** Todos los pares español → inglés, en el orden del sitemap inglés. */
export const languagePairs = staticPairs;

/** Idioma de una ruta: todo lo que vive bajo `/en` es inglés. */
export function langOfPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}

/** La ruta equivalente en el otro idioma, o `null` si la página no tiene par. */
export function pairedPath(pathname: string): { href: string; lang: Lang } | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/u, "") : pathname;
  const en = esToEn.get(clean);
  if (en) return { href: en, lang: "en" };
  const es = enToEs.get(clean);
  if (es) return { href: es, lang: "es" };
  return null;
}

/** Ruta española → ruta inglesa. Revienta si la ruta no tiene par: es un error de programación. */
export function enPathOf(esPath: string) {
  const en = esToEn.get(esPath);
  if (!en) throw new Error(`La ruta ${esPath} no tiene par en inglés`);
  return en;
}

/**
 * `alternates.languages` de una página con par, dada su ruta española. Las
 * dos versiones publican exactamente el mismo bloque: así el hreflang es
 * recíproco por construcción. `x-default` va al español.
 */
export function languageAlternates(esPath: string) {
  const esUrl = esPath === "/" ? SITE_URL : `${SITE_URL}${esPath}`;
  const enUrl = `${SITE_URL}${enPathOf(esPath)}`;
  return {
    [hreflangKey.es]: esUrl,
    [hreflangKey.en]: enUrl,
    "x-default": esUrl,
  };
}

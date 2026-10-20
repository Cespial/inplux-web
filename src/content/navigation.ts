import type { NavigationEntry, NavigationItem } from "@/content/copy/types";

/**
 * La navegación pública del sitio (octubre de 2026): tres grupos desplegables
 * —productos, sectores y empresa— y el contacto, que lo pone la cabecera.
 *
 * Las rutas que todavía no existen apuntan, de forma provisional, a la página
 * que hoy cubre ese contenido; cada una lleva el PR que la estrena. Cuando la
 * ruta llegue, basta con cambiar el `href` aquí: la cabecera y el pie leen de
 * este archivo.
 */

export const sectorNavigation = [
  {
    label: "Sector público",
    href: "/sectores/publico",
    description: "Alcaldías, entidades territoriales y hacienda municipal.",
  },
  {
    label: "Salud",
    href: "/sectores/salud",
    description: "IPS y prestadores: pacientes, telemonitoreo e historia clínica.",
  },
  {
    label: "Legal y tributario",
    href: "/sectores/legal-tributario",
    description: "Firmas, contadores y áreas jurídicas con fuente y vigencia.",
  },
  {
    label: "Empresas",
    href: "/sectores/empresas",
    description: "Operación, datos y productos digitales para compañías privadas.",
  },
] as const satisfies readonly NavigationItem[];

export const companyNavigation = [
  {
    label: "Nosotros",
    href: "/nosotros",
    description: "Quiénes somos y con qué criterio construimos.",
  },
  {
    label: "Equipo",
    href: "/equipo",
    description: "Quién dirige y quién responde por cada producto.",
  },
  {
    label: "Cómo trabajamos",
    href: "/como-trabajamos",
    description: "Del diagnóstico a la operación, con entregables en cada fase.",
  },
  {
    label: "Prensa",
    href: "/prensa",
    description: "Lo que se ha publicado sobre nuestro trabajo.",
  },
] as const satisfies readonly NavigationItem[];

/**
 * Los productos del pie y del menú, escritos a mano y vigilados por el build.
 *
 * No se derivan de `workProfiles` a propósito: `src/content/copy/es.ts`
 * importa este módulo y a su vez lo importa la cabecera (cliente), así que un
 * import de valor de `work.ts` desde aquí arrastraría los cinco perfiles
 * enteros al navegador.
 *
 * Lo que impide que esta lista se desincronice de `work.ts` es
 * `verifyProductFooter()` en `scripts/verify-build-output.mjs`, que lee los
 * `<a href>` del `<nav aria-label="Productos documentados">` del HTML ya
 * construido y exige biyección con los perfiles —ruta y etiqueta—. Porkia
 * estuvo ausente de este pie, en producción, hasta que ese control existió.
 */
export const productNavigation = [
  ["Tribai", "/trabajo/tribai"],
  ["Gobia", "/trabajo/gobia"],
  ["Kelsen", "/trabajo/kelsen"],
  ["Laudos", "/trabajo/laudos"],
  ["Porkia", "/trabajo/porkia"],
] as const;

/** Una línea por producto para el desplegable; el nombre sale de `productNavigation`. */
const productDescriptions: Record<(typeof productNavigation)[number][0], string> = {
  Tribai: "Criterio tributario con la fuente oficial de cada respuesta.",
  Gobia: "La operación de un municipio, visible y con seguimiento.",
  Kelsen: "Conocimiento jurídico con una ruta verificable.",
  Laudos: "Conocimiento arbitral con estructura para predecir y buscar.",
  Porkia: "Una finca porcícola sin volver al cuaderno.",
};

export const productMenu = productNavigation.map(([label, href]) => ({
  label,
  href,
  description: productDescriptions[label],
})) satisfies readonly NavigationItem[];

export const siteNavigation = [
  {
    label: "Productos",
    items: productMenu,
    more: { label: "Todos los productos", href: "/trabajo" },
  },
  { label: "Sectores", items: sectorNavigation },
  { label: "Nosotros", items: companyNavigation },
] as const satisfies readonly NavigationEntry[];

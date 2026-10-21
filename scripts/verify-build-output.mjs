import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { countWords } from "./word-count.mjs";

const root = process.cwd();
const errors = [];

const siteUrl = "https://inplux.co";
// Las tarjetas de la portada (PR N, 20-oct-2026): JPEG con foto, pintadas por
// `scripts/og-cards.mjs`, con nombres nuevos para no heredar la caché de la v3.
const defaultOgImage = `${siteUrl}/brand/og/og-home.jpg`;
const defaultOgImageAlt =
  "Equipo trabajando frente a pantallas en una oficina con vista a las montañas de Medellín";
const englishOgImage = `${siteUrl}/brand/og/og-home-en.jpg`;
const englishOgImageAlt =
  "A team working at their screens in an office overlooking the mountains of Medellín";
const aboutOgImage = `${siteUrl}/brand/og/og-nosotros.jpg`;
const aboutOgImageAlt = "Edificios entre árboles con las montañas de Medellín al fondo";
const sharedContact = { dialogs: 1, triggers: 1, dialogForms: 1, sectionForms: 0 };

/*
 * La pestaña de noticia del hero (PR Q): mientras la noticia esté vigente, la
 * portada en los dos idiomas la lleva —y con ella un disparador de contacto
 * más—; pasado el último día, el build ya no la incluye. La fecha se lee de
 * `src/content/noticia.ts` (este script no importa TypeScript).
 */
const newsSource = await readFile(path.join(root, "src/content/noticia.ts"), "utf8");
const newsExpiresMatch = newsSource.match(/NEWS_EXPIRES = Date\.parse\("([^"]+)"\)/);
const newsExpires = newsExpiresMatch ? Date.parse(newsExpiresMatch[1]) : Number.NaN;
if (!Number.isFinite(newsExpires)) {
  errors.push("src/content/noticia.ts: no se pudo leer NEWS_EXPIRES como fecha");
}
const newsActive = Date.now() < newsExpires;
const homeTriggers = newsActive ? 4 : 3;

/*
 * Los dos perfiles de /equipo, copiados de `src/content/team.ts` (este script
 * no importa TypeScript). `og:type` es `profile` y cada uno enlaza al otro en
 * su bloque «Siguiente».
 */
const teamProfiles = [
  {
    slug: "jaime-alonso-cano-pino",
    other: "cristian-espinal-maya",
    name: "Jaime Alonso Cano Pino",
    jobTitle: "CEO y fundador",
    description:
      "CEO y fundador de INPLUX S.A.S., empresa que desarrolla e implementa transformación con IA, con sede en Medellín, Colombia. Autor de columnas sobre el sistema tributario colombiano y la inteligencia artificial aplicada en Al Poniente.",
  },
  {
    slug: "cristian-espinal-maya",
    other: "jaime-alonso-cano-pino",
    name: "Cristian Espinal Maya",
    jobTitle: "CTO",
    description:
      "CTO de INPLUX S.A.S., empresa que desarrolla e implementa transformación con IA, con sede en Medellín, Colombia. Economista e investigador; autor de working papers en arXiv y SSRN sobre inteligencia artificial, trabajo y capital humano.",
  },
];
/*
 * El equipo de /equipo (PR P, 20-oct-2026), copiado de `teamCrew` en
 * `src/content/team.ts`. Sin página propia: cada persona tiene su retrato, su
 * alt con el nombre y su `Person` en el JSON-LD de /equipo. Autorización de
 * foto y nombre declarada por Cristian Espinal el 20-oct-2026.
 */
const teamCrewProfiles = [
  { slug: "alejandro-estrada-gomez", name: "Alejandro Estrada Gómez" },
  // Solo foto y nombre, a pedido de Cristian: su Person no lleva jobTitle.
  { slug: "alejandro-lopez-durango", name: "Alejandro López Durango" },
  { slug: "daniel-alejandro-lopez-naranjo", name: "Daniel Alejandro López Naranjo" },
  { slug: "cristian-david-ajavi-aguilar", name: "Cristian David Ajavi Aguilar" },
];
const maxCrewPhotoBytes = 150_000;
const maxTeamPageWords = 450;

/*
 * La portada clara (PR S, 21-oct-2026): nueve H2, cinco fichas de producto
 * (una por perfil de work.ts), las cifras con fuente dentro de la evidencia y
 * no en la banda de tesis, y un tope de palabras en <main> que sólo baja.
 * Medido con `word-count.mjs`, que cuenta también las capas ocultas.
 */
const homeShape = [
  { name: "home", file: ".next/server/app/index.html", workPath: "/trabajo" },
  { name: "englishHome", file: ".next/server/app/en.html", workPath: "/en/work" },
];
const homeH2Count = 9;
const maxHomeWords = 780;

const workSocialVersion = "2026-10-20.2";
const workSocialImage = (key) =>
  `${siteUrl}/api/og/trabajo/${key}?v=${workSocialVersion}`;

/** Los nombres de una lista de perfiles, en prosa, como los publica el sitio. */
const enProsa = (perfiles) =>
  new Intl.ListFormat("es-CO", { style: "long", type: "conjunction" }).format(
    perfiles.map((perfil) => perfil.name),
  );

const workProfiles = [
  {
    slug: "tribai",
    name: "Tribai",
    shortDescription:
      "Consulta tributaria con fuentes, vigencia y herramientas visibles.",
    status: "Producto público",
    attribution: "Desarrollo de INPLUX",
    socialAlt: "Tribai: Producto público. Desarrollo de INPLUX.",
    capture: "/work/real-pages/tribai-asistente-2026-07-21.png",
  },
  {
    slug: "gobia",
    name: "Gobia",
    shortDescription:
      "Información y seguimiento municipal reunidos en un solo entorno.",
    status: "Piloto activo",
    attribution: "Solución de INPLUX",
    socialAlt: "Gobia: Piloto activo. Solución de INPLUX.",
    capture: "/work/real-pages/gobia-demo-2026-07-21.png",
  },
  {
    slug: "kelsen",
    name: "Kelsen",
    shortDescription:
      "Análisis, redacción y monitoreo jurídico con trazabilidad.",
    status: "Explorador público",
    attribution: "Desarrollo de INPLUX",
    socialAlt: "Kelsen: Explorador público. Desarrollo de INPLUX.",
    capture: "/work/real-pages/kelsen-explorador-2026-07-21.png",
  },
  {
    slug: "laudos",
    name: "Laudos",
    shortDescription:
      "Búsqueda de laudos y jurisprudencia arbitral con criterio legal.",
    status: "Beta abierta",
    attribution: "Desarrollo técnico de INPLUX",
    socialAlt: "Laudos: Beta abierta. Desarrollo técnico de INPLUX.",
    capture: "/work/real-pages/laudos-prediccion-2026-07-21.png",
  },
  {
    slug: "porkia",
    name: "Porkia",
    shortDescription:
      "Lotes, cuido, sanidad y cuentas de una finca porcícola en una sola app.",
    status: "Beta cerrada",
    attribution: "Desarrollo de INPLUX",
    socialAlt: "Porkia: Beta cerrada. Desarrollo de INPLUX.",
    capture: "/work/real-pages/porkia-demo-2026-08-11.png",
  },
];

/**
 * Las láminas del deck: las de apertura y cierre, más una por perfil.
 *
 * ⚠️ Este contrato existía como la cadena literal «los cinco productos» y
 * «quince láminas» copiada de las dos descripciones publicadas, o sea que
 * fijaba el conteo viejo: un perfil nuevo en `work.ts` dejaba las dos
 * descripciones mintiendo **con `check:output` en verde**, porque el
 * verificador pedía exactamente la cadena anterior. Ahora el número de
 * productos sale del espejo de `work.ts` que este archivo ya mantiene, y el 7
 * y el 2 son la FORMA del modelo (`construirDeck` en `src/content/deck.ts`),
 * no un conteo de productos: si alguien añade una lámina que no es de
 * producto, este número y el publicado se separan y el verificador lo dice.
 *
 * El cierre bajó de 3 a 2 al retirar `como-empezamos`. Es exactamente el caso
 * que este comentario describe, y funcionó: con el `3` puesto, las dos
 * descripciones publicadas —que sí derivan su cifra del modelo— empezaron a
 * decir 14 mientras el verificador seguía exigiendo 15.
 */
const deckSlideCount = 7 + workProfiles.length + 2;

/**
 * El deck dirigido a legaltech: la misma apertura y el mismo cierre, la serie
 * de producto recortada a cuatro y **sin la lámina `puente`**.
 *
 * Los cuatro slugs se escriben aquí porque son una SELECCIÓN —la decisión del
 * dueño del 11-ago-2026, que vive en `PERFILES_LEGALTECH` en
 * `src/content/deck.ts`— y este archivo es el espejo que la sujeta desde fuera:
 * meter un quinto producto a la variante obliga a darlo de alta también aquí, y
 * hasta que se haga, el control del HTML dice qué sobra.
 *
 * ⚠️ El conteo NO se escribe: sale del conteo del deck general menos la lámina
 * que la variante no lleva y menos los productos que no presenta. Así, el día
 * que el deck general gane o pierda una lámina —y ya está pasando: la que
 * repetía los cuatro tiempos se va—, este número se mueve con él en vez de
 * quedarse fijado en un valor que nadie recuerda de dónde salió.
 */
const legaltechSlugs = ["tribai", "gobia", "kelsen", "laudos"];
const legaltechProfiles = workProfiles.filter((profile) => legaltechSlugs.includes(profile.slug));
const deckLegaltechSlideCount =
  deckSlideCount - 1 - (workProfiles.length - legaltechProfiles.length);

const pageDefinitions = {
  home: {
    file: ".next/server/app/index.html",
    title: "INPLUX | Transformación con IA que llega a producción",
    description:
      "Desarrollamos e implementamos la transformación con IA de empresas e instituciones en Latinoamérica. Productos propios en producción y equipos que los implementan.",
    canonical: "https://inplux.co",
    ogTitle: "Transformación con IA que llega a producción.",
    ogDescription:
      "Conoce los productos que INPLUX desarrolla e implementa con empresas e instituciones de Latinoamérica.",
    ogUrl: "https://inplux.co",
    ogLocaleAlternate: "en_US",
    ogImage: defaultOgImage,
    ogImageAlt: defaultOgImageAlt,
    twitterTitle: "Transformación con IA que llega a producción.",
    twitterDescription: "Desarrollamos e implementamos la transformación con IA de empresas e instituciones en Latinoamérica.",
    twitterImageAlt: defaultOgImageAlt,
    jsonLd: { type: "WebSite", name: "INPLUX", url: siteUrl },
    languageAlternates: {
      "es-CO": siteUrl,
      "en-US": `${siteUrl}/en`,
      "x-default": siteUrl,
    },
    legacyFragments: [
      "inicio",
      "servicios",
      "motor",
      "publico",
      "privado",
      "empresas",
      "contacto",
    ],
    contact: { dialogs: 1, triggers: homeTriggers, dialogForms: 1, sectionForms: 0 },
    news: { tab: "San Francisco · Dic", source: "news-sf" },
    // La portada reparte autoridad hacia dentro: los dos perfiles de persona
    // —donde vive la identidad de cada dirección para los buscadores— y la
    // página del sector. Si un rediseño los quita, el build lo dice.
    requiredLinks: [
      "/equipo/jaime-alonso-cano-pino",
      "/equipo/cristian-espinal-maya",
      "/sectores/salud",
      "/sectores/publico",
      "/sectores/legal-tributario",
      "/sectores/empresas",
      "/trabajo",
      "/prensa",
    ],
    websiteId: `${siteUrl}/#website`,
  },
  englishHome: {
    file: ".next/server/app/en.html",
    title: "AI development and implementation company in Miami, Florida | INPLUX",
    description:
      "INPLUX LLC is a Miami-based AI development and implementation company. We develop and implement the AI transformation of companies and institutions across Latin America. Expert people direct the critical decisions.",
    canonical: `${siteUrl}/en`,
    htmlLang: "en",
    contentLang: "en-US",
    ogLocale: "en_US",
    ogTitle: "AI transformation that reaches production.",
    ogDescription:
      "See the products INPLUX develops and implements with companies and institutions across Latin America.",
    ogUrl: `${siteUrl}/en`,
    ogLocaleAlternate: "es_CO",
    ogImage: englishOgImage,
    ogImageAlt: englishOgImageAlt,
    twitterTitle: "AI transformation that reaches production.",
    twitterDescription:
      "We develop and implement the AI transformation of companies and institutions across Latin America.",
    twitterImageAlt: englishOgImageAlt,
    jsonLd: {
      type: "WebPage",
      name: "INPLUX, AI development and implementation in Miami",
      url: `${siteUrl}/en`,
    },
    usEntity: {
      "@id": `${siteUrl}/en#organization-us`,
      name: "INPLUX LLC",
      addressLocality: "Miami",
      addressRegion: "FL",
      addressCountry: "US",
    },
    languageAlternates: {
      "es-CO": siteUrl,
      "en-US": `${siteUrl}/en`,
      "x-default": siteUrl,
    },
    contact: { dialogs: 1, triggers: homeTriggers, dialogForms: 1, sectionForms: 0 },
    news: { tab: "San Francisco · Dec", source: "en-news-sf" },
    productFooter: { label: "Documented products", prefix: "/en/work" },
  },
  howWeWork: {
    file: ".next/server/app/como-trabajamos.html",
    title: "Cómo trabajamos — del diagnóstico a la operación | INPLUX",
    description:
      "Cómo INPLUX lleva un proceso a producción: diagnóstico, piloto, producción y operación, con un entregable en cada fase y el criterio de tu equipo en cada decisión.",
    canonical: `${siteUrl}/como-trabajamos`,
    ogTitle: "Cómo trabajamos | INPLUX",
    ogDescription:
      "Diagnóstico, piloto, producción y operación: cuatro fases con entregable, sobre los sistemas que ya operas.",
    ogUrl: `${siteUrl}/como-trabajamos`,
    ogImage: `${siteUrl}/brand/og/og-como-trabajamos.jpg`,
    ogImageAlt: "INPLUX · Cómo trabajamos. Del diagnóstico a la operación.",
    twitterTitle: "Cómo trabajamos | INPLUX",
    twitterDescription:
      "Diagnóstico, piloto, producción y operación: cuatro fases con entregable, sobre los sistemas que ya operas.",
    twitterImageAlt: "INPLUX · Cómo trabajamos. Del diagnóstico a la operación.",
    jsonLd: {
      type: "WebPage",
      name: "Cómo trabajamos",
      url: `${siteUrl}/como-trabajamos`,
    },
    // Cabecera, hero y cierre.
    contact: { dialogs: 1, triggers: 3, dialogForms: 1, sectionForms: 0 },
  },
  work: {
    file: ".next/server/app/trabajo.html",
    title: "Productos propios — Tribai, Gobia, Kelsen, Laudos y Porkia | INPLUX",
    description:
      "Cinco productos construidos y operados por INPLUX, y uno en desarrollo, cada uno con sus fuentes públicas y la fecha en que las revisamos.",
    canonical: `${siteUrl}/trabajo`,
    ogTitle: "Productos propios — Tribai, Gobia, Kelsen, Laudos y Porkia | INPLUX",
    ogDescription:
      "Cada producto documentado, con sus fuentes públicas y su fecha de verificación.",
    ogUrl: `${siteUrl}/trabajo`,
    ogImage: workSocialImage("directorio"),
    ogImageAlt:
      "INPLUX, directorio de trabajo y productos con fuentes verificadas",
    twitterTitle: "Productos propios — Tribai, Gobia, Kelsen, Laudos y Porkia | INPLUX",
    twitterDescription:
      "Cada producto documentado, con sus fuentes públicas y su fecha de verificación.",
    twitterImageAlt:
      "INPLUX, directorio de trabajo y productos con fuentes verificadas",
    jsonLd: {
      type: "CollectionPage",
      name: "Productos propios — Tribai, Gobia, Kelsen, Laudos y Porkia",
      url: `${siteUrl}/trabajo`,
    },
    // La cabecera más el CTA del cierre.
    contact: { ...sharedContact, triggers: 2 },
  },
  ...Object.fromEntries(
    workProfiles.map((profile) => [
      `work-${profile.slug}`,
      {
        file: `.next/server/app/trabajo/${profile.slug}.html`,
        title: `${profile.name} — perfil de producto | INPLUX`,
        description: `${profile.shortDescription} Estado: ${profile.status}. Atribución: ${profile.attribution}.`,
        canonical: `${siteUrl}/trabajo/${profile.slug}`,
        ogTitle: `${profile.name} — perfil de producto | INPLUX`,
        ogDescription: `${profile.shortDescription} Estado: ${profile.status}. Atribución: ${profile.attribution}.`,
        ogUrl: `${siteUrl}/trabajo/${profile.slug}`,
        ogImage: workSocialImage(profile.slug),
        ogImageAlt: profile.socialAlt,
        twitterTitle: `${profile.name} — perfil de producto | INPLUX`,
        twitterDescription: `${profile.shortDescription} Estado: ${profile.status}. Atribución: ${profile.attribution}.`,
        twitterImageAlt: profile.socialAlt,
        jsonLd: {
          type: "WebPage",
          name: `${profile.name} — perfil de producto`,
          url: `${siteUrl}/trabajo/${profile.slug}`,
        },
        // La cabecera más el CTA del cierre.
        contact: { ...sharedContact, triggers: 2 },
      },
    ]),
  ),
  deck: {
    file: ".next/server/app/deck.html",
    title: "Deck — de un problema real a software en producción | INPLUX",
    description: `El índice de la presentación de INPLUX en ${deckSlideCount} láminas: la tesis, el método, los productos y sus fuentes.`,
    canonical: `${siteUrl}/deck`,
    contact: { dialogs: 0, triggers: 0, dialogForms: 0, sectionForms: 0 },
  },
  deckPresentacion: {
    file: ".next/server/app/deck/presentacion.html",
    title:
      "Presentación — de un problema real a software en producción | INPLUX",
    description: `Cómo INPLUX convierte un problema concreto en software que funciona en producción, en ${deckSlideCount} láminas.`,
    canonical: `${siteUrl}/deck/presentacion`,
    contact: { dialogs: 0, triggers: 0, dialogForms: 0, sectionForms: 0 },
    deck: { slides: deckSlideCount, profiles: workProfiles },
  },
  // ── El deck dirigido ───────────────────────────────────────────────────────
  // Dos rutas fuera del índice y fuera del sitemap. Se dan de alta aquí, y no
  // solo en `verify-http-contracts.mjs`, porque un 200 no dice qué se está
  // sirviendo: lo que hay que sujetar es que la variante trae SUS cuatro
  // productos y no los cinco del deck general.
  deckLegaltech: {
    file: ".next/server/app/deck/legaltech.html",
    title: "Deck legaltech — de un problema real a software en producción | INPLUX",
    description: `El índice de la presentación de INPLUX en ${deckLegaltechSlideCount} láminas: la tesis, el método y los productos ${enProsa(legaltechProfiles)}, con sus fuentes.`,
    canonical: `${siteUrl}/deck/legaltech`,
    noindex: true,
    contact: { dialogs: 0, triggers: 0, dialogForms: 0, sectionForms: 0 },
  },
  deckLegaltechPresentacion: {
    file: ".next/server/app/deck/legaltech/presentacion.html",
    title: "Presentación legaltech — de un problema real a software en producción | INPLUX",
    description: `Cómo INPLUX convierte un problema concreto en software que funciona en producción, en ${deckLegaltechSlideCount} láminas, con los productos ${enProsa(legaltechProfiles)}.`,
    canonical: `${siteUrl}/deck/legaltech/presentacion`,
    noindex: true,
    contact: { dialogs: 0, triggers: 0, dialogForms: 0, sectionForms: 0 },
    deck: { slides: deckLegaltechSlideCount, profiles: legaltechProfiles },
  },
  sectorSalud: {
    file: ".next/server/app/sectores/salud.html",
    title: "Software para IPS y prestadores de salud | INPLUX",
    description:
      "Lo que INPLUX construye para IPS y prestadores de salud en Colombia: app de pacientes, central de telemonitoreo, integración con la historia clínica, mesa de ayuda, tableros y sistemas a la medida.",
    canonical: `${siteUrl}/sectores/salud`,
    ogTitle: "Software para IPS y prestadores de salud | INPLUX",
    ogDescription:
      "Lo que INPLUX construye para IPS y prestadores de salud en Colombia: app de pacientes, central de telemonitoreo, integración con la historia clínica, mesa de ayuda, tableros y sistemas a la medida.",
    ogUrl: `${siteUrl}/sectores/salud`,
    ogImage: `${siteUrl}/brand/og/og-sector-salud.jpg`,
    ogImageAlt: "INPLUX · Salud. IA para pacientes, telemonitoreo e historia clínica.",
    twitterTitle: "Software para IPS y prestadores de salud | INPLUX",
    twitterDescription:
      "Lo que INPLUX construye para IPS y prestadores de salud en Colombia: app de pacientes, central de telemonitoreo, integración con la historia clínica, mesa de ayuda, tableros y sistemas a la medida.",
    twitterImageAlt: "INPLUX · Salud. IA para pacientes, telemonitoreo e historia clínica.",
    jsonLd: {
      type: "WebPage",
      name: "Software para IPS y prestadores de salud",
      url: `${siteUrl}/sectores/salud`,
    },
    // Cabecera + hero + cierre: como la portada, tres disparadores, porque la
    // página entera es una invitación a contar el caso. No nombra clientes
    // (decisión del 17-oct-2026).
    contact: { dialogs: 1, triggers: 3, dialogForms: 1, sectionForms: 0 },
    forbiddenText: ["INFINITY", "IPSMEDIC", "Plenus", "Sinergia", "Oncolife", "areaServed"],
  },
  sectorPublico: {
    file: ".next/server/app/sectores/publico.html",
    title: "IA para alcaldías y entidades públicas | INPLUX",
    description:
      "Lo que INPLUX construye para alcaldías, entidades territoriales y hacienda pública: información fiscal con fuente, revisión de contratación y seguimiento de la gestión, con el equipo aprobando cada paso.",
    canonical: `${siteUrl}/sectores/publico`,
    ogTitle: "IA para alcaldías y entidades públicas | INPLUX",
    ogDescription:
      "Lo que INPLUX construye para alcaldías, entidades territoriales y hacienda pública: información fiscal con fuente, revisión de contratación y seguimiento de la gestión, con el equipo aprobando cada paso.",
    ogUrl: `${siteUrl}/sectores/publico`,
    ogImage: `${siteUrl}/brand/og/og-sector-publico.jpg`,
    ogImageAlt: "INPLUX · Sector público. IA para hacienda municipal, contratación y seguimiento de la gestión.",
    twitterTitle: "IA para alcaldías y entidades públicas | INPLUX",
    twitterDescription:
      "Lo que INPLUX construye para alcaldías, entidades territoriales y hacienda pública: información fiscal con fuente, revisión de contratación y seguimiento de la gestión, con el equipo aprobando cada paso.",
    twitterImageAlt: "INPLUX · Sector público. IA para hacienda municipal, contratación y seguimiento de la gestión.",
    jsonLd: {
      type: "WebPage",
      name: "IA para alcaldías y entidades públicas",
      url: `${siteUrl}/sectores/publico`,
    },
    // Cabecera + hero + cierre, como salud. Sin nombres de clientes del sector
    // (decisión del 17-oct-2026) ni cobertura geográfica.
    contact: { dialogs: 1, triggers: 3, dialogForms: 1, sectionForms: 0 },
    forbiddenText: ["CORANTIOQUIA", "Caucasia", "Cisneros", "Caracolí", "San Roque", "Buriticá", "Yalí", "Santo Domingo", "El Bagre", "Vegachí", "Giraldo", "Desarrollo Urbano", "INVIAS", "areaServed"],
  },
  sectorLegal: {
    file: ".next/server/app/sectores/legal-tributario.html",
    title: "IA para firmas, contadores y áreas jurídicas | INPLUX",
    description:
      "Lo que INPLUX construye para firmas de abogados, contadores y áreas jurídicas: consulta tributaria con fuente oficial, vigencia de normas, jurisprudencia y laudos comparables.",
    canonical: `${siteUrl}/sectores/legal-tributario`,
    ogTitle: "IA para firmas, contadores y áreas jurídicas | INPLUX",
    ogDescription:
      "Lo que INPLUX construye para firmas de abogados, contadores y áreas jurídicas: consulta tributaria con fuente oficial, vigencia de normas, jurisprudencia y laudos comparables.",
    ogUrl: `${siteUrl}/sectores/legal-tributario`,
    ogImage: `${siteUrl}/brand/og/og-sector-legal-tributario.jpg`,
    ogImageAlt: "INPLUX · Legal y tributario. IA para consulta normativa, vigencia y jurisprudencia.",
    twitterTitle: "IA para firmas, contadores y áreas jurídicas | INPLUX",
    twitterDescription:
      "Lo que INPLUX construye para firmas de abogados, contadores y áreas jurídicas: consulta tributaria con fuente oficial, vigencia de normas, jurisprudencia y laudos comparables.",
    twitterImageAlt: "INPLUX · Legal y tributario. IA para consulta normativa, vigencia y jurisprudencia.",
    jsonLd: {
      type: "WebPage",
      name: "IA para firmas, contadores y áreas jurídicas",
      url: `${siteUrl}/sectores/legal-tributario`,
    },
    // Cabecera + hero + cierre, como salud. Sin nombres de clientes del sector
    // (decisión del 17-oct-2026) ni cobertura geográfica.
    contact: { dialogs: 1, triggers: 3, dialogForms: 1, sectionForms: 0 },
    forbiddenText: ["Rentan", "Sistemas Aries", "ASECONTIC", "areaServed"],
  },
  sectorEmpresas: {
    file: ".next/server/app/sectores/empresas.html",
    title: "IA para la operación de empresas | INPLUX",
    description:
      "Lo que INPLUX construye para compañías privadas: productos digitales, herramientas internas y datos conciliados sobre los sistemas que ya operan, con las decisiones críticas en manos del equipo.",
    canonical: `${siteUrl}/sectores/empresas`,
    ogTitle: "IA para la operación de empresas | INPLUX",
    ogDescription:
      "Lo que INPLUX construye para compañías privadas: productos digitales, herramientas internas y datos conciliados sobre los sistemas que ya operan, con las decisiones críticas en manos del equipo.",
    ogUrl: `${siteUrl}/sectores/empresas`,
    ogImage: `${siteUrl}/brand/og/og-sector-empresas.jpg`,
    ogImageAlt: "INPLUX · Empresas. IA para operación, datos y productos digitales.",
    twitterTitle: "IA para la operación de empresas | INPLUX",
    twitterDescription:
      "Lo que INPLUX construye para compañías privadas: productos digitales, herramientas internas y datos conciliados sobre los sistemas que ya operan, con las decisiones críticas en manos del equipo.",
    twitterImageAlt: "INPLUX · Empresas. IA para operación, datos y productos digitales.",
    jsonLd: {
      type: "WebPage",
      name: "IA para la operación de empresas",
      url: `${siteUrl}/sectores/empresas`,
    },
    // Cabecera + hero + cierre, como salud. Sin nombres de clientes del sector
    // (decisión del 17-oct-2026) ni cobertura geográfica.
    contact: { dialogs: 1, triggers: 3, dialogForms: 1, sectionForms: 0 },
    forbiddenText: ["Creame", "Rentan", "Sistemas Aries", "EDEREM", "INCA Ingenieros", "Florandina", "Multivital", "areaServed"],
  },
  about: {
    file: ".next/server/app/nosotros.html",
    title: "Nosotros — construimos con criterio, desde Medellín | INPLUX",
    description:
      "INPLUX desarrolla e implementa la transformación con IA de empresas e instituciones en Latinoamérica.",
    canonical: "https://inplux.co/nosotros",
    ogTitle: "Construimos con criterio, desde Medellín | INPLUX",
    ogDescription:
      "INPLUX desarrolla e implementa la transformación con IA de empresas e instituciones en Latinoamérica.",
    ogUrl: "https://inplux.co/nosotros",
    ogImage: aboutOgImage,
    ogImageAlt: aboutOgImageAlt,
    twitterTitle: "Construimos con criterio, desde Medellín | INPLUX",
    twitterDescription:
      "INPLUX desarrolla e implementa la transformación con IA de empresas e instituciones en Latinoamérica.",
    twitterImageAlt: aboutOgImageAlt,
    jsonLd: {
      type: "AboutPage",
      name: "Construimos con criterio, desde Medellín",
      url: `${siteUrl}/nosotros`,
    },
    contact: { dialogs: 1, triggers: 2, dialogForms: 1, sectionForms: 0 },
    productFooter: { label: "Productos documentados", prefix: "/trabajo" },
    attribution: true,
  },
  team: {
    file: ".next/server/app/equipo.html",
    title: "Equipo — quién dirige y quién responde | INPLUX",
    description:
      "Las personas que dirigen INPLUX y responden por cada producto: criterio tributario e institucional, producto e ingeniería, desde Medellín.",
    canonical: `${siteUrl}/equipo`,
    ogTitle: "Equipo | INPLUX",
    ogDescription:
      "Quién dirige INPLUX y responde por cada producto, con su trayectoria a la vista.",
    ogUrl: `${siteUrl}/equipo`,
    ogImage: aboutOgImage,
    ogImageAlt: aboutOgImageAlt,
    twitterTitle: "Equipo | INPLUX",
    twitterDescription:
      "Quién dirige INPLUX y responde por cada producto, con su trayectoria a la vista.",
    twitterImageAlt: aboutOgImageAlt,
    jsonLd: {
      type: "CollectionPage",
      name: "Equipo de INPLUX",
      url: `${siteUrl}/equipo`,
    },
    // Cabecera y cierre.
    contact: { dialogs: 1, triggers: 2, dialogForms: 1, sectionForms: 0 },
  },
  press: {
    file: ".next/server/app/prensa.html",
    title: "Prensa y conversaciones | INPLUX",
    description:
      "Cobertura, conversaciones públicas, investigación y columnas firmadas vinculadas con INPLUX y su equipo, siempre con la fuente original a la vista.",
    canonical: "https://inplux.co/prensa",
    ogTitle: "Prensa y conversaciones | INPLUX",
    ogDescription:
      "Cobertura, escenarios públicos, investigaciones y columnas del equipo, organizados por categoría y enlazados a su fuente original.",
    ogUrl: "https://inplux.co/prensa",
    ogImage: `${siteUrl}/brand/og/og-prensa.jpg`,
    ogImageAlt: "INPLUX, prensa y conversaciones",
    twitterTitle: "Prensa y conversaciones | INPLUX",
    twitterDescription:
      "Cobertura, escenarios públicos, investigaciones y columnas del equipo, organizados por categoría y enlazados a su fuente original.",
    twitterImageAlt: "INPLUX, prensa y conversaciones",
    jsonLd: {
      type: "CollectionPage",
      name: "Prensa y conversaciones | INPLUX",
      url: `${siteUrl}/prensa`,
    },
    contact: { dialogs: 1, triggers: 1, dialogForms: 1, sectionForms: 0 },
  },
  contact: {
    file: ".next/server/app/contacto.html",
    title: "Contacto — empecemos por el problema | INPLUX",
    description:
      "Cuéntanos qué debería cambiar en tu producto, operación o servicio. No necesitas llegar con requisitos ni alcance definidos.",
    canonical: `${siteUrl}/contacto`,
    ogTitle: "Empecemos por el problema | INPLUX",
    ogDescription:
      "Comparte el reto. INPLUX te ayuda a convertirlo en una primera decisión de producto.",
    ogUrl: `${siteUrl}/contacto`,
    ogImage: `${siteUrl}/brand/og/og-contacto.jpg`,
    ogImageAlt: "INPLUX · Contacto. Empecemos por el problema.",
    twitterTitle: "Empecemos por el problema | INPLUX",
    twitterDescription:
      "Comparte el reto. No necesitas llegar con requisitos ni alcance definidos.",
    twitterImageAlt: "INPLUX · Contacto. Empecemos por el problema.",
    jsonLd: {
      type: "ContactPage",
      name: "Contacto INPLUX",
      url: `${siteUrl}/contacto`,
    },
    contact: { dialogs: 1, triggers: 1, dialogForms: 1, sectionForms: 1 },
    requiredLinks: ["/seguridad", "/como-trabajamos"],
  },
  security: {
    file: ".next/server/app/seguridad.html",
    title: "Seguridad y datos | INPLUX",
    description:
      "Cómo cuida INPLUX los datos de cada cliente: cifrado, acceso por rol, datos separados, modelos que no entrenan con ellos y el marco legal que aplica.",
    canonical: `${siteUrl}/seguridad`,
    ogTitle: "Seguridad y datos | INPLUX",
    ogDescription:
      "Cifrado, acceso por rol, datos separados por cliente y modelos que no entrenan con ellos. Sin sellos ni promesas que no podamos sostener.",
    ogUrl: `${siteUrl}/seguridad`,
    ogImage: `${siteUrl}/brand/og/og-seguridad.jpg`,
    ogImageAlt: "INPLUX · Seguridad. Cómo cuidamos los datos de cada cliente.",
    twitterTitle: "Seguridad y datos | INPLUX",
    twitterDescription:
      "Cifrado, acceso por rol, datos separados por cliente y modelos que no entrenan con ellos. Sin sellos ni promesas que no podamos sostener.",
    twitterImageAlt: "INPLUX · Seguridad. Cómo cuidamos los datos de cada cliente.",
    jsonLd: {
      type: "WebPage",
      name: "Seguridad y datos",
      url: `${siteUrl}/seguridad`,
    },
    contact: sharedContact,
    // Las afirmaciones de esta página son las aprobadas por la dirección. Un
    // sello o una cifra de disponibilidad no entra sin pasar por ella.
    forbiddenText: ["SOC 2", "ISO 27001", "grado militar", "bancario", "certificad"],
  },
  ...Object.fromEntries(
    teamProfiles.map((member) => [
      `team-${member.slug}`,
      {
        file: `.next/server/app/equipo/${member.slug}.html`,
        title: `${member.name} — ${member.jobTitle} | INPLUX`,
        description: member.description,
        canonical: `${siteUrl}/equipo/${member.slug}`,
        ogTitle: `${member.name} — ${member.jobTitle} | INPLUX`,
        ogDescription: member.description,
        ogUrl: `${siteUrl}/equipo/${member.slug}`,
        ogType: "profile",
        ogImage: `${siteUrl}/brand/og/og-equipo-${member.slug}.jpg`,
        ogImageAlt: `${member.name}, ${member.jobTitle} de INPLUX`,
        twitterTitle: `${member.name} — ${member.jobTitle} | INPLUX`,
        twitterDescription: member.description,
        twitterImageAlt: `${member.name}, ${member.jobTitle} de INPLUX`,
        jsonLd: {
          type: "ProfilePage",
          name: `${member.name} — ${member.jobTitle} de INPLUX`,
          url: `${siteUrl}/equipo/${member.slug}`,
        },
        contact: sharedContact,
        requiredLinks: [`/equipo/${member.other}`],
      },
    ]),
  ),
  brand: {
    file: ".next/server/app/marca.html",
    title: "Sistema de marca — INPLUX",
    description:
      "Guía interna de identidad de INPLUX: logo, color, tipografía, componentes y activos oficiales.",
    canonical: "https://inplux.co/marca",
    noindex: true,
    ogTitle: "Sistema de marca — INPLUX",
    ogDescription:
      "Guía interna de identidad de INPLUX: logo, color, tipografía, componentes y activos oficiales.",
    ogUrl: `${siteUrl}/marca`,
    ogImage: `${siteUrl}/brand/og/og-marca.jpg`,
    ogImageAlt: "INPLUX · Sistema de marca. Logo, color y tipografía.",
    twitterTitle: "Sistema de marca — INPLUX",
    twitterDescription:
      "Guía interna de identidad de INPLUX: logo, color, tipografía, componentes y activos oficiales.",
    twitterImageAlt: "INPLUX · Sistema de marca. Logo, color y tipografía.",
    contact: sharedContact,
  },
  notFound: {
    file: ".next/server/app/_not-found.html",
    title: "Página no encontrada — INPLUX",
    description: "La ruta que buscas no existe o cambió de lugar.",
    canonical: null,
    noindex: true,
    noSocialMetadata: true,
    contact: sharedContact,
  },
};

/*
 * ── El sitio en inglés (PR M, 20-oct-2026) ─────────────────────────────────
 *
 * Doce rutas bajo `/en` con par en español (catorce archivos: cinco fichas de
 * producto y cuatro sectores). Espejo de `src/content/i18n.ts`, como
 * `workProfiles` lo es de `work.ts`: una ruta nueva con par obliga a darla de
 * alta aquí. Cada par publica el MISMO bloque hreflang —recíproco por
 * construcción— con `x-default` al español, y el `<html lang>` de la inglesa
 * es `en`.
 */
const sectorPairs = [
  // [slug español, slug inglés, archivo, nombre, título, descripción, lead]
  [
    "salud",
    "health",
    "Health",
    "Software for clinics and healthcare providers",
    "What INPLUX builds for healthcare providers in Colombia: a patient app, a remote monitoring center, clinical record integration, a help desk, dashboards and custom systems.",
    "AI for patients, remote monitoring and clinical records.",
    ["INFINITY", "IPSMEDIC", "Plenus", "Sinergia", "Oncolife", "areaServed"],
  ],
  [
    "publico",
    "public-sector",
    "Public sector",
    "AI for municipalities and public entities",
    "What INPLUX builds for municipalities, local governments and public finance: sourced fiscal information, procurement review and performance tracking, with the team approving every step.",
    "AI for municipal finance, procurement and performance tracking.",
    ["CORANTIOQUIA", "Caucasia", "Cisneros", "Caracolí", "San Roque", "Buriticá", "Yalí", "Santo Domingo", "El Bagre", "Vegachí", "Giraldo", "INVIAS", "areaServed", "nationwide"],
  ],
  [
    "legal-tributario",
    "legal-tax",
    "Legal and tax",
    "AI for law firms, accountants and legal teams",
    "What INPLUX builds for law firms, accountants and legal teams: tax research with the official source, legal validity, case law and comparable arbitral awards.",
    "AI for legal research, validity and case law.",
    ["Rentan", "Sistemas Aries", "ASECONTIC", "areaServed"],
  ],
  [
    "empresas",
    "business",
    "Business",
    "AI for business operations",
    "What INPLUX builds for private companies: digital products, internal tools and reconciled data on top of the systems they already run, with critical decisions in the team's hands.",
    "AI for operations, data and digital products.",
    ["Creame", "Rentan", "Sistemas Aries", "EDEREM", "INCA Ingenieros", "Florandina", "Multivital", "areaServed"],
  ],
];

const workProfilesEn = {
  tribai: {
    shortDescription: "Tax research with sources, validity and tools in plain view.",
    status: "Public product",
    attribution: "Developed by INPLUX",
  },
  gobia: {
    shortDescription: "Municipal information and follow-up in a single environment.",
    status: "Active pilot",
    attribution: "INPLUX solution",
  },
  kelsen: {
    shortDescription: "Legal analysis, drafting and monitoring with traceability.",
    status: "Public explorer",
    attribution: "Developed by INPLUX",
  },
  laudos: {
    shortDescription: "Search across arbitral awards and arbitration case law, with legal judgment.",
    status: "Open beta",
    attribution: "Technical development by INPLUX",
  },
  porkia: {
    shortDescription: "Batches, feed, herd health and the accounts of a pig farm in one app.",
    status: "Closed beta",
    attribution: "Developed by INPLUX",
  },
};

/** Ruta española → ruta inglesa, en el orden del sitemap inglés. */
const languagePairs = [
  ["/como-trabajamos", "/en/how-we-work"],
  ["/trabajo", "/en/work"],
  ...workProfiles.map((profile) => [`/trabajo/${profile.slug}`, `/en/work/${profile.slug}`]),
  ...sectorPairs.map(([es, en]) => [`/sectores/${es}`, `/en/sectors/${en}`]),
  ["/nosotros", "/en/about"],
  ["/seguridad", "/en/security"],
  ["/contacto", "/en/contact"],
];

const alternatesFor = (esPath) => ({
  "es-CO": `${siteUrl}${esPath}`,
  "en-US": `${siteUrl}${languagePairs.find(([es]) => es === esPath)[1]}`,
  "x-default": `${siteUrl}${esPath}`,
});

// El par español de cada ruta inglesa publica el mismo bloque.
for (const definition of Object.values(pageDefinitions)) {
  const esPath = definition.canonical?.startsWith(siteUrl)
    ? definition.canonical.slice(siteUrl.length)
    : null;
  if (esPath && languagePairs.some(([es]) => es === esPath)) {
    definition.languageAlternates = alternatesFor(esPath);
    definition.languageSwitch = {
      href: languagePairs.find(([es]) => es === esPath)[1],
      hrefLang: "en",
    };
  }
}

const englishBase = (esPath, enPath) => ({
  file: `.next/server/app${enPath}.html`,
  canonical: `${siteUrl}${enPath}`,
  ogUrl: `${siteUrl}${enPath}`,
  htmlLang: "en",
  ogLocale: "en_US",
  inLanguage: "en",
  languageAlternates: alternatesFor(esPath),
  // Un /en/* sin pie inglés publicaría el español por debajo del contenido.
  productFooter: { label: "Documented products", prefix: "/en/work" },
  // El selector de idioma lleva al par español, y ningún otro enlace lleva a
  // la ruta española de una página que tiene par.
  languageSwitch: { href: esPath, hrefLang: "es" },
  forbiddenLinks: languagePairs.map(([es]) => es).filter((es) => es !== esPath),
});

const social = (title, description, image, alt, twitterDescription = description) => ({
  ogTitle: title,
  ogDescription: description,
  ogImage: image.startsWith("http") ? image : `${siteUrl}${image}`,
  ogImageAlt: alt,
  twitterTitle: title,
  twitterDescription,
  twitterImageAlt: alt,
});

const enWorkTitle = "Our own products — Tribai, Gobia, Kelsen, Laudos and Porkia";
const workSocialImageEn = (key) =>
  `${siteUrl}/api/og/trabajo/${key}?lang=en&v=${workSocialVersion}`;

Object.assign(pageDefinitions, {
  enHowWeWork: {
    ...englishBase("/como-trabajamos", "/en/how-we-work"),
    title: "How we work — from diagnosis to operation | INPLUX",
    description:
      "How INPLUX takes a process to production: diagnosis, pilot, production and operation, with a deliverable in every phase and your team's judgment in every decision.",
    ...social(
      "How we work | INPLUX",
      "Diagnosis, pilot, production and operation: four phases with a deliverable, on the systems you already run.",
      "/brand/og/og-en-how-we-work.jpg",
      "INPLUX · How we work. From diagnosis to operation.",
    ),
    jsonLd: { type: "WebPage", name: "How we work", url: `${siteUrl}/en/how-we-work` },
    contact: { dialogs: 1, triggers: 3, dialogForms: 1, sectionForms: 0 },
  },
  enWork: {
    ...englishBase("/trabajo", "/en/work"),
    title: `${enWorkTitle} | INPLUX`,
    description:
      "Five products built and run by INPLUX, and one in development, each with its public sources and the date we reviewed them.",
    ...social(
      `${enWorkTitle} | INPLUX`,
      "Every documented product, with its public sources and verification date.",
      workSocialImageEn("directorio"),
      "INPLUX, product directory with verified sources",
    ),
    jsonLd: { type: "CollectionPage", name: enWorkTitle, url: `${siteUrl}/en/work` },
    contact: { ...sharedContact, triggers: 2 },
  },
  ...Object.fromEntries(
    workProfiles.map((profile) => {
      const en = workProfilesEn[profile.slug];
      const description = `${en.shortDescription} Status: ${en.status}. Attribution: ${en.attribution}.`;
      const title = `${profile.name} — product profile | INPLUX`;
      return [
        `en-work-${profile.slug}`,
        {
          ...englishBase(`/trabajo/${profile.slug}`, `/en/work/${profile.slug}`),
          title,
          description,
          ...social(
            title,
            description,
            workSocialImageEn(profile.slug),
            `${profile.name}: ${en.status}. ${en.attribution}.`,
          ),
          jsonLd: {
            type: "WebPage",
            name: `${profile.name} — product profile`,
            url: `${siteUrl}/en/work/${profile.slug}`,
          },
          contact: { ...sharedContact, triggers: 2 },
        },
      ];
    }),
  ),
  ...Object.fromEntries(
    sectorPairs.map(([es, en, name, title, description, lead, forbiddenText]) => [
      `en-sector-${en}`,
      {
        ...englishBase(`/sectores/${es}`, `/en/sectors/${en}`),
        title: `${title} | INPLUX`,
        description,
        ...social(
          `${title} | INPLUX`,
          description,
          `/brand/og/og-en-sector-${en}.jpg`,
          `INPLUX · ${name}. ${lead}`,
        ),
        jsonLd: { type: "WebPage", name: title, url: `${siteUrl}/en/sectors/${en}` },
        // Cabecera + hero + cierre, como en español. Sin nombres de clientes.
        contact: { dialogs: 1, triggers: 3, dialogForms: 1, sectionForms: 0 },
        forbiddenText,
      },
    ]),
  ),
  enAbout: {
    ...englishBase("/nosotros", "/en/about"),
    title: "About — we build with judgment, from Medellín | INPLUX",
    description:
      "INPLUX develops and implements AI transformation for companies and institutions in Latin America.",
    ...social(
      "We build with judgment, from Medellín | INPLUX",
      "INPLUX develops and implements AI transformation for companies and institutions in Latin America.",
      "/brand/og/og-en-about.jpg",
      "Buildings among trees with the mountains of Medellín in the background",
    ),
    jsonLd: { type: "AboutPage", name: "We build with judgment, from Medellín", url: `${siteUrl}/en/about` },
    contact: { dialogs: 1, triggers: 2, dialogForms: 1, sectionForms: 0 },
    attribution: true,
  },
  enSecurity: {
    ...englishBase("/seguridad", "/en/security"),
    title: "Security and data | INPLUX",
    description:
      "How INPLUX looks after each client's data: encryption, role-based access, separated data, models that don't train on it and the legal framework that applies.",
    ...social(
      "Security and data | INPLUX",
      "Encryption, role-based access, data separated by client and models that don't train on it. No seals or promises we can't keep.",
      "/brand/og/og-en-security.jpg",
      "INPLUX · Security. How we look after each client's data.",
    ),
    jsonLd: { type: "WebPage", name: "Security and data", url: `${siteUrl}/en/security` },
    contact: sharedContact,
    // Las mismas afirmaciones aprobadas que /seguridad: sin sellos ni grados.
    forbiddenText: ["SOC 2", "ISO 27001", "certif", "Certif", "bank-grade", "military-grade"],
    requiredText: ["Ley 1581 de 2012", "Resolución 866 de 2021"],
  },
  enContact: {
    ...englishBase("/contacto", "/en/contact"),
    title: "Contact — let's start with the problem | INPLUX",
    description:
      "Tell us what should change in your product, operation or service. You don't need to arrive with requirements or a defined scope.",
    ...social(
      "Let's start with the problem | INPLUX",
      "Share the challenge. INPLUX helps you turn it into a first product decision.",
      "/brand/og/og-en-contact.jpg",
      "INPLUX · Contact. Let's start with the problem.",
      "Share the challenge. You don't need requirements or a defined scope.",
    ),
    jsonLd: { type: "ContactPage", name: "Contact INPLUX", url: `${siteUrl}/en/contact` },
    contact: { dialogs: 1, triggers: 1, dialogForms: 1, sectionForms: 1 },
    requiredLinks: ["/en/security", "/en/how-we-work"],
  },
});

function decodeHtml(value) {
  return String(value ?? "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function readAttributes(source) {
  return Object.fromEntries(
    [...source.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [
      match[1],
      decodeHtml(match[2]),
    ]),
  );
}

function collectElements(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b([^>]*)>`, "gi"))].map(
    (match) => readAttributes(match[1]),
  );
}

function metaContent(html, attribute, value) {
  return collectElements(html, "meta").find((attributes) => attributes[attribute] === value)
    ?.content;
}

function linkHref(html, rel) {
  return collectElements(html, "link").find((attributes) =>
    String(attributes.rel ?? "")
      .split(/\s+/)
      .includes(rel),
  )?.href;
}

function titleContent(html) {
  return decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
}

function count(html, needle) {
  return html.split(needle).length - 1;
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    errors.push(`${label}: esperaba “${expected}” y recibió “${actual ?? "ausente"}”`);
  }
}

function expect(condition, message) {
  if (!condition) errors.push(message);
}

function verifySocialMetadata(name, html, definition) {
  if (definition.noSocialMetadata) {
    expect(
      !collectElements(html, "meta").some((attributes) =>
        String(attributes.property ?? attributes.name ?? "").startsWith("og:") ||
        String(attributes.name ?? "").startsWith("twitter:"),
      ),
      `${name}: una respuesta 404 no debe heredar Open Graph ni Twitter de HOME`,
    );
    return;
  }

  if (!definition.ogTitle) return;

  expectEqual(metaContent(html, "property", "og:title"), definition.ogTitle, `${name} og:title`);
  expectEqual(
    metaContent(html, "property", "og:description"),
    definition.ogDescription,
    `${name} og:description`,
  );
  expectEqual(metaContent(html, "property", "og:url"), definition.ogUrl, `${name} og:url`);
  // La marca, no la razón social: es lo que la red escribe sobre la tarjeta.
  expectEqual(metaContent(html, "property", "og:site_name"), "INPLUX", `${name} og:site_name`);
  expectEqual(
    metaContent(html, "property", "og:locale"),
    definition.ogLocale ?? "es_CO",
    `${name} og:locale`,
  );
  // Solo las dos portadas declaran su par en el otro idioma.
  expectEqual(
    metaContent(html, "property", "og:locale:alternate") ?? null,
    definition.ogLocaleAlternate ?? null,
    `${name} og:locale:alternate`,
  );
  expectEqual(metaContent(html, "property", "og:type"), definition.ogType ?? "website", `${name} og:type`);
  expectEqual(metaContent(html, "property", "og:image"), definition.ogImage, `${name} og:image`);
  expectEqual(metaContent(html, "property", "og:image:width"), "1200", `${name} og:image:width`);
  expectEqual(metaContent(html, "property", "og:image:height"), "630", `${name} og:image:height`);
  // Las fichas de /trabajo las pinta satori en PNG; todo lo demás es JPEG de og-cards.
  expectEqual(
    metaContent(html, "property", "og:image:type"),
    definition.ogImage.includes("/api/og/trabajo/") ? "image/png" : "image/jpeg",
    `${name} og:image:type`,
  );
  expectEqual(
    metaContent(html, "property", "og:image:alt"),
    definition.ogImageAlt,
    `${name} og:image:alt`,
  );
  expectEqual(metaContent(html, "name", "twitter:card"), "summary_large_image", `${name} twitter:card`);
  expectEqual(
    metaContent(html, "name", "twitter:title"),
    definition.twitterTitle,
    `${name} twitter:title`,
  );
  expectEqual(
    metaContent(html, "name", "twitter:description"),
    definition.twitterDescription,
    `${name} twitter:description`,
  );
  expectEqual(metaContent(html, "name", "twitter:image"), definition.ogImage, `${name} twitter:image`);
  expectEqual(
    metaContent(html, "name", "twitter:image:alt"),
    definition.twitterImageAlt,
    `${name} twitter:image:alt`,
  );
}

function verifyContactSurface(name, html, expected) {
  const actual = {
    /*
     * Se cuenta el diálogo de contacto por su `id`, no los `<dialog>` de la
     * página. La cuenta genérica convertía esta puerta en «el sitio no puede
     * tener más de un diálogo», que no es lo que vigila: lo que vigila es que
     * la superficie de contacto sea exactamente una por página. La regla de
     * abajo —ningún diálogo sale abierto del SSR— sí es general, y así se
     * queda: vale para cualquier diálogo que se añada.
     */
    dialogs: count(html, 'id="site-contact-dialog"'),
    triggers: count(html, "data-contact-trigger="),
    dialogForms: count(html, 'data-contact-form="dialog"'),
    sectionForms: count(html, 'data-contact-form="section"'),
  };

  for (const key of Object.keys(expected)) {
    expectEqual(actual[key], expected[key], `${name} contacto.${key}`);
  }
  expect(count(html, "<dialog open") === 0, `${name}: el diálogo no puede salir abierto desde SSR`);
}

function verifyNewsTab(name, html, expected) {
  const tabs = count(html, "data-news-tab=");
  if (!newsActive) {
    expectEqual(tabs, 0, `${name}: la pestaña de noticia caducó y no debe salir en el HTML`);
    return;
  }
  expectEqual(tabs, 1, `${name}: pestaña de noticia vigente`);
  expect(html.includes(expected.tab), `${name}: la pestaña de noticia no dice «${expected.tab}»`);
  expect(
    html.includes(`data-contact-trigger="${expected.source}"`),
    `${name}: la tarjeta de noticia debe abrir el contacto con source=${expected.source}`,
  );
  expect(
    html.includes('src="/brand/news/golden-gate.webp"'),
    `${name}: falta la foto de la placa de la noticia`,
  );
  // Sin JS la tarjeta se ve abierta: el SSR no puede marcarla cerrada.
  expect(!html.includes('data-open="false"'), `${name}: la tarjeta de noticia sale cerrada del SSR`);
}

function verifyJsonLd(name, html, definition) {
  const jsonLd = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => readAttributes(match[1]).type === "application/ld+json")
    .map((match) => {
      try {
        return JSON.parse(decodeHtml(match[2]));
      } catch (error) {
        errors.push(`${name}: JSON-LD inválido (${error.message})`);
        return null;
      }
    })
    .filter(Boolean);
  const jsonLdEntities = jsonLd.flatMap((data) => [
    data,
    ...(Array.isArray(data["@graph"])
      ? data["@graph"].map((entity) => ({
          ...entity,
          "@context": entity["@context"] ?? data["@context"],
        }))
      : []),
  ]);
  const organization = jsonLdEntities.find(
    (data) =>
      data["@type"] === "Organization" &&
      data["@id"] === "https://inplux.co/#organization",
  );

  expect(Boolean(organization), `${name}: falta Organization JSON-LD`);
  if (organization) {
    expectEqual(organization["@context"], "https://schema.org", `${name} JSON-LD @context`);
    expectEqual(organization.name, "INPLUX S.A.S.", `${name} JSON-LD name`);
    expectEqual(organization.url, "https://inplux.co", `${name} JSON-LD url`);
  }

  if (definition.jsonLd) {
    const routeEntity = jsonLdEntities.find(
      (data) => data["@type"] === definition.jsonLd.type,
    );
    expect(
      Boolean(routeEntity),
      `${name}: falta ${definition.jsonLd.type} JSON-LD para identificar la ruta`,
    );
    if (routeEntity) {
      expectEqual(
        routeEntity["@context"],
        "https://schema.org",
        `${name} ${definition.jsonLd.type} @context`,
      );
      expectEqual(
        routeEntity.name,
        definition.jsonLd.name,
        `${name} ${definition.jsonLd.type} name`,
      );
      expectEqual(
        routeEntity.url,
        definition.jsonLd.url,
        `${name} ${definition.jsonLd.type} url`,
      );
      if (definition.inLanguage) {
        expectEqual(
          routeEntity.inLanguage,
          definition.inLanguage,
          `${name} ${definition.jsonLd.type} inLanguage`,
        );
      }
      if (definition.jsonLd.type === "WebSite") {
        expectEqual(
          routeEntity.alternateName,
          "INPLUX S.A.S.",
          `${name} WebSite alternateName`,
        );
      }
    }
  }

  if (definition.usEntity) {
    const usEntity = jsonLdEntities.find(
      (data) => data["@id"] === definition.usEntity["@id"],
    );
    expect(
      Boolean(usEntity),
      `${name}: falta la sociedad estadounidense ${definition.usEntity["@id"]} en JSON-LD`,
    );
    if (usEntity) {
      expectEqual(usEntity["@type"], "Organization", `${name} LLC @type`);
      expectEqual(usEntity.name, definition.usEntity.name, `${name} LLC name`);
      expectEqual(
        usEntity.address?.addressLocality,
        definition.usEntity.addressLocality,
        `${name} LLC addressLocality`,
      );
      expectEqual(
        usEntity.address?.addressRegion,
        definition.usEntity.addressRegion,
        `${name} LLC addressRegion`,
      );
      expectEqual(
        usEntity.address?.addressCountry,
        definition.usEntity.addressCountry,
        `${name} LLC addressCountry`,
      );
      expectEqual(
        usEntity.parentOrganization?.["@id"],
        "https://inplux.co/#organization",
        `${name} LLC parentOrganization`,
      );
    }
  }

  const website = jsonLd.find((data) => data["@type"] === "WebSite");
  expect(
    name === "home" ? Boolean(website) : !website,
    `${name}: WebSite JSON-LD debe publicarse solo en HOME`,
  );
}

function verifyIds(name, html, legacyFragments = []) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const counts = new Map();
  ids.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
  for (const [id, occurrences] of counts) {
    expect(occurrences === 1, `${name}: el id #${id} aparece ${occurrences} veces`);
  }
  expect(counts.get("main-content") === 1, `${name}: falta el destino de salto #main-content`);
  for (const fragment of legacyFragments) {
    expect(counts.get(fragment) === 1, `${name}: falta el fragmento histórico #${fragment}`);
  }
}

/**
 * Las dos invariantes de contenido que se juzgan sobre el DOM y no sobre la
 * fuente.
 *
 * Vivieron cuatro rondas en `scripts/verify-public-content.mjs`, leyendo
 * TypeScript con un lexer propio de ~415 líneas, y una re-revisión adversarial
 * las atravesó nueve veces: el `title` escrito con backticks en vez de comillas
 * —dos caracteres—, una constante declarada fuera del capítulo, un delimitador
 * de cierre forjado dentro de un comentario, un `copy:` anidado señuelo que
 * acreditaba a REDEK mientras la prosa publicada lo perdía, la frase mudada al
 * capítulo vecino, un sexto producto añadido en el archivo que el pie sí
 * renderiza y un `href` reescrito dentro del `.map()` que mandaba los cinco
 * enlaces a 404.
 *
 * Todas tenían la misma causa: el guardia leía la fuente y la invariante vive
 * en el DOM. `navigation.ts` y `copy/en.ts` ni siquiera son lo que el pie
 * renderiza —el pie español publica `homeCopyEs.footer.groups`, que *consume*
 * `productNavigation`, y el inglés publica el resultado de `spanishRoute(…)`,
 * no sus argumentos—. Aquí se juzga el HTML que recibe el navegador: ninguna
 * forma de escribir el contenido puede esconderle nada a este control, y a
 * cambio desaparece toda restricción sobre cómo escribirlo.
 *
 * El precio: `check:content` corre antes de `next build` y estas dos fallaban
 * antes de compilar; ahora fallan después. Se juzga lo que el usuario ve en vez
 * de lo que la fuente insinúa.
 */
function verifyAttribution(name, html) {
  expect(
    html.includes("REDEK"),
    `${name}: el HTML publicado de /nosotros debe acreditar a REDEK; es la única prosa del sitio que resume la autoría de todos los productos y Laudos reparte desarrollo técnico (INPLUX) y criterio legal (REDEK)`,
  );

  const banned = html.match(/desarrollos\s+propios/i);
  expect(
    banned === null,
    `${name}: el HTML publicado de /nosotros dice «${banned?.[0]}» y no puede llamar así al conjunto de productos; Laudos reparte el crédito con REDEK`,
  );
}

/** El interior de un `<nav>` del HTML construido, buscado por su nombre accesible. */
function sliceNav(html, ariaLabel) {
  const opening = new RegExp(
    `<nav\\b[^>]*\\baria-label="${ariaLabel.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")}"[^>]*>`,
    "i",
  );
  const opened = opening.exec(html);
  if (!opened) return null;

  const bodyStart = opened.index + opened[0].length;
  const navTags = /<(\/?)nav\b[^>]*>/gi;
  navTags.lastIndex = bodyStart;
  let depth = 1;
  for (let tag = navTags.exec(html); tag !== null; tag = navTags.exec(html)) {
    depth += tag[1] === "/" ? -1 : 1;
    if (depth === 0) return html.slice(bodyStart, tag.index);
  }
  return null;
}

/** Los enlaces de un `<nav>` del HTML construido: su `href` y su texto visible. */
function readNavigationLinks(html, ariaLabel) {
  const body = sliceNav(html, ariaLabel);
  if (body === null) return null;

  return [...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((anchor) => ({
    href: readAttributes(anchor[1]).href ?? "",
    label: decodeHtml(anchor[2].replace(/<[^>]*>/g, ""))
      .replace(/\s+/g, " ")
      .trim(),
  }));
}

/**
 * Los títulos de las láminas, leídos del riel del HTML construido.
 *
 * ⚠️ **Es el único sitio del documento donde el deck entero está escrito.** El
 * riel monta una lámina cada vez, así que del cuerpo solo se construye la
 * portada; el índice es un `<dialog>` que ni siquiera se monta hasta que
 * alguien lo pide. Lo que sí sale entero en el HTML es el riel de progreso: un
 * botón por lámina, cada uno con su título en el `aria-label`. Por ahí se puede
 * juzgar QUÉ deck se está sirviendo sin abrir un navegador.
 *
 * El prefijo «Ir a » lo escribe `ProgressRail.tsx` y de paso separa los
 * segmentos de los dos botones de paso, que se llaman «Lámina anterior» y
 * «Lámina siguiente». Si allí cambia el prefijo, aquí sale una lista vacía y el
 * control lo canta: es ruidoso, que es lo que se quiere.
 */
const PREFIJO_SEGMENTO = "Ir a ";

function readRailTitles(html) {
  const body = sliceNav(html, "Láminas");
  if (body === null) return null;

  return [...body.matchAll(/<button\b([^>]*)>/gi)]
    .map((button) => readAttributes(button[1])["aria-label"] ?? "")
    .filter((label) => label.startsWith(PREFIJO_SEGMENTO))
    .map((label) => label.slice(PREFIJO_SEGMENTO.length));
}

/**
 * Qué deck sirve una ruta de presentación: cuántas láminas trae su riel y qué
 * productos son los suyos, **en el HTML construido**.
 *
 * Existe por el deck dirigido. Recortar la serie de producto es un parámetro
 * del modelo, pero las láminas que hablan de la serie ENTERA leían
 * `workProfiles` global: el deck de cuatro productos enseñaba cinco en la
 * vitrina del puente y cinco dominios en las capas de la fábrica. Un control
 * sobre el modelo no lo habría visto —el modelo estaba bien— y uno sobre el
 * código fuente tampoco. Se juzga lo que recibe el navegador.
 */
function verifyDeckShape(name, html, { slides, profiles }) {
  const titulos = readRailTitles(html);
  if (titulos === null) {
    errors.push(
      `${name}: el HTML publicado no trae el riel de láminas <nav aria-label="Láminas">; sin él nadie verifica qué deck se está sirviendo`,
    );
    return;
  }

  expectEqual(titulos.length, slides, `${name} láminas en el riel`);

  // Un segmento es de producto si su título es el nombre de un producto
  // documentado: el título de la lámina de producto ES `perfil.name`.
  const documentados = workProfiles.map((profile) => profile.name);
  expectEqual(
    titulos.filter((titulo) => documentados.includes(titulo)).join(" · "),
    profiles.map((profile) => profile.name).join(" · "),
    `${name} láminas de producto en el riel`,
  );

  // Las capturas anunciadas en la cabecera son las de las fichas que este deck
  // monta. Una de más es media pantalla de descarga que ninguna lámina va a
  // pintar, compitiendo por el ancho de banda con las que sí.
  //
  // ⚠️ Solo se miran las precargas que apuntan al acta de capturas
  // (`/work/real-pages/`): en la cabecera hay otras imágenes anunciadas —el
  // logo, por ejemplo— que no son de este deck ni de ningún deck, y contarlas
  // convertiría este control en un conteo que hay que ajustar cada vez que
  // alguien precargue cualquier otra cosa.
  //
  // ⚠️ Y el atributo se lee como `imageSrcSet`: React serializa la prop de
  // `ReactDOM.preload` con esa caja exacta, no como `imagesrcset`.
  const ACTA = encodeURIComponent("/work/real-pages/");
  const destino = (attributes) => `${attributes.href ?? ""} ${attributes.imageSrcSet ?? ""}`;
  const precargas = collectElements(html, "link").filter(
    (attributes) =>
      attributes.rel === "preload" &&
      attributes.as === "image" &&
      destino(attributes).includes(ACTA),
  );
  expectEqual(precargas.length, profiles.length, `${name} capturas precargadas`);

  const anunciada = (profile) =>
    precargas.filter((attributes) =>
      destino(attributes).includes(encodeURIComponent(profile.capture)),
    );

  for (const profile of profiles) {
    expectEqual(anunciada(profile).length, 1, `${name} precarga de la captura de ${profile.name}`);
  }
  for (const profile of workProfiles) {
    if (profiles.includes(profile)) continue;
    expect(
      anunciada(profile).length === 0,
      `${name}: precarga la captura de ${profile.name} y ese producto no está en este deck`,
    );
  }
}

/**
 * Biyección entre `workProfiles` y los enlaces que el pie de productos publica:
 * ruta y etiqueta. Falta uno y falla; sobra uno y falla; el `href` o el texto no
 * coinciden y falla.
 *
 * `workProfiles` es aquí el espejo fijado de `src/content/work.ts`, igual que
 * `expectedSitemapUrls`: dar de alta un sexto producto obliga a darlo de alta
 * también en este archivo, y hasta que se haga el build se detiene diciendo qué
 * enlace sobra. Es ruidoso a propósito —Porkia se dio de alta como quinto
 * producto y nunca llegó a ninguno de los dos pies, en silencio—.
 */
function verifyProductFooter(name, html, { label: ariaLabel, prefix }) {
  const links = readNavigationLinks(html, ariaLabel);
  if (links === null) {
    errors.push(
      `${name}: el HTML publicado no trae el pie de productos <nav aria-label="${ariaLabel}">; sin él nadie verifica que el pie y work.ts no divergen`,
    );
    return;
  }

  const documented = workProfiles.map((profile) => ({
    href: `${prefix}/${profile.slug}`,
    label: profile.name,
  }));
  const surface = `${name}: el pie de productos (aria-label="${ariaLabel}")`;

  for (const product of documented) {
    const published = links.filter((link) => link.href === product.href);
    if (published.length === 0) {
      errors.push(
        `${surface} no publica “${product.label}”: falta el enlace ${product.href}, y work.ts documenta ese producto`,
      );
      continue;
    }
    if (published.length > 1) {
      errors.push(`${surface} publica ${published.length} veces el enlace ${product.href}`);
    }
    for (const link of published) {
      if (link.label !== product.label) {
        errors.push(
          `${surface} llama “${link.label}” a ${product.href}; work.ts lo llama “${product.label}”`,
        );
      }
    }
  }

  for (const link of links) {
    if (!documented.some((product) => product.href === link.href)) {
      errors.push(
        `${surface} publica “${link.label}” (${link.href}) y work.ts no documenta ese producto`,
      );
    }
  }
}

async function verifyGeneratedRoutes() {
  const expectedSitemapUrls = [
    siteUrl,
    `${siteUrl}/en`,
    `${siteUrl}/como-trabajamos`,
    `${siteUrl}/trabajo`,
    `${siteUrl}/trabajo/tribai`,
    `${siteUrl}/trabajo/gobia`,
    `${siteUrl}/trabajo/kelsen`,
    `${siteUrl}/trabajo/laudos`,
    `${siteUrl}/trabajo/porkia`,
    `${siteUrl}/deck`,
    `${siteUrl}/deck/presentacion`,
    `${siteUrl}/sectores/salud`,
    `${siteUrl}/sectores/publico`,
    `${siteUrl}/sectores/legal-tributario`,
    `${siteUrl}/sectores/empresas`,
    `${siteUrl}/nosotros`,
    `${siteUrl}/equipo`,
    `${siteUrl}/equipo/jaime-alonso-cano-pino`,
    `${siteUrl}/equipo/cristian-espinal-maya`,
    `${siteUrl}/prensa`,
    `${siteUrl}/prensa/seagricolas-sudafrica`,
    `${siteUrl}/contacto`,
    `${siteUrl}/seguridad`,
    // El sitio en inglés, al final y en el orden de `sitemap.ts`.
    ...languagePairs.map(([, en]) => `${siteUrl}${en}`),
  ];

  try {
    const sitemap = await readFile(path.join(root, ".next/server/app/sitemap.xml.body"), "utf8");
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expectEqual(urls.length, expectedSitemapUrls.length, "sitemap cantidad de URLs");
    expectedSitemapUrls.forEach((url, index) => {
      expectEqual(urls[index], url, `sitemap URL ${String(index + 1).padStart(2, "0")}`);
    });
    expect(
      !urls.includes(`${siteUrl}/marca`),
      "sitemap: la guía interna /marca no debe publicarse como ruta indexable",
    );
    // El deck dirigido se manda por enlace a una sala concreta y no es una
    // página pública: ni él ni su índice entran al sitemap. Se comprueba por
    // prefijo para que ninguna ruta futura bajo `/deck/legaltech` se cuele.
    expect(
      !urls.some((url) => url.startsWith(`${siteUrl}/deck/legaltech`)),
      "sitemap: el deck dirigido a legaltech no debe publicarse como ruta indexable",
    );
    expect(
      !/<(?:lastmod|changefreq|priority)>/.test(sitemap),
      "sitemap: no debe inventar fechas ni señales que los buscadores ignoran",
    );
  } catch (error) {
    errors.push(`sitemap: no se pudo validar (${error.message})`);
  }

  try {
    const source = await readFile(
      path.join(root, ".next/server/app/manifest.webmanifest.body"),
      "utf8",
    );
    const manifest = JSON.parse(source);
    expectEqual(manifest.id, "/", "manifest id");
    expectEqual(manifest.scope, "/", "manifest scope");
    expectEqual(manifest.start_url, "/", "manifest start_url");
    expectEqual(manifest.lang, "es-CO", "manifest lang");
    expectEqual(manifest.name, "INPLUX — Transformación con IA que llega a producción", "manifest name");
    expectEqual(manifest.short_name, "INPLUX", "manifest short_name");
    expectEqual(
      manifest.description,
      "Desarrollamos e implementamos la transformación con IA de empresas e instituciones en Latinoamérica.",
      "manifest description",
    );
    expectEqual(manifest.display, "standalone", "manifest display");
    expectEqual(manifest.background_color, "#0c0c0b", "manifest background_color");
    expectEqual(manifest.theme_color, "#0c0c0b", "manifest theme_color");
    expectEqual(
      JSON.stringify(manifest.categories),
      JSON.stringify(["business", "productivity"]),
      "manifest categories",
    );
    expectEqual(manifest.icons?.length, 3, "manifest cantidad de iconos");
    const expectedIcons = [
      {
        src: "/web-app-manifest-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ];
    expectEqual(
      JSON.stringify(manifest.icons),
      JSON.stringify(expectedIcons),
      "manifest iconos",
    );
  } catch (error) {
    errors.push(`manifest: no se pudo validar (${error.message})`);
  }
}

for (const [name, definition] of Object.entries(pageDefinitions)) {
  let html;
  try {
    html = await readFile(path.join(root, definition.file), "utf8");
  } catch (error) {
    errors.push(`${name}: no se pudo leer ${definition.file} (${error.message})`);
    continue;
  }

  // El layout raíz resuelve `lang` por ruta (`HtmlRoot`): `en` bajo `/en`.
  const expectedLang = definition.htmlLang ?? "es-CO";
  expect(
    new RegExp(`<html\\b[^>]*\\blang="${expectedLang}"`, "i").test(html),
    `${name}: <html> debe declarar lang="${expectedLang}"`,
  );
  expectEqual(titleContent(html), definition.title, `${name} title`);
  expectEqual(metaContent(html, "name", "description"), definition.description, `${name} description`);
  expectEqual(linkHref(html, "canonical") ?? null, definition.canonical, `${name} canonical`);
  expectEqual(linkHref(html, "manifest"), "/manifest.webmanifest", `${name} manifest`);
  expectEqual(metaContent(html, "name", "theme-color"), "#0c0c0b", `${name} theme-color`);
  expect(count(html, "<main") === 1, `${name}: debe renderizar exactamente un landmark <main>`);
  expect(count(html, "<h1") === 1, `${name}: debe renderizar exactamente un <h1>`);

  const robots = metaContent(html, "name", "robots") ?? "";
  if (definition.noindex) {
    expect(robots.includes("noindex"), `${name}: debe declarar noindex`);
  } else {
    expect(!robots.includes("noindex"), `${name}: no debe declarar noindex`);
  }

  if (definition.languageAlternates) {
    const alternates = collectElements(html, "link").filter((attributes) =>
      String(attributes.rel ?? "")
        .split(/\s+/)
        .includes("alternate"),
    );
    for (const [hreflang, href] of Object.entries(definition.languageAlternates)) {
      // React serializa la prop como `hrefLang`; el atributo HTML no distingue
      // mayúsculas, así que aceptamos ambas escrituras.
      const alternate = alternates.find(
        (attributes) =>
          (attributes.hreflang ?? attributes.hrefLang) === hreflang,
      );
      expectEqual(alternate?.href, href, `${name} hreflang ${hreflang}`);
    }
  }

  if (definition.contentLang) {
    expect(
      html.includes(`lang="${definition.contentLang}"`),
      `${name}: el contenido debe declarar lang="${definition.contentLang}"`,
    );
  }

  verifySocialMetadata(name, html, definition);
  verifyContactSurface(name, html, definition.contact);
  if (definition.news) verifyNewsTab(name, html, definition.news);
  verifyJsonLd(name, html, definition);
  verifyIds(name, html, definition.legacyFragments);
  for (const link of definition.requiredLinks ?? []) {
    expect(
      html.includes(`href="${link}"`),
      `${name}: debe enlazar ${link}; la autoridad interna de esa ruta depende de este enlace`,
    );
  }
  if (!definition.languageSwitch && !definition.canonical?.match(/^https:\/\/inplux\.co(\/en)?$/)) {
    // Sin par no hay selector: el equipo, la prensa, la marca y los decks.
    expect(!html.includes("languageSwitch"), `${name}: no tiene par y muestra el selector de idioma`);
  }
  if (definition.languageSwitch) {
    const switches = [...html.matchAll(/<a[^>]*class="[^"]*languageSwitch[^"]*"[^>]*>/g)].map(
      ([tag]) => tag,
    );
    expectEqual(switches.length, 1, `${name} selectores de idioma`);
    const { href, hrefLang } = definition.languageSwitch;
    expect(
      switches[0]?.includes(`href="${href}"`) && switches[0]?.includes(`hrefLang="${hrefLang}"`),
      `${name}: el selector de idioma debe llevar a ${href} con hreflang ${hrefLang}`,
    );
    const pairLinks = html.split(`href="${href}"`).length - 1;
    expectEqual(pairLinks, 1, `${name} enlaces a ${href} fuera del selector`);
  }
  for (const link of definition.forbiddenLinks ?? []) {
    expect(
      !html.includes(`href="${link}"`),
      `${name}: enlaza ${link}, la versión española de una página que tiene par en inglés`,
    );
  }
  for (const text of definition.requiredText ?? []) {
    expect(html.includes(text), `${name}: debe citar «${text}»`);
  }
  for (const text of definition.forbiddenText ?? []) {
    expect(
      !html.includes(text),
      `${name}: publica «${text}», que esta ruta no puede nombrar`,
    );
  }
  if (definition.websiteId) {
    const website = [...html.matchAll(/<script\b[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
      .map((match) => {
        try {
          return JSON.parse(decodeHtml(match[1]));
        } catch {
          return null;
        }
      })
      .find((data) => data && data["@type"] === "WebSite");
    expect(
      website?.["@id"] === definition.websiteId,
      `${name}: el WebSite JSON-LD debe declarar "@id" ${definition.websiteId}; los perfiles de /equipo lo citan en isPartOf`,
    );
  }
  if (definition.attribution) verifyAttribution(name, html);
  if (definition.productFooter) verifyProductFooter(name, html, definition.productFooter);
  if (definition.deck) verifyDeckShape(name, html, definition.deck);
}

/**
 * Guardia de las tarjetas para compartir (PR N, 20-oct-2026), sobre TODAS las
 * páginas construidas y no solo las de `pageDefinitions`: el deck, /marca o
 * una ruta nueva heredan la tarjeta del layout y nadie las da de alta aquí.
 *
 * Falla si una página sirve en `og:image` o `twitter:image`:
 * - algo que no sea un JPEG de `scripts/og-cards.mjs` (`/brand/og/og-*.jpg`)
 *   ni la ruta de satori de las fichas (`/api/og/trabajo/<clave>`): así no
 *   vuelve la tarjeta PNG de la v3;
 * - una tarjeta que ya no existe en `public/` (o una ficha sin su captura);
 * - un JPEG de más de 300 KB, que WhatsApp descarta o tarda en pintar.
 */
const maxSocialCardBytes = 300_000;

async function collectBuiltPages(directory, prefix = "") {
  const entries = await readdir(path.join(root, directory, prefix), { withFileTypes: true });
  const pages = [];
  for (const entry of entries) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      pages.push(...(await collectBuiltPages(directory, relative)));
    } else if (entry.name.endsWith(".html") && !entry.name.startsWith("_")) {
      pages.push(relative);
    }
  }
  return pages;
}

async function fileSize(relativePath) {
  try {
    return (await stat(path.join(root, relativePath))).size;
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

/**
 * /equipo: cada integrante de `teamCrew` con retrato existente ≤ 150 KB, alt
 * con su nombre y `Person` en el JSON-LD; la página sigue corta (≤ 450 palabras).
 */
async function verifyTeamCrew() {
  const html = await readFile(path.join(root, ".next/server/app/equipo.html"), "utf8");
  const graph = [...html.matchAll(/<script\b[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((match) => {
      try {
        const data = JSON.parse(decodeHtml(match[1]));
        return [data, ...(Array.isArray(data["@graph"]) ? data["@graph"] : [])];
      } catch {
        return [];
      }
    });

  for (const { slug, name } of teamCrewProfiles) {
    const photo = `public/brand/team/${slug}.jpg`;
    const size = await fileSize(photo);
    expect(size !== null, `equipo: falta el retrato ${photo}`);
    if (size !== null) {
      expect(
        size <= maxCrewPhotoBytes,
        `equipo: ${photo} pesa ${Math.round(size / 1024)} KB; el límite es ${maxCrewPhotoBytes / 1000} KB`,
      );
    }
    expect(html.includes(`alt="${name}"`), `equipo: el retrato de ${name} debe llevar alt="${name}"`);
    expect(html.includes(`id="${slug}"`), `equipo: falta el ancla #${slug} de la tarjeta de ${name}`);
    const person = graph.find(
      (entity) => entity["@type"] === "Person" && entity["@id"] === `${siteUrl}/equipo#${slug}`,
    );
    expect(Boolean(person), `equipo: el JSON-LD debe declarar a ${name} como Person con @id /equipo#${slug}`);
    if (person) {
      expectEqual(person.name, name, `equipo JSON-LD name de ${slug}`);
      expectEqual(
        person.worksFor?.["@id"],
        `${siteUrl}/#organization`,
        `equipo JSON-LD worksFor de ${slug}`,
      );
      expectEqual(person.image, `${siteUrl}/brand/team/${slug}.jpg`, `equipo JSON-LD image de ${slug}`);
    }
  }

  const words = countWords(html);
  expect(
    words <= maxTeamPageWords,
    `equipo: <main> tiene ${words} palabras; el tope es ${maxTeamPageWords}`,
  );
}

async function verifyHomeShape() {
  for (const { name, file, workPath } of homeShape) {
    const html = await readFile(path.join(root, file), "utf8");
    const open = html.search(/<main\b/);
    const main = html.slice(open, html.indexOf("</main>", open));

    expectEqual(count(main, "<h2"), homeH2Count, `${name}: H2 en <main>`);

    expectEqual(count(main, 'id="p-'), workProfiles.length, `${name}: fichas de producto`);
    for (const { slug } of workProfiles) {
      expect(main.includes(`id="p-${slug}"`), `${name}: falta la ficha #p-${slug}`);
      expect(
        main.includes(`href="${workPath}/${slug}"`),
        `${name}: la ficha de ${slug} debe enlazar ${workPath}/${slug}`,
      );
    }

    const at = (id) => main.indexOf(`id="${id}"`);
    const stats = at("casos");
    expect(
      stats > at("auditoria") && stats < at("prensa"),
      `${name}: las cifras con fuente (#casos) van dentro de la evidencia (#auditoria)`,
    );
    expect(
      !(stats > at("latinoamerica") && stats < at("sectores")),
      `${name}: la banda de tesis (#latinoamerica) va sin cifras`,
    );

    const words = countWords(html);
    expect(words <= maxHomeWords, `${name}: <main> tiene ${words} palabras; el tope es ${maxHomeWords}`);
  }
}

async function verifySharedImages() {
  const pages = await collectBuiltPages(".next/server/app");
  const workKeys = new Set(["directorio", ...workProfiles.map((profile) => profile.slug)]);

  for (const page of pages) {
    const html = await readFile(path.join(root, ".next/server/app", page), "utf8");
    const images = [
      ["og:image", metaContent(html, "property", "og:image")],
      ["twitter:image", metaContent(html, "name", "twitter:image")],
    ];

    for (const [tag, url] of images) {
      if (!url) {
        errors.push(`${page}: no declara ${tag}; heredaría la vista previa que arme cada red`);
        continue;
      }
      const pathname = url.startsWith(siteUrl) ? new URL(url).pathname : url;
      const card = pathname.match(/^\/brand\/og\/(og-[a-z0-9-]+\.jpg)$/);
      const work = pathname.match(/^\/api\/og\/trabajo\/([a-z0-9-]+)$/);

      if (card) {
        const size = await fileSize(`public/brand/og/${card[1]}`);
        if (size === null) {
          errors.push(`${page}: ${tag} apunta a ${pathname}, que no existe en public/`);
        } else if (size > maxSocialCardBytes) {
          errors.push(
            `${page}: ${tag} ${pathname} pesa ${Math.round(size / 1024)} KB; el límite es ${maxSocialCardBytes / 1000} KB`,
          );
        }
      } else if (work) {
        if (!workKeys.has(work[1])) {
          errors.push(`${page}: ${tag} pide la ficha ${work[1]}, que no existe`);
        } else if (
          work[1] !== "directorio" &&
          (await fileSize(`public/brand/og/mockups/${work[1]}.png`)) === null
        ) {
          errors.push(
            `${page}: ${tag} pide la ficha ${work[1]} y falta su captura public/brand/og/mockups/${work[1]}.png`,
          );
        }
      } else {
        errors.push(
          `${page}: ${tag} sirve ${url}; solo valen los JPEG de og-cards (/brand/og/og-*.jpg) y /api/og/trabajo`,
        );
      }
    }
  }

  // Ningún JPEG de tarjeta en public/ pasa del límite, lo use hoy una página o no.
  for (const entry of await readdir(path.join(root, "public/brand/og"))) {
    if (!/^og-.*\.jpg$/.test(entry)) continue;
    const size = await fileSize(`public/brand/og/${entry}`);
    if (size > maxSocialCardBytes) {
      errors.push(
        `public/brand/og/${entry} pesa ${Math.round(size / 1024)} KB; el límite es ${maxSocialCardBytes / 1000} KB`,
      );
    }
  }
}

await verifySharedImages();
await verifyGeneratedRoutes();
await verifyTeamCrew();
await verifyHomeShape();

// ── Verificación de Search Console ──────────────────────────────────────────
// Google avisa al verificar por etiqueta: si la meta desaparece de la home, la
// propiedad https://inplux.co/ pierde la verificación y con ella el acceso a
// Search Console. Nada visible se rompe al quitarla, así que lo vigila el
// build. El valor se fija LITERAL a propósito: cambiarlo equivale a perderla.
{
  const homeHtml = await readFile(path.join(root, ".next/server/app/index.html"), "utf8");
  const etiqueta =
    'name="google-site-verification" content="NtbZyIVhM4El76G13EPJ3euuE-5ISxt7OA9JGbUAy5Q"';
  if (!homeHtml.includes(etiqueta)) {
    errors.push(
      "la home perdió la etiqueta de verificación de Google Search Console " +
        "(metadata.verification.google en src/app/layout.tsx). Sin ella la propiedad " +
        "https://inplux.co/ queda sin verificar.",
    );
  }
}

if (errors.length > 0) {
  console.error(`\nControl del HTML final falló con ${errors.length} problema(s):\n`);
  errors.sort().forEach((error) => console.error(`- ${error}`));
  console.error("");
  process.exitCode = 1;
} else {
  console.log(
    "Salida final aprobada: metadata, social cards (y sus imágenes), estructura, contacto, JSON-LD, atribución, pie de productos, sitemap y manifest.",
  );
}

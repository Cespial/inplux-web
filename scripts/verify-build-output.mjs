import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const errors = [];

const siteUrl = "https://inplux.co";
const defaultOgImage = `${siteUrl}/brand/og/og-default.png`;
const defaultOgImageAlt = "INPLUX, de un problema real a software en producción";
const sharedContact = { dialogs: 1, triggers: 1, dialogForms: 1, sectionForms: 0 };
const workSocialVersion = "2026-08-11";
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
 * y el 3 son la FORMA del modelo (`construirDeck` en `src/content/deck.ts`),
 * no un conteo de productos: si alguien añade una lámina que no es de
 * producto, este número y el publicado se separan y el verificador lo dice.
 */
const deckSlideCount = 7 + workProfiles.length + 3;

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
    title: "INPLUX | Fábrica de software a la medida",
    description:
      "Diseñamos, construimos y evolucionamos software a la medida para empresas y entidades. La IA acelera el trabajo; personas expertas dirigen las decisiones críticas.",
    canonical: "https://inplux.co",
    ogTitle: "De un problema real a software en producción.",
    ogDescription:
      "Conoce cómo INPLUX convierte necesidades concretas en productos digitales que se pueden usar y mejorar.",
    ogUrl: "https://inplux.co",
    ogImage: "https://inplux.co/brand/og/og-default.png",
    ogImageAlt: "INPLUX, de un problema real a software en producción",
    twitterTitle: "De un problema real a software en producción.",
    twitterDescription: "Fábrica de software a la medida para empresas y entidades.",
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
    contact: { dialogs: 1, triggers: 3, dialogForms: 1, sectionForms: 0 },
  },
  englishHome: {
    file: ".next/server/app/en.html",
    title: "Custom software factory in Miami, Florida | INPLUX",
    description:
      "INPLUX LLC is a Miami-based custom software factory. We design, build and evolve software for companies and public institutions. AI accelerates the work; expert people direct the critical decisions.",
    canonical: `${siteUrl}/en`,
    contentLang: "en-US",
    ogLocale: "en_US",
    ogTitle: "From a real problem to software in production.",
    ogDescription:
      "See how INPLUX turns concrete needs into digital products that can be used and improved.",
    ogUrl: `${siteUrl}/en`,
    ogImage: defaultOgImage,
    ogImageAlt: "INPLUX, from a real problem to software in production",
    twitterTitle: "From a real problem to software in production.",
    twitterDescription:
      "A custom software factory for companies and public institutions.",
    twitterImageAlt: "INPLUX, from a real problem to software in production",
    jsonLd: {
      type: "WebPage",
      name: "INPLUX, custom software factory in Miami",
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
    contact: { dialogs: 1, triggers: 3, dialogForms: 1, sectionForms: 0 },
    productFooter: "Documented products",
  },
  factory: {
    file: ".next/server/app/fabrica.html",
    title: "La fábrica — cómo convertimos un problema en software | INPLUX",
    description:
      "Conoce el sistema de INPLUX para entender el contexto, definir el producto, construir una primera versión útil y evolucionarla con evidencia.",
    canonical: `${siteUrl}/fabrica`,
    ogTitle: "La fábrica de INPLUX",
    ogDescription:
      "Contexto, criterio, construcción y evolución: un sistema para convertir problemas reales en software útil.",
    ogUrl: `${siteUrl}/fabrica`,
    ogImage: defaultOgImage,
    ogImageAlt: defaultOgImageAlt,
    twitterTitle: "La fábrica de INPLUX",
    twitterDescription:
      "El sistema con el que convertimos problemas reales en software útil.",
    twitterImageAlt: defaultOgImageAlt,
    jsonLd: {
      type: "WebPage",
      name: "La fábrica de INPLUX",
      url: `${siteUrl}/fabrica`,
    },
    contact: sharedContact,
  },
  work: {
    file: ".next/server/app/trabajo.html",
    title: "Trabajo y productos — evidencia y atribución | INPLUX",
    description:
      "Los productos de INPLUX, cada uno con sus fuentes públicas y su fecha de verificación.",
    canonical: `${siteUrl}/trabajo`,
    ogTitle: "Trabajo y productos — evidencia y atribución | INPLUX",
    ogDescription:
      "Cada producto documentado, con sus fuentes públicas y su fecha de verificación.",
    ogUrl: `${siteUrl}/trabajo`,
    ogImage: workSocialImage("directorio"),
    ogImageAlt:
      "INPLUX, directorio de trabajo y productos con fuentes verificadas",
    twitterTitle: "Trabajo y productos — evidencia y atribución | INPLUX",
    twitterDescription:
      "Cada producto documentado, con sus fuentes públicas y su fecha de verificación.",
    twitterImageAlt:
      "INPLUX, directorio de trabajo y productos con fuentes verificadas",
    jsonLd: {
      type: "CollectionPage",
      name: "Trabajo y productos — evidencia y atribución",
      url: `${siteUrl}/trabajo`,
    },
    contact: sharedContact,
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
        contact: sharedContact,
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
  capabilities: {
    file: ".next/server/app/capacidades.html",
    title: "Capacidades — sistemas compuestos para problemas reales | INPLUX",
    description:
      "Explora cómo INPLUX combina producto, operación, inteligencia artificial e integración para convertir un problema real en software en producción.",
    canonical: `${siteUrl}/capacidades`,
    ogTitle: "Capacidades de INPLUX",
    ogDescription:
      "No partimos de un catálogo. Componemos el sistema que cada problema necesita.",
    ogUrl: `${siteUrl}/capacidades`,
    ogImage: defaultOgImage,
    ogImageAlt: defaultOgImageAlt,
    twitterTitle: "Capacidades de INPLUX",
    twitterDescription:
      "Producto, operación, IA e integración reunidos alrededor de un cambio concreto.",
    twitterImageAlt: defaultOgImageAlt,
    contact: sharedContact,
  },
  about: {
    file: ".next/server/app/nosotros.html",
    title: "Nosotros — el criterio detrás de la fábrica | INPLUX",
    description:
      "Conoce la trayectoria, los principios y las personas que convierten contexto, producto e ingeniería en software útil.",
    canonical: "https://inplux.co/nosotros",
    ogTitle: "El criterio detrás de la fábrica | INPLUX",
    ogDescription:
      "La trayectoria, los principios y las personas detrás de la fábrica de software de INPLUX.",
    ogUrl: "https://inplux.co/nosotros",
    ogImage: "https://inplux.co/brand/og/og-nosotros.png",
    ogImageAlt: "INPLUX, el criterio detrás de la fábrica",
    twitterTitle: "El criterio detrás de la fábrica | INPLUX",
    twitterDescription:
      "La trayectoria, los principios y las personas detrás de la fábrica de software de INPLUX.",
    twitterImageAlt: "INPLUX, el criterio detrás de la fábrica",
    jsonLd: {
      type: "AboutPage",
      name: "El criterio detrás de la fábrica",
      url: `${siteUrl}/nosotros`,
    },
    contact: { dialogs: 1, triggers: 2, dialogForms: 1, sectionForms: 0 },
    productFooter: "Productos documentados",
    attribution: true,
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
    ogImage: "https://inplux.co/brand/og/og-default.png",
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
    ogImage: defaultOgImage,
    ogImageAlt: defaultOgImageAlt,
    twitterTitle: "Empecemos por el problema | INPLUX",
    twitterDescription:
      "Comparte el reto. No necesitas llegar con requisitos ni alcance definidos.",
    twitterImageAlt: defaultOgImageAlt,
    jsonLd: {
      type: "ContactPage",
      name: "Contacto INPLUX",
      url: `${siteUrl}/contacto`,
    },
    contact: { dialogs: 1, triggers: 1, dialogForms: 1, sectionForms: 1 },
  },
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
    ogImage: defaultOgImage,
    ogImageAlt: "INPLUX, fábrica de software a la medida",
    twitterTitle: "Sistema de marca — INPLUX",
    twitterDescription:
      "Guía interna de identidad de INPLUX: logo, color, tipografía, componentes y activos oficiales.",
    twitterImageAlt: "INPLUX, fábrica de software a la medida",
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
  expectEqual(metaContent(html, "property", "og:site_name"), "INPLUX S.A.S.", `${name} og:site_name`);
  expectEqual(
    metaContent(html, "property", "og:locale"),
    definition.ogLocale ?? "es_CO",
    `${name} og:locale`,
  );
  expectEqual(metaContent(html, "property", "og:type"), "website", `${name} og:type`);
  expectEqual(metaContent(html, "property", "og:image"), definition.ogImage, `${name} og:image`);
  expectEqual(metaContent(html, "property", "og:image:width"), "1200", `${name} og:image:width`);
  expectEqual(metaContent(html, "property", "og:image:height"), "630", `${name} og:image:height`);
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
    dialogs: count(html, "<dialog"),
    triggers: count(html, "data-contact-trigger="),
    dialogForms: count(html, 'data-contact-form="dialog"'),
    sectionForms: count(html, 'data-contact-form="section"'),
  };

  for (const key of Object.keys(expected)) {
    expectEqual(actual[key], expected[key], `${name} contacto.${key}`);
  }
  expect(count(html, "<dialog open") === 0, `${name}: el diálogo no puede salir abierto desde SSR`);
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
function verifyProductFooter(name, html, ariaLabel) {
  const links = readNavigationLinks(html, ariaLabel);
  if (links === null) {
    errors.push(
      `${name}: el HTML publicado no trae el pie de productos <nav aria-label="${ariaLabel}">; sin él nadie verifica que el pie y work.ts no divergen`,
    );
    return;
  }

  const documented = workProfiles.map((profile) => ({
    href: `/trabajo/${profile.slug}`,
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
    `${siteUrl}/fabrica`,
    `${siteUrl}/trabajo`,
    `${siteUrl}/trabajo/tribai`,
    `${siteUrl}/trabajo/gobia`,
    `${siteUrl}/trabajo/kelsen`,
    `${siteUrl}/trabajo/laudos`,
    `${siteUrl}/trabajo/porkia`,
    `${siteUrl}/deck`,
    `${siteUrl}/deck/presentacion`,
    `${siteUrl}/capacidades`,
    `${siteUrl}/nosotros`,
    `${siteUrl}/equipo/jaime-alonso-cano-pino`,
    `${siteUrl}/equipo/cristian-espinal-maya`,
    `${siteUrl}/prensa`,
    `${siteUrl}/contacto`,
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
    expectEqual(manifest.name, "INPLUX — Fábrica de software a la medida", "manifest name");
    expectEqual(manifest.short_name, "INPLUX", "manifest short_name");
    expectEqual(
      manifest.description,
      "Diseñamos, construimos y evolucionamos software a la medida para empresas y entidades.",
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

  expect(/<html\b[^>]*\blang="es-CO"/i.test(html), `${name}: <html> debe declarar lang="es-CO"`);
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
  verifyJsonLd(name, html, definition);
  verifyIds(name, html, definition.legacyFragments);
  if (definition.attribution) verifyAttribution(name, html);
  if (definition.productFooter) verifyProductFooter(name, html, definition.productFooter);
  if (definition.deck) verifyDeckShape(name, html, definition.deck);
}

await verifyGeneratedRoutes();

if (errors.length > 0) {
  console.error(`\nControl del HTML final falló con ${errors.length} problema(s):\n`);
  errors.sort().forEach((error) => console.error(`- ${error}`));
  console.error("");
  process.exitCode = 1;
} else {
  console.log(
    "Salida final aprobada: metadata, social cards, estructura, contacto, JSON-LD, atribución, pie de productos, sitemap y manifest.",
  );
}

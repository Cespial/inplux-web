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

const workProfiles = [
  {
    slug: "tribai",
    name: "Tribai",
    shortDescription:
      "Consulta tributaria con fuentes, vigencia y herramientas visibles.",
    status: "Producto público",
    attribution: "Atribución pública no confirmada",
    socialAlt: "Tribai: Producto público. Atribución pública no confirmada.",
  },
  {
    slug: "gobia",
    name: "Gobia",
    shortDescription:
      "Información y seguimiento municipal reunidos en un solo entorno.",
    status: "Piloto activo",
    attribution: "Solución de INPLUX",
    socialAlt: "Gobia: Piloto activo. Solución de INPLUX.",
  },
  {
    slug: "kelsen",
    name: "Kelsen",
    shortDescription:
      "Análisis, redacción y monitoreo jurídico con trazabilidad.",
    status: "Explorador público",
    attribution: "Atribución pública no confirmada",
    socialAlt: "Kelsen: Explorador público. Atribución pública no confirmada.",
  },
  {
    slug: "laudos",
    name: "Laudos",
    shortDescription:
      "Búsqueda de laudos y jurisprudencia arbitral con criterio legal.",
    status: "Beta abierta",
    attribution: "Desarrollo técnico de INPLUX",
    socialAlt: "Laudos: Beta abierta. Desarrollo técnico de INPLUX.",
  },
];

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
      "Explora por separado el trabajo públicamente atribuible a INPLUX y los productos documentados del ecosistema observado.",
    canonical: `${siteUrl}/trabajo`,
    ogTitle: "Trabajo y productos — evidencia y atribución | INPLUX",
    ogDescription:
      "Trabajo atribuible y ecosistema observado, con la atribución pública de cada perfil explicada por separado.",
    ogUrl: `${siteUrl}/trabajo`,
    ogImage: workSocialImage("directorio"),
    ogImageAlt:
      "INPLUX, directorio de trabajo y productos con atribución pública diferenciada",
    twitterTitle: "Trabajo y productos — evidencia y atribución | INPLUX",
    twitterDescription:
      "Trabajo atribuible y ecosistema observado, con la atribución pública de cada perfil explicada por separado.",
    twitterImageAlt:
      "INPLUX, directorio de trabajo y productos con atribución pública diferenciada",
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
}

await verifyGeneratedRoutes();

if (errors.length > 0) {
  console.error(`\nControl del HTML final falló con ${errors.length} problema(s):\n`);
  errors.sort().forEach((error) => console.error(`- ${error}`));
  console.error("");
  process.exitCode = 1;
} else {
  console.log(
    "Salida final aprobada: metadata, social cards, estructura, contacto, JSON-LD, sitemap y manifest.",
  );
}

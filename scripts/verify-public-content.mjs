import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const errors = [];
const textExtensions = new Set([
  ".css",
  ".html",
  ".json",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".webmanifest",
]);

const bannedPublicLanguage = [
  ["cifra de trayectoria sin evidencia", /(?:\+\s*)?(?:25|31)\s+a[ñn]os/giu],
  ["cifra de cobertura sin evidencia", /(?:\+\s*)?50\s+municipios/giu],
  ["cifra de proyectos sin evidencia", /(?:\+\s*)?100\s+proyectos/giu],
  ["cifra jurídica sin evidencia", /44\s+estatutos/giu],
  ["promesa genérica de velocidad", /\ben\s+(?:d[ií]as|semanas)\b/giu],
  ["posicionamiento tributario anterior", /hub\s+de\s+inteligencia\s+tributaria/giu],
  ["jerga agéntica", /\b(?:agentic|ag[eé]ntic[oa]s?|multiagente)\b/giu],
  ["afirmación autónoma no aprobada", /agentes?\s+de\s+IA|se\s+mejoran\s+solos/giu],
  ["cobertura geográfica no aprobada", /alcance\s+nacional|areaServed/giu],
  ["producto fuera del portafolio", /\bPorkia\b/giu],
  ["logo o relación sin permiso", /Parque\s+Arv[ií]|Think\s*IT|Fourier|Observatorio\s+de\s+Datos/giu],
  ["prueba social anterior", /conf[ií]an\s+en\s+nosotros/giu],
  ["impacto no demostrado", /resultados?\s+medibles?|impacto\s+medible/giu],
  ["posicionamiento profesional anterior", /tributaristas\s+que\s+construyen\s+tecnolog[ií]a/giu],
];

const approvedLogoAltAttributes = [
  'alt="Parque Arví Corporación"',
  'alt="Think IT"',
];
const approvedLogoMentions = [
  "Parque Arví Corporación",
  "Think IT",
];
const approvedLogoFiles = new Set([
  "src/components/site/SoftwareFactoryExperience.tsx",
  "src/components/home/HomeSections.tsx",
]);

const forbiddenPublicAssets = [
  "public/brand/og/og-sector-publico.png",
  "public/brand/og/og-sector-publico.svg",
  "public/brand/og/og-tribai.png",
  "public/brand/og/og-tribai.svg",
  "public/og-image.png",
  "public/og/nosotros.png",
  "public/og/sector-publico.png",
  "public/og/tribai.png",
  "public/hero.mp4",
  "public/hero.webm",
  "public/inplux-logo.png",
];

const requiredSocialCards = [
  {
    png: "public/brand/og/og-default.png",
    svg: "public/brand/og/og-default.svg",
    reference: "/brand/og/og-default.png",
  },
  {
    png: "public/brand/og/og-nosotros.png",
    svg: "public/brand/og/og-nosotros.svg",
    reference: "/brand/og/og-nosotros.png",
  },
];

async function exists(relativePath) {
  try {
    await stat(path.join(root, relativePath));
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function collectTextFiles(relativeDirectory) {
  const directory = path.join(root, relativeDirectory);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTextFiles(relativePath)));
    } else if (textExtensions.has(path.extname(entry.name))) {
      files.push(relativePath);
    }
  }

  return files;
}

function lineNumberFor(text, index) {
  return text.slice(0, index).split("\n").length;
}

async function verifyPublicLanguage() {
  const files = [
    ...(await collectTextFiles("src")),
    ...(await collectTextFiles("public")),
  ];

  for (const file of files) {
    const source = await readFile(path.join(root, file), "utf8");
    const sourceForLanguageCheck =
      approvedLogoFiles.has(file)
        ? approvedLogoMentions.reduce(
            (current, approvedMention) => current.replaceAll(approvedMention, ""),
            approvedLogoAltAttributes.reduce(
              (current, approvedAlt) => current.replaceAll(approvedAlt, 'alt=""'),
              source,
            ),
          )
        : source;
    for (const [reason, pattern] of bannedPublicLanguage) {
      pattern.lastIndex = 0;
      for (const match of sourceForLanguageCheck.matchAll(pattern)) {
        errors.push(
          `${file}:${lineNumberFor(sourceForLanguageCheck, match.index)} contiene ${reason}: “${match[0]}”`,
        );
      }
    }
  }
}

async function readPngDimensions(relativePath) {
  const buffer = await readFile(path.join(root, relativePath));
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a" || buffer.length < 24) {
    throw new Error(`${relativePath} no es un PNG válido`);
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bytes: buffer.length,
  };
}

async function verifySocialCards() {
  const metadataFiles = [
    "src/app/layout.tsx",
    "src/app/nosotros/page.tsx",
    "src/app/prensa/page.tsx",
  ];
  const metadata = (
    await Promise.all(
      metadataFiles.map((file) => readFile(path.join(root, file), "utf8")),
    )
  ).join("\n");

  for (const asset of forbiddenPublicAssets) {
    if (await exists(asset)) {
      errors.push(`${asset} es una tarjeta social obsoleta y todavía es pública`);
    }
  }

  for (const card of requiredSocialCards) {
    if (!(await exists(card.png))) {
      errors.push(`${card.png} es obligatorio`);
      continue;
    }
    if (!(await exists(card.svg))) {
      errors.push(`${card.svg} es obligatorio como fuente editable`);
    }
    if (!metadata.includes(card.reference)) {
      errors.push(`${card.reference} no está referenciada en los metadatos`);
    }

    try {
      const dimensions = await readPngDimensions(card.png);
      if (dimensions.width !== 1200 || dimensions.height !== 630) {
        errors.push(
          `${card.png} mide ${dimensions.width}×${dimensions.height}; debe medir 1200×630`,
        );
      }
      if (dimensions.bytes > 300_000) {
        errors.push(`${card.png} supera el límite editorial de 300 KB`);
      }
    } catch (error) {
      errors.push(error.message);
    }
  }
}

function isValidIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
}

async function verifyPortfolio() {
  const relativePath = "src/content/home.ts";
  const source = await readFile(path.join(root, relativePath), "utf8");
  const portfolioSource = source.split("export const portfolio")[1]?.split("export const faq")[0];

  if (!portfolioSource) {
    errors.push(`${relativePath} no contiene un bloque de portafolio verificable`);
    return;
  }

  if (/\bstatus\s*:/.test(portfolioSource)) {
    errors.push(`${relativePath} usa “status”; separa etapa de producto y acceso`);
  }

  const entries = [...portfolioSource.matchAll(/\{\s*name:\s*"([^"]+)"[\s\S]*?\n\s*\},?/g)];
  const names = new Set();
  const maxAgeDays = Number(process.env.CONTENT_VERIFICATION_MAX_AGE_DAYS ?? 120);
  const now = Date.now();

  if (!Number.isFinite(maxAgeDays) || maxAgeDays <= 0) {
    errors.push("CONTENT_VERIFICATION_MAX_AGE_DAYS debe ser un número positivo");
  }
  if (entries.length === 0) {
    errors.push(`${relativePath} no contiene productos reconocibles`);
  }

  for (const match of entries) {
    const [entry, name] = match;
    if (names.has(name)) errors.push(`El producto “${name}” está duplicado`);
    names.add(name);

    if (!/\b(?:stage|access)\s*:/.test(entry)) {
      errors.push(`El producto “${name}” no declara etapa ni acceso`);
    }
    if (/href\s*:\s*"http:\/\//.test(entry)) {
      errors.push(`El producto “${name}” usa un enlace sin HTTPS`);
    }

    const verifiedAt = entry.match(/verifiedAt\s*:\s*"([^"]+)"/)?.[1];
    if (!verifiedAt) {
      errors.push(`El producto “${name}” no tiene verifiedAt`);
      continue;
    }
    if (!isValidIsoDate(verifiedAt)) {
      errors.push(`El producto “${name}” tiene una fecha inválida: ${verifiedAt}`);
      continue;
    }

    const ageDays = (now - new Date(`${verifiedAt}T00:00:00.000Z`).getTime()) / 86_400_000;
    if (ageDays > maxAgeDays) {
      errors.push(
        `El estado de “${name}” tiene ${Math.floor(ageDays)} días sin verificar (máximo ${maxAgeDays})`,
      );
    }
    if (ageDays < -2) {
      errors.push(`El producto “${name}” tiene verifiedAt en el futuro: ${verifiedAt}`);
    }
  }

  const laudos = entries.find(([, name]) => name === "Laudos")?.[0];
  if (!laudos || !/REDEK/.test(laudos)) {
    errors.push("Laudos debe conservar la atribución explícita a REDEK");
  }
}

async function verifySecurityConfiguration() {
  const relativePath = "next.config.ts";
  const source = await readFile(path.join(root, relativePath), "utf8");
  const requiredSignals = [
    "poweredByHeader: false",
    "Content-Security-Policy",
    "Cross-Origin-Opener-Policy",
    "Permissions-Policy",
    "Referrer-Policy",
    "X-Content-Type-Options",
    "X-Frame-Options",
  ];

  for (const signal of requiredSignals) {
    if (!source.includes(signal)) {
      errors.push(`${relativePath} no contiene la protección requerida: ${signal}`);
    }
  }
}

async function verifyBrandSystem() {
  const typographyPath = "src/app/tokens/typography.css";
  const colorsPath = "src/app/tokens/colors.css";
  const brandPagePath = "src/app/marca/page.tsx";
  const brandLayoutPath = "src/app/marca/layout.tsx";
  const [typography, colors, brandPage, brandLayout] = await Promise.all(
    [typographyPath, colorsPath, brandPagePath, brandLayoutPath].map((file) =>
      readFile(path.join(root, file), "utf8"),
    ),
  );

  if (/--font-(?:body|serif)\s*:/.test(typography)) {
    errors.push(
      `${typographyPath} no debe redefinir --font-body ni --font-serif; next/font las inyecta en <html>`,
    );
  }
  if (!/--gray-400:\s*#76716a/i.test(colors)) {
    errors.push(`${colorsPath} debe conservar el neutral gray-400 con contraste AA`);
  }
  if (!/--teal-on-soft:\s*#0b746c/i.test(colors)) {
    errors.push(`${colorsPath} debe conservar el teal accesible sobre fondos teal-soft`);
  }
  if (/Tri[aá]ngulo\s+ascendente|#8a8784/i.test(brandPage)) {
    errors.push(`${brandPagePath} contradice el símbolo o la paleta vigente`);
  }
  if (!/title:\s*\{\s*absolute:\s*"Sistema de marca — INPLUX"/.test(brandLayout)) {
    errors.push(`${brandLayoutPath} debe evitar duplicar el nombre INPLUX en el título`);
  }
  if (!/canonical:\s*"https:\/\/inplux\.co\/marca"/.test(brandLayout)) {
    errors.push(`${brandLayoutPath} debe declarar su canonical propio`);
  }
  if (!/index:\s*false/.test(brandLayout)) {
    errors.push(`${brandLayoutPath} debe permanecer fuera de los índices de búsqueda`);
  }
}

async function verifyLogoPermissions() {
  const legacyLogoDirectory = "public/logos";
  if (await exists(legacyLogoDirectory)) {
    const entries = await readdir(path.join(root, legacyLogoDirectory));
    if (entries.length > 0) {
      errors.push(
        `${legacyLogoDirectory} expone ${entries.length} logos de terceros sin un permiso publicable registrado`,
      );
    }
  }
}

async function verifyContactExperience() {
  const files = {
    home: "src/app/page.tsx",
    englishHome: "src/app/en/page.tsx",
    about: "src/app/nosotros/page.tsx",
    contact: "src/app/contacto/page.tsx",
    header: "src/components/site/SiteHeader.tsx",
    dialog: "src/components/site/ContactDialog.tsx",
    link: "src/components/site/ContactLink.tsx",
    form: "src/components/site/ContactForm.tsx",
  };
  const entries = await Promise.all(
    Object.entries(files).map(async ([key, file]) => [
      key,
      await readFile(path.join(root, file), "utf8"),
    ]),
  );
  const source = Object.fromEntries(entries);
  const triggerSurface = `${source.home}\n${source.englishHome}\n${source.about}`;
  const expectedSources = [
    "home-hero",
    "home-offer",
    "en-home-hero",
    "en-home-offer",
    "about-closing",
  ];

  for (const contactSource of expectedSources) {
    const count = triggerSurface.split(`source="${contactSource}"`).length - 1;
    if (count !== 1) {
      errors.push(
        `La experiencia de contacto debe declarar una vez source="${contactSource}"; encontró ${count}`,
      );
    }
  }

  // El header sirve a las dos rutas: recibe el origen por prop y conserva un
  // valor por defecto para cada disparador.
  for (const [prop, defaultSource] of [
    ["desktopContactSource", "header-desktop"],
    ["mobileContactSource", "header-mobile"],
  ]) {
    if (!source.header.includes(`${prop} = "${defaultSource}"`)) {
      errors.push(
        `SiteHeader debe conservar el origen por defecto ${prop} = "${defaultSource}"`,
      );
    }
    if (source.header.split(`source={${prop}}`).length - 1 !== 1) {
      errors.push(`SiteHeader debe usar una vez source={${prop}}`);
    }
  }
  // La ruta española usa los valores por defecto; la inglesa debe declarar los
  // suyos para que los disparadores del header no se confundan entre idiomas.
  for (const contactSource of ["en-header-desktop", "en-header-mobile"]) {
    if (!source.englishHome.includes(`"${contactSource}"`)) {
      errors.push(
        `La HOME en inglés debe declarar el origen "${contactSource}" del header`,
      );
    }
  }

  const requirements = [
    [
      source.home.includes('id="contacto"') &&
        source.home.includes('href="mailto:gerencia@inplux.co"'),
      "HOME debe conservar #contacto y un contacto directo como fallback progresivo",
    ],
    [
      source.englishHome.includes('id="contacto"') &&
        source.englishHome.includes('href="mailto:gerencia@inplux.co"'),
      "La HOME en inglés debe conservar #contacto y un contacto directo como fallback progresivo",
    ],
    [
      source.home.split('fallbackHref="#contacto"').length - 1 === 2 &&
        source.englishHome.split('fallbackHref="#contacto"').length - 1 === 2,
      "Los dos CTA de cada HOME deben conservar fallbackHref=\"#contacto\"",
    ],
    [
      source.about.split('fallbackHref="/contacto"').length - 1 === 1 &&
        source.header.includes('const headerContactHref = "/contacto"') &&
        source.header.split("fallbackHref={headerContactHref}").length - 1 === 2,
      "Header y Nosotros deben conservar la ruta estable /contacto como fallback",
    ],
    [
      source.home.includes("<ContactDialogProvider>") &&
        source.about.includes("<ContactDialogProvider>") &&
        source.contact.includes("<ContactDialogProvider>"),
      "HOME, Nosotros y Contacto deben compartir el proveedor del diálogo de contacto",
    ],
    [
      /<ContactDialogProvider[\s>]/.test(source.englishHome),
      "La HOME en inglés debe montar el proveedor del diálogo de contacto",
    ],
    [
      source.contact.includes('<ContactForm context="section"') &&
        source.contact.includes('href="mailto:gerencia@inplux.co"'),
      "Contacto debe conservar el formulario progresivo y un canal de correo directo",
    ],
    [
      source.dialog.includes("<dialog") &&
        source.dialog.includes("dialog.showModal()") &&
        source.dialog.includes('aria-labelledby="site-contact-dialog-title"') &&
        source.dialog.includes("onClose={finishClose}"),
      "El contacto debe usar un dialog nativo con título y cleanup de cierre",
    ],
    [
      source.link.includes('aria-haspopup="dialog"') &&
        source.link.includes("event.metaKey") &&
        source.link.includes("event.button !== 0"),
      "ContactLink debe conservar clics modificados y anunciar el diálogo",
    ],
    [
      !/(?:fetch\s*\(|localStorage|window\.open\s*\()/.test(
        `${source.dialog}\n${source.link}\n${source.form}`,
      ),
      "Contacto no debe transmitir, persistir ni abrir ventanas fuera del mailto explícito",
    ],
  ];

  for (const [passes, message] of requirements) {
    if (!passes) errors.push(message);
  }
}

async function verifyLegacyFragments() {
  const relativePath = "src/app/page.tsx";
  const source = await readFile(path.join(root, relativePath), "utf8");
  const fragments = [
    "main-content",
    "inicio",
    "servicios",
    "motor",
    "publico",
    "privado",
    "empresas",
    "contacto",
  ];

  for (const fragment of fragments) {
    const occurrences = source.split(`id="${fragment}"`).length - 1;
    if (occurrences !== 1) {
      errors.push(
        `${relativePath} debe preservar una vez el fragmento histórico #${fragment}; encontró ${occurrences}`,
      );
    }
  }
}

await verifyPublicLanguage();
await verifySocialCards();
await verifyPortfolio();
await verifySecurityConfiguration();
await verifyBrandSystem();
await verifyLogoPermissions();
await verifyContactExperience();
await verifyLegacyFragments();

if (errors.length > 0) {
  console.error(`\nControl editorial falló con ${errors.length} problema(s):\n`);
  for (const error of errors.sort()) console.error(`- ${error}`);
  console.error("");
  process.exitCode = 1;
} else {
  console.log(
    "Control editorial aprobado: copy, portafolio, contacto, migración, logos, OG y seguridad.",
  );
}

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

/**
 * Lector de fuente compartido por los dos controles que vigilan contenido
 * escrito a mano: `verifyAboutAttribution()` y `verifyProductNavigation()`.
 *
 * Nace de un falso verde. La regla `copy:\s*"…"` casaba el **primer** literal y
 * lo trataba como si fuera el valor entero, sin mirar si venía seguido de un
 * `+`. Con
 *
 *     copy:
 *       "REDEK aporta el criterio legal en Laudos. … son desarrollos " +
 *       "propios de INPLUX, sin más matices, …",
 *
 * el DOM publicaba «desarrollos propios» partido justo en la frontera de la
 * concatenación y el control aprobaba la mitad que había leído. Las listas del
 * pie tenían la misma clase de agujero por el otro lado: un ítem que el
 * formateador parte en varias líneas no casa `\["…",\s*"…"\]`, así que
 * desaparecía de la verificación sin ruido —un enlace a `/trabajo/sherlock`,
 * que es un 404, viajó entero hasta el HTML construido con el build en verde—.
 *
 * La regla que imponen estas funciones es una sola: **lo que no se sabe leer
 * entero se denuncia; nunca se lee a medias**. Un control que aprueba lo que no
 * llegó a mirar es peor que no tenerlo.
 */
function skipTrivia(source, index) {
  let cursor = index;
  while (cursor < source.length) {
    const char = source[cursor];
    if (char === " " || char === "\t" || char === "\n" || char === "\r") {
      cursor += 1;
      continue;
    }
    if (source.startsWith("//", cursor)) {
      const lineEnd = source.indexOf("\n", cursor);
      cursor = lineEnd === -1 ? source.length : lineEnd + 1;
      continue;
    }
    if (source.startsWith("/*", cursor)) {
      const blockEnd = source.indexOf("*/", cursor + 2);
      cursor = blockEnd === -1 ? source.length : blockEnd + 2;
      continue;
    }
    return cursor;
  }
  return cursor;
}

function decodeStringLiteral(raw, quote) {
  if (quote === '"') {
    try {
      return JSON.parse(`"${raw}"`);
    } catch {
      // Escapes que JSON no admite (`\'`); sigue el decodificador manual.
    }
  }
  return raw.replace(
    /\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|[\s\S])/gu,
    (_whole, escape) => {
      if (escape[0] === "u" || escape[0] === "x") {
        return String.fromCharCode(Number.parseInt(escape.slice(1), 16));
      }
      return { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", v: "\v" }[escape] ?? escape;
    },
  );
}

function readStringLiteral(source, index) {
  const quote = source[index];
  if (quote !== '"' && quote !== "'" && quote !== "`") return null;

  let cursor = index + 1;
  let raw = "";
  while (cursor < source.length && source[cursor] !== quote) {
    if (source[cursor] === "\\") {
      raw += source.slice(cursor, cursor + 2);
      cursor += 2;
      continue;
    }
    raw += source[cursor];
    cursor += 1;
  }
  if (cursor >= source.length) return null;
  // Una plantilla se lee como opaca: sirve para equilibrar corchetes, nunca
  // como texto publicado —quien la quiera publicar recibirá un error.
  return {
    value: quote === "`" ? null : decodeStringLiteral(raw, quote),
    end: cursor + 1,
  };
}

/** Devuelve el interior del par equilibrado que abre en el primer `open`. */
function readBracketed(source, index, open, close) {
  const start = source.indexOf(open, index);
  if (start === -1) return null;

  let depth = 0;
  let cursor = start;
  while (cursor < source.length) {
    const afterTrivia = skipTrivia(source, cursor);
    if (afterTrivia !== cursor) {
      cursor = afterTrivia;
      continue;
    }
    const literal = readStringLiteral(source, cursor);
    if (literal) {
      cursor = literal.end;
      continue;
    }
    const char = source[cursor];
    if (char === open) depth += 1;
    else if (char === close) {
      depth -= 1;
      if (depth === 0) return { inner: source.slice(start + 1, cursor), end: cursor + 1 };
    }
    cursor += 1;
  }
  return null;
}

/** Parte una lista por sus comas de primer nivel, sin romper cadenas ni anidados. */
function splitTopLevelItems(inner) {
  const items = [];
  let depth = 0;
  let itemStart = 0;
  let cursor = 0;

  while (cursor < inner.length) {
    const afterTrivia = skipTrivia(inner, cursor);
    if (afterTrivia !== cursor) {
      cursor = afterTrivia;
      continue;
    }
    const literal = readStringLiteral(inner, cursor);
    if (literal) {
      cursor = literal.end;
      continue;
    }
    const char = inner[cursor];
    if (char === "(" || char === "[" || char === "{") depth += 1;
    else if (char === ")" || char === "]" || char === "}") depth -= 1;
    else if (char === "," && depth === 0) {
      items.push(inner.slice(itemStart, cursor));
      itemStart = cursor + 1;
    }
    cursor += 1;
  }
  items.push(inner.slice(itemStart));

  return items
    .map((item) => withoutComments(item).trim())
    .filter((item) => item.length > 0);
}

function withoutComments(source) {
  let output = "";
  let cursor = 0;

  while (cursor < source.length) {
    const literal = readStringLiteral(source, cursor);
    if (literal) {
      output += source.slice(cursor, literal.end);
      cursor = literal.end;
      continue;
    }
    if (source.startsWith("//", cursor)) {
      const lineEnd = source.indexOf("\n", cursor);
      cursor = lineEnd === -1 ? source.length : lineEnd;
      continue;
    }
    if (source.startsWith("/*", cursor)) {
      const blockEnd = source.indexOf("*/", cursor + 2);
      cursor = blockEnd === -1 ? source.length : blockEnd + 2;
      continue;
    }
    output += source[cursor];
    cursor += 1;
  }

  return output;
}

/** Una cita corta y en una línea del fragmento ilegible, para el mensaje de error. */
function quoteForMessage(fragment) {
  const flat = fragment.replace(/\s+/gu, " ").trim();
  return flat.length > 70 ? `${flat.slice(0, 67)}…` : flat;
}

/** Toda cadena publicada del fragmento, con sus concatenaciones ya unidas. */
function readPublishedFragments(scope) {
  const fragments = [];
  let cursor = 0;

  while (cursor < scope.length) {
    const literal = readStringLiteral(scope, cursor);
    if (!literal) {
      cursor += 1;
      continue;
    }
    if (literal.value === null) {
      cursor = literal.end;
      continue;
    }

    const parts = [literal.value];
    let end = literal.end;
    for (;;) {
      const afterValue = skipTrivia(scope, end);
      if (scope[afterValue] !== "+") break;
      const next = readStringLiteral(scope, skipTrivia(scope, afterValue + 1));
      if (!next || next.value === null) break;
      parts.push(next.value);
      end = next.end;
    }

    fragments.push(parts.join(""));
    cursor = end;
  }

  return fragments;
}

/**
 * Lee el texto que un campo publica en el DOM, uniendo los literales que estén
 * concatenados con `+`. Devuelve `{ value }` o `{ error }`: no hay tercer caso,
 * y en particular no hay «leí un trozo y sigo».
 */
function readPublishedString(scope, field) {
  const keyMatch = scope.match(new RegExp(`[{,]\\s*${field}\\s*:`, "u"));
  if (!keyMatch) return { error: `no declara un campo ${field}:` };

  let cursor = keyMatch.index + keyMatch[0].length;
  const parts = [];

  for (;;) {
    cursor = skipTrivia(scope, cursor);
    const literal = readStringLiteral(scope, cursor);
    if (!literal || literal.value === null) {
      return {
        error:
          scope[cursor] === "`"
            ? `escribe ${field}: como plantilla, y este control solo sabe leer literales de texto`
            : `escribe ${field}: con un valor que no es un literal de texto`,
      };
    }
    parts.push(literal.value);

    cursor = skipTrivia(scope, literal.end);
    if (scope[cursor] === "+") {
      cursor += 1;
      continue;
    }
    if (scope[cursor] === "," || scope[cursor] === "}") return { value: parts.join("") };
    return {
      error: `combina ${field}: con algo que este control no sabe resolver en tiempo de build`,
    };
  }
}

/**
 * El capítulo «evidencia» de `/nosotros` es la única prosa del sitio que
 * resume de una vez la autoría de todos los productos, y por eso es donde el
 * crédito de un aliado se pierde sin que nada se rompa.
 *
 * `work.ts` reparte Laudos entre INPLUX («Desarrollo técnico de INPLUX») y
 * REDEK («Criterio legal»), y `home.ts` lo llama «cocreada con REDEK» —eso ya
 * lo vigila `verifyPortfolio()`—. Este control extiende la misma protección a
 * la ruta que cuenta quiénes somos: ya ocurrió una vez que esa prosa pasara a
 * hablar de «desarrollos propios» en bloque, borrando a REDEK de toda la ruta
 * sin que el build lo notara.
 */
async function verifyAboutAttribution() {
  const relativePath = "src/components/about/HistoryScrolly.client.tsx";
  const source = await readFile(path.join(root, relativePath), "utf8");
  const openMarker = 'id: "evidencia"';
  const closeMarker = 'id: "direccion"';

  // `indexOf` y no `split`: si el delimitador de cierre desaparece, `split`
  // devuelve el resto del archivo y el control ensancha su alcance en silencio
  // —bastaba renombrar el capítulo siguiente para que un «REDEK» suelto en
  // cualquier punto posterior lo satisficiera—. Con `indexOf`, su ausencia es
  // un error ruidoso.
  const start = source.indexOf(openMarker);
  const end = start === -1 ? -1 : source.indexOf(closeMarker, start + openMarker.length);

  if (start === -1) {
    errors.push(`${relativePath} no contiene el capítulo ${openMarker}`);
    return;
  }
  if (end === -1) {
    errors.push(
      `${relativePath}: falta el delimitador de cierre ${closeMarker} después de ${openMarker}; sin él este control no puede acotar el capítulo`,
    );
    return;
  }

  // Los comentarios se van antes de buscar nada: así un `// … REDEK …` no
  // puede acreditar a nadie por accidente, y un comentario encima de `copy:`
  // tampoco esconde el campo del lector.
  const chapter = withoutComments(source.slice(start, end));

  // Solo las cadenas que llegan al DOM, y **enteras**. Un comentario con la
  // palabra REDEK no acredita nada: el crédito tiene que estar en la prosa
  // publicada, y un comentario no puede vivir dentro de una cadena. Leer el
  // valor completo —y no el primer literal que aparezca— es lo que impide la
  // otra mitad del engaño: un `copy` partido con `+` publica la unión de sus
  // trozos, así que la unión es lo que hay que juzgar.
  const published = new Map();
  for (const field of ["copy", "evidence"]) {
    const result = readPublishedString(chapter, field);
    if (result.error) {
      errors.push(
        `${relativePath}: el capítulo «evidencia» ${result.error}; este control no puede verificar la prosa publicada`,
      );
      continue;
    }
    published.set(field, result.value);
  }

  const publishedCopy = published.get("copy");
  if (publishedCopy !== undefined && !/REDEK/.test(publishedCopy)) {
    errors.push(
      `${relativePath} debe nombrar a REDEK en el copy publicado del capítulo «evidencia», no solo en un comentario`,
    );
  }
  const bannedFraming = /desarrollos\s+propios/iu;
  for (const [field, value] of published) {
    if (bannedFraming.test(value)) {
      errors.push(
        `${relativePath}: el ${field} del capítulo «evidencia» no puede llamar «desarrollos propios» al conjunto; Laudos reparte el crédito con REDEK`,
      );
    }
  }

  // El capítulo publica más prosa que esos dos campos —el título es un <h3> de
  // la página, y también están el gancho y la etiqueta del enlace—. La
  // prohibición cubre todo lo que llega al DOM, no solo los dos campos que tocó
  // el incidente: un titular que diga «desarrollos propios» contradice a
  // `work.ts` exactamente igual que el párrafo.
  const alreadyJudged = new Set(published.values());
  for (const fragment of readPublishedFragments(chapter)) {
    if (alreadyJudged.has(fragment) || !bannedFraming.test(fragment)) continue;
    errors.push(
      `${relativePath}: el capítulo «evidencia» publica «${quoteForMessage(fragment)}»; no puede llamar «desarrollos propios» al conjunto, porque Laudos reparte el crédito con REDEK`,
    );
  }
}

/**
 * El pie de página y `work.ts` no pueden divergir.
 *
 * `productNavigation` (`src/content/navigation.ts`) y el grupo «Products» de la
 * HOME inglesa están escritos a mano, y con razón: derivarlos de `workProfiles`
 * mete los cinco perfiles enteros en el bundle cliente (+33.387 bytes medidos),
 * porque `src/content/copy/es.ts` lo consumen media docena de componentes
 * cliente. El precio de escribirlos a mano es que se desincronizan en silencio:
 * Porkia se dio de alta como quinto producto y nunca llegó a ninguno de los dos
 * pies, en todas las rutas del sitio, sin que nada se rompiera.
 *
 * Este control paga ese precio. Exige biyección entre los perfiles de `work.ts`
 * y cada lista del pie: falta uno y falla; sobra uno que no es perfil y falla;
 * el `href` o la etiqueta no coinciden con el `slug` y el `name` del perfil y
 * falla. El sexto producto rompe el build en vez de desaparecer del pie.
 *
 * Las tres listas se leen con el lector de arriba y no con expresiones
 * regulares sueltas, porque las regulares fallaban en silencio por los dos
 * lados: un comentario entre `kind:` y `slug:` borraba un perfil entero de la
 * comprobación —y con él la obligación de que estuviera en los dos pies—, y un
 * ítem del pie partido en varias líneas dejaba de existir para el control
 * aunque el navegador lo publicara. Ahora la lista se acota con corchetes
 * equilibrados y **cada** ítem tiene que tener la forma esperada: el que no la
 * tenga se nombra en el error, en vez de saltárselo.
 */
function readWorkProfiles(source, file) {
  const anchor = "export const workProfiles";
  const anchorIndex = source.indexOf(anchor);
  if (anchorIndex === -1) {
    errors.push(`${file}: no se pudo leer ${anchor}`);
    return null;
  }

  const list = readBracketed(source, anchorIndex + anchor.length, "[", "]");
  if (!list) {
    errors.push(`${file}: la lista de workProfiles no cierra; este control no puede acotarla`);
    return null;
  }

  const profiles = [];
  for (const item of splitTopLevelItems(list.inner)) {
    const object = item.startsWith("{") ? readBracketed(item, 0, "{", "}") : null;
    if (!object) {
      errors.push(
        `${file}: workProfiles tiene un elemento que este control no sabe leer: «${quoteForMessage(item)}»`,
      );
      return null;
    }

    const fields = new Map();
    for (const property of splitTopLevelItems(object.inner)) {
      const named = property.match(/^([A-Za-z_$][\w$]*)\s*:\s*([\s\S]*)$/u);
      if (named) fields.set(named[1], named[2].trim());
    }

    const literalOf = (key) => fields.get(key)?.match(/^"([^"]*)"$/u)?.[1];
    const kind = literalOf("kind");
    if (kind === undefined) {
      errors.push(
        `${file}: un elemento de workProfiles no declara un kind legible; este control no puede saber si es un producto publicado`,
      );
      return null;
    }
    if (kind !== "product-profile") continue;

    const slug = literalOf("slug");
    const name = literalOf("name");
    if (!slug || !name) {
      errors.push(
        `${file}: un perfil de producto no expone slug y name legibles en su primer nivel`,
      );
      return null;
    }
    profiles.push({ slug, name });
  }

  if (profiles.length === 0) {
    errors.push(`${file} no contiene perfiles de producto reconocibles`);
    return null;
  }
  return profiles;
}

function readFooterEntries({ source, file, label, anchor, shape }) {
  const anchorIndex = source.indexOf(anchor);
  if (anchorIndex === -1) {
    errors.push(`${file}: no se pudo leer ${label}; falta ${anchor}`);
    return null;
  }

  const list = readBracketed(source, anchorIndex + anchor.length, "[", "]");
  if (!list) {
    errors.push(`${file}: no se pudo leer ${label}; su lista no cierra`);
    return null;
  }

  const items = splitTopLevelItems(list.inner);
  if (items.length === 0) {
    errors.push(`${file}: ${label} no lista ningún producto`);
    return null;
  }

  const entries = [];
  let unreadable = false;
  for (const item of items) {
    const match = item.match(shape);
    if (!match) {
      errors.push(
        `${file}: ${label} tiene una entrada que este control no sabe leer: «${quoteForMessage(item)}»; escríbela con la forma que espera el control o nadie verificará a dónde apunta`,
      );
      unreadable = true;
      continue;
    }
    entries.push({ name: match[1], href: match[2] });
  }

  return unreadable ? null : entries;
}

async function verifyProductNavigation() {
  const workPath = "src/content/work.ts";
  const navigationPath = "src/content/navigation.ts";
  const englishPath = "src/content/copy/en.ts";
  const [work, navigation, english] = await Promise.all(
    [workPath, navigationPath, englishPath].map((file) =>
      readFile(path.join(root, file), "utf8"),
    ),
  );

  const profiles = readWorkProfiles(work, workPath);
  if (!profiles) return;

  const surfaces = [
    {
      file: navigationPath,
      label: "el pie español (productNavigation)",
      entries: readFooterEntries({
        source: navigation,
        file: navigationPath,
        label: "el pie español (productNavigation)",
        anchor: "export const productNavigation",
        shape: /^\[\s*"([^"]*)"\s*,\s*"([^"]*)"\s*,?\s*\]$/u,
      }),
    },
    {
      file: englishPath,
      label: 'el pie inglés (grupo "Products")',
      entries: readFooterEntries({
        source: english,
        file: englishPath,
        label: 'el pie inglés (grupo "Products")',
        anchor: 'label: "Products"',
        shape: /^spanishRoute\(\s*"([^"]*)"\s*,\s*"([^"]*)"\s*,?\s*\)$/u,
      }),
    },
  ];

  for (const surface of surfaces) {
    if (!surface.entries) continue;

    for (const profile of profiles) {
      const expectedHref = `/trabajo/${profile.slug}`;
      const entry = surface.entries.find((item) => item.href === expectedHref);
      if (!entry) {
        errors.push(
          `${surface.file}: ${surface.label} no lista el producto “${profile.name}” (falta ${expectedHref}); work.ts lo publica`,
        );
      } else if (entry.name !== profile.name) {
        errors.push(
          `${surface.file}: ${surface.label} llama “${entry.name}” a ${expectedHref}; work.ts lo llama “${profile.name}”`,
        );
      }
    }

    for (const entry of surface.entries) {
      if (!profiles.some((profile) => `/trabajo/${profile.slug}` === entry.href)) {
        errors.push(
          `${surface.file}: ${surface.label} lista “${entry.name}” (${entry.href}) y work.ts no publica ese perfil`,
        );
      }
    }
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
await verifyAboutAttribution();
await verifyProductNavigation();
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

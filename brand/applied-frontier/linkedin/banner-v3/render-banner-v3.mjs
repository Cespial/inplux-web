/* ============================================================================
   INPLUX — Applied Frontier — exportador v3

   Un solo comando reconstruye los dos masters, las pruebas y QA.json:

     node brand/applied-frontier/linkedin/banner-v3/render-banner-v3.mjs

   El exportador DETIENE la ejecución si:
     · las fuentes empaquetadas no cargan;
     · un nodo de texto entra en la zona del avatar, en la del botón de editar
       o se sale del carril de contenido (perfil);
     · un nodo de texto se sale de la zona esencial (Página);
     · la traza primaria rompe el módulo 42:13 o el paso canónico +21/−18;
     · hay más o menos de un evento teal en la pieza;
     · la portada contiene texturas raster externas;
     · el lienzo cambia, falta el perfil ICC o un archivo supera su tope.
   ========================================================================== */

import { chromium } from "playwright";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, basename } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const url = (file) => pathToFileURL(join(here, file)).href;
const out = (file) => join(here, file);

/* --- Contratos ----------------------------------------------------------- */

const LIMIT_BYTES = 3 * 1024 * 1024; // tope conservador: sirve a Perfil y a Página

/* Geometría real de la interfaz de LinkedIn, medida sobre una captura de
   1300×808 en la que la portada ocupa 1266×315 y el anillo blanco del avatar
   va de x 52 a 307 con el borde superior en y 181. Reescalado a 1584×396. */
const PROFILE = {
  canvas: { width: 1584, height: 396 },
  rail: { x: 432, y: 40, right: 1544, bottom: 372 },
  avatar: { cx: 207, cy: 365, r: 160, clearance: 186 },
  editButton: { x: 1450, y: 0, right: 1572, bottom: 152 },
  trace: { moduleWidth: 84, moduleHeight: 26, stepX: 42, stepY: -36 },
};

const COMPANY = {
  canvas: { width: 4200, height: 700 },
  safeArea: { x: 900, y: 120, right: 3300, bottom: 580 },
  trace: { moduleWidth: 126, moduleHeight: 39, stepX: 63, stepY: -54 },
};

/* Dos contratos distintos, porque el papel del texto es distinto.

   ESENCIAL   es la lectura que la pieza no puede perder: identificación,
              idea y descriptor. Vive dentro de la zona segura, pase lo que
              pase con el recorte.
   PRESCINDIBLE es el remate de campo. Está en un extremo a propósito y puede
              desaparecer en una reducción o un recorte agresivo sin afectar
              la comprensión. Sólo se le exige no invadir la interfaz. */
const ESSENTIAL_NODES = [".system-label", ".title", ".descriptor"];
const EXPENDABLE_NODES = [".endmark"];
const TEXT_NODES = [...ESSENTIAL_NODES, ...EXPENDABLE_NODES];

const COMPANY_EDGE_MARGIN = 60;
/* El logo de Página se superpone al ángulo inferior izquierdo de la portada. */
const COMPANY_LOGO_ZONE = { x: 0, y: 380, right: 900, bottom: 700 };

/* --- Geometría ----------------------------------------------------------- */

const rectHitsCircle = (rect, { cx, cy, clearance }) => {
  const nx = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
  const ny = Math.max(rect.y, Math.min(cy, rect.y + rect.height));
  return Math.hypot(cx - nx, cy - ny) < clearance;
};

const rectsOverlap = (a, b) =>
  a.x < b.right && a.x + a.width > b.x && a.y < b.bottom && a.y + a.height > b.y;

/* --- Sondas dentro de la página ------------------------------------------ */

const readTextBounds = (page) =>
  page.evaluate((selectors) => {
    const found = {};
    for (const selector of selectors) {
      const node = document.querySelector(selector);
      if (!node) continue;
      const r = node.getBoundingClientRect();
      found[selector] = { x: r.x, y: r.y, width: r.width, height: r.height };
    }
    return found;
  }, TEXT_NODES);

const readConstruction = (page) =>
  page.evaluate(() => {
    const trace = document.querySelector("#primary-trace");
    const modules = [...trace.querySelectorAll(".trace-module")].map((node) => ({
      x: Number(node.getAttribute("x")),
      y: Number(node.getAttribute("y")),
      width: Number(node.getAttribute("width")),
      height: Number(node.getAttribute("height")),
      rx: Number(node.getAttribute("rx")),
      fill: node.getAttribute("fill").toUpperCase(),
      blur: node.getAttribute("filter") ?? "none",
    }));
    return {
      declared: {
        moduleWidth: Number(trace.dataset.moduleWidth),
        moduleHeight: Number(trace.dataset.moduleHeight),
        stepX: Number(trace.dataset.stepX),
        stepY: Number(trace.dataset.stepY),
      },
      modules,
      signalEvents: document.querySelectorAll('.cover [fill="#00D7CA"]').length,
      rasterImagesInCover: document.querySelectorAll(".cover img").length,
      focusPullStates: new Set(
        [...document.querySelectorAll(".trace-module")].map((n) => n.getAttribute("filter") ?? "none"),
      ).size,
    };
  });

const assertConstruction = (construction, contract, label) => {
  const { declared, modules } = construction;

  if (modules.length !== 7) {
    throw new Error(`${label}: la traza primaria debe tener siete estados, encontrados ${modules.length}`);
  }

  for (const [key, expected] of Object.entries(contract)) {
    if (declared[key] !== expected) {
      throw new Error(`${label}: la traza declara ${key}=${declared[key]}, el contrato exige ${expected}`);
    }
  }

  if (Math.abs(declared.moduleWidth / declared.moduleHeight - 42 / 13) > 1e-9) {
    throw new Error(`${label}: el módulo se aparta de la geometría canónica 42:13`);
  }

  if (Math.abs(declared.stepX / -declared.stepY - 21 / 18) > 1e-9) {
    throw new Error(`${label}: el paso se aparta del canónico +21/−18`);
  }

  modules.forEach((module, index) => {
    if (
      module.width !== declared.moduleWidth ||
      module.height !== declared.moduleHeight ||
      Math.abs(module.rx - declared.moduleHeight / 2) > 1e-9
    ) {
      throw new Error(`${label}: el estado ${index} rompe la cápsula declarada`);
    }
    if (index === 0) return;
    const previous = modules[index - 1];
    if (module.x - previous.x !== declared.stepX || module.y - previous.y !== declared.stepY) {
      throw new Error(`${label}: el estado ${index} rompe el paso declarado`);
    }
  });

  const tealModules = modules.filter((m) => m.fill === "#00D7CA").length;
  if (tealModules !== 1 || construction.signalEvents !== 1) {
    throw new Error(
      `${label}: la pieza debe tener exactamente un evento teal ` +
        `(módulos teal: ${tealModules}, eventos en la portada: ${construction.signalEvents})`,
    );
  }

  if (modules.at(-1).fill !== "#00D7CA" || modules.at(-1).blur !== "none") {
    throw new Error(`${label}: el líder debe ser el estado teal y quedar perfectamente nítido`);
  }

  if (construction.focusPullStates !== 7) {
    throw new Error(
      `${label}: la caída de foco debe dar un estado distinto por cápsula, hay ${construction.focusPullStates}`,
    );
  }

  if (construction.rasterImagesInCover !== 0) {
    throw new Error(`${label}: la portada no puede contener texturas raster externas`);
  }
};

const assertProfileText = (bounds) => {
  for (const [selector, rect] of Object.entries(bounds)) {
    const right = rect.x + rect.width;
    const bottom = rect.y + rect.height;

    if (rect.x < PROFILE.rail.x || right > PROFILE.rail.right) {
      throw new Error(`Perfil · ${selector} se sale del carril en horizontal: ${JSON.stringify(rect)}`);
    }
    if (rect.y < PROFILE.rail.y || bottom > PROFILE.rail.bottom) {
      throw new Error(`Perfil · ${selector} se sale del carril en vertical: ${JSON.stringify(rect)}`);
    }
    if (rectHitsCircle(rect, PROFILE.avatar)) {
      throw new Error(`Perfil · ${selector} choca con la foto de perfil: ${JSON.stringify(rect)}`);
    }
    if (rectsOverlap(rect, PROFILE.editButton)) {
      throw new Error(`Perfil · ${selector} choca con el botón de editar: ${JSON.stringify(rect)}`);
    }
  }
};

const assertCompanyText = (bounds) => {
  for (const selector of ESSENTIAL_NODES) {
    const rect = bounds[selector];
    if (!rect) throw new Error(`Página · falta el nodo esencial ${selector}`);
    const right = rect.x + rect.width;
    const bottom = rect.y + rect.height;
    if (
      rect.x < COMPANY.safeArea.x ||
      right > COMPANY.safeArea.right ||
      rect.y < COMPANY.safeArea.y ||
      bottom > COMPANY.safeArea.bottom
    ) {
      throw new Error(`Página · ${selector} se sale de la zona esencial: ${JSON.stringify(rect)}`);
    }
  }

  for (const selector of EXPENDABLE_NODES) {
    const rect = bounds[selector];
    if (!rect) continue;
    const right = rect.x + rect.width;
    const bottom = rect.y + rect.height;
    if (
      rect.x < COMPANY_EDGE_MARGIN ||
      right > COMPANY.canvas.width - COMPANY_EDGE_MARGIN ||
      rect.y < COMPANY_EDGE_MARGIN ||
      bottom > COMPANY.canvas.height - COMPANY_EDGE_MARGIN
    ) {
      throw new Error(`Página · ${selector} se sale del margen del lienzo: ${JSON.stringify(rect)}`);
    }
    if (rectsOverlap(rect, COMPANY_LOGO_ZONE)) {
      throw new Error(`Página · ${selector} choca con el logo de Página: ${JSON.stringify(rect)}`);
    }
  }
};

/* --- Render -------------------------------------------------------------- */

const browser = await chromium.launch({ headless: true });
const qa = { generatedAt: new Date().toISOString(), masters: {}, proofs: {}, checks: {} };

const openMaster = async (file, { width, height }, deviceScaleFactor = 1) => {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor });
  await page.goto(url(file), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const fonts = await page.evaluate(() => ({
    geist: document.fonts.check('16px "Geist INPLUX"'),
    geistMono: document.fonts.check('16px "Geist Mono INPLUX"'),
  }));
  if (!fonts.geist || !fonts.geistMono) {
    throw new Error(`${file}: las fuentes empaquetadas no cargaron: ${JSON.stringify(fonts)}`);
  }
  return { page, fonts };
};

const writePng = (buffer, file, extra = (p) => p) =>
  extra(sharp(buffer))
    .withIccProfile("srgb")
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
    .withMetadata({ density: 72 })
    .toFile(out(file));

const writeJpg = (buffer, file) =>
  sharp(buffer)
    .flatten({ background: "#0C0C0B" })
    .withIccProfile("srgb")
    .jpeg({ quality: 93, chromaSubsampling: "4:4:4", mozjpeg: true })
    .withMetadata({ density: 72 })
    .toFile(out(file));

try {
  /* ---------- Master A · perfil personal ---------------------------------- */

  const profileSrc = "inplux-linkedin-profile-cover-v3-1584x396.html";
  const { page: profile, fonts: profileFonts } = await openMaster(profileSrc, PROFILE.canvas);

  const profileBounds = await readTextBounds(profile);
  const profileConstruction = await readConstruction(profile);
  assertProfileText(profileBounds);
  assertConstruction(profileConstruction, PROFILE.trace, "Perfil");

  const profileRaw = await profile.screenshot({ type: "png" });
  await writePng(profileRaw, "inplux-linkedin-profile-cover-v3-1584x396.png");
  await writeJpg(profileRaw, "inplux-linkedin-profile-cover-v3-1584x396.jpg");

  await profile.evaluate(() => document.body.classList.add("proof"));
  await writePng(await profile.screenshot({ type: "png" }), "proofs/proof-profile-safe-area.png");
  await profile.close();

  /* Master retina 2×: el grano se genera de nuevo a esa densidad en vez de
     interpolarse, así que el dither sigue siendo válido tras la recompresión. */
  const { page: profile2x } = await openMaster(profileSrc, PROFILE.canvas, 2);
  await writePng(await profile2x.screenshot({ type: "png" }), "inplux-linkedin-profile-cover-v3-3168x792.png");
  await profile2x.close();

  qa.masters.profile = {
    source: profileSrc,
    canvas: `${PROFILE.canvas.width}×${PROFILE.canvas.height}`,
    ratio: "4:1",
    fonts: profileFonts,
    guards: { rail: PROFILE.rail, avatar: PROFILE.avatar, editButton: PROFILE.editButton },
    textBounds: profileBounds,
    construction: profileConstruction,
  };

  /* ---------- Master B · Página de empresa -------------------------------- */

  const companySrc = "inplux-linkedin-company-cover-v3-4200x700.html";
  const { page: company, fonts: companyFonts } = await openMaster(companySrc, COMPANY.canvas);

  const companyBounds = await readTextBounds(company);
  const companyConstruction = await readConstruction(company);
  assertCompanyText(companyBounds);
  assertConstruction(companyConstruction, COMPANY.trace, "Página");

  const companyRaw = await company.screenshot({ type: "png" });
  await writePng(companyRaw, "inplux-linkedin-company-cover-v3-4200x700.png");
  await writeJpg(companyRaw, "inplux-linkedin-company-cover-v3-4200x700.jpg");
  await writePng(companyRaw, "inplux-linkedin-company-cover-v3-preview-1128x188.png", (p) =>
    p.resize(1128, 188, { fit: "fill", kernel: "lanczos3" }),
  );

  await company.evaluate(() => document.body.classList.add("proof"));
  await writePng(await company.screenshot({ type: "png" }), "proofs/proof-company-safe-area.png");
  await company.close();

  qa.masters.company = {
    source: companySrc,
    canvas: `${COMPANY.canvas.width}×${COMPANY.canvas.height}`,
    ratio: "6:1",
    fonts: companyFonts,
    guards: { safeArea: COMPANY.safeArea },
    textBounds: companyBounds,
    construction: companyConstruction,
  };

  /* ---------- Pruebas in-situ y tolerancia al recorte ---------------------- */

  const boards = [
    { file: "proof-insitu-profile.html", width: 1664, height: 812, output: "proofs/proof-insitu-profile.png" },
    { file: "proof-insitu-company.html", width: 1208, height: 560, output: "proofs/proof-insitu-company.png" },
    { file: "proof-crop-tolerance.html", width: 1720, height: 1096, output: "proofs/proof-crop-tolerance.png" },
    { file: "inplux-linkedin-banner-v3-review-board.html", width: 1800, height: 1760, output: "inplux-linkedin-banner-v3-review-board.png" },
  ];

  for (const board of boards) {
    const page = await browser.newPage({
      viewport: { width: board.width, height: board.height },
      deviceScaleFactor: 1,
    });
    await page.goto(url(board.file), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await writePng(await page.screenshot({ type: "png" }), board.output);
    await page.close();
    qa.proofs[basename(board.output)] = { source: board.file, width: board.width, height: board.height };
  }

  /* ---------- Verificación de archivos ------------------------------------ */

  const uploads = [
    "inplux-linkedin-profile-cover-v3-1584x396.png",
    "inplux-linkedin-profile-cover-v3-1584x396.jpg",
    "inplux-linkedin-profile-cover-v3-3168x792.png",
    "inplux-linkedin-company-cover-v3-4200x700.png",
    "inplux-linkedin-company-cover-v3-4200x700.jpg",
    "inplux-linkedin-company-cover-v3-preview-1128x188.png",
  ];

  const expected = {
    "inplux-linkedin-profile-cover-v3-1584x396.png": [1584, 396],
    "inplux-linkedin-profile-cover-v3-1584x396.jpg": [1584, 396],
    "inplux-linkedin-profile-cover-v3-3168x792.png": [3168, 792],
    "inplux-linkedin-company-cover-v3-4200x700.png": [4200, 700],
    "inplux-linkedin-company-cover-v3-4200x700.jpg": [4200, 700],
    "inplux-linkedin-company-cover-v3-preview-1128x188.png": [1128, 188],
  };

  const oversized = [];
  for (const file of uploads) {
    const bytes = await readFile(out(file));
    const meta = await sharp(bytes).metadata();
    const [w, h] = expected[file];

    if (meta.width !== w || meta.height !== h) {
      throw new Error(`${file}: lienzo equivocado ${meta.width}×${meta.height}, se esperaba ${w}×${h}`);
    }
    if (!meta.hasProfile) {
      throw new Error(`${file}: no lleva perfil ICC embebido`);
    }
    if (bytes.length > LIMIT_BYTES) oversized.push(`${file} (${(bytes.length / 1048576).toFixed(2)} MB)`);

    qa.checks[file] = {
      bytes: bytes.length,
      megabytes: Number((bytes.length / 1048576).toFixed(3)),
      width: meta.width,
      height: meta.height,
      space: meta.space,
      hasProfile: meta.hasProfile,
      withinLimit: bytes.length <= LIMIT_BYTES,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    };
  }

  qa.uploadLimitBytes = LIMIT_BYTES;
  qa.oversized = oversized;

  await writeFile(out("QA.json"), `${JSON.stringify(qa, null, 2)}\n`, "utf8");

  console.log("Masters y pruebas reconstruidos. Tamaños:");
  for (const file of uploads) {
    const c = qa.checks[file];
    console.log(`  ${c.withinLimit ? "OK  " : "TOPE"} ${String(c.megabytes).padStart(6)} MB  ${file}`);
  }
  if (oversized.length) {
    throw new Error(`Archivos por encima del tope de ${LIMIT_BYTES} bytes: ${oversized.join(", ")}`);
  }
} finally {
  await browser.close();
}

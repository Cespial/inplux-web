/* ============================================================================
   INPLUX — Applied Frontier — conceptos v4
   Construye los seis HTML desde una plantilla común, los renderiza y compone
   las pruebas in-situ y el tablero comparativo.

     node brand/applied-frontier/linkedin/concepts-v4/render-concepts.mjs

   El marco compartido lo escribe esta plantilla, no cada concepto: campo,
   lift del avatar, grano, viñeta, cartela y capa de prueba salen idénticos en
   los seis. Lo único que varía es la escena. Así la comparación mide el
   concepto y no el acabado.

   Cada concepto pasa por el mismo contrato que v3:
     · la cartela no entra en el círculo del avatar ni en el botón de editar;
     · exactamente un elemento marcado como `signal`;
     · ningún otro elemento usa el teal literal;
     · lienzo, ICC y tope de archivo.
   ========================================================================== */

import { chromium } from "playwright";
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { CONCEPTS } from "./scenes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = (file) => join(here, file);
const href = (file) => pathToFileURL(join(here, file)).href;

const CANVAS = { width: 1584, height: 396 };
const RAIL = { x: 432, y: 40, right: 1544, bottom: 372 };
const AVATAR = { cx: 207, cy: 365, r: 160, clearance: 186 };
const EDIT_BUTTON = { x: 1450, y: 0, right: 1572, bottom: 152 };
const LIMIT_BYTES = 3 * 1024 * 1024;

/* --- Plantilla compartida ------------------------------------------------- */

const FIELD = `<svg class="layer field" viewBox="0 0 1584 396" aria-hidden="true">
      <defs>
        <pattern id="baseGrid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44 0H0V44" fill="none" stroke="#F9F5EF" stroke-opacity=".022" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1584" height="396" fill="#0c0c0b"/>
      <rect width="1584" height="396" fill="url(#baseGrid)"/>
    </svg>
    <svg class="layer lift" viewBox="0 0 1584 396" aria-hidden="true">
      <defs>
        <radialGradient id="baseLift" cx="207" cy="365" r="330" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#F9F5EF" stop-opacity=".07"/>
          <stop offset=".45" stop-color="#F9F5EF" stop-opacity=".026"/>
          <stop offset="1" stop-color="#F9F5EF" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1584" height="396" fill="url(#baseLift)"/>
    </svg>`;

const GRAIN = `<svg class="layer grain" viewBox="0 0 1584 396" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <filter id="baseGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="17" stitchTiles="stitch"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1 0"/>
        </filter>
      </defs>
      <rect width="1584" height="396" filter="url(#baseGrain)"/>
    </svg>`;

const PROOF = `<div class="proof-layer" aria-hidden="true">
      <div class="proof-shape proof-avatar-clear"></div>
      <div class="proof-shape proof-avatar"></div>
      <div class="proof-shape proof-button"></div>
      <div class="proof-shape proof-rail"></div>
    </div>`;

const page = (concept) => `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1584, initial-scale=1" />
    <title>INPLUX — Applied Frontier — concepto ${concept.n} · ${concept.name}</title>
    <link rel="stylesheet" href="base.css" />${
      concept.css ? `\n    <style>${concept.css}\n    </style>` : ""
    }
  </head>
  <body>
    <main class="cover" aria-label="INPLUX Applied Frontier — ${concept.name}">
    ${FIELD}

    ${concept.scene}

    <p class="wordmark">APPLIED FRONTIER.</p>

    ${GRAIN}
    <div class="layer edge-shade" aria-hidden="true"></div>

    ${PROOF}
    </main>
  </body>
</html>
`;

/* --- Geometría ------------------------------------------------------------ */

const rectHitsCircle = (r, { cx, cy, clearance }) => {
  const nx = Math.max(r.x, Math.min(cx, r.x + r.width));
  const ny = Math.max(r.y, Math.min(cy, r.y + r.height));
  return Math.hypot(cx - nx, cy - ny) < clearance;
};

const rectsOverlap = (a, b) =>
  a.x < b.right && a.x + a.width > b.x && a.y < b.bottom && a.y + a.height > b.y;

/* --- Render --------------------------------------------------------------- */

const browser = await chromium.launch({ headless: true });
const qa = { generatedAt: new Date().toISOString(), canvas: "1584×396", concepts: {} };

try {
  for (const concept of CONCEPTS) {
    const file = `concept-${concept.id}.html`;
    await writeFile(out(file), page(concept), "utf8");

    const tab = await browser.newPage({ viewport: CANVAS, deviceScaleFactor: 1 });
    await tab.goto(href(file), { waitUntil: "networkidle" });
    await tab.evaluate(() => document.fonts.ready);

    const probe = await tab.evaluate(async () => {
      /* Se fuerza la carga antes de comprobar: `fonts.check` sólo es cierto si
         algún elemento ya pidió la familia, y hay escenas que no usan la mono. */
      await Promise.all([
        document.fonts.load('16px "Geist INPLUX"'),
        document.fonts.load('16px "Geist Mono INPLUX"'),
      ]);
      const mark = document.querySelector(".wordmark").getBoundingClientRect();
      const literalTeal = [...document.querySelectorAll('.cover [fill="#00D7CA"]')];
      return {
        fonts: {
          geist: document.fonts.check('16px "Geist INPLUX"'),
          geistMono: document.fonts.check('16px "Geist Mono INPLUX"'),
        },
        wordmark: { x: mark.x, y: mark.y, width: mark.width, height: mark.height },
        signals: document.querySelectorAll(".cover .signal").length,
        literalTeal: literalTeal.length,
        tealOutsideSignal: literalTeal.filter((n) => !n.closest(".signal")).length,
      };
    });

    if (!probe.fonts.geist || !probe.fonts.geistMono) {
      throw new Error(`${concept.n}: las fuentes empaquetadas no cargaron`);
    }

    const m = probe.wordmark;
    const right = m.x + m.width;
    const bottom = m.y + m.height;
    if (m.x < RAIL.x || right > RAIL.right || m.y < RAIL.y || bottom > RAIL.bottom) {
      throw new Error(`${concept.n}: la cartela se sale del carril: ${JSON.stringify(m)}`);
    }
    if (rectHitsCircle(m, AVATAR)) {
      throw new Error(`${concept.n}: la cartela choca con la foto de perfil: ${JSON.stringify(m)}`);
    }
    if (rectsOverlap(m, EDIT_BUTTON)) {
      throw new Error(`${concept.n}: la cartela choca con el botón de editar: ${JSON.stringify(m)}`);
    }
    if (probe.signals !== 1) {
      throw new Error(`${concept.n}: debe haber exactamente un evento teal, hay ${probe.signals}`);
    }
    if (probe.tealOutsideSignal !== 0) {
      throw new Error(
        `${concept.n}: hay ${probe.tealOutsideSignal} usos del teal literal fuera del evento designado`,
      );
    }

    const raw = await tab.screenshot({ type: "png" });
    await sharp(raw)
      .withIccProfile("srgb")
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .withMetadata({ density: 72 })
      .toFile(out(`concept-${concept.id}.png`));

    await tab.evaluate(() => document.body.classList.add("proof"));
    await sharp(await tab.screenshot({ type: "png" }))
      .withIccProfile("srgb")
      .png({ compressionLevel: 9 })
      .toFile(out(`proofs/proof-${concept.id}.png`));
    await tab.close();

    const bytes = await readFile(out(`concept-${concept.id}.png`));
    const meta = await sharp(bytes).metadata();
    if (meta.width !== CANVAS.width || meta.height !== CANVAS.height) {
      throw new Error(`${concept.n}: lienzo equivocado ${meta.width}×${meta.height}`);
    }
    if (!meta.hasProfile) throw new Error(`${concept.n}: falta el perfil ICC`);
    if (bytes.length > LIMIT_BYTES) throw new Error(`${concept.n}: supera el tope de archivo`);

    qa.concepts[concept.n] = {
      id: concept.id,
      name: concept.name,
      wordmark: probe.wordmark,
      signals: probe.signals,
      tealOutsideSignal: probe.tealOutsideSignal,
      bytes: bytes.length,
      megabytes: Number((bytes.length / 1048576).toFixed(3)),
      hasProfile: meta.hasProfile,
    };

    console.log(
      `  ${concept.n} · ${concept.name.padEnd(26)} ${String(qa.concepts[concept.n].megabytes).padStart(6)} MB   teal:${probe.signals}`,
    );
  }

  /* --- Pruebas in-situ y tablero ------------------------------------------ */

  /* Una prueba in-situ por concepto, de tamaño fijo, para poder compararlas
     lado a lado sin que los márgenes desplacen los recortes. */
  const INSITU = { width: 1664, height: 636 };

  const insituPage = (c) => `<!doctype html><html lang="es"><head><meta charset="utf-8"/>
<link rel="stylesheet" href="base.css"/>
<style>
  html,body{width:${INSITU.width}px;height:${INSITU.height}px;background:#f4f2ee;margin:0;overflow:hidden}
  .sheet{padding:34px 40px}
  .tag{margin:0 0 12px;font-family:"Geist Mono INPLUX",monospace;font-size:13px;font-weight:660;
       letter-spacing:2.4px;text-transform:uppercase;color:#3d3b39}
  .tag b{color:#0a66c2}
  .card{position:relative;width:1584px;background:#fff;border:1px solid #e3e0da;border-radius:12px;overflow:hidden}
  .card img.cov{display:block;width:1584px;height:396px}
  .card img.av{position:absolute;left:47px;top:205px;width:320px;height:320px;border-radius:50%}
  .edit{position:absolute;left:1478px;top:32px;width:76px;height:76px;border-radius:50%;
        background:rgba(160,160,160,.62);display:flex;align-items:center;justify-content:center;
        font-size:34px;color:#33322f}
  .body{padding:214px 56px 24px;font-family:"Geist INPLUX",sans-serif;color:#1a1918}
  .nm{margin:0;font-size:32px;font-weight:620;letter-spacing:-.9px}
  .hl{margin:5px 0 0;font-size:17px;color:#2c2b29}
</style></head><body><div class="sheet">
  <p class="tag"><b>${c.n}</b> &middot; ${c.name}</p>
  <div class="card">
    <img class="cov" src="concept-${c.id}.png" alt=""/>
    <img class="av" src="proofs/avatar-reference-320.png" alt=""/>
    <div class="edit">&#9998;</div>
    <div class="body">
      <p class="nm">Cristian Espinal</p>
      <p class="hl">CTO @ inplux.co | B.A., M.A. in Economics and Ph.D. (c) in Engineering.</p>
    </div>
  </div>
</div></body></html>`;

  for (const c of CONCEPTS) {
    const file = `insitu-${c.id}.html`;
    await writeFile(out(file), insituPage(c), "utf8");
    const tab = await browser.newPage({ viewport: INSITU, deviceScaleFactor: 1 });
    await tab.goto(href(file), { waitUntil: "networkidle" });
    await tab.evaluate(() => document.fonts.ready);
    await sharp(await tab.screenshot({ type: "png" }))
      .withIccProfile("srgb")
      .png({ compressionLevel: 9 })
      .toFile(out(`proofs/insitu-${c.id}.png`));
    await tab.close();
  }

  await writeFile(out("QA.json"), `${JSON.stringify(qa, null, 2)}\n`, "utf8");
  console.log("\nSeis conceptos renderizados. Pruebas in-situ en proofs/insitu-*.png");
} finally {
  await browser.close();
}

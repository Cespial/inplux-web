/* ============================================================================
   INPLUX — Applied Frontier — estudio de la firma

     node brand/applied-frontier/linkedin/concepts-v4/render-wordmarks.mjs [id]

   Monta los siete tratamientos de firma sobre un mismo banco de pruebas (por
   defecto el concepto E) y compone sus pruebas in-situ. La escena es idéntica
   en los siete: lo único que cambia es la firma.
   ========================================================================== */

import { chromium } from "playwright";
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { CONCEPTS } from "./scenes.mjs";
import { WORDMARKS } from "./wordmarks.mjs";
import {
  CANVAS,
  INSITU,
  LIMIT_BYTES,
  assertPiece,
  insituPage,
  page,
  probePage,
} from "./template.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = (file) => join(here, file);
const href = (file) => pathToFileURL(join(here, file)).href;

const bench = CONCEPTS.find((c) => c.n === (process.argv[2] ?? "E").toUpperCase());
if (!bench) throw new Error(`Concepto desconocido: ${process.argv[2]}`);

await mkdir(out("wordmark-study"), { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = { generatedAt: new Date().toISOString(), bench: bench.n, treatments: {} };

try {
  for (const mark of WORDMARKS) {
    const slug = `${bench.n.toLowerCase()}-${mark.id}`;
    const file = `wordmark-study/${slug}.html`;

    await writeFile(
      out(file),
      page({
        title: `firma ${mark.id} sobre ${bench.name}`,
        label: `${bench.name} — firma: ${mark.name}`,
        css: [bench.css, mark.css].filter(Boolean).join("\n"),
        scene: bench.scene,
        wordmark: mark.html,
      })
        /* Las hojas viven un nivel más abajo que base.css y las fuentes. */
        .replace('href="base.css"', 'href="../base.css"'),
      "utf8",
    );

    const tab = await browser.newPage({ viewport: CANVAS, deviceScaleFactor: 1 });
    await tab.goto(href(file), { waitUntil: "networkidle" });
    await tab.evaluate(() => document.fonts.ready);

    const probe = await probePage(tab);
    assertPiece(probe, `${bench.n} · ${mark.name}`, { wordmarkOptional: mark.id === "06-ninguna" });

    const png = out(`wordmark-study/${slug}.png`);
    await sharp(await tab.screenshot({ type: "png" }))
      .withIccProfile("srgb")
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .withMetadata({ density: 72 })
      .toFile(png);
    await tab.close();

    const insituFile = `wordmark-study/insitu-${slug}.html`;
    await writeFile(
      out(insituFile),
      insituPage({
        tag: `<b>${mark.id.slice(0, 2)}</b> &middot; ${mark.name}`,
        cover: `${slug}.png`,
      })
        .replace('href="base.css"', 'href="../base.css"')
        .replace('src="proofs/avatar-reference-320.png"', 'src="../proofs/avatar-reference-320.png"'),
      "utf8",
    );

    const shot = await browser.newPage({ viewport: INSITU, deviceScaleFactor: 1 });
    await shot.goto(href(insituFile), { waitUntil: "networkidle" });
    await shot.evaluate(() => document.fonts.ready);
    await sharp(await shot.screenshot({ type: "png" }))
      .withIccProfile("srgb")
      .png({ compressionLevel: 9 })
      .toFile(out(`wordmark-study/insitu-${slug}.png`));
    await shot.close();

    const bytes = await readFile(png);
    if (bytes.length > LIMIT_BYTES) throw new Error(`${mark.name}: supera el tope de archivo`);

    report.treatments[mark.id] = {
      name: mark.name,
      wordmark: probe.wordmark,
      signals: probe.signals,
      megabytes: Number((bytes.length / 1048576).toFixed(3)),
    };

    const box = probe.wordmark;
    console.log(
      `  ${mark.id.padEnd(13)} ${mark.name.padEnd(24)} ` +
        (box
          ? `caja ${Math.round(box.width)}×${Math.round(box.height)} en (${Math.round(box.x)}, ${Math.round(box.y)})`
          : "sin firma"),
    );
  }

  await writeFile(
    out("wordmark-study/REPORT.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8",
  );
  console.log(`\nSiete tratamientos sobre ${bench.n} · ${bench.name}. En wordmark-study/`);
} finally {
  await browser.close();
}

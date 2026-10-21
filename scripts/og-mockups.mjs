/**
 * Capturas del mockup del hero de cada ficha de `/trabajo`, para la tarjeta
 * social que pinta `/api/og/trabajo/[key]` con satori (PR N, 20-oct-2026).
 * Satori no renderiza el HTML y el CSS del mockup, así que se fotografía una
 * vez y la ruta lee el PNG del disco.
 *
 * Con el sitio servido en local (`npm run build && npx next start -p 3100`):
 *
 *   node scripts/og-mockups.mjs http://127.0.0.1:3100
 *
 * Deja `public/brand/og/mockups/<slug>.png` a 560 px de ancho y fondo
 * transparente (las esquinas redondas de la ventana se ven sobre la tarjeta).
 * Si cambia el mockup o las cifras de un producto, se vuelve a correr y se sube
 * `workSocialDesignVersion` en `src/app/api/og/trabajo/social-card.ts`.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = process.argv[2] ?? "http://127.0.0.1:3100";
const slugs = ["tribai", "gobia", "kelsen", "laudos", "porkia"];
const width = 560;
const maxBytes = 120_000;

const outDir = path.join(root, "public/brand/og/mockups");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});

for (const slug of slugs) {
  await page.goto(`${baseUrl}/trabajo/${slug}`, { waitUntil: "networkidle" });
  // Todo lo que rodea la ventana, transparente: solo queda la figura.
  await page.addStyleTag({
    content:
      "html, body, body *:not(figure[data-animate]):not(figure[data-animate] *) { background: transparent !important; box-shadow: none !important; }",
  });
  const figure = page.locator("figure[data-animate]").first();
  await figure.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const shot = await figure.screenshot({ omitBackground: true, animations: "disabled" });

  const file = path.join(outDir, `${slug}.png`);
  await sharp(shot)
    .resize({ width })
    .png({ palette: true, quality: 90, compressionLevel: 9, effort: 10 })
    .toFile(file);
  const { size } = await stat(file);
  console.log(`${size > maxBytes ? "✗" : "✓"} ${slug}.png ${(size / 1024).toFixed(1)} KB`);
  if (size > maxBytes) process.exitCode = 1;
}

await browser.close();

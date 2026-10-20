/**
 * Pósteres livianos de los heros con video. Cada `public/media/<nombre>-poster.jpg`
 * (1920 × 1080, el fotograma de apertura del montaje) se reduce a tres anchos en
 * AVIF y WebP, que `HeroVideo` sirve con `<picture>` y `srcset`: el teléfono baja
 * el de 828 px y el escritorio el de 1920. El JPEG se queda como respaldo.
 *
 *   node scripts/hero-posters.mjs
 *
 * Se vuelve a correr cuando cambia un póster. Como `/media` se sirve con caché
 * inmutable, un póster nuevo cambia de nombre (ver `public/media/CREDITOS.md`).
 * `sharp` llega con Next.js; no es dependencia directa del sitio.
 */
import sharp from "sharp";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const media = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/media");

/* Los mismos anchos y calidades que lee `posterSources()` en HeroVideo. */
const widths = [828, 1280, 1920];
const formats = [
  ["avif", { quality: 45, effort: 6 }],
  ["webp", { quality: 60, effort: 6 }],
];

for (const name of ["hero", "como", "nosotros"]) {
  const source = path.join(media, `${name}-poster.jpg`);
  const row = [name];
  for (const [format, options] of formats) {
    for (const width of widths) {
      const target = path.join(media, `${name}-poster-${width}.${format}`);
      await sharp(source).resize({ width })[format](options).toFile(target);
      row.push(`${format} ${width}: ${Math.round((await stat(target)).size / 1024)} KB`);
    }
  }
  console.log(row.join(" · "));
}

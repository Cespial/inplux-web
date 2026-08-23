/* ============================================================================
   INPLUX — estudio de emplazamiento de la marca

     node brand/applied-frontier/linkedin/banner-marca/study-emplazamiento.mjs

   La variante elegida es la disolución. Aquí sólo se prueban tamaño y sitio:
   la marca baja a un tercio de su escala y se busca dónde apoya mejor en un
   lienzo que pasa a ser casi todo negro.

   La escena es idéntica en todas: sólo cambia dónde está la marca.
   ========================================================================== */

import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { INK, buildMark, assertClear, composeSvg } from "./mark-engine.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = (f) => join(here, f);

const PERFIL = {
  W: 1584,
  H: 396,
  minBar: 3.6,
  avatar: { cx: 207, cy: 365, clearance: 186 },
  blocks: [{ name: "el botón de editar", x: 1450, y: 0, right: 1572, bottom: 152 }],
};

/* La disolución, tal cual quedó elegida. */
const DISOLUCION = {
  rows: 7.6,
  barRatio: 0.556,
  dissolveStart: 0.34,
  dissolveEnd: -0.06,
  strays: 34,
  seed: 7,
};

/* Escala 5.3 era la marca grande. Un tercio largo la deja como firma. */
const S = 2.05;

const PLACES = [
  {
    id: "a-firma-inferior-derecha",
    name: "Firma, inferior derecha",
    note: "La posición de la firma de un cuadro. Lejos de la foto y del botón; el rastro se disipa hacia el centro vacío.",
    place: { scale: S, cx: 1300, cy: 296 },
  },
  {
    id: "b-superior-derecha",
    name: "Superior derecha, bajo el botón",
    note: "Arriba a la derecha, esquivando el botón de editar. El rastro cae hacia el centro y deja el pie del banner limpio.",
    place: { scale: S, cx: 1286, cy: 232 },
  },
  {
    id: "c-centro",
    name: "Centrada",
    note: "Como la referencia: una sola marca pequeña en mitad del negro. La más silenciosa de todas.",
    place: { scale: S, cx: 792, cy: 198 },
  },
  {
    id: "d-junto-al-retrato",
    name: "Junto al retrato",
    note: "A la derecha de la foto y a su misma altura: la marca lee como pie de tu retrato, no como decoración del fondo.",
    place: { scale: S, cx: 620, cy: 292 },
  },
  {
    id: "e-tercio-derecho",
    name: "Tercio derecho, a media altura",
    note: "Sobre el eje óptico del tercio derecho. Ni esquina ni centro: la posición que un maquetador elegiría por defecto.",
    place: { scale: S, cx: 1140, cy: 198 },
  },
  {
    id: "f-firma-mayor",
    name: "Firma, un punto mayor",
    note: "El mismo sitio que A con la marca un 35 % más grande, por si un tercio se queda corto.",
    place: { scale: S * 1.35, cx: 1272, cy: 284 },
  },
  {
    id: "g-firma-tercio",
    name: "Firma en el tercio derecho",
    note: "El tamaño de F en la altura de E: la marca cabe en el eje óptico del tercio derecho sin irse a la esquina. Es la que recomiendo.",
    place: { scale: S * 1.35, cx: 1240, cy: 232 },
  },
];

await mkdir(out("emplazamiento"), { recursive: true });
const AVATAR_REF = join(here, "../concepts-v4/proofs/avatar-reference-320.png");

for (const p of PLACES) {
  const { shapes, bounds, meta } = buildMark(PERFIL, p.place, DISOLUCION);
  assertClear(PERFIL, p.id, bounds);

  const svg = composeSvg(PERFIL, p.place, shapes);
  await writeFile(out(`emplazamiento/${p.id}.svg`), `${svg}\n`, "utf8");

  const raster = await sharp(Buffer.from(svg), { density: 72 * 3 })
    .resize(PERFIL.W, PERFIL.H, { kernel: "lanczos3" })
    .flatten({ background: INK })
    .toBuffer();

  await sharp(raster)
    .withIccProfile("srgb")
    .png({ compressionLevel: 9 })
    .toFile(out(`emplazamiento/${p.id}.png`));

  const card = await sharp({ create: { width: 1584, height: 620, channels: 3, background: "#ffffff" } })
    .composite([
      { input: await sharp(raster).png().toBuffer(), top: 0, left: 0 },
      { input: await sharp(AVATAR_REF).resize(320, 320).png().toBuffer(), top: 205, left: 47 },
      {
        input: Buffer.from(
          `<svg width="76" height="76"><circle cx="38" cy="38" r="38" fill="#a0a0a0" fill-opacity=".62"/></svg>`,
        ),
        top: 32,
        left: 1478,
      },
    ])
    .png()
    .toBuffer();

  await sharp({ create: { width: 1664, height: 700, channels: 3, background: "#f4f2ee" } })
    .composite([{ input: card, top: 40, left: 40 }])
    .png({ compressionLevel: 9 })
    .toFile(out(`emplazamiento/insitu-${p.id}.png`));

  console.log(
    `  ${p.id.padEnd(28)} marca ${Math.round(bounds.x1 - bounds.x0)}×${Math.round(bounds.y1 - bounds.y0)} · ` +
      `barra ${meta.bar.toFixed(1)} px · x ${Math.round(bounds.x0)}–${Math.round(bounds.x1)}`,
  );
}

console.log("\nSeis emplazamientos en emplazamiento/");

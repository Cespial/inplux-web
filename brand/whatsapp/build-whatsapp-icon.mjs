/* ============================================================================
   INPLUX — icono para grupos de WhatsApp

     node brand/whatsapp/build-whatsapp-icon.mjs

   WhatsApp guarda las fotos de perfil y de grupo a 640 × 640 y las muestra
   SIEMPRE recortadas en círculo. De ahí dos decisiones:

   1. Se centra la TINTA, no el viewBox. El mark ocupa x 8–92 / y 21–70 dentro
      de un lienzo 100 × 100, así que su centro óptico está en (50, 45.5) y
      centrarlo por caja lo dejaría 4.5 unidades bajo del centro del círculo.

   2. El ancho de tinta se fija en el 67 % del diámetro. La media diagonal de
      la caja de tinta queda en 250 px sobre un radio de 320, así que las
      esquinas del mark entran holgadas en el círculo recortado.
   ========================================================================== */

import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const out = (file) => join(here, file);

/* Geometría canónica del mark, leída del maestro y no reescrita a mano. */
const SOURCE = join(here, "../refined/inplux-mark-positive-v1.0.svg");
const INK = { x: 8, y: 21, width: 84, height: 49 };
const CAPSULES = [
  { x: 8, y: 57, fill: "#0C0C0B" },
  { x: 29, y: 39, fill: "#0C0C0B" },
  { x: 50, y: 21, fill: "#0D7D74" },
];

const SIZES = [640, 1024];
const INK_RATIO = 0.67; // ancho de tinta respecto al diámetro
const BACKGROUND = "#FFFFFF";

/* El maestro es la fuente de verdad: si cambia, esto tiene que enterarse. */
const master = await readFile(SOURCE, "utf8");
for (const capsule of CAPSULES) {
  const pattern = new RegExp(
    `<rect x="${capsule.x}" y="${capsule.y}" width="42" height="13" rx="6.5" fill="${capsule.fill}"/>`,
  );
  if (!pattern.test(master)) {
    throw new Error(
      `El maestro ya no contiene la cápsula (${capsule.x}, ${capsule.y}) en ${capsule.fill}. ` +
        `Revisar ${SOURCE} antes de regenerar el icono.`,
    );
  }
}

const buildSvg = (size) => {
  const scale = (size * INK_RATIO) / INK.width;
  const inkWidth = INK.width * scale;
  const inkHeight = INK.height * scale;
  const tx = (size - inkWidth) / 2 - INK.x * scale;
  const ty = (size - inkHeight) / 2 - INK.y * scale;

  return {
    scale,
    inkWidth,
    inkHeight,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BACKGROUND}"/>
  <g transform="translate(${tx.toFixed(4)} ${ty.toFixed(4)}) scale(${scale.toFixed(6)})" shape-rendering="geometricPrecision">
    ${CAPSULES.map(
      (c) => `<rect x="${c.x}" y="${c.y}" width="42" height="13" rx="6.5" fill="${c.fill}"/>`,
    ).join("\n    ")}
  </g>
</svg>`,
  };
};

await mkdir(out("."), { recursive: true });
const report = { generatedAt: new Date().toISOString(), background: BACKGROUND, inkRatio: INK_RATIO, files: {} };

for (const size of SIZES) {
  const { svg, scale, inkWidth, inkHeight } = buildSvg(size);
  const name = `inplux-whatsapp-${size}.png`;

  await writeFile(out(`inplux-whatsapp-${size}.svg`), `${svg}\n`, "utf8");
  /* Se rasteriza a 4× y se reduce: los extremos redondeados de las cápsulas
     son lo primero que se degrada si se rasteriza directo al tamaño final. */
  await sharp(Buffer.from(svg), { density: 72 * 4 })
    .resize(size, size, { kernel: "lanczos3" })
    .flatten({ background: BACKGROUND })
    .withIccProfile("srgb")
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .withMetadata({ density: 72 })
    .toFile(out(name));

  /* La media diagonal de la caja de tinta tiene que caber en el círculo. */
  const halfDiagonal = Math.hypot(inkWidth / 2, inkHeight / 2);
  const radius = size / 2;
  if (halfDiagonal > radius * 0.85) {
    throw new Error(
      `${name}: la tinta se acerca demasiado al borde del recorte circular ` +
        `(media diagonal ${halfDiagonal.toFixed(1)} sobre radio ${radius})`,
    );
  }

  const bytes = await readFile(out(name));
  const meta = await sharp(bytes).metadata();
  if (meta.width !== size || meta.height !== size) {
    throw new Error(`${name}: lienzo equivocado ${meta.width}×${meta.height}`);
  }
  if (meta.channels === 4 && meta.hasAlpha) {
    throw new Error(`${name}: WhatsApp no respeta el canal alfa; el fondo debe estar aplanado`);
  }

  report.files[name] = {
    size,
    inkWidth: Number(inkWidth.toFixed(1)),
    inkHeight: Number(inkHeight.toFixed(1)),
    scale: Number(scale.toFixed(4)),
    halfDiagonal: Number(halfDiagonal.toFixed(1)),
    cropRadius: radius,
    marginInsideCrop: Number((radius - halfDiagonal).toFixed(1)),
    bytes: bytes.length,
    hasAlpha: Boolean(meta.hasAlpha),
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };

  console.log(
    `  ${name.padEnd(28)} tinta ${inkWidth.toFixed(0)}×${inkHeight.toFixed(0)} · ` +
      `holgura al recorte ${(radius - halfDiagonal).toFixed(0)} px · ${(bytes.length / 1024).toFixed(1)} KB`,
  );
}

/* Prueba: exactamente lo que WhatsApp va a enseñar, y el tamaño al que de
   verdad se ve en la lista de chats. */
const base = await readFile(out("inplux-whatsapp-640.png"));
const mask = Buffer.from(
  `<svg width="640" height="640"><circle cx="320" cy="320" r="320" fill="#fff"/></svg>`,
);
const circle = await sharp(base)
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();

const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="420">
  <rect width="1000" height="420" fill="#0b141a"/>
  <text x="40" y="46" font-family="monospace" font-size="15" font-weight="700" fill="#8696a0" letter-spacing="2">RECORTE CIRCULAR DE WHATSAPP</text>
</svg>`;

await sharp(Buffer.from(sheet))
  .composite([
    { input: await sharp(circle).resize(280, 280).png().toBuffer(), top: 88, left: 40 },
    { input: await sharp(circle).resize(120, 120).png().toBuffer(), top: 88, left: 372 },
    { input: await sharp(circle).resize(64, 64).png().toBuffer(), top: 88, left: 540 },
    { input: await sharp(circle).resize(40, 40).png().toBuffer(), top: 88, left: 636 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(out("proof-recorte-circular.png"));

await writeFile(out("REPORT.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log("\nPrueba del recorte en proof-recorte-circular.png");

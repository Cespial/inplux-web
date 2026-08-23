/* ============================================================================
   INPLUX — portadas de marca sola
   Maestros definitivos para los dos formatos de LinkedIn.

     node brand/applied-frontier/linkedin/banner-marca/build-marca.mjs

   La marca dibujada con su propio módulo, en el tercio derecho, a escala de
   firma. El dibujo lo hace mark-engine.mjs; aquí sólo vive la composición.

   Emplazamiento elegido tras study-emplazamiento.mjs: el tercio derecho a
   media altura. En la esquina la marca queda arrinconada; centrada queda
   descolgada, porque la foto de perfil ocupa la izquierda y rompe la simetría
   que justificaría centrarla.
   ========================================================================== */

import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { INK, buildMark, assertClear, composeSvg } from "./mark-engine.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = (f) => join(here, f);
const LIMIT_BYTES = 3 * 1024 * 1024;

/* Factor al que LinkedIn muestra cada portada respecto a su maestro. */
const ON_SCREEN = { perfil: 0.8, pagina: 1128 / 4200 };

const FORMATS = {
  perfil: {
    id: "perfil",
    label: "Perfil personal",
    W: 1584,
    H: 396,
    ratio: "4:1",
    minBar: 3.6,
    avatar: { cx: 207, cy: 365, clearance: 186 },
    blocks: [{ name: "el botón de editar", x: 1450, y: 0, right: 1572, bottom: 152 }],
    place: { scale: 2.77, cx: 1240, cy: 232 },
  },
  pagina: {
    id: "pagina",
    label: "Página de empresa",
    W: 4200,
    H: 700,
    ratio: "6:1",
    /* La portada de Página se muestra reducida a 1128 × 188. Una barra de
       3.6 px aquí llegaría a un píxel escaso en pantalla, así que el mínimo
       sube en la misma proporción. */
    minBar: 3.6 / ON_SCREEN.pagina,
    avatar: null,
    blocks: [{ name: "el logo de Página", x: 0, y: 380, right: 900, bottom: 700 }],
    /* La marca ocupa aquí más proporción de alto que en el perfil, y no por
       gusto: con el 33 % que usa el perfil, la trama no sobrevive la
       reducción a 1128 px. El tamaño lo fija la legibilidad en pantalla, no
       la simetría entre maestros. */
    place: { scale: 7.0, cx: 3000, cy: 336 },
  },
};

const VARIANTS = [
  {
    id: "01-disolucion",
    name: "Disolución",
    primary: true,
    note: "La cápsula de atrás se deshace en fragmentos, la del medio sostiene, la teal queda entera.",
    rows: 7.6,
    barRatio: 0.556,
    dissolveStart: 0.34,
    dissolveEnd: -0.06,
    strays: 34,
    seed: 7,
  },
  {
    id: "02-limpia",
    name: "Limpia",
    note: "Sin disolución: sólo la marca en líneas de barrido.",
    rows: 7.6,
    barRatio: 0.556,
    solid: true,
    strays: 0,
    dissolveStart: 0,
    dissolveEnd: 0,
    seed: 7,
  },
  {
    id: "03-fina",
    name: "Barrido fino",
    note: "Paso corto y barra delgada. La más bonita de cerca y la única con riesgo de titilar.",
    rows: 11.5,
    barRatio: 0.5,
    dissolveStart: 0.36,
    dissolveEnd: -0.04,
    strays: 52,
    seed: 21,
  },
  {
    id: "04-densa",
    name: "Disolución densa",
    note: "Más esquirlas y rotura más temprana: el rastro llega más lejos hacia el retrato.",
    rows: 7.6,
    barRatio: 0.556,
    dissolveStart: 0.44,
    dissolveEnd: -0.12,
    strays: 72,
    seed: 3,
  },
];

await mkdir(out("proofs"), { recursive: true });
const AVATAR_REF = join(here, "../concepts-v4/proofs/avatar-reference-320.png");
const PAGE_LOGO = join(here, "../banner-v3/inplux-linkedin-page-logo-400.png");

const qa = {
  generatedAt: new Date().toISOString(),
  placement: "tercio derecho, a media altura",
  formats: {},
  files: {},
};

const record = async (name) => {
  const bytes = await readFile(out(name));
  const meta = await sharp(bytes).metadata();
  if (bytes.length > LIMIT_BYTES) throw new Error(`${name}: supera el tope de ${LIMIT_BYTES} bytes`);
  if (!meta.hasProfile) throw new Error(`${name}: falta el perfil ICC`);
  if (meta.hasAlpha) throw new Error(`${name}: conserva canal alfa; el fondo debe estar aplanado`);
  qa.files[name] = {
    bytes: bytes.length,
    megabytes: Number((bytes.length / 1048576).toFixed(3)),
    width: meta.width,
    height: meta.height,
    space: meta.space,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
  return qa.files[name];
};

for (const format of Object.values(FORMATS)) {
  qa.formats[format.id] = {
    canvas: `${format.W}×${format.H}`,
    ratio: format.ratio,
    place: format.place,
    variants: {},
  };
  console.log(`\n${format.label} · ${format.W} × ${format.H} · ${format.ratio}`);

  for (const variant of VARIANTS) {
    const { shapes, bounds, meta } = buildMark(format, format.place, variant);
    assertClear(format, `${format.id} · ${variant.id}`, bounds);

    const svg = composeSvg(format, format.place, shapes);
    const base = `inplux-marca-${format.id}-${variant.id}`;
    await writeFile(out(`${base}.svg`), `${svg}\n`, "utf8");

    const raster = await sharp(Buffer.from(svg), { density: 72 * 3 })
      .resize(format.W, format.H, { kernel: "lanczos3" })
      .flatten({ background: INK })
      .toBuffer();

    await sharp(raster)
      .withIccProfile("srgb")
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .withMetadata({ density: 72 })
      .toFile(out(`${base}.png`));
    await sharp(raster)
      .withIccProfile("srgb")
      .jpeg({ quality: 93, chromaSubsampling: "4:4:4", mozjpeg: true })
      .withMetadata({ density: 72 })
      .toFile(out(`${base}.jpg`));

    const png = await record(`${base}.png`);
    await record(`${base}.jpg`);

    if (format.id === "perfil") {
      await sharp(Buffer.from(svg), { density: 72 * 4 })
        .resize(format.W * 2, format.H * 2, { kernel: "lanczos3" })
        .flatten({ background: INK })
        .withIccProfile("srgb")
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .withMetadata({ density: 72 })
        .toFile(out(`${base}-2x.png`));
      await record(`${base}-2x.png`);
    } else {
      await sharp(raster)
        .resize(1128, 188, { fit: "fill", kernel: "lanczos3" })
        .withIccProfile("srgb")
        .png({ compressionLevel: 9 })
        .toFile(out(`proofs/preview-${variant.id}-1128x188.png`));
    }

    const onScreen = Number((meta.bar * ON_SCREEN[format.id]).toFixed(2));
    if (onScreen < 1.4) {
      throw new Error(
        `${format.id} · ${variant.id}: la barra llega a ${onScreen} px en pantalla; la trama no sobrevive`,
      );
    }

    qa.formats[format.id].variants[variant.id] = {
      name: variant.name,
      primary: Boolean(variant.primary),
      capsules: shapes.length,
      markSize: `${Math.round(bounds.x1 - bounds.x0)}×${Math.round(bounds.y1 - bounds.y0)}`,
      bar: Number(meta.bar.toFixed(2)),
      barOnScreen: onScreen,
      scale: Number(meta.scale.toFixed(3)),
      megabytes: png.megabytes,
    };

    console.log(
      `  ${variant.id.padEnd(15)} marca ${qa.formats[format.id].variants[variant.id].markSize.padEnd(9)} · ` +
        `barra ${meta.bar.toFixed(1)} px (${onScreen} en pantalla) · ${String(png.megabytes).padStart(6)} MB`,
    );
  }
}

/* --- Pruebas in-situ ------------------------------------------------------ */

for (const variant of VARIANTS) {
  const card = await sharp({ create: { width: 1584, height: 620, channels: 3, background: "#ffffff" } })
    .composite([
      { input: out(`inplux-marca-perfil-${variant.id}.png`), top: 0, left: 0 },
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
    .toFile(out(`proofs/insitu-perfil-${variant.id}.png`));

  const pageCard = await sharp({ create: { width: 1128, height: 400, channels: 3, background: "#ffffff" } })
    .composite([
      { input: out(`proofs/preview-${variant.id}-1128x188.png`), top: 0, left: 0 },
      {
        input: await sharp(PAGE_LOGO)
          .resize(112, 112)
          .extend({ top: 9, bottom: 9, left: 9, right: 9, background: "#ffffff" })
          .png()
          .toBuffer(),
        top: 122,
        left: 24,
      },
    ])
    .png()
    .toBuffer();
  await sharp({ create: { width: 1208, height: 480, channels: 3, background: "#f4f2ee" } })
    .composite([{ input: pageCard, top: 40, left: 40 }])
    .png({ compressionLevel: 9 })
    .toFile(out(`proofs/insitu-pagina-${variant.id}.png`));
}

await writeFile(out("QA.json"), `${JSON.stringify(qa, null, 2)}\n`, "utf8");
console.log("\nPruebas in-situ de los dos formatos en proofs/");

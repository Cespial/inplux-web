/* ============================================================================
   INPLUX — banner de marca sola
   Portadas de LinkedIn sin una sola palabra.

     node brand/applied-frontier/linkedin/banner-marca/build-marca.mjs

   La referencia (banner de Karri Saarinen) dibuja un círculo con barras
   horizontales de extremos redondeados que se rompen en fragmentos hacia un
   ángulo.

   Una barra horizontal de extremos redondeados ES el módulo de Estratos: la
   técnica ajena y nuestra geometría son la misma primitiva. Así que no se
   copia el círculo — se dibuja la marca con cápsulas Estratos diminutas, y la
   disolución corre sobre el vector canónico +21/−18: se deshace por detrás y
   se resuelve hacia adelante, donde está la cápsula teal.

   Ruido → estructura → señal. El argumento dibujado, no escrito.

   El generador es determinista: PRNG con semilla, nunca Math.random. Un
   banner que cambia cada vez que se regenera no es un activo de marca.
   ========================================================================== */

import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const out = (f) => join(here, f);

const INK = "#0C0C0B";
const IVORY = "#F9F5EF";
const SIGNAL = "#00D7CA";
const LIMIT_BYTES = 3 * 1024 * 1024;

/* Geometría canónica: tres cápsulas 42:13 sobre el paso +21/−18. */
const MARK = [
  { x: 8, y: 57, teal: false },
  { x: 29, y: 39, teal: false },
  { x: 50, y: 21, teal: true },
];
const MARK_BOX = { x: 8, y: 21, w: 84, h: 49 };

/* --------------------------------------------------------------------------
   Formatos y sus zonas de exclusión, medidas sobre la interfaz real.
   -------------------------------------------------------------------------- */

const FORMATS = {
  perfil: {
    id: "perfil",
    label: "Perfil personal",
    W: 1584,
    H: 396,
    ratio: "4:1",
    avatar: { cx: 207, cy: 365, clearance: 186 },
    blocks: [{ name: "el botón de editar", x: 1450, y: 0, right: 1572, bottom: 152 }],
    place: { scale: 5.3, cx: 792, cy: 198 },
  },
  pagina: {
    id: "pagina",
    label: "Página de empresa",
    W: 4200,
    H: 700,
    ratio: "6:1",
    avatar: null,
    blocks: [{ name: "el logo de Página", x: 0, y: 380, right: 900, bottom: 700 }],
    place: { scale: 10.6, cx: 2380, cy: 350 },
  },
};

const VARIANTS = [
  {
    id: "01-disolucion",
    name: "Disolución",
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
    note: "Sin disolución: sólo la marca en líneas de barrido. La más silenciosa.",
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
    note: "Paso corto y barra delgada: la marca se vuelve trama y gana densidad de instrumento.",
    rows: 11.5,
    barRatio: 0.5,
    dissolveStart: 0.36,
    dissolveEnd: -0.04,
    strays: 52,
    seed: 21,
  },
  {
    id: "04-grande",
    name: "A sangre",
    note: "La marca crece hasta rozar los bordes. Más presencia, menos aire.",
    rows: 8.6,
    barRatio: 0.6,
    scaleFactor: 1.25,
    dissolveStart: 0.3,
    dissolveEnd: -0.1,
    strays: 40,
    seed: 3,
  },
];

/* --------------------------------------------------------------------------
   Construcción
   -------------------------------------------------------------------------- */

const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const clamp01 = (n) => Math.min(1, Math.max(0, n));

/* Extensión horizontal de una cápsula (rx = alto/2) a la altura y. */
const chordAt = (cap, y) => {
  const r = cap.h / 2;
  const dy = y - (cap.y + r);
  if (Math.abs(dy) > r) return null;
  const bulge = Math.sqrt(r * r - dy * dy);
  return { x0: cap.x + r - bulge, x1: cap.x + cap.w - r + bulge };
};

/* Progreso sobre el vector canónico: 0 detrás, 1 delante. */
const makeProgress = (box) => {
  const norm = Math.hypot(21, 18);
  const ux = 21 / norm;
  const uy = -18 / norm;
  const proj = [
    [box.x, box.y],
    [box.x + box.w, box.y],
    [box.x, box.y + box.h],
    [box.x + box.w, box.y + box.h],
  ].map(([x, y]) => x * ux + y * uy);
  const lo = Math.min(...proj);
  const hi = Math.max(...proj);
  return (x, y) => clamp01((x * ux + y * uy - lo) / (hi - lo));
};

const buildMark = (format, variant) => {
  const rand = mulberry32(variant.seed);
  /* La marca nunca ocupa más del 86 % del alto: las esquirlas de la
     disolución se extienden por debajo de su caja y necesitan ese margen.
     El tope se deriva del lienzo, no se ajusta a ojo por formato. */
  const maxScale = (format.H * 0.86) / MARK_BOX.h;
  const scale = Math.min(format.place.scale * (variant.scaleFactor ?? 1), maxScale);
  /* El paso se deriva de la altura de la cápsula, no del ancho del lienzo:
     así el barrido tiene la misma densidad óptica en 4:1 y en 6:1. */
  const pitch = (13 * scale) / variant.rows;
  const bar = pitch * variant.barRatio;

  const boxW = MARK_BOX.w * scale;
  const boxH = MARK_BOX.h * scale;
  const left = format.place.cx - boxW / 2;
  const top = format.place.cy - boxH / 2;

  const caps = MARK.map((m) => ({
    x: left + (m.x - MARK_BOX.x) * scale,
    y: top + (m.y - MARK_BOX.y) * scale,
    w: 42 * scale,
    h: 13 * scale,
    teal: m.teal,
  }));

  const box = { x: left, y: top, w: boxW, h: boxH };
  const progress = makeProgress(box);
  const shapes = [];
  const bounds = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };

  const push = (x, y, w, h, fill, opacity) => {
    if (w < h * 0.4) return;
    shapes.push(
      `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" ` +
        `rx="${(h / 2).toFixed(2)}" fill="${fill}"${opacity < 1 ? ` opacity="${opacity.toFixed(3)}"` : ""}/>`,
    );
    bounds.x0 = Math.min(bounds.x0, x);
    bounds.y0 = Math.min(bounds.y0, y);
    bounds.x1 = Math.max(bounds.x1, x + w);
    bounds.y1 = Math.max(bounds.y1, y + h);
  };

  for (const cap of caps) {
    const fill = cap.teal ? SIGNAL : IVORY;
    const rows = Math.floor(cap.h / pitch);
    const inset = (cap.h - (rows - 1) * pitch - bar) / 2;

    for (let r = 0; r < rows; r += 1) {
      const y = cap.y + inset + r * pitch;
      const chord = chordAt(cap, y + bar / 2);
      if (!chord) continue;

      const t = progress((chord.x0 + chord.x1) / 2, y + bar / 2);
      const d = variant.solid
        ? 0
        : clamp01((variant.dissolveStart - t) / (variant.dissolveStart - variant.dissolveEnd));

      if (d <= 0.02) {
        push(chord.x0, y, chord.x1 - chord.x0, bar, fill, 1);
        continue;
      }

      /* La barra se parte en celdas largas; cada una sobrevive con
         probabilidad cuadrática, así que sólo se rompe de verdad cerca del
         borde de atrás y la forma sigue leyéndose. */
      const span = chord.x1 - chord.x0;
      const cells = Math.max(2, Math.round(span / (bar * 7.6)));
      const cellW = span / cells;

      for (let c = 0; c < cells; c += 1) {
        const localD = clamp01(
          (variant.dissolveStart - progress(chord.x0 + (c + 0.5) * cellW, y + bar / 2)) /
            (variant.dissolveStart - variant.dissolveEnd),
        );
        if (rand() < localD * localD * 0.96) continue;

        const shrink = 1 - localD * 0.3;
        const jitter = (rand() - 0.5) * localD * bar * 1.5;
        push(
          chord.x0 + c * cellW + (cellW * (1 - shrink)) / 2 + jitter,
          y,
          cellW * shrink - bar * 0.55,
          bar,
          fill,
          1 - localD * 0.35,
        );
      }
    }
  }

  /* Esquirlas más allá del borde deshecho: la forma no termina en un filo,
     se disipa. */
  for (let i = 0; i < variant.strays; i += 1) {
    push(
      box.x - boxW * 0.16 + rand() * boxW * 0.62,
      box.y + boxH * (0.42 + rand() * 0.62),
      bar * (0.9 + rand() * 2.6),
      bar,
      IVORY,
      0.1 + rand() * 0.4,
    );
  }

  return { shapes, bounds, meta: { pitch, bar, scale } };
};

const assertClear = (format, variant, bounds) => {
  const label = `${format.id} · ${variant.id}`;
  if (format.avatar) {
    const { cx, cy, clearance } = format.avatar;
    const nx = Math.max(bounds.x0, Math.min(cx, bounds.x1));
    const ny = Math.max(bounds.y0, Math.min(cy, bounds.y1));
    if (Math.hypot(cx - nx, cy - ny) < clearance) {
      throw new Error(`${label}: la marca invade la zona de la foto de perfil`);
    }
  }
  for (const b of format.blocks) {
    if (bounds.x0 < b.right && bounds.x1 > b.x && bounds.y0 < b.bottom && bounds.y1 > b.y) {
      throw new Error(`${label}: la marca invade ${b.name}`);
    }
  }
  if (bounds.x0 < 0 || bounds.y0 < 0 || bounds.x1 > format.W || bounds.y1 > format.H) {
    throw new Error(`${label}: la marca se sale del lienzo`);
  }
};

const svgFor = (format, variant) => {
  const { shapes, bounds, meta } = buildMark(format, variant);
  assertClear(format, variant, bounds);

  return {
    bounds,
    count: shapes.length,
    meta,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${format.W}" height="${format.H}" viewBox="0 0 ${format.W} ${format.H}">
  <defs>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="17" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1 0"/>
    </filter>
    <radialGradient id="bloom" cx="${(format.place.cx + format.W * 0.068).toFixed(1)}" cy="${(format.place.cy - format.H * 0.24).toFixed(1)}" r="${(format.W * 0.145).toFixed(1)}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${SIGNAL}" stop-opacity=".085"/>
      <stop offset="1" stop-color="${SIGNAL}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${format.W}" height="${format.H}" fill="${INK}"/>
  <rect width="${format.W}" height="${format.H}" fill="url(#bloom)"/>
  ${shapes.join("\n  ")}
  <rect width="${format.W}" height="${format.H}" filter="url(#grain)" opacity="0.03"/>
</svg>`,
  };
};

/* --------------------------------------------------------------------------
   Salida
   -------------------------------------------------------------------------- */

await mkdir(out("proofs"), { recursive: true });
const AVATAR_REF = join(here, "../concepts-v4/proofs/avatar-reference-320.png");
const PAGE_LOGO = join(here, "../banner-v3/inplux-linkedin-page-logo-400.png");

const qa = { generatedAt: new Date().toISOString(), formats: {}, files: {} };

const record = async (name) => {
  const bytes = await readFile(out(name));
  const meta = await sharp(bytes).metadata();
  if (bytes.length > LIMIT_BYTES) throw new Error(`${name}: supera el tope de ${LIMIT_BYTES} bytes`);
  if (!meta.hasProfile) throw new Error(`${name}: falta el perfil ICC`);
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
  qa.formats[format.id] = { canvas: `${format.W}×${format.H}`, ratio: format.ratio, variants: {} };
  console.log(`\n${format.label} · ${format.W} × ${format.H} · ${format.ratio}`);

  for (const variant of VARIANTS) {
    const { svg, bounds, count, meta } = svgFor(format, variant);
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
      /* Maestro retina: el grano se genera de nuevo a esa densidad. */
      await sharp(Buffer.from(svg), { density: 72 * 4 })
        .resize(format.W * 2, format.H * 2, { kernel: "lanczos3" })
        .flatten({ background: INK })
        .withIccProfile("srgb")
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(out(`${base}-2x.png`));
      await record(`${base}-2x.png`);
    } else {
      await sharp(raster)
        .resize(1128, 188, { fit: "fill", kernel: "lanczos3" })
        .withIccProfile("srgb")
        .png({ compressionLevel: 9 })
        .toFile(out(`proofs/preview-${variant.id}-1128x188.png`));
    }

    qa.formats[format.id].variants[variant.id] = {
      name: variant.name,
      capsules: count,
      bounds: Object.fromEntries(Object.entries(bounds).map(([key, v]) => [key, Math.round(v)])),
      pitch: Number(meta.pitch.toFixed(2)),
      bar: Number(meta.bar.toFixed(2)),
      scale: Number(meta.scale.toFixed(3)),
      megabytes: png.megabytes,
    };

    console.log(
      `  ${variant.id.padEnd(15)} ${String(count).padStart(4)} cápsulas · ` +
        `paso ${meta.pitch.toFixed(1)} / barra ${meta.bar.toFixed(1)} · ${String(png.megabytes).padStart(6)} MB`,
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

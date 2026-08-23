/* ============================================================================
   INPLUX — banner de marca sola
   Portada de perfil 1584 × 396, sin una sola palabra.

     node brand/applied-frontier/linkedin/banner-marca/build-marca.mjs

   La referencia (banner de Karri Saarinen) dibuja un círculo con barras
   horizontales de extremos redondeados que se rompen en fragmentos hacia el
   ángulo inferior izquierdo.

   Una barra horizontal de extremos redondeados ES el módulo de Estratos. Su
   técnica y nuestra geometría son la misma primitiva — así que en vez de
   copiar su círculo, dibujamos la marca con su propio módulo: el Estratos
   grande construido con cápsulas Estratos diminutas.

   La disolución va sobre el vector canónico +21/−18: se deshace por detrás y
   se resuelve hacia adelante, donde está la cápsula teal.

   Zonas de exclusión de la interfaz que la composición respeta:
     · avatar        círculo centro (207, 365) r 160 · holgura r 186
     · botón editar  rect x 1450–1572 · y 0–152
   ========================================================================== */

import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const out = (f) => join(here, f);

const W = 1584;
const H = 396;
const INK = "#0C0C0B";
const IVORY = "#F9F5EF";
const SIGNAL = "#00D7CA";

const AVATAR = { cx: 207, cy: 365, clearance: 186 };
const EDIT = { x: 1450, y: 0, right: 1572, bottom: 152 };

/* Geometría canónica: tres cápsulas 42:13 sobre el paso +21/−18. */
const MARK = [
  { x: 8, y: 57, teal: false },
  { x: 29, y: 39, teal: false },
  { x: 50, y: 21, teal: true },
];
const MARK_BOX = { x: 8, y: 21, w: 84, h: 49 };

/* PRNG con semilla: el banner tiene que salir idéntico en cada corrida. */
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
  const ux = 21 / Math.hypot(21, 18);
  const uy = -18 / Math.hypot(21, 18);
  const corners = [
    [box.x, box.y],
    [box.x + box.w, box.y],
    [box.x, box.y + box.h],
    [box.x + box.w, box.y + box.h],
  ].map(([x, y]) => x * ux + y * uy);
  const lo = Math.min(...corners);
  const hi = Math.max(...corners);
  return (x, y) => clamp01((x * ux + y * uy - lo) / (hi - lo));
};

/* --------------------------------------------------------------------------
   Construcción de la marca en líneas de barrido.
   -------------------------------------------------------------------------- */

const buildMark = ({
  scale,
  cx,
  cy,
  pitch,
  barHeight,
  dissolveStart,
  dissolveEnd,
  strayCount,
  seed,
  solid = false,
}) => {
  const rand = mulberry32(seed);
  const boxW = MARK_BOX.w * scale;
  const boxH = MARK_BOX.h * scale;
  const left = cx - boxW / 2;
  const top = cy - boxH / 2;

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
    if (w < 1.2) return;
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
    const inset = (cap.h - (rows - 1) * pitch - barHeight) / 2;

    for (let r = 0; r < rows; r += 1) {
      const y = cap.y + inset + r * pitch;
      const chord = chordAt(cap, y + barHeight / 2);
      if (!chord) continue;

      const t = progress((chord.x0 + chord.x1) / 2, y + barHeight / 2);
      const d = solid ? 0 : clamp01((dissolveStart - t) / (dissolveStart - dissolveEnd));

      if (d <= 0.02) {
        push(chord.x0, y, chord.x1 - chord.x0, barHeight, fill, 1);
        continue;
      }

      /* La barra se parte en celdas; cada una sobrevive con probabilidad
         decreciente y se desplaza un poco. Así se deshace por el borde
         de atrás sin dejar de leerse la forma. */
      const span = chord.x1 - chord.x0;
      const cells = Math.max(2, Math.round(span / (barHeight * 7.6)));
      const cellW = span / cells;

      for (let c = 0; c < cells; c += 1) {
        const localT = progress(chord.x0 + (c + 0.5) * cellW, y + barHeight / 2);
        const localD = clamp01((dissolveStart - localT) / (dissolveStart - dissolveEnd));
        if (rand() < localD * localD * 0.96) continue;

        const shrink = 1 - localD * 0.3;
        const jitter = (rand() - 0.5) * localD * barHeight * 1.5;
        push(
          chord.x0 + c * cellW + (cellW * (1 - shrink)) / 2 + jitter,
          y,
          cellW * shrink - barHeight * 0.55,
          barHeight,
          fill,
          1 - localD * 0.35,
        );
      }
    }
  }

  /* Esquirlas sueltas más allá del borde deshecho: la forma no termina en un
     filo, se disipa. */
  for (let i = 0; i < strayCount; i += 1) {
    const t = rand();
    const along = box.x - boxW * 0.16 + t * boxW * 0.62;
    const across = box.y + boxH * (0.42 + rand() * 0.62);
    const size = barHeight * (0.9 + rand() * 2.6);
    const opacity = 0.1 + rand() * 0.4;
    push(along, across, size, barHeight, IVORY, opacity);
  }

  return { shapes, bounds, caps, box };
};

/* --------------------------------------------------------------------------
   Variantes
   -------------------------------------------------------------------------- */

const VARIANTS = [
  {
    id: "01-disolucion",
    name: "La marca deshaciéndose",
    note: "La marca dibujada con su propio módulo, disuelta por el ángulo de atrás y resuelta en la cápsula teal.",
    params: { scale: 5.3, cx: 792, cy: 198, pitch: 9, barHeight: 5, dissolveStart: 0.34, dissolveEnd: -0.06, strayCount: 34, seed: 7 },
  },
  {
    id: "02-limpia",
    name: "La marca en barrido, entera",
    note: "El mismo dibujo sin disolución: sólo la marca resuelta en líneas de barrido. La versión más silenciosa.",
    params: { scale: 5.3, cx: 792, cy: 198, pitch: 9, barHeight: 5, solid: true, strayCount: 0, dissolveStart: 0, dissolveEnd: 0, seed: 7 },
  },
  {
    id: "03-fina",
    name: "Barrido fino",
    note: "Paso más corto y barra más delgada: la marca se vuelve trama y gana densidad de instrumento.",
    params: { scale: 5.3, cx: 792, cy: 198, pitch: 6, barHeight: 3, dissolveStart: 0.36, dissolveEnd: -0.04, strayCount: 52, seed: 21 },
  },
  {
    id: "04-grande",
    name: "A sangre",
    note: "La marca crece hasta casi tocar los bordes. Menos aire, más presencia; el barrido se lee como estructura.",
    params: { scale: 6.6, cx: 830, cy: 198, pitch: 10, barHeight: 6, dissolveStart: 0.3, dissolveEnd: -0.1, strayCount: 40, seed: 3 },
  },
];

const svgFor = (v) => {
  const { shapes, bounds } = buildMark(v.params);

  /* La composición no puede invadir la interfaz de LinkedIn. */
  const nx = Math.max(bounds.x0, Math.min(AVATAR.cx, bounds.x1));
  const ny = Math.max(bounds.y0, Math.min(AVATAR.cy, bounds.y1));
  if (Math.hypot(AVATAR.cx - nx, AVATAR.cy - ny) < AVATAR.clearance) {
    throw new Error(`${v.id}: la marca invade la zona de la foto de perfil`);
  }
  if (bounds.x0 < EDIT.right && bounds.x1 > EDIT.x && bounds.y0 < EDIT.bottom && bounds.y1 > EDIT.y) {
    throw new Error(`${v.id}: la marca invade el botón de editar`);
  }

  return {
    bounds,
    count: shapes.length,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="17" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1 0"/>
    </filter>
    <radialGradient id="bloom" cx="${v.params.cx + 108}" cy="${v.params.cy - 96}" r="230" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${SIGNAL}" stop-opacity=".085"/>
      <stop offset="1" stop-color="${SIGNAL}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <rect width="${W}" height="${H}" fill="url(#bloom)"/>
  ${shapes.join("\n  ")}
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.03"/>
</svg>`,
  };
};

await mkdir(out("proofs"), { recursive: true });

for (const v of VARIANTS) {
  const { svg, bounds, count } = svgFor(v);
  await writeFile(out(`marca-${v.id}.svg`), `${svg}\n`, "utf8");
  await sharp(Buffer.from(svg), { density: 72 * 3 })
    .resize(W, H, { kernel: "lanczos3" })
    .flatten({ background: INK })
    .withIccProfile("srgb")
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .withMetadata({ density: 72 })
    .toFile(out(`marca-${v.id}.png`));

  console.log(
    `  ${v.id.padEnd(16)} ${String(count).padStart(4)} cápsulas · ` +
      `caja x ${Math.round(bounds.x0)}–${Math.round(bounds.x1)} · y ${Math.round(bounds.y0)}–${Math.round(bounds.y1)}`,
  );
}

console.log("\nCuatro variantes en banner-marca/");

/* --------------------------------------------------------------------------
   Prueba in-situ: la portada con la foto y el botón en su posición medida.
   -------------------------------------------------------------------------- */

const AV = join(here, "../concepts-v4/proofs/avatar-reference-320.png");

for (const v of VARIANTS) {
  const card = await sharp({
    create: { width: 1584, height: 620, channels: 3, background: "#ffffff" },
  })
    .composite([
      { input: out(`marca-${v.id}.png`), top: 0, left: 0 },
      { input: await sharp(AV).resize(320, 320).png().toBuffer(), top: 205, left: 47 },
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
    .toFile(out(`proofs/insitu-${v.id}.png`));
}

console.log("Pruebas in-situ en banner-marca/proofs/");

/* ============================================================================
   INPLUX — motor del dibujo de marca

   La marca dibujada con su propio módulo: cápsulas Estratos diminutas
   formando las tres cápsulas grandes. La disolución corre sobre el vector
   canónico +21/−18 — se deshace por detrás y se resuelve hacia adelante,
   donde está la cápsula teal.

   Determinista por contrato: PRNG con semilla, nunca Math.random. Un banner
   que cambia cada vez que se regenera no se puede versionar ni comparar, y
   entonces no es un activo de marca.
   ========================================================================== */

export const INK = "#0C0C0B";
export const IVORY = "#F9F5EF";
export const SIGNAL = "#00D7CA";

/* Geometría canónica: tres cápsulas 42:13 sobre el paso +21/−18. */
export const MARK = [
  { x: 8, y: 57, teal: false },
  { x: 29, y: 39, teal: false },
  { x: 50, y: 21, teal: true },
];
export const MARK_BOX = { x: 8, y: 21, w: 84, h: 49 };

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

/* --------------------------------------------------------------------------
   buildMark
     format  { W, H, minBar }
     place   { scale, cx, cy }
     variant { rows, barRatio, solid, dissolveStart, dissolveEnd, strays, seed }
   -------------------------------------------------------------------------- */

export const buildMark = (format, place, variant) => {
  const rand = mulberry32(variant.seed);

  /* La marca nunca ocupa más del 86 % del alto: las esquirlas se extienden
     por debajo de su caja y necesitan ese margen. El tope se calcula. */
  const maxScale = (format.H * 0.86) / MARK_BOX.h;
  const scale = Math.min(place.scale, maxScale);

  /* El paso se deriva de la altura de la cápsula, no del ancho del lienzo:
     así el barrido tiene la misma densidad óptica en cualquier proporción.
     Y no baja de un grosor mínimo de barra — una trama de un píxel impar es
     lo primero que se degrada cuando LinkedIn recomprime. */
  const capHeight = 13 * scale;
  const pitch = Math.max(capHeight / variant.rows, format.minBar / variant.barRatio);
  const bar = pitch * variant.barRatio;

  const boxW = MARK_BOX.w * scale;
  const boxH = MARK_BOX.h * scale;
  const left = place.cx - boxW / 2;
  const top = place.cy - boxH / 2;

  const caps = MARK.map((m) => ({
    x: left + (m.x - MARK_BOX.x) * scale,
    y: top + (m.y - MARK_BOX.y) * scale,
    w: 42 * scale,
    h: capHeight,
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
    const rows = Math.max(2, Math.floor(cap.h / pitch));
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

      /* Celdas largas y probabilidad cuadrática: la barra sólo se rompe de
         verdad cerca del borde de atrás, y la forma se sigue leyendo. */
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

  return { shapes, bounds, meta: { pitch, bar, scale, capHeight } };
};

/* La composición no puede invadir la interfaz de LinkedIn ni salirse. */
export const assertClear = (format, label, bounds) => {
  if (format.avatar) {
    const { cx, cy, clearance } = format.avatar;
    const nx = Math.max(bounds.x0, Math.min(cx, bounds.x1));
    const ny = Math.max(bounds.y0, Math.min(cy, bounds.y1));
    if (Math.hypot(cx - nx, cy - ny) < clearance) {
      throw new Error(`${label}: la marca invade la zona de la foto de perfil`);
    }
  }
  for (const b of format.blocks ?? []) {
    if (bounds.x0 < b.right && bounds.x1 > b.x && bounds.y0 < b.bottom && bounds.y1 > b.y) {
      throw new Error(`${label}: la marca invade ${b.name}`);
    }
  }
  if (bounds.x0 < 0 || bounds.y0 < 0 || bounds.x1 > format.W || bounds.y1 > format.H) {
    throw new Error(`${label}: la marca se sale del lienzo`);
  }
};

export const composeSvg = (format, place, shapes) => {
  /* El halo se dimensiona con la MARCA, no con el lienzo: atado al lienzo,
     una marca pequeña queda envuelta en una nube que no le pertenece. */
  const markH = MARK_BOX.h * place.scale;
  const bloomR = markH * 2.4;
  const bloomCx = place.cx + markH * 0.55;
  const bloomCy = place.cy - markH * 0.5;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${format.W}" height="${format.H}" viewBox="0 0 ${format.W} ${format.H}">
  <defs>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="17" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1 0"/>
    </filter>
    <radialGradient id="bloom" cx="${bloomCx.toFixed(1)}" cy="${bloomCy.toFixed(1)}" r="${bloomR.toFixed(1)}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${SIGNAL}" stop-opacity=".085"/>
      <stop offset="1" stop-color="${SIGNAL}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${format.W}" height="${format.H}" fill="${INK}"/>
  <rect width="${format.W}" height="${format.H}" fill="url(#bloom)"/>
  ${shapes.join("\n  ")}
  <rect width="${format.W}" height="${format.H}" filter="url(#grain)" opacity="0.03"/>
</svg>`;
};

/* ============================================================================
   INPLUX — Applied Frontier — conceptos v4
   Plantilla compartida.

   Todo lo que hay aquí sale idéntico en cada pieza: campo, lift del avatar,
   grano, viñeta y capa de prueba. Lo único que varía por pieza es la escena y
   el tratamiento de la firma.
   ========================================================================== */

export const CANVAS = { width: 1584, height: 396 };
export const RAIL = { x: 432, y: 40, right: 1544, bottom: 372 };
export const AVATAR = { cx: 207, cy: 365, r: 160, clearance: 186 };
export const EDIT_BUTTON = { x: 1450, y: 0, right: 1572, bottom: 152 };
export const LIMIT_BYTES = 3 * 1024 * 1024;

export const FIELD = `<svg class="layer field" viewBox="0 0 1584 396" aria-hidden="true">
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

export const GRAIN = `<svg class="layer grain" viewBox="0 0 1584 396" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <filter id="baseGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="17" stitchTiles="stitch"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1 0"/>
        </filter>
      </defs>
      <rect width="1584" height="396" filter="url(#baseGrain)"/>
    </svg>`;

export const PROOF = `<div class="proof-layer" aria-hidden="true">
      <div class="proof-shape proof-avatar-clear"></div>
      <div class="proof-shape proof-avatar"></div>
      <div class="proof-shape proof-button"></div>
      <div class="proof-shape proof-rail"></div>
    </div>`;

/* La firma por defecto: la que el criterio adversarial declara mal diseñada.
   Se conserva como línea base contra la que medir los tratamientos. */
export const DEFAULT_WORDMARK = `<p class="wordmark">APPLIED FRONTIER.</p>`;

export const page = ({ title, label, css = "", scene, wordmark = DEFAULT_WORDMARK }) => `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1584, initial-scale=1" />
    <title>INPLUX — Applied Frontier — ${title}</title>
    <link rel="stylesheet" href="base.css" />${css ? `\n    <style>${css}\n    </style>` : ""}
  </head>
  <body>
    <main class="cover" aria-label="INPLUX Applied Frontier — ${label}">
    ${FIELD}

    ${scene}

    ${wordmark}

    ${GRAIN}
    <div class="layer edge-shade" aria-hidden="true"></div>

    ${PROOF}
    </main>
  </body>
</html>
`;

/* --- Geometría de las zonas de exclusión ---------------------------------- */

export const rectHitsCircle = (r, { cx, cy, clearance }) => {
  const nx = Math.max(r.x, Math.min(cx, r.x + r.width));
  const ny = Math.max(r.y, Math.min(cy, r.y + r.height));
  return Math.hypot(cx - nx, cy - ny) < clearance;
};

export const rectsOverlap = (a, b) =>
  a.x < b.right && a.x + a.width > b.x && a.y < b.bottom && a.y + a.height > b.y;

/* Sonda común: fuentes, caja de la firma y contabilidad del evento teal.
   `fonts.check` sólo es cierto si algún elemento ya pidió la familia, y hay
   escenas que no usan la mono, así que se fuerza la carga antes. */
export const probePage = (tab) =>
  tab.evaluate(async () => {
    await Promise.all([
      document.fonts.load('16px "Geist INPLUX"'),
      document.fonts.load('16px "Geist Mono INPLUX"'),
    ]);
    const mark = document.querySelector(".wordmark");
    const box = mark?.getBoundingClientRect();
    const literalTeal = [...document.querySelectorAll('.cover [fill="#00D7CA"]')];
    return {
      fonts: {
        geist: document.fonts.check('16px "Geist INPLUX"'),
        geistMono: document.fonts.check('16px "Geist Mono INPLUX"'),
      },
      wordmark: box ? { x: box.x, y: box.y, width: box.width, height: box.height } : null,
      signals: document.querySelectorAll(".cover .signal").length,
      tealOutsideSignal: literalTeal.filter((n) => !n.closest(".signal")).length,
    };
  });

export const assertPiece = (probe, label, { wordmarkOptional = false } = {}) => {
  if (!probe.fonts.geist || !probe.fonts.geistMono) {
    throw new Error(`${label}: las fuentes empaquetadas no cargaron`);
  }
  if (probe.signals !== 1) {
    throw new Error(`${label}: debe haber exactamente un evento teal, hay ${probe.signals}`);
  }
  if (probe.tealOutsideSignal !== 0) {
    throw new Error(
      `${label}: hay ${probe.tealOutsideSignal} usos del teal literal fuera del evento designado`,
    );
  }

  const m = probe.wordmark;
  if (!m) {
    if (wordmarkOptional) return;
    throw new Error(`${label}: falta la firma`);
  }
  if (m.x < RAIL.x || m.x + m.width > RAIL.right || m.y < RAIL.y || m.y + m.height > RAIL.bottom) {
    throw new Error(`${label}: la firma se sale del carril: ${JSON.stringify(m)}`);
  }
  if (rectHitsCircle(m, AVATAR)) {
    throw new Error(`${label}: la firma choca con la foto de perfil: ${JSON.stringify(m)}`);
  }
  if (rectsOverlap(m, EDIT_BUTTON)) {
    throw new Error(`${label}: la firma choca con el botón de editar: ${JSON.stringify(m)}`);
  }
};

/* --- Prueba in-situ ------------------------------------------------------- */

export const INSITU = { width: 1664, height: 636 };

export const insituPage = ({ tag, cover }) => `<!doctype html><html lang="es"><head><meta charset="utf-8"/>
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
  <p class="tag">${tag}</p>
  <div class="card">
    <img class="cov" src="${cover}" alt=""/>
    <img class="av" src="proofs/avatar-reference-320.png" alt=""/>
    <div class="edit">&#9998;</div>
    <div class="body">
      <p class="nm">Cristian Espinal</p>
      <p class="hl">CTO @ inplux.co | B.A., M.A. in Economics and Ph.D. (c) in Engineering.</p>
    </div>
  </div>
</div></body></html>`;

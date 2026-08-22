/* ============================================================================
   INPLUX — Applied Frontier — conceptos v4
   Definición de las seis escenas.

   El marco (campo, lift, grano, viñeta, cartela, capa de prueba) lo pone la
   plantilla y es idéntico en los seis. Aquí sólo vive la escena de cada uno.

   Regla común: exactamente UN elemento con la clase `signal`, y ningún otro
   uso del teal literal fuera de él. El exportador lo verifica.

   Zona de la interfaz que ninguna escena debe ocupar visualmente:
   el botón de editar de LinkedIn, x ≥ 1450 · y ≤ 152.
   ========================================================================== */

const IVORY = "#F9F5EF";
const SIGNAL = "#00D7CA";

/* --- Perspectiva ----------------------------------------------------------
   La cápsula canónica se dibuja SIEMPRE como <rect width="42" height="13"
   rx="6.5">. La perspectiva la aplica una matriz, nunca una deformación de
   los números: la geometría del sistema sigue siendo exacta en el marcado.

   La matriz manda el eje de 42 a (w, 0) y el eje de 13 a v = (vx, vy).
   Los degradados que reciben estas formas son objectBoundingBox, para que
   sobrevivan a la transformación. */
const capsule = ({ x, y, w, vx, vy, fill, opacity = 1, filter, cls, stroke, strokeWidth }) => {
  const m = [w / 42, 0, vx / 13, vy / 13, x, y].map((n) => Number(n.toFixed(4))).join(" ");
  const gAttrs = [cls && `class="${cls}"`, filter && `filter="${filter}"`, `transform="matrix(${m})"`]
    .filter(Boolean)
    .join(" ");
  const rAttrs = [
    `width="42"`,
    `height="13"`,
    `rx="6.5"`,
    `fill="${fill}"`,
    opacity !== 1 && `opacity="${opacity}"`,
    stroke && `stroke="${stroke}"`,
    strokeWidth && `stroke-width="${(strokeWidth * 13) / Math.abs(vy || 13)}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `<g ${gAttrs}><rect ${rAttrs}/></g>`;
};

const dofFilters = (prefix, values) =>
  values
    .map(
      (sd, i) =>
        `<filter id="${prefix}${i}" x="-45%" y="-170%" width="190%" height="440%">` +
        `<feGaussianBlur stdDeviation="${sd}"/></filter>`,
    )
    .join("\n        ");

/* ==========================================================================
   A · EL ARTEFACTO
   Un fragmento de interfaz visto en ángulo, casi todo fuera de foco, con una
   sola fila en foco. Es el movimiento de Linear tal cual: no se describe el
   producto, se enseña.

   La interfaz es abstracta a propósito — filas, chips y estados como formas.
   No inventa expedientes, normas ni datos que puedan leerse como reales.
   ========================================================================== */

const rowsA = [
  { title: 62, chips: [46, 30], dot: 0.13 },
  { title: 81, chips: [62], dot: 0.09 },
  { title: 48, chips: [38, 54], dot: 0.15 },
  { title: 70, chips: [50, 26], dot: 0.13, focus: true },
  { title: 93, chips: [42], dot: 0.08 },
  { title: 55, chips: [34], dot: 0.11 },
  { title: 86, chips: [58, 40], dot: 0.07 },
];

/* Las dos copias del plano son complementarias: la desenfocada oculta la fila
   en foco y la nítida oculta todas las demás. La fila en foco se dibuja una
   sola vez — y el evento teal se cuenta una sola vez. */
const planeA = (mode) =>
  `<div class="a-plane">
        <div class="a-head"${mode === "focus" ? ' style="visibility:hidden"' : ""}>
          <span>ENTRADA</span><span>ESTADO</span><span>FUENTE</span>
        </div>
        ${rowsA
          .map((r) => {
            const hidden = mode === "focus" ? !r.focus : Boolean(r.focus);
            return `<div class="a-row${r.focus ? " is-focus" : ""}${hidden ? " is-hidden" : ""}">
          <i class="a-bar" style="width:${r.title}%"></i>
          ${r.chips.map((c) => `<i class="a-chip" style="width:${c}px"></i>`).join("")}
          <i class="a-dot${r.focus && !hidden ? " signal" : ""}"${r.focus ? "" : ` style="opacity:${r.dot}"`}></i>
        </div>`;
          })
          .join("\n        ")}
      </div>`;

const A = {
  id: "a-artefacto",
  n: "A",
  name: "El artefacto",
  blurb:
    "Un fragmento de interfaz en ángulo, casi todo fuera de foco. No se describe el producto: se enseña.",
  css: `
    .a-blur { filter: blur(2.6px); }
    .a-persp { position:absolute; inset:0; perspective: 2100px; perspective-origin: 48% 46%; }
    .a-plane {
      position:absolute; left:646px; top:18px; width:706px;
      transform: rotateX(54deg) rotateZ(-19deg);
      transform-origin: 50% 50%;
      font-family:"Geist Mono INPLUX",monospace;
    }
    .a-head {
      display:flex; gap:58px; padding:0 0 20px 6px;
      font-size:16px; font-weight:660; letter-spacing:3.4px; color:rgba(249,245,239,.15);
    }
    .a-row {
      display:flex; align-items:center; gap:18px;
      height:58px; padding:0 22px; margin-bottom:16px;
      background:rgba(249,245,239,.03);
      border:1px solid rgba(249,245,239,.055);
      border-radius:10px;
    }
    .a-row.is-focus {
      background:rgba(0,215,202,.05);
      border-color:rgba(0,215,202,.2);
      box-shadow:0 0 44px rgba(0,215,202,.10);
    }
    .a-row.is-hidden { visibility:hidden; }
    .a-bar { height:10px; border-radius:5px; background:rgba(249,245,239,.14); }
    .a-chip { height:18px; border-radius:9px; background:rgba(249,245,239,.075); flex:none; }
    .a-dot { width:13px; height:13px; border-radius:50%; background:${IVORY}; flex:none; margin-left:auto; }
    .a-dot.signal { background:${SIGNAL}; opacity:1; }`,
  scene: `<div class="layer scene">
      <div class="a-blur"><div class="a-persp">${planeA("blurred")}</div></div>
      <div class="a-persp">${planeA("focus")}</div>
    </div>
    <svg class="layer" style="z-index:2" viewBox="0 0 1584 396" aria-hidden="true">
      <defs>
        <radialGradient id="aGlow" cx="1040" cy="204" r="250" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${SIGNAL}" stop-opacity=".075"/>
          <stop offset="1" stop-color="${SIGNAL}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1584" height="396" fill="url(#aGlow)"/>
    </svg>`,
};

/* ==========================================================================
   B · LA FRONTERA ES UNA LÍNEA
   Una frontera es literalmente una línea. A la izquierda, fragmentos sin foco
   y sin ordenar. A la derecha, el mismo módulo alineado a retícula y nítido.
   La línea cambia de estado al cruzar: entra discontinua y sale continua.
   ========================================================================== */

const FRONTIER_Y = 212;
const CROSS_X = 1000;

const noiseB = [
  [92, 300, 74, 15], [186, 344, 44, -9], [258, 262, 96, 11], [78, 368, 56, -13],
  [338, 316, 52, 17], [416, 276, 82, -10], [304, 360, 38, 14], [478, 334, 66, -16],
  [560, 288, 48, 9], [524, 374, 78, -12], [640, 326, 58, 15], [706, 268, 42, -14],
  [750, 352, 72, 10], [826, 302, 54, -17], [884, 358, 38, 12], [910, 264, 62, -8],
  [150, 250, 40, 16], [396, 246, 34, -11], [676, 380, 50, 13],
];

/* El lado resuelto usa el módulo EXACTO (63 × 19.5, escala 1.5) repetido en
   una retícula estricta. La variación es cuántos módulos hay por fila, nunca
   deformar el módulo: eso es lo que hace que lea como sistema y no como ruido
   ordenado. Todo queda por encima de la línea y fuera del botón de editar. */
const gridB = [];
const perRowB = [5, 4, 5];
perRowB.forEach((count, row) => {
  for (let col = 0; col < count; col += 1) {
    gridB.push([1040 + col * 76, 100 + row * 36, 0.055 + row * 0.042 + col * 0.011]);
  }
});

const B = {
  id: "b-frontera",
  n: "B",
  name: "La frontera es una línea",
  blurb:
    "La línea cruza el ancho completo y cambia de estado al pasar: entra discontinua, sale continua. Tu foto queda del lado sin resolver.",
  css: "",
  scene: `<svg class="layer scene" viewBox="0 0 1584 396" aria-hidden="true">
      <defs>
        ${dofFilters("bDof", [10, 7, 4.4])}
        <radialGradient id="bResolved" cx="1230" cy="150" r="420" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${IVORY}" stop-opacity=".035"/>
          <stop offset="1" stop-color="${IVORY}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="bBloom" cx="${CROSS_X}" cy="${FRONTIER_Y}" r="196" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${SIGNAL}" stop-opacity=".11"/>
          <stop offset=".5" stop-color="${SIGNAL}" stop-opacity=".03"/>
          <stop offset="1" stop-color="${SIGNAL}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bFlare" x1="${CROSS_X - 230}" y1="${FRONTIER_Y}" x2="${CROSS_X + 280}" y2="${FRONTIER_Y}" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${SIGNAL}" stop-opacity="0"/>
          <stop offset=".45" stop-color="#5FF3E7" stop-opacity=".15"/>
          <stop offset="1" stop-color="${SIGNAL}" stop-opacity="0"/>
        </linearGradient>
        <filter id="bFlareBlur" x="-20%" y="-500%" width="140%" height="1100%">
          <feGaussianBlur stdDeviation="5"/>
        </filter>
      </defs>

      <rect width="1584" height="396" fill="url(#bResolved)"/>

      <!-- Lado sin resolver: el mismo módulo, rotado, sin alinear, fuera de foco. -->
      <g fill="${IVORY}">
        ${noiseB
          .map(
            ([x, y, w, rot], i) =>
              `<g transform="rotate(${rot} ${x + w / 2} ${y})" filter="url(#bDof${i % 3})" opacity="${(0.13 - (i % 5) * 0.017).toFixed(3)}">` +
              `<rect x="${x}" y="${y}" width="${w}" height="${Math.round((w * 13) / 42)}" rx="${((w * 13) / 84).toFixed(1)}"/></g>`,
          )
          .join("\n        ")}
      </g>

      <!-- Lado resuelto: mismo módulo, alineado y nítido. -->
      <g fill="${IVORY}">
        ${gridB
          .map(([x, y, o]) => `<rect x="${x}" y="${y}" width="63" height="19.5" rx="9.75" opacity="${o.toFixed(3)}"/>`)
          .join("\n        ")}
      </g>

      <rect width="1584" height="396" fill="url(#bBloom)"/>
      <rect x="${CROSS_X - 230}" y="${FRONTIER_Y - 2.5}" width="510" height="5" fill="url(#bFlare)" filter="url(#bFlareBlur)"/>

      <!-- La frontera. Entra discontinua, sale continua. -->
      <path d="M0 ${FRONTIER_Y}H${CROSS_X}" stroke="${IVORY}" stroke-opacity=".16" stroke-width="1.5" stroke-dasharray="3 10"/>
      <path d="M${CROSS_X} ${FRONTIER_Y}H1584" stroke="${IVORY}" stroke-opacity=".34" stroke-width="1.5"/>
      <circle class="signal" cx="${CROSS_X}" cy="${FRONTIER_Y}" r="5.5" fill="${SIGNAL}"/>

      <g stroke="${IVORY}" stroke-opacity=".15" stroke-width="1.25" fill="none">
        <path d="M${CROSS_X - 28} ${FRONTIER_Y - 32}v-15h15"/>
        <path d="M${CROSS_X + 28} ${FRONTIER_Y + 32}v15h-15"/>
      </g>
    </svg>`,
};

/* ==========================================================================
   C · REGISTRO DE EJECUCIÓN
   INPLUX es una fábrica agéntica; el banner es su traza. Tres carriles de
   corridas, la mayoría apagadas y completas, una activa. El foco cae sobre la
   activa: todo lo demás se desenfoca según su distancia a ella.
   ========================================================================== */

const LANE_END = 1424;

const laneC = (y, h, widths, opacities, activeIndex) => {
  let x = 432;
  const out = [];
  widths.forEach((w, i) => {
    if (x + w > LANE_END) return;
    const dist = activeIndex === null ? 3 : Math.abs(i - activeIndex);
    const f = `url(#cDof${Math.min(dist, 4)})`;
    const active = i === activeIndex;
    out.push(
      `<rect${active ? ' class="signal"' : ""} x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" ` +
        `fill="${active ? SIGNAL : IVORY}"${active ? "" : ` opacity="${opacities[i]}"`} filter="${f}"/>`,
    );
    if (active) {
      out.push(
        `<rect x="${x + 12}" y="${y + 4}" width="${w - 24}" height="2.5" rx="1.25" ` +
          `fill="#D6FFF9" opacity=".55"/>`,
      );
    }
    x += w + 8;
  });
  return out.join("\n        ");
};

const C = {
  id: "c-registro",
  n: "C",
  name: "Registro de ejecución",
  blurb:
    "La traza de una fábrica agéntica: tres carriles de corridas, una sola activa. Las micro-etiquetas son log de máquina, no mensaje.",
  css: "",
  scene: `<svg class="layer scene" viewBox="0 0 1584 396" aria-hidden="true">
      <defs>
        ${dofFilters("cDof", [0, 1.1, 2.4, 4.2, 7])}
        <radialGradient id="cBloom" cx="1178" cy="180" r="215" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${SIGNAL}" stop-opacity=".12"/>
          <stop offset=".5" stop-color="${SIGNAL}" stop-opacity=".03"/>
          <stop offset="1" stop-color="${SIGNAL}" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <g stroke="${IVORY}" stroke-width="1" fill="none">
        <g stroke-opacity=".05">
          ${Array.from({ length: 22 }, (_, i) => `<path d="M${476 + i * 44} 130v7"/>`).join("")}
        </g>
        <g stroke-opacity=".1">
          ${Array.from({ length: 6 }, (_, i) => `<path d="M${432 + i * 176} 130v15"/>`).join("")}
        </g>
      </g>

      <rect width="1584" height="396" fill="url(#cBloom)"/>

      <g>
        ${laneC(166, 28, [92, 148, 68, 116, 176, 84, 132, 96], [0.05, 0.075, 0.055, 0.095, 0.13, 0.09, null, 0.06], 6)}
      </g>
      <g>
        ${laneC(216, 13, [126, 72, 188, 96, 134, 158, 74, 110], [0.03, 0.045, 0.06, 0.04, 0.05, 0.065, 0.045, 0.035], null)}
      </g>
      <g>
        ${laneC(248, 13, [78, 164, 104, 142, 88, 176, 118, 64], [0.024, 0.035, 0.028, 0.045, 0.032, 0.05, 0.035, 0.026], null)}
      </g>

      <!-- Log de máquina: textura, no mensaje. -->
      <g font-family="Geist Mono INPLUX, monospace" font-size="13" font-weight="620"
         letter-spacing="2.4" fill="${IVORY}" fill-opacity=".085">
        <text x="432" y="114">plan</text>
        <text x="694" y="114">build</text>
        <text x="956" y="114">verify</text>
        <text x="1218" y="114">ship</text>
      </g>

      <g stroke="${IVORY}" stroke-opacity=".16" stroke-width="1.25" fill="none">
        <path d="M1146 156v-15h15"/>
        <path d="M1300 204v15h-15"/>
      </g>
    </svg>`,
};

/* ==========================================================================
   D · ESTADO DE SISTEMA
   Los productos que ya están fuera, listados como entradas de sistema. Es la
   afirmación de prueba más fuerte del repertorio — y la que más envejece.
   ========================================================================== */

const productsD = [
  { name: "KELSEN", w: 96 },
  { name: "GOBIA", w: 122 },
  { name: "TRIBAI", w: 108 },
  { name: "LAUDOS", w: 84 },
];

const D = {
  id: "d-estado",
  n: "D",
  name: "Estado de sistema",
  blurb:
    "Los productos que ya están fuera, listados como entradas de sistema. La afirmación de prueba más fuerte — y la que más envejece.",
  css: "",
  scene: `<svg class="layer scene" viewBox="0 0 1584 396" aria-hidden="true">
      <defs>
        ${dofFilters("dDof", [0, 1.6, 3.6])}
        <linearGradient id="dCap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="${IVORY}" stop-opacity=".9"/>
          <stop offset="1" stop-color="${IVORY}" stop-opacity=".35"/>
        </linearGradient>
        <radialGradient id="dBloom" cx="898" cy="94" r="164" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${SIGNAL}" stop-opacity=".1"/>
          <stop offset="1" stop-color="${SIGNAL}" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="1584" height="396" fill="url(#dBloom)"/>

      <circle class="signal" cx="898" cy="92" r="5" fill="${SIGNAL}"/>
      <text x="926" y="98" font-family="Geist Mono INPLUX, monospace" font-size="14"
            font-weight="640" letter-spacing="3.2" fill="${IVORY}" fill-opacity=".32">EN PRODUCCIÓN</text>
      <path d="M898 122H1408" stroke="${IVORY}" stroke-opacity=".085" stroke-width="1"/>

      ${productsD
        .map((p, i) => {
          const y = 170 + i * 56;
          const dof = [1, 0, 0, 1][i];
          const o = [0.42, 0.72, 0.72, 0.42][i];
          return (
            `<g filter="url(#dDof${dof})" opacity="${o}">` +
            capsule({ x: 898, y: y - 13, w: p.w, vx: 0, vy: 26, fill: "url(#dCap)", opacity: 0.34 }) +
            `<text x="1046" y="${y + 8}" font-family="Geist Mono INPLUX, monospace" font-size="26" ` +
            `font-weight="560" letter-spacing="1.4" fill="${IVORY}" fill-opacity=".78">${p.name}</text></g>`
          );
        })
        .join("\n      ")}

      <g stroke="${IVORY}" stroke-opacity=".09" stroke-width="1.25">
        <path d="M1400 344h16M1408 336v16"/>
      </g>
    </svg>`,
};

/* ==========================================================================
   E · ESTRATOS EN EJECUCIÓN
   El sistema geométrico ya se llama Estratos. Aquí la cápsula gana espesor y
   el nombre deja de ser metáfora. Siete losas ascienden sobre el paso
   canónico +21/−18; sólo la más lejana — producción — está en foco y lleva
   el teal. Las cercanas quedan desenfocadas en primer plano: producción es
   lo único que enfoca.
   ========================================================================== */

const SLABS = 7;
const slabGeom = Array.from({ length: SLABS }, (_, i) => {
  const k = 1 - 0.042 * i;
  return {
    i,
    k,
    x: 872 + 42 * i,
    y: 342 - 36 * i,
    w: 172 * k,
    vx: -26 * k,
    vy: -42 * k,
    t: 21 * k,
    opacity: [0.055, 0.07, 0.088, 0.112, 0.145, 0.195, 1][i],
    blur: [7, 4.9, 3.4, 2.2, 1.2, 0.5, 0][i],
  };
});

const E = {
  id: "e-estratos",
  n: "E",
  name: "Estratos en ejecución",
  blurb:
    "La cápsula gana espesor y el nombre del sistema deja de ser metáfora. Sólo la losa más lejana —producción— está en foco.",
  css: "",
  scene: `<svg class="layer scene" viewBox="0 0 1584 396" aria-hidden="true">
      <defs>
        ${dofFilters(
          "eDof",
          slabGeom.map((s) => s.blur),
        )}
        <linearGradient id="eTop" x1="0" y1="0" x2=".55" y2="1">
          <stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/>
          <stop offset="1" stop-color="#FFFFFF" stop-opacity=".42"/>
        </linearGradient>
        <linearGradient id="eLeader" x1="0" y1="0" x2=".5" y2="1">
          <stop offset="0" stop-color="#5BEFE1"/>
          <stop offset=".5" stop-color="${SIGNAL}"/>
          <stop offset="1" stop-color="#00A79E"/>
        </linearGradient>
        <radialGradient id="eBloom" cx="1216" cy="128" r="232" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${SIGNAL}" stop-opacity=".11"/>
          <stop offset=".5" stop-color="${SIGNAL}" stop-opacity=".03"/>
          <stop offset="1" stop-color="${SIGNAL}" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="1584" height="396" fill="url(#eBloom)"/>

      ${[...slabGeom]
        .reverse()
        .map((s) => {
          const f = `url(#eDof${s.i})`;
          const leader = s.i === SLABS - 1;
          const common = { x: s.x, w: s.w, vx: s.vx, vy: s.vy, filter: f };
          /* Canto: la misma cápsula desplazada hacia abajo. El solape de las
             dos copias es lo que lee como espesor. */
          const edge = capsule({
            ...common,
            y: s.y + s.t,
            fill: leader ? "#04524D" : "#000000",
            opacity: leader ? 1 : 0.62,
          });
          const face = capsule({
            ...common,
            y: s.y,
            fill: leader ? "url(#eLeader)" : "url(#eTop)",
            opacity: leader ? 1 : s.opacity,
            cls: leader ? "signal" : undefined,
          });
          /* Filo iluminado sobre el borde de ataque. */
          const rim = capsule({
            x: s.x + 3,
            y: s.y - 1.5,
            w: s.w - 6,
            vx: s.vx,
            vy: s.vy,
            fill: "#FFFFFF",
            opacity: leader ? 0.5 : Math.min(0.42, s.opacity * 2.1),
            filter: f,
          });
          return `<g class="slab">${edge}${face}${rim}</g>`;
        })
        .join("\n      ")}

      <g stroke="${IVORY}" stroke-opacity=".16" stroke-width="1.25" fill="none">
        <path d="M1150 96v-15h15"/>
        <path d="M1300 148v15h-15"/>
      </g>
    </svg>`,
};

/* ==========================================================================
   F · UN SOLO OBJETO
   Negro y una sola cápsula, enorme, en foco perfecto, iluminada de un lado
   sobre un suelo apenas insinuado. Máxima confianza, cero explicación.
   ========================================================================== */

const F_X = 812;
const F_Y = 176;
const F_W = 578;
const F_VX = -76;
const F_VY = -104;

const F = {
  id: "f-objeto",
  n: "F",
  name: "Un solo objeto",
  blurb:
    "Una sola cápsula, enorme, iluminada de un lado sobre el vacío. Máxima confianza; nadie sabrá a qué te dedicas por el banner.",
  css: "",
  scene: `<svg class="layer scene" viewBox="0 0 1584 396" aria-hidden="true">
      <defs>
        <linearGradient id="fBody" x1=".08" y1="0" x2=".72" y2="1">
          <stop offset="0" stop-color="#4c514a"/>
          <stop offset=".28" stop-color="#2c302b"/>
          <stop offset=".68" stop-color="#181b17"/>
          <stop offset="1" stop-color="#0d0f0c"/>
        </linearGradient>
        <linearGradient id="fSpec" x1=".1" y1="0" x2=".45" y2="1">
          <stop offset="0" stop-color="#FFFFFF" stop-opacity=".46"/>
          <stop offset=".2" stop-color="#FFFFFF" stop-opacity=".07"/>
          <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="fHorizon" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stop-color="${IVORY}" stop-opacity="0"/>
          <stop offset="1" stop-color="${IVORY}" stop-opacity=".055"/>
        </linearGradient>
        <radialGradient id="fBounce" cx="${F_X + F_W * 0.78}" cy="${F_Y + 108}" r="290" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${SIGNAL}" stop-opacity=".075"/>
          <stop offset="1" stop-color="${SIGNAL}" stop-opacity="0"/>
        </radialGradient>
        <filter id="fShadow" x="-40%" y="-160%" width="180%" height="420%">
          <feGaussianBlur stdDeviation="30"/>
        </filter>
        <filter id="fEdgeSoft" x="-40%" y="-180%" width="180%" height="460%">
          <feGaussianBlur stdDeviation="9"/>
        </filter>
      </defs>

      <!-- Suelo apenas insinuado: sin él, el objeto flota en la nada. -->
      <rect x="0" y="238" width="1584" height="158" fill="url(#fHorizon)"/>

      <!-- Sombra de contacto: se lee porque hay suelo debajo. -->
      <ellipse cx="${F_X + F_W / 2 - 26}" cy="${F_Y + 128}" rx="318" ry="34"
               fill="#000" opacity=".85" filter="url(#fShadow)"/>

      <!-- Luz de canto teal asomando por el filo inferior derecho. -->
      <g class="signal" filter="url(#fEdgeSoft)">
        ${capsule({ x: F_X + 11, y: F_Y + 19, w: F_W, vx: F_VX, vy: F_VY, fill: SIGNAL, opacity: 0.62 })}
      </g>

      <!-- Espesor -->
      ${capsule({ x: F_X + 2, y: F_Y + 30, w: F_W, vx: F_VX, vy: F_VY, fill: "#0b0d0a" })}

      <!-- Cuerpo -->
      ${capsule({ x: F_X, y: F_Y, w: F_W, vx: F_VX, vy: F_VY, fill: "url(#fBody)" })}

      <!-- Reflejo especular: barrido de luz por el hombro superior izquierdo. -->
      ${capsule({ x: F_X + 5, y: F_Y + 2.5, w: F_W - 10, vx: F_VX, vy: F_VY, fill: "url(#fSpec)" })}

      <rect width="1584" height="396" fill="url(#fBounce)"/>
    </svg>`,
};

export const CONCEPTS = [A, B, C, D, E, F];

/* ============================================================================
   INPLUX — Applied Frontier — tratamientos de la firma

   Criterio adversarial sobre la línea base (Geist 38 px ivory, colocada a
   media altura del carril):

     · flota — no está anclada a ningún elemento, borde ni línea de base;
     · vive en el registro tipográfico más cobarde: ni firma ni titular;
     · compite en brillo con el único evento teal de la pieza;
     · es tipografía display encogida, no tipografía de firma;
     · el punto final es un gesto de escala que a ese tamaño parece errata;
     · es el único elemento que no hace trabajo conceptual: sólo anuncia.

   El problema no es el tamaño: es la especie. Estos seis tratamientos le
   cambian la naturaleza, no la escala.
   ========================================================================== */

const IVORY = "#F9F5EF";

/* Las tres cápsulas canónicas del símbolo, en monocromo: el evento teal de la
   pieza es de la escena, y el contrato prohíbe un segundo. */
const ESTRATOS = (scale) => `
        <g transform="translate(0 0) scale(${scale})" fill="${IVORY}">
          <rect x="8" y="57" width="42" height="13" rx="6.5"/>
          <rect x="29" y="39" width="42" height="13" rx="6.5"/>
          <rect x="50" y="21" width="42" height="13" rx="6.5"/>
        </g>`;

export const WORDMARKS = [
  {
    id: "00-base",
    name: "Línea base",
    note: "Lo que hay hoy. Se conserva para medir contra ella, no porque funcione.",
    html: `<p class="wordmark">APPLIED FRONTIER.</p>`,
  },

  {
    id: "01-metadata",
    name: "Metadata de sistema",
    note: "Deja de ser cartela y pasa a ser metadata ambiental: mono diminuta, muy apagada, anclada al borde superior del carril. El mismo registro que las micro-etiquetas del campo.",
    css: `
    .wordmark {
      left: 432px; top: 56px;
      display: flex; align-items: center; gap: 14px;
      font-family: "Geist Mono INPLUX", monospace;
      font-size: 13px; font-weight: 640; letter-spacing: 3.4px;
      text-transform: uppercase;
      color: rgba(249,245,239,.34);
    }
    .wordmark::before {
      content: ""; width: 34px; height: 1px; background: rgba(249,245,239,.2);
    }`,
    html: `<p class="wordmark">INPLUX / APPLIED FRONTIER</p>`,
  },

  {
    id: "02-lockup",
    name: "Lockup con el símbolo",
    note: "Una firma de verdad: el símbolo canónico y el texto bloqueados como unidad, con su propio espacio interno. Deja de flotar porque el símbolo la ancla.",
    html: `<svg class="layer" style="z-index:8" viewBox="0 0 1584 396" aria-hidden="true">
      <g class="wordmark" transform="translate(432 288)">
        <g transform="translate(0 -31.65)">${ESTRATOS(0.58)}
        </g>
        <text x="74" y="0" font-family="Geist Mono INPLUX, monospace" font-size="15"
              font-weight="660" letter-spacing="4.2" fill="${IVORY}" fill-opacity=".52">APPLIED FRONTIER</text>
      </g>
    </svg>`,
  },

  {
    id: "02b-lockup-grabado",
    name: "Lockup grabado",
    note: "El lockup con la materia de la firma grabada: el símbolo apoya en la superficie y el texto se corta dentro de ella. Es el tratamiento que menos compite con el evento teal sin dejar de identificar.",
    html: `<svg class="layer" style="z-index:8" viewBox="0 0 1584 396" aria-hidden="true">
      <g class="wordmark" transform="translate(432 288)">
        <g transform="translate(0 -31.65)" opacity=".34">${ESTRATOS(0.58)}
        </g>
        <g font-family="Geist Mono INPLUX, monospace" font-size="15" font-weight="660" letter-spacing="4.2">
          <text x="74" y="-1.1" fill="${IVORY}" fill-opacity=".3">APPLIED FRONTIER</text>
          <text x="74" y="0" fill="#0E0F0D">APPLIED FRONTIER</text>
        </g>
      </g>
    </svg>`,
  },

  {
    id: "03-grabada",
    name: "Grabada",
    note: "No se pone encima del fondo: se corta dentro. Relleno casi del color del suelo, un filo de luz arriba y sombra abajo. Se lee de cerca y desaparece en miniatura, que es exactamente lo que debe hacer una firma.",
    css: `
    .wordmark {
      left: 432px; top: 272px;
      font-size: 46px; font-weight: 560; letter-spacing: -2.4px;
      color: #161814;
      text-shadow:
        0 1.5px 0 rgba(249,245,239,.22),
        0 -1px 0 rgba(0,0,0,.9);
    }`,
    html: `<p class="wordmark">APPLIED FRONTIER.</p>`,
  },

  {
    id: "04-canto",
    name: "En el canto",
    note: "Rotada sobre el filo izquierdo del carril, como la referencia grabada en el canto de un instrumento. Apoya en el borde en vez de flotar, y desocupa por completo el centro de la pieza.",
    css: `
    .wordmark {
      left: 432px; top: 40px;
      width: 20px; height: 332px;
      display: flex; align-items: center; justify-content: center;
    }
    .wordmark span {
      transform: rotate(180deg);
      writing-mode: vertical-rl;
      font-family: "Geist Mono INPLUX", monospace;
      font-size: 12.5px; font-weight: 640; letter-spacing: 4.6px;
      text-transform: uppercase;
      color: rgba(249,245,239,.3);
      white-space: nowrap;
    }`,
    html: `<p class="wordmark"><span>APPLIED FRONTIER</span></p>`,
  },

  {
    id: "05-en-escena",
    name: "Tumbada en la escena",
    note: "La tipografía obedece la misma geometría que todo lo demás: se acuesta sobre el plano por el que ascienden las losas, con su mismo sesgo, y va grabada en él. Deja de estar encima de la escena y pasa a estar dentro. Un plano tenue debajo le da superficie sobre la que apoyar.",
    html: `<svg class="layer" style="z-index:8" viewBox="0 0 1584 396" aria-hidden="true">
      <defs>
        <linearGradient id="wmPlane" x1="0" y1="0" x2=".6" y2="1">
          <stop offset="0" stop-color="${IVORY}" stop-opacity=".05"/>
          <stop offset="1" stop-color="${IVORY}" stop-opacity="0"/>
        </linearGradient>
        <filter id="wmPlaneSoft" x="-25%" y="-60%" width="150%" height="220%">
          <feGaussianBlur stdDeviation="16"/>
        </filter>
      </defs>
      <!-- La superficie sobre la que se acuesta el texto. Sin ella el sesgo
           lee como deformación en vez de como perspectiva. -->
      <polygon points="452,344 906,344 992,290 538,290" fill="url(#wmPlane)" filter="url(#wmPlaneSoft)"/>
      <g class="wordmark" transform="translate(486 330) matrix(1 0 0.619 1 0 0) scale(1 0.62)">
        <g font-family="Geist INPLUX, sans-serif" font-size="54" font-weight="540" letter-spacing="-2.1">
          <text x="0" y="-2" fill="${IVORY}" fill-opacity=".23">APPLIED FRONTIER.</text>
          <text x="0" y="0" fill="#0E0F0D">APPLIED FRONTIER.</text>
        </g>
      </g>
    </svg>`,
  },

  {
    id: "06-ninguna",
    name: "Ninguna",
    note: "El avatar y tu titular ya te identifican. La portada se queda como atmósfera pura. Es la opción más confiada y la única que no se puede corregir a medias.",
    html: "",
  },
];

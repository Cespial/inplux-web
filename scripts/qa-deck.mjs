/**
 * Arnés de QA del deck: mide cajas, no capturas.
 *
 * Una captura hay que mirarla; una caja se compara. Este arnés recorre las
 * quince láminas en tres tamaños, mide la caja del contenido de cada una
 * contra el hueco que dejan las dos barras del chrome, cuenta palabras y
 * figuras, recoge los errores de consola y guarda una captura POR SI hace
 * falta juzgar a ojo. Lo que decide si algo está mal son los números.
 *
 * Uso:
 *   npm run build && npm run start -- -p 3210      (en otra terminal)
 *   QA_BASE=http://localhost:3210 npm run qa:deck
 *   QA_BASE=http://localhost:3210 npm run qa:deck -- portada evidencia
 *
 * Sale con código distinto de cero si alguna lámina choca, desborda, solapa o
 * si la consola escupió un error. NO entra en `npm run check`: necesita un
 * servidor levantado y es una herramienta de desarrollo.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.QA_BASE ?? "http://localhost:3210";
const SALIDA = "qa-out";

const VPS = [
  { n: "escritorio", width: 1440, height: 900 },
  { n: "proyector", width: 1920, height: 1080 },
  { n: "movil", width: 390, height: 844 },
];

/**
 * El orden de las láminas y los dos altos del chrome salen de las fuentes de
 * TypeScript, nunca copiados a mano: `src/content/deck.ts` manda en los ids y
 * `src/components/deck/chrome/altos.ts` en los altos. El día que el chrome
 * crezca o entre una lámina, este arnés se entera; una copia local no.
 *
 * Se leen con `npx tsx --eval`, el mismo patrón de
 * `scripts/verify-deck-model.test.mjs` y el que documenta el propio
 * `altos.ts`. Node sabe quitarle los tipos a `altos.ts` —no tiene ninguno—,
 * pero `deck.ts` importa `./work` sin extensión y eso el cargador de Node no
 * lo resuelve: con `tsx` los dos módulos se leen igual y no hay dos maneras.
 */
function leerModelo() {
  const r = spawnSync(
    "npx",
    [
      "tsx",
      "--eval",
      `
      import { SLIDES } from "./src/content/deck.ts";
      import { ALTO_BARRA_SUPERIOR, ALTO_BARRA_INFERIOR }
        from "./src/components/deck/chrome/altos.ts";
      process.stdout.write(JSON.stringify({
        ids: SLIDES.map((s) => s.id),
        sup: ALTO_BARRA_SUPERIOR,
        inf: ALTO_BARRA_INFERIOR,
      }));
    `,
    ],
    { cwd: RAIZ, encoding: "utf8" },
  );
  if (r.status !== 0) {
    console.error(`No se pudo leer el modelo del deck:\n${r.stderr}`);
    process.exit(2);
  }
  return JSON.parse(r.stdout);
}

const MODELO = leerModelo();
const IDS = process.argv.slice(2).length ? process.argv.slice(2) : MODELO.ids;
const DESCONOCIDOS = IDS.filter((id) => !MODELO.ids.includes(id));
if (DESCONOCIDOS.length) {
  console.error(`Estas láminas no existen en el modelo: ${DESCONOCIDOS.join(", ")}`);
  process.exit(2);
}

// Preflight: sin servidor, `page.goto` revienta con un ECONNREFUSED que no le
// dice a nadie qué le falta.
try {
  const r = await fetch(`${BASE}/deck/presentacion`, { redirect: "manual" });
  if (r.status >= 400) throw new Error(`respondió ${r.status}`);
} catch (e) {
  console.error(
    `No hay deck en ${BASE} (${e.message}).\n` +
      "Levántalo en otra terminal:  npm run build && npm run start -- -p 3210",
  );
  process.exit(2);
}

/**
 * La condición de reposo, que corre DENTRO de la página.
 *
 * ⚠️ `waitForSelector` no sirve: la lámina que entra lleva
 * `animation-delay: 150ms` con `fill: both`, así que existe en el DOM y está
 * a `opacity: 0` mientras lo que se ve es la saliente. Medir ahí devuelve una
 * caja desplazada hasta ~3 rem —el `--deck-shift`— y encima de la lámina
 * equivocada.
 *
 * Cuatro condiciones, y las cuatro hacen falta:
 *
 * 1. No queda ningún slot `saliente` montado. Mientras vive, hay DOS
 *    `[data-slide]` en el DOM.
 * 2. La lámina pedida es la que cuelga del slot `activa`. El `data-estado`
 *    vive en el slot, no en la `<section>`: es lo único que distingue cuál se
 *    está viendo.
 * 3. Ninguna animación del slot activo sigue corriendo. Se pregunta al SLOT
 *    con `{ subtree: true }` y no a `document`: `document.getAnimations()`
 *    incluye cualquier animación infinita de otra parte del sitio y con una
 *    sola de esas esta espera no terminaría nunca.
 * 4. La opacidad calculada del slot es 1, y las fuentes ya cargaron. Lo
 *    tercero por sí solo tiene un agujero: entre que el nodo aparece y el
 *    navegador crea la animación, `getAnimations()` devuelve una lista VACÍA
 *    y `.every()` sobre una lista vacía es `true`, así que la espera pasaría
 *    justo en el peor momento. La opacidad no miente: durante el retardo
 *    vale 0. Y medir con la fuente de respaldo puesta da una caja que no es
 *    la que verá nadie.
 */
function enReposo(id) {
  if (document.querySelector('[data-estado="saliente"]') !== null) return false;
  const slot = document.querySelector('[data-estado="activa"]');
  if (slot === null) return false;
  if (slot.querySelector(`section[data-slide="${CSS.escape(id)}"]`) === null) return false;
  if (slot.getAnimations({ subtree: true }).some((a) => a.playState === "running")) return false;
  if (getComputedStyle(slot).opacity !== "1") return false;
  return document.fonts.status === "loaded";
}

/** La medición, que también corre dentro de la página. */
function medir({ id, sup, inf }) {
  const seccion = document.querySelector(
    `[data-estado="activa"] section[data-slide="${CSS.escape(id)}"]`,
  );
  if (seccion === null) return { falta: true };

  const nombre = (el) => {
    const texto = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 24);
    return texto ? `${el.tagName.toLowerCase()}«${texto}»` : el.tagName.toLowerCase();
  };

  // ⚠️ Los hijos ocultos por breakpoint devuelven un rect en ceros —esquina
  // superior izquierda, alto 0— y contaminan cualquier `Math.min` sobre
  // coordenadas: un solo `display: none` deja el `top` clavado en 0 y la
  // lámina parece meterse debajo de la barra superior siempre.
  const hijos = [...seccion.children].filter((c) => c.getBoundingClientRect().height > 0);
  if (hijos.length === 0) return { vacia: true };

  const cajas = hijos.map((c) => c.getBoundingClientRect());
  const top = Math.min(...cajas.map((c) => c.top));
  const bot = Math.max(...cajas.map((c) => c.bottom));
  const izq = Math.min(...cajas.map((c) => c.left));
  const der = Math.max(...cajas.map((c) => c.right));

  // Los hermanos en flujo de una lámina no pueden pisarse: la `<section>` es
  // una retícula con `align-content: center` y `gap`, así que dos cajas
  // intersecándose en los dos ejes es texto encima de texto. Lo posicionado
  // fuera de flujo queda excluido: superponerse es justo su oficio.
  const enFlujo = hijos.filter((c) => {
    const pos = getComputedStyle(c).position;
    return pos !== "absolute" && pos !== "fixed";
  });
  const solapes = [];
  for (let i = 0; i < enFlujo.length; i += 1) {
    for (let j = i + 1; j < enFlujo.length; j += 1) {
      const a = enFlujo[i].getBoundingClientRect();
      const b = enFlujo[j].getBoundingClientRect();
      const dx = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const dy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      // Un píxel de margen: el redondeo de subpíxel de dos cajas pegadas no
      // es un solape.
      if (dx > 1 && dy > 1) solapes.push(`${nombre(enFlujo[i])}×${nombre(enFlujo[j])}`);
    }
  }

  const texto = seccion.innerText.replace(/\s+/g, " ").trim();
  return {
    top: Math.round(top),
    bot: Math.round(bot),
    izq: Math.round(izq),
    der: Math.round(der),
    alto: window.innerHeight,
    ancho: window.innerWidth,
    // El hueco real entre barras, con los altos que manda `altos.ts`.
    hueco: [sup, window.innerHeight - inf],
    choca: top < sup - 1 || bot > window.innerHeight - inf + 1,
    // `overflow-x: hidden` del riel RECORTA lo que se sale de lado, así que a
    // ojo no se ve: no hay barra de desplazamiento ni nada asomando. El rect
    // sí lo sabe, porque no lo recorta nadie.
    desborda: izq < -1 || der > window.innerWidth + 1,
    solapes,
    palabras: texto ? texto.split(" ").length : 0,
    figuras: seccion.querySelectorAll("svg, img").length,
  };
}

let fallos = 0;
const nav = await chromium.launch();

for (const vp of VPS) {
  await mkdir(`${SALIDA}/${vp.n}`, { recursive: true });
  const ctx = await nav.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    locale: "es-CO",
  });
  const p = await ctx.newPage();

  // Los errores se atribuyen a la lámina que estaba puesta cuando salieron:
  // «hay un error en el deck» no sirve para arreglar nada.
  let visitando = "(carga)";
  const errs = [];
  p.on("pageerror", (e) => errs.push(`${visitando} · PAGEERROR ${String(e).slice(0, 160)}`));
  p.on(
    "console",
    (m) => m.type() === "error" && errs.push(`${visitando} · CONSOLE ${m.text().slice(0, 160)}`),
  );

  for (const id of IDS) {
    visitando = id;
    await p.goto(`${BASE}/deck/presentacion#${id}`, { waitUntil: "load" });

    // ⚠️ El `data-estado="activa"` vive en el SLOT, no en la `<section>`.
    // Durante la transición hay dos `[data-slide]` montados y sin ese filtro
    // se mide la saliente la mitad de las veces: un fallo que se lee como
    // ruido aleatorio, no como error.
    await p.waitForSelector(`[data-estado="activa"] section[data-slide="${id}"]`, {
      timeout: 15000,
    });
    await p.waitForFunction(enReposo, id, { timeout: 15000, polling: "raf" });

    const m = await p.evaluate(medir, { id, sup: MODELO.sup, inf: MODELO.inf });
    const etiqueta = `${vp.n} · ${id.padEnd(14)}`;

    if (m.falta) {
      console.log(`${etiqueta} ⚠️ LA LÁMINA ACTIVA NO ES ESTA`);
      fallos += 1;
    } else if (m.vacia) {
      console.log(`${etiqueta} ⚠️ SIN HIJOS VISIBLES`);
      fallos += 1;
    } else {
      const alertas = [];
      if (m.choca) {
        alertas.push(
          `⚠️ CHOCA CON LAS BARRAS (caja ${m.top}→${m.bot}, hueco libre ${m.hueco[0]}→${m.hueco[1]})`,
        );
      }
      if (m.desborda) {
        alertas.push(
          `⚠️ DESBORDA A LO ANCHO (caja ${m.izq}→${m.der}, viewport 0→${m.ancho})`,
        );
      }
      if (m.solapes.length) {
        alertas.push(`⚠️ HIJOS SOLAPADOS: ${[...new Set(m.solapes)].slice(0, 3).join(", ")}`);
      }
      fallos += alertas.length;
      console.log(
        `${etiqueta} ${String(m.palabras).padStart(3)} pal · ${m.figuras} fig · ` +
          `caja ${m.top}→${m.bot} ${alertas.length ? alertas.join(" ") : "ok"}`,
      );
    }

    await p.screenshot({ path: `${SALIDA}/${vp.n}/${id}.png` });
  }

  if (errs.length) {
    const unicos = [...new Set(errs)];
    console.log(`  errores de consola (${vp.n}): ${unicos.length}`);
    for (const e of unicos.slice(0, 5)) console.log(`    ${e}`);
    fallos += unicos.length;
  }
  await ctx.close();
}

await nav.close();
console.log(
  fallos
    ? `\n${fallos} problema(s) · capturas en ${SALIDA}/`
    : `\nsin choques ni errores · capturas en ${SALIDA}/`,
);
process.exitCode = fallos ? 1 : 0;

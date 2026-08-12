/**
 * Arnés de QA del deck: mide cajas, no capturas.
 *
 * Una captura hay que mirarla; una caja se compara. Este arnés recorre las
 * quince láminas en tres tamaños y de cada una comprueba cinco cosas:
 *
 *   · que su caja quepa en el hueco que dejan las dos barras del chrome;
 *   · que no se salga de lado —el riel la recorta y a ojo no se ve—;
 *   · que ningún texto se pinte encima de otro;
 *   · que ningún texto se quede recortado dentro de una caja que lo tapa;
 *   · que todo lo que ocupa sitio se PINTE de verdad.
 *
 * Las tres últimas barren el árbol entero de la lámina, no sus hijos
 * directos. Una lámina real es una rejilla de tarjetas, una lista o una
 * figura con pie: si la comprobación que justifica el arnés —texto encima de
 * texto— solo mirara un nivel, se apagaría con el primer contenedor.
 *
 * Cuenta además palabras VISIBLES y figuras, recoge los errores de consola
 * atribuidos a la lámina que los soltó, y guarda una captura por si hace
 * falta juzgar a ojo. Lo que decide si algo está mal son los números.
 *
 * Uso:
 *   npm run build && npm run start -- -p 3210      (en otra terminal)
 *   QA_BASE=http://localhost:3210 npm run qa:deck
 *   QA_BASE=http://localhost:3210 npm run qa:deck -- portada evidencia
 *
 * Sale con 1 si alguna lámina falla cualquiera de las cinco o si la consola
 * escupió un error; con 2 si no hay servidor o no se pudo leer el modelo. NO
 * entra en `npm run check`: necesita un servidor levantado y es una
 * herramienta de desarrollo.
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
  try {
    return JSON.parse(r.stdout);
  } catch (e) {
    // Cualquier escritura suelta a stdout desde `deck.ts` o sus imports
    // —un `console.log` de depuración, un aviso de una dependencia— deja de
    // ser JSON. Sin esta guarda muere con un SyntaxError que no señala a
    // nadie.
    console.error(
      `El modelo del deck no devolvió JSON (${e.message}).\n` +
        "Algo escribe en stdout desde src/content/deck.ts o sus imports.\n" +
        `Salida recibida: ${JSON.stringify(r.stdout.slice(0, 400))}`,
    );
    process.exit(2);
  }
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
 * 4. La opacidad calculada del slot es 1. Lo tercero por sí solo tiene un
 *    agujero: entre que el nodo aparece y el navegador crea la animación,
 *    `getAnimations()` devuelve una lista VACÍA y `.every()` sobre una lista
 *    vacía es `true`, así que la espera pasaría justo en el peor momento. La
 *    opacidad no miente: durante el retardo vale 0.
 *
 * Las fuentes se esperan aparte, con `document.fonts.ready`. `fonts.status`
 * NO sirve para esto: vale «loaded» siempre que no haya una carga en curso,
 * incluso antes de que se haya pedido la primera fuente.
 */
function enReposo(id) {
  if (document.querySelector('[data-estado="saliente"]') !== null) return false;
  const slot = document.querySelector('[data-estado="activa"]');
  if (slot === null) return false;
  if (slot.querySelector(`section[data-slide="${CSS.escape(id)}"]`) === null) return false;
  if (slot.getAnimations({ subtree: true }).some((a) => a.playState === "running")) return false;
  return getComputedStyle(slot).opacity === "1";
}

/**
 * La medición, que también corre dentro de la página.
 *
 * Barre el árbol ENTERO de la lámina, no sus hijos directos. Mirar un solo
 * nivel funciona mientras una lámina sea un título suelto y se apaga con el
 * primer contenedor: dos párrafos pisándose dentro de un `<div>` son nietos,
 * y a un nivel de profundidad no existen.
 */
function medir({ id, sup, inf }) {
  const seccion = document.querySelector(
    `[data-estado="activa"] section[data-slide="${CSS.escape(id)}"]`,
  );
  if (seccion === null) return { falta: true };

  const cache = new Map();
  const estilo = (el) => {
    let v = cache.get(el);
    if (v === undefined) {
      v = getComputedStyle(el);
      cache.set(el, v);
    }
    return v;
  };

  const nombre = (el) => {
    const texto = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 24);
    return texto ? `${el.tagName.toLowerCase()}«${texto}»` : el.tagName.toLowerCase();
  };

  /**
   * ¿Por qué no se pinta este nodo? Se mira él y toda su ascendencia hasta la
   * lámina, porque la opacidad y la visibilidad las hereda el subárbol
   * entero.
   *
   * Se distinguen dos motivos y NO son lo mismo:
   *
   *   · `display: none` es la manera legítima de esconder algo en un
   *     breakpoint. No ocupa sitio, no cuenta y no se denuncia.
   *   · `opacity: 0` y `visibility: hidden` sí OCUPAN sitio: mueven la caja
   *     de la lámina y suman sus palabras sin que nadie las lea. Eso es un
   *     fallo, y encima de los mudos: una lámina invisible tampoco da error
   *     de consola, que es la misma razón por la que existe la barrera de
   *     movimiento reducido.
   */
  const motivos = new Map();
  const noSePinta = (el) => {
    if (motivos.has(el)) return motivos.get(el);
    let motivo = null;
    for (let n = el; n !== null && n !== seccion.parentElement; n = n.parentElement) {
      const e = estilo(n);
      if (e.display === "none") {
        motivo = "display";
        break;
      }
      if (e.visibility === "hidden" || e.visibility === "collapse") {
        motivo = "fantasma";
        break;
      }
      if (Number.parseFloat(e.opacity) < 0.05) {
        motivo = "fantasma";
        break;
      }
    }
    motivos.set(el, motivo);
    return motivo;
  };

  // Las palabras se cuentan nodo de texto a nodo de texto y solo si su rama
  // se pinta. `innerText` no vale: respeta `display: none` y `visibility`,
  // pero un subárbol a `opacity: 0` le suma sus palabras como si se leyeran.
  let palabras = 0;
  let palabrasApagadas = 0;
  const paseador = document.createTreeWalker(seccion, NodeFilter.SHOW_TEXT);
  for (let nodo = paseador.nextNode(); nodo !== null; nodo = paseador.nextNode()) {
    const t = (nodo.nodeValue ?? "").replace(/\s+/g, " ").trim();
    if (t === "") continue;
    const cuantas = t.split(" ").length;
    if (noSePinta(nodo.parentElement) === null) palabras += cuantas;
    else if (noSePinta(nodo.parentElement) === "fantasma") palabrasApagadas += cuantas;
  }

  const todos = [seccion, ...seccion.querySelectorAll("*")];

  // Los fantasmas: lo que ocupa sitio y no se ve. Se nombra la RAÍZ del
  // subárbol apagado, no cada uno de sus descendientes.
  const fantasmas = todos
    .filter(
      (el) =>
        noSePinta(el) === "fantasma" &&
        el.parentElement !== null &&
        noSePinta(el.parentElement) === null &&
        (el.textContent ?? "").trim() !== "",
    )
    .map((el) => `${nombre(el)} a opacidad ${estilo(el).opacity}/visibilidad ${estilo(el).visibility}`);

  // ⚠️ Los hijos ocultos por breakpoint devuelven un rect en ceros —esquina
  // superior izquierda, alto 0— y contaminan cualquier `Math.min` sobre
  // coordenadas: un solo `display: none` deja el `top` clavado en 0 y la
  // lámina parece meterse debajo de la barra superior siempre. Los fantasmas
  // se caen por el mismo sitio, pero por otra razón: tienen caja de verdad y
  // la moverían sin que se vea nada.
  const hijos = [...seccion.children].filter(
    (c) => c.getBoundingClientRect().height > 0 && noSePinta(c) === null,
  );
  if (hijos.length === 0) return { vacia: true, fantasmas, palabrasApagadas };

  const cajas = hijos.map((c) => c.getBoundingClientRect());
  const top = Math.min(...cajas.map((c) => c.top));
  const bot = Math.max(...cajas.map((c) => c.bottom));
  const izq = Math.min(...cajas.map((c) => c.left));
  const der = Math.max(...cajas.map((c) => c.right));

  /**
   * Los contenedores de texto de la lámina, a cualquier profundidad.
   *
   * Se excluye lo `inline`: su rect es la UNIÓN de sus líneas, así que dos
   * hermanos inline de un párrafo de varias líneas se «solapan» sin pisarse
   * un píxel en pantalla. El texto de un inline lo representa su bloque.
   * Se excluye también lo posicionado fuera de flujo: superponerse es justo
   * su oficio.
   */
  const bloquesConTexto = todos.filter((el) => {
    if (noSePinta(el) !== null) return false;
    if (el.getBoundingClientRect().height <= 0) return false;
    const e = estilo(el);
    if (e.display === "inline" || e.display === "contents") return false;
    if (e.position === "absolute" || e.position === "fixed") return false;
    return (el.textContent ?? "").trim() !== "";
  });

  // Dos cajas de texto intersecándose en los dos ejes son texto encima de
  // texto. Los pares de ascendencia se saltan: que una tarjeta contenga a su
  // título no es un solape, es la definición de contener.
  const solapes = [];
  for (let i = 0; i < bloquesConTexto.length; i += 1) {
    for (let j = i + 1; j < bloquesConTexto.length; j += 1) {
      const A = bloquesConTexto[i];
      const B = bloquesConTexto[j];
      if (A.contains(B) || B.contains(A)) continue;
      const a = A.getBoundingClientRect();
      const b = B.getBoundingClientRect();
      const dx = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const dy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      // Un píxel de margen: el redondeo de subpíxel de dos cajas pegadas no
      // es un solape.
      if (dx > 1 && dy > 1) solapes.push(`${nombre(A)}×${nombre(B)}`);
    }
  }

  // Texto guillotinado. Una caja de alto fijo con `overflow` distinto de
  // `visible` corta lo que le sobra SIN dejar rastro: no hay barra de
  // desplazamiento, no hay nada asomando, la caja de la lámina cabe
  // perfectamente y la frase acaba a media letra. `scrollHeight` sí sabe
  // cuánto se quedó fuera.
  const recortes = [];
  for (const el of todos) {
    if (noSePinta(el) !== null) continue;
    if ((el.textContent ?? "").trim() === "") continue;
    const e = estilo(el);
    const sobraY = el.scrollHeight - el.clientHeight;
    const sobraX = el.scrollWidth - el.clientWidth;
    if (e.overflowY !== "visible" && sobraY > 1) {
      recortes.push(`${nombre(el)} deja fuera ${sobraY} px de alto`);
    }
    if (e.overflowX !== "visible" && sobraX > 1) {
      recortes.push(`${nombre(el)} deja fuera ${sobraX} px de ancho`);
    }
  }

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
    recortes,
    fantasmas,
    palabras,
    palabrasApagadas,
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
    // Medir con la fuente de respaldo puesta da una caja que no verá nadie:
    // `--font-serif` carga con `display: swap` y el título es lo único que
    // hay en la lámina.
    await p.evaluate(() => document.fonts.ready.then(() => true));
    await p.waitForFunction(enReposo, id, { timeout: 15000, polling: "raf" });

    const m = await p.evaluate(medir, { id, sup: MODELO.sup, inf: MODELO.inf });
    const etiqueta = `${vp.n} · ${id.padEnd(14)}`;

    if (m.falta) {
      console.log(`${etiqueta} ⚠️ LA LÁMINA ACTIVA NO ES ESTA`);
      fallos += 1;
    } else if (m.vacia) {
      const porFantasmas = m.fantasmas.length
        ? ` (lo único que ocupa sitio no se pinta: ${m.fantasmas.slice(0, 2).join(", ")})`
        : "";
      console.log(`${etiqueta} ⚠️ SIN HIJOS VISIBLES${porFantasmas}`);
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
        alertas.push(`⚠️ TEXTO SOBRE TEXTO: ${[...new Set(m.solapes)].slice(0, 3).join(", ")}`);
      }
      if (m.recortes.length) {
        alertas.push(`⚠️ TEXTO RECORTADO: ${[...new Set(m.recortes)].slice(0, 3).join(", ")}`);
      }
      if (m.fantasmas.length) {
        alertas.push(
          `⚠️ OCUPA SITIO Y NO SE PINTA (${m.palabrasApagadas} pal): ` +
            `${[...new Set(m.fantasmas)].slice(0, 3).join(", ")}`,
        );
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

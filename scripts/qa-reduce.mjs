/**
 * La barrera de movimiento reducido.
 *
 * Recorre el deck entero a golpe de flecha con y sin `prefers-reduced-motion`
 * y comprueba tres cosas en cada paso: que no salió ningún error, que la
 * lámina que quedó puesta es la que tocaba, y que se está VIENDO.
 *
 * Las dos últimas no son de adorno. Una corrida que solo mira la consola pasa
 * en verde aunque las teclas no hagan nada —el fallo clásico de medir con la
 * ventana en segundo plano— y también aunque el bloque de
 * `prefers-reduced-motion` se olvide del `animation-delay` y deje la lámina
 * nueva invisible: sin errores, sin deck.
 *
 * Se corre contra el build de producción, no contra `dev`:
 *   npm run build && npm run start -- -p 3210
 *   QA_BASE=http://localhost:3210 npm run qa:reduce
 */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** ⚠️ El mismo puerto que `qa-deck.mjs`, y por la misma razón: ver su nota. */
const PUERTO_CANONICO = 3210;
const BASE = process.env.QA_BASE ?? `http://localhost:${PUERTO_CANONICO}`;

// Los ids salen de `src/content/deck.ts`, que es quien manda en el orden.
const r = spawnSync(
  "npx",
  [
    "tsx",
    "--eval",
    `
    import { SLIDES } from "./src/content/deck.ts";
    process.stdout.write(JSON.stringify(SLIDES.map((s) => s.id)));
  `,
  ],
  { cwd: RAIZ, encoding: "utf8" },
);
if (r.status !== 0) {
  console.error(`No se pudo leer el modelo del deck:\n${r.stderr}`);
  process.exit(2);
}
// Cualquier escritura suelta a stdout desde `deck.ts` o sus imports deja de
// ser JSON: sin la guarda muere con un SyntaxError que no señala a nadie.
let IDS;
try {
  IDS = JSON.parse(r.stdout);
} catch (e) {
  console.error(
    `El modelo del deck no devolvió JSON (${e.message}).\n` +
      "Algo escribe en stdout desde src/content/deck.ts o sus imports.\n" +
      `Salida recibida: ${JSON.stringify(r.stdout.slice(0, 400))}`,
  );
  process.exit(2);
}

try {
  const respuesta = await fetch(`${BASE}/deck/presentacion`, { redirect: "manual" });
  if (respuesta.status >= 400) throw new Error(`respondió ${respuesta.status}`);
} catch (e) {
  console.error(
    `No hay deck en ${BASE} (${e.message}).\n` +
      `Levántalo en otra terminal:  npm run build && npm run start -- -p ${PUERTO_CANONICO}`,
  );
  process.exit(2);
}

/** ¿Es esta la lámina activa? Corre dentro de la página. */
function esLaActiva(id) {
  return (
    document.querySelector(`[data-estado="activa"] section[data-slide="${CSS.escape(id)}"]`) !== null
  );
}

/**
 * Despierta el riel antes de empezar a contar.
 *
 * ⚠️ `load` NO es hidratación. El listener de teclado se registra en un efecto,
 * así que las flechas pulsadas antes de que React hidrate se pierden **sin dar
 * error**: el recorrido queda desfasado una lámina y la consola sigue limpia.
 * Es la misma forma del fallo que en F1 silenciaba las teclas con la ventana en
 * segundo plano, y la razón de que este script compruebe DÓNDE aterriza cada
 * flecha en vez de fiarse de que no hubo errores.
 *
 * Se pulsa `End` hasta que el deck contesta —eso demuestra que el teclado ya es
 * suyo— y se vuelve con `Home`. A partir de ahí el recorrido medido empieza
 * limpio.
 */
async function despertar(p, primero, ultimo) {
  for (let intento = 0; intento < 40; intento += 1) {
    await p.keyboard.press("End");
    try {
      await p.waitForFunction(esLaActiva, ultimo, { timeout: 500 });
      await p.keyboard.press("Home");
      await p.waitForFunction(esLaActiva, primero, { timeout: 3000 });
      await p.waitForTimeout(700);
      return intento;
    } catch {
      // Todavía no hay quien escuche: se reintenta.
    }
  }
  return -1;
}

/** Qué lámina se está viendo, y si se ve. Corre dentro de la página. */
function estado() {
  const slot = document.querySelector('[data-estado="activa"]');
  const seccion = slot?.querySelector("section[data-slide]") ?? null;
  return {
    id: seccion?.dataset.slide ?? null,
    opacidad: slot === null ? "0" : getComputedStyle(slot).opacity,
    montadas: document.querySelectorAll("section[data-slide]").length,
  };
}

const nav = await chromium.launch();
let fallos = 0;

for (const modo of ["reduce", "no-preference"]) {
  const ctx = await nav.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: modo,
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));

  await p.goto(`${BASE}/deck/presentacion#${IDS[0]}`, { waitUntil: "load" });
  const anomalias = [];

  const intentos = await despertar(p, IDS[0], IDS[IDS.length - 1]);
  if (intentos === -1) {
    console.log(`reducedMotion=${modo}: el deck no responde al teclado`);
    fallos += 1;
    await ctx.close();
    continue;
  }

  for (let i = 1; i < IDS.length; i += 1) {
    await p.keyboard.press("ArrowRight");
    // Aquí sí vale el reloj: no se está midiendo una caja, se está esperando a
    // que el deck acabe de moverse. La entrada dura 380 ms más 150 de espera.
    await p.waitForTimeout(700);
    const e = await p.evaluate(estado);
    if (e.id !== IDS[i]) anomalias.push(`flecha ${i}: esperaba ${IDS[i]} y hay ${e.id}`);
    else if (e.opacidad !== "1") anomalias.push(`${e.id} quedó a opacidad ${e.opacidad}`);
    else if (e.montadas !== 1) anomalias.push(`${e.id}: ${e.montadas} láminas montadas a la vez`);
  }

  const unicos = [...new Set(errs)];
  console.log(`reducedMotion=${modo}:`);
  console.log(`  consola: ${unicos.length ? unicos.slice(0, 5).join(" | ") : "SIN ERRORES"}`);
  console.log(
    `  recorrido: ${anomalias.length ? anomalias.slice(0, 5).join(" | ") : `${IDS.length} láminas, todas puestas y visibles`}` +
      (intentos ? ` (el teclado tardó ${intentos} reintento(s) en despertar)` : ""),
  );
  fallos += unicos.length + anomalias.length;
  await ctx.close();
}

await nav.close();
console.log(fallos ? `\n${fallos} problema(s)` : "\nsin errores ni saltos");
process.exitCode = fallos ? 1 : 0;

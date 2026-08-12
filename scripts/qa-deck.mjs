/**
 * Arnés de QA del deck: mide cajas, no capturas.
 *
 * Una captura hay que mirarla; una caja se compara. Este arnés recorre las
 * quince láminas en tres tamaños y de cada una comprueba seis cosas:
 *
 *   · que su caja quepa en el hueco que dejan las dos barras del chrome;
 *   · que no se salga de lado —el riel la recorta y a ojo no se ve—;
 *   · que ningún texto se pinte encima de otro;
 *   · que ninguna línea de texto quede TAPADA por lo que se pinta encima;
 *   · que ningún texto se quede recortado dentro de una caja que lo corta;
 *   · que todo lo que ocupa sitio se PINTE de verdad.
 *
 * Las cuatro últimas barren el árbol entero de la lámina, no sus hijos
 * directos. Una lámina real es una rejilla de tarjetas, una lista o una
 * figura con pie: si la comprobación que justifica el arnés —texto encima de
 * texto— solo mirara un nivel, se apagaría con el primer contenedor.
 *
 * Cuenta además palabras VISIBLES y figuras, recoge los errores de consola
 * atribuidos a la lámina que los soltó, y guarda una captura por si hace
 * falta juzgar a ojo. Lo que decide si algo está mal son los números.
 *
 * ⚠️ **Lo que este arnés no puede ver, y no va a poder.** Todo lo de arriba se
 * mide preguntando qué se pinta ENCIMA de un texto. Una figura decorativa que
 * compite con los glifos desde DETRÁS —un nodo de la retícula asomando por el
 * ojo de una «ó», que es el defecto real que trajo la portada de la Tarea 8—
 * no está encima de nada: la respuesta correcta a la pregunta que hace este
 * arnés es «ahí no hay nadie», y la lámina está mal igual. Ninguna medida de
 * cajas, glifos ni alfa distingue una retícula que acompaña de una que
 * estorba. **Las trece láminas con figura que vienen hay que mirarlas en la
 * captura**, y `ok` en esta salida no dice nada sobre eso.
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
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * ⚠️ **El puerto del deck es el 3210, y solo el 3210.** No es capricho: es la
 * única defensa barata contra el fallo que ya ocurrió. Cuatro números
 * distintos circulando —3210, 3410, 3412, 3521— significan que en cualquier
 * momento hay servidores viejos escuchando en tres de ellos, y un servidor
 * viejo contesta 200 con un build de hace horas. Un solo puerto convierte ese
 * fallo en un `EADDRINUSE` que se ve al arrancar.
 *
 * Este número manda en los tres sitios donde aparece: el valor por omisión de
 * `QA_BASE`, el mensaje de «no hay deck en…» y el encabezado de arriba.
 */
const PUERTO_CANONICO = 3210;
const BASE = process.env.QA_BASE ?? `http://localhost:${PUERTO_CANONICO}`;
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
let PRIMERA_RESPUESTA = "";
try {
  const r = await fetch(`${BASE}/deck/presentacion`, { redirect: "manual" });
  if (r.status >= 400) throw new Error(`respondió ${r.status}`);
  PRIMERA_RESPUESTA = await r.text();
} catch (e) {
  console.error(
    `No hay deck en ${BASE} (${e.message}).\n` +
      `Levántalo en otra terminal:  npm run build && npm run start -- -p ${PUERTO_CANONICO}`,
  );
  process.exit(2);
}

/**
 * La firma del build. **Para el arnés un 200 es un 200**, y eso ya costó una
 * corrida entera: un `next-server` de una sesión anterior seguía escuchando en
 * el puerto, contestaba 200 con un build de hacía horas y el arnés midió una
 * portada que ya no existía sin quejarse de nada.
 *
 * Next escribe el identificador del build en `.next/BUILD_ID` y lo emite en el
 * árbol serializado de la página, así que basta buscarlo en el cuerpo que ya
 * trajo el preflight.
 *
 * Dos decisiones deliberadas:
 *
 *   · **Aviso, no aborto.** Un desajuste puede ser legítimo —alguien
 *     reconstruyó mientras el servidor viejo sigue vivo, y quiere ver
 *     justamente eso—, y un arnés que se niega a correr se deja de correr.
 *     Lo que no puede pasar es que mida en silencio otro código.
 *   · **Solo contra `localhost`.** Si `QA_BASE` apunta a un preview
 *     desplegado, el `.next/BUILD_ID` de esta máquina no tiene por qué
 *     coincidir con el de allá, y el aviso sería ruido puro.
 */
function esLocal(base) {
  try {
    const h = new URL(base).hostname;
    return h === "localhost" || h === "127.0.0.1" || h === "::1" || h === "[::1]";
  } catch {
    return false;
  }
}

if (esLocal(BASE)) {
  let local = null;
  try {
    local = readFileSync(path.join(RAIZ, ".next", "BUILD_ID"), "utf8").trim();
  } catch {
    // Sin `.next/BUILD_ID` no hay nada que comparar: no se ha construido
    // todavía en esta copia, y el servidor de enfrente es de otra. No es este
    // el sitio para dictaminarlo.
  }
  if (local !== null && local !== "" && !PRIMERA_RESPUESTA.includes(local)) {
    const servido = /\\"b\\":\\"([\w-]+)\\"/.exec(PRIMERA_RESPUESTA)?.[1] ?? "no identificado";
    console.warn(
      `⚠️ ${BASE} NO está sirviendo este build.\n` +
        `   .next/BUILD_ID local: ${local}\n` +
        `   build que contesta:   ${servido}\n` +
        "   Suele ser un servidor de otra sesión que se quedó escuchando en el puerto.\n" +
        `   Sigo midiendo, pero lo que salga es de OTRO código.\n`,
    );
  }
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

  /**
   * Un solo barrido de texto, que responde a las dos preguntas: cuántas
   * palabras se leen y dónde están las líneas que hay que muestrear.
   *
   * `innerText` no vale para contar: respeta `display: none` y `visibility`,
   * pero un subárbol a `opacity: 0` le suma sus palabras como si se leyeran.
   *
   * ⚠️ Y el discriminante es el propio barrido de líneas, no una regla aparte.
   * `Range.getClientRects()` devuelve **cero** rects para un texto al que el
   * navegador no le da caja y **uno o más** para todo texto real, así que un
   * texto con cero rects no se cuenta. Eso descuenta solo el caso que había
   * que descontar —el `<title>` de un SVG, que es el nombre accesible de la
   * figura y que Chrome no marca con `display: none`, así que un recuento
   * nodo a nodo lo sumaba: 38 palabras de las 89 de la tesis— sin nombrar
   * ninguna etiqueta ni inventar una heurística nueva. Cualquier lámina con
   * figura traía el recuento inflado, y el recuento es justo lo que se mira
   * para juzgar densidad en la fase de contenido.
   *
   * Las dos preguntas se separan en un punto: para CONTAR basta un rect,
   * para MUESTREAR hace falta que la línea mida algo (4 px), porque una
   * franja de un píxel no admite nueve muestras.
   */
  let palabras = 0;
  let palabrasApagadas = 0;
  const lineas = [];
  const paseador = document.createTreeWalker(seccion, NodeFilter.SHOW_TEXT);
  for (let nodo = paseador.nextNode(); nodo !== null; nodo = paseador.nextNode()) {
    const t = (nodo.nodeValue ?? "").replace(/\s+/g, " ").trim();
    if (t === "") continue;
    const duenno = nodo.parentElement;
    if (duenno === null) continue;
    const rango = document.createRange();
    rango.selectNodeContents(nodo);
    const rects = [...rango.getClientRects()];
    if (rects.length === 0) continue;
    const motivo = noSePinta(duenno);
    if (motivo === null) palabras += t.split(" ").length;
    else if (motivo === "fantasma") palabrasApagadas += t.split(" ").length;
    if (motivo !== null) continue;
    for (const linea of rects) {
      if (linea.width < 4 || linea.height < 4) continue;
      lineas.push({ duenno, linea });
    }
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
   *
   * Se excluye también lo posicionado fuera de flujo, PERO no queda sin
   * vigilar: de eso se encarga el barrido de texto tapado de más abajo, que
   * pregunta por los glifos en vez de por las cajas. Comparar la caja de un
   * absoluto con la de un bloque marcaría cada insignia sobre una imagen y
   * cada pie sobre una figura, que es como muere una herramienta así.
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

  /**
   * Texto tapado.
   *
   * Un elemento fuera de flujo puede estar tapando dos cosas opuestas:
   *
   *   · una SUPERFICIE —una imagen, un fondo, la nada—, que es su oficio:
   *     la insignia de una tarjeta, el pie de una figura, el número de
   *     lámina en una esquina;
   *   · TEXTO, que es un bug: un absoluto con el offset mal puesto encima
   *     de un párrafo.
   *
   * Lo que separa los dos casos no es cómo se posiciona el elemento —los dos
   * se posicionan igual— sino QUÉ queda debajo. Así que la pregunta no se le
   * hace a las cajas, se le hace a los glifos: de cada texto que se pinta se
   * toman sus rects de LÍNEA y se muestrea quién está encima en esos puntos.
   * Si encima de una línea de texto hay algo de otra rama, ese texto no se
   * lee, venga de donde venga —absoluto, `transform`, `z-index` o flujo
   * normal—. Y si debajo del absoluto no hay más que superficie, no hay
   * línea que muestrear y no hay alerta.
   *
   * ⚠️ Estar encima no es tapar. `elementFromPoint` no sabe de alfa: para él,
   * un degradado de legibilidad al 20 % encima de un titular tapa igual que
   * un rótulo opaco. Y «imagen de fondo + degradado + texto encima» es de los
   * patrones más comunes que existen en un deck: denunciarlo es la manera
   * más rápida de que alguien deje de correr esto. Así que además de estar
   * encima hay que OCLUIR, y ocluye lo que cumple una de tres:
   *
   *   · pinta texto propio en ese punto —texto sobre texto, sea cual sea su
   *     fondo, que es el caso del rótulo con el offset mal puesto—;
   *   · es contenido reemplazado —una imagen, un vídeo, un lienzo—, cuyo
   *     contenido no se puede interrogar y se da por opaco;
   *   · su capa de fondo, o su TINTA si es SVG, llega al umbral de alfa.
   *
   * ⚠️ **El SVG no es contenido reemplazado opaco, y darlo por tal denuncia
   * media fase de contenido.** Un `<svg>` inline es casi todo aire: sus formas
   * son objetivos de hit-test propios, así que `elementFromPoint` devuelve el
   * `<svg>` exterior justo cuando el punto NO cae sobre ninguna tinta, y
   * devuelve la forma concreta cuando sí. Con «SVG ⇒ opaco» pasaba lo peor de
   * los dos lados: una filigrana transparente por encima de un titular se
   * denunciaba —el caso normal de una retícula, un grano o un adorno, y la
   * forma exacta de `MallaPortada`, que hoy se salva solo por ir debajo del
   * texto— mientras que un `<rect>` relleno sepultando ese mismo titular NO se
   * denunciaba, porque el que llegaba a `ocluye()` era el `<rect>`, que no
   * estaba en la lista y cuyo `background-color` es transparente.
   *
   * Así que a un nodo de SVG se le pregunta por su tinta —`fill` y `stroke`
   * con sus opacidades— y al `<svg>` exterior solo por su fondo CSS, que es
   * lo único que pinta él. Calibrado en las dos direcciones (§8 del informe).
   *
   * El umbral sale de la cuenta de contraste, no del gusto: un velo negro
   * sobre blanco deja el fondo en (1 − alfa), y con texto oscuro encima el
   * contraste cae por debajo del 4,5:1 de la AA alrededor de alfa 0,5. Se
   * pone en 0,6 para gritar solo cuando la legibilidad ya está destruida y
   * no en la frontera. La franja 0,5–0,6 queda callada a propósito.
   *
   * ── Límites conocidos de `ocluye()` ──────────────────────────────────────
   *
   * Todos son de la misma clase: el arnés grita de más. Ninguno lo deja
   * callado ante un texto sepultado, que es la clase de defecto por la que
   * existe.
   *
   * 1. **`pointer-events: none` que ni el parche puede desbancar** —un
   *    `!important` en el atributo `style`—. `elementFromPoint` ve a través
   *    de él; ese residuo lo atiende el respaldo por geometría de más abajo,
   *    que compara cajas contra rects de línea y pierde precisión de glifo.
   * 2. **Lo que no se puede interrogar se da por opaco:** `img`, `video`,
   *    `canvas`, `picture`, `iframe`, y dentro de un SVG `image` y
   *    `foreignObject`. Un PNG semitransparente encima de un texto se
   *    denunciaría sin serlo.
   * 3. **Un `fill` o `stroke` de gradiente o patrón (`url(#…)`) se da por
   *    opaco**, por lo mismo.
   * 4. **`mask` esconde tinta y el hit-test no se entera.** Chromium NO
   *    excluye del hit-test la región que una máscara deja invisible —con
   *    `clip-path` sí lo hace—, así que un `<rect fill="teal"
   *    mask="url(#m)">` del que solo se ve una esquina devolvía el `<rect>`
   *    en cualquier punto de su caja y `alfaDeTinta` leía `fill` → alfa 1 →
   *    alerta donde no hay un píxel de tinta. Cerrado por el lado simple: si
   *    hay máscara en el nodo o en su ascendencia dentro del SVG, no se
   *    puede saber qué se pinta en ese punto y **no se le atribuye
   *    oclusión**. ⚠️ El precio, declarado: una máscara que revele la forma
   *    ENTERA encima de un título dejaría de denunciarse. Es el único sitio
   *    donde este arnés cambia ruido por silencio, y se acepta porque una
   *    máscara que no esconde nada no es una máscara.
   * 5. **Un `<text>` de SVG se hit-testea por su caja, no por el glifo.**
   *    Medido: con un `<text>I</text>` —barra angosta, mucho aire alrededor—
   *    los 60 puntos de una rejilla dentro de su bbox devuelven el nodo. Y
   *    `textoPropio()` corta ANTES de mirar alfa, así que cualquier `<text>`
   *    de SVG cuya caja roce la línea de un título dispararía «texto sobre
   *    texto» aunque los glifos no se toquen. **No está arreglado**:
   *    hacerlo bien exige medir glifos dentro del SVG, que es
   *    desproporcionado. Y es relevante ya: las etiquetas de las curvas de
   *    la lámina de tesis son `<text>` de SVG, y las trece que vienen
   *    traerán más.
   */
  const ALFA_OCLUSIVA = 0.6;

  const alfaDeColor = (color) => {
    if (color === "transparent" || color === "") return 0;
    const m = /^rgba?\(([^)]+)\)$/.exec(color);
    // Un formato que no sepamos leer se da por opaco: equivocarse hacia el
    // aviso es preferible a equivocarse hacia el silencio.
    if (m === null) return 1;
    const partes = m[1].split(/[,/]/).map((s) => s.trim());
    if (partes.length < 4) return 1;
    const a = Number.parseFloat(partes[3]);
    return Number.isNaN(a) ? 1 : a;
  };

  /** El alfa máximo que puede llegar a pintar la capa de fondo del elemento. */
  const alfaDeCapa = (e) => {
    let a = alfaDeColor(e.backgroundColor);
    if (e.backgroundImage !== "none") {
      if (e.backgroundImage.includes("url(")) a = 1;
      for (const trozo of e.backgroundImage.matchAll(/rgba?\([^)]+\)/g)) {
        a = Math.max(a, alfaDeColor(trozo[0]));
      }
    }
    return a;
  };

  // Sin "SVG": su tinta sí se puede interrogar, y se interroga. `image` y
  // `foreignObject` son los dos nodos de dentro de un SVG que sí traen
  // contenido ajeno, y esos vuelven a ser opacos por decreto.
  const REEMPLAZADOS = new Set([
    "IMG",
    "VIDEO",
    "CANVAS",
    "PICTURE",
    "IFRAME",
    "IMAGE",
    "FOREIGNOBJECT",
  ]);

  const NS_SVG = "http://www.w3.org/2000/svg";

  /**
   * El alfa de la tinta de un nodo de SVG en el punto que se muestreó.
   *
   * Si `elementFromPoint` lo devolvió, con `pointer-events: auto` forzado
   * —que en SVG se comporta como `visiblePainted`—, es que ahí pintó: o el
   * relleno o el trazo. No se puede saber cuál de los dos, así que se toma el
   * mayor, que es el lado del aviso.
   *
   * El `<svg>` exterior es otra cosa: no pinta las formas, son objetivos
   * propios. Lo único suyo es el fondo CSS de su caja, y ese es el que decide.
   *
   * ⚠️ Y antes de nada, la máscara: ver el límite 4 de arriba. Se miran las
   * dos vías porque `mask` en SVG es atributo de presentación y llega al
   * estilo calculado, pero una hoja puede ponerlo también sin el atributo.
   */
  const enmascarado = (el) => {
    for (let n = el; n !== null && n.namespaceURI === NS_SVG; n = n.parentElement) {
      const e = estilo(n);
      if ((e.maskImage ?? "none") !== "none") return true;
      if ((n.getAttribute("mask") ?? "none") !== "none") return true;
    }
    return false;
  };

  const alfaDeTinta = (el) => {
    if (enmascarado(el)) return 0;
    const e = estilo(el);
    if (el.tagName.toLowerCase() === "svg") return alfaDeCapa(e);
    const conOpacidad = (pintura, opacidad) => {
      if (pintura === "none" || pintura === "" || pintura === undefined) return 0;
      const o = Number.parseFloat(opacidad);
      return alfaDeColor(pintura) * (Number.isNaN(o) ? 1 : o);
    };
    return Math.max(
      conOpacidad(e.fill, e.fillOpacity),
      conOpacidad(e.stroke, e.strokeOpacity),
      alfaDeCapa(e),
    );
  };

  /** ¿Tiene texto suyo, no el de un descendiente? */
  const textoPropio = (el) =>
    [...el.childNodes].some((n) => n.nodeType === 3 && (n.nodeValue ?? "").trim() !== "");

  const ocluye = (el) => {
    if (textoPropio(el)) return true;
    if (REEMPLAZADOS.has(el.tagName.toUpperCase())) return true;
    let alfa = el.namespaceURI === NS_SVG ? alfaDeTinta(el) : alfaDeCapa(estilo(el));
    for (let n = el; n !== null && n !== seccion.parentElement; n = n.parentElement) {
      alfa *= Number.parseFloat(estilo(n).opacity);
    }
    return alfa >= ALFA_OCLUSIVA;
  };

  const sordoAlPuntero = (el) => {
    for (let n = el; n !== null && n !== seccion.parentElement; n = n.parentElement) {
      if (estilo(n).pointerEvents === "none") return true;
    }
    return false;
  };

  /**
   * ⚠️ **El agujero mudo-sordo, y cómo se cierra.**
   *
   * `elementFromPoint` ignora lo que lleva `pointer-events: none`, así que un
   * elemento SIN TEXTO PROPIO y sordo al puntero era invisible para las dos
   * vías: el camino principal veía a través de él, y el respaldo por
   * geometría de más abajo solo mira absolutos CON texto. Reproducido: un
   * rectángulo teal **opaco al 100 %** encima del titular de la portada, con
   * `pointer-events: none`, y el arnés decía `ok`.
   *
   * La cura es de una línea y no necesita ninguna heurística: se fuerza
   * `pointer-events: auto` en todo el árbol justo antes de muestrear. A
   * partir de ahí `elementFromPoint` devuelve exactamente lo que la sala ve,
   * porque respeta el orden de pintado. Y no sobre-denuncia: sobre portada y
   * tesis —una malla absoluta a sangre debajo del título, una figura al lado
   * del texto— da cero falsos positivos, porque lo que está debajo sigue
   * estando debajo.
   *
   * El parche se quita en cuanto se acaba de muestrear: la captura que se
   * guarda después tiene que ser la de la página de verdad. No toca la
   * pintura —`pointer-events` solo decide quién recibe el clic—, así que
   * ninguna caja medida cambia por esto.
   */
  const parcheDePuntero = document.createElement("style");
  parcheDePuntero.textContent = "*, *::before, *::after { pointer-events: auto !important; }";
  document.head.append(parcheDePuntero);

  const MUESTRAS = 9;
  const tapados = [];
  for (const { duenno, linea } of lineas) {
    // ⚠️ Si el propio texto SIGUE siendo sordo al puntero pese al parche
    // —solo puede pasar con un `style="pointer-events: none !important"` en
    // línea, que gana a cualquier hoja—, `elementFromPoint` ve a través de él
    // y devuelve lo que tiene DEBAJO. Muestrear ahí invierte el mensaje: el
    // rótulo saldría «tapado» por el párrafo al que en realidad está tapando,
    // y quien lea la alerta iría a mover el elemento equivocado. Ese residuo
    // lo atiende el respaldo por geometría de más abajo, que sí sabe quién
    // está encima de quién.
    if (sordoAlPuntero(duenno)) continue;
    const y = linea.top + linea.height / 2;
    let cubiertas = 0;
    let culpable = null;
    for (let k = 0; k < MUESTRAS; k += 1) {
      const x = linea.left + ((k + 0.5) * linea.width) / MUESTRAS;
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) continue;
      const encima = document.elementFromPoint(x, y);
      if (encima === null) continue;
      // Lo propio y su parentela no tapan nada: si en el punto de un glifo
      // lo de encima es el mismo elemento, un descendiente suyo o un
      // ascendiente, ahí no hay nadie pintando por encima.
      if (encima === duenno || duenno.contains(encima) || encima.contains(duenno)) continue;
      // Estar encima no es tapar: un velo de legibilidad al 20 % deja el
      // texto perfectamente leído.
      if (!ocluye(encima)) continue;
      cubiertas += 1;
      culpable = encima;
    }
    // Una sola muestra puede ser el borde de un glifo o un redondeo; dos ya
    // es una franja de línea que nadie lee.
    if (cubiertas >= 2 && culpable !== null) {
      tapados.push(`${nombre(duenno)} debajo de ${nombre(culpable)}`);
    }
  }

  // Fuera el parche: lo que sigue pregunta por el `pointer-events` REAL, y la
  // captura que se guarda al terminar tiene que ser la de la página tal cual.
  // `getComputedStyle` devuelve un objeto vivo, así que la caché de estilos de
  // arriba vuelve sola a los valores de verdad.
  parcheDePuntero.remove();

  // El residuo sordo al puntero, por geometría. Con el parche puesto, el
  // camino principal ya caza todo lo que se pinte encima de un texto, así que
  // aquí solo queda lo que ni siquiera el parche puede desbancar: un
  // `pointer-events: none !important` escrito en el atributo `style`. Se
  // conserva porque está calibrado —el rótulo con el offset mal puesto de la
  // ronda 3— y porque cuando los dos caminos coinciden emiten exactamente el
  // mismo mensaje, que la salida deduplica.
  for (const el of todos) {
    if (noSePinta(el) !== null) continue;
    const e = estilo(el);
    if (e.position !== "absolute" && e.position !== "fixed") continue;
    if (e.pointerEvents !== "none") continue;
    if ((el.textContent ?? "").trim() === "") continue;
    const caja = el.getBoundingClientRect();
    if (caja.height <= 0) continue;
    for (const { duenno, linea } of lineas) {
      if (el.contains(duenno) || duenno.contains(el)) continue;
      const dx = Math.min(caja.right, linea.right) - Math.max(caja.left, linea.left);
      const dy = Math.min(caja.bottom, linea.bottom) - Math.max(caja.top, linea.top);
      if (dx > 4 && dy > 4) tapados.push(`${nombre(duenno)} debajo de ${nombre(el)}`);
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
    tapados,
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
      if (m.tapados.length) {
        alertas.push(`⚠️ TEXTO TAPADO: ${[...new Set(m.tapados)].slice(0, 3).join(", ")}`);
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

import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * La puerta de las dos retículas de la portada: el ribbon de «Lo que hemos
 * construido» y el muro de logos que lo cierra.
 *
 * El ribbon se dibujaba con `display: flex` + `flex-wrap` para no reservar
 * columnas que se quedaran a medio llenar cuando cambiara el número de
 * productos. El efecto era el contrario del buscado: como la intro medía
 * 17rem y las tarjetas 15.5rem y ninguna crecía, cada renglón terminaba en una
 * x distinta, las líneas verticales no se alineaban entre renglones y el
 * rectángulo nunca cerraba a la derecha —a 1440px el segundo renglón moría a
 * mitad de la sección dejando medio ancho en negro.
 *
 * Ahora las dos son retículas de verdad y el renglón final lo cierra una celda
 * designada estirándose sobre las columnas que sobran: en el ribbon, la última
 * tarjeta; en el muro, el rótulo. Eso acopla tres cosas que viven en archivos
 * distintos:
 *
 *   · el CONTEO de celdas —las tarjetas salen de `src/content/work.ts`, los
 *     logos de la lista de relaciones del componente—;
 *   · los CONTEOS DE COLUMNA declarados en `home.module.css`, uno por
 *     breakpoint;
 *   · los tramos `--ribbon-fill-N` y `--wall-fill-N` que el componente publica.
 *
 * Si alguien añade un breakpoint de 5 columnas al CSS y no publica su tramo,
 * la variable cae al valor por defecto (1) y el renglón final vuelve a quedar
 * corto sin que falle ninguna prueba ni el build. Esta prueba cierra ese hueco
 * por los dos lados: comprueba la aritmética del tramo y comprueba que las
 * listas de conteos coincidan.
 */

const css = readFileSync(
  path.join(root, "src/components/home/home.module.css"),
  "utf8",
);
const tsx = readFileSync(
  path.join(root, "src/components/home/HomeSections.tsx"),
  "utf8",
);

/** Las dos retículas de la sección, con el selector que declara sus columnas. */
const RETICULAS = [
  { nombre: "ribbon", selector: "proofRibbon", variable: "ribbon-fill" },
  { nombre: "muro de logos", selector: "logoWall", variable: "wall-fill" },
];

function bloques(selector) {
  const out = [];
  const re = new RegExp("\\." + selector + "(?![\\w-])[^{}]*\\{([^{}]*)\\}", "g");
  let match;
  while ((match = re.exec(css)) !== null) out.push(match[1]);
  return out;
}

function columnasDeclaradas(selector) {
  const cols = new Set();
  for (const body of bloques(selector)) {
    const m = /grid-template-columns:\s*repeat\(\s*(\d+)/.exec(body);
    if (m) cols.add(Number(m[1]));
  }
  return [...cols].sort((a, b) => a - b);
}

for (const { nombre, selector, variable } of RETICULAS) {
  test(`el CSS declara una retícula explícita para el ${nombre}`, () => {
    assert.ok(bloques(selector).length > 0, `no se encontró ninguna regla .${selector}`);
    assert.ok(
      columnasDeclaradas(selector).length > 0,
      `el ${nombre} dejó de declarar grid-template-columns: volvió a ser un flujo que se acomoda`,
    );
  });

  test(`cada conteo de columnas del ${nombre} tiene su tramo publicado por el componente`, () => {
    const declaradas = columnasDeclaradas(selector);
    const usadasEnCss = [
      ...new Set([...css.matchAll(new RegExp(`var\\(--${variable}-(\\d+)`, "g"))].map((m) => Number(m[1]))),
    ].sort((a, b) => a - b);
    const publicadas = [
      ...new Set([...tsx.matchAll(new RegExp(`"--${variable}-(\\d+)"`, "g"))].map((m) => Number(m[1]))),
    ].sort((a, b) => a - b);

    assert.deepEqual(
      usadasEnCss,
      declaradas,
      `en el ${nombre} hay un conteo de columnas sin su var(--${variable}-N) —o al revés— en el CSS`,
    );
    assert.deepEqual(
      publicadas,
      declaradas,
      `el componente no publica un tramo para cada conteo de columnas del ${nombre}`,
    );
  });
}

test("el muro de logos no vuelve a ser un carrusel", () => {
  const cuerpos = bloques("logoWall").join("\n");
  assert.ok(
    !/overflow-x:\s*auto|scroll-snap-type/.test(cuerpos),
    "el muro volvió a desplazarse: se ven las relaciones a medias y el argumento del conjunto se pierde",
  );
});

function loadRibbon() {
  const result = spawnSync(
    "npx",
    [
      "tsx",
      "--eval",
      `
      import { readFileSync } from "node:fs";
      import { fillSpan } from "./src/components/home/gridFill.ts";
      import { workProfiles } from "./src/content/work.ts";

      const confirmados = workProfiles.filter((p) => p.attribution.state === "confirmed");
      // La intro y el enlace al directorio son las dos celdas fijas del ribbon.
      const celdasReales = confirmados.length + 2;

      // El muro: una celda por relación —con logotipo o nombrada— más el
      // rótulo que cierra el renglón. Se cuenta partiendo la fuente, no con una
      // expresión regular: este código viaja dentro de una plantilla de JS y
      // ahí las barras invertidas se cuecen antes de llegar a esbuild.
      const fuente = readFileSync("src/components/home/HomeSections.tsx", "utf8");
      const conLogo = fuente.split('src: "/brand/clients/').length - 1;
      const nombradas = fuente.split("place: ").length - 1;
      const celdasMuro = conLogo + nombradas + 1;

      // Se interroga el conteo REAL y, en la misma pasada, todos los conteos
      // que el ribbon podría llegar a tener: la retícula tiene que cerrar
      // igual hoy que cuando work.ts sume o quite un producto.
      const tramos = {};
      for (const columnas of [2, 3, 4, 5, 6]) {
        tramos[columnas] = [];
        for (let celdas = 1; celdas <= 40; celdas += 1) {
          tramos[columnas].push(fillSpan(celdas, columnas));
        }
      }

      process.stdout.write(JSON.stringify({ celdasReales, celdasMuro, tramos }));
    `,
    ],
    { cwd: root, encoding: "utf8" },
  );

  assert.equal(
    result.status,
    0,
    `no se pudo cargar el modelo del ribbon:\n${result.stderr}`,
  );
  return JSON.parse(result.stdout);
}

test("el tramo de relleno cierra el último renglón para cualquier conteo de tarjetas", () => {
  const { tramos } = loadRibbon();

  for (const [columnasStr, spans] of Object.entries(tramos)) {
    const columnas = Number(columnasStr);
    spans.forEach((span, index) => {
      const celdas = index + 1;
      const donde = `${celdas} celdas en ${columnas} columnas`;

      assert.ok(
        Number.isInteger(span) && span >= 1 && span <= columnas,
        `${donde}: el tramo ${span} se sale del rango [1, ${columnas}]`,
      );

      // Las celdas menos la última ocupan una columna cada una; la última, `span`.
      const unidades = celdas - 1 + span;
      assert.equal(
        unidades % columnas,
        0,
        `${donde}: la retícula cierra con ${unidades} unidades, que no es múltiplo de ${columnas} —el último renglón quedaría corto`,
      );
    });
  }
});

test("el conteo real de tarjetas cierra la retícula en los conteos de columna vigentes", () => {
  const { celdasReales, tramos } = loadRibbon();

  assert.ok(
    celdasReales >= 3,
    `el ribbon quedó con ${celdasReales} celdas: revisar work.ts`,
  );

  for (const columnas of columnasDeclaradas("proofRibbon").filter((n) => tramos[n])) {
    const span = tramos[columnas][celdasReales - 1];
    assert.equal(
      (celdasReales - 1 + span) % columnas,
      0,
      `con ${celdasReales} tarjetas y ${columnas} columnas el último renglón del ribbon no cierra`,
    );
  }
});

test("el conteo real de logos cierra la retícula del muro", () => {
  const { celdasMuro, tramos } = loadRibbon();

  // Guarda contra un conteo obsoleto: el muro mezcla celdas con logotipo y
  // celdas nombradas, y una prueba que sólo contara las primeras pasaría por
  // casualidad mientras la retícula real se rompe.
  const enDom = (tsx.match(/<Client(Logo|Name)Cell/g) || []).length;
  assert.equal(
    enDom,
    2,
    "el muro dejó de pintar los dos tipos de celda: revisar el conteo de esta prueba",
  );
  assert.ok(celdasMuro >= 20, `el muro quedó con ${celdasMuro} celdas: revisar clientLogos y clientNames`);

  for (const columnas of columnasDeclaradas("logoWall").filter((n) => tramos[n])) {
    const span = tramos[columnas][celdasMuro - 1];
    assert.equal(
      (celdasMuro - 1 + span) % columnas,
      0,
      `con ${celdasMuro} celdas y ${columnas} columnas el último renglón del muro no cierra`,
    );
  }
});

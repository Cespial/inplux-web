import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * La puerta de la retícula del ribbon de «Lo que hemos construido».
 *
 * El ribbon se dibujaba con `display: flex` + `flex-wrap` para no reservar
 * columnas que se quedaran a medio llenar cuando cambiara el número de
 * productos. El efecto era el contrario del buscado: como la intro medía
 * 17rem y las tarjetas 15.5rem y ninguna crecía, cada renglón terminaba en una
 * x distinta, las líneas verticales no se alineaban entre renglones y el
 * rectángulo nunca cerraba a la derecha —a 1440px el segundo renglón moría a
 * mitad de la sección dejando medio ancho en negro.
 *
 * Ahora es una retícula de verdad y el renglón final lo cierra la última
 * tarjeta estirándose sobre las columnas que sobran. Eso acopla tres cosas que
 * viven en archivos distintos:
 *
 *   · el CONTEO de tarjetas, que sale de `src/content/work.ts`;
 *   · los CONTEOS DE COLUMNA declarados en `home.module.css`, uno por
 *     breakpoint;
 *   · los tramos `--ribbon-fill-N` que el componente publica en el estilo.
 *
 * Si alguien añade un breakpoint de 5 columnas al CSS y no publica su
 * `--ribbon-fill-5`, la variable cae al valor por defecto (1) y el renglón
 * final vuelve a quedar corto sin que falle ninguna prueba ni el build. Esta
 * prueba cierra ese hueco por los dos lados: comprueba la aritmética del
 * tramo y comprueba que las dos listas de conteos coincidan.
 */

const css = readFileSync(
  path.join(root, "src/components/home/home.module.css"),
  "utf8",
);
const tsx = readFileSync(
  path.join(root, "src/components/home/HomeSections.tsx"),
  "utf8",
);

function ribbonBlocks() {
  // Cada regla `.proofRibbon { … }` del archivo, con su cuerpo.
  const blocks = [];
  const re = /\.proofRibbon(?![\w-])[^{}]*\{([^{}]*)\}/g;
  let match;
  while ((match = re.exec(css)) !== null) blocks.push(match[1]);
  return blocks;
}

test("el CSS del ribbon declara una retícula explícita en todos sus estados de escritorio", () => {
  const blocks = ribbonBlocks();
  assert.ok(blocks.length > 0, "no se encontró ninguna regla .proofRibbon");

  const grid = blocks.filter((b) => /grid-template-columns/.test(b));
  assert.ok(
    grid.length >= 1,
    "el ribbon dejó de declarar grid-template-columns: volvió a ser un flujo que se acomoda",
  );
});

test("cada conteo de columnas del CSS tiene su tramo publicado por el componente", () => {
  const declaredColumns = new Set();
  for (const body of ribbonBlocks()) {
    const m = /grid-template-columns:\s*repeat\(\s*(\d+)/.exec(body);
    if (m) declaredColumns.add(Number(m[1]));
  }
  assert.ok(
    declaredColumns.size > 0,
    "ningún .proofRibbon declara repeat(N, …): la retícula dejó de ser explícita",
  );

  const consumedByCss = new Set(
    [...css.matchAll(/var\(--ribbon-fill-(\d+)/g)].map((m) => Number(m[1])),
  );
  const publishedByComponent = new Set(
    [...tsx.matchAll(/"--ribbon-fill-(\d+)"/g)].map((m) => Number(m[1])),
  );

  assert.deepEqual(
    [...consumedByCss].sort((a, b) => a - b),
    [...declaredColumns].sort((a, b) => a - b),
    "hay un conteo de columnas sin su var(--ribbon-fill-N) —o al revés— en el CSS",
  );
  assert.deepEqual(
    [...publishedByComponent].sort((a, b) => a - b),
    [...declaredColumns].sort((a, b) => a - b),
    "el componente no publica un tramo para cada conteo de columnas del CSS",
  );
});

function loadRibbon() {
  const result = spawnSync(
    "npx",
    [
      "tsx",
      "--eval",
      `
      import { ribbonFillSpan } from "./src/components/home/ribbonGrid.ts";
      import { workProfiles } from "./src/content/work.ts";

      const confirmados = workProfiles.filter((p) => p.attribution.state === "confirmed");
      // La intro y el enlace al directorio son las dos celdas fijas.
      const celdasReales = confirmados.length + 2;

      // Se interroga el conteo REAL y, en la misma pasada, todos los conteos
      // que el ribbon podría llegar a tener: la retícula tiene que cerrar
      // igual hoy que cuando work.ts sume o quite un producto.
      const tramos = {};
      for (const columnas of [2, 3, 4, 5, 6]) {
        tramos[columnas] = [];
        for (let celdas = 1; celdas <= 40; celdas += 1) {
          tramos[columnas].push(ribbonFillSpan(celdas, columnas));
        }
      }

      process.stdout.write(JSON.stringify({ celdasReales, tramos }));
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

  const declaredColumns = [
    ...new Set(
      [...css.matchAll(/grid-template-columns:\s*repeat\(\s*(\d+)/g)]
        .map((m) => Number(m[1]))
        .filter((n) => tramos[n]),
    ),
  ];

  for (const columnas of declaredColumns) {
    const span = tramos[columnas][celdasReales - 1];
    assert.equal(
      (celdasReales - 1 + span) % columnas,
      0,
      `con ${celdasReales} tarjetas y ${columnas} columnas el último renglón no cierra`,
    );
  }
});

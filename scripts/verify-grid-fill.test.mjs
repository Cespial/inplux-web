import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

/**
 * La puerta del muro de relaciones de la portada.
 *
 * Hasta oct-2026 el muro era una retícula quieta y esta prueba vigilaba que su
 * último renglón cerrara y que nunca volviera a ser un carrusel. Cristian
 * eligió después (29-oct-2026, opción B del banco de pruebas) tres cintas en
 * movimiento, una por grupo y con el rótulo fijo, así que la prueba vigila
 * ahora lo que esa forma necesita para no romperse:
 *
 *   · cada relación pertenece a un grupo conocido, y cada grupo tiene rótulo
 *     en los dos idiomas;
 *   · el bucle es continuo: el desplazamiento del CSS es exactamente una de
 *     las copias que pinta el componente;
 *   · sólo una copia es legible para el lector de pantalla;
 *   · el movimiento se puede detener (botón, cursor, foco) y desaparece con
 *     «reducir movimiento».
 */

const css = read("src/components/v5/LogoWall.module.css");
const tsx = read("src/components/v5/LogoWall.tsx");
const clients = read("src/content/clients.ts");
const copies = { es: read("src/content/copy/es.ts"), en: read("src/content/copy/en.ts") };

const grupos = JSON.parse(
  /clientGroups = (\[[^\]]*\])/.exec(clients)[1].replace(/'/g, '"'),
);

test("los grupos del muro abren con las instituciones públicas", () => {
  assert.deepEqual(grupos, ["public", "private", "municipal"]);
});

test("cada relación del muro lleva un grupo conocido", () => {
  const conLogo = clients.split('src: "/brand/clients/').length - 1;
  const nombradas = clients.split("place: ").length - 1;
  const asignados = [...clients.matchAll(/group: "([a-z]+)"/g)].map((m) => m[1]);

  assert.ok(conLogo >= 20, `el muro quedó con ${conLogo} logos: revisar clientLogos`);
  assert.equal(
    asignados.length,
    conLogo + nombradas,
    "hay relaciones sin grupo: no aparecerían en ninguna cinta",
  );
  for (const g of asignados) assert.ok(grupos.includes(g), `grupo desconocido «${g}»`);
  for (const g of grupos) {
    assert.ok(
      asignados.filter((x) => x === g).length >= 6,
      `la cinta «${g}» tiene menos de seis relaciones: tres copias ya no llenan la fila`,
    );
  }
});

test("cada grupo tiene rótulo en español y en inglés", () => {
  for (const [lang, source] of Object.entries(copies)) {
    const bloque = /clientWall: \{[\s\S]*?groups: \{([\s\S]*?)\}/.exec(source);
    assert.ok(bloque, `${lang}: clientWall no declara groups`);
    for (const g of grupos) {
      assert.match(bloque[1], new RegExp(`\\b${g}: "[^"]+"`), `${lang}: falta el rótulo de «${g}»`);
    }
  }
});

test("el bucle desplaza exactamente una de las copias que pinta el componente", () => {
  const n = Number(/const COPIES = (\d+);/.exec(tsx)?.[1]);
  assert.ok(n >= 2, "el componente debe pintar al menos dos copias de cada cinta");
  assert.match(
    css,
    new RegExp(`translate3d\\(calc\\(-100% / ${n}\\)`),
    `el desplazamiento del CSS no es 1/${n}: la cinta saltaría al reiniciar`,
  );
});

test("sólo la primera copia de cada cinta es legible para el lector de pantalla", () => {
  assert.match(tsx, /aria-hidden=\{copyIndex === 0 \? undefined : true\}/);
  assert.match(tsx, /alt=\{hidden \? "" : client\.name\}/);
});

test("el movimiento se puede detener y respeta «reducir movimiento»", () => {
  assert.match(tsx, /<WallPause /, "falta el botón de pausa (WCAG 2.2.2)");
  for (const selector of [".row:hover .rail", ".row:focus-within .rail", ".wall[data-paused] .rail"]) {
    assert.ok(css.includes(selector), `falta la pausa por ${selector}`);
  }
  const reduce = /@media \(prefers-reduced-motion: reduce\) \{([\s\S]*)\}\s*$/.exec(css);
  assert.ok(reduce, "falta el bloque de «reducir movimiento»");
  assert.match(reduce[1], /animation: none/);
  assert.match(reduce[1], /\.track\[aria-hidden\] \{\s*display: none;/);
});

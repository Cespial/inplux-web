import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// El lector es TypeScript; se ejecuta con `tsx` para poder interrogarlo desde
// node:test sin arrastrar un runner nuevo al repo. Es el mismo patrón de
// `verify-deck-model.test.mjs`.
function leerReglas() {
  const resultado = spawnSync(
    "npx",
    [
      "tsx",
      "--eval",
      `
      import { leerReglas } from "./src/lib/banned-reasons.server.ts";
      leerReglas().then((r) => process.stdout.write(JSON.stringify(r)));
    `,
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(resultado.status, 0, `no se pudo leer las reglas:\n${resultado.stderr}`);
  return JSON.parse(resultado.stdout);
}

/**
 * Los mismos archivos que escanea `check:content`, con las mismas extensiones.
 *
 * ⚠️ **Se recorre `src/` ENTERO y no una lista de cuatro archivos.** La versión
 * anterior de esta prueba nombraba a mano los cuatro que en aquel momento
 * tocaban la lámina; la lámina ya tiene otra forma y cualquier archivo nuevo
 * quedaba fuera del guardia sin que nadie se enterara. Lo que hay que impedir
 * no es que las cadenas aparezcan en cuatro sitios: es que aparezcan.
 */
const EXTENSIONES = new Set([".css", ".html", ".json", ".svg", ".ts", ".tsx", ".txt", ".webmanifest"]);

async function archivosDeFuente(relativo = "src") {
  const entradas = await readdir(path.join(root, relativo), { withFileTypes: true });
  const archivos = [];

  for (const entrada of entradas) {
    const ruta = path.join(relativo, entrada.name);
    if (entrada.isDirectory()) archivos.push(...(await archivosDeFuente(ruta)));
    else if (EXTENSIONES.has(path.extname(entrada.name))) archivos.push(ruta);
  }

  return archivos;
}

test("hay trece reglas, y el titular de la lámina dice trece", async () => {
  const reglas = leerReglas();
  assert.equal(reglas.length, 13, "cambió el número de reglas: actualiza el titular de la lámina 6");

  const copy = await readFile(path.join(root, "src/content/deck.copy.ts"), "utf8");
  assert.match(copy, /Trece cosas que este sitio no puede decir/);
});

test("ninguna regla se coló como literal en src/", async () => {
  const reglas = leerReglas();
  // Motivos Y ejemplos. Los ejemplos son lo que la lámina PINTA, así que son
  // los que de verdad tientan a escribirse a mano —«total, es una frase»—, y
  // cada uno de ellos coincide con su propio patrón bloqueado: escribirlo bajo
  // `src/` rompe el build en la línea que lo escribe. Esta prueba es lo que
  // avisa antes, con el nombre del archivo.
  const cadenas = reglas.flatMap((regla) =>
    regla.ejemplo === null ? [regla.motivo] : [regla.motivo, regla.ejemplo],
  );

  for (const archivo of await archivosDeFuente()) {
    const fuente = await readFile(path.join(root, archivo), "utf8");
    for (const cadena of cadenas) {
      assert.ok(
        !fuente.includes(cadena),
        `«${cadena}» está escrito a mano en ${archivo}; tiene que venir de leerReglas()`,
      );
    }
  }
});

/**
 * El pie del muro dice «La que falta…», en singular, y esta prueba es lo que
 * impide que esa frase empiece a mentir.
 *
 * Una regla sin ejemplo publicable no es un olvido: es la del logo de un
 * tercero, cuyo patrón solo caza NOMBRES, y enseñar uno en un deck comercial es
 * exactamente la relación sin permiso que prohíbe. Si mañana apareciera una
 * segunda regla incitable, el muro tendría dos huecos y una sola línea
 * explicando uno.
 */
test("solo una regla se queda sin frase que enseñar", () => {
  const reglas = leerReglas();
  const sinEjemplo = reglas.filter((regla) => regla.ejemplo === null);
  assert.equal(
    sinEjemplo.length,
    1,
    `${sinEjemplo.length} reglas sin ejemplo (${sinEjemplo.map((r) => r.motivo).join(", ")}); ` +
      "el pie de la lámina 6 habla de UNA en singular",
  );
});

/**
 * El límite que la lámina no puede cruzar y ninguna captura delata a tiempo.
 *
 * A 390 px la lámina deja 342 px de caja; la fila gasta el hilo del raíl y su
 * sangría, así que a la frase le quedan 330. El cuerpo ahí lo fija el suelo del
 * `clamp` —0,9 rem, o sea 14,4 px con raíz 16— y la sans avanza 0,47 em por
 * carácter, medido en el navegador: unos 49 caracteres de línea.
 *
 * Una frase que envuelva no se lee peor: se lee MAL. El tachón es una sola línea
 * absoluta centrada en la caja de la frase, así que en dos renglones cruza por
 * el hueco entre ambos y deja las dos sin tachar — la lámina diría lo contrario
 * de lo que dice. El tope se queda en 44 para conservar cinco caracteres de
 * margen contra la métrica real de la fuente.
 */
test("ninguna frase se acerca al ancho de línea de 390 px", () => {
  const frases = leerReglas()
    .map((regla) => regla.ejemplo)
    .filter((frase) => frase !== null);
  const masLarga = frases.reduce((a, b) => (b.length > a.length ? b : a));
  assert.ok(
    masLarga.length <= 44,
    `«${masLarga}» mide ${masLarga.length} caracteres y a 390 px caben ~48: envolvería, y el tachón cruzaría entre los dos renglones`,
  );
});

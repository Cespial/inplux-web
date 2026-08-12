import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// El lector es TypeScript; se ejecuta con `tsx` para poder interrogarlo desde
// node:test sin arrastrar un runner nuevo al repo. Es el mismo patrón de
// `verify-deck-model.test.mjs`.
function leerMotivos() {
  const resultado = spawnSync(
    "npx",
    [
      "tsx",
      "--eval",
      `
      import { leerMotivos } from "./src/lib/banned-reasons.server.ts";
      leerMotivos().then((m) => process.stdout.write(JSON.stringify(m)));
    `,
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(resultado.status, 0, `no se pudo leer los motivos:\n${resultado.stderr}`);
  return JSON.parse(resultado.stdout);
}

test("hay trece motivos, y el titular de la lámina dice trece", async () => {
  const motivos = leerMotivos();
  assert.equal(motivos.length, 13, "cambió el número de reglas: actualiza el titular de la lámina 6");

  const copy = await readFile(path.join(root, "src/content/deck.copy.ts"), "utf8");
  assert.match(copy, /Trece cosas que este sitio no puede decir/);
});

test("ningún motivo se coló como literal en src/", async () => {
  const motivos = leerMotivos();
  // Tres archivos, no uno. El lector es el que más tienta a «documentar» la
  // lista en un comentario, y un comentario también lo escanea `check:content`.
  const archivos = [
    "src/components/deck/slides/EvidenciaSlide.tsx",
    "src/components/deck/slides/evidencia.module.css",
    "src/content/deck.copy.ts",
    "src/lib/banned-reasons.server.ts",
  ];
  for (const archivo of archivos) {
    const fuente = await readFile(path.join(root, archivo), "utf8");
    for (const motivo of motivos) {
      assert.ok(
        !fuente.includes(motivo),
        `«${motivo}» está escrito a mano en ${archivo}; tiene que venir de leerMotivos()`,
      );
    }
  }
});

// El límite que la lámina no puede cruzar y ninguna captura delata a tiempo: a
// 390 px la columna de la lista mide 342 px y el mono de 0,7 rem avanza
// ~6,7 px por carácter, o sea unos 50 caracteres de línea. Un motivo que
// envuelva parte la lista en dos ritmos distintos y empuja la lámina contra el
// riel de progreso. El margen es de catorce caracteres y se lo come cualquier
// viñeta, número o comilla que se le añada delante: por eso la lista no lleva
// ninguna.
test("ningún motivo se acerca al ancho de línea de 390 px", () => {
  const motivos = leerMotivos();
  const masLargo = motivos.reduce((a, b) => (b.length > a.length ? b : a));
  assert.ok(
    masLargo.length <= 44,
    `un motivo mide ${masLargo.length} caracteres y a 390 px caben ~50: envolvería`,
  );
});

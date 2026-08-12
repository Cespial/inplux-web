import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// El modelo es TypeScript; se compila a un módulo temporal para poder
// interrogarlo desde node:test sin arrastrar un runner nuevo al repo.
function loadDeck() {
  const result = spawnSync(
    "npx",
    ["tsx", "--eval", `
      import { SLIDES, TOTAL_SLIDES } from "./src/content/deck.ts";
      import { workProfiles } from "./src/content/work.ts";
      process.stdout.write(JSON.stringify({
        total: TOTAL_SLIDES,
        ids: SLIDES.map((s) => s.id),
        kinds: SLIDES.map((s) => s.kind),
        numbers: SLIDES.map((s) => s.n),
        productSlugs: SLIDES.filter((s) => s.kind === "producto").map((s) => s.perfil.slug),
        profileSlugs: workProfiles.map((p) => p.slug),
      }));
    `],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `no se pudo cargar el modelo:\n${result.stderr}`);
  return JSON.parse(result.stdout);
}

test("cada perfil de work.ts tiene su lámina de producto", () => {
  const deck = loadDeck();
  assert.deepEqual(
    [...deck.productSlugs].sort(),
    [...deck.profileSlugs].sort(),
    "un perfil se quedó sin lámina, o una lámina apunta a un perfil inexistente",
  );
});

test("el deck tiene 15 láminas numeradas de 1 a 15 sin huecos", () => {
  const deck = loadDeck();
  assert.equal(deck.total, 15);
  assert.deepEqual(deck.numbers, Array.from({ length: 15 }, (_, i) => i + 1));
});

test("ningún id se repite", () => {
  const deck = loadDeck();
  assert.equal(new Set(deck.ids).size, deck.ids.length);
});

test("ningún arquetipo estructural se repite en láminas contiguas", () => {
  const deck = loadDeck();
  // Las cuatro fichas de producto repiten a propósito: son una serie.
  const kinds = deck.kinds;
  for (let i = 1; i < kinds.length; i += 1) {
    if (kinds[i] === "producto" && kinds[i - 1] === "producto") continue;
    assert.notEqual(kinds[i], kinds[i - 1], `las láminas ${i} y ${i + 1} comparten kind`);
  }
});

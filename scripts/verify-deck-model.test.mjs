import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// El modelo es TypeScript; se compila a un módulo temporal para poder
// interrogarlo desde node:test sin arrastrar un runner nuevo al repo.
//
// Se interroga el deck COMPLETO y, en la misma pasada, un deck recortado a un
// subconjunto de perfiles: las dos formas de construirlo tienen que cumplir lo
// mismo —ningún perfil sin lámina, numeración sin huecos— y la única manera de
// comprobarlo es armar los dos con la misma función.
function loadDeck() {
  const result = spawnSync(
    "npx",
    ["tsx", "--eval", `
      import { SLIDES, TOTAL_SLIDES, construirDeck } from "./src/content/deck.ts";
      import { workProfiles } from "./src/content/work.ts";

      const retrato = (slides) => ({
        total: slides.length,
        ids: slides.map((s) => s.id),
        kinds: slides.map((s) => s.kind),
        numbers: slides.map((s) => s.n),
        productSlugs: slides.filter((s) => s.kind === "producto").map((s) => s.perfil.slug),
      });

      // El subconjunto se pide en el orden CONTRARIO al de work.ts, a
      // propósito: si construirDeck respetara el orden de los argumentos en vez
      // del de la fuente, esta prueba lo vería.
      const alReves = [...workProfiles].map((p) => p.slug).reverse();
      const dos = alReves.slice(0, 2);

      let errorPorSlugInventado = null;
      try {
        construirDeck(["no-existe"]);
      } catch (e) {
        errorPorSlugInventado = String(e.message);
      }

      process.stdout.write(JSON.stringify({
        ...retrato(SLIDES),
        total: TOTAL_SLIDES,
        profileSlugs: workProfiles.map((p) => p.slug),
        // Por omisión no cambia nada: el deck completo armado con la función
        // pública tiene que ser idéntico a SLIDES.
        pordefecto: retrato(construirDeck()),
        subconjunto: { pedido: dos, deck: retrato(construirDeck(dos)) },
        unoSolo: retrato(construirDeck([workProfiles[0].slug])),
        vacio: retrato(construirDeck([])),
        errorPorSlugInventado,
      }));
    `],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `no se pudo cargar el modelo:\n${result.stderr}`);
  return JSON.parse(result.stdout);
}

/** Lo que tiene que cumplir CUALQUIER deck, completo o recortado. */
function numeracionSana(deck, etiqueta) {
  assert.deepEqual(
    deck.numbers,
    Array.from({ length: deck.total }, (_, i) => i + 1),
    `${etiqueta}: la numeración tiene huecos o no empieza en 1`,
  );
  assert.equal(new Set(deck.ids).size, deck.ids.length, `${etiqueta}: hay un id repetido`);
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
  // Las fichas de producto repiten a propósito: son una serie.
  const kinds = deck.kinds;
  for (let i = 1; i < kinds.length; i += 1) {
    if (kinds[i] === "producto" && kinds[i - 1] === "producto") continue;
    assert.notEqual(kinds[i], kinds[i - 1], `las láminas ${i} y ${i + 1} comparten kind`);
  }
});

// ── El deck recortado ────────────────────────────────────────────────────────
// El dueño necesita presentar solo una parte de la serie de producto sin que
// eso sea un segundo modelo. Lo que sigue comprueba que el recorte es un
// parámetro y no un deck aparte: mismas invariantes, misma función.

test("sin argumento, construirDeck devuelve exactamente el deck de siempre", () => {
  const deck = loadDeck();
  assert.deepEqual(deck.pordefecto.ids, deck.ids);
  assert.deepEqual(deck.pordefecto.numbers, deck.numbers);
  assert.equal(deck.pordefecto.total, deck.total);
});

test("con un subconjunto salen solo esas láminas de producto", () => {
  const deck = loadDeck();
  const { pedido, deck: recortado } = deck.subconjunto;

  assert.deepEqual(
    [...recortado.productSlugs].sort(),
    [...pedido].sort(),
    "el deck recortado trae perfiles que nadie pidió, o le falta alguno",
  );
  // Apertura y cierre no se tocan: lo que encoge es la serie de producto.
  assert.equal(recortado.total, deck.total - (deck.profileSlugs.length - pedido.length));
});

test("el subconjunto conserva el orden de work.ts, no el de los argumentos", () => {
  const deck = loadDeck();
  const { pedido, deck: recortado } = deck.subconjunto;

  const esperado = deck.profileSlugs.filter((slug) => pedido.includes(slug));
  assert.deepEqual(recortado.productSlugs, esperado);
  // Y la prueba solo vale si el subconjunto se pidió desordenado.
  assert.notDeepEqual(pedido, esperado, "el subconjunto se pidió ya ordenado: no prueba nada");
});

test("la numeración del deck recortado sigue yendo de 1 a N sin huecos", () => {
  const deck = loadDeck();
  numeracionSana(deck.subconjunto.deck, "subconjunto de dos");
  numeracionSana(deck.unoSolo, "un solo perfil");
  numeracionSana(deck.vacio, "sin perfiles");
  // Sin ningún producto quedan la apertura y el cierre, y siguen numeradas.
  assert.equal(deck.vacio.total, deck.total - deck.profileSlugs.length);
  assert.deepEqual(deck.vacio.productSlugs, []);
});

test("un slug que no existe revienta en vez de encogerse en silencio", () => {
  const deck = loadDeck();
  assert.match(String(deck.errorPorSlugInventado), /no hay perfil para: no-existe/);
});

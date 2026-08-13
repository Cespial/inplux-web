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
      import {
        SLIDES,
        SLIDES_LEGALTECH,
        TOTAL_SLIDES,
        PERFILES_LEGALTECH,
        construirDeck,
        nombresEnProsa,
      } from "./src/content/deck.ts";
      import { workProfiles } from "./src/content/work.ts";

      const retrato = (slides) => ({
        total: slides.length,
        ids: slides.map((s) => s.id),
        kinds: slides.map((s) => s.kind),
        numbers: slides.map((s) => s.n),
        productSlugs: slides.filter((s) => s.kind === "producto").map((s) => s.perfil.slug),
        productNames: slides.filter((s) => s.kind === "producto").map((s) => s.perfil.name),
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

      let errorPorLaminaInventada = null;
      try {
        construirDeck(undefined, ["Puente"]);
      } catch (e) {
        errorPorLaminaInventada = String(e.message);
      }

      process.stdout.write(JSON.stringify({
        ...retrato(SLIDES),
        total: TOTAL_SLIDES,
        profileSlugs: workProfiles.map((p) => p.slug),
        legaltech: {
          pedido: [...PERFILES_LEGALTECH],
          deck: retrato(SLIDES_LEGALTECH),
          prosa: nombresEnProsa(SLIDES_LEGALTECH),
        },
        // El deck general sin una lámina de apertura: la misma puerta por la
        // que sale \`puente\` de la variante, probada aparte del subconjunto.
        sinUnaLamina: retrato(construirDeck(undefined, ["puente"])),
        errorPorLaminaInventada,
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

// El conteo va escrito a mano A PROPÓSITO, y es la única cifra del archivo que
// lo está: es la red contra una lámina que entra o sale sin que nadie lo
// decida. Bajó de 15 a 14 al retirar `como-empezamos`, que publicaba los
// cuatro tiempos de `method` palabra por palabra —los mismos que la lámina del
// método— y por eso se quitó. Si esta cifra vuelve a moverse, que sea porque
// alguien la movió aquí a la vez.
test("el deck tiene 14 láminas numeradas de 1 a 14 sin huecos", () => {
  const deck = loadDeck();
  assert.equal(deck.total, 14);
  assert.deepEqual(deck.numbers, Array.from({ length: 14 }, (_, i) => i + 1));
});

test("`como-empezamos` está fuera del modelo, no escondida", () => {
  const deck = loadDeck();
  assert.ok(
    !deck.ids.includes("como-empezamos"),
    "`como-empezamos` volvió al modelo: repetía palabra por palabra los cuatro tiempos de la lámina del método",
  );
  assert.ok(!deck.kinds.includes("como-empezamos"), "quedó un `kind` de `como-empezamos`");
  // Y el cierre sigue siendo el cierre: la lámina que se fue estaba EN MEDIO,
  // así que lo que hay que comprobar es que `capacidades` desemboca en
  // `cierre` y no que el deck termine en algo.
  assert.deepEqual(deck.ids.slice(-2), ["capacidades", "cierre"]);
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

test("una lámina que no existe revienta en vez de no quitar nada en silencio", () => {
  const deck = loadDeck();
  // Es el modo de fallo peligroso de `sinLaminas`: un id mal escrito no quita
  // la lámina, y lo que llega a la sala es justo la lámina que se quería
  // quitar, con todo verde.
  assert.match(String(deck.errorPorLaminaInventada), /no hay lámina para: Puente/);
});

test("quitar una lámina la quita y renumera el resto", () => {
  const deck = loadDeck();
  const { sinUnaLamina } = deck;

  assert.ok(deck.ids.includes("puente"), "el deck general ya no trae `puente`: esta prueba no vale");
  assert.ok(!sinUnaLamina.ids.includes("puente"));
  assert.deepEqual(
    sinUnaLamina.ids,
    deck.ids.filter((id) => id !== "puente"),
  );
  numeracionSana(sinUnaLamina, "sin `puente`");
});

// ── El deck dirigido a legaltech ─────────────────────────────────────────────
// Cuatro productos y sin `puente`. Lo que sigue no comprueba que la lista sea
// «la correcta» —eso lo decide el dueño— sino que el deck publicado es EL QUE
// ESA LISTA DESCRIBE: ni un producto de más, ni la lámina que se quitó.

test("el deck de legaltech presenta exactamente los cuatro perfiles pedidos", () => {
  const deck = loadDeck();
  const { pedido, deck: legaltech } = deck.legaltech;

  assert.equal(pedido.length, 4, "la selección dejó de ser de cuatro productos");
  assert.deepEqual(
    legaltech.productSlugs,
    deck.profileSlugs.filter((slug) => pedido.includes(slug)),
    "el deck dirigido trae productos que nadie pidió, le falta alguno, o los reordenó",
  );
});

test("Porkia no entra en el deck de legaltech", () => {
  const deck = loadDeck();
  // Es la decisión del dueño del 11-ago-2026 y la razón por la que la variante
  // existe: Porkia es una app de porcicultura y ante un ministro no ayuda. Se
  // prueba por su nombre porque es una decisión, no una regla derivable: en
  // `work.ts` no hay ningún campo que diga qué es legaltech y qué no.
  assert.ok(
    deck.profileSlugs.includes("porkia"),
    "ya no hay perfil `porkia` en work.ts: esta prueba no vale y hay que revisar la selección",
  );
  assert.ok(
    !deck.legaltech.pedido.includes("porkia"),
    "Porkia volvió a la selección de legaltech",
  );
  assert.ok(
    !deck.legaltech.deck.productSlugs.includes("porkia"),
    "el deck de legaltech monta la ficha de Porkia",
  );
  assert.ok(
    !deck.legaltech.prosa.includes("Porkia"),
    "la prosa que publican las descripciones de la variante nombra a Porkia",
  );
});

test("el deck de legaltech no lleva `puente`, y lleva todo lo demás", () => {
  const deck = loadDeck();
  const { pedido, deck: legaltech } = deck.legaltech;

  // El esperado se DERIVA del deck general: las mismas láminas, menos `puente`
  // y menos los productos que no presenta. Así, una lámina nueva —o una que se
  // va, como la que repetía los cuatro tiempos— entra en las dos a la vez y
  // esta prueba no hay que tocarla.
  const fuera = deck.profileSlugs.filter((slug) => !pedido.includes(slug));
  assert.deepEqual(
    legaltech.ids,
    deck.ids.filter((id) => id !== "puente" && !fuera.includes(id)),
  );
  assert.ok(!legaltech.kinds.includes("puente"), "`puente` sigue montándose en la variante");
  numeracionSana(legaltech, "legaltech");
});

test("la prosa de la variante nombra sus productos, en el orden del deck", () => {
  const deck = loadDeck();
  const { deck: legaltech, prosa } = deck.legaltech;

  // Es lo que se publica en la descripción de las dos rutas, o sea lo que se ve
  // en la tarjeta del enlace antes de abrir nada. Se compara contra la lista
  // que produce `Intl.ListFormat`, no contra una cadena escrita: lo que se
  // prueba es que nombre a estos y a nadie más, en este orden.
  assert.equal(
    prosa,
    new Intl.ListFormat("es-CO", { style: "long", type: "conjunction" }).format(
      legaltech.productNames,
    ),
    `la descripción publica «${prosa}» y el deck monta ${legaltech.productNames.join(", ")}`,
  );

  for (const name of deck.productNames) {
    if (legaltech.productNames.includes(name)) continue;
    assert.ok(!prosa.includes(name), `«${prosa}» nombra a ${name}, que no está en este deck`);
  }
});

// ── Los conteos escritos a mano que quedan, y su red ─────────────────────────
// La regla del proyecto es que ningún conteo se escriba a mano. Donde el copy
// no puede evitarlo —un titular no dice «4 tiempos», dice «cuatro»— la única
// forma legítima es que una prueba caiga antes de que el texto llegue a mentir.
// Es lo que `verify-deck-reasons.test.mjs` hace con «Trece» y lo que aquí se
// hace con «cuatro».

/** Lee del modelo lo que hace falta para juzgar los conteos del copy. */
function leerConteos() {
  const result = spawnSync(
    "npx",
    ["tsx", "--eval", `
      import { DECK_COPY, DECK_SOURCES } from "./src/content/deck.ts";
      import { method } from "./src/content/home.ts";
      process.stdout.write(JSON.stringify({
        tiempos: method.length,
        metodoRespuesta: DECK_COPY.metodo.respuesta,
        fuente: DECK_SOURCES[0],
      }));
    `],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `no se pudo cargar el copy:\n${result.stderr}`);
  return JSON.parse(result.stdout);
}

test("si `method` deja de tener cuatro tiempos, el titular que lo dice cae", () => {
  const { tiempos, metodoRespuesta } = leerConteos();

  // `method` vive en `home.ts` y lo comparte la portada del sitio: puede crecer
  // por una razón que no tiene nada que ver con el deck, y este titular —y el
  // título del riel que lo espeja— se quedaría mintiendo con `npm run check`
  // en verde.
  //
  // Era una pareja: el otro titular vivía en `como-empezamos`, la lámina que
  // repetía estos mismos cuatro tiempos y que ya no existe. La regla no
  // cambia; lo que queda es un solo sitio donde el conteo está escrito.
  assert.equal(
    tiempos,
    4,
    "cambió el número de tiempos de `method`: actualiza el titular de la lámina del método y su título en `deck.ts`",
  );
  assert.match(metodoRespuesta, /uatro/, `«${metodoRespuesta}» ya no dice cuatro`);
});

test("la muestra que el pie imprime es la que la fuente declara respaldar", () => {
  const { fuente } = leerConteos();
  // `n=1.471` era un literal del JSX: tocar `supports` no lo movía y los dos
  // podían separarse sin que nadie se enterara.
  const numero = fuente.muestra.replace(/[^\d.,]/g, "");
  assert.ok(numero.length > 0, "la muestra no trae ningún número");
  assert.ok(
    fuente.supports.includes(numero),
    `el pie imprime «${fuente.muestra}» y el campo supports no menciona ${numero}`,
  );
});

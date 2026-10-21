import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * La pestaña de noticia del hero (PR Q).
 *
 * Es TEMPORAL: anuncia el viaje del 7 al 13 de diciembre de 2026 y deja de
 * renderizarse sola desde la medianoche del 14 en hora de Colombia. Lo que se
 * vigila aquí es la caducidad —un dígito de más la volvería permanente— y que
 * el componente del servidor la respete antes de pintar nada. Que aparezca en
 * `/` y `/en` mientras está vigente lo comprueba `verify-build-output`.
 */

function cargar(instantes) {
  const result = spawnSync(
    "npx",
    [
      "tsx",
      "--eval",
      `
      import { NEWS_EXPIRES, NEWS_LAST_DAY, NEWS_PLATE, isNewsActive, newsCopy } from "./src/content/noticia.ts";
      const instantes = ${JSON.stringify(instantes)};
      process.stdout.write(JSON.stringify({
        expira: NEWS_EXPIRES,
        ultimoDia: NEWS_LAST_DAY,
        placa: NEWS_PLATE,
        vigente: Object.fromEntries(instantes.map((i) => [i, isNewsActive(Date.parse(i))])),
        es: newsCopy.es,
        en: newsCopy.en,
      }));
    `,
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `no se pudo cargar la noticia:\n${result.stderr}`);
  return JSON.parse(result.stdout);
}

test("la noticia caduca al terminar el 13 de diciembre de 2026, hora de Colombia", () => {
  const instantes = [
    "2026-10-20T12:00:00-05:00",
    "2026-12-13T23:59:59-05:00",
    "2026-12-14T00:00:00-05:00",
    "2027-01-01T00:00:00-05:00",
  ];
  const { expira, ultimoDia, vigente } = cargar(instantes);

  assert.equal(ultimoDia, "2026-12-13");
  assert.equal(new Date(expira).toISOString(), "2026-12-14T05:00:00.000Z");
  assert.equal(vigente[instantes[0]], true, "hoy la pestaña tiene que verse");
  assert.equal(vigente[instantes[1]], true, "el último minuto del 13 todavía cuenta");
  assert.equal(vigente[instantes[2]], false, "desde la medianoche del 14 ya no se renderiza");
  assert.equal(vigente[instantes[3]], false);
});

test("el servidor no pinta la pestaña fuera de su vigencia y el cliente lo repite", () => {
  const servidor = readFileSync(path.join(root, "src/components/home/v5/NewsTab.tsx"), "utf8");
  assert.match(
    servidor,
    /if \(!isNewsActive\(\)\) return null;/,
    "NewsTab debe devolver null cuando la noticia caducó",
  );
  assert.ok(!/"use client"/.test(servidor), "la vigencia se decide en el servidor");

  const cliente = readFileSync(path.join(root, "src/components/home/v5/NewsTab.client.tsx"), "utf8");
  assert.match(cliente, /Date\.now\(\) >= NEWS_EXPIRES/, "el cliente repite la caducidad al hidratar");
  assert.ok(
    /sessionStorage/.test(cliente) && /try\s*\{/.test(cliente),
    "leer y escribir el estado tiene que ir protegido: en navegación privada lanza",
  );
  assert.match(cliente, /aria-expanded=/);
  assert.match(cliente, /aria-controls=/);

  for (const pagina of ["src/app/page.tsx", "src/app/en/page.tsx"]) {
    assert.match(readFileSync(path.join(root, pagina), "utf8"), /<V5Hero[^>]*lang="(es|en)"/, `${pagina}: el hero debe recibir su idioma`);
  }
});

test("los dos idiomas tienen el mismo texto estructurado y la foto existe", () => {
  const { es, en, placa } = cargar([]);
  for (const [lang, copy] of [["es", es], ["en", en]]) {
    assert.ok(copy.tabLabel.includes(copy.tab), `${lang}: el nombre accesible debe contener el texto visible`);
    assert.equal(copy.body.filter((s) => s.strong).length, 2, `${lang}: dos tramos en negrita`);
    assert.match(copy.dateTime, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(copy.plateAlt.length > 20, `${lang}: la foto necesita un alt descriptivo`);
  }
  assert.equal(es.tab, "San Francisco · Dic");
  assert.equal(en.tab, "San Francisco · Dec");

  const archivo = path.join(root, "public", placa.src);
  assert.ok(existsSync(archivo), `falta ${placa.src}`);
  assert.ok(statSync(archivo).size <= 40 * 1024, "la foto de la placa debe pesar 40 KB o menos");
});

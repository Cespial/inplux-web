import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * La puerta del aviso de aliados del Día D.
 *
 * El aviso es TEMPORAL: caduca solo el 15 de octubre de 2026 y después hay que
 * retirarlo —componente, hoja, `src/content/dia-d.ts`, `public/brand/diad/` y
 * esta prueba—. Mientras viva, lo que se puede romper en silencio es la unión
 * entre tres cosas que están en archivos distintos: la lista de aliados, sus
 * descriptores traducidos y sus archivos de logo. Añadir un aliado y olvidar su
 * nota deja un `undefined` en el atributo `title`, que nadie ve hasta que pasa
 * el ratón por encima.
 *
 * La fecha de caducidad se comprueba aparte: es la única pieza que decide si el
 * aviso llega a existir, y un cero de más la volvería permanente.
 */

function cargar() {
  const result = spawnSync(
    "npx",
    [
      "tsx",
      "--eval",
      `
      import { ALLY_NOTICE_EXPIRES, DIA_D_ALLIES, DIA_D_URL } from "./src/content/dia-d.ts";
      import { homeCopyEs } from "./src/content/copy/es.ts";
      import { homeCopyEn } from "./src/content/copy/en.ts";

      process.stdout.write(JSON.stringify({
        expira: ALLY_NOTICE_EXPIRES,
        url: DIA_D_URL,
        aliados: DIA_D_ALLIES.map((a) => ({ id: a.id, name: a.name, src: a.src, href: a.href })),
        notasEs: Object.keys(homeCopyEs.allyNotice.allyNotes),
        notasEn: Object.keys(homeCopyEn.allyNotice.allyNotes),
        tituloEs: homeCopyEs.allyNotice.title,
        tituloEn: homeCopyEn.allyNotice.title,
      }));
    `,
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `no se pudo cargar el aviso:\n${result.stderr}`);
  return JSON.parse(result.stdout);
}

test("cada aliado tiene su descriptor en los dos idiomas", () => {
  const { aliados, notasEs, notasEn } = cargar();
  const ids = aliados.map((a) => a.id).sort();

  assert.deepEqual(
    notasEs.sort(),
    ids,
    "la lista de aliados y sus notas en español no coinciden",
  );
  assert.deepEqual(
    notasEn.sort(),
    ids,
    "la lista de aliados y sus notas en inglés no coinciden",
  );
});

test("cada aliado tiene su archivo de logo en el repo", () => {
  const { aliados } = cargar();
  for (const a of aliados) {
    assert.ok(
      a.src.startsWith("/brand/diad/"),
      `${a.id}: los logos del aviso viven en /brand/diad/, y este apunta a ${a.src}`,
    );
    assert.ok(
      existsSync(path.join(root, "public", a.src)),
      `${a.id}: falta ${a.src} en public/`,
    );
  }
});

test("el aviso caduca en una fecha real y no queda permanente", () => {
  const { expira, url } = cargar();

  assert.ok(Number.isFinite(expira), "la fecha de caducidad no es una fecha");
  const fecha = new Date(expira);
  assert.equal(
    fecha.toISOString().slice(0, 10),
    "2026-10-15",
    "el aviso debe apagarse el día después del evento (14-oct-2026, hora de Colombia)",
  );
  assert.ok(url.startsWith("https://"), "el enlace del evento tiene que ser https");
});

test("el aviso no se monta abierto ni se salta el modo presentación", () => {
  const fuente = readFileSync(
    path.join(root, "src/components/site/AllyNotice.client.tsx"),
    "utf8",
  );

  assert.ok(
    !/<dialog[^>]*\sopen[\s>]/.test(fuente),
    "el diálogo no puede renderizarse abierto: saldría en el HTML del servidor",
  );
  assert.ok(
    /SILENT_PATHS/.test(fuente) && /"\/deck"/.test(fuente),
    "el aviso debe seguir callado en el deck, que es modo presentación",
  );
  assert.ok(
    /localStorage/.test(fuente) && /try\s*\{/.test(fuente),
    "leer y escribir el recordatorio tiene que ir protegido: en navegación privada lanza",
  );
});

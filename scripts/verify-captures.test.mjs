import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ACTA = "public/work/real-pages/capture-manifest.json";

/**
 * La puerta del acta de capturas.
 *
 * `public/work/real-pages/capture-manifest.json` llevaba desde que se escribió
 * diciendo la verdad y **sin que nadie la comprobara**: ningún script del
 * `npm run check` lo leía. Las fechas estaban copiadas a mano en dos pantallas
 * más, cada una con un comentario que decía «copiada del acta», y nada obligaba
 * a las tres copias a coincidir. Con una tercera pantalla —la ficha de producto
 * del deck— eran cuatro.
 *
 * Esta prueba cierra las dos mitades del agujero:
 *
 *   · el acta contra el DISCO: que cada archivo exista, que su `sha256`
 *     recalculado sea el que declara y que sus dimensiones sean las del
 *     `viewport` del acta. Una captura reemplazada sin actualizar el acta deja
 *     de compilar, que es lo que convierte el acta en prueba de procedencia y
 *     no en prosa;
 *   · el acta contra el CÓDIGO: que `src/content/work-captures.ts` —el único
 *     sitio donde las tres pantallas leen la ruta, la fecha y la URL de
 *     origen— diga exactamente lo mismo, sin sobrantes por ningún lado.
 */
function leerRegistro() {
  const result = spawnSync(
    "npx",
    [
      "tsx",
      "--eval",
      `
      import { workCaptures, urlVisible, CAPTURA_ANCHO, CAPTURA_ALTO }
        from "./src/content/work-captures.ts";
      import { workProfiles } from "./src/content/work.ts";

      process.stdout.write(JSON.stringify({
        capturas: workCaptures,
        ancho: CAPTURA_ANCHO,
        alto: CAPTURA_ALTO,
        // La URL enmarcada tiene que ser una fuente del perfil: es lo que hace
        // que la fecha del pie se derive en vez de escribirse. Se comprueba
        // aquí además de en \`verificationDateFor\` para que el fallo se lea como
        // lo que es y no como un build roto en una pantalla cualquiera.
        fuentesPorSlug: Object.fromEntries(
          workProfiles.map((p) => [p.slug, p.sources.map((s) => s.url)]),
        ),
        // La URL visible se DERIVA, así que la prueba comprueba la derivación y
        // no una lista escrita: si alguien cambia \`urlVisible\`, se entera aquí.
        visibles: Object.fromEntries(
          Object.entries(workCaptures).map(([slug, c]) => [slug, urlVisible(c.sourceUrl)]),
        ),
      }));
    `,
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `no se pudo leer el registro de capturas:\n${result.stderr}`);
  return JSON.parse(result.stdout);
}

const acta = JSON.parse(readFileSync(path.join(root, ACTA), "utf8"));
const registro = leerRegistro();

/** Ancho y alto de un PNG, leídos de su cabecera IHDR. */
function dimensiones(buffer) {
  assert.equal(
    buffer.subarray(0, 8).toString("hex"),
    "89504e470d0a1a0a",
    "no es un PNG válido",
  );
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

test("el acta describe archivos que existen, con el sha256 y el tamaño que declara", () => {
  assert.ok(acta.captures.length > 0, "el acta no describe ninguna captura");

  for (const entrada of acta.captures) {
    const relativa = path.join("public/work/real-pages", entrada.file);
    const buffer = readFileSync(path.join(root, relativa));

    assert.equal(
      createHash("sha256").update(buffer).digest("hex"),
      entrada.sha256,
      `${relativa} no coincide con el sha256 del acta: el archivo cambió y el acta no`,
    );

    assert.deepEqual(
      dimensiones(buffer),
      { width: acta.viewport.width, height: acta.viewport.height },
      `${relativa} no tiene el viewport que declara el acta`,
    );
  }
});

test("el registro de capturas y el acta dicen lo mismo, sin sobrantes", () => {
  const porArchivo = new Map(acta.captures.map((c) => [c.file, c]));
  const slugsDelActa = new Set(acta.captures.map((c) => c.slug));

  for (const [slug, captura] of Object.entries(registro.capturas)) {
    const archivo = path.basename(captura.src);
    const entrada = porArchivo.get(archivo);

    assert.ok(entrada, `${slug}: ${archivo} no está en el acta`);
    assert.equal(entrada.slug, slug, `${archivo} está en el acta bajo otro slug`);
    assert.equal(
      captura.capturedAt,
      entrada.capturedAt,
      `${slug}: la fecha del registro no es la del acta`,
    );
    assert.equal(
      captura.capturedFrom,
      entrada.sourceUrl,
      `${slug}: la URL de origen del registro no es la del acta`,
    );
    assert.equal(
      captura.src,
      `/work/real-pages/${entrada.file}`,
      `${slug}: la ruta del registro no apunta al archivo del acta`,
    );
    assert.ok(captura.alt.trim().length > 0, `${slug}: la captura no tiene texto alternativo`);
  }

  assert.deepEqual(
    new Set(Object.keys(registro.capturas)),
    slugsDelActa,
    "el acta y el registro no cubren los mismos productos",
  );
});

test("la URL que se enmarca es una fuente del perfil, y la visible se deriva de ella", () => {
  for (const [slug, captura] of Object.entries(registro.capturas)) {
    const fuentes = registro.fuentesPorSlug[slug];
    assert.ok(fuentes, `${slug}: no hay perfil en work.ts`);
    assert.ok(
      fuentes.includes(captura.sourceUrl),
      `${slug}: la URL enmarcada ${captura.sourceUrl} no es ninguna fuente del perfil (${fuentes.join(", ")})`,
    );

    const visible = registro.visibles[slug];
    assert.ok(
      !visible.startsWith("http") && !visible.startsWith("www.") && !visible.endsWith("/"),
      `${slug}: la URL visible «${visible}» conserva protocolo, www o barra final`,
    );
    assert.ok(
      captura.sourceUrl.includes(visible),
      `${slug}: la URL visible «${visible}» no es un recorte de la que se enmarca`,
    );
  }
});

test("el tamaño declarado de las capturas es el del acta", () => {
  assert.equal(registro.ancho, acta.viewport.width);
  assert.equal(registro.alto, acta.viewport.height);
});

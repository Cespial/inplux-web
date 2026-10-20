import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { auditPartners, PARTNER_REGISTRY, PARTNER_ASSET_DIRECTORY } from "./partners-gate.mjs";

/**
 * La puerta de partners se prueba con carpetas de fixture: un registro JSON y
 * una carpeta de logos armados a mano, nunca los del sitio. Lo que debe fallar
 * en silencio si nadie lo mira es la unión entre tres cosas: el registro, los
 * archivos y el permiso con su fecha.
 */
const NOW = Date.parse("2026-10-19T12:00:00.000Z");

function fixture({ partners, assets = [], extraFiles = {} }) {
  const root = mkdtempSync(path.join(tmpdir(), "partners-"));
  mkdirSync(path.join(root, path.dirname(PARTNER_REGISTRY)), { recursive: true });
  mkdirSync(path.join(root, PARTNER_ASSET_DIRECTORY), { recursive: true });
  writeFileSync(path.join(root, PARTNER_REGISTRY), JSON.stringify({ partners }));
  for (const asset of assets) {
    writeFileSync(path.join(root, PARTNER_ASSET_DIRECTORY, asset), "<svg/>");
  }
  const sourceFiles = [];
  for (const [file, content] of Object.entries(extraFiles)) {
    mkdirSync(path.join(root, path.dirname(file)), { recursive: true });
    writeFileSync(path.join(root, file), content);
    sourceFiles.push(file);
  }
  return { root, sourceFiles };
}

const valid = {
  id: "ejemplo",
  name: "Ejemplo",
  file: "/brand/partners/ejemplo.svg",
  width: 200,
  height: 48,
  relation: "modelos",
  origin: "https://example.com/logo.svg",
  permission: {
    kind: "brand-guidelines",
    source: "https://example.com/brand",
    grantedAt: "2026-10-01",
    verifiedAt: "2026-10-18",
  },
};

test("un registro vacío pasa", async () => {
  const { root, sourceFiles } = fixture({ partners: [] });
  assert.deepEqual(await auditPartners({ root, sourceFiles, now: NOW }), []);
});

test("un partner con archivo y permiso vigente pasa", async () => {
  const { root, sourceFiles } = fixture({ partners: [valid], assets: ["ejemplo.svg"] });
  assert.deepEqual(await auditPartners({ root, sourceFiles, now: NOW }), []);
});

test("un logo sin declarar en el registro falla", async () => {
  const { root, sourceFiles } = fixture({ partners: [], assets: ["colado.svg"] });
  const errors = await auditPartners({ root, sourceFiles, now: NOW });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /colado\.svg no está declarado/);
});

test("un partner sin archivo falla", async () => {
  const { root, sourceFiles } = fixture({ partners: [valid] });
  const errors = await auditPartners({ root, sourceFiles, now: NOW });
  assert.ok(errors.some((e) => /falta el archivo/.test(e)), errors.join("\n"));
});

test("un permiso sin fuente HTTPS o caducado falla", async () => {
  const sinFuente = { ...valid, permission: { ...valid.permission, source: "correo de Juan" } };
  const caducado = {
    ...valid,
    id: "viejo",
    file: "/brand/partners/viejo.svg",
    permission: { ...valid.permission, verifiedAt: "2026-01-01" },
  };
  const { root, sourceFiles } = fixture({
    partners: [sinFuente, caducado],
    assets: ["ejemplo.svg", "viejo.svg"],
  });
  const errors = await auditPartners({ root, sourceFiles, now: NOW });
  assert.ok(errors.some((e) => /fuente HTTPS/.test(e)), errors.join("\n"));
  assert.ok(errors.some((e) => /sin verificar/.test(e)), errors.join("\n"));
});

test("nombrar /brand/partners/ fuera de los archivos autorizados falla", async () => {
  const { root, sourceFiles } = fixture({
    partners: [],
    extraFiles: { "src/components/Otro.tsx": 'const src = "/brand/partners/x.svg";' },
  });
  const errors = await auditPartners({ root, sourceFiles, now: NOW });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /Otro\.tsx nombra \/brand\/partners\//);
});

test("un permiso declarado por la dirección exige correo @inplux.co y nota", async () => {
  const declarado = {
    ...valid,
    permission: {
      kind: "declared-by-owner",
      declaredBy: "direccion@inplux.co",
      note: "Autorización declarada por la dirección; soporte pendiente de archivar.",
      grantedAt: "2026-10-01",
      verifiedAt: "2026-10-18",
    },
  };
  const ok = fixture({ partners: [declarado], assets: ["ejemplo.svg"] });
  assert.deepEqual(await auditPartners({ root: ok.root, sourceFiles: ok.sourceFiles, now: NOW }), []);

  const sinNota = { ...declarado, permission: { ...declarado.permission, declaredBy: "alguien@gmail.com", note: "" } };
  const mal = fixture({ partners: [sinNota], assets: ["ejemplo.svg"] });
  const errors = await auditPartners({ root: mal.root, sourceFiles: mal.sourceFiles, now: NOW });
  assert.ok(errors.some((e) => /@inplux\.co/.test(e)), errors.join("\n"));
  assert.ok(errors.some((e) => /nota/.test(e)), errors.join("\n"));
});

test("un partner sin URL de origen del archivo falla", async () => {
  const sinOrigen = { ...valid };
  delete sinOrigen.origin;
  const { root, sourceFiles } = fixture({ partners: [sinOrigen], assets: ["ejemplo.svg"] });
  const errors = await auditPartners({ root, sourceFiles, now: NOW });
  assert.ok(errors.some((e) => /origen/.test(e)), errors.join("\n"));
});

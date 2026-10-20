import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

/**
 * La puerta de los partners tecnológicos.
 *
 * El README dice que no se publica ningún logo de terceros sin un permiso
 * registrado. Para los clientes ese registro es la nota de cada relación en
 * `src/content/clients.ts`; para los partners es `src/content/partners.json`, y esta
 * función es la que lo hace cumplir antes de cada build:
 *
 *   1. todo archivo en `public/brand/partners/` está declarado en el registro;
 *   2. todo partner declarado tiene su archivo;
 *   3. cada permiso trae fuente HTTPS, `grantedAt` no futura y `verifiedAt`
 *      dentro del plazo de frescura del sitio (el mismo que el portafolio);
 *   4. `/brand/partners/` sólo se nombra en los archivos con permiso para
 *      hacerlo, igual que `approvedLogoFiles` con los clientes.
 *
 * Devuelve la lista de problemas (vacía si pasa) para que el verificador la
 * sume a la suya y las pruebas la ejerciten con carpetas de fixture.
 */
export const PARTNER_REGISTRY = "src/content/partners.json";
export const PARTNER_ASSET_DIRECTORY = "public/brand/partners";
export const PARTNER_APPROVED_FILES = new Set([
  "src/content/partners.json",
  "src/content/partners.ts",
  "src/components/home/PartnerWall.tsx",
  "scripts/partners-gate.mjs",
]);

const PERMISSION_KINDS = new Set([
  "brand-guidelines",
  "program-badge",
  "written-consent",
  // La dirección de INPLUX declara por escrito que el uso está autorizado y
  // queda pendiente archivar el soporte: se registra quién lo declara y cuándo,
  // sin inventar una URL de consentimiento que no existe.
  "declared-by-owner",
]);
const RELATIONS = new Set(["modelos", "infraestructura", "plataforma"]);

function isValidIsoDate(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime())
  );
}

export async function auditPartners({
  root,
  sourceFiles,
  now = Date.now(),
  maxAgeDays = 120,
}) {
  const errors = [];
  const registryPath = path.join(root, PARTNER_REGISTRY);

  let registry;
  try {
    registry = JSON.parse(await readFile(registryPath, "utf8"));
  } catch (error) {
    return [`${PARTNER_REGISTRY} no se pudo leer: ${error.message}`];
  }
  if (!registry || !Array.isArray(registry.partners)) {
    return [`${PARTNER_REGISTRY} debe declarar un arreglo "partners"`];
  }

  const declared = new Map();
  for (const partner of registry.partners) {
    const label = partner?.id ?? partner?.name ?? "(sin id)";
    if (typeof partner?.id !== "string" || typeof partner?.name !== "string") {
      errors.push(`${PARTNER_REGISTRY}: el partner ${label} necesita id y name`);
      continue;
    }
    if (declared.has(partner.id)) errors.push(`${PARTNER_REGISTRY}: id repetido ${partner.id}`);
    declared.set(partner.id, partner);

    if (typeof partner.file !== "string" || !partner.file.startsWith(`/${PARTNER_ASSET_DIRECTORY.slice("public/".length)}/`)) {
      errors.push(`${PARTNER_REGISTRY}: ${partner.id} debe apuntar a /brand/partners/…`);
    }
    if (!Number.isInteger(partner.width) || !Number.isInteger(partner.height)) {
      errors.push(`${PARTNER_REGISTRY}: ${partner.id} necesita width y height enteros`);
    }
    if (!RELATIONS.has(partner.relation)) {
      errors.push(`${PARTNER_REGISTRY}: ${partner.id} tiene una relación desconocida: ${partner.relation}`);
    }

    const permission = partner.permission;
    if (!permission || typeof permission !== "object") {
      errors.push(`${PARTNER_REGISTRY}: ${partner.id} no registra permiso de uso de marca`);
      continue;
    }
    if (!PERMISSION_KINDS.has(permission.kind)) {
      errors.push(`${PARTNER_REGISTRY}: ${partner.id} tiene un tipo de permiso desconocido: ${permission.kind}`);
    }
    if (permission.kind === "declared-by-owner") {
      if (typeof permission.declaredBy !== "string" || !/^\S+@inplux\.co$/.test(permission.declaredBy)) {
        errors.push(`${PARTNER_REGISTRY}: ${partner.id} necesita el correo @inplux.co de quien declara el permiso`);
      }
      if (typeof permission.note !== "string" || permission.note.trim().length < 20) {
        errors.push(`${PARTNER_REGISTRY}: ${partner.id} necesita una nota que explique la declaración`);
      }
    } else if (typeof permission.source !== "string" || !/^https:\/\/\S+$/.test(permission.source)) {
      errors.push(`${PARTNER_REGISTRY}: ${partner.id} necesita la fuente HTTPS del permiso`);
    }
    if (typeof partner.origin !== "string" || !/^https:\/\/\S+$/.test(partner.origin)) {
      errors.push(`${PARTNER_REGISTRY}: ${partner.id} necesita la URL de origen del archivo (origin)`);
    }
    for (const field of ["grantedAt", "verifiedAt"]) {
      if (!isValidIsoDate(permission[field])) {
        errors.push(`${PARTNER_REGISTRY}: ${partner.id} tiene ${field} inválido: ${permission[field]}`);
      }
    }
    if (isValidIsoDate(permission.grantedAt)) {
      const granted = new Date(`${permission.grantedAt}T00:00:00.000Z`).getTime();
      if (granted - now > 2 * 86_400_000) {
        errors.push(`${PARTNER_REGISTRY}: ${partner.id} tiene grantedAt en el futuro`);
      }
    }
    if (isValidIsoDate(permission.verifiedAt)) {
      const ageDays = (now - new Date(`${permission.verifiedAt}T00:00:00.000Z`).getTime()) / 86_400_000;
      if (ageDays > maxAgeDays) {
        errors.push(
          `${PARTNER_REGISTRY}: el permiso de ${partner.id} lleva ${Math.floor(ageDays)} días sin verificar (máximo ${maxAgeDays})`,
        );
      }
    }
  }

  let assets = [];
  try {
    assets = (await readdir(path.join(root, PARTNER_ASSET_DIRECTORY))).filter(
      (name) => !name.startsWith("."),
    );
  } catch {
    if (declared.size > 0) errors.push(`${PARTNER_ASSET_DIRECTORY} no existe y hay partners declarados`);
  }
  const declaredFiles = new Set(
    [...declared.values()].map((partner) => path.basename(String(partner.file))),
  );
  for (const asset of assets) {
    if (!declaredFiles.has(asset)) {
      errors.push(`${PARTNER_ASSET_DIRECTORY}/${asset} no está declarado en ${PARTNER_REGISTRY}`);
    }
  }
  for (const partner of declared.values()) {
    const file = path.basename(String(partner.file));
    if (!assets.includes(file)) {
      errors.push(`${PARTNER_REGISTRY}: falta el archivo ${partner.file} de ${partner.id}`);
    }
  }

  for (const file of sourceFiles ?? []) {
    if (PARTNER_APPROVED_FILES.has(file)) continue;
    const source = await readFile(path.join(root, file), "utf8");
    if (source.includes("/brand/partners/")) {
      errors.push(`${file} nombra /brand/partners/ sin estar entre los archivos autorizados`);
    }
  }

  return errors;
}

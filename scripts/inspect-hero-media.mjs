#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const POSTERS = [
  {
    filename: "hero-factory-poster-desktop.avif",
    label: "Poster desktop",
    expectedWidth: 1920,
    expectedHeight: 1080,
    ratio: 16 / 9,
    ratioLabel: "16:9",
    sizeLimit: 220_000,
  },
  {
    filename: "hero-factory-poster-mobile.avif",
    label: "Poster móvil",
    expectedWidth: 1080,
    expectedHeight: 1350,
    ratio: 4 / 5,
    ratioLabel: "4:5",
    sizeLimit: 140_000,
  },
];

const VIDEOS = [
  {
    filename: "hero-factory-intro.webm",
    label: "Video WebM",
    codecs: new Set(["av1", "vp9"]),
    codecLabel: "AV1 o VP9",
    container: "webm",
  },
  {
    filename: "hero-factory-intro.mp4",
    label: "Video MP4",
    codecs: new Set(["h264"]),
    codecLabel: "H.264",
    container: "mp4",
  },
];

const EXPECTED_FILENAMES = new Set(
  [...POSTERS, ...VIDEOS].map(({ filename }) => filename),
);
const VIDEO_SIZE_LIMIT = 2_500_000;
const MINIMUM_VIDEO_WIDTH = 1280;
const MINIMUM_VIDEO_HEIGHT = 720;
const VIDEO_RATIO = 16 / 9;
const VIDEO_RATIO_LABEL = "16:9";
const MINIMUM_DURATION = 4.8;
const MAXIMUM_DURATION = 5.2;
const RATIO_TOLERANCE = 0.01;
const MANIFEST_FILENAME = "hero-media-manifest.json";
const SUPPORTED_MANIFEST_VERSION = 1;

function usage() {
  return [
    "Uso: npm run inspect:hero -- <directorio> [--json]",
    "",
    `Exige ${MANIFEST_FILENAME}, inspecciona los posters y, si se entregan, el par WebM/MP4 del HERO.`,
    "Puedes definir FFPROBE_PATH para usar una instalación específica de ffprobe.",
  ].join("\n");
}

function parseArguments(argv) {
  const json = argv.includes("--json");
  const help = argv.includes("--help") || argv.includes("-h");
  const unknownOptions = argv.filter(
    (argument) => argument.startsWith("-") && !["--json", "--help", "-h"].includes(argument),
  );
  const positional = argv.filter((argument) => !argument.startsWith("-"));

  return { help, json, positional, unknownOptions };
}

function firstUsefulLine(value) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);
}

function renderFatal({ json, code, message, details, exitCode = 2 }) {
  if (json) {
    process.stdout.write(
      `${JSON.stringify(
        {
          ok: false,
          exitCode,
          errors: [{ code, message, ...(details ? { details } : {}) }],
        },
        null,
        2,
      )}\n`,
    );
  } else {
    process.stderr.write(`Error: ${message}\n`);
    if (details) process.stderr.write(`${details}\n`);
    process.stderr.write(`${usage()}\n`);
  }
  process.exit(exitCode);
}

function loadManifest(directory, json) {
  const manifestPath = path.join(directory, MANIFEST_FILENAME);
  let stats;
  try {
    stats = statSync(manifestPath);
  } catch (error) {
    renderFatal({
      json,
      code: error?.code === "ENOENT" ? "MANIFEST_MISSING" : "MANIFEST_READ_FAILED",
      message:
        error?.code === "ENOENT"
          ? `Falta ${MANIFEST_FILENAME} en la entrega.`
          : `No se pudo abrir ${MANIFEST_FILENAME}.`,
      details: error?.code === "ENOENT" ? undefined : error.message,
      exitCode: 1,
    });
  }

  if (!stats.isFile()) {
    renderFatal({
      json,
      code: "MANIFEST_NOT_FILE",
      message: `${MANIFEST_FILENAME} existe, pero no es un archivo regular.`,
      exitCode: 1,
    });
  }

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (error) {
    renderFatal({
      json,
      code: error instanceof SyntaxError ? "MANIFEST_JSON_INVALID" : "MANIFEST_READ_FAILED",
      message:
        error instanceof SyntaxError
          ? `${MANIFEST_FILENAME} no contiene JSON válido.`
          : `No se pudo leer ${MANIFEST_FILENAME}.`,
      details: error.message,
      exitCode: 1,
    });
  }

  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    renderFatal({
      json,
      code: "MANIFEST_ROOT_INVALID",
      message: `${MANIFEST_FILENAME} debe contener un objeto JSON en la raíz.`,
      exitCode: 1,
    });
  }
  if (manifest.schemaVersion !== SUPPORTED_MANIFEST_VERSION) {
    renderFatal({
      json,
      code: "MANIFEST_SCHEMA_VERSION_UNSUPPORTED",
      message: `${MANIFEST_FILENAME} usa schemaVersion ${String(manifest.schemaVersion)}; se admite ${SUPPORTED_MANIFEST_VERSION}.`,
      exitCode: 1,
    });
  }

  return manifest;
}

function findFfprobe(json) {
  const executable = process.platform === "win32" ? "ffprobe.exe" : "ffprobe";
  const pathCandidates = String(process.env.PATH ?? "")
    .split(path.delimiter)
    .filter(Boolean)
    .map((directory) => path.join(directory, executable));
  const commonCandidates = [
    process.env.CONDA_PREFIX && path.join(process.env.CONDA_PREFIX, "bin", executable),
    process.env.HOME && path.join(process.env.HOME, "anaconda3", "bin", executable),
    process.env.HOME && path.join(process.env.HOME, "miniconda3", "bin", executable),
    "/opt/homebrew/bin/ffprobe",
    "/usr/local/bin/ffprobe",
    "/usr/bin/ffprobe",
  ].filter(Boolean);
  const candidates = process.env.FFPROBE_PATH
    ? [process.env.FFPROBE_PATH]
    : [...new Set([...pathCandidates, ...commonCandidates])];
  const failures = [];

  for (const command of candidates) {
    const result = spawnSync(command, ["-version"], {
      encoding: "utf8",
      windowsHide: true,
    });

    if (!result.error && result.status === 0) {
      return {
        command,
        version: firstUsefulLine(result.stdout) || "ffprobe (versión no informada)",
      };
    }

    if (result.error?.code !== "ENOENT") {
      failures.push(`${command}: ${firstUsefulLine(result.error?.message || result.stderr) || "falló"}`);
    }
  }

  renderFatal({
    json,
    code: failures.length > 0 ? "FFPROBE_UNAVAILABLE" : "FFPROBE_NOT_FOUND",
    message: process.env.FFPROBE_PATH
      ? `No se pudo usar ffprobe desde FFPROBE_PATH (${process.env.FFPROBE_PATH}).`
      : "No se encontró una instalación funcional de ffprobe. Instala FFmpeg o define FFPROBE_PATH.",
    details: failures.slice(0, 3).join("\n") || undefined,
    exitCode: 2,
  });
}

function probeAsset(ffprobe, assetPath) {
  const result = spawnSync(
    ffprobe.command,
    [
      "-v",
      "error",
      "-show_entries",
      "format=format_name,duration,size:format_tags=major_brand:stream=index,codec_type,codec_name,width,height,duration,display_aspect_ratio",
      "-of",
      "json",
      assetPath,
    ],
    {
      encoding: "utf8",
      maxBuffer: 2 * 1024 * 1024,
      windowsHide: true,
    },
  );

  if (result.error || result.status !== 0) {
    return {
      error: firstUsefulLine(result.error?.message || result.stderr) || "ffprobe no pudo leer el archivo",
    };
  }

  try {
    return { data: JSON.parse(result.stdout) };
  } catch {
    return { error: "ffprobe devolvió una respuesta JSON inválida" };
  }
}

function addError(report, code, message, asset) {
  report.errors.push({ code, message, ...(asset ? { asset } : {}) });
}

function addManifestError(report, code, message, details = {}) {
  report.errors.push({ code, message, ...details });
}

function valueAt(source, field) {
  return field.split(".").reduce((value, key) => value?.[key], source);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isRfc3339(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
    Number.isFinite(Date.parse(value))
  );
}

function isHttpsUrl(value) {
  if (!isNonEmptyString(value)) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isSafeFilename(value) {
  return (
    isNonEmptyString(value) &&
    path.basename(value) === value &&
    !value.includes("..") &&
    !value.includes("/") &&
    !value.includes("\\")
  );
}

function isSha256(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

function requireManifestField(report, manifest, field, predicate, expected) {
  const actual = valueAt(manifest, field);
  if (predicate(actual)) return actual;
  addManifestError(
    report,
    "MANIFEST_FIELD_INVALID",
    `${MANIFEST_FILENAME}: ${field} debe ser ${expected}.`,
    { field, expected, actual: actual ?? null },
  );
  return actual;
}

function requireContractValue(report, manifest, field, expected) {
  const actual = valueAt(manifest, field);
  if (actual === expected) return;
  addManifestError(
    report,
    "MANIFEST_CONTRACT_MISMATCH",
    `${MANIFEST_FILENAME}: ${field} debe ser ${JSON.stringify(expected)}.`,
    { field, expected, actual: actual ?? null },
  );
}

function ratioMatches(width, height, expectedRatio) {
  return Number.isFinite(width) &&
    Number.isFinite(height) &&
    height > 0 &&
    Math.abs(width / height - expectedRatio) <= RATIO_TOLERANCE;
}

function formatKilobytes(bytes) {
  return `${(bytes / 1000).toFixed(bytes < 10_000 ? 1 : 0)} KB`;
}

function isExpectedContainer(formatName, expectedContainer) {
  const formats = String(formatName ?? "")
    .toLowerCase()
    .split(",");
  if (expectedContainer === "webm") return formats.includes("webm") || formats.includes("matroska");
  return formats.includes("mp4") || formats.includes("mov");
}

function inspectFile(report, ffprobe, directory, definition, kind) {
  const assetPath = path.join(directory, definition.filename);
  const asset = {
    filename: definition.filename,
    kind,
    required: kind === "poster",
    present: false,
  };
  report.assets.push(asset);

  let stats;
  try {
    stats = statSync(assetPath);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      addError(
        report,
        "ASSET_STAT_FAILED",
        `No se pudo inspeccionar ${definition.filename}: ${error.message}`,
        definition.filename,
      );
    }
    return asset;
  }

  asset.present = true;
  asset.sizeBytes = stats.size;

  if (!stats.isFile()) {
    addError(
      report,
      "ASSET_NOT_FILE",
      `${definition.filename} existe, pero no es un archivo regular.`,
      definition.filename,
    );
    return asset;
  }

  try {
    asset.sha256 = createHash("sha256").update(readFileSync(assetPath)).digest("hex");
  } catch (error) {
    addManifestError(
      report,
      "ASSET_SHA256_FAILED",
      `No se pudo calcular SHA-256 para ${definition.filename}: ${error.message}`,
      { asset: definition.filename },
    );
  }

  const probe = probeAsset(ffprobe, assetPath);
  if (probe.error) {
    addError(
      report,
      "ASSET_UNREADABLE",
      `${definition.filename} no es un medio válido: ${probe.error}`,
      definition.filename,
    );
    return asset;
  }

  const streams = Array.isArray(probe.data.streams) ? probe.data.streams : [];
  const videoStreams = streams.filter((stream) => stream.codec_type === "video");
  const audioStreams = streams.filter((stream) => stream.codec_type === "audio");
  const videoStream = videoStreams[0];
  const format = probe.data.format ?? {};

  asset.formatName = format.format_name ?? null;
  asset.majorBrand = format.tags?.major_brand ?? null;
  asset.videoStreamCount = videoStreams.length;
  asset.audioStreamCount = audioStreams.length;

  if (!videoStream) {
    addError(
      report,
      "VIDEO_STREAM_MISSING",
      `${definition.filename} no contiene una pista visual.`,
      definition.filename,
    );
    return asset;
  }

  asset.codec = String(videoStream.codec_name ?? "").toLowerCase() || null;
  asset.width = Number(videoStream.width);
  asset.height = Number(videoStream.height);

  if (videoStreams.length !== 1) {
    addError(
      report,
      "VIDEO_STREAM_COUNT",
      `${definition.filename} debe contener una sola pista visual; contiene ${videoStreams.length}.`,
      definition.filename,
    );
  }

  if (kind === "poster") {
    asset.expectedRatio = definition.ratioLabel;
    asset.sizeLimitBytes = definition.sizeLimit;
    asset.expectedDimensions = `${definition.expectedWidth}×${definition.expectedHeight}`;

    if (asset.codec !== "av1" || !["avif", "avis"].includes(asset.majorBrand)) {
      addError(
        report,
        "POSTER_CODEC",
        `${definition.filename} debe ser un AVIF real (codec AV1 y marca AVIF); ffprobe informa ${asset.codec || "codec desconocido"}/${asset.majorBrand || "marca desconocida"}.`,
        definition.filename,
      );
    }
    if (!ratioMatches(asset.width, asset.height, definition.ratio)) {
      addError(
        report,
        "POSTER_RATIO",
        `${definition.filename} mide ${asset.width || "?"}×${asset.height || "?"}; debe usar relación ${definition.ratioLabel}.`,
        definition.filename,
      );
    }
    if (asset.width !== definition.expectedWidth || asset.height !== definition.expectedHeight) {
      addError(
        report,
        "POSTER_DIMENSIONS",
        `${definition.filename} mide ${asset.width || "?"}×${asset.height || "?"}; la entrega final debe medir exactamente ${definition.expectedWidth}×${definition.expectedHeight}.`,
        definition.filename,
      );
    }
    if (stats.size > definition.sizeLimit) {
      addError(
        report,
        "POSTER_SIZE",
        `${definition.filename} pesa ${formatKilobytes(stats.size)}; el máximo es ${formatKilobytes(definition.sizeLimit)}.`,
        definition.filename,
      );
    }
    return asset;
  }

  const durationCandidates = [format.duration, videoStream.duration]
    .map(Number)
    .filter(Number.isFinite);
  asset.durationSeconds = durationCandidates[0] ?? null;
  asset.expectedRatio = VIDEO_RATIO_LABEL;
  asset.minimumDimensions = `${MINIMUM_VIDEO_WIDTH}×${MINIMUM_VIDEO_HEIGHT}`;

  if (!definition.codecs.has(asset.codec)) {
    addError(
      report,
      "VIDEO_CODEC",
      `${definition.filename} debe usar ${definition.codecLabel}; ffprobe informa ${asset.codec || "codec desconocido"}.`,
      definition.filename,
    );
  }
  if (!isExpectedContainer(asset.formatName, definition.container)) {
    addError(
      report,
      "VIDEO_CONTAINER",
      `${definition.filename} no usa un contenedor ${definition.container.toUpperCase()} válido.`,
      definition.filename,
    );
  }
  if (!ratioMatches(asset.width, asset.height, VIDEO_RATIO)) {
    addError(
      report,
      "VIDEO_RATIO",
      `${definition.filename} mide ${asset.width || "?"}×${asset.height || "?"}; debe usar relación ${VIDEO_RATIO_LABEL}.`,
      definition.filename,
    );
  }
  if (asset.width < MINIMUM_VIDEO_WIDTH || asset.height < MINIMUM_VIDEO_HEIGHT) {
    addError(
      report,
      "VIDEO_DIMENSIONS",
      `${definition.filename} mide ${asset.width || "?"}×${asset.height || "?"}; el mínimo es ${MINIMUM_VIDEO_WIDTH}×${MINIMUM_VIDEO_HEIGHT}.`,
      definition.filename,
    );
  }
  if (
    asset.durationSeconds === null ||
    asset.durationSeconds < MINIMUM_DURATION ||
    asset.durationSeconds > MAXIMUM_DURATION
  ) {
    addError(
      report,
      "VIDEO_DURATION",
      `${definition.filename} dura ${asset.durationSeconds === null ? "un tiempo desconocido" : `${asset.durationSeconds.toFixed(3)} s`}; debe durar entre ${MINIMUM_DURATION.toFixed(1)} y ${MAXIMUM_DURATION.toFixed(1)} s.`,
      definition.filename,
    );
  }
  if (audioStreams.length > 0) {
    addError(
      report,
      "VIDEO_AUDIO",
      `${definition.filename} contiene ${audioStreams.length} pista(s) de audio; el HERO debe ser silencioso.`,
      definition.filename,
    );
  }

  return asset;
}

function validateAssetHash(report, manifest, assetsByName, manifestField, filename, required) {
  const expected = valueAt(manifest, manifestField);
  const asset = assetsByName.get(filename);

  if (!asset?.present) {
    if (required) {
      if (!isSha256(expected)) {
        addManifestError(
          report,
          "MANIFEST_SHA256_INVALID",
          `${MANIFEST_FILENAME}: falta un SHA-256 válido para el activo obligatorio ${filename}.`,
          { field: manifestField, asset: filename, actual: expected ?? null },
        );
      }
    } else if (expected !== null && expected !== undefined) {
      addManifestError(
        report,
        "MANIFEST_VIDEO_STATE_MISMATCH",
        `${MANIFEST_FILENAME}: ${manifestField} debe ser null cuando ${filename} se omite.`,
        { field: manifestField, asset: filename, actual: expected },
      );
    }
    return;
  }

  if (!isSha256(expected)) {
    addManifestError(
      report,
      "MANIFEST_SHA256_INVALID",
      `${MANIFEST_FILENAME}: ${manifestField} debe contener 64 caracteres hexadecimales en minúscula.`,
      { field: manifestField, asset: filename, actual: expected ?? null },
    );
    return;
  }
  if (asset.sha256 && asset.sha256 !== expected) {
    addManifestError(
      report,
      "ASSET_SHA256_MISMATCH",
      `${filename} no coincide con el SHA-256 aprobado en el manifest.`,
      { asset: filename, expected, actual: asset.sha256 },
    );
  }
}

function validateDecisionFile(report, manifest, directory, field, expectedMode, comparison = {}) {
  const filename = valueAt(manifest, field);
  if (!isSafeFilename(filename)) {
    addManifestError(
      report,
      "MANIFEST_DECISION_INVALID",
      `${MANIFEST_FILENAME}: ${field} debe ser un nombre JSON relativo y seguro.`,
      { field, actual: filename ?? null },
    );
    return null;
  }

  const decisionPath = path.join(directory, filename);
  let stats;
  try {
    stats = statSync(decisionPath);
  } catch (error) {
    addManifestError(
      report,
      error?.code === "ENOENT" ? "MANIFEST_DECISION_MISSING" : "MANIFEST_DECISION_INVALID",
      error?.code === "ENOENT"
        ? `Falta la decisión visual ${filename}.`
        : `No se pudo abrir la decisión visual ${filename}: ${error.message}`,
      { field, decision: filename },
    );
    return null;
  }
  if (!stats.isFile()) {
    addManifestError(
      report,
      "MANIFEST_DECISION_INVALID",
      `${filename} existe, pero no es un archivo regular.`,
      { field, decision: filename },
    );
    return null;
  }

  let decision;
  try {
    decision = JSON.parse(readFileSync(decisionPath, "utf8"));
  } catch (error) {
    addManifestError(
      report,
      "MANIFEST_DECISION_INVALID",
      `${filename} no contiene JSON válido: ${error.message}`,
      { field, decision: filename },
    );
    return null;
  }

  const winner = decision?.winner;
  const winnerData = decision?.variants?.[winner];
  const invalidReasons = [];
  if (decision?.schemaVersion !== 1) invalidReasons.push("schemaVersion debe ser 1");
  if (decision?.reviewType !== "inplux-hero-visual-review") {
    invalidReasons.push("reviewType no corresponde al reviewer INPLUX");
  }
  if (decision?.status !== "approved") invalidReasons.push("status debe ser approved");
  if (decision?.assetMode !== expectedMode) {
    invalidReasons.push(`assetMode debe ser ${expectedMode}`);
  }
  if (!isRfc3339(decision?.reviewedAt)) invalidReasons.push("reviewedAt no es RFC 3339");
  if (!new Set(["A", "B", "C", "D"]).has(winner)) invalidReasons.push("winner debe ser A–D");
  if (!winnerData || winnerData.eligible !== true) invalidReasons.push("la variante ganadora no es elegible");
  if (!Array.isArray(winnerData?.technicalIssues) || winnerData.technicalIssues.length > 0) {
    invalidReasons.push("la variante ganadora conserva problemas técnicos");
  }
  const criteria = winnerData?.criteria;
  if (
    !criteria ||
    typeof criteria !== "object" ||
    Array.isArray(criteria) ||
    Object.keys(criteria).length === 0 ||
    Object.values(criteria).some((value) => value !== true)
  ) {
    invalidReasons.push("todos los criterios de la variante ganadora deben estar aprobados");
  }
  if (comparison.variant && winner !== comparison.variant) {
    invalidReasons.push(`winner no coincide con ${comparison.variant}`);
  }
  if (comparison.filename && winnerData?.fileName !== comparison.filename) {
    invalidReasons.push(`fileName debe ser ${comparison.filename}`);
  }
  if (comparison.sha256 && winnerData?.sha256 !== comparison.sha256) {
    invalidReasons.push("sha256 no coincide con el activo aprobado");
  }

  if (invalidReasons.length > 0) {
    addManifestError(
      report,
      "MANIFEST_DECISION_INVALID",
      `${filename} no demuestra una aprobación válida: ${invalidReasons.join("; ")}.`,
      { field, decision: filename },
    );
    return null;
  }

  return { filename, mode: expectedMode, winner, reviewedAt: decision.reviewedAt };
}

function validateManifest(report, manifest, directory) {
  report.manifest = {
    filename: MANIFEST_FILENAME,
    schemaVersion: manifest.schemaVersion,
    status: manifest.status ?? null,
    decisions: [],
  };

  requireManifestField(report, manifest, "project", isNonEmptyString, "un texto no vacío");
  requireManifestField(report, manifest, "concept", isNonEmptyString, "un texto no vacío");
  requireManifestField(report, manifest, "generatedAt", isRfc3339, "una fecha RFC 3339");

  if (manifest.status !== "approved") {
    addManifestError(
      report,
      "MANIFEST_STATUS_NOT_APPROVED",
      `${MANIFEST_FILENAME}: status debe ser “approved”; recibió “${String(manifest.status)}”.`,
      { field: "status", expected: "approved", actual: manifest.status ?? null },
    );
  }

  requireManifestField(report, manifest, "styleAnchor.prompt", isNonEmptyString, "un texto no vacío");
  requireContractValue(report, manifest, "styleAnchor.midjourneyVersion", "8.1");
  requireManifestField(report, manifest, "styleAnchor.sourceUrl", isHttpsUrl, "una URL HTTPS");
  requireManifestField(
    report,
    manifest,
    "styleAnchor.originalFilename",
    isSafeFilename,
    "un nombre de archivo seguro",
  );
  requireManifestField(
    report,
    manifest,
    "styleAnchor.seed",
    (value) => Number.isSafeInteger(value) && value > 0,
    "un entero positivo",
  );
  requireManifestField(
    report,
    manifest,
    "styleAnchor.reviewDecision",
    (value) => new Set(["A", "B", "C", "D"]).has(value),
    "una variante A–D",
  );
  requireManifestField(
    report,
    manifest,
    "styleAnchor.approvedBy",
    isNonEmptyString,
    "el nombre del aprobador",
  );
  requireManifestField(
    report,
    manifest,
    "styleAnchor.approvedAt",
    isRfc3339,
    "una fecha RFC 3339",
  );

  const posterContracts = [
    ["desktopPoster", POSTERS[0]],
    ["mobilePoster", POSTERS[1]],
  ];
  for (const [key, definition] of posterContracts) {
    const prefix = `delivery.${key}`;
    requireContractValue(report, manifest, `${prefix}.required`, true);
    requireContractValue(report, manifest, `${prefix}.filename`, definition.filename);
    requireContractValue(report, manifest, `${prefix}.width`, definition.expectedWidth);
    requireContractValue(report, manifest, `${prefix}.height`, definition.expectedHeight);
    requireContractValue(report, manifest, `${prefix}.maxBytes`, definition.sizeLimit);
    requireManifestField(report, manifest, `${prefix}.sourceUrl`, isHttpsUrl, "una URL HTTPS");
  }

  const videoContracts = [
    ["webm", VIDEOS[0], "vp9-or-av1"],
    ["mp4", VIDEOS[1], "h264"],
  ];
  for (const [key, definition, codec] of videoContracts) {
    const prefix = `delivery.${key}`;
    requireContractValue(report, manifest, `${prefix}.required`, false);
    requireContractValue(report, manifest, `${prefix}.filename`, definition.filename);
    requireContractValue(report, manifest, `${prefix}.minWidth`, MINIMUM_VIDEO_WIDTH);
    requireContractValue(report, manifest, `${prefix}.minHeight`, MINIMUM_VIDEO_HEIGHT);
    requireContractValue(report, manifest, `${prefix}.durationSeconds`, 5);
    requireContractValue(report, manifest, `${prefix}.codec`, codec);
    requireContractValue(report, manifest, `${prefix}.audio`, false);
  }
  requireContractValue(report, manifest, "delivery.combinedVideoMaxBytes", VIDEO_SIZE_LIMIT);

  const assetsByName = new Map(report.assets.map((asset) => [asset.filename, asset]));
  validateAssetHash(
    report,
    manifest,
    assetsByName,
    "delivery.desktopPoster.sha256",
    POSTERS[0].filename,
    true,
  );
  validateAssetHash(
    report,
    manifest,
    assetsByName,
    "delivery.mobilePoster.sha256",
    POSTERS[1].filename,
    true,
  );
  validateAssetHash(
    report,
    manifest,
    assetsByName,
    "delivery.webm.sha256",
    VIDEOS[0].filename,
    false,
  );
  validateAssetHash(
    report,
    manifest,
    assetsByName,
    "delivery.mp4.sha256",
    VIDEOS[1].filename,
    false,
  );

  const videoComplete = report.videoDelivery === "complete";
  const videoOmitted = report.videoDelivery === "omitted";
  if (!videoComplete && !videoOmitted) {
    addManifestError(
      report,
      "MANIFEST_VIDEO_STATE_MISMATCH",
      `${MANIFEST_FILENAME}: el video debe omitirse por completo o entregarse como par WebM/MP4.`,
    );
  }

  for (const field of [
    "visualReview.allCriteriaApproved",
    "visualReview.noTextOrLogos",
    "visualReview.noFakeInterface",
    "visualReview.noAiCliches",
    "visualReview.safeHtmlArea",
    "visualReview.mobileCompositionApproved",
  ]) {
    if (valueAt(manifest, field) !== true) {
      addManifestError(
        report,
        "MANIFEST_REVIEW_INCOMPLETE",
        `${MANIFEST_FILENAME}: ${field} debe estar aprobado.`,
        { field, expected: true, actual: valueAt(manifest, field) ?? null },
      );
    }
  }
  requireManifestField(
    report,
    manifest,
    "visualReview.approvedBy",
    isNonEmptyString,
    "el nombre del aprobador",
  );
  requireManifestField(
    report,
    manifest,
    "visualReview.approvedAt",
    isRfc3339,
    "una fecha RFC 3339",
  );

  const finalFrameApproved = valueAt(manifest, "visualReview.finalFrameApproved");
  if (finalFrameApproved !== videoComplete) {
    addManifestError(
      report,
      "MANIFEST_VIDEO_STATE_MISMATCH",
      `${MANIFEST_FILENAME}: visualReview.finalFrameApproved debe ser ${videoComplete}.`,
      {
        field: "visualReview.finalFrameApproved",
        expected: videoComplete,
        actual: finalFrameApproved ?? null,
      },
    );
  }

  const styleDecision = validateDecisionFile(
    report,
    manifest,
    directory,
    "visualReview.decisions.styleAnchor",
    "style",
    {
      variant: valueAt(manifest, "styleAnchor.reviewDecision"),
      filename: valueAt(manifest, "styleAnchor.originalFilename"),
    },
  );
  const desktopDecision = validateDecisionFile(
    report,
    manifest,
    directory,
    "visualReview.decisions.desktopPoster",
    "desktop",
    {
      filename: POSTERS[0].filename,
      sha256: valueAt(manifest, "delivery.desktopPoster.sha256"),
    },
  );
  const mobileDecision = validateDecisionFile(
    report,
    manifest,
    directory,
    "visualReview.decisions.mobilePoster",
    "mobile",
    {
      filename: POSTERS[1].filename,
      sha256: valueAt(manifest, "delivery.mobilePoster.sha256"),
    },
  );
  const decisions = [styleDecision, desktopDecision, mobileDecision].filter(Boolean);

  const videoField = "visualReview.decisions.midjourneyVideo";
  if (videoComplete) {
    const videoDecision = validateDecisionFile(
      report,
      manifest,
      directory,
      videoField,
      "midjourney-video",
    );
    if (videoDecision) decisions.push(videoDecision);
  } else if (valueAt(manifest, videoField) !== null) {
    addManifestError(
      report,
      "MANIFEST_VIDEO_STATE_MISMATCH",
      `${MANIFEST_FILENAME}: ${videoField} debe ser null cuando no se entrega video.`,
      { field: videoField, expected: null, actual: valueAt(manifest, videoField) ?? null },
    );
  }

  report.manifest.decisions = decisions;
}

function inspectDirectory(directory, ffprobe, manifest) {
  const report = {
    ok: false,
    directory,
    ffprobe,
    limits: {
      posterDesktopBytes: POSTERS[0].sizeLimit,
      posterMobileBytes: POSTERS[1].sizeLimit,
      combinedVideoBytes: VIDEO_SIZE_LIMIT,
      videoDurationSeconds: { minimum: MINIMUM_DURATION, maximum: MAXIMUM_DURATION },
    },
    videoDelivery: "omitted",
    assets: [],
    errors: [],
  };

  const directoryEntries = readdirSync(directory);
  const unexpectedHeroAssets = directoryEntries.filter(
    (filename) => filename.startsWith("hero-factory-") && !EXPECTED_FILENAMES.has(filename),
  );
  for (const filename of unexpectedHeroAssets) {
    addError(
      report,
      "UNEXPECTED_FILENAME",
      `${filename} no es un nombre de entrega aprobado para el HERO.`,
      filename,
    );
  }

  const posterAssets = POSTERS.map((definition) =>
    inspectFile(report, ffprobe, directory, definition, "poster"),
  );
  for (const asset of posterAssets) {
    if (!asset.present) {
      addError(
        report,
        "POSTER_MISSING",
        `Falta el poster obligatorio ${asset.filename}.`,
        asset.filename,
      );
    }
  }

  const videoPresence = VIDEOS.map(({ filename }) => directoryEntries.includes(filename));
  if (videoPresence.some(Boolean)) {
    report.videoDelivery = videoPresence.every(Boolean) ? "complete" : "incomplete";
    if (!videoPresence.every(Boolean)) {
      const missing = VIDEOS.filter((_, index) => !videoPresence[index]).map(({ filename }) => filename);
      addError(
        report,
        "VIDEO_PAIR_INCOMPLETE",
        `La entrega de video es opcional, pero debe incluir el par WebM/MP4. Falta: ${missing.join(", ")}.`,
      );
    }

    const videoAssets = VIDEOS.map((definition) =>
      inspectFile(report, ffprobe, directory, definition, "video"),
    );
    if (videoPresence.every(Boolean)) {
      const combinedBytes = videoAssets.reduce(
        (total, asset) => total + (asset.present ? asset.sizeBytes ?? 0 : 0),
        0,
      );
      report.combinedVideoBytes = combinedBytes;
      if (combinedBytes > VIDEO_SIZE_LIMIT) {
        addError(
          report,
          "VIDEO_COMBINED_SIZE",
          `Los videos pesan ${formatKilobytes(combinedBytes)} combinados; el máximo es ${formatKilobytes(VIDEO_SIZE_LIMIT)}.`,
        );
      }
    }
  }

  validateManifest(report, manifest, directory);
  report.ok = report.errors.length === 0;
  return report;
}

function renderHuman(report) {
  const lines = [
    "Inspector local de medios del HERO INPLUX",
    `Directorio: ${report.directory}`,
    `ffprobe: ${report.ffprobe.version}`,
    `Manifest: ${report.manifest?.status ?? "no aprobado"} · ${report.manifest?.decisions?.length ?? 0} decisión(es) verificadas`,
    "",
  ];

  for (const asset of report.assets) {
    if (!asset.present) {
      lines.push(`✗ ${asset.filename}: no encontrado`);
      continue;
    }
    if (!asset.width || !asset.height) {
      lines.push(`✗ ${asset.filename}: no se pudo leer`);
      continue;
    }

    const errors = report.errors.filter((error) => error.asset === asset.filename);
    const details = [
      `${asset.width}×${asset.height}`,
      asset.codec ? asset.codec.toUpperCase() : "codec desconocido",
      formatKilobytes(asset.sizeBytes),
    ];
    if (asset.kind === "video" && asset.durationSeconds !== null) {
      details.splice(2, 0, `${asset.durationSeconds.toFixed(3)} s`);
    }
    lines.push(`${errors.length === 0 ? "✓" : "✗"} ${asset.filename}: ${details.join(" · ")}`);
  }

  if (report.videoDelivery === "omitted") {
    lines.push("– Videos opcionales: omitidos (entrega válida)");
  }

  if (report.errors.length > 0) {
    lines.push("", "Problemas:");
    report.errors.forEach((error) => lines.push(`- ${error.message}`));
  }

  lines.push(
    "",
    report.ok
      ? "Resultado: APROBADO"
      : `Resultado: NO APROBADO (${report.errors.length} problema${report.errors.length === 1 ? "" : "s"})`,
  );
  process.stdout.write(`${lines.join("\n")}\n`);
}

const { help, json, positional, unknownOptions } = parseArguments(process.argv.slice(2));

if (help) {
  process.stdout.write(`${usage()}\n`);
  process.exit(0);
}
if (unknownOptions.length > 0) {
  renderFatal({
    json,
    code: "UNKNOWN_OPTION",
    message: `Opción desconocida: ${unknownOptions.join(", ")}.`,
  });
}
if (positional.length !== 1) {
  renderFatal({
    json,
    code: "DIRECTORY_ARGUMENT",
    message: "Debes indicar exactamente un directorio de activos.",
  });
}

const directory = path.resolve(positional[0]);
let directoryStats;
try {
  directoryStats = statSync(directory);
} catch (error) {
  renderFatal({
    json,
    code: "DIRECTORY_UNAVAILABLE",
    message: `No se pudo abrir el directorio ${directory}.`,
    details: error.message,
  });
}
if (!directoryStats.isDirectory()) {
  renderFatal({
    json,
    code: "DIRECTORY_REQUIRED",
    message: `${directory} no es un directorio.`,
  });
}

const manifest = loadManifest(directory, json);
const ffprobe = findFfprobe(json);
let report;
try {
  report = inspectDirectory(directory, ffprobe, manifest);
} catch (error) {
  renderFatal({
    json,
    code: "INSPECTION_FAILED",
    message: "La inspección no pudo completarse.",
    details: error.message,
  });
}

if (json) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  renderHuman(report);
}
process.exit(report.ok ? 0 : 1);

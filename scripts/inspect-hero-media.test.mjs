import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  chmodSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const inspectorPath = path.join(scriptsDirectory, "inspect-hero-media.mjs");

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function approvedDecision(mode, filename, hash) {
  const criteria = { "Criterio verificable": true };
  return {
    schemaVersion: 1,
    reviewType: "inplux-hero-visual-review",
    status: "approved",
    reviewedAt: "2026-07-16T12:00:00.000Z",
    assetMode: mode,
    assetType: mode,
    winner: "A",
    variants: {
      A: {
        fileName: filename,
        fileBytes: 8,
        sha256: hash,
        metadata: {},
        technicalIssues: [],
        criteriaPassed: 1,
        criteriaTotal: 1,
        criteria,
        notes: "",
        eligible: true,
      },
    },
    decisionRule: "Aprobación de prueba",
  };
}

function writeFakeFfprobe(filename) {
  const source = `#!/usr/bin/env node
const args = process.argv.slice(2);
if (args.includes("-version")) {
  console.log("ffprobe fake 1.0");
  process.exit(0);
}
const file = args.at(-1).split(/[\\/]/).at(-1);
const isWebm = file.endsWith(".webm");
const isMp4 = file.endsWith(".mp4");
const dimensions = isWebm || isMp4 ? [1280, 720] : file.includes("desktop") ? [1920, 1080] : [1080, 1350];
console.log(JSON.stringify({
  streams: [{ index: 0, codec_type: "video", codec_name: isWebm ? "vp9" : isMp4 ? "h264" : "av1", width: dimensions[0], height: dimensions[1], duration: isWebm || isMp4 ? "5.000" : undefined }],
  format: { format_name: isWebm ? "webm" : isMp4 ? "mov,mp4,m4a,3gp,3g2,mj2" : "avif", duration: isWebm || isMp4 ? "5.000" : undefined, size: "8", tags: { major_brand: isMp4 ? "isom" : "avif" } }
}));
`;
  writeFileSync(filename, source);
  chmodSync(filename, 0o755);
}

function makeFixture() {
  const root = mkdtempSync(path.join(tmpdir(), "inplux-hero-inspector-"));
  const delivery = path.join(root, "delivery");
  mkdirSync(delivery);
  const fakeFfprobe = path.join(root, "fake-ffprobe.mjs");
  writeFakeFfprobe(fakeFfprobe);

  const desktopBytes = Buffer.from("desktop");
  const mobileBytes = Buffer.from("mobile");
  const desktopFilename = "hero-factory-poster-desktop.avif";
  const mobileFilename = "hero-factory-poster-mobile.avif";
  const desktopHash = sha256(desktopBytes);
  const mobileHash = sha256(mobileBytes);
  writeFileSync(path.join(delivery, desktopFilename), desktopBytes);
  writeFileSync(path.join(delivery, mobileFilename), mobileBytes);

  const decisionFiles = {
    styleAnchor: "hero-review-style.json",
    desktopPoster: "hero-review-desktop.json",
    mobilePoster: "hero-review-mobile.json",
    midjourneyVideo: null,
  };
  writeFileSync(
    path.join(delivery, decisionFiles.styleAnchor),
    JSON.stringify(approvedDecision("style", "style-anchor.png", sha256(Buffer.from("style")))),
  );
  writeFileSync(
    path.join(delivery, decisionFiles.desktopPoster),
    JSON.stringify(approvedDecision("desktop", desktopFilename, desktopHash)),
  );
  writeFileSync(
    path.join(delivery, decisionFiles.mobilePoster),
    JSON.stringify(approvedDecision("mobile", mobileFilename, mobileHash)),
  );

  const manifest = {
    schemaVersion: 1,
    project: "INPLUX · Fábrica de software",
    concept: "La fábrica visible",
    status: "approved",
    generatedAt: "2026-07-16T12:00:00.000Z",
    styleAnchor: {
      prompt: "A · Campo material — frame maestro desktop",
      midjourneyVersion: "8.1",
      sourceUrl: "https://example.com/style-anchor.png",
      originalFilename: "style-anchor.png",
      seed: 270717,
      reviewDecision: "A",
      approvedBy: "Equipo INPLUX",
      approvedAt: "2026-07-16T12:00:00.000Z",
    },
    delivery: {
      desktopPoster: {
        required: true,
        filename: desktopFilename,
        width: 1920,
        height: 1080,
        maxBytes: 220000,
        sourceUrl: "https://example.com/desktop.png",
        sha256: desktopHash,
      },
      mobilePoster: {
        required: true,
        filename: mobileFilename,
        width: 1080,
        height: 1350,
        maxBytes: 140000,
        sourceUrl: "https://example.com/mobile.png",
        sha256: mobileHash,
      },
      webm: {
        required: false,
        filename: "hero-factory-intro.webm",
        minWidth: 1280,
        minHeight: 720,
        durationSeconds: 5,
        codec: "vp9-or-av1",
        audio: false,
        sha256: null,
      },
      mp4: {
        required: false,
        filename: "hero-factory-intro.mp4",
        minWidth: 1280,
        minHeight: 720,
        durationSeconds: 5,
        codec: "h264",
        audio: false,
        sha256: null,
      },
      combinedVideoMaxBytes: 2500000,
    },
    visualReview: {
      decisions: decisionFiles,
      allCriteriaApproved: true,
      noTextOrLogos: true,
      noFakeInterface: true,
      noAiCliches: true,
      safeHtmlArea: true,
      mobileCompositionApproved: true,
      finalFrameApproved: false,
      approvedBy: "Equipo INPLUX",
      approvedAt: "2026-07-16T12:00:00.000Z",
    },
  };
  writeFileSync(path.join(delivery, "hero-media-manifest.json"), JSON.stringify(manifest));

  return { root, delivery, fakeFfprobe, manifest, desktopHash };
}

function runInspector(delivery, fakeFfprobe) {
  const result = spawnSync(process.execPath, [inspectorPath, delivery, "--json"], {
    encoding: "utf8",
    env: { ...process.env, FFPROBE_PATH: fakeFfprobe },
  });
  return {
    ...result,
    report: result.stdout.trim() ? JSON.parse(result.stdout) : null,
  };
}

function addVideoPair(fixture) {
  const webmBytes = Buffer.from("webm-video");
  const mp4Bytes = Buffer.from("mp4-video");
  const webmHash = sha256(webmBytes);
  const mp4Hash = sha256(mp4Bytes);
  writeFileSync(path.join(fixture.delivery, "hero-factory-intro.webm"), webmBytes);
  writeFileSync(path.join(fixture.delivery, "hero-factory-intro.mp4"), mp4Bytes);
  fixture.manifest.delivery.webm.sha256 = webmHash;
  fixture.manifest.delivery.mp4.sha256 = mp4Hash;
  fixture.manifest.visualReview.decisions.midjourneyVideo =
    "hero-review-midjourney-video.json";
  fixture.manifest.visualReview.finalFrameApproved = true;
  writeFileSync(
    path.join(fixture.delivery, fixture.manifest.visualReview.decisions.midjourneyVideo),
    JSON.stringify(
      approvedDecision(
        "midjourney-video",
        "midjourney-video-master.mp4",
        sha256(Buffer.from("midjourney-video")),
      ),
    ),
  );
  writeFileSync(
    path.join(fixture.delivery, "hero-media-manifest.json"),
    JSON.stringify(fixture.manifest),
  );
}

test("aprueba una entrega poster-only con manifest, decisiones y hashes válidos", () => {
  const fixture = makeFixture();
  try {
    const result = runInspector(fixture.delivery, fixture.fakeFfprobe);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(result.report.ok, true);
    assert.equal(result.report.manifest.status, "approved");
    assert.equal(result.report.manifest.decisions.length, 3);
    assert.equal(result.report.videoDelivery, "omitted");
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("rechaza un directorio sin manifest antes de invocar ffprobe", () => {
  const root = mkdtempSync(path.join(tmpdir(), "inplux-hero-no-manifest-"));
  try {
    const result = runInspector(root, path.join(root, "no-existe"));
    assert.equal(result.status, 1);
    assert.equal(result.report.errors[0].code, "MANIFEST_MISSING");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rechaza un hash aprobado que no coincide con el poster", () => {
  const fixture = makeFixture();
  try {
    fixture.manifest.delivery.desktopPoster.sha256 = "0".repeat(64);
    writeFileSync(
      path.join(fixture.delivery, "hero-media-manifest.json"),
      JSON.stringify(fixture.manifest),
    );
    const result = runInspector(fixture.delivery, fixture.fakeFfprobe);
    assert.equal(result.status, 1);
    assert.ok(result.report.errors.some((error) => error.code === "ASSET_SHA256_MISMATCH"));
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("rechaza un manifest draft y una decisión visual incompleta", () => {
  const fixture = makeFixture();
  try {
    fixture.manifest.status = "draft";
    const decisionPath = path.join(
      fixture.delivery,
      fixture.manifest.visualReview.decisions.desktopPoster,
    );
    const decision = JSON.parse(readFileSync(decisionPath, "utf8"));
    decision.status = "draft";
    decision.variants.A.eligible = false;
    writeFileSync(decisionPath, JSON.stringify(decision));
    writeFileSync(
      path.join(fixture.delivery, "hero-media-manifest.json"),
      JSON.stringify(fixture.manifest),
    );
    const result = runInspector(fixture.delivery, fixture.fakeFfprobe);
    assert.equal(result.status, 1);
    const codes = new Set(result.report.errors.map((error) => error.code));
    assert.ok(codes.has("MANIFEST_STATUS_NOT_APPROVED"));
    assert.ok(codes.has("MANIFEST_DECISION_INVALID"));
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("aprueba el par opcional WebM/MP4 con decisión final y hashes coincidentes", () => {
  const fixture = makeFixture();
  try {
    addVideoPair(fixture);
    const result = runInspector(fixture.delivery, fixture.fakeFfprobe);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(result.report.ok, true);
    assert.equal(result.report.videoDelivery, "complete");
    assert.equal(result.report.manifest.decisions.length, 4);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

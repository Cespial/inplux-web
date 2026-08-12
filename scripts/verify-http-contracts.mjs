import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import process from "node:process";

const host = "127.0.0.1";
const root = process.cwd();
const startupTimeoutMs = 30_000;
const pollIntervalMs = 250;

const expectedRoutes = [
  ["/", 200],
  ["/en", 200],
  ["/trabajo/tribai", 200],
  ["/trabajo/gobia", 200],
  ["/trabajo/kelsen", 200],
  ["/trabajo/laudos", 200],
  ["/trabajo/slug-inexistente", 404],
  ["/ruta-inexistente", 404],
];

const expectedSocialImages = [
  "/api/og/trabajo/directorio?v=2026-08-11",
  "/api/og/trabajo/tribai?v=2026-08-11",
  "/api/og/trabajo/gobia?v=2026-08-11",
  "/api/og/trabajo/kelsen?v=2026-08-11",
  "/api/og/trabajo/laudos?v=2026-08-11",
];

function readPngDimensions(buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a" || buffer.length < 24) return null;

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.unref();
    probe.once("error", reject);
    probe.listen(0, host, () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        probe.close();
        reject(new Error("No fue posible reservar un puerto local."));
        return;
      }
      probe.close(() => resolve(address.port));
    });
  });
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForServer(baseUrl, child, readLogs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < startupTimeoutMs) {
    if (child.exitCode !== null) {
      throw new Error(
        `El servidor terminó antes de iniciar (código ${child.exitCode}).\n${readLogs()}`,
      );
    }

    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {
      // El puerto todavía no está listo.
    }

    await wait(pollIntervalMs);
  }

  throw new Error(`El servidor no respondió en ${startupTimeoutMs / 1000}s.\n${readLogs()}`);
}

async function stopServer(child) {
  if (child.exitCode !== null) return;

  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    wait(3_000).then(() => {
      if (child.exitCode === null) child.kill("SIGKILL");
    }),
  ]);
}

const port = await getAvailablePort();
const baseUrl = `http://${host}:${port}`;
const nextBinary = path.join(root, "node_modules", "next", "dist", "bin", "next");
let serverLogs = "";

const server = spawn(
  process.execPath,
  [nextBinary, "start", "--hostname", host, "--port", String(port)],
  {
    cwd: root,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
      NODE_ENV: "production",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

for (const stream of [server.stdout, server.stderr]) {
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    serverLogs = `${serverLogs}${chunk}`.slice(-8_000);
  });
}

try {
  await waitForServer(baseUrl, server, () => serverLogs);

  const failures = [];
  for (const [route, expectedStatus] of expectedRoutes) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    if (response.status !== expectedStatus) {
      failures.push(`${route}: esperaba ${expectedStatus}, recibió ${response.status}`);
    }
  }

  for (const route of expectedSocialImages) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    if (response.status !== 200) {
      failures.push(`${route}: esperaba 200, recibió ${response.status}`);
      continue;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/png")) {
      failures.push(`${route}: esperaba image/png, recibió ${contentType || "sin content-type"}`);
      continue;
    }

    const dimensions = readPngDimensions(
      Buffer.from(await response.arrayBuffer()),
    );
    if (dimensions?.width !== 1200 || dimensions.height !== 630) {
      failures.push(
        `${route}: esperaba PNG 1200x630, recibió ${dimensions ? `${dimensions.width}x${dimensions.height}` : "un archivo inválido"}`,
      );
    }
  }

  const unknownSocialImage = await fetch(
    `${baseUrl}/api/og/trabajo/perfil-inexistente?v=2026-07-21`,
    { redirect: "manual" },
  );
  if (unknownSocialImage.status !== 404) {
    failures.push(
      `/api/og/trabajo/perfil-inexistente: esperaba 404, recibió ${unknownSocialImage.status}`,
    );
  }

  if (failures.length > 0) {
    throw new Error(`Contratos HTTP inválidos:\n- ${failures.join("\n- ")}`);
  }

  console.log(
    `HTTP contracts verified: ${expectedRoutes.length} routes and ${expectedSocialImages.length} social PNGs, including 404 boundaries.`,
  );
} finally {
  await stopServer(server);
}

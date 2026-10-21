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
  ["/como-trabajamos", 200],
  // Las rutas que se fundieron en /como-trabajamos redirigen de forma permanente.
  ["/fabrica", 308],
  ["/capacidades", 308],
  ["/sectores/salud", 200],
  ["/sectores/publico", 200],
  ["/sectores/legal-tributario", 200],
  ["/sectores/empresas", 200],
  ["/equipo", 200],
  ["/equipo/cristian-espinal-maya", 200],
  ["/nosotros", 200],
  ["/prensa", 200],
  ["/prensa/seagricolas-sudafrica", 200],
  ["/contacto", 200],
  ["/seguridad", 200],
  ["/sectores/sector-inexistente", 404],
  ["/trabajo/tribai", 200],
  ["/trabajo/gobia", 200],
  ["/trabajo/kelsen", 200],
  ["/trabajo/laudos", 200],
  ["/trabajo/porkia", 200],
  ["/deck", 200],
  ["/deck/presentacion", 200],
  // El deck dirigido a legaltech. No está en el sitemap —no es una página
  // pública— pero se manda por enlace, así que tiene que contestar 200: una
  // ruta que solo existe en un enlace es justo la que nadie prueba hasta que
  // alguien la abre delante de la sala.
  ["/deck/legaltech", 200],
  ["/deck/legaltech/presentacion", 200],
  ["/trabajo/slug-inexistente", 404],
  ["/ruta-inexistente", 404],
  // El sitio en inglés (PR M): doce rutas con par en español.
  ["/en/how-we-work", 200],
  ["/en/work", 200],
  ["/en/work/tribai", 200],
  ["/en/work/gobia", 200],
  ["/en/work/kelsen", 200],
  ["/en/work/laudos", 200],
  ["/en/work/porkia", 200],
  ["/en/sectors/public-sector", 200],
  ["/en/sectors/health", 200],
  ["/en/sectors/legal-tax", 200],
  ["/en/sectors/business", 200],
  ["/en/about", 200],
  ["/en/security", 200],
  ["/en/contact", 200],
  ["/en/work/slug-inexistente", 404],
  // Los slugs españoles no existen bajo /en.
  ["/en/sectors/salud", 404],
  // Lo que sigue solo en español no tiene ruta inglesa.
  ["/en/team", 404],
];

const expectedSocialImages = [
  "/api/og/trabajo/directorio?v=2026-10-20.2",
  "/api/og/trabajo/tribai?v=2026-10-20.2",
  "/api/og/trabajo/gobia?v=2026-10-20.2",
  "/api/og/trabajo/kelsen?v=2026-10-20.2",
  "/api/og/trabajo/laudos?v=2026-10-20.2",
  "/api/og/trabajo/porkia?v=2026-10-20.2",
  "/api/og/trabajo/directorio?lang=en&v=2026-10-20.2",
  "/api/og/trabajo/tribai?lang=en&v=2026-10-20.2",
  "/api/og/trabajo/gobia?lang=en&v=2026-10-20.2",
  "/api/og/trabajo/kelsen?lang=en&v=2026-10-20.2",
  "/api/og/trabajo/laudos?lang=en&v=2026-10-20.2",
  "/api/og/trabajo/porkia?lang=en&v=2026-10-20.2",
];

// Caché por carpeta (`next.config.ts`): lo que se versiona por nombre es
// inmutable; la marca, que se repinta con el mismo nombre, no.
const expectedCacheControl = [
  ["/media/hero-480.mp4", "public, max-age=31536000, immutable"],
  ["/media/hero-poster-828.avif", "public, max-age=31536000, immutable"],
  ["/sectores/sector-salud.webp", "public, max-age=31536000, immutable"],
  ["/brand/og/og-sector-salud.jpg", "public, max-age=86400, stale-while-revalidate=604800"],
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
      continue;
    }
    // El idioma del documento sale del servidor, no de la hidratación.
    if (expectedStatus === 200 && !route.startsWith("/deck")) {
      const html = await response.text();
      const lang = route === "/en" || route.startsWith("/en/") ? "en" : "es-CO";
      if (!html.includes(`<html lang="${lang}"`)) {
        failures.push(`${route}: esperaba <html lang="${lang}">`);
      }
    }
  }

  // La tarjeta inglesa de un producto no es la española con otro nombre.
  const [spanishCard, englishCard] = await Promise.all(
    ["/api/og/trabajo/tribai?v=2026-10-20.2", "/api/og/trabajo/tribai?lang=en&v=2026-10-20.2"].map(
      async (route) => Buffer.from(await (await fetch(`${baseUrl}${route}`)).arrayBuffer()),
    ),
  );
  if (spanishCard.equals(englishCard)) {
    failures.push("/api/og/trabajo/tribai?lang=en: pinta la misma tarjeta que la española");
  }

  for (const [route, expectedHeader] of expectedCacheControl) {
    const response = await fetch(`${baseUrl}${route}`, { method: "HEAD", redirect: "manual" });
    const header = response.headers.get("cache-control");
    if (response.status !== 200 || header !== expectedHeader) {
      failures.push(`${route}: esperaba 200 con «${expectedHeader}», recibió ${response.status} con «${header}»`);
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

  // Formulario de contacto (PR O). Un POST no se rastrea; lo que se fija aquí
  // es lo que no depende de tener la clave de Resend: GET no existe, el
  // endpoint no entra al sitemap, un Content-Type ajeno se rechaza y la
  // trampa responde ok sin enviar (va antes de cualquier otra comprobación).
  const contactGet = await fetch(`${baseUrl}/api/contacto`, { redirect: "manual" });
  if (contactGet.status !== 405) {
    failures.push(`GET /api/contacto: esperaba 405, recibió ${contactGet.status}`);
  }
  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  if (sitemap.includes("/api/")) {
    failures.push("sitemap.xml no debe listar rutas /api/ (encontró /api/contacto u otra)");
  }
  const contactText = await fetch(`${baseUrl}/api/contacto`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: "hola",
  });
  if (contactText.status !== 415) {
    failures.push(`POST /api/contacto text/plain: esperaba 415, recibió ${contactText.status}`);
  }
  const contactTrap = await fetch(`${baseUrl}/api/contacto`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "192.0.2.250" },
    body: JSON.stringify({ hp_ref_x7: "http://spam.example" }),
  });
  const trapBody = await contactTrap.json().catch(() => null);
  if (contactTrap.status !== 200 || trapBody?.ok !== true) {
    failures.push(
      `POST /api/contacto con trampa: esperaba 200 {ok:true}, recibió ${contactTrap.status} ${JSON.stringify(trapBody)}`,
    );
  }

  if (failures.length > 0) {
    throw new Error(`Contratos HTTP inválidos:\n- ${failures.join("\n- ")}`);
  }

  console.log(
    `HTTP contracts verified: ${expectedRoutes.length} routes, ${expectedSocialImages.length} social PNGs, ${expectedCacheControl.length} cache headers and the contact endpoint, including 404 boundaries.`,
  );
} finally {
  await stopServer(server);
}

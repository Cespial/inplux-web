/**
 * Tarjetas sociales (1200 × 630) de las páginas con imagen propia: la portada
 * (en español y en inglés) y `/nosotros`, con la plantilla «foto» —foto a
 * sangre, velo de izquierda a derecha, logo arriba y el H1 de la página—; los cuatro
 * sectores, `/como-trabajamos`, `/prensa`, `/contacto`, `/seguridad`, `/marca`
 * y cada perfil de `/equipo`. Se pintan una vez con Chromium —la foto o el
 * póster del hero a sangre (o el retrato a la derecha, en los perfiles; o solo
 * el fondo de marca, donde la página no tiene foto), Rethink Sans y la marca—
 * y se guardan como JPEG en `public/brand/og/`. No hay ruta dinámica: la tarjeta cambia cuando cambia la
 * página, y entonces se vuelve a correr esto.
 *
 *   node scripts/og-cards.mjs
 *
 * El texto sale de aquí y no de `sectores.ts` ni de `team.ts` para no
 * importar TypeScript desde un script; si cambia el nombre o el lead de un
 * sector, o el nombre o el cargo de una persona, se cambia en los dos sitios.
 */
import { chromium } from "playwright";
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const types = {
  ".ttf": "font/ttf",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

/* Todo va en línea como data URI: una página de `setContent` vive en
   about:blank y Chromium no le deja leer `file://`. */
async function asset(relative) {
  const data = await readFile(path.join(root, relative));
  return `data:${types[path.extname(relative)]};base64,${data.toString("base64")}`;
}

const fonts = {
  regular: await asset("src/app/fonts/RethinkSans-Regular.ttf"),
  medium: await asset("src/app/fonts/RethinkSans-Medium.ttf"),
};

const logo = await asset("public/brand/logos/inplux-logo-horizontal-mono-white.svg");

const cards = [
  /* Plantilla «foto» (20-oct-2026, PR N): la que ve quien pega inplux.co en
     WhatsApp, LinkedIn o X. Nombres nuevos a propósito: las redes guardan la
     tarjeta por URL y con el nombre viejo seguirían sirviendo la v3. */
  {
    file: "og-home.jpg",
    layout: "foto",
    image: "public/brand/og/fuentes/equipo-medellin.webp",
    title: "Transformación con IA que llega a producción.",
    lead: "Productos propios y equipos que los implementan, desde Medellín para Latinoamérica.",
    focus: "center",
  },
  {
    file: "og-home-en.jpg",
    layout: "foto",
    image: "public/brand/og/fuentes/equipo-medellin.webp",
    title: "AI transformation that reaches production.",
    lead: "Our own products and the teams that implement them, from Medellín for Latin America.",
    focus: "center",
  },
  {
    file: "og-nosotros.jpg",
    layout: "foto",
    image: "public/media/nosotros-poster-1920.webp",
    title: "Construimos con criterio, desde Medellín.",
    lead: "INPLUX desarrolla e implementa la transformación con IA de empresas e instituciones en Latinoamérica.",
    focus: "center",
  },
  {
    file: "og-sector-publico.jpg",
    image: "public/sectores/sector-publico.webp",
    eyebrow: "SECTOR",
    title: "Sector público",
    lead: "IA para hacienda municipal, contratación y seguimiento de la gestión.",
    focus: "60% center",
  },
  {
    file: "og-sector-salud.jpg",
    image: "public/sectores/sector-salud.webp",
    eyebrow: "SECTOR",
    title: "Salud",
    lead: "IA para pacientes, telemonitoreo e historia clínica.",
    focus: "60% center",
  },
  {
    file: "og-sector-legal-tributario.jpg",
    image: "public/sectores/sector-legal-tributario.webp",
    eyebrow: "SECTOR",
    title: "Legal y tributario",
    lead: "IA para consulta normativa, vigencia y jurisprudencia.",
    focus: "60% center",
  },
  {
    file: "og-sector-empresas.jpg",
    image: "public/sectores/sector-empresas.webp",
    eyebrow: "SECTOR",
    title: "Empresas",
    lead: "IA para operación, datos y productos digitales.",
    focus: "60% center",
  },
  {
    file: "og-como-trabajamos.jpg",
    image: "public/media/como-poster.jpg",
    eyebrow: "CÓMO TRABAJAMOS",
    title: "Del diagnóstico a la operación",
    lead: "Cuatro fases con entregable, sobre los sistemas que ya operas.",
    focus: "center",
  },
  {
    file: "og-prensa.jpg",
    image: "public/brand/press/panel-11.jpg",
    eyebrow: "PRENSA",
    title: "Prensa y conversaciones",
    lead: "Cobertura, escenarios y columnas, cada pieza con su fuente.",
    focus: "70% center",
  },
  {
    file: "og-contacto.jpg",
    image: "public/media/nosotros-poster-1920.webp",
    eyebrow: "CONTACTO",
    title: "Empecemos por el problema",
    lead: "No necesitas llegar con requisitos ni alcance definidos.",
    focus: "center",
  },
  {
    file: "og-seguridad.jpg",
    image: null,
    eyebrow: "SEGURIDAD",
    title: "Cómo cuidamos los datos",
    lead: "Cifrado, acceso por rol y datos separados por cliente.",
  },
  {
    file: "og-marca.jpg",
    image: null,
    eyebrow: "SISTEMA DE MARCA",
    title: "Una marca, los archivos maestros",
    lead: "Logo, color y tipografía de INPLUX.",
  },
  {
    file: "og-equipo-jaime-alonso-cano-pino.jpg",
    image: "public/brand/team/jaime-alonso-cano-pino.jpg",
    portrait: true,
    eyebrow: "EQUIPO · CEO Y FUNDADOR",
    title: "Jaime Alonso Cano Pino",
    lead: "Estrategia, criterio tributario, financiero e institucional.",
    focus: "center 30%",
  },
  {
    file: "og-equipo-cristian-espinal-maya.jpg",
    image: "public/brand/team/cristian-espinal-maya.jpg",
    portrait: true,
    eyebrow: "EQUIPO · CTO",
    title: "Cristian Espinal Maya",
    lead: "Producto, arquitectura tecnológica e inteligencia artificial.",
    focus: "center 30%",
  },
];

const html = (card, image) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: "Rethink Sans"; font-weight: 400; src: url("${fonts.regular}"); }
@font-face { font-family: "Rethink Sans"; font-weight: 500; src: url("${fonts.medium}"); }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; background: #0c0c0b; color: #f6f2ec; font-family: "Rethink Sans", sans-serif; }
.card { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 54px 64px 52px; }
.card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${card.focus}; z-index: 0; }
.card.plain { background: radial-gradient(70% 90% at 88% 110%, rgba(0,215,202,0.26), transparent 62%), radial-gradient(40% 50% at 100% 0%, rgba(0,215,202,0.08), transparent 70%), #0c0c0b; }
.card.plain::before { display: none; }
.card.portrait { padding-right: 520px; }
.card.portrait img { left: auto; width: 460px; }
.card.portrait::before { background: linear-gradient(90deg, #0c0c0b 0, #0c0c0b 740px, rgba(12,12,11,0) 860px); }
.card.portrait h1 { font-size: 84px; }
.card::before { content: ""; position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(90deg, rgba(12,12,11,0.92), rgba(12,12,11,0.7) 50%, rgba(12,12,11,0.2)),
              linear-gradient(180deg, rgba(12,12,11,0.45), transparent 32%, rgba(12,12,11,0.7)); }
.card > :not(img) { position: relative; z-index: 2; }
.brand { display: flex; align-items: center; gap: 14px; font-size: 26px; font-weight: 500; letter-spacing: -0.02em; }
.brand i { width: 12px; height: 12px; border-radius: 99px; background: #00d7ca; }
.eyebrow { color: #00d7ca; font-size: 17px; font-weight: 500; letter-spacing: 0.15em; margin-bottom: 20px; }
h1 { max-width: 760px; font-size: 104px; font-weight: 400; line-height: 0.96; letter-spacing: -0.035em; text-wrap: balance; }
p { max-width: 640px; margin-top: 26px; color: rgba(246,242,236,0.82); font-size: 28px; line-height: 1.28; }
.foot { color: rgba(246,242,236,0.6); font-size: 15px; font-weight: 500; letter-spacing: 0.12em; }
</style></head><body><div class="card${image ? "" : " plain"}${card.portrait ? " portrait" : ""}">
${image ? `<img src="${image}" alt="">` : ""}
<div class="brand"><i></i>INPLUX</div>
<div><div class="eyebrow">${card.eyebrow}</div><h1>${card.title}</h1><p>${card.lead}</p></div>
<div class="foot">INPLUX.CO</div>
</div></body></html>`;

/* La plantilla «foto», fiel al mockup aprobado por Cristian el 20-oct-2026:
   velo de 0,88 a 0,62 (42 %) a 0,08 (75 %) más un velo inferior, márgenes de
   64 px, logo de 34 px, título de 66 px a 13ch y `inplux.co` al pie. */
const photoHtml = (card, image) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: "Rethink Sans"; font-weight: 400; src: url("${fonts.regular}"); }
@font-face { font-family: "Rethink Sans"; font-weight: 500; src: url("${fonts.medium}"); }
* { margin: 0; box-sizing: border-box; }
body { position: relative; width: 1200px; height: 630px; overflow: hidden; background: #0c0c0b; color: #f6f2ec; font-family: "Rethink Sans", sans-serif; }
.photo { position: absolute; inset: 0; background: url("${image}") ${card.focus} / cover no-repeat; }
.veil { position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(12,12,11,0.88) 0%, rgba(12,12,11,0.62) 42%, rgba(12,12,11,0.08) 75%),
              linear-gradient(0deg, rgba(12,12,11,0.55), transparent 45%); }
.content { position: absolute; inset: 64px; display: flex; flex-direction: column; justify-content: space-between; }
.content img { height: 34px; width: auto; align-self: flex-start; }
h1 { max-width: 13ch; font-size: 66px; font-weight: 400; line-height: 1.02; letter-spacing: -0.02em; }
p { max-width: 30ch; margin-top: 22px; color: rgba(246,242,236,0.82); font-size: 23px; line-height: 1.35; }
small { color: rgba(246,242,236,0.7); font-size: 15px; letter-spacing: 0.14em; text-transform: uppercase; }
</style></head><body>
<div class="photo"></div><div class="veil"></div>
<div class="content"><img src="${logo}" alt=""><div><h1>${card.title}</h1><p>${card.lead}</p></div><small>inplux.co</small></div>
</body></html>`;

const outDir = path.join(root, "public/brand/og");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const card of cards) {
  const image = card.image ? await asset(card.image) : null;
  await page.setContent(card.layout === "foto" ? photoHtml(card, image) : html(card, image), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(outDir, card.file), type: "jpeg", quality: 86 });
  console.log(`✓ ${card.file}`);
}
await browser.close();

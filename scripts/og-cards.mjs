/**
 * Tarjetas sociales (1200 × 630) de las páginas con imagen propia: los cuatro
 * sectores, `/como-trabajamos`, `/prensa`, `/contacto`, `/seguridad`, `/marca`,
 * cada perfil de `/equipo` y los pares ingleses (`og-en-*`, al inicio). Se pintan una vez con Chromium —la foto o el
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
const types = { ".ttf": "font/ttf", ".webp": "image/webp", ".jpg": "image/jpeg" };

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

const cards = [
  // El sitio en inglés (PR M). Mismo texto que el título y el lead de cada
  // página en `src/content/*.en.ts`; los nombres de producto no se traducen.
  {
    file: "og-en-sector-public-sector.jpg",
    image: "public/sectores/sector-publico.webp",
    eyebrow: "SECTOR",
    title: "Public sector",
    lead: "AI for municipal finance, procurement and performance tracking.",
    focus: "60% center",
  },
  {
    file: "og-en-sector-health.jpg",
    image: "public/sectores/sector-salud.webp",
    eyebrow: "SECTOR",
    title: "Health",
    lead: "AI for patients, remote monitoring and clinical records.",
    focus: "60% center",
  },
  {
    file: "og-en-sector-legal-tax.jpg",
    image: "public/sectores/sector-legal-tributario.webp",
    eyebrow: "SECTOR",
    title: "Legal and tax",
    lead: "AI for legal research, validity and case law.",
    focus: "60% center",
  },
  {
    file: "og-en-sector-business.jpg",
    image: "public/sectores/sector-empresas.webp",
    eyebrow: "SECTOR",
    title: "Business",
    lead: "AI for operations, data and digital products.",
    focus: "60% center",
  },
  {
    file: "og-en-how-we-work.jpg",
    image: "public/media/como-poster.jpg",
    eyebrow: "HOW WE WORK",
    title: "From diagnosis to operation",
    lead: "Four phases with a deliverable, on the systems you already run.",
    focus: "center",
  },
  {
    file: "og-en-about.jpg",
    image: "public/media/nosotros-poster-1920.webp",
    eyebrow: "ABOUT",
    title: "The judgment behind the factory",
    lead: "Track record, principles and people. Engineering in Medellín.",
    focus: "center",
  },
  {
    file: "og-en-contact.jpg",
    image: "public/media/nosotros-poster-1920.webp",
    eyebrow: "CONTACT",
    title: "Let's start with the problem",
    lead: "You don't need to arrive with requirements or a defined scope.",
    focus: "center",
  },
  {
    file: "og-en-security.jpg",
    image: null,
    eyebrow: "SECURITY",
    title: "How we look after data",
    lead: "Encryption, role-based access and data separated by client.",
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

const outDir = path.join(root, "public/brand/og");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const card of cards) {
  await page.setContent(html(card, card.image ? await asset(card.image) : null), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(outDir, card.file), type: "jpeg", quality: 86 });
  console.log(`✓ ${card.file}`);
}
await browser.close();

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CapabilitiesWorkbench } from "@/components/routes/CapabilitiesWorkbench.client";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getWorkProfile } from "@/content/work";
import { formatShortDate, verificationDateFor } from "@/content/work-format";
import styles from "./capacidades.module.css";

export const metadata: Metadata = {
  title: "Capacidades — sistemas compuestos para problemas reales",
  description:
    "Explora cómo INPLUX combina producto, operación, inteligencia artificial e integración para convertir un problema real en software en producción.",
  alternates: { canonical: "https://inplux.co/capacidades" },
  openGraph: {
    title: "Capacidades de INPLUX",
    description:
      "No partimos de un catálogo. Componemos el sistema que cada problema necesita.",
    url: "https://inplux.co/capacidades",
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/brand/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "INPLUX, de un problema real a software en producción",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capacidades de INPLUX",
    description:
      "Producto, operación, IA e integración reunidos alrededor de un cambio concreto.",
    images: [
      {
        url: "/brand/og/og-default.png",
        alt: "INPLUX, de un problema real a software en producción",
      },
    ],
  },
};

const capabilityLayers = [
  {
    id: "producto",
    number: "01",
    title: "Producto",
    trigger: "Cuando alguien necesita usar, decidir o completar algo mejor.",
    output: "Una experiencia útil y medible.",
    code: "UI / FLOW",
  },
  {
    id: "modernizacion",
    number: "02",
    title: "Operación",
    trigger: "Cuando el trabajo depende de pasos, reglas e información dispersa.",
    output: "Un flujo visible y trazable.",
    code: "STATE / RULES",
  },
  {
    id: "ia",
    number: "03",
    title: "Conocimiento e IA",
    trigger: "Cuando leer, buscar o documentar consume el criterio del equipo.",
    output: "Asistencia revisable, con fuentes.",
    code: "SOURCE / REVIEW",
  },
  {
    id: "integracion",
    number: "04",
    title: "Integración",
    trigger: "Cuando una acción cruza sistemas, datos o permisos distintos.",
    output: "Un recorrido continuo y observable.",
    code: "API / EVENT",
  },
] as const;

/**
 * Cada pieza de evidencia enmarca la captura de una página pública.
 *
 * `capturedAt` es la fecha en que se tomó esa imagen, copiada en ISO del acta
 * `public/work/real-pages/capture-manifest.json`: el conjunto dejó de tomarse
 * en una sola sesión, así que cada captura declara la suya y el pie la formatea
 * con la misma función que usa la vitrina de `/trabajo`, en vez de llevar la
 * fecha ya escrita a mano. La fecha de verificación de la fuente se deriva de
 * `work.ts` (`slug` + `productHref`), para que no quede escrita a mano en una
 * segunda ruta y se desincronice del perfil.
 *
 * `headline` y `description` describen lo que la captura muestra —la superficie
 * que respondió ese día—, no lo que el producto promete: el vocabulario sale de
 * `headline`, `description` y `capabilities` del perfil correspondiente.
 */
const evidence = [
  {
    number: "01",
    slug: "gobia",
    capturedAt: "2026-07-21",
    name: "Gobia",
    category: "Gestión pública",
    headline: "Una operación municipal reunida en un centro de mando.",
    description:
      "La demostración pública conecta lectura territorial, seguimiento e información fiscal en una sola superficie de trabajo.",
    attribution: "Solución de INPLUX · atribución pública confirmada en gobia.co",
    image: "/work/real-pages/gobia-demo-2026-07-21.png",
    imageAlt: "Demo pública de Gobia con mapa y centro de mando municipal",
    profileHref: "/trabajo/gobia",
    productHref: "https://www.gobia.co/demo",
    productLabel: "Abrir demo pública",
  },
  {
    number: "02",
    slug: "laudos",
    capturedAt: "2026-07-21",
    name: "Laudos",
    category: "Arbitraje",
    headline: "Conocimiento arbitral convertido en una herramienta explorable.",
    description:
      "La beta abierta combina búsqueda, estructura jurídica y un laboratorio de predicción sin ocultar la responsabilidad de cada aliado.",
    attribution: "Desarrollo técnico: INPLUX · criterio legal: REDEK",
    image: "/work/real-pages/laudos-prediccion-2026-07-21.png",
    imageAlt: "Laboratorio de predicción de la beta pública de Laudos",
    profileHref: "/trabajo/laudos",
    productHref: "https://laudos.co/?view=predecir",
    productLabel: "Abrir beta pública",
  },
  {
    number: "03",
    slug: "tribai",
    capturedAt: "2026-07-21",
    name: "Tribai",
    category: "Tributación",
    headline: "Una consulta tributaria que no se separa de su fuente.",
    description:
      "El asistente público abre con su caja de consulta y deja a la vista las rutas del producto: declaraciones, herramientas y estatuto en el mismo entorno.",
    attribution:
      "Desarrollo de INPLUX · la autoría la declaramos nosotros; las fuentes documentan el producto",
    image: "/work/real-pages/tribai-asistente-2026-07-21.png",
    imageAlt: "Asistente tributario público de Tribai con su caja de consulta",
    profileHref: "/trabajo/tribai",
    productHref: "https://app.tribai.co/",
    productLabel: "Abrir asistente",
  },
  {
    number: "04",
    slug: "kelsen",
    capturedAt: "2026-07-21",
    name: "Kelsen",
    category: "Derecho",
    headline: "Una biblioteca jurídica abierta, filtrable por vigencia.",
    description:
      "El explorador público reúne la búsqueda, los filtros de colección, tipo, área y vigencia, y los resultados del corpus con su ficha de origen.",
    attribution:
      "Desarrollo de INPLUX · la autoría la declaramos nosotros; las fuentes documentan el producto",
    image: "/work/real-pages/kelsen-explorador-2026-07-21.png",
    imageAlt: "Explorador público de Kelsen con filtros y resultados del corpus jurídico",
    profileHref: "/trabajo/kelsen",
    productHref: "https://kelsen.io/explorador?vigencia=modificado",
    productLabel: "Abrir explorador",
  },
  {
    number: "05",
    slug: "porkia",
    capturedAt: "2026-08-11",
    name: "Porkia",
    category: "Porcicultura",
    headline: "Las pantallas de una finca, recorribles desde el navegador.",
    description:
      "La demostración pública corre la aplicación con datos de ejemplo y deja recorrer lotes, cuido, sanidad y cuentas sin descargar nada.",
    attribution:
      "Desarrollo de INPLUX · la autoría la declaramos nosotros; las fuentes documentan el producto",
    image: "/work/real-pages/porkia-demo-2026-08-11.png",
    imageAlt: "Demostración pública de Porkia con las pantallas de la aplicación en el navegador",
    profileHref: "/trabajo/porkia",
    productHref: "https://porkia.co/#demo",
    productLabel: "Abrir demostración",
  },
] as const;

/**
 * La evidencia con su estado y su fecha de verificación resueltos contra
 * `work.ts`.
 *
 * Si un `slug` deja de existir en `work.ts` esto revienta el build. Que el
 * `productHref` sea exactamente una de las fuentes del perfil lo exige
 * `verificationDateFor`, que revienta por su cuenta: la comprobación vive en el
 * contrato y no aquí, para que ninguna otra pantalla que enmarque una URL
 * tenga que acordarse de repetirla.
 */
const evidenceItems = evidence.map((item) => {
  const profile = getWorkProfile(item.slug);

  if (!profile) {
    throw new Error(`Evidencia sin perfil en work.ts: ${item.slug}`);
  }

  return {
    ...item,
    capturedLabel: formatShortDate(item.capturedAt),
    statusLabel: profile.status.label,
    verifiedLabel: verificationDateFor(profile.sources, item.productHref),
  };
});

const audiences = [
  {
    number: "01",
    label: "SECTOR PÚBLICO",
    title: "Servicios que entienden la institución y a sus usuarios.",
    copy:
      "Componemos atención, información y seguimiento con trazabilidad, continuidad y reglas institucionales desde el diseño.",
    tags: ["Atención y trámites", "Gestión y seguimiento", "Datos para decidir"],
    image: "/brand/home/sector-public.webp",
    imageAlt: "Ciudad colombiana entre montañas y niebla al anochecer",
    href: "/contacto",
    link: "Conversar sobre un reto público",
  },
  {
    number: "02",
    label: "SECTOR PRIVADO",
    title: "Productos que conectan experiencia y operación.",
    copy:
      "Reunimos producto, procesos, conocimiento y datos en herramientas capaces de aprender del uso y crecer con el negocio.",
    tags: ["Productos digitales", "Operaciones internas", "Automatización con control"],
    image: "/brand/home/sector-private.webp",
    imageAlt: "Edificio contemporáneo integrado con vegetación tropical",
    href: "/trabajo",
    link: "Ver trabajo documentado",
  },
] as const;

export default function CapacidadesPage() {
  return (
    <ContactDialogProvider>
      <div className={styles.capabilitiesRoot}>
        <SiteHeader inverseOnTop />
        <main id="main-content" tabIndex={-1}>
          <section className={styles.hero} aria-labelledby="capabilities-title" data-header-theme="dark">
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>00 / CAPACIDADES</p>
              <h1 id="capabilities-title">
                No elegimos una solución. <em>Componemos la que el problema necesita.</em>
              </h1>
              <p className={styles.heroLead}>
                Producto, operación, conocimiento e integración no son paquetes separados.
                Son piezas de un sistema que se decide desde el contexto y termina en software
                que alguien puede usar.
              </p>
              <div className={styles.heroActions}>
                <a href="#explorador">Componer un escenario <span aria-hidden="true">↓</span></a>
                <Link href="/trabajo">Ver evidencia real <span aria-hidden="true">↗</span></Link>
              </div>
            </div>

            <figure className={styles.heroSystem} aria-labelledby="hero-system-caption">
              <div className={styles.systemBar}>
                <span>INPLUX FACTORY / COMPOSITOR</span>
                <strong><i aria-hidden="true" /> SISTEMA ACTIVO</strong>
              </div>
              <div className={styles.systemBody}>
                <ol className={styles.systemRail} aria-label="Capas del sistema">
                  <li data-active="true"><span>01</span> Contexto</li>
                  <li data-active="true"><span>02</span> Producto</li>
                  <li><span>03</span> Operación</li>
                  <li data-active="true"><span>04</span> IA</li>
                  <li data-active="true"><span>05</span> Integración</li>
                </ol>
                <div className={styles.systemProject}>
                  <div className={styles.projectMeta}>
                    <span>CREATE PROJECT</span>
                    <b>CAP-01</b>
                  </div>
                  <p>PROBLEMA / CONTEXTO</p>
                  <h2>Una composición,<br />no una plantilla.</h2>
                  <div className={styles.projectModules} aria-label="Módulos seleccionados">
                    <span data-on="true">UI</span>
                    <span>OPS</span>
                    <span data-on="true">AI</span>
                    <span data-on="true">API</span>
                  </div>
                  <div className={styles.projectOutput}>
                    <span>SALIDA</span>
                    <strong>SOFTWARE EN PRODUCCIÓN</strong>
                    <i aria-hidden="true">→</i>
                  </div>
                </div>
              </div>
              <figcaption id="hero-system-caption">
                La combinación cambia con el problema; el estándar de producto no.
              </figcaption>
            </figure>
          </section>

          <section className={styles.thesis} aria-labelledby="thesis-title">
            <p className={styles.eyebrow}>01 / PUNTO DE PARTIDA</p>
            <div className={styles.thesisCopy}>
              <h2 id="thesis-title">El trabajo no entra por servicio. <em>Entra por cambio.</em></h2>
              <p>
                Antes de hablar de pantallas, modelos o APIs, definimos qué debería ser
                distinto para la persona y para la operación.
              </p>
            </div>
            <ol className={styles.thesisSignals} aria-label="Preguntas que orientan un proyecto">
              <li><span>01</span><p>¿Quién vive el problema?</p></li>
              <li><span>02</span><p>¿Qué decisión o acción debe mejorar?</p></li>
              <li><span>03</span><p>¿Qué evidencia mostrará que cambió?</p></li>
            </ol>
          </section>

          <section id="explorador" className={styles.explorer} aria-labelledby="explorer-title">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>02 / COMPOSITOR EN VIVO</p>
              <div>
                <h2 id="explorer-title">Selecciona el cambio. <em>Mira cómo se compone el sistema.</em></h2>
                <p>
                  Cuatro escenarios frecuentes, cuatro combinaciones distintas. La demo
                  explica qué entra, qué debe resolverse y qué queda listo para evolucionar.
                </p>
              </div>
            </div>
            <CapabilitiesWorkbench />
          </section>

          <section className={styles.evidence} aria-labelledby="evidence-title">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>03 / EVIDENCIA</p>
              <div>
                <h2 id="evidence-title">La composición se entiende mejor <em>cuando ya está funcionando.</em></h2>
                <p>
                  Estas son capturas de productos públicos, no ilustraciones conceptuales.
                  Cada perfil publica el estado que el producto declara, las fuentes que
                  lo respaldan y la fecha en que se revisaron.
                </p>
              </div>
            </div>

            <div className={styles.evidenceGrid}>
              {evidenceItems.map((item) => (
                <article key={item.name}>
                  <figure className={styles.browserFrame}>
                    <div className={styles.browserChrome} aria-hidden="true">
                      <span /><span /><span />
                      <p>{item.productHref.replace("https://", "")}</p>
                    </div>
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      width={1440}
                      height={960}
                      sizes="(max-width: 800px) 100vw, 50vw"
                    />
                    <figcaption>
                      Captura pública {item.capturedLabel} · fuente verificada{" "}
                      {item.verifiedLabel}
                    </figcaption>
                  </figure>
                  <div className={styles.evidenceCopy}>
                    <div className={styles.evidenceMeta}>
                      <span>{item.number}</span>
                      <p>{item.category}</p>
                      <strong>{item.statusLabel}</strong>
                    </div>
                    <h3>{item.name}</h3>
                    <h4>{item.headline}</h4>
                    <p>{item.description}</p>
                    <small>{item.attribution}</small>
                    <div className={styles.evidenceLinks}>
                      <Link href={item.profileHref}>Ver perfil y fuentes <span aria-hidden="true">→</span></Link>
                      <a href={item.productHref} target="_blank" rel="noreferrer">
                        {item.productLabel} <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.layers} aria-labelledby="layers-title">
            <div className={styles.layersHeading}>
              <p className={styles.eyebrow}>04 / LAS PIEZAS</p>
              <h2 id="layers-title">Cuatro capacidades. <em>Una responsabilidad compartida.</em></h2>
              <p>
                Cada una resuelve una tensión distinta. Se activa solo cuando mejora el recorrido completo.
              </p>
            </div>
            <div className={styles.layerGrid}>
              {capabilityLayers.map((layer) => (
                <article id={layer.id} key={layer.id}>
                  <div className={styles.layerTop}>
                    <span>{layer.number}</span>
                    <strong>{layer.code}</strong>
                  </div>
                  <h3>{layer.title}</h3>
                  <dl>
                    <div><dt>Aparece cuando</dt><dd>{layer.trigger}</dd></div>
                    <div><dt>Deja listo</dt><dd>{layer.output}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <section id="sector-publico" className={styles.audiences} aria-labelledby="audiences-title">
            <div className={styles.audiencesHeading}>
              <p className={styles.eyebrow}>05 / DÓNDE TRABAJAMOS</p>
              <h2 id="audiences-title">Dos contextos. <em>El mismo nivel de exigencia.</em></h2>
            </div>
            <div className={styles.audienceGrid}>
              {audiences.map((audience) => (
                <article key={audience.label}>
                  <Image
                    className={styles.audienceImage}
                    src={audience.image}
                    alt={audience.imageAlt}
                    fill
                    sizes="(max-width: 800px) 100vw, 50vw"
                  />
                  <div className={styles.audienceScrim} aria-hidden="true" />
                  <div className={styles.audienceContent}>
                    <p><span>{audience.number}</span> {audience.label}</p>
                    <h3>{audience.title}</h3>
                    <p>{audience.copy}</p>
                    <ul>{audience.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                    <Link href={audience.href}>{audience.link} <span aria-hidden="true">→</span></Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="contacto" className={styles.closing} aria-labelledby="closing-title" data-header-theme="dark">
            <p className={styles.eyebrow}>06 / SIGUIENTE PROYECTO</p>
            <div>
              <h2 id="closing-title">Trae el problema. <em>Construimos el sistema.</em></h2>
              <p>
                No necesitas llegar con requisitos ni arquitectura. Empezamos por quién vive el problema y qué debería cambiar.
              </p>
              <Link href="/contacto">Empezar por el contexto <span aria-hidden="true">→</span></Link>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </ContactDialogProvider>
  );
}

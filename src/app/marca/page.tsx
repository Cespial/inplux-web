import Image from "next/image";
import Link from "next/link";
import { CopyableColor } from "@/components/brand/CopyableColor";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import styles from "./marca.module.css";

const colors = [
  {
    token: "INK / 950",
    name: "Negro de fábrica",
    hex: "#0C0C0B",
    use: "Fondos inmersivos, texto de alto contraste y estructura.",
    tone: "dark",
  },
  {
    token: "IVORY / 050",
    name: "Marfil editorial",
    hex: "#F9F5EF",
    use: "Superficies de lectura y texto sobre negro.",
    tone: "light",
  },
  {
    token: "PAPER / 100",
    name: "Papel técnico",
    hex: "#E6E1D9",
    use: "Paneles, controles y contraste cálido.",
    tone: "light",
  },
  {
    token: "SIGNAL / 500",
    name: "Teal eléctrico",
    hex: "#00D7CA",
    use: "Señales activas, foco y estados importantes.",
    tone: "signal",
  },
  {
    token: "MUTED / 500",
    name: "Neutral operativo",
    hex: "#959089",
    use: "Texto secundario y metadatos sobre fondo oscuro.",
    tone: "dark",
  },
  {
    token: "LINE / 800",
    name: "Línea estructural",
    hex: "#2B2926",
    use: "Divisiones, rejillas y profundidad.",
    tone: "dark",
  },
] as const;

const logoAssets = [
  {
    name: "Lockup horizontal",
    note: "Uso principal",
    src: "/brand/logos/inplux-logo-horizontal.svg",
    width: 403,
    height: 112,
    inverse: false,
    downloads: [
      ["/brand/logos/inplux-logo-horizontal.svg", "SVG"],
      ["/brand/logos/inplux-logo-horizontal.png", "PNG"],
    ],
  },
  {
    name: "Lockup inverso",
    note: "Fondos oscuros",
    src: "/brand/logos/inplux-logo-horizontal-inverse.svg",
    width: 403,
    height: 112,
    inverse: true,
    downloads: [["/brand/logos/inplux-logo-horizontal-inverse.svg", "SVG"]],
  },
  {
    name: "Símbolo",
    note: "Espacios compactos",
    src: "/brand/logos/inplux-mark-teal.svg",
    width: 100,
    height: 100,
    inverse: false,
    downloads: [["/brand/logos/inplux-mark-teal.svg", "SVG"]],
  },
  {
    name: "Ícono de aplicación",
    note: "Superficies cuadradas",
    src: "/brand/logos/inplux-appicon.svg",
    width: 100,
    height: 100,
    inverse: false,
    downloads: [["/brand/logos/inplux-appicon.svg", "SVG"]],
  },
] as const;

const typeScale = [
  ["DISPLAY / 01", "Newsreader Display", "Titulares editoriales", "De contexto a producto."],
  ["BODY / 02", "Geist", "Texto, navegación y UI", "Software útil, explicado con claridad."],
  ["MONO / 03", "Geist Mono", "Datos, estados y señales", "INPLUX FACTORY / SYSTEM ACTIVE"],
] as const;

function DownloadLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} download>
      {children} <span aria-hidden="true">↓</span>
    </a>
  );
}

export default function MarcaPage() {
  return (
    <ContactDialogProvider>
      <div className={styles.brandRoot}>
        <SiteHeader inverseOnTop />
        <main id="main-content" tabIndex={-1}>
          <section
            className={styles.hero}
            data-header-theme="dark"
            aria-labelledby="brand-title"
          >
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span>00</span> Sistema de marca / 2026
              </p>
              <h1 id="brand-title">
                Una identidad que funciona como <em>sistema.</em>
              </h1>
              <p>
                Activos, tipografía, color y movimiento para que cada experiencia
                de INPLUX se sienta parte de la misma fábrica.
              </p>
              <nav aria-label="Secciones del sistema de marca">
                <a href="#principios">Principios</a>
                <a href="#logo">Logo</a>
                <a href="#color">Color</a>
                <a href="#tipografia">Tipografía</a>
                <a href="#interaccion">Interacción</a>
              </nav>
            </div>

            <div className={styles.heroSystem} aria-hidden="true">
              <div className={styles.systemTop}>
                <span>INPLUX / BRAND OS</span>
                <span>V 2026.01</span>
              </div>
              <div className={styles.systemCanvas}>
                <div className={styles.systemMark}>
                  <Image
                    src="/brand/logos/inplux-mark-white.svg"
                    alt=""
                    width={160}
                    height={160}
                    priority
                  />
                </div>
                <div className={styles.systemOrbit}>
                  <i />
                  <i />
                  <i />
                </div>
                <div className={styles.systemLabels}>
                  <span>EDITORIAL</span>
                  <span>PRECISO</span>
                  <span>HUMANO</span>
                </div>
              </div>
              <div className={styles.systemBottom}>
                <span><i /> SISTEMA ACTIVO</span>
                <span>CONTRASTE / AA+</span>
              </div>
            </div>
          </section>

          <section
            id="principios"
            className={styles.principles}
            aria-labelledby="principles-title"
          >
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>
                <span>01</span> Principios
              </p>
              <h2 id="principles-title">
                La expresión visual sigue el mismo <em>criterio</em> del producto.
              </h2>
              <p>
                La marca no añade decoración después de construir. Ayuda a hacer
                visible la estructura, el estado y la intención de cada experiencia.
              </p>
            </div>
            <div className={styles.principleGrid}>
              <article>
                <span>01 / EDITORIAL</span>
                <h3>La idea principal tiene espacio.</h3>
                <p>
                  Titulares grandes, ritmo calmado y jerarquías claras permiten
                  comprender antes de explorar el detalle.
                </p>
              </article>
              <article>
                <span>02 / SISTÉMICO</span>
                <h3>Cada microelemento explica algo.</h3>
                <p>
                  Líneas, etiquetas, coordenadas y estados muestran relaciones;
                  no compiten por atención.
                </p>
              </article>
              <article>
                <span>03 / HUMANO</span>
                <h3>La tecnología no borra el criterio.</h3>
                <p>
                  El lenguaje es directo y accesible. La interfaz deja claro qué
                  ocurre y quién conserva la responsabilidad.
                </p>
              </article>
            </div>
          </section>

          <section id="logo" className={styles.logoSection} aria-labelledby="logo-title">
            <div className={styles.sectionIntroDark}>
              <p className={styles.eyebrow}>
                <span>02</span> Identidad
              </p>
              <h2 id="logo-title">
                Un símbolo. Distintas <em>escalas.</em>
              </h2>
              <p>
                Usa el lockup completo cuando exista espacio. El símbolo conserva
                reconocimiento en íconos, favicons y superficies compactas.
              </p>
            </div>
            <div className={styles.logoGrid}>
              {logoAssets.map((asset) => (
                <article key={asset.name}>
                  <div
                    className={styles.logoStage}
                    data-inverse={asset.inverse}
                  >
                    <Image
                      src={asset.src}
                      alt={`${asset.name} de INPLUX`}
                      width={asset.width}
                      height={asset.height}
                    />
                  </div>
                  <div className={styles.assetMeta}>
                    <div>
                      <strong>{asset.name}</strong>
                      <span>{asset.note}</span>
                    </div>
                    <div>
                      {asset.downloads.map(([href, label]) => (
                        <DownloadLink href={href} key={href}>{label}</DownloadLink>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className={styles.logoRules}>
              <article>
                <span>ESPACIO / 01</span>
                <p>Conserva alrededor del lockup un margen mínimo igual a la altura del símbolo.</p>
              </article>
              <article>
                <span>ESCALA / 02</span>
                <p>Por debajo de 120 px de ancho usa el símbolo; no comprimas el lockup completo.</p>
              </article>
              <article>
                <span>INTEGRIDAD / 03</span>
                <p>No reconstruyas, deformes, inclines ni añadas efectos al archivo maestro.</p>
              </article>
            </div>
          </section>

          <section id="color" className={styles.colorSection} aria-labelledby="color-title">
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>
                <span>03</span> Color
              </p>
              <h2 id="color-title">
                Oscuridad para profundidad. Teal para <em>señal.</em>
              </h2>
              <p>
                La paleta es reducida. El acento identifica actividad y foco; no
                reemplaza la jerarquía tipográfica.
              </p>
            </div>
            <div className={styles.colorGrid}>
              {colors.map((color) => (
                <article key={color.hex} data-tone={color.tone}>
                  <div style={{ backgroundColor: color.hex }}>
                    <span>{color.token}</span>
                  </div>
                  <div className={styles.colorMeta}>
                    <div>
                      <h3>{color.name}</h3>
                      <p>{color.use}</p>
                    </div>
                    <CopyableColor hex={color.hex} className={styles.copyColor} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            id="tipografia"
            className={styles.typeSection}
            data-header-theme="dark"
            aria-labelledby="type-title"
          >
            <div className={styles.sectionIntroDark}>
              <p className={styles.eyebrow}>
                <span>04</span> Tipografía
              </p>
              <h2 id="type-title">
                Tres voces, una misma <em>jerarquía.</em>
              </h2>
              <p>
                Newsreader aporta carácter editorial. Geist mantiene legibilidad.
                Geist Mono hace visibles los estados del sistema.
              </p>
            </div>
            <div className={styles.typeSpecimens}>
              {typeScale.map(([code, family, use, sample], index) => (
                <article data-family={index} key={family}>
                  <div>
                    <span>{code}</span>
                    <strong>{family}</strong>
                    <p>{use}</p>
                  </div>
                  <p>{sample}</p>
                </article>
              ))}
            </div>
            <div className={styles.typeRules}>
              <p>DISPLAY / 300 / −0.05EM / 0.88</p>
              <p>BODY / 400–650 / −0.02EM / 1.55</p>
              <p>MONO / 500–650 / +0.08EM / UPPERCASE</p>
            </div>
          </section>

          <section
            id="interaccion"
            className={styles.motionSection}
            aria-labelledby="motion-title"
          >
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>
                <span>05</span> Interacción
              </p>
              <h2 id="motion-title">
                El movimiento confirma una <em>causa.</em>
              </h2>
              <p>
                Las transiciones explican cambios de estado y continuidad. Son
                breves, interrumpibles y respetan la preferencia de movimiento reducido.
              </p>
            </div>
            <div className={styles.motionGrid}>
              <article>
                <span>150 MS</span>
                <h3>Respuesta</h3>
                <p>Presión, foco y controles pequeños.</p>
                <div className={styles.motionButton}>PRESS / 0.97</div>
              </article>
              <article>
                <span>180 MS</span>
                <h3>Transición</h3>
                <p>Color, opacidad y feedback local.</p>
                <div className={styles.motionSignal}><i /></div>
              </article>
              <article>
                <span>240 MS</span>
                <h3>Continuidad</h3>
                <p>Paneles, etapas y desplazamientos con contexto.</p>
                <div className={styles.motionLayers}><i /><i /><i /></div>
              </article>
            </div>
          </section>

          <section className={styles.downloadSection} aria-labelledby="download-title">
            <div>
              <p className={styles.eyebrow}>
                <span>06</span> Activos
              </p>
              <h2 id="download-title">
                Usa siempre los archivos <em>maestros.</em>
              </h2>
            </div>
            <div className={styles.downloadList}>
              <DownloadLink href="/brand/logos/inplux-logo-horizontal.svg">
                Logo horizontal / SVG
              </DownloadLink>
              <DownloadLink href="/brand/logos/inplux-logo-horizontal-inverse.svg">
                Logo inverso / SVG
              </DownloadLink>
              <DownloadLink href="/brand/logos/inplux-appicon.svg">
                App icon / SVG
              </DownloadLink>
              <DownloadLink href="/brand/favicon/maskable-512.png">
                Maskable / PNG
              </DownloadLink>
            </div>
            <Link href="/">Volver al sitio <span aria-hidden="true">↗</span></Link>
          </section>
        </main>
        <SiteFooter />
      </div>
    </ContactDialogProvider>
  );
}

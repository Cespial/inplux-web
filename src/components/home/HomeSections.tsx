import Image from "next/image";
import Link from "next/link";
import { portfolio } from "@/content/home";
import { pressStories } from "@/content/press";
import { workProfiles } from "@/content/work";
import { FactoryRun } from "./FactoryRun.client";
import { ProjectCreateDemo } from "./ProjectCreateDemo.client";
import styles from "./home.module.css";

const clientLogos = [
  {
    src: "/brand/clients/parque-arvi.png",
    name: "Parque Arví Corporación",
    note: "Turismo, territorio y sostenibilidad",
    relation: "Experiencia",
    width: 379,
    height: 394,
    renderWidth: 50,
  },
  {
    src: "/brand/clients/think-it.png",
    name: "Think IT",
    note: "Aliado tecnológico",
    relation: "Aliado",
    width: 577,
    height: 140,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/experience-03.png",
    name: "Corporación Interuniversitaria de Servicios",
    note: "Gestión y servicios interinstitucionales",
    relation: "Experiencia",
    width: 447,
    height: 151,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/politecnico-jaime-isaza.png",
    name: "Politécnico Colombiano Jaime Isaza Cadavid",
    note: "Educación superior pública",
    relation: "Experiencia",
    width: 563,
    height: 146,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/experience-04.png",
    name: "Provincia del Agua, Bosques y el Turismo",
    note: "Cooperación territorial",
    relation: "Experiencia",
    width: 473,
    height: 512,
    renderWidth: 48,
  },
  {
    src: "/brand/clients/experience-05.png",
    name: "Rentan",
    note: "Operación empresarial",
    relation: "Experiencia",
    width: 388,
    height: 104,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/experience-06-transparent.png",
    name: "Empresa de Desarrollo Urbano",
    note: "Desarrollo urbano",
    relation: "Experiencia",
    width: 367,
    height: 138,
    renderWidth: 138,
  },
  {
    src: "/brand/clients/experience-07.png",
    name: "Sistemas Aries",
    note: "Tecnología para la gestión pública",
    relation: "Experiencia",
    width: 223,
    height: 113,
    renderWidth: 103,
  },
  {
    src: "/brand/clients/municipio-cisneros.png",
    name: "Municipio de Cisneros",
    note: "Gestión pública territorial",
    relation: "Experiencia",
    width: 200,
    height: 200,
    renderWidth: 52,
  },
  {
    src: "/brand/clients/experience-08.png",
    name: "Municipio de Necoclí",
    note: "Gestión pública territorial",
    relation: "Experiencia",
    width: 192,
    height: 180,
    renderWidth: 55,
  },
] as const;

function ClientLogoCell({ client }: { client: (typeof clientLogos)[number] }) {
  return (
    <div
      className={styles.logoCell}
      role="group"
      aria-label={`${client.relation}: ${client.name}. ${client.note}`}
    >
      <span className={styles.logoRelation}>{client.relation}</span>
      <Image
        src={client.src}
        alt={client.name}
        width={client.width}
        height={client.height}
        sizes={`${client.renderWidth}px`}
      />
      <span className={styles.logoProof} aria-hidden="true">
        <strong>{client.name}</strong>
        <span>{client.note}</span>
      </span>
    </div>
  );
}

export function ExperienceRail() {
  const featuredProducts = workProfiles.filter(
    (product) => product.attribution.state === "confirmed",
  );

  return (
    <section
      id="trabajo-real"
      className={styles.experienceRail}
      aria-labelledby="proof-ribbon-title"
    >
      <div
        className={styles.proofRibbon}
        role="region"
        aria-label="Productos con atribución pública confirmada a INPLUX"
        tabIndex={0}
      >
        <div className={styles.proofRibbonIntro}>
          <p>TRABAJO ATRIBUIBLE / PRODUCTOS</p>
          <h2 id="proof-ribbon-title">Trabajo que sí podemos atribuir.</h2>
        </div>
        {featuredProducts.map((product) => {
          const status = product.status.label;
          return (
            <Link
              className={styles.proofProduct}
              href={`/trabajo/${product.slug}`}
              key={product.name}
            >
              <>
                <span>{product.category}</span>
                <strong>{product.name}</strong>
                <small>{status}</small>
                <i aria-hidden="true">→</i>
              </>
            </Link>
          );
        })}
        <Link className={styles.proofProduct} href="/trabajo">
          <span>EVIDENCIA / ATRIBUCIÓN</span>
          <strong>Directorio</strong>
          <small>{workProfiles.length} perfiles documentados</small>
          <i aria-hidden="true">→</i>
        </Link>
      </div>
      <div
        className={styles.logoWall}
        role="region"
        aria-label="Organizaciones con las que INPLUX ha trabajado."
        tabIndex={0}
      >
        {clientLogos.slice(0, 2).map((client) => (
          <ClientLogoCell client={client} key={client.src} />
        ))}
        <div className={`${styles.logoCell} ${styles.logoStatement}`}>
          <p>
            RELACIONES REALES
            <strong>EXPERIENCIA Y ALIANZAS</strong>
            <span className={styles.logoRailHint} aria-hidden="true">
              DESLIZA PARA VER 10 →
            </span>
          </p>
        </div>
        {clientLogos.slice(2).map((client) => (
          <ClientLogoCell client={client} key={client.src} />
        ))}
      </div>
    </section>
  );
}

export function SectorPanel({ kind }: { kind: "public" | "private" }) {
  const isPublic = kind === "public";
  const image = isPublic
    ? "/brand/home/sector-public.webp"
    : "/brand/home/sector-private.webp";
  const imagePosition = isPublic ? "50% 42%" : "50% 40%";

  return (
    <article className={`${styles.sectorPanel} ${isPublic ? styles.sectorPublic : styles.sectorPrivate}`}>
      <div className={styles.sectorPattern} aria-hidden="true">
        <Image
          className={styles.sectorImage}
          src={image}
          alt=""
          fill
          quality={75}
          sizes="(max-width: 767px) 100vw, 50vw"
          style={{ objectPosition: imagePosition }}
        />
      </div>
      <div className={styles.sectorContent}>
        <p>{isPublic ? "SECTOR PÚBLICO / 01" : "SECTOR PRIVADO / 02"}</p>
        <h3>
          {isPublic
            ? "Servicios que sostienen lo colectivo."
            : "Productos que mueven el negocio."}
        </h3>
        <p>
          {isPublic
            ? "Digitalizamos atención, información y seguimiento para que la operación sea más clara, conectada y trazable."
            : "Construimos productos y herramientas internas que convierten procesos, conocimiento y datos en una operación que puede crecer."}
        </p>
        <ul>
          {(isPublic
            ? ["Atención y trámites", "Gestión y seguimiento", "Datos para decidir"]
            : ["Productos digitales", "Operaciones internas", "Automatización con control"]
          ).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <a href="#contacto">
          {isPublic ? "Hablemos de un reto público" : "Hablemos de un reto privado"}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

export function ApiChapter() {
  const capabilities = [
    ["Interfaces y APIs claras", "Cada integración tiene un contrato comprensible y verificable."],
    ["Seguridad desde el diseño", "Identidad, permisos y trazabilidad se definen desde el principio."],
    ["Integraciones observables", "Sabemos qué ocurrió, cuándo y por qué, sin depender de cajas negras."],
    ["Documentación viva", "El producto y su documentación evolucionan como una sola pieza."],
  ] as const;

  return (
    <section id="integraciones" className={styles.apiChapter} aria-labelledby="api-chapter-title">
      <div className={styles.apiChapterCopy}>
        <p className={styles.eyebrow}>03 / INTEGRACIÓN</p>
        <h2 id="api-chapter-title">
          <span>Listo para integrarse.</span>
          <span>
            Hecho para <em>evolucionar.</em>
          </span>
        </h2>
        <p>
          Construimos software que conversa con lo que tu organización ya usa y
          deja una base clara para lo que vendrá después.
        </p>
        <ul>
          {capabilities.map(([title, copy]) => (
            <li key={title}>
              <i aria-hidden="true">✓</i>
              <span>
                <strong>{title}</strong>
                <small>{copy}</small>
              </span>
            </li>
          ))}
        </ul>
        <div className={styles.apiChapterActions}>
          <a className={styles.ghostButton} href="#contacto">
            Hablemos de tu arquitectura
          </a>
          <a href="#fabrica-en-vivo">
            Ver la fábrica
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <div className={styles.apiChapterVisual}>
        <Image
          className={styles.apiChapterImage}
          src="/brand/home/api-chapter.webp"
          alt=""
          fill
          quality={75}
          sizes="(max-width: 767px) 100vw, 50vw"
        />
        <div className={styles.apiChapterScrim} aria-hidden="true" />
        <ProjectCreateDemo />
      </div>
    </section>
  );
}

export function ProductStories() {
  return (
    <section id="proyectos" className={styles.products} aria-labelledby="products-title">
      <div className={styles.productsHeading}>
        <div>
          <p className={styles.eyebrow}>04 / TRABAJO REAL</p>
          <h2 id="products-title">Productos que ya están tomando forma.</h2>
        </div>
        <p>
          Un portafolio propio y cocreado que nos obliga a resolver los mismos problemas
          de producto, operación y evolución que resolvemos con nuestros clientes.
        </p>
      </div>
      <div className={styles.productTable}>
        {portfolio.map((product, index) => {
          const content = (
            <>
              <span className={styles.productNumber}>0{index + 1}</span>
              <h3>{product.name}</h3>
              <p>{product.category}</p>
              <p>{product.description}</p>
              <span className={styles.productStatus}>
                {product.stage ?? product.access ?? "Producto"}
              </span>
              <i aria-hidden="true">{product.href ? "↗" : "→"}</i>
            </>
          );

          return product.href ? (
            <Link href={product.href} key={product.name}>
              {content}
            </Link>
          ) : (
            <div key={product.name}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}

export function HomePressStories() {
  return (
    <section id="prensa" className={styles.press} aria-labelledby="press-title">
      <div className={styles.pressHeading}>
        <div>
          <p className={styles.eyebrow}>07 / EN CONVERSACIÓN</p>
          <h2 id="press-title">
            <span className={styles.pressTitleDesktop}>
              Ideas que salen de la fábrica y entran en la <em>conversación.</em>
            </span>
            <span className={styles.pressTitleMobile}>INPLUX en conversación.</span>
          </h2>
        </div>
        <Link href="/prensa">
          Ver todas las historias <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className={styles.pressGrid}>
        {pressStories
          .filter((story) => story.featured)
          .slice(0, 3)
          .map((story) => (
          <a
            className={styles.pressCard}
            href={story.href}
            target="_blank"
            rel="noreferrer"
            key={story.slug}
          >
            <div className={`${styles.pressVisual} ${styles[`press${story.visualKind}`]}`}>
              {story.image ? (
                <Image
                  src={story.image}
                  alt={story.imageAlt ?? ""}
                  fill
                  sizes="(max-width: 800px) 90vw, 33vw"
                />
              ) : null}
              {story.stat ? <strong>{story.stat}</strong> : null}
              <span>{story.visualSignal}</span>
            </div>
            <div className={styles.pressMeta}>
              <span>{story.format}</span>
              <span>{story.outlet}</span>
              <time dateTime={story.publishedAt}>{story.publishedLabel}</time>
            </div>
            <h3>{story.title}</h3>
            <i aria-hidden="true">↗</i>
          </a>
          ))}
      </div>
    </section>
  );
}

export function BuildNarrative() {
  const deliveryChecks = [
    ["Problema y resultado primero", "Alineamos propósito, personas y evidencia antes de definir el alcance."],
    ["Diseño e ingeniería juntos", "Una sola mesa de trabajo reduce traducciones y decisiones tardías."],
    ["Demostraciones frecuentes", "Ves software funcionando y decides con algo concreto frente a ti."],
    ["Inteligencia con supervisión", "La IA acelera el trabajo; el criterio humano conserva la dirección."],
    ["Medición en producción", "Cada versión genera señales para decidir qué conviene evolucionar."],
  ] as const;

  const capabilities = [
    ["01", "Propósito antes que alcance", "Partimos del problema y del resultado esperado, no de una lista cerrada de pantallas."],
    ["02", "Una sola mesa de trabajo", "Contexto, diseño e ingeniería deciden juntos para reducir pérdida de información."],
    ["03", "Inteligencia con supervisión", "Sistemas de IA aceleran investigación, código y pruebas; las decisiones siguen bajo dirección humana."],
    ["04", "Evidencia para evolucionar", "Cada versión en uso produce señales que orientan la siguiente decisión de producto."],
  ] as const;

  return (
    <section id="como-trabajamos" className={styles.build} aria-labelledby="build-title">
      <div className={styles.buildIntro}>
        <p className={styles.eyebrow}>05 / CÓMO TRABAJAMOS</p>
        <h2 id="build-title">Una fábrica diseñada para entregar.</h2>
        <p>
          La tecnología cambia rápido. Nuestro sistema de trabajo está diseñado para
          aprender sin perder claridad, responsabilidad ni control.
        </p>
        <ul className={styles.buildChecklist}>
          {deliveryChecks.map(([title, copy]) => (
            <li key={title}>
              <i aria-hidden="true">✓</i>
              <span>
                <strong>{title}</strong>
                <small>{copy}</small>
              </span>
            </li>
          ))}
        </ul>
        <div className={styles.buildActions}>
          <a className={styles.pillButton} href="#contacto">
            Empezar un proyecto
          </a>
          <a className={styles.ghostButton} href="#fabrica-en-vivo">
            Ver la fábrica
          </a>
        </div>
      </div>
      <FactoryRun />
      <div className={styles.capabilityAct}>
        <div className={styles.capabilityHeading}>
          <p className={styles.eyebrow}>06 / HECHA PARA AVANZAR</p>
          <h2>Ritmo de entrega, sin perder criterio ni control.</h2>
        </div>
        <div className={styles.capabilityGrid}>
          {capabilities.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <Image
          src="/brand/logos/inplux-logo-horizontal-inverse.svg"
          alt="INPLUX"
          width={403}
          height={112}
        />
        <p>Fábrica de software a la medida para empresas y entidades.</p>
      </div>
      <div className={styles.footerLinks}>
        <nav aria-label="Explorar">
          <p>Explorar</p>
          <a href="#fabrica-en-vivo">La fábrica</a>
          <a href="#que-construimos">Qué construimos</a>
          <a href="#donde-trabajamos">Dónde trabajamos</a>
          <a href="#como-trabajamos">Cómo trabajamos</a>
          <a href="#contacto">Empezar un proyecto</a>
        </nav>
        <nav aria-label="Capacidades">
          <p>Capacidades</p>
          <a href="#que-construimos">Producto digital</a>
          <a href="#que-construimos">Modernización</a>
          <a href="#que-construimos">IA aplicada</a>
          <a href="#que-construimos">Servicios públicos</a>
        </nav>
        <nav aria-label="Productos">
          <p>Productos</p>
          <Link href="/trabajo/tribai">Tribai</Link>
          <Link href="/trabajo/gobia">Gobia</Link>
          <Link href="/trabajo/kelsen">Kelsen</Link>
          <Link href="/trabajo/laudos">Laudos</Link>
        </nav>
        <nav aria-label="Compañía">
          <p>Compañía</p>
          <Link href="/nosotros">Nosotros</Link>
          <Link href="/prensa">Prensa</Link>
          <a href="#como-trabajamos">Nuestro sistema</a>
        </nav>
        <nav aria-label="Contacto">
          <p>Contacto</p>
          <a href="mailto:gerencia@inplux.co">gerencia@inplux.co</a>
          <span>Medellín, Colombia</span>
        </nav>
        <nav aria-label="En conversación">
          <p>En conversación</p>
          <a href="https://www.linkedin.com/company/inplux" target="_blank" rel="noreferrer">LinkedIn</a>
          <Link href="/prensa">Historias y podcasts</Link>
        </nav>
      </div>
      <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} INPLUX S.A.S.</span>
        <span>Software con criterio y dirección humana.</span>
      </div>
    </footer>
  );
}

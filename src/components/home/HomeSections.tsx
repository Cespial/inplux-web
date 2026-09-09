import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { homeCopyEs } from "@/content/copy/es";
import type {
  ApiChapterCopy,
  BuildNarrativeCopy,
  ExperienceRailCopy,
  SectorsCopy,
} from "@/content/copy/types";
import { portfolio } from "@/content/home";
import { pressStories } from "@/content/press";
import { workProfiles } from "@/content/work";
import { FactoryRun } from "./FactoryRun.client";
import { ProjectCreateDemo } from "./ProjectCreateDemo.client";
import { fillSpan } from "./gridFill";
import styles from "./home.module.css";

/**
 * El nombre y las dimensiones de cada logo son datos de la relación, no copy:
 * viven aquí, en el único archivo con permiso registrado para nombrarlos. La
 * nota descriptiva sí se traduce y llega desde el diccionario de copy.
 */
const clientLogos = [
  {
    src: "/brand/clients/corantioquia.png",
    name: "CORANTIOQUIA",
    relation: "partner-experience",
    width: 300,
    height: 222,
    renderWidth: 70,
  },
  {
    src: "/brand/clients/creame.png",
    name: "Creame",
    relation: "partner-experience",
    width: 480,
    height: 184,
    renderWidth: 136,
  },
  {
    src: "/brand/clients/maria-cano.png",
    name: "Fundación Universitaria María Cano",
    relation: "partner-experience",
    width: 480,
    height: 167,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/esumer.png",
    name: "Institución Universitaria Esumer",
    relation: "partner-experience",
    width: 401,
    height: 133,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/ipsmedic.png",
    name: "+IPSMEDIC",
    relation: "partner-experience",
    width: 141,
    height: 121,
    renderWidth: 61,
  },
  {
    src: "/brand/clients/parque-arvi.png",
    name: "Parque Arví Corporación",
    relation: "partner-experience",
    width: 379,
    height: 394,
    renderWidth: 50,
  },
  {
    src: "/brand/clients/experience-03.png",
    name: "Corporación Interuniversitaria de Servicios",
    relation: "partner-experience",
    width: 447,
    height: 151,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/politecnico-jaime-isaza.png",
    name: "Politécnico Colombiano Jaime Isaza Cadavid",
    relation: "partner-experience",
    width: 563,
    height: 146,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/experience-04.png",
    name: "Provincia del Agua, Bosques y el Turismo",
    relation: "partner-experience",
    width: 473,
    height: 512,
    renderWidth: 48,
  },
  {
    src: "/brand/clients/experience-05.png",
    name: "Rentan",
    relation: "partner-experience",
    width: 388,
    height: 104,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/experience-06-transparent.png",
    name: "Empresa de Desarrollo Urbano",
    relation: "partner-experience",
    width: 367,
    height: 138,
    renderWidth: 138,
  },
  {
    src: "/brand/clients/experience-07.png",
    name: "Sistemas Aries",
    relation: "partner-experience",
    width: 223,
    height: 113,
    renderWidth: 103,
  },
  {
    src: "/brand/clients/municipio-cisneros.png",
    name: "Municipio de Cisneros",
    relation: "partner-experience",
    width: 200,
    height: 200,
    renderWidth: 52,
  },
  {
    src: "/brand/clients/alcaldia-caucasia.png",
    name: "Alcaldía de Caucasia",
    relation: "partner-experience",
    width: 265,
    height: 81,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/alcaldia-caracoli.png",
    name: "Alcaldía de Caracolí",
    relation: "partner-experience",
    width: 200,
    height: 73,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/alcaldia-san-roque.png",
    name: "Alcaldía de San Roque",
    relation: "partner-experience",
    width: 200,
    height: 99,
    renderWidth: 105,
  },
  {
    src: "/brand/clients/hospital-san-pio-x.png",
    name: "E.S.E. Hospital San Pío X",
    relation: "partner-experience",
    width: 140,
    height: 113,
    renderWidth: 64,
  },
  {
    src: "/brand/clients/alcaldia-buritica.png",
    name: "Alcaldía de Buriticá",
    relation: "partner-experience",
    width: 420,
    height: 159,
    renderWidth: 140,
  },
  {
    /*
     * De Yalí se usa sólo el logotipo. Su lockup apila un escudo alto sobre el
     * nombre, y en la celda —que limita por altura— el nombre quedaba en cuatro
     * píxeles, ilegible. El logotipo solo conserva su tipografía y se lee.
     */
    src: "/brand/clients/alcaldia-yali.png",
    name: "Alcaldía de Yalí",
    relation: "partner-experience",
    width: 420,
    height: 84,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/alcaldia-santo-domingo.png",
    name: "Alcaldía de Santo Domingo",
    relation: "partner-experience",
    width: 270,
    height: 204,
    renderWidth: 90,
  },
  {
    src: "/brand/clients/alcaldia-el-bagre.png",
    name: "Alcaldía de El Bagre",
    relation: "partner-experience",
    width: 171,
    height: 204,
    renderWidth: 57,
  },
  {
    src: "/brand/clients/alcaldia-valparaiso.png",
    name: "Alcaldía de Valparaíso",
    relation: "partner-experience",
    width: 207,
    height: 204,
    renderWidth: 69,
  },
  {
    src: "/brand/clients/alcaldia-vegachi.png",
    name: "Alcaldía de Vegachí",
    relation: "partner-experience",
    width: 420,
    height: 201,
    renderWidth: 140,
  },
  {
    src: "/brand/clients/hospital-san-camilo-de-lelis.png",
    name: "E.S.E. Hospital San Camilo de Lelis",
    relation: "partner-experience",
    width: 211,
    height: 104,
    renderWidth: 138,
  },
  {
    src: "/brand/clients/esp-caracoli.png",
    name: "Empresa de Servicios Públicos de Caracolí",
    relation: "partner-experience",
    width: 204,
    height: 204,
    renderWidth: 68,
  },
  {
    src: "/brand/clients/ederem.png",
    name: "EDEREM",
    relation: "partner-experience",
    width: 189,
    height: 204,
    renderWidth: 63,
  },
  {
    src: "/brand/clients/inca-ingenieros.png",
    name: "INCA Ingenieros",
    relation: "partner-experience",
    width: 174,
    height: 204,
    renderWidth: 58,
  },
] as const;

/**
 * Las entidades acreditadas en el RUP se NOMBRAN, no se dibujan.
 *
 * Casi todas son heráldica municipal, y un escudo no sobrevive a la celda del
 * muro: a 52px de alto no se lee ni con el filtro de silueta ni en gris con
 * detalle —Santo Domingo sale literalmente como un círculo liso—, así que el
 * escudo no aporta identidad, sólo mancha. El nombre compuesto en la mono del
 * sitio se lee a cualquier tamaño y no depende de conseguir trece archivos que
 * además no existen todos en fuentes abiertas.
 *
 * `lugar` sale del propio certificado o del dominio oficial del municipio; se
 * omite cuando no consta, antes que suponerlo.
 */
const clientNames = [
  /*
   * La E.S.P. de Giraldo no tiene marca propia localizable. El único activo
   * gráfico de Giraldo que existe es el de la ALCALDÍA, y son dos personas
   * jurídicas distintas: el RUP acredita a la empresa de servicios públicos,
   * no al municipio. Usar uno por otro sería una atribución falsa, así que la
   * entidad se nombra.
   */
  { name: "Servicios Públicos de Giraldo", place: "E.S.P." },
  /*
   * Falta a propósito la tercera contraparte propia del RUP: su nombre está
   * vetado por una de las reglas de lenguaje público de
   * `scripts/verify-public-content.mjs`, que bloquea el build si aparece bajo
   * `src/`. Es una decisión ya registrada en el proyecto, no un olvido; para
   * incorporarla hay que levantar antes ese veto. (El nombre de la regla no se
   * escribe aquí: los literales de las reglas sólo pueden vivir en `scripts/`,
   * y `verify-deck-reasons` lo comprueba.)
   */
] as const;

function ClientNameCell({
  client,
  copy,
}: {
  client: (typeof clientNames)[number];
  copy: ExperienceRailCopy;
}) {
  return (
    <div
      className={`${styles.logoCell} ${styles.logoNamed}`}
      role="group"
      aria-label={`${copy.relationExperience}: ${client.name}${client.place ? `. ${client.place}` : ""}`}
    >
      <span className={styles.logoRelation}>{copy.relationExperience}</span>
      <span className={styles.logoName} aria-hidden="true">
        <strong>{client.name}</strong>
        {client.place ? <small>{client.place}</small> : null}
      </span>
    </div>
  );
}

function ClientLogoCell({
  client,
  copy,
}: {
  client: (typeof clientLogos)[number];
  copy: ExperienceRailCopy;
}) {
  /*
   * Todas las relaciones del muro son experiencia. Hubo una celda de aliado
   * —una sola—, y con ella se fue la bifurcación: un ternario cuya segunda
   * rama no puede ocurrir es código muerto, y el tipo lo delataba.
   */
  const relation = copy.relationExperience;
  const note = copy.clientNotes[client.src];

  return (
    <div
      className={styles.logoCell}
      role="group"
      aria-label={`${relation}: ${client.name}. ${note}`}
    >
      <span className={styles.logoRelation}>{relation}</span>
      <Image
        src={client.src}
        alt={client.name}
        width={client.width}
        height={client.height}
        sizes={`${client.renderWidth}px`}
      />
      <span className={styles.logoProof} aria-hidden="true">
        <strong>{client.name}</strong>
        <span>{note}</span>
      </span>
    </div>
  );
}

export function ExperienceRail({
  copy = homeCopyEs.experienceRail,
}: {
  copy?: ExperienceRailCopy;
}) {
  const featuredProducts = workProfiles.filter(
    (product) => product.attribution.state === "confirmed",
  );

  // La intro y el enlace al directorio son las dos celdas fijas del ribbon.
  const ribbonCells = featuredProducts.length + 2;
  const ribbonStyle = {
    "--ribbon-fill-3": String(fillSpan(ribbonCells, 3)),
    "--ribbon-fill-4": String(fillSpan(ribbonCells, 4)),
  } as CSSProperties;

  /*
   * El muro ya no se desplaza: se ven todas las relaciones a la vez, que es lo
   * que sostiene el argumento. El rótulo va al final y es el que absorbe las
   * columnas sobrantes, así el bloque cierra en rectángulo entre en la lista
   * quien entre.
   */
  const wallCells = clientLogos.length + clientNames.length + 1;
  const wallStyle = {
    "--wall-fill-2": String(fillSpan(wallCells, 2)),
    "--wall-fill-4": String(fillSpan(wallCells, 4)),
    "--wall-fill-6": String(fillSpan(wallCells, 6)),
  } as CSSProperties;

  return (
    <section
      id="trabajo-real"
      className={styles.experienceRail}
      aria-labelledby="proof-ribbon-title"
    >
      <div
        className={styles.proofRibbon}
        style={ribbonStyle}
        role="region"
        aria-label={copy.ribbonAriaLabel}
        tabIndex={0}
      >
        <div className={styles.proofRibbonIntro}>
          <p>{copy.ribbonEyebrow}</p>
          <h2 id="proof-ribbon-title">{copy.ribbonTitle}</h2>
        </div>
        {featuredProducts.map((product) => {
          const status = copy.productStatuses[product.slug] ?? product.status.label;
          const category = copy.productCategories[product.slug] ?? product.category;
          return (
            <Link
              className={styles.proofProduct}
              href={`/trabajo/${product.slug}`}
              key={product.name}
            >
              <>
                <span>{category}</span>
                <strong>{product.name}</strong>
                <small>{status}</small>
                <i aria-hidden="true">→</i>
              </>
            </Link>
          );
        })}
        <Link className={styles.proofProduct} href="/trabajo">
          <span>{copy.directoryEyebrow}</span>
          <strong>{copy.directoryName}</strong>
          <small>{workProfiles.length}{copy.directoryDetail}</small>
          <i aria-hidden="true">→</i>
        </Link>
      </div>
      <div
        className={styles.logoWall}
        style={wallStyle}
        role="region"
        aria-label={copy.logoWallAriaLabel}
      >
        {clientLogos.map((client) => (
          <ClientLogoCell client={client} copy={copy} key={client.src} />
        ))}
        {clientNames.map((client) => (
          <ClientNameCell client={client} copy={copy} key={client.name} />
        ))}
        <div className={`${styles.logoCell} ${styles.logoStatement}`}>
          <p>
            {copy.statementEyebrow}
            <strong>{copy.statementTitle}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

export function SectorPanel({
  copy = homeCopyEs.sectors,
  kind,
}: {
  copy?: SectorsCopy;
  kind: "public" | "private";
}) {
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
        <p>{isPublic ? copy.publicEyebrow : copy.privateEyebrow}</p>
        <h3>{isPublic ? copy.publicTitle : copy.privateTitle}</h3>
        <p>{isPublic ? copy.publicCopy : copy.privateCopy}</p>
        <ul>
          {(isPublic ? copy.publicItems : copy.privateItems).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <a href="#contacto">
          {isPublic ? copy.publicCta : copy.privateCta}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

export function ApiChapter({
  copy = homeCopyEs.apiChapter,
}: {
  copy?: ApiChapterCopy;
}) {
  return (
    <section id="integraciones" className={styles.apiChapter} aria-labelledby="api-chapter-title">
      <div className={styles.apiChapterCopy}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id="api-chapter-title">
          <span>{copy.titleLead}</span>
          <span>
            {copy.titleTail}<em>{copy.titleEmphasis}</em>
          </span>
        </h2>
        <p>{copy.lead}</p>
        <ul>
          {copy.capabilities.map(([title, detail]) => (
            <li key={title}>
              <i aria-hidden="true">✓</i>
              <span>
                <strong>{title}</strong>
                <small>{detail}</small>
              </span>
            </li>
          ))}
        </ul>
        <div className={styles.apiChapterActions}>
          <a className={styles.ghostButton} href="#contacto">
            {copy.primaryCta}
          </a>
          <a href="#fabrica-en-vivo">
            {copy.secondaryCta}
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
        <ProjectCreateDemo copy={copy} />
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

export function BuildNarrative({
  copy = homeCopyEs.build,
}: {
  copy?: BuildNarrativeCopy;
}) {
  return (
    <section id="como-trabajamos" className={styles.build} aria-labelledby="build-title">
      <div className={styles.buildIntro}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id="build-title">{copy.title}</h2>
        <p>{copy.lead}</p>
        <ul className={styles.buildChecklist}>
          {copy.deliveryChecks.map(([title, detail]) => (
            <li key={title}>
              <i aria-hidden="true">✓</i>
              <span>
                <strong>{title}</strong>
                <small>{detail}</small>
              </span>
            </li>
          ))}
        </ul>
        <div className={styles.buildActions}>
          <a className={styles.pillButton} href="#contacto">
            {copy.primaryCta}
          </a>
          <a className={styles.ghostButton} href="#fabrica-en-vivo">
            {copy.secondaryCta}
          </a>
        </div>
      </div>
      <FactoryRun copy={copy.factoryRun} />
      <div className={styles.capabilityAct}>
        <div className={styles.capabilityHeading}>
          <p className={styles.eyebrow}>{copy.capabilitiesEyebrow}</p>
          <h2>{copy.capabilitiesTitle}</h2>
        </div>
        <div className={styles.capabilityGrid}>
          {copy.capabilities.map(([number, title, detail]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

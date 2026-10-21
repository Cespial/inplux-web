import Image from "next/image";
import { partners } from "@/content/partners";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/v5/PageHero";
import {
  Band,
  Button,
  Chip,
  SectionHead,
  Timeline,
  statusTone,
  v5 as ui,
} from "@/components/v5/primitives";
import { StatRow, type Stat } from "@/components/v5/StatRow";
import { MOBILE_MEDIA } from "@/components/v5/HeroVideo.client";
import { VideoBand } from "@/components/v5/VideoBand";
import { clientWallCount } from "@/content/clients";
import type { HomeCopy } from "@/content/copy/types";
import { portfolio } from "@/content/home";
import { featuredPressStories, isOwnStory, type PressStory } from "@/content/press";
import { teamMembers } from "@/content/team";
import { workProfiles, type WorkProfile } from "@/content/work";
import { CAPTURA_ALTO, CAPTURA_ANCHO, workCaptures } from "@/content/work-captures";
import styles from "./home-v5.module.css";
import { NewsTab } from "./NewsTab";
import { SectorCards } from "./SectorCards";

/*
 * La portada v5 (octubre de 2026), sección por sección, compuesta con las
 * primitivas de `components/v5`. Cada sección lee su texto de `copy.v5` —o del
 * bloque que la portada ya tenía— y sus datos de `src/content`: aquí no se
 * escribe ninguna cifra, ningún estado ni ninguna fecha.
 */

type Lang = "es" | "en";

/** «5.447» en español, «5,447» en inglés. */
function localNumber(value: string | number, lang: Lang) {
  const text = String(value);
  return lang === "en" ? text.replace(/\./g, ",") : text;
}

function profile(slug: WorkProfile["slug"]) {
  const found = workProfiles.find((item) => item.slug === slug);
  if (!found) throw new Error(`Falta el perfil ${slug} en work.ts`);
  return found;
}

/** El directorio de productos en el idioma de la portada: `/trabajo` o `/en/work`. */
function workPath(copy: HomeCopy) {
  return copy.workPath ?? "/trabajo";
}

/**
 * La clase de la raíz de la portada (`<V5Page className>`): el aire entre
 * bandas y el ancho de los leads son de la portada, no del sistema.
 */
export const homeRhythm = styles.home;

/* ---------------------------------------------------------------- hero */

export function V5Hero({
  copy,
  primaryCta,
  lang,
}: {
  copy: HomeCopy;
  primaryCta: ReactNode;
  lang: Lang;
}) {
  const hero = copy.hero;
  return (
    <PageHero
      eyebrow={hero.eyebrow}
      titleLines={hero.titleLines}
      lead={hero.leadSentences[0]}
      leadMuted={hero.leadSentences[1]}
      media={{ kind: "video" }}
      overlay={<NewsTab lang={lang} />}
      actions={
        <>
          {primaryCta}
          <Button href="#clientes" variant="ghost">
            {copy.v5.heroSecondaryCta} <span aria-hidden="true">↓</span>
          </Button>
        </>
      }
    />
  );
}

/* ------------------------------------------- tesis: «Desde Medellín» */

/** El montaje «Desde Medellín, para Latinoamérica»: seis tomas de tres segundos. */
const LATAM_VIDEO = {
  poster: "/media/latam-poster.jpg",
  sources: [
    { src: "/media/latam-480.mp4", type: "video/mp4", media: MOBILE_MEDIA },
    { src: "/media/latam-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
    { src: "/media/latam-hevc.mp4", type: 'video/mp4; codecs="hvc1"' },
    { src: "/media/latam.mp4", type: "video/mp4" },
  ],
} as const;

/** La banda de tesis: el montaje, el título y una frase. Las cifras van en la evidencia. */
export function V5Latam({ copy }: { copy: HomeCopy }) {
  const latam = copy.v5.latam;
  return (
    <VideoBand
      id="latinoamerica"
      className={styles.thesis}
      eyebrow={latam.eyebrow}
      title={latam.title}
      lead={latam.lead}
      poster={LATAM_VIDEO.poster}
      sources={LATAM_VIDEO.sources}
    />
  );
}

/** Las tres cifras publicadas, cada una con el enlace a lo que la sustenta. */
function proofStats(copy: HomeCopy, lang: Lang): Stat[] {
  const laudos = profile("laudos");
  const stats = copy.heroStats;
  return [
    {
      who: laudos.name,
      value: localNumber(laudos.interface.primaryMetric, lang),
      unit: copy.v5.proof.laudosUnit,
      source: { href: `${workPath(copy)}/laudos`, label: copy.v5.proof.sourceLabel },
    },
    {
      value: String(portfolio.length),
      unit: stats.products.label,
      source: { href: workPath(copy), label: copy.v5.proof.portfolioSourceLabel },
    },
    {
      value: String(clientWallCount),
      unit: stats.organizations.label,
      source: { href: "#clientes", label: copy.v5.proof.wallSourceLabel },
    },
  ];
}

/* ---------------------------------------------------------------- proceso */

export function V5Process({ copy }: { copy: HomeCopy }) {
  const process = copy.v5.process;
  return (
    <Band id="como-trabajamos" className={styles.process} plus labelledBy="v5-process-title">
      <SectionHead
        id="v5-process-title"
        align="center"
        eyebrow={process.eyebrow}
        title={process.title}
      />
      {/* En la portada, cada fase con su entregable; el detalle está en /como-trabajamos. */}
      <Timeline
        phases={process.phases.map(({ title, deliverable }) => ({ title, deliverable }))}
        deliverableLabel={process.deliverableLabel}
      />
    </Band>
  );
}

/* -------------------------------------------------------------- productos */

/**
 * Los cinco productos en fichas iguales: captura chica de la página pública,
 * categoría y estado, nombre, una línea y el enlace. El detalle de cada uno
 * vive en su perfil de `/trabajo`; la portada sólo los presenta.
 */
const PRODUCT_ORDER = ["tribai", "gobia", "kelsen", "laudos", "porkia"] as const;

export function V5Products({ copy }: { copy: HomeCopy }) {
  const text = copy.v5.products;
  const rail = copy.experienceRail;
  const headline = (item: WorkProfile) => copy.products.headlines[item.slug] ?? item.headline;
  const category = (item: WorkProfile) => rail.productCategories[item.slug] ?? item.category;
  const status = (item: WorkProfile) => rail.productStatuses[item.slug] ?? item.status.label;

  return (
    <Band id="productos" tone="light" labelledBy="v5-products-title">
      <SectionHead id="v5-products-title" eyebrow={text.eyebrow} title={text.title} lead={text.lead} />
      <ul className={styles.productGrid} data-reveal-children="">
        {PRODUCT_ORDER.map(profile).map((item) => (
          <li key={item.slug}>
            <Link className={styles.product} href={`${workPath(copy)}/${item.slug}`} id={`p-${item.slug}`}>
              <span className={styles.productMedia}>
                <Image
                  src={workCaptures[item.slug].src}
                  alt=""
                  width={CAPTURA_ANCHO}
                  height={CAPTURA_ALTO}
                  sizes="(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 18vw"
                />
              </span>
              <span className={styles.productMeta}>
                {category(item)}
                <Chip dot tone={statusTone(status(item))}>
                  {status(item)}
                </Chip>
              </span>
              <h3>{item.name}</h3>
              <p>{headline(item)}</p>
              <span className={styles.productCta}>
                {text.openCta} <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className={styles.allLink}>
        <Link href={workPath(copy)}>
          {text.allCta} <span aria-hidden="true">→</span>
        </Link>
      </p>
    </Band>
  );
}

/* ---------------------------------------------------------------- sectores */

export function V5Sectors({ copy }: { copy: HomeCopy }) {
  const sectors = copy.v5.sectors;
  return (
    <Band id="sectores" className={styles.sectors} labelledBy="v5-sectors-title">
      <p className={ui.eyebrow}>{sectors.eyebrow}</p>
      <h2 className={`${ui.d2} ${styles.sectorsTitle}`} id="v5-sectors-title">
        {sectors.title}
      </h2>
      <SectorCards items={sectors.items} />
    </Band>
  );
}

/* ------------------------------------------------- auditoría y tecnología */

const AUDIT_ICONS = [
  <svg key="fuente" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M15 3v4h4M9 12h7M9 16h5" />
  </svg>,
  <svg key="traza" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="5" cy="6" r="2" />
    <circle cx="19" cy="12" r="2" />
    <circle cx="5" cy="18" r="2" />
    <path d="M7 6h4l6 6M7 18h4l6-6" />
  </svg>,
  <svg key="acceso" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
  </svg>,
];

/**
 * La pila técnica con sus logotipos. Entran sólo desde `partners.json`, donde
 * cada marca registra el origen del archivo y su permiso (lo vigila
 * `scripts/partners-gate.mjs`). Los archivos van tal cual: sin redibujar ni
 * recolorear; el énfasis al pasar el cursor es la opacidad de la celda.
 */

export function V5Audit({ copy, lang }: { copy: HomeCopy; lang: Lang }) {
  const audit = copy.v5.audit;
  return (
    <Band id="auditoria" tone="light" className={styles.evidence} labelledBy="v5-audit-title">
      <SectionHead id="v5-audit-title" align="center" eyebrow={audit.eyebrow} title={audit.title} />
      <div className={styles.evidenceStats}>
        <StatRow id="casos" ariaLabel={copy.heroStats.ariaLabel} items={proofStats(copy, lang)} />
      </div>
      <ul className={styles.audit}>
        {audit.items.map((item, index) => (
          <li key={item.title}>
            {AUDIT_ICONS[index]}
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </li>
        ))}
      </ul>
      <div className={styles.tech} id="tecnologia">
        <p className={ui.eyebrow}>{audit.techEyebrow}</p>
        <ul>
          {partners.map((partner) => (
            <li key={partner.id} data-logo={partner.id}>
              <Image
                src={partner.file}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                unoptimized
                style={{ height: "var(--tech-logo-h)", width: "auto" }}
              />
            </li>
          ))}
        </ul>
        <p className={`${ui.small} ${styles.techNote}`}>{audit.techNote}</p>
      </div>
    </Band>
  );
}

/* ------------------------------------------------------------------ prensa */

function PressFigure({ story, copy }: { story: PressStory; copy: HomeCopy }) {
  if (story.visualKind === "clients" && story.logos) {
    return (
      <figure className={styles.logosFigure}>
        {story.logos.map((logo) => (
          <Image key={logo.src} src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />
        ))}
      </figure>
    );
  }
  if (story.image) {
    const alt = copy.press.imageAlts[story.slug] ?? story.imageAlt ?? "";
    const figureClass = story.image.endsWith(".svg")
      ? styles.markFigure
      : story.visualKind === "cover"
        ? styles.coverFigure
        : undefined;
    return (
      <figure className={figureClass}>
        <Image src={story.image} alt={alt} fill sizes="(max-width: 760px) 92vw, 34vw" />
      </figure>
    );
  }
  return (
    <figure>
      <span className={ui.ph}>{copy.press.visualSignals[story.slug] ?? story.visualSignal}</span>
    </figure>
  );
}

export function V5Press({ copy }: { copy: HomeCopy }) {
  const text = copy.v5.press;
  const press = copy.press;
  const featured = featuredPressStories();
  const visual = featured.filter((story) => story.image || story.visualKind === "clients");
  // Tres piezas con imagen o logos y, debajo, el resto de las destacadas en lista.
  const top = [...visual, ...featured.filter((story) => !visual.includes(story))].slice(0, 3);
  const rest = featured.filter((story) => !top.includes(story)).slice(0, 4);
  const format = (story: PressStory) => press.formats[story.format] ?? story.format;
  const date = (story: PressStory) => press.publishedLabels[story.slug] ?? story.publishedLabel;
  const titleLang = press.storyLang ?? undefined;
  const target = (story: PressStory) => (isOwnStory(story) ? {} : { target: "_blank", rel: "noreferrer" });

  return (
    <Band id="prensa" tone="light" labelledBy="v5-press-title">
      <SectionHead
        id="v5-press-title"
        eyebrow={text.eyebrow}
        title={text.title}
        link={{ href: "/prensa", label: text.archiveCta }}
      />
      <div className={styles.pressGrid}>
        {top.map((story, index) => (
          <article className={styles.story} key={story.slug}>
            <PressFigure story={story} copy={copy} />
            <div>
              <div className={styles.storyMeta}>
                <span>{story.outlet}</span>
                <span>
                  {format(story)} · {date(story)}
                </span>
              </div>
              <h3 lang={titleLang}>{story.title}</h3>
              {index === 0 ? (
                <p className={styles.summary}>{press.summaries[story.slug] ?? story.summary}</p>
              ) : null}
              <a className={styles.more} href={story.href} {...target(story)}>
                {text.readCta} <span aria-hidden="true">{isOwnStory(story) ? "→" : "↗"}</span>
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.storyList}>
        {rest.map((story) => (
          <a href={story.href} {...target(story)} key={story.slug}>
            <span>{story.outlet}</span>
            <strong lang={titleLang}>{story.title}</strong>
          </a>
        ))}
      </div>
    </Band>
  );
}

/* ------------------------------------------------------------------ equipo */

export function V5Team({ copy }: { copy: HomeCopy }) {
  const text = copy.v5.team;
  const team = copy.team;
  return (
    <section className={`${ui.band} ${ui.light}`} id="equipo" aria-labelledby="v5-team-title">
      <div className={`${ui.wrap} ${styles.teamGrid}`}>
        <div className={styles.teamHead}>
          <p className={ui.eyebrow}>{text.eyebrow}</p>
          <h2 className={ui.d2} id="v5-team-title">{text.title}</h2>
        </div>
        {teamMembers.map((member) => (
          <article className={styles.person} key={member.slug}>
            <Link href={`/equipo/${member.slug}`} className={styles.personPhoto}>
              <Image
                src={member.photo.src}
                alt={member.name}
                width={member.photo.width}
                height={member.photo.height}
                sizes="(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 26vw"
              />
              <span className={styles.caption}>
                <span className={styles.role}>{team.roles[member.slug] ?? member.jobTitle}</span>
                <strong>{member.name}</strong>
              </span>
            </Link>
            <p>{team.bios[member.slug] ?? member.bio}</p>
            <p className={styles.links}>
              <Link href={`/equipo/${member.slug}`}>
                {team.profileCta} <span aria-hidden="true">→</span>
              </Link>
              <a href={member.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

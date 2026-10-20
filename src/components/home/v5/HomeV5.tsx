import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/v5/PageHero";
import {
  Band,
  Button,
  Card,
  CardGrid,
  Chip,
  FeatureSplit,
  Placeholder,
  SectionHead,
  Shot,
  Timeline,
  cx,
  statusTone,
  v5 as ui,
} from "@/components/v5/primitives";
import { StatRow, type Stat } from "@/components/v5/StatRow";
import { VideoBand } from "@/components/v5/VideoBand";
import { clientWallCount } from "@/content/clients";
import type { HomeCopy } from "@/content/copy/types";
import { portfolio } from "@/content/home";
import { featuredPressStories, type PressStory } from "@/content/press";
import { teamMembers } from "@/content/team";
import { workProfiles, type WorkProfile } from "@/content/work";
import { CAPTURA_ALTO, CAPTURA_ANCHO, workCaptures } from "@/content/work-captures";
import styles from "./home-v5.module.css";
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

/* ---------------------------------------------------------------- hero */

export function V5Hero({ copy, primaryCta }: { copy: HomeCopy; primaryCta: ReactNode }) {
  const hero = copy.hero;
  return (
    <PageHero
      eyebrow={hero.eyebrow}
      titleLines={hero.titleLines}
      lead={hero.leadSentences[0]}
      leadMuted={hero.leadSentences[1]}
      media={{ kind: "video" }}
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

/* ------------------------------------- Latinoamérica: video y cifras */

/** El montaje «Desde Medellín, para Latinoamérica»: seis tomas de tres segundos. */
const LATAM_VIDEO = {
  poster: "/media/latam-poster.jpg",
  sources: [
    { src: "/media/latam-720.mp4", type: "video/mp4", media: "(max-width: 760px)" },
    { src: "/media/latam-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
    { src: "/media/latam-hevc.mp4", type: 'video/mp4; codecs="hvc1"' },
    { src: "/media/latam.mp4", type: "video/mp4" },
  ],
} as const;

export function V5Latam({ copy, lang }: { copy: HomeCopy; lang: Lang }) {
  const laudos = profile("laudos");
  const stats = copy.heroStats;
  const proof: Stat[] = [
    {
      who: laudos.name,
      value: localNumber(laudos.interface.primaryMetric, lang),
      unit: copy.v5.proof.laudosUnit,
      source: { href: "/trabajo/laudos", label: copy.v5.proof.sourceLabel },
    },
    {
      value: String(portfolio.length),
      unit: stats.products.label,
      source: { href: "/trabajo", label: copy.v5.proof.portfolioSourceLabel },
    },
    {
      value: String(clientWallCount),
      unit: stats.organizations.label,
      source: { href: "#clientes", label: copy.v5.proof.wallSourceLabel },
    },
  ];

  const latam = copy.v5.latam;
  return (
    <VideoBand
      id="latinoamerica"
      eyebrow={latam.eyebrow}
      title={latam.title}
      lead={latam.lead}
      poster={LATAM_VIDEO.poster}
      sources={LATAM_VIDEO.sources}
    >
      <StatRow id="casos" ariaLabel={stats.ariaLabel} items={proof} />
    </VideoBand>
  );
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

function TribaiTerminal({ copy }: { copy: HomeCopy["v5"]["products"] }) {
  return (
    <div className={styles.term} role="img" aria-label={copy.terminalAriaLabel}>
      <div className={styles.termBar}>
        <i>
          <span />
          <span />
          <span />
        </i>
        <p>tribai-mcp</p>
        <span>200 OK</span>
      </div>
      <pre>
        <span className={`${styles.ln} ${styles.c}`}># {copy.terminalCall}</span>
        <span className={styles.ln}>
          <span className={styles.k}>tools/call</span> <span className={styles.u}>vigencia_articulo</span>
        </span>
        <span className={styles.ln}>
          {"{ "}
          <span className={styles.s}>&quot;articulo&quot;</span>: <span className={styles.s}>&quot;240&quot;</span>,{" "}
          <span className={styles.s}>&quot;norma&quot;</span>: <span className={styles.s}>&quot;Estatuto Tributario&quot;</span>
          {" }"}
        </span>
        <span className={styles.ln}> </span>
        <span className={`${styles.ln} ${styles.c}`}># {copy.terminalAnswer}</span>
        <span className={styles.ln}>{"{"}</span>
        <span className={styles.ln}>
          {"  "}
          <span className={styles.s}>&quot;titulo&quot;</span>:{" "}
          <span className={styles.s}>&quot;Tarifa general para personas jurídicas&quot;</span>,
        </span>
        <span className={`${styles.ln} ${styles.hl}`}>
          {"  "}
          <span className={styles.s}>&quot;tarifa&quot;</span>: <span className={styles.n}>0.35</span>,
        </span>
        <span className={`${styles.ln} ${styles.hl}`}>
          {"  "}
          <span className={styles.s}>&quot;modificado_por&quot;</span>:{" "}
          <span className={styles.s}>&quot;Ley 2277 de 2022, art. 10&quot;</span>,
        </span>
        <span className={styles.ln}>
          {"  "}
          <span className={styles.s}>&quot;vigente&quot;</span>: <span className={styles.n}>true</span>,
        </span>
        <span className={styles.ln}>
          {"  "}
          <span className={styles.s}>&quot;fuente&quot;</span>:{" "}
          <span className={styles.u}>&quot;secretariasenado.gov.co/…/estatuto_tributario&quot;</span>
        </span>
        <span className={styles.ln}>{"}"}</span>
      </pre>
    </div>
  );
}

export function V5Products({ copy }: { copy: HomeCopy }) {
  const text = copy.v5.products;
  const rail = copy.experienceRail;
  const headline = (item: WorkProfile) => copy.products.headlines[item.slug] ?? item.headline;
  const category = (item: WorkProfile) => rail.productCategories[item.slug] ?? item.category;
  const status = (item: WorkProfile) => rail.productStatuses[item.slug] ?? item.status.label;

  const tribai = profile("tribai");
  const gobia = profile("gobia");
  const minis = (["kelsen", "laudos", "porkia"] as const).map(profile);
  const inDevelopment = portfolio.filter((item) => item.stage === "En desarrollo");

  return (
    <Band id="productos" labelledBy="v5-products-title">
      <SectionHead id="v5-products-title" eyebrow={text.eyebrow} title={text.title} lead={text.lead} />

      <FeatureSplit
        id="p-tribai"
        kicker={
          <>
            {category(tribai)}{" "}
            <Chip dot>{status(tribai)}</Chip>
          </>
        }
        title={tribai.name}
        lead={
          <>
            {headline(tribai)} {text.tribaiLead}
          </>
        }
        actions={
          <>
            <Button href="/trabajo/tribai" variant="primary">
              {text.tribaiCta}
            </Button>
            <Chip>{text.tribaiTag}</Chip>
          </>
        }
        media={<TribaiTerminal copy={text} />}
      />

      <FeatureSplit
        id="p-gobia"
        reverse
        kicker={
          <>
            {category(gobia)}{" "}
            <Chip dot tone={statusTone(status(gobia))}>
              {status(gobia)}
            </Chip>
          </>
        }
        title={gobia.name}
        lead={headline(gobia)}
        actions={
          <Button href="/trabajo/gobia" variant="ghost">
            {text.openCta} <span aria-hidden="true">→</span>
          </Button>
        }
        media={
          <Shot>
            <Image
              src={workCaptures.gobia.src}
              alt={workCaptures.gobia.alt}
              width={CAPTURA_ANCHO}
              height={CAPTURA_ALTO}
              sizes="(max-width: 760px) 92vw, 52vw"
            />
          </Shot>
        }
      />

      <p className={`${ui.eyebrow} ${styles.moreTitle}`}>{text.moreLabel}</p>
      <CardGrid>
        {minis.map((item) => (
          <Card
            key={item.slug}
            id={`p-${item.slug}`}
            href={`/trabajo/${item.slug}`}
            media={
              <Image
                src={workCaptures[item.slug].src}
                alt=""
                width={CAPTURA_ANCHO}
                height={CAPTURA_ALTO}
                sizes="(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 22vw"
              />
            }
            meta={
              <>
                {category(item)} ·{" "}
                <span className={cx(statusTone(status(item)) === "pilot" && ui.pilot)}>{status(item)}</span>
              </>
            }
            title={item.name}
            text={headline(item)}
          />
        ))}
        {inDevelopment.map((item) => (
          <Card
            key={item.name}
            media={<Placeholder>{text.inDevelopment}</Placeholder>}
            meta={
              <>
                {item.category} · {text.inDevelopment}
              </>
            }
            title={item.name}
            text={item.description}
          />
        ))}
      </CardGrid>
      <p className={styles.allLink}>
        <Link href="/trabajo">
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
 * La pila técnica se NOMBRA, no se dibuja: los logotipos de terceros sólo
 * entran por `partners.json` con su permiso registrado (lo vigila
 * `scripts/partners-gate.mjs`). Nombrar la tecnología con la que se construye
 * es uso descriptivo, y la nota lo dice. Revisado el 20-oct-2026: AWS y
 * Google Cloud solo admiten texto plano a quien no es socio formal; Anthropic
 * y Vercel piden permiso escrito y prohíben recolorear. El tratamiento de muro
 * de logos es tipográfico (`.tech` en home-v5.module.css).
 */
const TECH_STACK = ["Anthropic", "OpenAI", "AWS", "Google Cloud", "Vercel"] as const;

export function V5Audit({ copy }: { copy: HomeCopy }) {
  const audit = copy.v5.audit;
  return (
    <Band id="auditoria" tone="light" labelledBy="v5-audit-title">
      <SectionHead id="v5-audit-title" align="center" eyebrow={audit.eyebrow} title={audit.title} />
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
          {TECH_STACK.map((name) => (
            <li key={name}>{name}</li>
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
    return (
      <figure className={story.image.endsWith(".svg") ? styles.markFigure : undefined}>
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
  const top = [...visual, ...featured.filter((story) => !visual.includes(story))].slice(0, 3);
  const format = (story: PressStory) => press.formats[story.format] ?? story.format;
  const date = (story: PressStory) => press.publishedLabels[story.slug] ?? story.publishedLabel;
  const titleLang = press.storyLang ?? undefined;

  return (
    <Band id="prensa" tone="light" labelledBy="v5-press-title">
      <SectionHead
        id="v5-press-title"
        eyebrow={text.eyebrow}
        title={text.title}
        link={{ href: "/prensa", label: text.archiveCta }}
      />
      <div className={styles.pressGrid}>
        {top.map((story) => (
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
              <a className={styles.more} href={story.href} target="_blank" rel="noreferrer">
                {text.readCta} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
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

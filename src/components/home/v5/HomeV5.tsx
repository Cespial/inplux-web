import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { formatCopy } from "@/content/copy/format";
import type { HomeCopy } from "@/content/copy/types";
import { portfolio } from "@/content/home";
import { featuredPressStories, type PressStory } from "@/content/press";
import { teamMembers } from "@/content/team";
import { workProfiles, type WorkProfile } from "@/content/work";
import { CAPTURA_ALTO, CAPTURA_ANCHO, workCaptures } from "@/content/work-captures";
import { clientWallCount } from "../HomeSections";
import { HeroVideo } from "./HeroVideo.client";
import styles from "./v5.module.css";

/*
 * La portada v5 (octubre de 2026), sección por sección. Cada componente lee su
 * texto de `copy.v5` —o del bloque que la portada ya tenía— y sus datos de
 * `src/content`: aquí no se escribe ninguna cifra, ningún estado ni ninguna
 * fecha. Las únicas cifras de la página son las que el sitio ya publica.
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

function statusTone(status: string) {
  return /piloto|beta|pilot/i.test(status) ? styles.pilot : "";
}

/* ---------------------------------------------------------------- hero */

export function V5Hero({ copy, primaryCta }: { copy: HomeCopy; primaryCta: ReactNode }) {
  const hero = copy.hero;
  return (
    <div className={styles.hero} data-header-theme="dark">
      <HeroVideo />
      <div className={`${styles.wrap} ${styles.heroInner}`}>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 className={styles.d1}>
          <span>{hero.titleLines[0]}</span>
          <span>{hero.titleLines[1]}</span>
        </h1>
        <p className={styles.lead}>
          {hero.leadSentences[0]} <span className={styles.muted}>{hero.leadSentences[1]}</span>
        </p>
        <div className={styles.actions}>
          {primaryCta}
          <a className={`${styles.btn} ${styles.ghost}`} href="#clientes">
            {copy.v5.heroSecondaryCta} <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- tesis y cifras */

export function V5Thesis({ copy, lang }: { copy: HomeCopy; lang: Lang }) {
  const laudos = profile("laudos");
  const [awards, council, coverage] = laudos.interface.items;
  const stats = copy.heroStats;
  const proof: {
    who: string | null;
    value: string;
    unit: string;
    detail: string;
    href: string;
    source: string;
  }[] = [
    {
      who: laudos.name,
      value: localNumber(laudos.interface.primaryMetric, lang),
      unit: copy.v5.proof.laudosUnit,
      detail: formatCopy(copy.v5.proof.laudosDetail, {
        laudos: localNumber(awards?.value ?? "", lang),
        consejo: localNumber(council?.value ?? "", lang),
        range: coverage?.value ?? "",
      }),
      href: "/trabajo/laudos",
      source: copy.v5.proof.sourceLabel,
    },
    {
      who: null,
      value: String(portfolio.length),
      unit: stats.products.label,
      detail: formatCopy(stats.products.detail, {
        documented: String(workProfiles.length),
        inDevelopment: String(portfolio.filter((item) => item.stage === "En desarrollo").length),
      }),
      href: "/trabajo",
      source: copy.v5.proof.portfolioSourceLabel,
    },
    {
      who: null,
      value: String(clientWallCount),
      unit: stats.organizations.label,
      detail: stats.organizations.detail,
      href: "#clientes",
      source: copy.v5.proof.wallSourceLabel,
    },
  ];

  return (
    <section className={`${styles.band} ${styles.thesis}`} id="tesis" aria-labelledby="v5-thesis-title">
      <div className={styles.wrap}>
        <p className={styles.eyebrow}>{copy.thesis.eyebrow}</p>
        <h2 className={`${styles.d1} ${styles.thesisTitle}`} id="v5-thesis-title">
          {copy.thesis.lead} <em>{copy.thesis.emphasis}</em>
        </h2>
        <div className={styles.proof} id="casos">
          <p className={styles.proofTitle}>{copy.v5.proof.title}</p>
          <ul className={styles.cases} aria-label={stats.ariaLabel}>
            {proof.map((item) => (
              <li className={styles.case} key={item.href}>
                {item.who ? <p className={styles.who}>{item.who}</p> : null}
                <strong>{item.value}</strong>
                <p className={styles.unit}>{item.unit}</p>
                <p>{item.detail}</p>
                <p className={styles.src}>
                  {item.href.startsWith("#") ? (
                    <a href={item.href}>{item.source}</a>
                  ) : (
                    <Link href={item.href}>{item.source}</Link>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- proceso */

export function V5Process({ copy }: { copy: HomeCopy }) {
  const process = copy.v5.process;
  return (
    <section className={`${styles.band} ${styles.process}`} id="como-trabajamos" aria-labelledby="v5-process-title">
      <Plus />
      <div className={styles.wrap}>
        <div className={styles.headC}>
          <p className={styles.eyebrow}>{process.eyebrow}</p>
          <h2 className={styles.d2} id="v5-process-title">{process.title}</h2>
          <p className={styles.lead}>{process.lead}</p>
        </div>
        <ol className={styles.timeline}>
          {process.phases.map((phase, index) => (
            <li key={phase.title}>
              <b>{`0${index + 1}`}</b>
              <h3>{phase.title}</h3>
              <p>{phase.detail}</p>
              <p className={styles.deliverable}>
                <span>{process.deliverableLabel}</span>
                {phase.deliverable}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Plus() {
  return (
    <>
      <span className={`${styles.plus} ${styles.tl}`} aria-hidden="true">+</span>
      <span className={`${styles.plus} ${styles.tr}`} aria-hidden="true">+</span>
      <span className={`${styles.plus} ${styles.bl}`} aria-hidden="true">+</span>
      <span className={`${styles.plus} ${styles.br}`} aria-hidden="true">+</span>
    </>
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
  const description = (item: WorkProfile) => copy.products.descriptions[item.slug] ?? item.description;
  const category = (item: WorkProfile) => rail.productCategories[item.slug] ?? item.category;
  const status = (item: WorkProfile) => rail.productStatuses[item.slug] ?? item.status.label;

  const tribai = profile("tribai");
  const gobia = profile("gobia");
  const minis = (["kelsen", "laudos", "porkia"] as const).map(profile);
  const inDevelopment = portfolio.filter((item) => item.stage === "En desarrollo");

  return (
    <section className={styles.band} id="productos" aria-labelledby="v5-products-title">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>{text.eyebrow}</p>
            <h2 className={styles.d2} id="v5-products-title">{text.title}</h2>
          </div>
          <p className={styles.lead}>{text.lead}</p>
        </div>

        <article className={styles.feat} id="p-tribai">
          <div className={styles.featText}>
            <p className={styles.kicker}>
              {category(tribai)}{" "}
              <span className={styles.chip}>
                <i />
                {status(tribai)}
              </span>
            </p>
            <h3 className={`${styles.d2} ${styles.featTitle}`}>{tribai.name}</h3>
            <p className={styles.lead}>
              {headline(tribai)} {text.tribaiLead}
            </p>
            <div className={styles.featActions}>
              <Link className={`${styles.btn} ${styles.primary}`} href="/trabajo/tribai">
                {text.tribaiCta}
              </Link>
              <span className={styles.chip}>{text.tribaiTag}</span>
            </div>
          </div>
          <TribaiTerminal copy={text} />
        </article>

        <article className={`${styles.feat} ${styles.rev}`} id="p-gobia">
          <figure className={styles.shot}>
            <Image
              src={workCaptures.gobia.src}
              alt={workCaptures.gobia.alt}
              width={CAPTURA_ANCHO}
              height={CAPTURA_ALTO}
              sizes="(max-width: 760px) 92vw, 52vw"
            />
          </figure>
          <div className={styles.featText}>
            <p className={styles.kicker}>
              {category(gobia)}{" "}
              <span className={`${styles.chip} ${statusTone(status(gobia))}`}>
                <i />
                {status(gobia)}
              </span>
            </p>
            <h3 className={`${styles.d2} ${styles.featTitle}`}>{gobia.name}</h3>
            <p className={styles.lead}>
              {headline(gobia)} {description(gobia)}
            </p>
            <div className={styles.featActions}>
              <Link className={`${styles.btn} ${styles.ghost}`} href="/trabajo/gobia">
                {text.openCta} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </article>

        <p className={`${styles.eyebrow} ${styles.moreTitle}`}>{text.moreLabel}</p>
        <div className={styles.minis}>
          {minis.map((item) => (
            <Link className={styles.mini} href={`/trabajo/${item.slug}`} key={item.slug} id={`p-${item.slug}`}>
              <Image
                src={workCaptures[item.slug].src}
                alt=""
                width={CAPTURA_ANCHO}
                height={CAPTURA_ALTO}
                sizes="(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 22vw"
              />
              <div>
                <p className={styles.meta}>
                  {category(item)} · <span className={statusTone(status(item))}>{status(item)}</span>
                </p>
                <h4>{item.name}</h4>
                <p>{headline(item)}</p>
              </div>
            </Link>
          ))}
          {inDevelopment.map((item) => (
            <div className={`${styles.mini} ${styles.dev}`} key={item.name}>
              <span className={styles.ph}>{text.inDevelopment}</span>
              <div>
                <p className={styles.meta}>
                  {item.category} · {text.inDevelopment}
                </p>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.allLink}>
          <Link href="/trabajo">
            {text.allCta} <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- sectores */

export function V5Sectors({ copy }: { copy: HomeCopy }) {
  const sectors = copy.v5.sectors;
  return (
    <section className={`${styles.band} ${styles.sectors}`} id="sectores" aria-labelledby="v5-sectors-title">
      <div className={styles.wrap}>
        <p className={styles.eyebrow}>{sectors.eyebrow}</p>
        <h2 className={`${styles.d2} ${styles.sectorsTitle}`} id="v5-sectors-title">
          {sectors.title}
        </h2>
        <ul className={styles.rows}>
          {sectors.items.map((item, index) => (
            <li key={item.title}>
              <Link href={item.href}>
                <span className={styles.n}>{`0${index + 1}`}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <small>{item.tag}</small>
                <i aria-hidden="true">→</i>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
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
  <svg key="datos" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
];

/**
 * La pila técnica se NOMBRA, no se dibuja: los logotipos de terceros sólo
 * entran por `partners.json` con su permiso registrado (lo vigila
 * `scripts/partners-gate.mjs`). Nombrar la tecnología con la que se construye
 * es uso descriptivo, y la nota lo dice.
 */
const TECH_STACK = ["Anthropic", "OpenAI", "AWS", "Google Cloud", "Vercel"] as const;

export function V5Audit({ copy }: { copy: HomeCopy }) {
  const audit = copy.v5.audit;
  return (
    <section className={`${styles.band} ${styles.light}`} id="auditoria" aria-labelledby="v5-audit-title">
      <div className={styles.wrap}>
        <div className={styles.headC}>
          <p className={styles.eyebrow}>{audit.eyebrow}</p>
          <h2 className={styles.d2} id="v5-audit-title">{audit.title}</h2>
          <p className={styles.lead}>{audit.lead}</p>
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
          <p className={styles.eyebrow}>{audit.techEyebrow}</p>
          <ul>
            {TECH_STACK.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <p className={styles.small}>{audit.techNote}</p>
        </div>
      </div>
    </section>
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
      <span className={styles.ph}>{copy.press.visualSignals[story.slug] ?? story.visualSignal}</span>
    </figure>
  );
}

export function V5Press({ copy }: { copy: HomeCopy }) {
  const text = copy.v5.press;
  const press = copy.press;
  const featured = featuredPressStories();
  const visual = featured.filter((story) => story.image || story.visualKind === "clients");
  const top = [...visual, ...featured.filter((story) => !visual.includes(story))].slice(0, 3);
  const rest = featured.filter((story) => !top.includes(story)).slice(0, 4);
  const format = (story: PressStory) => press.formats[story.format] ?? story.format;
  const date = (story: PressStory) => press.publishedLabels[story.slug] ?? story.publishedLabel;
  const titleLang = press.storyLang ?? undefined;

  return (
    <section className={`${styles.band} ${styles.light}`} id="prensa" aria-labelledby="v5-press-title">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>{text.eyebrow}</p>
            <h2 className={styles.d2} id="v5-press-title">{text.title}</h2>
          </div>
          <p className={styles.headLink}>
            <Link href="/prensa">
              {text.archiveCta} <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
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
                <a className={styles.more} href={story.href} target="_blank" rel="noreferrer">
                  {text.readCta} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.storyList}>
          {rest.map((story) => (
            <a href={story.href} target="_blank" rel="noreferrer" key={story.slug}>
              <span>{story.outlet}</span>
              <strong lang={titleLang}>{story.title}</strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ equipo */

export function V5Team({ copy }: { copy: HomeCopy }) {
  const text = copy.v5.team;
  const team = copy.team;
  return (
    <section className={`${styles.band} ${styles.light}`} id="equipo" aria-labelledby="v5-team-title">
      <div className={`${styles.wrap} ${styles.teamGrid}`}>
        <div className={styles.teamHead}>
          <p className={styles.eyebrow}>{text.eyebrow}</p>
          <h2 className={styles.d2} id="v5-team-title">{text.title}</h2>
          <p className={styles.lead}>{text.lead}</p>
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
            <ul>
              {member.credentials.slice(0, 3).map((credential) => (
                <li key={credential}>{credential}</li>
              ))}
            </ul>
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

export { styles as v5Styles };

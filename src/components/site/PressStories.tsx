import Image from "next/image";
import Link from "next/link";
import { homeCopyEs } from "@/content/copy/es";
import { formatCopy } from "@/content/copy/format";
import type { PressCopy } from "@/content/copy/types";
import {
  pressCategories,
  pressStories,
  type PressCategory,
  type PressStory,
} from "@/content/press";
import styles from "./PressStories.module.css";

type VisualVariant = "home" | "row" | "paper";

/**
 * El archivo editorial se publica en español. En la home inglesa traducimos las
 * etiquetas y los resúmenes —que son nuestros— y dejamos el titular original,
 * marcado con su idioma, porque es el nombre publicado de la pieza.
 */
const esPress = homeCopyEs.press;

function externalLabel(story: PressStory, copy: PressCopy) {
  return formatCopy(copy.externalLabel, {
    title: story.title,
    outlet: story.outlet,
  });
}

function StoryMeta({
  story,
  copy = esPress,
}: {
  story: PressStory;
  copy?: PressCopy;
}) {
  return (
    <span className={styles.meta}>
      <span>{copy.categories[story.category] ?? story.category}</span>
      <span aria-hidden="true">/</span>
      <span>{copy.formats[story.format] ?? story.format}</span>
      <span aria-hidden="true">/</span>
      <span>{story.outlet}</span>
      <time dateTime={story.publishedAt}>
        {copy.publishedLabels[story.slug] ?? story.publishedLabel}
      </time>
    </span>
  );
}

function StorySourceContext({
  story,
  copy = esPress,
}: {
  story: PressStory;
  copy?: PressCopy;
}) {
  if (!story.byline && !story.editorialStatus) return null;

  return (
    <span className={styles.sourceContext}>
      {story.byline ? (
        <span>{copy.bylines[story.byline] ?? story.byline}</span>
      ) : null}
      {story.editorialStatus ? (
        <span>
          {copy.editorialStatuses[story.editorialStatus] ?? story.editorialStatus}
        </span>
      ) : null}
    </span>
  );
}

function PressStoryVisual({
  story,
  variant = "home",
  eager = false,
  copy = esPress,
}: {
  story: PressStory;
  variant?: VisualVariant;
  eager?: boolean;
  copy?: PressCopy;
}) {
  const className = `${styles.visual} ${styles[`${variant}Visual`]}`;
  const signal = copy.visualSignals[story.slug] ?? story.visualSignal;
  const imageAlt = copy.imageAlts[story.slug] ?? story.imageAlt ?? "";

  if (story.visualKind === "cover" && story.image) {
    return (
      <span className={`${className} ${styles.coverVisual}`}>
        <Image
          src={story.image}
          alt={imageAlt}
          fill
          sizes={
            variant === "row"
              ? "(min-width: 1100px) 36vw, (min-width: 760px) 44vw, 92vw"
              : "(min-width: 1100px) 44vw, (min-width: 760px) 62vw, 84vw"
          }
          loading={eager ? "eager" : undefined}
          fetchPriority={eager ? "high" : undefined}
        />
        <span className={styles.visualShade} aria-hidden="true" />
        <span className={styles.visualSignal}>{signal}</span>
      </span>
    );
  }

  if (story.visualKind === "mark" && story.image) {
    return (
      <span className={`${className} ${styles.markVisual}`}>
        <span className={styles.dotGrid} aria-hidden="true" />
        <Image
          className={styles.mark}
          src={story.image}
          alt={imageAlt}
          width={104}
          height={104}
        />
        <span className={styles.markName}>{copy.markName}</span>
        <span className={styles.visualSignal}>{signal}</span>
      </span>
    );
  }

  if (story.visualKind === "stat") {
    return (
      <span className={`${className} ${styles.statVisual}`}>
        <span className={styles.dotGrid} aria-hidden="true" />
        <span className={styles.visualEyebrow}>{copy.statEyebrow}</span>
        <strong>{story.stat ?? "—"}</strong>
        <span className={styles.statCopy}>{copy.statCopy}</span>
        <span className={styles.visualSignal}>{signal}</span>
      </span>
    );
  }

  if (story.visualKind === "panel") {
    return (
      <span className={`${className} ${styles.panelVisual}`}>
        <span className={styles.dotGrid} aria-hidden="true" />
        <span className={styles.panelTop}>
          <span>{copy.panelScenario}</span>
          <span>{copy.panelPlace}</span>
        </span>
        <span className={styles.stage} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <strong>{story.visualCode ?? copy.panelLive}</strong>
        <span className={styles.visualSignal}>{signal}</span>
      </span>
    );
  }

  if (story.visualKind === "paper") {
    return (
      <span className={`${className} ${styles.paperVisual}`}>
        <span className={styles.paperRules} aria-hidden="true" />
        <span className={styles.paperTop}>
          <span>{copy.paperEyebrow}</span>
          <span>{story.outlet}</span>
        </span>
        <strong>{story.visualCode ?? copy.paperCode}</strong>
        <span className={styles.paperTitle}>{signal}</span>
        <span className={styles.paperFoot}>{copy.paperFoot}</span>
      </span>
    );
  }

  return (
    <span className={`${className} ${styles.archiveVisual}`}>
      <span className={styles.dotGrid} aria-hidden="true" />
      <span className={styles.visualEyebrow}>
        {story.visualCode ?? copy.formats[story.format] ?? story.format}
      </span>
      <strong>{copy.archiveIdeas}</strong>
      <span className={styles.visualSignal}>{signal}</span>
    </span>
  );
}

function HomeStoryList({
  stories,
  copy = esPress,
}: {
  stories: readonly PressStory[];
  copy?: PressCopy;
}) {
  return (
    <ul className={styles.homeList}>
      {stories.map((story, index) => (
        <li className={styles.homeItem} key={story.slug}>
          <article className={styles.homeCard}>
            <a
              className={styles.homeCardLink}
              href={story.href}
              target="_blank"
              rel="noreferrer"
              aria-label={externalLabel(story, copy)}
            >
              <PressStoryVisual story={story} eager={index === 0} copy={copy} />
              <StoryMeta story={story} copy={copy} />
              <StorySourceContext story={story} copy={copy} />
              <h3 lang={copy.storyLang ?? undefined}>{story.title}</h3>
              <p>{copy.summaries[story.slug] ?? story.summary}</p>
              <span className={styles.storyAction}>
                {copy.sourceAction}
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          </article>
        </li>
      ))}
    </ul>
  );
}

function EditorialRows({ stories }: { stories: readonly PressStory[] }) {
  return (
    <ol className={styles.editorialRows}>
      {stories.map((story, index) => (
        <li className={styles.editorialRow} key={story.slug}>
          <a
            href={story.href}
            target="_blank"
            rel="noreferrer"
            aria-label={externalLabel(story, esPress)}
          >
            <span className={styles.rowIndex} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <PressStoryVisual story={story} variant="row" eager={index === 0} />
            <span className={styles.rowCopy}>
              <StoryMeta story={story} />
              <StorySourceContext story={story} />
              <strong className={styles.rowTitle}>{story.title}</strong>
              <span className={styles.rowSummary}>{story.summary}</span>
              <span className={styles.storyAction}>
                Ver publicación original
                <span aria-hidden="true">↗</span>
              </span>
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

function ResearchGrid({ stories }: { stories: readonly PressStory[] }) {
  return (
    <ul className={styles.researchGrid}>
      {stories.map((story) => (
        <li className={styles.researchItem} key={story.slug}>
          <article>
            <a
              href={story.href}
              target="_blank"
              rel="noreferrer"
              aria-label={externalLabel(story, esPress)}
            >
              <PressStoryVisual story={story} variant="paper" />
              <StoryMeta story={story} />
              <h3>{story.title}</h3>
              {story.sourceTitle ? (
                <span className={styles.sourceTitle} lang="en">
                  {story.sourceTitle}
                </span>
              ) : null}
              <StorySourceContext story={story} />
              <p>{story.summary}</p>
              <span className={styles.storyAction}>
                Leer investigación
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          </article>
        </li>
      ))}
    </ul>
  );
}

function SignedIdeasIndex({ stories }: { stories: readonly PressStory[] }) {
  return (
    <ol className={styles.ideasIndex}>
      {stories.map((story, index) => (
        <li className={styles.ideaItem} key={story.slug}>
          <a
            href={story.href}
            target="_blank"
            rel="noreferrer"
            aria-label={externalLabel(story, esPress)}
          >
            <span className={styles.ideaCode}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <time dateTime={story.publishedAt}>{story.publishedLabel}</time>
            </span>
            <span className={styles.ideaMain}>
              <span className={styles.ideaAttribution}>
                {story.format} por {story.byline ?? "el equipo"} / {story.outlet}
              </span>
              <strong>{story.title}</strong>
              {story.editorialStatus ? (
                <span className={styles.ideaStatus}>{story.editorialStatus}</span>
              ) : null}
            </span>
            <span className={styles.ideaSummary}>{story.summary}</span>
            <span className={styles.ideaArrow} aria-hidden="true">
              ↗
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

function CategoryContents({
  category,
  stories,
}: {
  category: PressCategory;
  stories: readonly PressStory[];
}) {
  if (category === "Investigación") {
    return <ResearchGrid stories={stories} />;
  }

  if (category === "Ideas firmadas") {
    return <SignedIdeasIndex stories={stories} />;
  }

  return <EditorialRows stories={stories} />;
}

export function FactoryPressStories({
  copy = esPress,
}: {
  copy?: PressCopy;
}) {
  const featuredStories = pressStories.filter((story) => story.featured).slice(0, 3);
  const archiveHrefLang = copy.storyLang ?? undefined;

  return (
    <section
      id="prensa"
      className={styles.homeSection}
      data-header-theme="dark"
      aria-labelledby="factory-press-title"
    >
      <div className={styles.homeHeading}>
        <div>
          <p>{copy.eyebrow}</p>
          <h2 id="factory-press-title">
            {copy.titleLead}<em>{copy.titleEmphasis}</em>
          </h2>
          {copy.storyNote ? (
            <p className={styles.homeHeadingNote}>{copy.storyNote}</p>
          ) : null}
        </div>
        <Link
          className={styles.archiveLink}
          href="/prensa"
          hrefLang={archiveHrefLang}
        >
          {`${copy.archiveLink} `}<span aria-hidden="true">→</span>
        </Link>
      </div>

      <HomeStoryList stories={featuredStories} copy={copy} />

      <Link
        className={styles.archiveLinkBottom}
        href="/prensa"
        hrefLang={archiveHrefLang}
      >
        {`${copy.archiveLink} `}<span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

export function PressArchive() {
  const sortedStories = [...pressStories].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const groupedStories = pressCategories.map((category) => ({
    ...category,
    stories: sortedStories.filter((story) => story.category === category.label),
  }));

  return (
    <section className={styles.archiveSection} aria-labelledby="press-archive-title">
      <div className={styles.archiveHeading}>
        <div>
          <p>Archivo con fuente · {String(pressStories.length).padStart(2, "0")}</p>
          <h2 id="press-archive-title">
            Cada pieza ocupa su lugar. Cada fuente queda <em>a la vista.</em>
          </h2>
        </div>
        <p className={styles.archiveIntro}>
          El archivo distingue las notas y selecciones externas de los escenarios
          públicos, los trabajos sin revisión por pares y las columnas firmadas por
          el equipo. Verificamos el enlace, la fecha y el título; no atribuimos a la
          fuente una validación que no declara.
        </p>
      </div>

      <nav className={styles.categoryNav} aria-label="Secciones del archivo">
        <p>Explorar por categoría</p>
        <ul>
          {groupedStories.map((category) => (
            <li key={category.id}>
              <a href={`#${category.id}`}>
                <span>{category.label}</span>
                <span>{String(category.stories.length).padStart(2, "0")}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.categoryStack}>
        {groupedStories.map((category, categoryIndex) => (
          <section
            className={styles.categorySection}
            id={category.id}
            key={category.id}
            aria-labelledby={`${category.id}-title`}
          >
            <header className={styles.categoryHeading}>
              <span className={styles.categoryNumber} aria-hidden="true">
                {String(categoryIndex + 1).padStart(2, "0")}
              </span>
              <div>
                <p>{String(category.stories.length).padStart(2, "0")} piezas</p>
                <h3 id={`${category.id}-title`}>{category.label}</h3>
              </div>
              <p>{category.description}</p>
            </header>
            <CategoryContents
              category={category.label}
              stories={category.stories}
            />
          </section>
        ))}
      </div>

      <aside className={styles.pressRoom} aria-labelledby="press-room-title">
        <div className={styles.pressRoomIntro}>
          <p>Recursos / contacto</p>
          <h3 id="press-room-title">Sala de prensa</h3>
          <p>
            INPLUX es una fábrica de software que convierte problemas complejos en
            productos, operaciones y sistemas digitales listos para trabajar.
          </p>
        </div>

        <div className={styles.spokespeople}>
          <p>Voceros y temas</p>
          <dl>
            <div>
              <dt>Jaime Alonso Cano Pino</dt>
              <dd>Negocio y tributación</dd>
            </div>
            <div>
              <dt>Cristian Espinal Maya</dt>
              <dd>Tecnología, producto e IA</dd>
            </div>
          </dl>
        </div>

        <div className={styles.pressRoomLinks}>
          <Link href="/marca">
            Recursos de marca <span aria-hidden="true">→</span>
          </Link>
          <a href="mailto:gerencia@inplux.co?subject=Solicitud%20de%20prensa%20-%20INPLUX">
            gerencia@inplux.co <span aria-hidden="true">↗</span>
          </a>
        </div>
      </aside>
    </section>
  );
}

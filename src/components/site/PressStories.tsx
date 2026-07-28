import Image from "next/image";
import Link from "next/link";
import {
  pressCategories,
  pressStories,
  type PressCategory,
  type PressStory,
} from "@/content/press";
import styles from "./PressStories.module.css";

type VisualVariant = "home" | "row" | "paper";

function externalLabel(story: PressStory) {
  return `${story.title} — ${story.outlet} (abre en una pestaña nueva)`;
}

function StoryMeta({ story }: { story: PressStory }) {
  return (
    <span className={styles.meta}>
      <span>{story.category}</span>
      <span aria-hidden="true">/</span>
      <span>{story.format}</span>
      <span aria-hidden="true">/</span>
      <span>{story.outlet}</span>
      <time dateTime={story.publishedAt}>{story.publishedLabel}</time>
    </span>
  );
}

function StorySourceContext({ story }: { story: PressStory }) {
  if (!story.byline && !story.editorialStatus) return null;

  return (
    <span className={styles.sourceContext}>
      {story.byline ? <span>{story.byline}</span> : null}
      {story.editorialStatus ? <span>{story.editorialStatus}</span> : null}
    </span>
  );
}

function PressStoryVisual({
  story,
  variant = "home",
  eager = false,
}: {
  story: PressStory;
  variant?: VisualVariant;
  eager?: boolean;
}) {
  const className = `${styles.visual} ${styles[`${variant}Visual`]}`;

  if (story.visualKind === "cover" && story.image) {
    return (
      <span className={`${className} ${styles.coverVisual}`}>
        <Image
          src={story.image}
          alt={story.imageAlt ?? ""}
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
        <span className={styles.visualSignal}>{story.visualSignal}</span>
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
          alt={story.imageAlt ?? ""}
          width={104}
          height={104}
        />
        <span className={styles.markName}>THE COMMONPLACE</span>
        <span className={styles.visualSignal}>{story.visualSignal}</span>
      </span>
    );
  }

  if (story.visualKind === "stat") {
    return (
      <span className={`${className} ${styles.statVisual}`}>
        <span className={styles.dotGrid} aria-hidden="true" />
        <span className={styles.visualEyebrow}>Hallazgo / Colombia</span>
        <strong>{story.stat ?? "—"}</strong>
        <span className={styles.statCopy}>
          empleados formales deciden a qué hora trabajan
        </span>
        <span className={styles.visualSignal}>{story.visualSignal}</span>
      </span>
    );
  }

  if (story.visualKind === "panel") {
    return (
      <span className={`${className} ${styles.panelVisual}`}>
        <span className={styles.dotGrid} aria-hidden="true" />
        <span className={styles.panelTop}>
          <span>Escenario público</span>
          <span>Medellín / CO</span>
        </span>
        <span className={styles.stage} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <strong>{story.visualCode ?? "EN VIVO"}</strong>
        <span className={styles.visualSignal}>{story.visualSignal}</span>
      </span>
    );
  }

  if (story.visualKind === "paper") {
    return (
      <span className={`${className} ${styles.paperVisual}`}>
        <span className={styles.paperRules} aria-hidden="true" />
        <span className={styles.paperTop}>
          <span>INPLUX / RESEARCH</span>
          <span>{story.outlet}</span>
        </span>
        <strong>{story.visualCode ?? "OPEN PAPER"}</strong>
        <span className={styles.paperTitle}>{story.visualSignal}</span>
        <span className={styles.paperFoot}>Leer · contrastar · citar</span>
      </span>
    );
  }

  return (
    <span className={`${className} ${styles.archiveVisual}`}>
      <span className={styles.dotGrid} aria-hidden="true" />
      <span className={styles.visualEyebrow}>{story.visualCode ?? story.format}</span>
      <strong>IDEAS</strong>
      <span className={styles.visualSignal}>{story.visualSignal}</span>
    </span>
  );
}

function HomeStoryList({ stories }: { stories: readonly PressStory[] }) {
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
              aria-label={externalLabel(story)}
            >
              <PressStoryVisual story={story} eager={index === 0} />
              <StoryMeta story={story} />
              <StorySourceContext story={story} />
              <h3>{story.title}</h3>
              <p>{story.summary}</p>
              <span className={styles.storyAction}>
                Consultar fuente
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
            aria-label={externalLabel(story)}
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
              aria-label={externalLabel(story)}
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
            aria-label={externalLabel(story)}
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

export function FactoryPressStories() {
  const featuredStories = pressStories.filter((story) => story.featured).slice(0, 3);

  return (
    <section
      id="prensa"
      className={styles.homeSection}
      data-header-theme="dark"
      aria-labelledby="factory-press-title"
    >
      <div className={styles.homeHeading}>
        <div>
          <p>06 / PRENSA Y CONVERSACIONES</p>
          <h2 id="factory-press-title">
            El trabajo también entra en <em>conversación.</em>
          </h2>
        </div>
        <Link className={styles.archiveLink} href="/prensa">
          Ver el archivo <span aria-hidden="true">→</span>
        </Link>
      </div>

      <HomeStoryList stories={featuredStories} />

      <Link className={styles.archiveLinkBottom} href="/prensa">
        Ver el archivo <span aria-hidden="true">→</span>
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

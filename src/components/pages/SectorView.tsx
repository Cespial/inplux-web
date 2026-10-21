import Image from "next/image";
import { SectorSaludDiagram } from "@/components/sectors/SectorSaludDiagram";
import { ContactLink, type ContactSource } from "@/components/site/ContactLink";
import { PageHero } from "@/components/v5/PageHero";
import {
  Band,
  Button,
  Card,
  CardGrid,
  SectionHead,
  buttonClass,
  cx,
  statusTone,
  v5 as ui,
} from "@/components/v5/primitives";
import type { Lang } from "@/content/i18n";
import { sectorPageUi } from "@/content/page-ui";
import type { SectorProfile, SectorSlug } from "@/content/sectores";
import type { WorkProfile } from "@/content/work";
import { CAPTURA_ALTO, CAPTURA_ANCHO, workCaptures } from "@/content/work-captures";
import { formatShortDate } from "@/content/work-format";
import type { Crumb } from "@/lib/breadcrumbs";
import styles from "./Sector.module.css";

/**
 * Una página de sector, en las dos lenguas: `/sectores/[slug]` y
 * `/en/sectors/[slug]`. La página pone metadatos, JSON-LD y cascarón; esto
 * pinta lo que va dentro de `<main>`.
 *
 * El orden: imagen a sangre con el nombre del sector y un lead «IA para X, Y y
 * Z.»; un reclamo con tres promesas de dos tiempos; las piezas con estado
 * donde las hay; los productos propios que aplican; la norma; y una sola
 * invitación al final. Tres disparadores de contacto: cabecera, hero y cierre.
 */

/* Un diagrama es opcional: hoy solo salud tiene uno dibujado en código. */
const diagrams: Partial<Record<SectorSlug, (props: { lang?: Lang }) => React.JSX.Element>> = {
  salud: SectorSaludDiagram,
};

export function SectorView({
  lang,
  sector,
  products,
  statusByName,
  statusLabel,
  crumbs,
  workHref,
  productBasePath,
  contactHref,
  heroSource,
  closingSource,
}: {
  lang: Lang;
  /** El sector ya en su idioma; `slug` es siempre el español (estilos y diagrama). */
  sector: SectorProfile;
  products: readonly WorkProfile[];
  /** Estado publicado por producto, por nombre (`workDirectory`). */
  statusByName: Record<string, string>;
  /** Etiqueta visible de cada estado de pieza; la clave española gobierna el estilo. */
  statusLabel: (status: string) => string;
  crumbs: readonly Crumb[];
  workHref: string;
  productBasePath: string;
  contactHref: string;
  heroSource: ContactSource;
  closingSource: ContactSource;
}) {
  const t = sectorPageUi[lang];
  const Diagram = diagrams[sector.slug];

  return (
    <>
      <section id="inicio" aria-labelledby="sector-title">
        <PageHero
          className={styles.hero}
          eyebrow={sector.eyebrow}
          title={<span id="sector-title">{sector.name}</span>}
          lead={sector.lead}
          leadMuted={sector.audience}
          crumbs={crumbs}
          crumbsLabel={t.crumbsLabel}
          media={{
            kind: "image",
            src: sector.hero.image,
            alt: sector.hero.alt,
            width: 2400,
            height: 1600,
            priority: true,
          }}
          actions={
            <>
              <ContactLink
                className={buttonClass("primary")}
                fallbackHref={contactHref}
                source={heroSource}
              >
                {t.heroCta}
              </ContactLink>
              <Button href="#promesas">
                {t.promisesCta} <span aria-hidden="true">↓</span>
              </Button>
            </>
          }
        />
      </section>

      <Band id="promesas" tone="light" labelledBy="claim-title" className={styles.claim}>
        <SectionHead
          id="claim-title"
          eyebrow={t.claimEyebrow(sector.name)}
          title={sector.claim}
          lead={sector.intro}
        />
        <ol className={styles.promises} aria-label={t.promisesLabel}>
          {sector.promises.map((promise, index) => (
            <li key={promise.label} style={{ "--i": index } as React.CSSProperties}>
              <span className={styles.promiseLabel}>{promise.label}</span>
              <p className={styles.promiseLines} aria-hidden="true">
                <span>{promise.lineA}</span>
                <span>{promise.lineB}</span>
              </p>
              <h3 className={styles.visuallyHidden}>{`${promise.lineA} ${promise.lineB}`}</h3>
            </li>
          ))}
        </ol>
      </Band>

      {Diagram || sector.capabilities ? (
        <Band id="capacidades" labelledBy="capabilities-title" className={styles.pieces}>
          <SectionHead
            id="capabilities-title"
            eyebrow={t.piecesEyebrow}
            title={
              <>
                {t.piecesTitleLead}<em>{t.piecesTitleEmphasis}</em>
              </>
            }
            lead={t.piecesLead}
          />
          {Diagram ? (
            <div className={styles.diagram}>
              <Diagram lang={lang} />
            </div>
          ) : null}
          {sector.capabilities ? (
            <ol className={styles.capabilities}>
              {sector.capabilities.map((capability) => (
                <li key={capability.code} data-status={capability.status}>
                  <p className={styles.capabilityMeta}>
                    <span>{capability.code}</span>
                    <b title={t.statusTitles[capability.status]}>{statusLabel(capability.status)}</b>
                  </p>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                  {capability.href ? (
                    <a href={capability.href} target="_blank" rel="noreferrer">
                      {capability.hrefLabel ?? capability.href} <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : null}
        </Band>
      ) : null}

      {products.length > 0 ? (
        <Band id="productos" labelledBy="products-title" className={styles.products}>
          <SectionHead
            id="products-title"
            eyebrow={t.productsEyebrow}
            title={
              <>
                {t.productsTitleLead}<em>{t.productsTitleEmphasis}</em>
              </>
            }
            link={{ href: workHref, label: t.productsLink }}
          />
          <CardGrid className={styles.productGrid}>
            {products.map((product) => (
              <Card
                key={product.slug}
                id={`p-${product.slug}`}
                href={`${productBasePath}/${product.slug}`}
                media={
                  <Image
                    src={workCaptures[product.slug].src}
                    alt=""
                    width={CAPTURA_ANCHO}
                    height={CAPTURA_ALTO}
                    sizes="(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 30vw"
                  />
                }
                meta={
                  <>
                    {product.category} ·{" "}
                    <span
                      className={cx(
                        statusTone(statusByName[product.name] ?? product.status.label) === "pilot" && ui.pilot,
                      )}
                    >
                      {statusByName[product.name] ?? product.status.label}
                    </span>
                  </>
                }
                title={product.name}
                text={product.headline}
              />
            ))}
          </CardGrid>
        </Band>
      ) : null}

      {sector.framework ? (
        <Band id="norma" labelledBy="framework-title" className={styles.framework}>
          <SectionHead
            id="framework-title"
            eyebrow={t.frameworkEyebrow}
            title={
              <>
                {t.frameworkTitleLead}<em>{t.frameworkTitleEmphasis}</em>
              </>
            }
            lead={t.frameworkLead}
          />
          <ul className={styles.frameworkList}>
            {sector.framework.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  hrefLang={lang === "en" ? "es" : undefined}
                >
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                  <i aria-hidden="true">↗</i>
                </a>
              </li>
            ))}
          </ul>
        </Band>
      ) : null}

      <section id="contacto" className={styles.cta} aria-labelledby="cta-title">
        <div className={`${ui.wrap} ${styles.ctaInner}`}>
          <p className={ui.eyebrow}>{t.closingEyebrow}</p>
          <h2 className={ui.d2} id="cta-title">
            {t.closingTitle}
          </h2>
          <p className={ui.lead}>{sector.closing.lead}</p>
          <div className={ui.actions}>
            <ContactLink
              className={buttonClass("primary")}
              fallbackHref={contactHref}
              source={closingSource}
            >
              {t.closingCta}
            </ContactLink>
            <Button href="mailto:gerencia@inplux.co">gerencia@inplux.co</Button>
          </div>
          <p className={ui.small}>{t.reviewed(formatShortDate(sector.verifiedAt, lang))}</p>
        </div>
      </section>
    </>
  );
}

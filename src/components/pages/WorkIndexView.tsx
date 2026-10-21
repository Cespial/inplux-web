import Link from "next/link";
import { ContactLink, type ContactSource } from "@/components/site/ContactLink";
import { PageHero } from "@/components/v5/PageHero";
import {
  Band,
  Button,
  Card,
  CardGrid,
  Chip,
  CloseBand,
  MailRow,
  Placeholder,
  buttonClass,
  statusTone,
  v5,
} from "@/components/v5/primitives";
import type { Lang } from "@/content/i18n";
import { workIndexUi } from "@/content/page-ui";
import type { WorkProfile } from "@/content/work";
import type { Crumb } from "@/lib/breadcrumbs";
import styles from "./WorkIndex.module.css";

/**
 * El directorio de productos, en las dos lenguas: `/trabajo` y `/en/work`.
 * La página pone los metadatos, el JSON-LD y el cascarón; esto pinta lo que va
 * dentro de `<main>`. Los perfiles llegan ya en su idioma y en el orden
 * editorial.
 */
export type InDevelopmentItem = {
  name: string;
  category: string;
  stage: string;
  description: string;
};

export function WorkIndexView({
  lang,
  profiles,
  inDevelopment,
  crumbs,
  basePath,
  contactHref,
  contactSource,
  aboutHref,
  closingFootnote,
}: {
  lang: Lang;
  profiles: readonly WorkProfile[];
  inDevelopment: readonly InDevelopmentItem[];
  crumbs: readonly Crumb[];
  /** `/trabajo` o `/en/work`. */
  basePath: string;
  contactHref: string;
  contactSource: ContactSource;
  aboutHref: string;
  closingFootnote?: string;
}) {
  const ui = workIndexUi[lang];
  return (
    <>
      <PageHero
        id="inicio"
        eyebrow={ui.eyebrow}
        crumbs={crumbs}
        crumbsLabel={ui.crumbsLabel}
        title={ui.title}
        lead={ui.lead}
        leadMuted={ui.leadMuted}
        actions={
          <>
            <Button href="#p-tribai" variant="primary">
              {ui.productsCta}
            </Button>
            <Button href="#contacto" variant="ghost">
              {ui.projectCta} <span aria-hidden="true">↓</span>
            </Button>
          </>
        }
      />

      <Band id="productos" labelledBy="products-statement" className={styles.statement}>
        <p className={styles.statementText} id="products-statement">
          {ui.statementLead}<em>{ui.statementEmphasis}</em>{ui.statementTail}
        </p>

        {/* Un índice: nombre, una línea y el enlace. El detalle vive en cada ficha. */}
        <ol className={styles.index}>
          {profiles.map((profile) => (
            <li key={profile.slug} id={`p-${profile.slug}`} className={styles.row}>
              <span className={styles.rowNumber} aria-hidden="true">{profile.number}</span>
              <div className={styles.rowBody}>
                <p className={v5.kicker}>
                  {profile.category}{" "}
                  <Chip dot tone={statusTone(profile.status.label)}>
                    {profile.status.label}
                  </Chip>
                </p>
                <h3 className={styles.rowTitle}>
                  <Link href={`${basePath}/${profile.slug}`}>{profile.name}</Link>
                </h3>
                <p className={styles.rowLine}>{profile.shortDescription}</p>
              </div>
              <Link href={`${basePath}/${profile.slug}`} className={styles.rowLink}>
                {ui.rowLink(profile.name)} <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>

        {inDevelopment.length > 0 ? (
          <>
            <p className={`${v5.eyebrow} ${styles.moreTitle}`}>{ui.inDevelopment}</p>
            <CardGrid className={styles.devGrid}>
              {inDevelopment.map((item) => (
                <Card
                  key={item.name}
                  id={`p-${item.name.toLowerCase()}`}
                  media={<Placeholder>{ui.inDevelopment}</Placeholder>}
                  meta={`${item.category} · ${item.stage}`}
                  title={item.name}
                  text={item.description}
                />
              ))}
            </CardGrid>
          </>
        ) : null}
      </Band>

      <CloseBand
        id="contacto"
        titleId="closing-title"
        eyebrow={ui.closingEyebrow}
        title={
          <>
            {ui.closingTitleLead}<em>{ui.closingTitleEmphasis}</em>
          </>
        }
        lead={ui.closingLead}
        footnote={closingFootnote}
      >
        <MailRow>
          <ContactLink
            className={buttonClass("primary")}
            fallbackHref={contactHref}
            source={contactSource}
          >
            {ui.closingCta}
          </ContactLink>
          <Button href={aboutHref} variant="ghost">
            {ui.aboutCta} <span aria-hidden="true">→</span>
          </Button>
        </MailRow>
      </CloseBand>
    </>
  );
}

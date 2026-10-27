import { ContactLink, type ContactSource } from "@/components/site/ContactLink";
import { PageHero } from "@/components/v5/PageHero";
import {
  Band,
  Button,
  Chip,
  CloseBand,
  MailRow,
  SectionHead,
  buttonClass,
  statusTone,
} from "@/components/v5/primitives";
import { CapabilityRail } from "@/components/work/CapabilityRail.client";
import { ProductInterface } from "@/components/work/ProductInterface.client";
import { productMockups } from "@/components/work/ProductMockups";
import Image from "next/image";
import type { Lang } from "@/content/i18n";
import { productProfileUi } from "@/content/page-ui";
import type { WorkProfile } from "@/content/work";
import { appScreens } from "@/content/work-captures";
import { formatLongDateEn, formatShortDate } from "@/content/work-format";
import type { Crumb } from "@/lib/breadcrumbs";
import styles from "./ProductProfile.module.css";

/**
 * La ficha de un producto, en las dos lenguas: `/trabajo/[slug]` y
 * `/en/work/[slug]`. La página pone metadatos, JSON-LD y cascarón; esto pinta
 * lo que va dentro de `<main>`. El perfil llega ya en su idioma.
 */
export function ProductProfileView({
  lang,
  profile,
  nextProfile,
  crumbs,
  basePath,
  contactHref,
  contactSource,
  closingFootnote,
}: {
  lang: Lang;
  profile: WorkProfile;
  nextProfile: WorkProfile;
  crumbs: readonly Crumb[];
  /** `/trabajo` o `/en/work`. */
  basePath: string;
  contactHref: string;
  contactSource: ContactSource;
  closingFootnote?: string;
}) {
  const ui = productProfileUi[lang];
  const Mockup = productMockups[profile.slug];
  const screens = appScreens[profile.slug] ?? [];
  const declaration = profile.sources.length === 0 ? profile.declaration : undefined;

  return (
    <>
      <PageHero
        id="inicio"
        crumbs={crumbs}
        crumbsLabel={ui.crumbsLabel}
        eyebrow={`${profile.number} · ${profile.category}`}
        title={profile.headline}
        lead={profile.description}
        aside={<Mockup profile={profile} animate lang={lang} />}
        actions={
          <>
            {/* Sin `href` no hay nada público que abrir: no se pinta botón. */}
            {profile.access.href ? (
              <Button href={profile.access.href} variant="primary" external>
                {profile.access.label}
              </Button>
            ) : null}
            <Chip dot tone={statusTone(profile.status.label)}>
              {profile.status.label}
            </Chip>
          </>
        }
      />

      <Band labelledBy="facts-title" className={styles.stage}>
        <h2 id="facts-title" className={styles.visuallyHidden}>
          {ui.factsTitle(profile.name)}
        </h2>
        <dl className={styles.facts}>
          <div>
            <dt>{ui.status}</dt>
            <dd>{profile.status.label}</dd>
            <p>{profile.status.detail}</p>
          </div>
          <div>
            <dt>{ui.access}</dt>
            <dd>{profile.access.label}</dd>
            {profile.access.href ? null : <p>{profile.access.detail}</p>}
          </div>
          <div data-attribution={profile.attribution.state}>
            <dt>{ui.attribution}</dt>
            <dd>{profile.attribution.label}</dd>
            <p>{profile.attribution.statement}</p>
          </div>
        </dl>
        <div className={styles.stageFrame}>
          <ProductInterface profile={profile} lang={lang} />
        </div>
      </Band>

      <Band labelledBy="capabilities-title" className={styles.capabilities}>
        <SectionHead
          id="capabilities-title"
          eyebrow={ui.capabilitiesEyebrow}
          title={ui.capabilitiesTitle(profile.name)}
        />
        <CapabilityRail
          items={profile.capabilities}
          ariaLabel={ui.capabilitiesLabel(profile.name)}
          lang={lang}
        />
      </Band>

      {screens.length > 0 ? (
        <Band labelledBy="screens-title" className={styles.screens}>
          <SectionHead
            id="screens-title"
            eyebrow={ui.screensEyebrow}
            title={ui.screensTitle(profile.name)}
            lead={ui.screensLead(
              lang === "en"
                ? formatLongDateEn(profile.declaration?.declaredAt ?? "")
                : formatShortDate(profile.declaration?.declaredAt ?? ""),
            )}
          />
          <ol className={styles.screenRail} aria-label={ui.screensLabel(profile.name)}>
            {screens.map((screen) => (
              <li key={screen.src}>
                <Image
                  src={screen.src}
                  alt={screen.alt[lang]}
                  width={screen.width}
                  height={screen.height}
                  sizes="(max-width: 760px) 62vw, (max-width: 1100px) 30vw, 15vw"
                />
              </li>
            ))}
          </ol>
        </Band>
      ) : null}

      {profile.partners.length > 0 ? (
        <Band labelledBy="partners-title">
          <SectionHead
            id="partners-title"
            eyebrow={ui.partnersEyebrow}
            title={ui.partnersTitle}
          />
          <ol className={styles.partners}>
            {profile.partners.map((partner, index) => (
              <li key={partner.name}>
                <span>{`0${index + 1}`}</span>
                <strong>{partner.name}</strong>
                <p>{partner.role}</p>
              </li>
            ))}
          </ol>
        </Band>
      ) : null}

      <Band tone="light" labelledBy="evidence-title">
        <SectionHead
          id="evidence-title"
          eyebrow={ui.evidenceEyebrow}
          title={ui.evidenceTitle}
          lead={declaration ? ui.evidenceDeclaredLead : ui.evidenceLead}
        />
        <div className={styles.tableWrap}>
          <table className={styles.evidence} aria-labelledby="evidence-title">
            <thead>
              <tr>
                <th scope="col">{ui.evidenceSource}</th>
                <th scope="col">{ui.evidenceSupports}</th>
                <th scope="col">{declaration ? ui.evidenceDeclared : ui.evidenceVerified}</th>
              </tr>
            </thead>
            <tbody>
              {profile.sources.map((source, index) => (
                <tr key={source.url}>
                  <th scope="row">
                    <small aria-hidden="true">{`0${index + 1}`}</small>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.label} <span aria-hidden="true">↗</span>
                    </a>
                  </th>
                  <td>{source.supports}</td>
                  <td>
                    <time dateTime={source.verifiedAt}>{formatShortDate(source.verifiedAt, lang)}</time>
                  </td>
                </tr>
              ))}
              {/* Sin fuentes públicas, la única fila es la declaración de
                  INPLUX: sin enlace, porque no hay URL que citar. */}
              {declaration ? (
                <tr>
                  <th scope="row">
                    <small aria-hidden="true">01</small>
                    {declaration.label}
                    <small>{ui.evidenceDeclaredBy}</small>
                  </th>
                  <td>{declaration.supports}</td>
                  <td>
                    <time dateTime={declaration.declaredAt}>{formatShortDate(declaration.declaredAt, lang)}</time>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <p className={styles.note}>{ui.evidenceNote}</p>
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
          <Button href={`${basePath}/${nextProfile.slug}`} variant="ghost">
            {ui.next(nextProfile.name)} <span aria-hidden="true">→</span>
          </Button>
        </MailRow>
      </CloseBand>
    </>
  );
}

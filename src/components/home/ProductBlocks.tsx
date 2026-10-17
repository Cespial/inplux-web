import Image from "next/image";
import Link from "next/link";
import { homeCopyEs } from "@/content/copy/es";
import { formatCopy } from "@/content/copy/format";
import type { ExperienceRailCopy, ProductBlocksCopy } from "@/content/copy/types";
import { portfolio } from "@/content/home";
import { workProfiles, type WorkProfile } from "@/content/work";
import {
  CAPTURA_ALTO,
  CAPTURA_ANCHO,
  urlVisible,
  workCaptures,
} from "@/content/work-captures";
import { formatShortDate, verificationDateFor } from "@/content/work-format";
import { WorkPreview } from "@/components/work/WorkPreview";
import styles from "./ProductBlocks.module.css";

/** La verificación más reciente entre las fuentes del perfil. */
function latestVerification(profile: WorkProfile) {
  const latest = profile.sources
    .map((source) => source.verifiedAt)
    .sort()
    .at(-1);
  return latest ? formatShortDate(latest) : "";
}

function ProductBlock({
  profile,
  index,
  copy,
  railCopy,
}: {
  profile: WorkProfile;
  index: number;
  copy: ProductBlocksCopy;
  railCopy: ExperienceRailCopy;
}) {
  const capture = workCaptures[profile.slug];
  const category = railCopy.productCategories[profile.slug] ?? profile.category;
  const status = railCopy.productStatuses[profile.slug] ?? profile.status.label;
  const headline = copy.headlines[profile.slug] ?? profile.headline;
  const description = copy.descriptions[profile.slug] ?? profile.description;
  const accessLabel = copy.accessLabels[profile.slug] ?? profile.access.label;

  return (
    <article
      className={`${styles.block} ${index % 2 === 1 ? styles.reverse : ""}`}
      id={`p-${profile.slug}`}
      aria-labelledby={`p-${profile.slug}-title`}
    >
      <div className={styles.text}>
        <p className={styles.kicker}>
          {copy.buildLabel} / {profile.number} <b>· {category}</b>
        </p>
        <h3 id={`p-${profile.slug}-title`}>{headline}</h3>
        <p className={styles.description}>{description}</p>
        <p className={styles.status}>
          <b>{status}</b>
          <span>{formatCopy(copy.verifiedLabel, { date: latestVerification(profile) })}</span>
        </p>
        <div className={styles.actions}>
          <a
            className={styles.pill}
            href={profile.access.href}
            target="_blank"
            rel="noreferrer"
          >
            {accessLabel}
          </a>
          <Link className={styles.ghost} href={`/trabajo/${profile.slug}`}>
            {copy.profileCta}
          </Link>
        </div>
        <dl className={styles.capabilities}>
          {profile.capabilities.map((capability, capabilityIndex) => {
            const key = `${profile.slug}:${capabilityIndex}`;
            return (
              <div key={capability.title}>
                <dt>{copy.capabilityTitles[key] ?? capability.title}</dt>
                <dd>{copy.capabilityDescriptions[key] ?? capability.description}</dd>
              </div>
            );
          })}
        </dl>
      </div>

      <div className={styles.visual}>
        <figure className={styles.browserFrame}>
          <div className={styles.browserChrome}>
            <div aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p>{urlVisible(capture.sourceUrl)}</p>
            <b aria-hidden="true">↗</b>
          </div>
          <div className={styles.captureViewport}>
            <Image
              src={capture.src}
              alt={capture.alt}
              width={CAPTURA_ANCHO}
              height={CAPTURA_ALTO}
              sizes="(max-width: 767px) 92vw, 54vw"
            />
          </div>
          <figcaption className={styles.captureCaption}>
            <em>{formatCopy(copy.captureLabel, { name: profile.name })}</em>
            <span>
              {formatCopy(copy.captureVerified, {
                date: verificationDateFor(profile.sources, capture.sourceUrl),
              })}
            </span>
          </figcaption>
        </figure>
        <div
          className={styles.previewWrap}
          aria-label={formatCopy(copy.previewAriaLabel, { name: profile.name })}
          role="group"
        >
          <WorkPreview profile={profile} compact />
        </div>
      </div>
    </article>
  );
}

/**
 * Un bloque por producto documentado, con la captura real de su página
 * pública en un marco de navegador y el panel de interfaz que `work.ts`
 * declara. Los datos vienen de `work.ts` y `work-captures.ts`; aquí no se
 * escribe ningún estado ni ninguna fecha.
 */
export function ProductBlocks({
  copy = homeCopyEs.products,
  railCopy = homeCopyEs.experienceRail,
}: {
  copy?: ProductBlocksCopy;
  railCopy?: ExperienceRailCopy;
}) {
  const inDevelopment = portfolio.filter((product) => product.stage === "En desarrollo");

  return (
    <section id="productos" className={styles.section} aria-labelledby="products-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 id="products-title">
              {copy.titleLead}<em>{copy.titleEmphasis}</em>
            </h2>
          </div>
          <p>{copy.lead}</p>
        </div>

        {workProfiles.map((profile, index) => (
          <ProductBlock
            profile={profile}
            index={index}
            copy={copy}
            railCopy={railCopy}
            key={profile.slug}
          />
        ))}

        {inDevelopment.map((product) => (
          <div className={styles.devRow} key={product.name}>
            <strong>{product.name}</strong>
            <span>{product.description}</span>
            <span className={styles.devStatus}>{copy.inDevelopmentLabel}</span>
          </div>
        ))}

        <p className={styles.disclosure}>{copy.disclosure}</p>
      </div>
    </section>
  );
}

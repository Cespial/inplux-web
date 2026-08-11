import type { ReactNode } from "react";
import { homeCopyEs } from "@/content/copy/es";
import type { HeroCopy } from "@/content/copy/types";
import { HeroSignal } from "./HeroSignal.client";
import styles from "./home.module.css";

export function HomeHero({
  copy = homeCopyEs.hero,
  primaryCta,
}: {
  copy?: HeroCopy;
  primaryCta: ReactNode;
}) {
  return (
    <div className={styles.hero} data-header-theme="dark">
      <div className={styles.heroCopy}>
        <div className={styles.heroMain}>
          <p className={styles.heroEyebrow}>{copy.eyebrow}</p>
          <h1>
            <span>{copy.titleLines[0]}</span>
            <span>{copy.titleLines[1]}</span>
          </h1>
          <p className={styles.heroLead}>
            <span>{copy.leadSentences[0]}</span>{" "}
            <span>{copy.leadSentences[1]}</span>
          </p>
          <div className={styles.heroActions}>
            {primaryCta}
            <a className={styles.ghostButton} href="#trabajo-real">
              {`${copy.secondaryCta} `}<span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <a className={styles.heroStatement} href="#trabajo-real">
          <span aria-hidden="true" />
          {copy.statement}
          <b aria-hidden="true">→</b>
        </a>
      </div>
      <HeroSignal copy={copy} />
    </div>
  );
}

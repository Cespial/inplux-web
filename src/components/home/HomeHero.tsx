import type { ReactNode } from "react";
import { HeroSignal } from "./HeroSignal.client";
import styles from "./home.module.css";

export function HomeHero({ primaryCta }: { primaryCta: ReactNode }) {
  return (
    <div className={styles.hero} data-header-theme="dark">
      <div className={styles.heroCopy}>
        <div className={styles.heroMain}>
          <p className={styles.heroEyebrow}>FÁBRICA DE SOFTWARE A LA MEDIDA</p>
          <h1>
            <span>De un problema real</span>
            <span>a software en producción.</span>
          </h1>
          <p className={styles.heroLead}>
            <span>
              INPLUX diseña, construye y evoluciona productos digitales para empresas y
              entidades.
            </span>{" "}
            <span>
              La IA acelera el trabajo. Personas expertas dirigen y validan las decisiones
              críticas.
            </span>
          </p>
          <div className={styles.heroActions}>
            {primaryCta}
            <a className={styles.ghostButton} href="#trabajo-real">
              Ver trabajo real <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <a className={styles.heroStatement} href="#trabajo-real">
          <span aria-hidden="true" />
          EL SOFTWARE EMPIEZA EN EL PROBLEMA
          <b aria-hidden="true">→</b>
        </a>
      </div>
      <HeroSignal />
    </div>
  );
}

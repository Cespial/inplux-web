import { homeCopyEs } from "@/content/copy/es";
import type { HowWeWorkCopy } from "@/content/copy/types";
import homeStyles from "./home.module.css";
import styles from "./HowWeWork.module.css";

/**
 * Cómo trabajamos, en tres pasos numerados. Ocupa el lugar de «La fábrica en
 * vivo» en la portada v2.1: la misma idea —del diagnóstico a producción con el
 * mismo equipo— en una pantalla y sin scroll atado. El scrolly sigue en el repo.
 *
 * El CTA es un enlace plano a #contacto: los disparadores del diálogo de
 * contacto están contados por el build y esta sección no suma uno.
 */
export function HowWeWork({ copy = homeCopyEs.howWeWork }: { copy?: HowWeWorkCopy }) {
  return (
    <section
      id="como-trabajamos"
      className={`${styles.how} ${homeStyles.glowCorner} ${homeStyles.grain}`}
      aria-labelledby="how-we-work-title"
    >
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={`${homeStyles.eyebrow} ${homeStyles.eyebrowArrow}`}>{copy.eyebrow}</p>
          <h2 id="how-we-work-title">{copy.title}</h2>
          <p className={styles.lead}>{copy.lead}</p>
        </div>
        <ol className={styles.steps}>
          {copy.steps.map((step) => (
            <li key={step.number} className={styles.step}>
              <span className={styles.number}>{step.number}</span>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>
        <a className={`${homeStyles.ghostButton} ${styles.cta}`} href="#contacto">
          {`${copy.cta} `}<span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

import type { WorkProfile } from "@/content/work";
import styles from "./workVisuals.module.css";

type WorkPreviewProps = {
  profile: WorkProfile;
  compact?: boolean;
};

export function WorkPreview({ profile, compact = false }: WorkPreviewProps) {
  return (
    <div
      className={`${styles.preview} ${compact ? styles.compact : ""}`}
      data-theme={profile.interface.theme}
      role="group"
      aria-label={`Demostración editorial de interfaz de ${profile.name}`}
    >
      <div className={styles.previewGrid} aria-hidden="true" />
      <div className={styles.previewChrome}>
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <p>{profile.interface.eyebrow}</p>
      </div>
      <div className={styles.previewBody}>
        <dl className={styles.previewMetric}>
          <div>
            <dt>{profile.interface.metricLabel}</dt>
            <dd>{profile.interface.primaryMetric}</dd>
          </div>
        </dl>
        <dl className={styles.previewRows}>
          {profile.interface.items.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd data-state={item.state}>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className={styles.previewRail} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

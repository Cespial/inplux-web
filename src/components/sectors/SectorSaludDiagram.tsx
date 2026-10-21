import type { Lang } from "@/content/i18n";
import { saludDiagramUi } from "@/content/page-ui";
import styles from "./SectorSaludDiagram.module.css";

/**
 * El sistema alrededor de la historia clínica, dibujado en código.
 *
 * Misma gramática isométrica que las capas de «La fábrica en vivo»: placas
 * en rombo, trazos hairline, un solo acento teal. En el centro, la historia
 * clínica que la IPS ya tiene; alrededor, lo que construimos: la app del
 * paciente, la central de telemonitoreo y la mesa de ayuda. Las flechas
 * indican lectura y agenda; ninguna escribe en la historia clínica.
 */
export function SectorSaludDiagram({ lang = "es" }: { lang?: Lang }) {
  const t = saludDiagramUi[lang];
  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 640 520"
      role="img"
      aria-labelledby="sector-salud-diagram-title sector-salud-diagram-desc"
    >
      <title id="sector-salud-diagram-title">{t.title}</title>
      <desc id="sector-salud-diagram-desc">{t.desc}</desc>
      <defs>
        <pattern id="salud-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className={styles.hatch} />
        </pattern>
      </defs>

      {/* Retícula de puntos */}
      <g className={styles.dots} aria-hidden="true">
        {Array.from({ length: 11 }, (_, row) =>
          Array.from({ length: 13 }, (_, col) => (
            <circle key={`${row}-${col}`} cx={40 + col * 46} cy={40 + row * 44} r="1" />
          )),
        )}
      </g>

      {/* Placa central: la historia clínica existente */}
      <g className={styles.plate}>
        <path d="M320 150 L470 236 L320 322 L170 236 Z" className={styles.face} />
        <path d="M170 236 L170 262 L320 348 L320 322 Z" fill="url(#salud-hatch)" className={styles.side} />
        <path d="M470 236 L470 262 L320 348 L320 322 Z" className={styles.sideDark} />
        <path d="M320 150 L470 236 L320 322 L170 236 Z" className={styles.outline} />
        <path d="M170 236 L170 262 L320 348 L470 262 L470 236" className={styles.outline} />
        <path d="M320 322 L320 348" className={styles.outline} />
        <text x="320" y="246" className={styles.plateLabel} textAnchor="middle">
          {t.plate}
        </text>
        <text x="320" y="262" className={styles.plateSub} textAnchor="middle">
          {t.plateSub}
        </text>
      </g>

      {/* Capa de integración: anillo */}
      <ellipse cx="320" cy="248" rx="214" ry="124" className={styles.ring} />
      <text x="320" y="392" className={styles.ringLabel} textAnchor="middle">
        {t.ring}
      </text>

      {/* App del paciente (izquierda arriba) */}
      <g className={styles.node} transform="translate(72 70)">
        <rect x="0" y="0" width="56" height="96" rx="9" className={styles.device} />
        <rect x="6" y="12" width="44" height="66" rx="3" className={styles.screen} />
        <circle cx="28" cy="86" r="3" className={styles.dot} />
        <path d="M14 26h28M14 38h20M14 50h28M14 62h14" className={styles.lines} />
        <text x="72" y="30" className={styles.nodeLabel}>{t.app}</text>
        <text x="72" y="46" className={styles.nodeSub}>{t.appSub}</text>
        <text x="72" y="60" className={styles.nodeSub}>{t.appPlatforms}</text>
      </g>
      <path d="M128 150 C 170 180, 190 200, 214 214" className={styles.link} markerEnd="url(#salud-arrow)" />

      {/* Central de telemonitoreo (derecha arriba) */}
      <g className={styles.node} transform="translate(430 56)">
        <rect x="0" y="0" width="150" height="92" rx="4" className={styles.device} />
        <rect x="8" y="8" width="134" height="60" rx="2" className={styles.screen} />
        <circle cx="22" cy="24" r="4" className={styles.semRed} />
        <circle cx="22" cy="40" r="4" className={styles.semAmber} />
        <circle cx="22" cy="56" r="4" className={styles.semTeal} />
        <path d="M34 24h60M34 40h44M34 56h72" className={styles.lines} />
        <path d="M60 92v12M90 92v12M50 104h50" className={styles.stand} />
        <text x="0" y="128" className={styles.nodeLabel}>{t.monitoring}</text>
        <text x="0" y="144" className={styles.nodeSub}>{t.monitoringSub}</text>
      </g>
      <path d="M470 170 C 450 190, 440 204, 424 218" className={styles.link} />

      {/* Mesa de ayuda (abajo) */}
      <g className={styles.node} transform="translate(214 418)">
        <path d="M0 0h116v22a8 8 0 0 0 0 16v22H0V38a8 8 0 0 0 0-16Z" className={styles.ticket} />
        <path d="M14 20h52M14 32h36M14 44h60" className={styles.lines} />
        <circle cx="96" cy="30" r="6" className={styles.dot} />
        <text x="134" y="26" className={styles.nodeLabel}>{t.helpdesk}</text>
        <text x="134" y="42" className={styles.nodeSub}>{t.helpdeskSub}</text>
      </g>
      <path d="M300 414 C 306 392, 312 376, 318 360" className={styles.link} />

      <defs>
        <marker id="salud-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 Z" className={styles.arrow} />
        </marker>
      </defs>

      <text x="40" y="500" className={styles.stamp}>{t.stamp}</text>
      <text x="600" y="500" className={styles.stamp} textAnchor="end">
        {t.rule}
      </text>
    </svg>
  );
}

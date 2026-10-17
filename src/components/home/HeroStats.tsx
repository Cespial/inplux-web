import { homeCopyEs } from "@/content/copy/es";
import { formatCopy } from "@/content/copy/format";
import type { HeroStatsCopy } from "@/content/copy/types";
import { portfolio } from "@/content/home";
import { pressStories } from "@/content/press";
import { workProfiles } from "@/content/work";
import { formatShortDate } from "@/content/work-format";
import { clientWallCount } from "./HomeSections";
import styles from "./HeroStats.module.css";

/**
 * La cinta de cifras del hero.
 *
 * Ninguno de los cuatro números se escribe: se cuentan desde el contenido que
 * el sitio ya publica. Si entra un producto, una organización o una pieza de
 * prensa, la cinta se mueve sola; si alguien quiere inflar una cifra, tiene
 * que inventar el contenido que la respalde, y las puertas de build lo paran.
 */
export function HeroStats({ copy = homeCopyEs.heroStats }: { copy?: HeroStatsCopy }) {
  const documented = workProfiles.length;
  const inDevelopment = portfolio.filter((product) => product.stage === "En desarrollo").length;
  const lastVerified = workProfiles
    .flatMap((profile) => profile.sources.map((source) => source.verifiedAt))
    .sort()
    .at(-1);

  const stats = [
    {
      label: copy.products.label,
      value: portfolio.length,
      detail: formatCopy(copy.products.detail, {
        documented: String(documented),
        inDevelopment: String(inDevelopment),
      }),
    },
    {
      label: copy.profiles.label,
      value: documented,
      detail: formatCopy(copy.profiles.detail, {
        date: lastVerified ? formatShortDate(lastVerified) : "",
      }),
    },
    {
      label: copy.organizations.label,
      value: clientWallCount,
      detail: copy.organizations.detail,
    },
    {
      label: copy.press.label,
      value: pressStories.length,
      detail: copy.press.detail,
    },
  ];

  return (
    <div className={styles.wrap}>
      <ul className={styles.stats} aria-label={copy.ariaLabel}>
        {stats.map((stat) => (
          <li key={stat.label}>
            <span>{stat.label}</span>
            <div>
              <strong>{stat.value}</strong>
              <small>{stat.detail}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

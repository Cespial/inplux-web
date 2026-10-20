import Image from "next/image";
import { homeCopyEs } from "@/content/copy/es";
import type { PartnerWallCopy } from "@/content/copy/types";
import { partners } from "@/content/partners";
import homeStyles from "./home.module.css";
import styles from "./PartnerWall.module.css";

/**
 * El muro de partners tecnológicos. Misma retícula hairline y misma silueta
 * que el muro de clientes, pero con otra relación: aquí no hay experiencia
 * acreditada, hay marcas sobre las que construimos y que autorizan su uso.
 *
 * Si el registro está vacío la sección no existe: una banda de «partners»
 * con placeholders diría lo contrario de lo que el sitio promete.
 */
export function PartnerWall({ copy = homeCopyEs.partnerWall }: { copy?: PartnerWallCopy }) {
  if (partners.length === 0) return null;

  return (
    <section id="partners" className={styles.wall} aria-labelledby="partner-wall-title">
      <div className={styles.head}>
        <div>
          <p className={`${homeStyles.eyebrow} ${homeStyles.eyebrowArrow}`}>{copy.eyebrow}</p>
          <h2 id="partner-wall-title">{copy.title}</h2>
        </div>
        <p>{copy.note}</p>
      </div>
      <ul className={styles.grid} aria-label={copy.eyebrow}>
        {partners.map((partner) => (
          <li key={partner.id} className={styles.cell}>
            <span className={styles.relation}>{partner.relation}</span>
            <Image
              src={partner.file}
              alt={partner.name}
              width={partner.width}
              height={partner.height}
              unoptimized={partner.file.endsWith(".svg")}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

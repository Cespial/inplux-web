import Image from "next/image";
import type { CSSProperties } from "react";
import { clientLogos, clientNames, clientWallCount } from "@/content/clients";
import { homeCopyEs } from "@/content/copy/es";
import type { ClientWallCopy, ExperienceRailCopy } from "@/content/copy/types";
import { fillSpan } from "@/components/home/gridFill";
import ui from "./v5.module.css";
import styles from "./LogoWall.module.css";

/**
 * El muro de relaciones: cada logotipo con permiso registrado y cada entidad
 * nombrada, en una retícula que cierra en rectángulo gracias al rótulo final,
 * que absorbe las columnas sobrantes (`--wall-fill-N`, uno por conteo de
 * columnas declarado en el CSS; lo vigila `verify-grid-fill.test.mjs`).
 */

function ClientNameCell({
  client,
  copy,
}: {
  client: (typeof clientNames)[number];
  copy: ExperienceRailCopy;
}) {
  return (
    <div
      className={`${styles.logoCell} ${styles.logoNamed}`}
      role="group"
      aria-label={`${copy.relationExperience}: ${client.name}${client.place ? `. ${client.place}` : ""}`}
    >
      <span className={styles.logoRelation}>{copy.relationExperience}</span>
      <span className={styles.logoName} aria-hidden="true">
        <strong>{client.name}</strong>
        {client.place ? <small>{client.place}</small> : null}
      </span>
    </div>
  );
}

function ClientLogoCell({
  client,
  copy,
}: {
  client: (typeof clientLogos)[number];
  copy: ExperienceRailCopy;
}) {
  const relation = copy.relationExperience;
  const note = copy.clientNotes[client.src];

  return (
    <div
      className={styles.logoCell}
      role="group"
      aria-label={`${relation}: ${client.name}. ${note}`}
    >
      <span className={styles.logoRelation}>{relation}</span>
      <Image
        src={client.src}
        alt={client.name}
        width={client.width}
        height={client.height}
        sizes={`${client.renderWidth}px`}
      />
      <span className={styles.logoProof} aria-hidden="true">
        <strong>{client.name}</strong>
        <span>{note}</span>
      </span>
    </div>
  );
}

export function LogoWall({
  copy = homeCopyEs.experienceRail,
  heading = homeCopyEs.clientWall,
  id = "clientes",
}: {
  copy?: ExperienceRailCopy;
  heading?: ClientWallCopy;
  id?: string;
}) {
  const wallCells = clientWallCount + 1;
  const wallStyle = {
    "--wall-fill-3": String(fillSpan(wallCells, 3)),
    "--wall-fill-4": String(fillSpan(wallCells, 4)),
    "--wall-fill-6": String(fillSpan(wallCells, 6)),
  } as CSSProperties;

  return (
    <section id={id} className={styles.wall} aria-labelledby={`${id}-title`}>
      <div className={styles.wallHead}>
        <div>
          <p className={ui.eyebrow}>{heading.eyebrow}</p>
          <h2 id={`${id}-title`}>{heading.title}</h2>
        </div>
        <p>{heading.lead}</p>
      </div>
      <div
        className={styles.logoWall}
        style={wallStyle}
        role="region"
        aria-label={copy.logoWallAriaLabel}
      >
        {clientLogos.map((client) => (
          <ClientLogoCell client={client} copy={copy} key={client.src} />
        ))}
        {clientNames.map((client) => (
          <ClientNameCell client={client} copy={copy} key={client.name} />
        ))}
        <div className={`${styles.logoCell} ${styles.logoStatement}`}>
          <p>
            {copy.statementEyebrow}
            <strong>{copy.statementTitle}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

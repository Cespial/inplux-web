import Image from "next/image";
import type { CSSProperties } from "react";
import { clientGroups, clientLogos, clientNames, type ClientGroup } from "@/content/clients";
import { homeCopyEs } from "@/content/copy/es";
import type { ClientWallCopy, ExperienceRailCopy } from "@/content/copy/types";
import ui from "./v5.module.css";
import styles from "./LogoWall.module.css";
import { WallPause } from "./WallPause.client";

/**
 * El muro de relaciones en tres cintas, una por grupo (instituciones públicas,
 * IPS y empresas privadas, alcaldías), cada una con su rótulo fijo. El orden
 * de `content/clients.ts` es el de cada cinta: abre la organización más grande
 * y las tres primeras de cada grupo van más grandes.
 *
 * Cada cinta pinta su lista tres veces y la desplaza un tercio en bucle; sólo
 * la primera copia es legible para el lector de pantalla, las otras dos van
 * con `aria-hidden`. Sin movimiento (preferencia del sistema o el botón de
 * pausa) la cinta se queda quieta y, con «reducir movimiento», se muestra
 * entera en renglones.
 */

/** Las copias de cada cinta: tres llenan la fila hasta 1400px sin hueco. */
const COPIES = 3;
/** Segundos por logo: unos 35px por segundo con el ancho medio de un logo. */
const SECONDS_PER_ITEM = 5.5;
/** Cuántos logos abren cada grupo en tamaño grande. */
const LEADING = 3;

type Logo = (typeof clientLogos)[number];
type Named = (typeof clientNames)[number];
type Entry = { kind: "logo"; client: Logo } | { kind: "named"; client: Named };

function entriesFor(group: ClientGroup): Entry[] {
  return [
    ...clientLogos
      .filter((client) => client.group === group)
      .map((client) => ({ kind: "logo" as const, client })),
    ...clientNames
      .filter((client) => client.group === group)
      .map((client) => ({ kind: "named" as const, client })),
  ];
}

function WallItem({
  entry,
  leading,
  copy,
  hidden,
}: {
  entry: Entry;
  leading: boolean;
  copy: ExperienceRailCopy;
  hidden: boolean;
}) {
  const className = `${styles.item}${leading ? ` ${styles.leading}` : ""}`;

  if (entry.kind === "named") {
    const { client } = entry;
    return (
      <li className={className}>
        <span className={styles.logoName}>
          <strong>{client.name}</strong>
          {client.place ? <small>{client.place}</small> : null}
        </span>
      </li>
    );
  }

  const { client } = entry;
  const note = copy.clientNotes[client.src];
  const width = Math.round(client.renderWidth * (leading ? 0.92 : 0.7));

  return (
    <li className={className} style={{ "--logo-w": `${width}px` } as CSSProperties}>
      <Image
        src={client.src}
        alt={hidden ? "" : client.name}
        width={client.width}
        height={client.height}
        sizes={`${width}px`}
      />
      {/* La ficha del hover va en atributos y la pinta el CSS: el lector de
          pantalla ya tiene el nombre en el `alt`, y la nota no se repite como
          texto para no inflar las palabras de la portada (tope en
          `verify-build-output`). */}
      <span className={styles.logoProof} aria-hidden="true" data-name={client.name} data-note={note} />
    </li>
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
  return (
    <section id={id} className={styles.wall} aria-labelledby={`${id}-title`}>
      <div className={styles.wallHead}>
        <div>
          <p className={ui.eyebrow}>{heading.eyebrow}</p>
          <h2 id={`${id}-title`}>{heading.title}</h2>
        </div>
        <div className={styles.wallLead}>
          <p>{heading.lead}</p>
          <WallPause pause={heading.pause} play={heading.play} />
        </div>
      </div>
      <div
        className={styles.rows}
        role="region"
        aria-label={copy.logoWallAriaLabel}
        data-reveal="quiet"
      >
        {clientGroups.map((group, index) => {
          const entries = entriesFor(group);
          if (entries.length === 0) return null;
          const labelId = `${id}-${group}`;
          const rowStyle = {
            "--marquee-duration": `${entries.length * SECONDS_PER_ITEM}s`,
          } as CSSProperties;

          return (
            <div className={styles.row} key={group} data-reverse={index % 2 === 1 ? "" : undefined}>
              <h3 className={styles.rowLabel} id={labelId}>
                {heading.groups[group]}
              </h3>
              <div className={styles.viewport}>
                <div className={styles.rail} style={rowStyle}>
                  {Array.from({ length: COPIES }, (_, copyIndex) => (
                    <ul
                      className={styles.track}
                      key={copyIndex}
                      aria-labelledby={copyIndex === 0 ? labelId : undefined}
                      aria-hidden={copyIndex === 0 ? undefined : true}
                    >
                      {entries.map((entry, position) => (
                        <WallItem
                          entry={entry}
                          leading={position < LEADING}
                          copy={copy}
                          hidden={copyIndex !== 0}
                          key={entry.client.name}
                        />
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { homeCopyEs } from "@/content/copy/es";
import type { TeamLeadersCopy } from "@/content/copy/types";
import { teamMembers } from "@/content/team";
import styles from "./TeamLeaders.module.css";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 4h6v6M20 4 10 14M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"
      />
    </svg>
  );
}

/**
 * Las dos direcciones, en la portada.
 *
 * Cada tarjeta enlaza el perfil de la persona en `/equipo/[slug]`, que es la
 * página que concentra su identidad para los buscadores: la portada deja de
 * mandar ese tráfico a LinkedIn y lo manda primero a casa. Los textos salen
 * de `team.ts`; aquí no se escribe ninguna biografía.
 */
export function TeamLeaders({ copy = homeCopyEs.team }: { copy?: TeamLeadersCopy }) {
  return (
    <section id="equipo" className={styles.section} aria-labelledby="team-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 id="team-title">
              {copy.titleLead}<em>{copy.titleEmphasis}</em>
            </h2>
          </div>
          <p>{copy.lead}</p>
        </div>
        <div className={styles.grid}>
          {teamMembers.map((member) => (
            <article className={styles.card} key={member.slug}>
              <p className={styles.meta}>
                <span>{member.code}</span>
                <span>{copy.roles[member.slug] ?? member.role}</span>
              </p>
              <Link
                className={styles.photoLink}
                href={`/equipo/${member.slug}`}
                aria-label={`${copy.profileCta}: ${member.name}`}
              >
                <Image
                  className={styles.photo}
                  src={member.photo.src}
                  alt={member.name}
                  width={member.photo.width}
                  height={member.photo.height}
                  sizes="(max-width: 767px) 88vw, 22rem"
                />
              </Link>
              <h3>
                <Link href={`/equipo/${member.slug}`}>{member.name}</Link>
              </h3>
              <p className={styles.focus}>{copy.focuses[member.slug] ?? member.focus}</p>
              <p className={styles.bio}>{copy.bios[member.slug] ?? member.bio}</p>
              <ul className={styles.credentials}>
                {member.credentials.map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
              <ul className={styles.tags} aria-label={member.name}>
                {member.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <p className={styles.links}>
                <Link href={`/equipo/${member.slug}`}>
                  {copy.profileCta} <span aria-hidden="true">→</span>
                </Link>
                <a href={member.linkedin} target="_blank" rel="noreferrer">
                  <LinkedInIcon />
                  {copy.linkedInLabel}
                </a>
                <a href={member.secondaryLink.href} target="_blank" rel="noreferrer">
                  <ExternalIcon />
                  {member.secondaryLink.label}
                </a>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

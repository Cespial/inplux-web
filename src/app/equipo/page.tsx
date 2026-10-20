import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import {
  Band,
  Button,
  CloseBand,
  MailRow,
  SectionHead,
  buttonClass,
} from "@/components/v5/primitives";
import { personId, profileUrl, teamMembers } from "@/content/team";
import styles from "./equipo.module.css";

/*
 * `/equipo` (octubre de 2026): la página de equipo, como la de primero.com.
 * Las tarjetas de dirección (retrato real en blanco y negro, rol, nombre y tres
 * credenciales) y de dónde viene el equipo. Corta a propósito.
 *
 * Pendiente: la foto de grupo a todo el ancho, cuando haya sesión real con
 * Jaime y Cristian. No se usa ninguna imagen generada.
 */

const SITE_URL = "https://inplux.co";
const PAGE_URL = `${SITE_URL}/equipo`;

export const metadata: Metadata = {
  title: "Equipo — quién dirige y quién responde",
  description:
    "Las personas que dirigen INPLUX y responden por cada producto: criterio tributario e institucional, producto e ingeniería, desde Medellín.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Equipo | INPLUX",
    description:
      "Quién dirige INPLUX y responde por cada producto, con su trayectoria a la vista.",
    url: PAGE_URL,
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/brand/og/og-nosotros.png",
        width: 1200,
        height: 630,
        alt: "INPLUX, el criterio detrás de la fábrica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Equipo | INPLUX",
    description:
      "Quién dirige INPLUX y responde por cada producto, con su trayectoria a la vista.",
    images: [
      {
        url: "/brand/og/og-nosotros.png",
        alt: "INPLUX, el criterio detrás de la fábrica",
      },
    ],
  },
};

/** Instituciones de formación del equipo, tal como figuran en sus credenciales. */
const schools = [
  "Universidad EAFIT",
  "Universidad Nacional de Colombia",
  "Universidad de Medellín",
  "University of Miami Herbert Business School",
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${PAGE_URL}#webpage`,
      name: "Equipo de INPLUX",
      url: PAGE_URL,
      description: metadata.description,
      inLanguage: "es-CO",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Equipo", item: PAGE_URL },
      ],
    },
    // Referencias por `@id` canónico: cada persona se define en /equipo/[slug].
    ...teamMembers.map((member) => ({
      "@type": "Person",
      "@id": personId(member.slug),
      name: member.name,
      url: profileUrl(member.slug),
      jobTitle: member.jobTitle,
      worksFor: { "@id": `${SITE_URL}/#organization` },
    })),
  ],
};

export default function EquipoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactDialogProvider>
        <V5Page className={styles.root}>
          <main id="main-content" tabIndex={-1}>
            <section id="inicio" aria-labelledby="team-title">
              <PageHero
                className={styles.hero}
                eyebrow="Equipo"
                title={<span id="team-title">Personas que pueden explicar, y asumir, cada decisión.</span>}
                lead="No usamos retratos generados ni escondemos la responsabilidad detrás de la IA."
                leadMuted="Quien decide qué se construye y quien dirige cómo se construye."
                crumbs={[{ label: "Inicio", href: "/" }, { label: "Nosotros", href: "/nosotros" }, { label: "Equipo" }]}
              />
            </section>

            <Band id="direccion" tone="light" labelledBy="leaders-title" className={styles.leaders}>
              <SectionHead
                id="leaders-title"
                eyebrow="Dirección"
                title={
                  <>
                    Dos direcciones: <em>criterio y producto.</em>
                  </>
                }
              />
              {/* Foto de grupo pendiente: irá aquí, a todo el ancho, cuando exista una sesión real. */}
              <div className={styles.people}>
                {teamMembers.map((member) => (
                  <article className={styles.person} key={member.slug}>
                    <Link href={`/equipo/${member.slug}`} className={styles.personPhoto}>
                      <Image
                        src={member.photo.src}
                        alt={member.name}
                        width={member.photo.width}
                        height={member.photo.height}
                        sizes="(max-width: 760px) 92vw, 40vw"
                      />
                      <span className={styles.caption}>
                        <span className={styles.role}>{member.jobTitle}</span>
                        <strong>{member.name}</strong>
                      </span>
                    </Link>
                    <p>{member.focus}</p>
                    <ul>
                      {member.credentials.slice(0, 3).map((credential) => (
                        <li key={credential}>{credential}</li>
                      ))}
                    </ul>
                    <p className={styles.links}>
                      <Link href={`/equipo/${member.slug}`}>
                        Ver perfil <span aria-hidden="true">→</span>
                      </Link>
                      <a href={member.linkedin} target="_blank" rel="noreferrer">
                        LinkedIn <span aria-hidden="true">↗</span>
                      </a>
                    </p>
                  </article>
                ))}
              </div>
            </Band>

            <Band id="formacion" labelledBy="schools-title" className={styles.schools}>
              <SectionHead
                id="schools-title"
                eyebrow="De dónde viene el equipo"
                title={
                  <>
                    Formación que se puede <em>comprobar.</em>
                  </>
                }
                align="center"
              />
              <ul className={styles.schoolList} aria-label="Instituciones de formación">
                {schools.map((school) => (
                  <li key={school}>{school}</li>
                ))}
              </ul>
            </Band>

            <CloseBand
              id="contacto"
              titleId="closing-title"
              eyebrow="El siguiente paso"
              title={
                <>
                  Hablemos con quien <em>responde.</em>
                </>
              }
              lead="Cuéntanos el problema y quién lo vive. La conversación empieza con la dirección, no con un formulario de ventas."
            >
              <MailRow>
                <ContactLink
                  className={buttonClass("primary")}
                  fallbackHref="/contacto"
                  source="team-closing"
                >
                  Empezar un proyecto
                </ContactLink>
                <Button href="mailto:gerencia@inplux.co">gerencia@inplux.co</Button>
              </MailRow>
            </CloseBand>
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

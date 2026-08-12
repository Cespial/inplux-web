import type { Metadata } from "next";
import Link from "next/link";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ProjectShowcase } from "@/components/work/ProjectShowcase.client";
import { workDirectory, workProfiles, type WorkSlug } from "@/content/work";
import { getWorkSocialImageUrl } from "@/app/api/og/trabajo/social-card";
import styles from "./trabajo.module.css";

const workSocialImage = getWorkSocialImageUrl("directorio");
const workSocialDescription =
  "Cuatro productos documentados, cada uno con sus fuentes públicas y su fecha de verificación.";
const workSocialImageAlt =
  "INPLUX, directorio de trabajo y productos con fuentes verificadas";
const showcaseOrder = ["gobia", "laudos", "tribai", "kelsen"] as const satisfies readonly WorkSlug[];
const showcaseProfiles = showcaseOrder.flatMap((slug) => {
  const profile = workProfiles.find((candidate) => candidate.slug === slug);
  return profile ? [profile] : [];
});
const upcomingWork = workDirectory.find((item) => !item.hasProfile);

export const metadata: Metadata = {
  title: "Trabajo y productos — evidencia y atribución",
  description:
    "Los cuatro productos de INPLUX, cada uno con sus fuentes públicas y su fecha de verificación.",
  alternates: {
    canonical: "https://inplux.co/trabajo",
  },
  openGraph: {
    title: "Trabajo y productos — evidencia y atribución | INPLUX",
    description: workSocialDescription,
    url: "https://inplux.co/trabajo",
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: workSocialImage,
        width: 1200,
        height: 630,
        alt: workSocialImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trabajo y productos — evidencia y atribución | INPLUX",
    description: workSocialDescription,
    images: [
      {
        url: workSocialImage,
        alt: workSocialImageAlt,
      },
    ],
  },
};

const workJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Trabajo y productos — evidencia y atribución",
  url: "https://inplux.co/trabajo",
  description:
    "Directorio de los productos de INPLUX, cada uno con sus fuentes públicas y su fecha de verificación.",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: showcaseProfiles.map((profile, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: profile.name,
      url: `https://inplux.co/trabajo/${profile.slug}`,
    })),
  },
};

export default function TrabajoPage() {
  const sourceCount = workProfiles.reduce(
    (total, profile) => total + profile.sources.length,
    0,
  );
  const lastVerified = workProfiles
    .flatMap((profile) => profile.sources.map((source) => source.verifiedAt))
    .reduce((latest, date) => (date > latest ? date : latest), "0000-00-00");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workJsonLd) }}
      />
      <ContactDialogProvider>
        <div className={styles.workRoot}>
          <SiteHeader inverseOnTop />
          <main id="main-content" tabIndex={-1}>
            <section
              className={styles.hero}
              aria-labelledby="work-title"
              data-header-theme="dark"
            >
              <div className={styles.heroGrid}>
                <div className={styles.heroCopy}>
                  <p className={styles.eyebrow}>
                    <span>00</span> Trabajo y productos
                  </p>
                  <h1 id="work-title">
                    Cada producto, <em>con su fuente.</em>
                  </h1>
                  <p className={styles.heroLead}>
                    Publicamos lo que cada producto muestra en su sitio oficial, con la
                    fecha en que lo revisamos. Nada de lo que aparece aquí depende de
                    que nos creas.
                  </p>
                </div>
                <div className={styles.heroLedger} aria-label="Resumen del directorio">
                  <p>REGISTRO / 2026.08</p>
                  <div>
                    <strong>{workProfiles.length}</strong>
                    <span>productos documentados</span>
                  </div>
                  <div>
                    <strong>{sourceCount}</strong>
                    <span>fuentes públicas citadas</span>
                  </div>
                  <div>
                    <strong>{lastVerified}</strong>
                    <span>última verificación</span>
                  </div>
                  <small>
                    Cada perfil conserva sus fuentes y la fecha en que se revisaron.
                  </small>
                </div>
              </div>
              <a className={styles.heroJump} href="#pantallas">
                Ver pantallas <span aria-hidden="true">↓</span>
              </a>
            </section>

            <ProjectShowcase profiles={showcaseProfiles} />

            <section className={styles.evidenceBand} aria-labelledby="evidence-title">
              <div className={styles.evidenceCopy}>
                <p className={styles.eyebrow}>
                  <span>02</span> Evidencia y alcance
                </p>
                <h2 id="evidence-title">
                  Cada pantalla dice <em>de dónde salió.</em>
                </h2>
                <p>
                  Son capturas estáticas de páginas públicas oficiales; la experiencia
                  interactiva se abre en el sitio fuente. Cada perfil conserva sus
                  fuentes y su fecha de revisión.
                </p>
              </div>

              {upcomingWork ? (
                <article className={styles.upcomingCard}>
                  <p>PRÓXIMO / EN DESARROLLO</p>
                  <div>
                    <span>05</span>
                    <h3>{upcomingWork.name}</h3>
                  </div>
                  <dl>
                    <div>
                      <dt>Área</dt>
                      <dd>{upcomingWork.category}</dd>
                    </div>
                    <div>
                      <dt>Estado</dt>
                      <dd>{upcomingWork.status}</dd>
                    </div>
                  </dl>
                  <small>
                    Sumaremos su pantalla cuando exista un perfil público verificable.
                  </small>
                </article>
              ) : null}
            </section>

            <section className={styles.closing} aria-labelledby="closing-title">
              <p>INPLUX / FÁBRICA DE SOFTWARE</p>
              <h2 id="closing-title">
                ¿Qué producto debería tener <em>forma</em> ahora?
              </h2>
              <Link href="/contacto">
                Empezar un proyecto <span aria-hidden="true">↗</span>
              </Link>
            </section>
          </main>
          <SiteFooter />
        </div>
      </ContactDialogProvider>
    </>
  );
}

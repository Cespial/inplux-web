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
  "Trabajo atribuible y ecosistema observado, con la atribución pública de cada perfil explicada por separado.";
const workSocialImageAlt =
  "INPLUX, directorio de trabajo y productos con atribución pública diferenciada";
const showcaseOrder = ["gobia", "laudos", "tribai", "kelsen"] as const satisfies readonly WorkSlug[];
const showcaseProfiles = showcaseOrder.flatMap((slug) => {
  const profile = workProfiles.find((candidate) => candidate.slug === slug);
  return profile ? [profile] : [];
});
const upcomingWork = workDirectory.find((item) => !item.hasProfile);

export const metadata: Metadata = {
  title: "Trabajo y productos — evidencia y atribución",
  description:
    "Explora por separado el trabajo públicamente atribuible a INPLUX y los productos documentados del ecosistema observado.",
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
    "Directorio que separa trabajo atribuible a INPLUX de productos documentados sin atribución pública confirmada.",
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
  const attributedProfiles = workProfiles.filter(
    (profile) => profile.attribution.state === "confirmed",
  );
  const observedProfiles = workProfiles.filter(
    (profile) => profile.attribution.state === "unconfirmed",
  );

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
                    Lo atribuible y lo observado, <em>sin confundirlos.</em>
                  </h1>
                  <p className={styles.heroLead}>
                    Separamos el trabajo públicamente atribuible a INPLUX de los
                    productos que documentamos sin afirmar una relación que las fuentes
                    todavía no demuestran.
                  </p>
                </div>
                <div className={styles.heroLedger} aria-label="Resumen del directorio">
                  <p>REGISTRO / 2026.07</p>
                  <div>
                    <strong>{workProfiles.length}</strong>
                    <span>perfiles documentados</span>
                  </div>
                  <div>
                    <strong>{attributedProfiles.length}</strong>
                    <span>trabajos con atribución pública confirmada</span>
                  </div>
                  <div>
                    <strong>{observedProfiles.length}</strong>
                    <span>productos observados sin atribución confirmada</span>
                  </div>
                  <small>
                    Una atribución pendiente no se presenta como caso de INPLUX.
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
                  Cada pantalla dice qué es — y <em>qué no es.</em>
                </h2>
                <p>
                  Son capturas estáticas de páginas públicas oficiales; la experiencia
                  interactiva se abre en el sitio fuente. Cada perfil conserva sus
                  fuentes, fecha de revisión y atribución por separado.
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

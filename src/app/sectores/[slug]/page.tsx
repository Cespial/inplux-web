import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SectorSaludDiagram } from "@/components/sectors/SectorSaludDiagram";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import {
  Band,
  Button,
  Card,
  CardGrid,
  SectionHead,
  buttonClass,
  cx,
  statusTone,
  v5 as ui,
} from "@/components/v5/primitives";
import { getSectorProfile, sectorProfiles, type SectorSlug } from "@/content/sectores";
import { getWorkProfile, workDirectory } from "@/content/work";
import { CAPTURA_ALTO, CAPTURA_ANCHO, workCaptures } from "@/content/work-captures";
import { formatShortDate } from "@/content/work-format";
import { breadcrumbJsonLd, type Crumb } from "@/lib/breadcrumbs";
import styles from "./sector.module.css";

/**
 * Páginas de sector: `/sectores/[slug]`, una plantilla para las cuatro.
 *
 * El orden sigue el de una página de industria de octubre de 2026: imagen a
 * sangre con el nombre del sector y un lead «IA para X, Y y Z.»; un reclamo con
 * tres promesas de dos tiempos; los productos propios que aplican; la norma
 * donde la hay; y una sola invitación al final. Salud conserva, además, sus
 * piezas con estado, en una línea cada una.
 *
 * Tres disparadores de contacto por página —cabecera, hero y cierre—: es lo
 * que `verify-build-output` cuenta para cada sector.
 */

type SectorPageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = "https://inplux.co";

export const dynamicParams = false;

export function generateStaticParams() {
  return sectorProfiles.map((sector) => ({ slug: sector.slug }));
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSectorProfile(slug);
  if (!sector) return {};

  const url = `${SITE_URL}/sectores/${sector.slug}`;
  const socialTitle = `${sector.title} | INPLUX`;
  /* La tarjeta se pinta con `scripts/og-cards.mjs` sobre la foto del hero. */
  const socialImage = `/brand/og/og-sector-${sector.slug}.jpg`;
  const socialImageAlt = `INPLUX · ${sector.name}. ${sector.lead}`;

  return {
    title: sector.title,
    description: sector.description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description: sector.description,
      url,
      siteName: "INPLUX",
      locale: "es_CO",
      type: "website",
      images: [{ url: socialImage, width: 1200, height: 630, type: "image/jpeg", alt: socialImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: sector.description,
      images: [{ url: socialImage, alt: socialImageAlt }],
    },
  };
}

/* Un diagrama es opcional: hoy solo salud tiene uno dibujado en código. */
const diagrams: Partial<Record<SectorSlug, () => React.JSX.Element>> = {
  salud: SectorSaludDiagram,
};

const STATUS_LABELS: Record<string, string> = {
  "En operación": "Corre con un cliente",
  "En construcción": "Trabajo contratado, aún sin usuarios",
  Prototipo: "Existe y se puede abrir",
  Oferta: "Diseñado y cotizado",
};

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = getSectorProfile(slug);
  if (!sector) notFound();

  const url = `${SITE_URL}/sectores/${sector.slug}`;
  const Diagram = diagrams[sector.slug];
  const status = Object.fromEntries(workDirectory.map((entry) => [entry.name, entry.status]));
  const products = sector.products
    .map((productSlug) => getWorkProfile(productSlug))
    .filter((profile): profile is NonNullable<typeof profile> => Boolean(profile));

  /*
   * `Service` y no `Product`: la página describe lo que hacemos para un tipo
   * de organización. El proveedor es la organización del layout y la página
   * cuelga del sitio por su `@id`. Sin cobertura geográfica: es una afirmación
   * que el sitio no publica. El catálogo son las piezas documentadas, o las
   * promesas cuando el sector no tiene piezas con estado.
   */
  const offers = sector.capabilities
    ? sector.capabilities.map((capability) => ({
        name: capability.title,
        description: capability.description,
      }))
    : sector.promises.map((promise) => ({
        name: promise.label,
        description: `${promise.lineA} ${promise.lineB}`,
      }));

  const crumbs: Crumb[] = [{ label: "Inicio", href: "/" }, { label: "Sectores" }, { label: sector.name }];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: sector.title,
        description: sector.description,
        inLanguage: "es-CO",
        dateModified: sector.verifiedAt,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        primaryImageOfPage: `${SITE_URL}${sector.hero.image}`,
        about: { "@id": `${url}#service` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: sector.title,
        serviceType: sector.serviceType,
        description: sector.intro,
        provider: { "@id": `${SITE_URL}/#organization` },
        audience: {
          "@type": "Audience",
          audienceType: sector.audienceType,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `Capacidades · ${sector.name}`,
          itemListElement: offers.map((offer) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", ...offer },
          })),
        },
      },
      breadcrumbJsonLd(crumbs, url),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactDialogProvider>
        <V5Page className={styles.root}>
          <main id="main-content" tabIndex={-1}>
            <section id="inicio" aria-labelledby="sector-title">
              <PageHero
                className={styles.hero}
                eyebrow={sector.eyebrow}
                title={<span id="sector-title">{sector.name}</span>}
                lead={sector.lead}
                leadMuted={sector.audience}
                crumbs={crumbs}
                media={{
                  kind: "image",
                  src: sector.hero.image,
                  alt: sector.hero.alt,
                  width: 2400,
                  height: 1600,
                  priority: true,
                }}
                actions={
                  <>
                    <ContactLink
                      className={buttonClass("primary")}
                      fallbackHref="/contacto"
                      source="sector-hero"
                    >
                      Contar el caso
                    </ContactLink>
                    <Button href="#promesas">
                      Ver qué cambia <span aria-hidden="true">↓</span>
                    </Button>
                  </>
                }
              />
            </section>

            <Band id="promesas" tone="light" labelledBy="claim-title" className={styles.claim}>
              <SectionHead
                id="claim-title"
                eyebrow={`Qué cambia en ${sector.name.toLowerCase()}`}
                title={sector.claim}
                lead={sector.intro}
              />
              <ol className={styles.promises} aria-label="Tres promesas">
                {sector.promises.map((promise, index) => (
                  <li key={promise.label} style={{ "--i": index } as React.CSSProperties}>
                    <span className={styles.promiseLabel}>{promise.label}</span>
                    <p className={styles.promiseLines} aria-hidden="true">
                      <span>{promise.lineA}</span>
                      <span>{promise.lineB}</span>
                    </p>
                    <h3 className={styles.visuallyHidden}>{`${promise.lineA} ${promise.lineB}`}</h3>
                  </li>
                ))}
              </ol>
            </Band>

            {Diagram || sector.capabilities ? (
              <Band id="capacidades" labelledBy="capabilities-title" className={styles.pieces}>
                <SectionHead
                  id="capabilities-title"
                  eyebrow="Qué construimos"
                  title={
                    <>
                      Cada pieza dice <em>en qué estado está.</em>
                    </>
                  }
                  lead="En operación corre con un cliente; en construcción aún no tiene usuarios reales."
                />
                {Diagram ? (
                  <div className={styles.diagram}>
                    <Diagram />
                  </div>
                ) : null}
                {sector.capabilities ? (
                  <ol className={styles.capabilities}>
                    {sector.capabilities.map((capability) => (
                      <li key={capability.code} data-status={capability.status}>
                        <p className={styles.capabilityMeta}>
                          <span>{capability.code}</span>
                          <b title={STATUS_LABELS[capability.status]}>{capability.status}</b>
                        </p>
                        <h3>{capability.title}</h3>
                        <p>{capability.description}</p>
                        {capability.href ? (
                          <a href={capability.href} target="_blank" rel="noreferrer">
                            {capability.hrefLabel ?? capability.href} <span aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                ) : null}
              </Band>
            ) : null}

            {products.length > 0 ? (
              <Band id="productos" labelledBy="products-title" className={styles.products}>
                <SectionHead
                  id="products-title"
                  eyebrow="Productos que aplican"
                  title={
                    <>
                      Construidos por INPLUX, <em>en producción.</em>
                    </>
                  }
                  link={{ href: "/trabajo", label: "Ver todos los productos" }}
                />
                <CardGrid className={styles.productGrid}>
                  {products.map((product) => (
                    <Card
                      key={product.slug}
                      id={`p-${product.slug}`}
                      href={`/trabajo/${product.slug}`}
                      media={
                        <Image
                          src={workCaptures[product.slug].src}
                          alt=""
                          width={CAPTURA_ANCHO}
                          height={CAPTURA_ALTO}
                          sizes="(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 30vw"
                        />
                      }
                      meta={
                        <>
                          {product.category} ·{" "}
                          <span
                            className={cx(
                              statusTone(status[product.name] ?? product.status.label) === "pilot" && ui.pilot,
                            )}
                          >
                            {status[product.name] ?? product.status.label}
                          </span>
                        </>
                      }
                      title={product.name}
                      text={product.headline}
                    />
                  ))}
                </CardGrid>
              </Band>
            ) : null}

            {sector.framework ? (
              <Band id="norma" labelledBy="framework-title" className={styles.framework}>
                <SectionHead
                  id="framework-title"
                  eyebrow="Lo que incorporamos en el diseño"
                  title={
                    <>
                      La norma entra en el diseño, <em>no al final.</em>
                    </>
                  }
                  lead="Cada pieza se diseña con la regulación que le aplica a la vista. El enlace lleva a la fuente oficial."
                />
                <ul className={styles.frameworkList}>
                  {sector.framework.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} target="_blank" rel="noreferrer">
                        <strong>{item.label}</strong>
                        <span>{item.detail}</span>
                        <i aria-hidden="true">↗</i>
                      </a>
                    </li>
                  ))}
                </ul>
              </Band>
            ) : null}

            <section id="contacto" className={styles.cta} aria-labelledby="cta-title">
              <div className={`${ui.wrap} ${styles.ctaInner}`}>
                <p className={ui.eyebrow}>El siguiente paso</p>
                <h2 className={ui.d2} id="cta-title">
                  ¿Quieres ver por dónde entra la IA en tu operación?
                </h2>
                <p className={ui.lead}>{sector.closing.lead}</p>
                <div className={ui.actions}>
                  <ContactLink
                    className={buttonClass("primary")}
                    fallbackHref="/contacto"
                    source="sector-closing"
                  >
                    Empezar un proyecto
                  </ContactLink>
                  <Button href="mailto:gerencia@inplux.co">gerencia@inplux.co</Button>
                </div>
                <p className={ui.small}>
                  Contenido revisado el {formatShortDate(sector.verifiedAt)} · Sin nombres de
                  clientes hasta contar con su autorización escrita.
                </p>
              </div>
            </section>
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

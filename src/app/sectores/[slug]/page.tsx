import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectorSaludDiagram } from "@/components/sectors/SectorSaludDiagram";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactLink } from "@/components/site/ContactLink";
import { getSectorProfile, sectorProfiles, type SectorSlug } from "@/content/sectores";
import { formatShortDate } from "@/content/work-format";
import { buttonClass } from "@/components/v5/primitives";
import { V5Page } from "@/components/v5/V5Page";
import styles from "./sector.module.css";

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

  return {
    title: sector.title,
    description: sector.description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description: sector.description,
      url,
      siteName: "INPLUX S.A.S.",
      locale: "es_CO",
      type: "website",
      images: [
        {
          url: "/brand/og/og-default.png",
          width: 1200,
          height: 630,
          alt: "INPLUX, de un problema real a software en producción",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: sector.description,
      images: [
        {
          url: "/brand/og/og-default.png",
          alt: "INPLUX, de un problema real a software en producción",
        },
      ],
    },
  };
}

const diagrams: Record<SectorSlug, () => React.JSX.Element> = {
  salud: SectorSaludDiagram,
};

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = getSectorProfile(slug);
  if (!sector) notFound();

  const url = `${SITE_URL}/sectores/${sector.slug}`;
  const Diagram = diagrams[sector.slug];

  /*
   * `Service` y no `Product`: la página describe lo que hacemos para un tipo
   * de organización, no un producto con precio. El proveedor es la misma
   * organización del layout y la página cuelga del sitio por su `@id`. No se
   * declara cobertura geográfica: es una afirmación que el sitio no publica.
   */
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
        about: { "@id": `${url}#service` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: sector.title,
        serviceType: "Desarrollo de software a la medida para prestadores de salud",
        description: sector.lead,
        provider: { "@id": `${SITE_URL}/#organization` },
        audience: {
          "@type": "Audience",
          audienceType: "IPS, clínicas, hospitales y redes de prestadores de salud",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `Capacidades · ${sector.name}`,
          itemListElement: sector.capabilities.map((capability) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: capability.title,
              description: capability.description,
            },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: `Sector ${sector.name}`, item: url },
        ],
      },
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
            <section className={styles.hero} aria-labelledby="sector-title" data-header-theme="dark">
              <div className={styles.heroInner}>
                <div className={styles.heroCopy}>
                  <nav className={styles.crumbs} aria-label="Ruta">
                    <Link href="/">Inicio</Link>
                    <span aria-hidden="true">/</span>
                    <span>Sectores</span>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">{sector.name}</span>
                  </nav>
                  <p className={styles.eyebrow}>{sector.eyebrow}</p>
                  <h1 id="sector-title">
                    <span>{sector.headline[0]}</span>
                    <span>{sector.headline[1]}</span>
                  </h1>
                  <p className={styles.lead}>{sector.lead}</p>
                  <p className={styles.audience}>{sector.audience}</p>
                  <div className={styles.actions}>
                    <ContactLink
                      className={buttonClass("primary")}
                      fallbackHref="/contacto"
                      source="sector-hero"
                    >
                      Contar el caso
                    </ContactLink>
                    <a className={buttonClass("ghost")} href="#capacidades">
                      Ver las capacidades <span aria-hidden="true">↓</span>
                    </a>
                  </div>
                </div>
                <div className={styles.heroVisual}>
                  <Diagram />
                </div>
              </div>
            </section>

            <section className={styles.principles} aria-labelledby="principles-title">
              <div className={styles.inner}>
                <div className={styles.sectionHead}>
                  <div>
                    <p className={styles.eyebrowDark}>01 / CÓMO LO DISEÑAMOS</p>
                    <h2 id="principles-title">
                      Cuatro reglas antes de la <em>primera pantalla.</em>
                    </h2>
                  </div>
                </div>
                <ol className={styles.principleGrid}>
                  {sector.principles.map((principle, index) => (
                    <li key={principle.title}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <h3>{principle.title}</h3>
                      <p>{principle.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section id="capacidades" className={styles.capabilities} aria-labelledby="capabilities-title">
              <div className={styles.inner}>
                <div className={styles.sectionHead}>
                  <div>
                    <p className={styles.eyebrowDark}>02 / QUÉ CONSTRUIMOS</p>
                    <h2 id="capabilities-title">
                      Siete piezas. Cada una dice <em>en qué estado está.</em>
                    </h2>
                  </div>
                  <p>
                    En construcción es trabajo contratado que aún no opera con usuarios
                    reales. En operación corre con un cliente. Prototipo existe y se puede
                    abrir. Oferta es lo que diseñamos y cotizamos.
                  </p>
                </div>
                <ol className={styles.capabilityList}>
                  {sector.capabilities.map((capability) => (
                    <li className={styles.capability} key={capability.code} data-status={capability.status}>
                      <div className={styles.capabilityMeta}>
                        <span>{capability.code}</span>
                        <b>{capability.status}</b>
                      </div>
                      <div className={styles.capabilityBody}>
                        <h3>{capability.title}</h3>
                        <p>{capability.description}</p>
                        {capability.href ? (
                          <a href={capability.href} target="_blank" rel="noreferrer">
                            {capability.hrefLabel ?? capability.href} <span aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                      </div>
                      <ul className={styles.capabilityItems}>
                        {capability.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className={styles.framework} aria-labelledby="framework-title" data-header-theme="dark">
              <div className={styles.inner}>
                <div className={styles.sectionHead}>
                  <div>
                    <p className={styles.eyebrow}>03 / LO QUE INCORPORAMOS EN EL DISEÑO</p>
                    <h2 id="framework-title">
                      La norma entra en el diseño, <em>no al final.</em>
                    </h2>
                  </div>
                  <p>
                    Cada pieza se diseña con la regulación que le aplica a la vista. Estas son
                    las que más pesan en el trabajo con prestadores; el enlace lleva a la fuente
                    oficial.
                  </p>
                </div>
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
              </div>
            </section>

            <section id="contacto" className={styles.closing} aria-labelledby="closing-title" data-header-theme="dark">
              <div className={styles.inner}>
                <p className={styles.eyebrow}>04 / EL SIGUIENTE PASO</p>
                <h2 id="closing-title">{sector.closing.title}</h2>
                <p>{sector.closing.lead}</p>
                <div className={styles.actions}>
                  <ContactLink
                    className={buttonClass("primary")}
                    fallbackHref="/contacto"
                    source="sector-closing"
                  >
                    Empezar un proyecto
                  </ContactLink>
                  <a className={buttonClass("ghost")} href="mailto:gerencia@inplux.co">
                    gerencia@inplux.co
                  </a>
                </div>
                <p className={styles.verified}>
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

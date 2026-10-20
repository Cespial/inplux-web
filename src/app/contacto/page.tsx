import type { Metadata } from "next";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactForm } from "@/components/site/ContactForm";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import { Band, v5 as ui } from "@/components/v5/primitives";
import { breadcrumbJsonLdDocument, type Crumb } from "@/lib/breadcrumbs";
import styles from "./contacto.module.css";

/*
 * `/contacto` (octubre de 2026): como la página de contacto de primero.com,
 * unas pocas líneas, el correo y un formulario corto. El formulario prepara un
 * borrador en el correo de la persona; esta página no envía ni guarda nada.
 */

export const metadata: Metadata = {
  title: "Contacto — empecemos por el problema",
  description:
    "Cuéntanos qué debería cambiar en tu producto, operación o servicio. No necesitas llegar con requisitos ni alcance definidos.",
  alternates: {
    canonical: "https://inplux.co/contacto",
  },
  openGraph: {
    title: "Empecemos por el problema | INPLUX",
    description:
      "Comparte el reto. INPLUX te ayuda a convertirlo en una primera decisión de producto.",
    url: "https://inplux.co/contacto",
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
    title: "Empecemos por el problema | INPLUX",
    description:
      "Comparte el reto. No necesitas llegar con requisitos ni alcance definidos.",
    images: [
      {
        url: "/brand/og/og-default.png",
        alt: "INPLUX, de un problema real a software en producción",
      },
    ],
  },
};

const crumbs: Crumb[] = [{ label: "Inicio", href: "/" }, { label: "Contacto" }];

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contacto INPLUX",
  url: "https://inplux.co/contacto",
  mainEntity: {
    "@id": "https://inplux.co/#organization",
  },
};

export default function ContactoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLdDocument(crumbs, "https://inplux.co/contacto")) }}
      />
      <ContactDialogProvider>
        <V5Page className={styles.root}>
          <main id="main-content" tabIndex={-1}>
            <section id="inicio" aria-labelledby="contact-title">
              <PageHero
                className={styles.hero}
                eyebrow="Contacto"
                title={<span id="contact-title">Empecemos por el problema.</span>}
                lead="¿Qué proceso quieres mejorar y en qué sistema vive?"
                leadMuted="Con eso dimensionamos lo que sigue. No necesitas requisitos ni alcance definidos."
                crumbs={crumbs}
              />
            </section>

            <Band id="escribir" labelledBy="form-title" className={styles.contact}>
              <div className={styles.grid}>
                <div className={styles.direct}>
                  <p className={ui.eyebrow}>Escríbenos</p>
                  <h2 className={ui.d2} id="form-title">
                    Una persona del equipo <em>responde.</em>
                  </h2>
                  <ul className={styles.channels} aria-label="Canales directos">
                    <li>
                      <a href="mailto:gerencia@inplux.co">gerencia@inplux.co</a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/company/inplux" target="_blank" rel="noreferrer">
                        LinkedIn <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                    <li>Medellín, Colombia</li>
                  </ul>
                </div>
                <div className={styles.panel}>
                  <ContactForm context="section" />
                </div>
              </div>
            </Band>
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

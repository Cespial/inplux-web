import type { Metadata } from "next";
import { languageAlternates } from "@/content/i18n";
import Link from "next/link";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactForm } from "@/components/site/ContactForm";
import { NextPage } from "@/components/v5/NextPage";
import { PageHero } from "@/components/v5/PageHero";
import { V5Page } from "@/components/v5/V5Page";
import { Band, v5 as ui } from "@/components/v5/primitives";
import { breadcrumbJsonLdDocument, type Crumb } from "@/lib/breadcrumbs";
import { NO_JS_TARGET } from "@/lib/contact/fields.mjs";
import styles from "./contacto.module.css";

/*
 * `/contacto` (octubre de 2026): como la página de contacto de primero.com,
 * unas pocas líneas, el correo y un formulario corto. El formulario envía a
 * `/api/contacto` (Resend); sin clave configurada cae al borrador por correo.
 *
 * La página sigue siendo estática. El envío sin JS vuelve aquí con un 303 a
 * `/contacto?…#<ancla>` y el aviso correspondiente se muestra con `:target`:
 * no hace falta leer la query en el servidor ni ejecutar JS.
 */

const noJsNotices = [
  { id: NO_JS_TARGET.sent, text: "Recibimos tu mensaje. Una persona del equipo te responde a tu correo." },
  {
    id: NO_JS_TARGET.invalid,
    text: "No pudimos enviar el mensaje: falta un dato o tiene un formato que no reconocemos. Vuelve a intentarlo.",
  },
  {
    id: NO_JS_TARGET.limited,
    text: "Llegaron varios mensajes seguidos desde tu conexión. Espera unos minutos y vuelve a intentarlo.",
  },
  {
    id: NO_JS_TARGET.unavailable,
    text: "No pudimos enviar el mensaje desde aquí. Escríbenos directo a gerencia@inplux.co.",
  },
];

export const metadata: Metadata = {
  title: "Contacto — empecemos por el problema",
  description:
    "Cuéntanos qué debería cambiar en tu producto, operación o servicio. No necesitas llegar con requisitos ni alcance definidos.",
  alternates: {
    canonical: "https://inplux.co/contacto",
    languages: languageAlternates("/contacto"),
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
        url: "/brand/og/og-contacto.jpg",
        width: 1200,
        height: 630,
        alt: "INPLUX · Contacto. Empecemos por el problema.",
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
        url: "/brand/og/og-contacto.jpg",
        alt: "INPLUX · Contacto. Empecemos por el problema.",
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
                  <p className={styles.security}>
                    <Link href="/seguridad">Cómo cuidamos los datos que nos compartes</Link>
                  </p>
                </div>
                <div className={styles.panel}>
                  {noJsNotices.map((notice) => (
                    <p key={notice.id} id={notice.id} className={styles.notice} tabIndex={-1}>
                      {notice.text}
                    </p>
                  ))}
                  <ContactForm context="section" />
                </div>
              </div>
            </Band>
            <NextPage href="/como-trabajamos" label="Cómo trabajamos" />
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

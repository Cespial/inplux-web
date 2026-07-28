import type { Metadata } from "next";
import Link from "next/link";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { ContactForm } from "@/components/site/ContactForm";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import styles from "./contacto.module.css";

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

const prompts = [
  {
    number: "01",
    title: "¿Qué ocurre hoy?",
    copy: "La situación, el flujo o la experiencia que está produciendo fricción.",
  },
  {
    number: "02",
    title: "¿Quién lo vive?",
    copy: "Las personas, equipos o usuarios involucrados en ese contexto.",
  },
  {
    number: "03",
    title: "¿Qué debería cambiar?",
    copy: "El resultado que permitiría reconocer que el proyecto está ayudando.",
  },
] as const;

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
      <ContactDialogProvider>
        <div className={styles.contactRoot}>
          <SiteHeader inverseOnTop />
          <main id="main-content" tabIndex={-1}>
            <section
              className={styles.hero}
              data-header-theme="dark"
              aria-labelledby="contact-title"
            >
              <div className={styles.heroCopy}>
                <p className={styles.eyebrow}>
                  <span>00</span> Iniciar un proyecto
                </p>
                <h1 id="contact-title">
                  Empecemos por el <em>problema.</em>
                </h1>
                <p>
                  No necesitas llegar con requisitos, una tecnología escogida o el
                  alcance resuelto. Cuéntanos qué ocurre y qué debería cambiar.
                </p>
                <a href="#escribir">
                  Contar el reto <span aria-hidden="true">↓</span>
                </a>
              </div>

              <div className={styles.heroBrief} aria-hidden="true">
                <div className={styles.briefHeader}>
                  <span>CREATE PROJECT</span>
                  <span>INPLUX FACTORY / BRIEF</span>
                </div>
                <div className={styles.briefBody}>
                  <div className={styles.briefStatus}>
                    <span>PRIMERA SEÑAL</span>
                    <strong>UN PROBLEMA REAL</strong>
                  </div>
                  <ol>
                    <li><span>01</span><i /> QUÉ OCURRE</li>
                    <li><span>02</span><i /> QUIÉN LO VIVE</li>
                    <li><span>03</span><i /> QUÉ DEBERÍA CAMBIAR</li>
                  </ol>
                  <div className={styles.briefResult}>
                    <span>SIGUIENTE PASO</span>
                    <strong>COMPRENDER ANTES DE PROPONER</strong>
                  </div>
                </div>
                <div className={styles.briefFooter}>
                  <span><i /> NO REQUIERE DOCUMENTO PREVIO</span>
                  <span>CTX / 00</span>
                </div>
              </div>
            </section>

            <section className={styles.prepare} aria-labelledby="prepare-title">
              <p className={styles.eyebrow}>
                <span>01</span> Antes de escribir
              </p>
              <div>
                <h2 id="prepare-title">
                  Tres preguntas son suficientes para{" "}
                  <em>comenzar.</em>
                </h2>
                <p>
                  Si todavía no sabes qué software necesitas, está bien. Esa
                  definición es parte del trabajo.
                </p>
              </div>
              <ol>
                {prompts.map((prompt) => (
                  <li key={prompt.number}>
                    <span>{prompt.number}</span>
                    <div>
                      <h3>{prompt.title}</h3>
                      <p>{prompt.copy}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section
              id="escribir"
              className={styles.formSection}
              data-header-theme="dark"
              aria-labelledby="form-title"
            >
              <div className={styles.formCopy}>
                <p className={styles.eyebrow}>
                  <span>02</span> Compartir el reto
                </p>
                <h2 id="form-title">
                  ¿Qué necesitas <em>cambiar?</em>
                </h2>
                <p>
                  El formulario prepara un borrador en tu aplicación de correo.
                  Esta página no enviará ni almacenará la información.
                </p>

                <div className={styles.directChannels}>
                  <p>También puedes escribir directamente</p>
                  <a href="mailto:gerencia@inplux.co">
                    gerencia@inplux.co <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/inplux"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn <span aria-hidden="true">↗</span>
                  </a>
                  <span>Medellín, Colombia</span>
                </div>
              </div>
              <div className={styles.formPanel}>
                <div className={styles.formPanelHeader}>
                  <span>PROJECT BRIEF / 01</span>
                  <span>CANAL / CORREO</span>
                </div>
                <ContactForm context="section" />
              </div>
            </section>

            <section className={styles.after} aria-labelledby="after-title">
              <p className={styles.eyebrow}>
                <span>03</span> Qué sigue
              </p>
              <div>
                <h2 id="after-title">
                  Primero entendemos. Después proponemos una{" "}
                  <em>dirección.</em>
                </h2>
              </div>
              <ol>
                <li>
                  <span>01</span>
                  <p>Revisamos el contexto que compartiste y las preguntas que deja abiertas.</p>
                </li>
                <li>
                  <span>02</span>
                  <p>Conversamos para comprender personas, reglas, riesgos y resultado esperado.</p>
                </li>
                <li>
                  <span>03</span>
                  <p>Si existe un encaje, proponemos cómo definir la primera versión útil.</p>
                </li>
              </ol>
              <Link href="/fabrica">
                Conocer el sistema de la fábrica <span aria-hidden="true">↗</span>
              </Link>
            </section>
          </main>
          <SiteFooter />
        </div>
      </ContactDialogProvider>
    </>
  );
}

import type { Metadata } from "next";
import { languageAlternates } from "@/content/i18n";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { LegalShell } from "@/components/v5/LegalShell";
import { NextPage } from "@/components/v5/NextPage";
import { V5Page } from "@/components/v5/V5Page";
import styles from "./seguridad.module.css";

/*
 * `/seguridad` (octubre de 2026): lo que hacemos hoy con los datos de cada
 * cliente, en pocas líneas. Cada frase está aprobada por la dirección; no
 * sumes sellos, certificaciones, porcentajes ni promesas de disponibilidad.
 */

const PAGE_URL = "https://inplux.co/seguridad";
const description =
  "Cómo cuida INPLUX los datos de cada cliente: cifrado, acceso por rol, datos separados, modelos que no entrenan con ellos y el marco legal que aplica.";
const socialTitle = "Seguridad y datos | INPLUX";
const socialDescription =
  "Cifrado, acceso por rol, datos separados por cliente y modelos que no entrenan con ellos. Sin sellos ni promesas que no podamos sostener.";
const socialImage = "/brand/og/og-seguridad.jpg";
const socialImageAlt = "INPLUX · Seguridad. Cómo cuidamos los datos de cada cliente.";

export const metadata: Metadata = {
  title: "Seguridad y datos",
  description,
  alternates: { canonical: PAGE_URL, languages: languageAlternates("/seguridad") },
  openGraph: {
    title: socialTitle,
    description: socialDescription,
    url: PAGE_URL,
    siteName: "INPLUX S.A.S.",
    locale: "es_CO",
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: socialImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: socialDescription,
    images: [{ url: socialImage, alt: socialImageAlt }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  name: "Seguridad y datos",
  url: PAGE_URL,
  description,
  inLanguage: "es-CO",
  dateModified: "2026-10-20",
  isPartOf: { "@id": "https://inplux.co/#website" },
  about: { "@id": "https://inplux.co/#organization" },
};

const sections = [
  ["cifrado", "Cifrado"],
  ["acceso", "Acceso por rol"],
  ["separacion", "Datos separados"],
  ["modelos", "Modelos"],
  ["region", "Región"],
  ["normativa", "Normativa"],
  ["vulnerabilidades", "Vulnerabilidades"],
] as const;

export default function SeguridadPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactDialogProvider>
        <V5Page>
          <main id="main-content" tabIndex={-1}>
            <LegalShell
              eyebrow="Seguridad"
              title={
                <>
                  Cómo cuidamos <em>los datos.</em>
                </>
              }
              subtitle="Lo que hacemos hoy con la información de cada cliente, en pocas líneas."
              updated={{ label: "Actualizado", value: "20 de octubre de 2026" }}
            >
              <nav className={styles.toc} aria-label="En esta página">
                {sections.map(([id, label]) => (
                  <a key={id} href={`#${id}`}>
                    {label}
                  </a>
                ))}
              </nav>

              <section className={styles.section} aria-labelledby="cifrado">
                <h2 id="cifrado">Cifrado</h2>
                <p>
                  Los datos viajan cifrados con TLS. En reposo quedan cifrados por el cifrado de disco
                  de los proveedores de nube donde se alojan.
                </p>
              </section>

              <section className={styles.section} aria-labelledby="acceso">
                <h2 id="acceso">Acceso por rol</h2>
                <p>
                  Cada persona ve solo lo que su rol le permite. Las acciones sensibles quedan
                  registradas con fecha y autor.
                </p>
              </section>

              <section className={styles.section} aria-labelledby="separacion">
                <h2 id="separacion">Datos separados por cliente</h2>
                <p>Los datos de cada cliente van separados. Nunca se mezclan entre entidades.</p>
              </section>

              <section className={styles.section} aria-labelledby="modelos">
                <h2 id="modelos">Los modelos no aprenden de tus datos</h2>
                <p>
                  Usamos los modelos de IA a través de APIs que no entrenan con los datos que se les
                  envían. La información de un cliente no se usa para entrenar modelos.
                </p>
              </section>

              <section className={styles.section} aria-labelledby="region">
                <h2 id="region">Dónde quedan los datos</h2>
                <p>
                  La región donde se alojan los datos se acuerda con cada cliente, según la normativa
                  que le aplica.
                </p>
              </section>

              <section className={styles.section} aria-labelledby="normativa">
                <h2 id="normativa">Normativa</h2>
                <p>
                  Tratamos los datos personales conforme a la{" "}
                  <a
                    href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ley 1581 de 2012
                  </a>
                  , con el cuidado adicional que exige para los datos sensibles. En salud tenemos en
                  cuenta además la{" "}
                  <a
                    href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%20No.%20866%20de%202021.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Resolución 866 de 2021
                  </a>{" "}
                  del Ministerio de Salud, sobre la historia clínica electrónica.
                </p>
              </section>

              <section className={styles.section} aria-labelledby="vulnerabilidades">
                <h2 id="vulnerabilidades">Reportar una vulnerabilidad</h2>
                <p>
                  Si encuentras una falla de seguridad en algo que hayamos construido, escríbenos a{" "}
                  <a href="mailto:gerencia@inplux.co?subject=Reporte%20de%20vulnerabilidad">
                    gerencia@inplux.co
                  </a>{" "}
                  con los pasos para reproducirla, y no la divulgues mientras la revisamos.
                </p>
              </section>
            </LegalShell>
            <NextPage href="/como-trabajamos" label="Cómo trabajamos" />
          </main>
        </V5Page>
      </ContactDialogProvider>
    </>
  );
}

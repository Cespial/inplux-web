import type { Metadata } from "next";
import Link from "next/link";
import { FactorySystemDemo } from "@/components/routes/FactorySystemDemo.client";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { method } from "@/content/home";
import styles from "./fabrica.module.css";

export const metadata: Metadata = {
  title: "La fábrica — cómo convertimos un problema en software",
  description:
    "Conoce el sistema de INPLUX para entender el contexto, definir el producto, construir una primera versión útil y evolucionarla con evidencia.",
  alternates: {
    canonical: "https://inplux.co/fabrica",
  },
  openGraph: {
    title: "La fábrica de INPLUX",
    description:
      "Contexto, criterio, construcción y evolución: un sistema para convertir problemas reales en software útil.",
    url: "https://inplux.co/fabrica",
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
    title: "La fábrica de INPLUX",
    description:
      "El sistema con el que convertimos problemas reales en software útil.",
    images: [
      {
        url: "/brand/og/og-default.png",
        alt: "INPLUX, de un problema real a software en producción",
      },
    ],
  },
};

const commitments = [
  {
    number: "01",
    title: "El problema antes que la solución.",
    copy:
      "No empezamos escogiendo una tecnología. Empezamos identificando qué ocurre, quién lo vive y qué debería cambiar.",
  },
  {
    number: "02",
    title: "Una primera versión que pueda enseñar.",
    copy:
      "Acotamos el alcance para poner algo útil en operación y obtener evidencia, no para simular que todo quedó resuelto.",
  },
  {
    number: "03",
    title: "Una sola conversación de producto.",
    copy:
      "Contexto, experiencia, software, datos y pruebas se revisan juntos para evitar que la intención se pierda entre entregables.",
  },
  {
    number: "04",
    title: "Dirección humana donde importa.",
    copy:
      "La inteligencia artificial acelera tareas especializadas. El equipo conserva el criterio, la validación y la responsabilidad.",
  },
] as const;

const factoryChain = [
  {
    number: "01",
    phase: "Contexto",
    action: "Entender el reto",
  },
  {
    number: "02",
    phase: "Criterio",
    action: "Definir el producto",
  },
  {
    number: "03",
    phase: "Construcción",
    action: "Construir y probar",
  },
  {
    number: "04",
    phase: "Evolución",
    action: "Lanzar y aprender",
  },
] as const;

const factoryJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "La fábrica de INPLUX",
  url: "https://inplux.co/fabrica",
  description:
    "El sistema de INPLUX para convertir problemas reales en software útil.",
  isPartOf: {
    "@type": "WebSite",
    name: "INPLUX",
    url: "https://inplux.co",
  },
};

export default function FabricaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(factoryJsonLd) }}
      />
      <ContactDialogProvider>
        <div className={styles.factoryRoot}>
          <SiteHeader inverseOnTop />
          <main id="main-content" tabIndex={-1}>
            <section
              className={styles.hero}
              data-header-theme="dark"
              aria-labelledby="factory-title"
            >
              <div className={styles.heroCopy}>
                <p className={styles.eyebrow}>
                  <span>00</span> Un sistema de decisiones
                </p>
                <h1 id="factory-title">
                  Del contexto al software. <em>Sin perder el criterio.</em>
                </h1>
                <p className={styles.heroLead}>
                  Contexto, criterio, construcción y evolución: cuatro movimientos
                  conectados para llevar una primera versión útil a operación y
                  aprender de ella.
                </p>
                <div className={styles.heroActions}>
                  <a href="#demostracion">
                    Ver el sistema en vivo <span aria-hidden="true">↓</span>
                  </a>
                  <Link href="/contacto">Traer un reto a la fábrica</Link>
                </div>
              </div>

              <div className={styles.heroMachine} aria-hidden="true">
                <div className={styles.machineHeader}>
                  <span>MAPA DE DECISIONES</span>
                  <span>INPLUX FACTORY / CICLO 01</span>
                </div>
                <div className={styles.machineScene}>
                  <div className={styles.machineQuestion}>
                    <span>PREGUNTA DE ENTRADA</span>
                    <p>¿Qué debería cambiar?</p>
                    <small><i /> PROBLEMA REAL</small>
                  </div>

                  <ol className={styles.machineFlow}>
                    {factoryChain.map((step) => (
                      <li key={step.number}>
                        <span>{step.number}</span>
                        <div>
                          <b>{step.phase}</b>
                          <small>{step.action}</small>
                        </div>
                        <i />
                      </li>
                    ))}
                  </ol>

                  <div className={styles.machineContinuity}>
                    <span>CONTINUIDAD</span>
                    <p>La salida de cada fase alimenta la siguiente.</p>
                    <b>EVIDENCIA → SIGUIENTE DECISIÓN</b>
                  </div>
                </div>
                <div className={styles.machineFooter}>
                  <span><i /> DIRECCIÓN HUMANA</span>
                  <span>SISTEMA / CONECTADO</span>
                </div>
              </div>
            </section>

            <section className={styles.premise} aria-labelledby="premise-title">
              <p className={styles.eyebrow}>
                <span>01</span> La premisa
              </p>
              <div>
                <h2 id="premise-title">
                  Construir rápido solo sirve si estamos construyendo{" "}
                  <em>lo correcto.</em>
                </h2>
                <p>
                  La fábrica combina investigación, pensamiento de producto,
                  diseño, ingeniería e inteligencia artificial. No son estaciones
                  aisladas: son partes de una misma decisión.
                </p>
              </div>
              <div className={styles.premiseIndex} aria-label="Resumen del sistema">
                {factoryChain.map((step) => (
                  <span key={step.number}>
                    {step.number} / {step.phase.toUpperCase()}
                  </span>
                ))}
              </div>
            </section>

            <section
              id="demostracion"
              className={styles.demoSection}
              aria-labelledby="demo-title"
            >
              <div className={styles.sectionIntro}>
                <p className={styles.eyebrow}>
                  <span>02</span> La fábrica en vivo
                </p>
                <h2 id="demo-title">
                  Cuatro movimientos. <em>Un mismo hilo de decisión.</em>
                </h2>
                <p>
                  Abre cada fase para ver qué señales entran, qué decisión se trabaja y
                  qué salida alimenta la siguiente. No hay una transferencia ciega entre
                  equipos.
                </p>
              </div>
              <FactorySystemDemo />
            </section>

            <section className={styles.sequence} aria-labelledby="sequence-title">
              <div className={styles.sequenceIntro}>
                <p className={styles.eyebrow}>
                  <span>03</span> El recorrido
                </p>
                <h2 id="sequence-title">
                  De una pregunta abierta a una versión que puede{" "}
                  <em>aprender.</em>
                </h2>
              </div>
              <ol>
                {method.map((step) => (
                  <li key={step.number}>
                    <span>{step.number}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.copy}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className={styles.commitments} aria-labelledby="commitments-title">
              <div className={styles.commitmentsHeading}>
                <p className={styles.eyebrow}>
                  <span>04</span> Lo que cuidamos
                </p>
                <h2 id="commitments-title">
                  Velocidad con <em>responsabilidad.</em>
                </h2>
              </div>
              <div className={styles.commitmentsGrid}>
                {commitments.map((item) => (
                  <article key={item.number}>
                    <span>{item.number}</span>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.closing} data-header-theme="dark">
              <p className={styles.eyebrow}>
                <span>05</span> Siguiente movimiento
              </p>
              <div>
                <h2>
                  Trae el problema. Diseñemos juntos la primera{" "}
                  <em>decisión útil.</em>
                </h2>
                <Link href="/contacto">
                  Empezar un proyecto <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </section>
          </main>
          <SiteFooter />
        </div>
      </ContactDialogProvider>
    </>
  );
}

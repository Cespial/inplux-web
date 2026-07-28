import type { Metadata } from "next";
import Link from "next/link";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import styles from "./system-states.module.css";

export const metadata: Metadata = {
  title: { absolute: "Página no encontrada — INPLUX" },
  description: "La ruta que buscas no existe o cambió de lugar.",
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function NotFound() {
  return (
    <ContactDialogProvider>
      <div className={styles.stateRoot}>
        <SiteHeader inverseOnTop />
        <main id="main-content" className={styles.notFound} tabIndex={-1}>
          <div className={styles.stateGrid} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className={styles.stateMeta}>
            <span>SYS / 404</span>
            <span>RUTA NO ENCONTRADA</span>
          </div>
          <div className={styles.stateCopy}>
            <p>La fábrica sigue activa.</p>
            <h1>
              Esta ruta no llegó a <em>producción.</em>
            </h1>
            <p>
              Puede que el enlace haya cambiado. Desde el inicio puedes volver al
              recorrido principal o explorar el trabajo de INPLUX.
            </p>
            <div className={styles.stateActions}>
              <Link href="/">Volver al inicio <span aria-hidden="true">→</span></Link>
              <Link href="/trabajo">Explorar trabajo real</Link>
            </div>
          </div>
          <p className={styles.stateFoot}>CONTEXTO → CRITERIO → PRODUCTO</p>
        </main>
        <SiteFooter />
      </div>
    </ContactDialogProvider>
  );
}

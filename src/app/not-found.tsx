import type { Metadata } from "next";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { V5Page } from "@/components/v5/V5Page";
import { Button, v5 as ui } from "@/components/v5/primitives";
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
      <V5Page>
        <main id="main-content" className={styles.state} tabIndex={-1}>
          <div className={`${ui.wrap} ${styles.stateInner}`}>
            <p className={ui.eyebrow}>Error 404</p>
            <h1 className={ui.d2}>
              Esta página no existe <em>o cambió de lugar.</em>
            </h1>
            <p className={ui.lead}>
              Puede que el enlace sea viejo. Desde el inicio llegas a los productos, los sectores y
              el equipo.
            </p>
            <div className={ui.actions}>
              <Button href="/" variant="primary">
                Volver al inicio
              </Button>
              <Button href="/trabajo">Ver productos</Button>
            </div>
          </div>
        </main>
      </V5Page>
    </ContactDialogProvider>
  );
}

import Image from "next/image";
import Link from "next/link";
import { productNavigation, publicNavigation } from "@/content/navigation";
import styles from "./SiteChrome.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <h2 className="site-visually-hidden">Pie de página</h2>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Image
              src="/brand/logos/inplux-logo-horizontal-inverse.svg"
              alt="INPLUX"
              width={403}
              height={112}
            />
            <p>Fábrica de software a la medida para empresas y entidades.</p>
          </div>
          <nav aria-label="Explorar">
            <p>Explora</p>
            {publicNavigation.map(([label, href]) => (
              <Link href={href} key={href} prefetch={false}>{label}</Link>
            ))}
          </nav>
          <nav aria-label="Productos documentados">
            <p>Productos</p>
            {productNavigation.map(([label, href]) => (
              <Link href={href} key={href} prefetch={false}>{label}</Link>
            ))}
          </nav>
          <nav aria-label="Capacidades">
            <p>Capacidades</p>
            <Link href="/capacidades#producto" prefetch={false}>Producto digital</Link>
            <Link href="/capacidades#modernizacion" prefetch={false}>Modernización</Link>
            <Link href="/capacidades#ia" prefetch={false}>IA aplicada</Link>
            <Link href="/capacidades#sector-publico" prefetch={false}>Servicios públicos</Link>
          </nav>
          <nav aria-label="Contacto">
            <p>Contacto</p>
            <Link href="/contacto" prefetch={false}>Empezar un proyecto</Link>
            <a href="mailto:gerencia@inplux.co">gerencia@inplux.co</a>
            <a href="https://www.linkedin.com/company/inplux" target="_blank" rel="noreferrer">LinkedIn</a>
            <span>Medellín, Colombia</span>
          </nav>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} INPLUX S.A.S.</span>
          <span>Software con criterio y dirección humana.</span>
        </div>
      </div>
    </footer>
  );
}

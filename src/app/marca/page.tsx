import Image from "next/image";
import { CopyableColor } from "@/components/brand/CopyableColor";
import { ContactDialogProvider } from "@/components/site/ContactDialog";
import { LegalShell } from "@/components/v5/LegalShell";
import { NextPage } from "@/components/v5/NextPage";
import { V5Page } from "@/components/v5/V5Page";
import styles from "./marca.module.css";

/**
 * `/marca`: la guía interna de identidad, fuera de los índices. Desde octubre
 * de 2026 vive en el cascarón v5 y se reduce a lo que alguien viene a buscar:
 * los archivos del logo, los colores con su código y la regla tipográfica. Los
 * valores de color son los de `tokens/v5.css`, los que pinta el sitio.
 */

const colors = [
  { name: "Negro", hex: "#0C0C0B", use: "Fondos y texto de alto contraste." },
  { name: "Marfil", hex: "#F6F2EC", use: "Superficies de lectura y texto sobre negro." },
  { name: "Papel", hex: "#EFE9E0", use: "Bandas claras y paneles." },
  { name: "Teal", hex: "#00D7CA", use: "Señal, foco y estado activo sobre negro." },
  { name: "Teal tinta", hex: "#007A72", use: "El mismo acento sobre fondos claros." },
  { name: "Neutral", hex: "#A39D94", use: "Texto secundario y metadatos." },
] as const;

const logoAssets = [
  {
    name: "Lockup horizontal",
    note: "Uso principal",
    src: "/brand/logos/inplux-logo-horizontal.svg",
    width: 403,
    height: 112,
    inverse: false,
    downloads: [
      ["/brand/logos/inplux-logo-horizontal.svg", "SVG"],
      ["/brand/logos/inplux-logo-horizontal.png", "PNG"],
    ],
  },
  {
    name: "Lockup inverso",
    note: "Fondos oscuros",
    src: "/brand/logos/inplux-logo-horizontal-inverse.svg",
    width: 403,
    height: 112,
    inverse: true,
    downloads: [["/brand/logos/inplux-logo-horizontal-inverse.svg", "SVG"]],
  },
  {
    name: "Símbolo",
    note: "Espacios compactos",
    src: "/brand/logos/inplux-mark-teal.svg",
    width: 100,
    height: 100,
    inverse: false,
    downloads: [["/brand/logos/inplux-mark-teal.svg", "SVG"]],
  },
  {
    name: "Ícono de aplicación",
    note: "Superficies cuadradas",
    src: "/brand/logos/inplux-appicon.svg",
    width: 100,
    height: 100,
    inverse: false,
    downloads: [
      ["/brand/logos/inplux-appicon.svg", "SVG"],
      ["/brand/favicon/maskable-512.png", "PNG"],
    ],
  },
] as const;

export default function MarcaPage() {
  return (
    <ContactDialogProvider>
      <V5Page>
        <main id="main-content" tabIndex={-1}>
          <LegalShell
            eyebrow="Sistema de marca"
            title={
              <>
                Una marca, <em>los archivos maestros.</em>
              </>
            }
            subtitle="Logo, color y tipografía de INPLUX. Usa siempre estos archivos: no reconstruyas, deformes ni añadas efectos."
          >
            <section className={styles.section} aria-labelledby="logo-title">
              <h2 id="logo-title">Logo</h2>
              <p>
                El lockup completo cuando hay espacio; por debajo de 120 px de ancho, el símbolo.
                Alrededor, un margen mínimo igual a la altura del símbolo.
              </p>
              <ul className={styles.logos}>
                {logoAssets.map((asset) => (
                  <li key={asset.name}>
                    <div className={styles.stage} data-inverse={asset.inverse || undefined}>
                      <Image
                        src={asset.src}
                        alt={`${asset.name} de INPLUX`}
                        width={asset.width}
                        height={asset.height}
                      />
                    </div>
                    <p className={styles.meta}>
                      <strong>{asset.name}</strong>
                      <span>{asset.note}</span>
                    </p>
                    <p className={styles.downloads}>
                      {asset.downloads.map(([href, label]) => (
                        <a key={href} href={href} download>
                          {label} <span aria-hidden="true">↓</span>
                        </a>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section} aria-labelledby="color-title">
              <h2 id="color-title">Color</h2>
              <p>Negro para profundidad, teal para señal. El acento marca foco y estado; no reemplaza la jerarquía.</p>
              <ul className={styles.colors}>
                {colors.map((color) => (
                  <li key={color.hex}>
                    <span className={styles.swatch} style={{ backgroundColor: color.hex }} aria-hidden="true" />
                    <strong>{color.name}</strong>
                    <span>{color.use}</span>
                    <CopyableColor hex={color.hex} className={styles.copy} />
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section} aria-labelledby="type-title">
              <h2 id="type-title">Tipografía</h2>
              <p>
                Rethink Sans para todo: titulares, texto, etiquetas y datos. La jerarquía sale del
                tamaño, el peso (400 y 500) y el espaciado, nunca de cambiar de letra.
              </p>
              <p className={styles.specimen} aria-hidden="true">
                Transformación con IA, <em>en producción.</em>
              </p>
            </section>
          </LegalShell>
          <NextPage href="/" label="Inicio" />
        </main>
      </V5Page>
    </ContactDialogProvider>
  );
}

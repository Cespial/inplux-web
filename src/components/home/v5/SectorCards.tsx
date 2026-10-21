import Image from "next/image";
import Link from "next/link";
import { sectorSlugEn } from "@/content/i18n";
import { sectorProfiles } from "@/content/sectores";
import styles from "./SectorCards.module.css";

/**
 * Las tarjetas de sector de la portada: foto vertical (3:4), el nombre abajo
 * sobre un velo y una línea que se despliega al señalarla. En escritorio caben
 * las cuatro; por debajo de 1100 px son un carrusel con `scroll-snap` que se
 * recorre con el dedo o con Tab. El texto llega del copy de cada idioma; la
 * foto, de `sectores.ts` por la ruta de la página.
 */
export function SectorCards({
  items,
}: {
  items: readonly { title: string; detail: string; href: string }[];
}) {
  return (
    <ul className={styles.cards} data-reveal-children="media">
      {items.map((item) => {
        const sector = sectorProfiles.find(
          (profile) =>
            item.href === `/sectores/${profile.slug}` ||
            item.href === `/en/sectors/${sectorSlugEn[profile.slug]}`,
        );
        if (!sector) throw new Error(`Falta el sector de ${item.href} en sectores.ts`);
        return (
          <li key={item.href}>
            <Link href={item.href} className={styles.card}>
              <Image
                src={sector.card.image}
                alt=""
                width={900}
                height={1200}
                sizes="(max-width: 760px) 72vw, (max-width: 1100px) 40vw, 24vw"
              />
              <div className={styles.text}>
                <h3>
                  {item.title} <i aria-hidden="true">→</i>
                </h3>
                <div className={styles.more}>
                  <p>{item.detail}</p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

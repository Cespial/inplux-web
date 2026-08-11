import Image from "next/image";
import Link from "next/link";
import { homeCopyEs } from "@/content/copy/es";
import type { FooterCopy } from "@/content/copy/types";
import styles from "./SiteChrome.module.css";

export function SiteFooter({ copy = homeCopyEs.footer }: { copy?: FooterCopy }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <h2 className="site-visually-hidden">{copy.heading}</h2>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Image
              src="/brand/logos/inplux-logo-horizontal-inverse.svg"
              alt="INPLUX"
              width={403}
              height={112}
            />
            <p>{copy.tagline}</p>
          </div>
          {copy.groups.map((group) => (
            <nav aria-label={group.ariaLabel} key={group.ariaLabel}>
              <p>{group.label}</p>
              {group.items.map((item) => (
                <Link
                  href={item.href}
                  hrefLang={item.hrefLang}
                  key={item.href}
                  prefetch={false}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ))}
          <nav aria-label={copy.contactAriaLabel}>
            <p>{copy.contactLabel}</p>
            <Link href="/contacto" prefetch={false}>{copy.contactCta}</Link>
            <a href={`mailto:${copy.email}`}>{copy.email}</a>
            <a href="https://www.linkedin.com/company/inplux" target="_blank" rel="noreferrer">{copy.linkedInLabel}</a>
            {copy.locations.map((location) => (
              <span key={location}>{location}</span>
            ))}
            {copy.languageNote ? <small>{copy.languageNote}</small> : null}
          </nav>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()}{` ${copy.copyright}`}</span>
          <span>{copy.closingLine}</span>
        </div>
      </div>
    </footer>
  );
}

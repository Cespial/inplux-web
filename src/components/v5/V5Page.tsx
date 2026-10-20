import type { ReactNode } from "react";
import type { ContactSource } from "@/components/site/ContactLink";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { FooterCopy, HeaderCopy } from "@/content/copy/types";
import ui from "./v5.module.css";

/**
 * El cascarón de una página v5: la raíz con los resets del sistema, la
 * cabecera y el pie del sitio. Lo que va dentro lo pone la página, incluido su
 * `<main id="main-content" tabIndex={-1}>` y, si lo usa, el
 * `<ContactDialogProvider>`: `verify-public-content` busca esos literales en
 * el fuente de cada `page.tsx`, así que no pueden vivir aquí.
 */
export function V5Page({
  children,
  lang,
  headerCopy,
  footerCopy,
  desktopContactSource,
  mobileContactSource,
  className,
}: {
  children: ReactNode;
  lang?: string;
  headerCopy?: HeaderCopy;
  footerCopy?: FooterCopy;
  desktopContactSource?: ContactSource;
  mobileContactSource?: ContactSource;
  className?: string;
}) {
  return (
    <div className={`${ui.root}${className ? ` ${className}` : ""}`} lang={lang}>
      <SiteHeader
        copy={headerCopy}
        desktopContactSource={desktopContactSource}
        inverseOnTop
        mobileContactSource={mobileContactSource}
      />
      {children}
      <SiteFooter copy={footerCopy} />
    </div>
  );
}

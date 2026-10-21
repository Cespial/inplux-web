import { homeCopyEn } from "@/content/copy/en";

/**
 * Lo que comparten todas las páginas inglesas bajo `/en`: la cabecera, el pie,
 * el diálogo y el formulario de contacto (los mismos que la portada inglesa) y
 * las pocas etiquetas fijas de las primitivas v5.
 *
 * Todo `/en` lo firma INPLUX LLC, con sede en Miami, y la ingeniería la hace
 * INPLUX S.A.S. en Medellín: lo dicen el pie y la nota de entidad del cierre.
 */
export const enSite = {
  header: homeCopyEn.header,
  footer: homeCopyEn.footer,
  contactDialog: homeCopyEn.contactDialog,
  contactForm: homeCopyEn.contactForm,
  entityStatement: homeCopyEn.contact.entityStatement,
  locations: homeCopyEn.footer.locations,
  contactCta: homeCopyEn.contact.cta,
  crumbsLabel: "Breadcrumb",
  homeCrumb: { label: "Home", href: "/en" },
  next: { eyebrow: "Next", ariaLabel: "Next page" },
  headerSources: {
    desktop: "en-header-desktop",
    mobile: "en-header-mobile",
  },
} as const;

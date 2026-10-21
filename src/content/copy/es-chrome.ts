import { siteNavigation } from "@/content/navigation";
import type { ContactDialogCopy, ContactFormCopy, HeaderCopy } from "./types";

/*
 * Las piezas del copy español que necesitan los componentes cliente del
 * cascarón (cabecera, diálogo y formulario de contacto) como valor por
 * defecto. Viven aparte de `es.ts` para que el navegador reciba sólo estas
 * cadenas y no el copy completo de la portada: un componente cliente que
 * importa `homeCopyEs` arrastra el objeto entero a su chunk. `es.ts` las
 * reexpone en su sitio, así que `homeCopyEs.header` sigue siendo la fuente.
 */

export const headerCopyEs: HeaderCopy = {
  skipToContent: "Saltar al contenido",
  brandLabel: "INPLUX, ir al inicio",
  navigationLabel: "Navegación principal",
  mobileNavigationLabel: "Navegación móvil",
  mobileMenuLabel: "Explora INPLUX",
  openMenu: "Abrir menú",
  closeMenu: "Cerrar menú",
  contactCta: "Empezar un proyecto",
  contactCtaMobile: "Empezar un proyecto",
  menuNote: "No necesitas tener el alcance definido.",
  navigation: siteNavigation,
  languageSwitch: { label: "English", href: "/en", hrefLang: "en" },
};

export const contactDialogCopyEs: ContactDialogCopy = {
  eyebrow: "Empecemos por el problema",
  titleLead: "¿Qué necesitas ",
  titleEmphasis: "construir",
  titleTail: "?",
  description:
    "Cuéntanos qué debería cambiar. No necesitas llegar con requisitos ni con el alcance definido.",
  closeLabel: "Cerrar formulario de contacto",
};

export const contactFormCopyEs: ContactFormCopy = {
  dialogLabel: "Formulario de contacto en diálogo",
  sectionLabel: "Formulario de contacto de la página",
  nameLabel: "Nombre",
  emailLabel: "Correo",
  organizationLabel: "Empresa o entidad",
  organizationOptional: "opcional",
  needLabel: "¿Qué tipo de necesidad tienes?",
  needOptions: [
    "Lanzar un producto digital",
    "Mejorar una operación",
    "Automatizar trabajo y conocimiento",
    "Aún no lo sé",
  ],
  needDefault: "Aún no lo sé",
  challengeLabel: "¿Qué problema necesitas resolver?",
  challengePlaceholder:
    "Cuéntanos el problema, quién lo vive y qué debería cambiar.",
  note: "Usamos estos datos solo para responderte.",
  privacyLink: "Cómo cuidamos los datos",
  privacyHref: "/seguridad",
  submit: "Enviar mensaje",
  sending: "Enviando…",
  sent: "Recibimos tu mensaje. Una persona del equipo te responde a tu correo.",
  errorInvalid:
    "Revisa los datos: falta alguno o tiene un formato que no reconocemos.",
  errorRateLimited:
    "Llegaron varios mensajes seguidos desde tu conexión. Espera unos minutos y vuelve a intentarlo.",
  errorSend: "No pudimos enviar el mensaje.",
  retry: "Reintentar",
  errorMailLead: "También puedes escribirnos a",
  preparedNote:
    "El borrador quedó preparado. Si tu aplicación de correo no se abrió, puedes copiar el mensaje y enviarlo desde el canal que prefieras.",
  preparedOpen: "Abrir el borrador otra vez",
  copyAction: "Copiar mensaje preparado",
  copySuccess: "Mensaje copiado. Puedes pegarlo en el canal que prefieras.",
  copyFailure:
    "No pudimos copiarlo automáticamente. El mensaje está seleccionado abajo.",
  manualCopyLabel: "Mensaje preparado para copiar manualmente",
  mailSubject: "Nuevo reto de software · {organization}",
  mailFieldName: "Nombre",
  mailFieldOrganization: "Empresa o entidad",
  mailFieldOrganizationEmpty: "No indicada",
  mailFieldNeed: "Tipo de necesidad",
  mailChallengeHeading: "Reto:",
  mailTo: "Para",
  mailSubjectLabel: "Asunto",
};

import { NO_JS_TARGET } from "@/lib/contact/fields.mjs";

/**
 * `/en/contact`, el par inglés de `/contacto`: el mismo formulario
 * (`ContactForm`, envío a `/api/contacto`, antibots y caída a `mailto:`) con
 * su copy en inglés. El correo que recibe el equipo indica la página de origen
 * (`/en/contact`), que el formulario manda en el campo `pagina`.
 */
export const contactEn = {
  meta: {
    title: "Contact — let's start with the problem",
    description:
      "Tell us what should change in your product, operation or service. You don't need to arrive with requirements or a defined scope.",
    socialTitle: "Let's start with the problem | INPLUX",
    socialDescription:
      "Share the challenge. INPLUX helps you turn it into a first product decision.",
    twitterDescription:
      "Share the challenge. You don't need requirements or a defined scope.",
    imageAlt: "INPLUX · Contact. Let's start with the problem.",
    jsonLdName: "Contact INPLUX",
  },
  crumb: "Contact",
  hero: {
    eyebrow: "Contact",
    title: "Let's start with the problem.",
    lead: "Which process do you want to improve, and which system does it live in?",
    leadMuted:
      "That's enough for us to size what comes next. You don't need requirements or a defined scope.",
  },
  direct: {
    eyebrow: "Write to us",
    titleLead: "A person on the team ",
    titleEmphasis: "replies.",
    channelsLabel: "Direct channels",
    security: "How we look after the data you share with us",
  },
  noJsNotices: [
    { id: NO_JS_TARGET.sent, text: "We received your message. Someone from the team will reply to your email." },
    {
      id: NO_JS_TARGET.invalid,
      text: "We couldn't send the message: a detail is missing or has a format we don't recognize. Please try again.",
    },
    {
      id: NO_JS_TARGET.limited,
      text: "Several messages arrived in a row from your connection. Wait a few minutes and try again.",
    },
    {
      id: NO_JS_TARGET.unavailable,
      text: "We couldn't send the message from here. Write to us directly at gerencia@inplux.co.",
    },
  ],
  next: { label: "How we work" },
} as const;

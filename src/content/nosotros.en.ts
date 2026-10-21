/**
 * `/en/about`, el par inglés de `/nosotros`. Mismas secciones y mismas
 * afirmaciones: el origen acredita a REDEK igual que en español, y el cierre
 * lleva la nota de entidad de INPLUX LLC.
 */
export const aboutEn = {
  meta: {
    title: "About — we build with judgment, from Medellín",
    description:
      "INPLUX develops and implements AI transformation for companies and institutions in Latin America.",
    socialTitle: "We build with judgment, from Medellín | INPLUX",
    socialDescription:
      "INPLUX develops and implements AI transformation for companies and institutions in Latin America.",
    jsonLdName: "We build with judgment, from Medellín",
  },
  crumb: "About",
  hero: {
    eyebrow: "About",
    title: "We build with judgment, from Medellín.",
    lead: "INPLUX develops and implements the AI transformation of companies and institutions across Latin America.",
    leadMuted:
      "Our own products in production, and teams that implement them inside the client's operation.",
    teamCta: "Meet the team",
    originCta: "Where we come from",
  },
  origin: {
    eyebrow: "Where we come from",
    titleLead: "Two crafts at the same ",
    titleEmphasis: "table.",
    body: "INPLUX was born in Medellín in 2023 from two crafts that rarely sit together: tax and institutional management, and software engineering. The products this site documents are INPLUX developments in domains that look nothing alike. When responsibility is shared, the profile says so: in Laudos, INPLUX does the technical development and REDEK brings the legal judgment.",
    quoteLead: "From Medellín, ",
    quoteEmphasis: "for Latin America.",
  },
  reasons: {
    eyebrow: "Why trust us",
    titleLead: "Three things we don't ",
    titleEmphasis: "delegate.",
    ariaLabel: "Three reasons",
    items: [
      {
        label: "Operators with judgment",
        title: "We come from operations, not from the demo.",
        copy: "Tax, public finance, economics and engineering. We know what happens when an answer can't be verified.",
      },
      {
        label: "Independent",
        title: "No default vendor or model.",
        copy: "We choose the cloud, the model and the infrastructure for the problem, and we document it so you can change it.",
      },
      {
        label: "Local engineering",
        title: "Inside your team, not on the other side of a ticket.",
        copy: "Our engineers work in your systems and with your people, until the system runs on its own.",
      },
    ],
  },
  building: {
    eyebrow: "What we're building",
    titleLead: "Systems an institution can ",
    titleEmphasis: "audit.",
    lead: "Products that connect an organization's systems of record with language models, and leave every answer with its source, every action with its log and every decision with whoever already owned it. First in tax, health and public management; then in any sector where rules and data meet.",
  },
  closing: {
    eyebrow: "The next step",
    titleLead: "Let's build what ",
    titleEmphasis: "comes next.",
    lead: "Tell us the problem, who lives with it and what should change. You don't need to arrive with requirements or a defined scope.",
    cta: "Start a conversation",
  },
} as const;

/**
 * `/en/security`, el par inglés de `/seguridad`. Cada frase traduce una
 * aprobada por la dirección; no sumes sellos, certificaciones, porcentajes ni
 * promesas de disponibilidad. Las normas colombianas se citan por su nombre
 * oficial en español, con una glosa corta en inglés.
 */
export const securityEn = {
  meta: {
    title: "Security and data",
    description:
      "How INPLUX looks after each client's data: encryption, role-based access, separated data, models that don't train on it and the legal framework that applies.",
    socialTitle: "Security and data | INPLUX",
    socialDescription:
      "Encryption, role-based access, data separated by client and models that don't train on it. No seals or promises we can't keep.",
    imageAlt: "INPLUX · Security. How we look after each client's data.",
    jsonLdName: "Security and data",
  },
  shell: {
    eyebrow: "Security",
    titleLead: "How we look after ",
    titleEmphasis: "the data.",
    subtitle: "What we do today with each client's information, in a few lines.",
    updatedLabel: "Updated",
    updatedValue: "October 20, 2026",
  },
  tocLabel: "On this page",
  sections: {
    encryption: {
      toc: "Encryption",
      title: "Encryption",
      body: "Data travels encrypted with TLS. At rest, it is encrypted by the disk encryption of the cloud providers that host it.",
    },
    access: {
      toc: "Role-based access",
      title: "Role-based access",
      body: "Each person sees only what their role allows. Sensitive actions are logged with date and author.",
    },
    separation: {
      toc: "Separated data",
      title: "Data separated by client",
      body: "Each client's data is kept separate. It is never mixed between organizations.",
    },
    models: {
      toc: "Models",
      title: "Models don't learn from your data",
      body: "We use AI models through APIs that don't train on the data sent to them. A client's information is not used to train models.",
    },
    region: {
      toc: "Region",
      title: "Where the data lives",
      body: "The region where data is hosted is agreed with each client, according to the regulation that applies to them.",
    },
    regulation: {
      toc: "Regulation",
      title: "Regulation",
      lead: "We process personal data under ",
      law: "Ley 1581 de 2012",
      lawGloss: " (Colombia's personal data protection law), with the additional care it requires for sensitive data. In health, we also follow the Ministry of Health's ",
      resolution: "Resolución 866 de 2021",
      resolutionGloss: ", on electronic health records.",
    },
    vulnerabilities: {
      toc: "Vulnerabilities",
      title: "Report a vulnerability",
      lead: "If you find a security flaw in something we've built, write to ",
      tail: " with the steps to reproduce it, and don't disclose it while we review it.",
      mailSubject: "Vulnerability report",
    },
  },
  next: { label: "How we work" },
} as const;

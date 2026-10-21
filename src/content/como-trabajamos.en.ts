import { homeCopyEn } from "@/content/copy/en";

/**
 * `/en/how-we-work`, el par inglés de `/como-trabajamos`. Las fases son las de
 * la portada inglesa (`homeCopyEn.v5.process`), como en español salen de
 * `homeCopyEs`: las dos pantallas cuentan el mismo proceso.
 */
export const howWeWorkEn = {
  meta: {
    title: "How we work — from diagnosis to operation",
    description:
      "How INPLUX takes a process to production: diagnosis, pilot, production and operation, with a deliverable in every phase and your team's judgment in every decision.",
    socialTitle: "How we work | INPLUX",
    socialDescription:
      "Diagnosis, pilot, production and operation: four phases with a deliverable, on the systems you already run.",
    imageAlt: "INPLUX · How we work. From diagnosis to operation.",
    jsonLdName: "How we work",
  },
  crumb: "How we work",
  hero: {
    eyebrow: "How we work",
    title: "We stay with you from diagnosis until it runs.",
    lead: "Our engineers work inside the client's systems and teams.",
    leadMuted:
      "Every phase ends with something you can use and review, and the decision stays with whoever already owned it.",
    cta: "Start a project",
    phasesCta: "See the phases",
  },
  statement: { lead: "Building fast only matters if we build ", emphasis: "the right thing." },
  phases: {
    process: homeCopyEn.v5.process,
    titleLead: "Four phases. ",
    titleEmphasis: "A deliverable in each.",
    lead: "We start with one concrete process and stay until it runs with your team. No phase ends in a presentation: it ends in something people use.",
  },
  commitments: {
    eyebrow: "What we look after",
    titleLead: "Speed ",
    titleEmphasis: "with responsibility.",
    ariaLabel: "Four commitments",
    items: [
      {
        label: "Starting point",
        lineA: "The problem,",
        lineB: "before the tool.",
        copy: "We don't start by picking a technology. We start with why it happens, who lives with it and what should change.",
      },
      {
        label: "Scope",
        lineA: "A first version,",
        lineB: "in use.",
        copy: "We narrow the scope to put something useful into operation and learn from the evidence, not to pretend everything is solved.",
      },
      {
        label: "Team",
        lineA: "One conversation,",
        lineB: "about the product.",
        copy: "Context, experience, software, data and testing are reviewed together, so the intent doesn't get lost between deliverables.",
      },
      {
        label: "Control",
        lineA: "The decision,",
        lineB: "stays with your team.",
        copy: "Artificial intelligence speeds up specialized tasks. Your team keeps the judgment, the validation and the responsibility.",
      },
    ],
  },
  closing: {
    eyebrow: "The next step",
    titleLead: "Bring the problem. ",
    titleEmphasis: "We build the system.",
    lead: "You don't need to arrive with requirements or an architecture. We start with who lives with the problem and what should change.",
    cta: "Start a project",
  },
} as const;

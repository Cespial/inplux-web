/**
 * Contrato de copy de la HOME.
 *
 * La HOME existe en dos idiomas sobre exactamente los mismos componentes:
 * `/` en español y `/en` en inglés. Cada componente recibe su bloque de copy
 * como prop y usa el bloque español por defecto, de modo que la ruta española
 * renderiza el mismo HTML que antes de introducir esta capa.
 *
 * Los identificadores de fragmento (#contacto, #trabajo-real, …) NO se
 * traducen: son la dirección estable de cada sección y ya circulan en enlaces
 * publicados.
 */

import type { WorkSlug } from "@/content/work";

export type NavigationItem = {
  label: string;
  href: string;
  /** Marca el idioma del destino cuando difiere del idioma de la página. */
  hrefLang?: string;
  /** Una línea bajo la etiqueta en los desplegables de la cabecera. */
  description?: string;
};

/** Un grupo desplegable de la cabecera: etiqueta, enlaces y, si lo hay, el enlace que lo cierra. */
export type NavigationGroup = {
  label: string;
  items: readonly NavigationItem[];
  more?: NavigationItem;
};

export type NavigationEntry = NavigationItem | NavigationGroup;

export function isNavigationGroup(entry: NavigationEntry): entry is NavigationGroup {
  return "items" in entry;
}

export type HeaderCopy = {
  skipToContent: string;
  brandLabel: string;
  navigationLabel: string;
  mobileNavigationLabel: string;
  mobileMenuLabel: string;
  openMenu: string;
  closeMenu: string;
  contactCta: string;
  contactCtaMobile: string;
  menuNote: string;
  navigation: readonly NavigationEntry[];
  /** Enlace al mismo contenido en el otro idioma. */
  languageSwitch: NavigationItem | null;
};

export type FooterNavGroup = {
  label: string;
  ariaLabel: string;
  items: readonly NavigationItem[];
  /**
   * Un enlace que acompaña al grupo pero no pertenece a su `<nav>`: el pie de
   * productos exige biyección con `work.ts`, y «Todos los productos» no es un
   * producto.
   */
  more?: NavigationItem;
};

export type FooterCopy = {
  heading: string;
  tagline: string;
  groups: readonly FooterNavGroup[];
  contactLabel: string;
  contactAriaLabel: string;
  contactCta: string;
  email: string;
  linkedInLabel: string;
  locations: readonly string[];
  /** Aviso de idioma para los destinos que solo existen en español. */
  languageNote: string | null;
  copyright: string;
  closingLine: string;
};

export type ContactDialogCopy = {
  eyebrow: string;
  titleLead: string;
  titleEmphasis: string;
  titleTail: string;
  description: string;
  closeLabel: string;
};

export type ContactFormCopy = {
  dialogLabel: string;
  sectionLabel: string;
  nameLabel: string;
  organizationLabel: string;
  organizationOptional: string;
  needLabel: string;
  needOptions: readonly string[];
  needDefault: string;
  challengeLabel: string;
  challengePlaceholder: string;
  note: string;
  submit: string;
  preparedNote: string;
  copyAction: string;
  copySuccess: string;
  copyFailure: string;
  manualCopyLabel: string;
  /** Plantilla con {organization}. */
  mailSubject: string;
  mailFieldName: string;
  mailFieldOrganization: string;
  mailFieldOrganizationEmpty: string;
  mailFieldNeed: string;
  mailChallengeHeading: string;
  mailTo: string;
  mailSubjectLabel: string;
};

export type HeroCopy = {
  eyebrow: string;
  titleLines: readonly [string, string];
  leadSentences: readonly [string, string];
  primaryCta: string;
  secondaryCta: string;
  statement: string;
  signalAriaLabel: string;
  signalMeta: readonly [string, string, string];
  signalStages: readonly {
    number: string;
    title: string;
    detail: string;
  }[];
  signalAxis: string;
};

/**
 * O están los cinco, o no está ninguno.
 *
 * El español los deja vacíos a propósito: `HomeV5` cae al valor de
 * `work.ts`, que ya está en español, y duplicarlo aquí crearía dos textos
 * para el mismo dato sin nada que los compare. El inglés los necesita
 * completos, porque su respaldo publicaría español dentro de /en.
 *
 * Lo que este tipo hace imposible es el estado intermedio: un diccionario
 * a medias es lo que publicó dos tarjetas en español en agosto de 2026.
 */
type ProductLabels =
  | Readonly<Record<WorkSlug, string>>
  | Readonly<Record<string, never>>;

/**
 * El aviso de aliados del Día D. Es temporal: caduca solo el 15 de octubre de
 * 2026 (ver `ALLY_NOTICE_EXPIRES` en `src/content/dia-d.ts`).
 */
export type AllyNoticeCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  whenLabel: string;
  when: string;
  whereLabel: string;
  where: string;
  roleLabel: string;
  role: string;
  alliesEyebrow: string;
  /** Descriptor de cada aliado, por `id`. Los del propio sitio del evento. */
  allyNotes: Readonly<Record<string, string>>;
  cta: string;
  dismiss: string;
  closeLabel: string;
  dialogLabel: string;
};

export type ExperienceRailCopy = {
  ribbonAriaLabel: string;
  ribbonEyebrow: string;
  ribbonTitle: string;
  directoryEyebrow: string;
  directoryName: string;
  /** Sufijo del contador; el número se interpola aparte. */
  directoryDetail: string;
  logoWallAriaLabel: string;
  statementEyebrow: string;
  statementTitle: string;
  relationExperience: string;
  clientNotes: Readonly<Record<string, string>>;
  /** Categoría y estado de cada producto del ribbon, por slug. Ver `ProductLabels`. */
  productCategories: ProductLabels;
  productStatuses: ProductLabels;
};

export type FactoryStep = {
  index: string;
  label: string;
  title: string;
  copy: string;
  signals: readonly [string, string];
};

export type FactoryScrollyCopy = {
  disclosure: string;
  sceneDisclosure: string;
  eyebrow: string;
  titleLead: string;
  titleEmphasis: string;
  lead: string;
  timelineAriaLabel: string;
  introStatus: string;
  /** Plantilla con {index}, {total}, {label} y {title}. */
  stageStatus: string;
  steps: readonly FactoryStep[];
};

export type ApiChapterCopy = {
  eyebrow: string;
  titleLead: string;
  titleTail: string;
  titleEmphasis: string;
  lead: string;
  capabilities: readonly (readonly [string, string])[];
  primaryCta: string;
  secondaryCta: string;
  demoAriaLabel: string;
  demoDisclosure: string;
  createProjectComment: string;
  environmentLabel: string;
  regionLabel: string;
  copyEndpoint: string;
  copiedEndpoint: string;
  copiedTitle: string;
  copyEndpointAnnouncement: string;
  copyEndpointFailure: string;
  sandboxReady: string;
  creatingProject: string;
  projectCreated: string;
  runRequest: string;
  running: string;
  runAgain: string;
  responseReadyLabel: string;
  responseCreatedLabel: string;
  responseFields: readonly (readonly [string, string])[];
  openInFactoryRun: string;
};

export type SectorsCopy = {
  eyebrow: string;
  title: string;
  publicEyebrow: string;
  publicTitle: string;
  publicCopy: string;
  publicItems: readonly string[];
  publicCta: string;
  privateEyebrow: string;
  privateTitle: string;
  privateCopy: string;
  privateItems: readonly string[];
  privateCta: string;
};

export type FactoryPhaseCopy = {
  code: string;
  id: string;
  title: string;
  status: string;
  statusTone: "approved" | "active" | "review" | "blocked" | "queued" | "ready";
  summary: string;
  progress: number;
  boardLabel: string;
  boardNote: string;
  owner: string;
  ownerInitials: string;
  gate: string;
  milestone: string;
  updated: string;
  metrics: readonly { label: string; value: string; detail: string }[];
  workItems: readonly {
    id: string;
    type: string;
    title: string;
    detail: string;
    state: "approved" | "active" | "review" | "blocked" | "queued" | "ready";
    stateLabel: string;
    owner: string;
  }[];
  activity: readonly {
    initials: string;
    actor: string;
    action: string;
    time: string;
    state: "approved" | "active" | "review" | "blocked" | "queued" | "ready";
  }[];
  command: string;
};

export type FactoryRunCopy = {
  regionAriaLabel: string;
  demoFlag: string;
  demoFlagDetail: string;
  runLabel: string;
  runOwnerAriaLabel: string;
  railAriaLabel: string;
  projectLabel: string;
  projectName: string;
  projectMeta: string;
  phasesLabel: string;
  phaseTabsAriaLabel: string;
  runActive: string;
  breadcrumbProject: string;
  breadcrumbPhase: string;
  /** Plantillas con {phase}. */
  scrollableDetailAriaLabel: string;
  inspectorAriaLabel: string;
  phasePrefix: string;
  ownerLabel: string;
  /** Plantilla con {gate}. */
  gateProgressAriaLabel: string;
  gateLabel: string;
  boardPriorities: string;
  propertiesTitle: string;
  gateFieldLabel: string;
  milestoneFieldLabel: string;
  updatedFieldLabel: string;
  activityTitle: string;
  activityCount: string;
  authorityLabel: string;
  authorityNote: string;
  scrollCue: string;
  runApiLabel: string;
  syncedLabel: string;
  /** Plantilla con {phase} y {status}. */
  announcement: string;
  phases: readonly FactoryPhaseCopy[];
};

export type BuildNarrativeCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  deliveryChecks: readonly (readonly [string, string])[];
  primaryCta: string;
  secondaryCta: string;
  capabilitiesEyebrow: string;
  capabilitiesTitle: string;
  capabilities: readonly (readonly [string, string, string])[];
  factoryRun: FactoryRunCopy;
};

/**
 * La cinta de cifras del hero. Los números no viven aquí: se calculan desde el
 * contenido (`work.ts`, `home.ts`, `press.ts` y el muro) y aquí solo van las
 * etiquetas. Las plantillas usan {n}, {documented}, {inDevelopment} y {date}.
 */
export type HeroStatsCopy = {
  ariaLabel: string;
  products: { label: string; detail: string };
  profiles: { label: string; detail: string };
  organizations: { label: string; detail: string };
  press: { label: string; detail: string };
};

export type ClientWallCopy = {
  eyebrow: string;
  title: string;
  lead: string;
};

export type ProductBlocksCopy = {
  eyebrow: string;
  titleLead: string;
  titleEmphasis: string;
  lead: string;
  /** Antetítulo de cada bloque: «Build / 01». */
  buildLabel: string;
  /** Plantilla con {date}. */
  verifiedLabel: string;
  profileCta: string;
  /** Plantilla con {name}. */
  captureLabel: string;
  /** Plantilla con {date}. */
  captureVerified: string;
  /** Plantilla con {name}. */
  previewAriaLabel: string;
  inDevelopmentLabel: string;
  disclosure: string;
  /** Traducción de las capacidades por slug; vacío en español. */
  capabilityTitles: Readonly<Record<string, string>>;
  capabilityDescriptions: Readonly<Record<string, string>>;
  headlines: Readonly<Record<string, string>>;
  descriptions: Readonly<Record<string, string>>;
  accessLabels: Readonly<Record<string, string>>;
};

export type TeamLeadersCopy = {
  eyebrow: string;
  titleLead: string;
  titleEmphasis: string;
  lead: string;
  profileCta: string;
  linkedInLabel: string;
  /** Traducciones por slug; vacías en español porque `team.ts` ya lo está. */
  roles: Readonly<Record<string, string>>;
  focuses: Readonly<Record<string, string>>;
  bios: Readonly<Record<string, string>>;
};

export type SectorStripItem = {
  label: string;
  detail: string;
  /** Ruta interna, o null cuando el sector aún no tiene página. */
  href: string | null;
  /** Nota en mono para los sectores sin página («Próximamente»). */
  note: string | null;
};

export type SectorStripCopy = {
  ariaLabel: string;
  eyebrow: string;
  title: string;
  items: readonly SectorStripItem[];
};

export type PressCopy = {
  eyebrow: string;
  titleLead: string;
  titleEmphasis: string;
  archiveLink: string;
  /** Idioma de las piezas enlazadas, para marcar los títulos originales. */
  storyLang: string | null;
  storyNote: string | null;
  sourceAction: string;
  /** Plantilla con {title} y {outlet}. */
  externalLabel: string;
  /** Traducción de las etiquetas editoriales; la clave es el valor español. */
  categories: Readonly<Record<string, string>>;
  formats: Readonly<Record<string, string>>;
  bylines: Readonly<Record<string, string>>;
  editorialStatuses: Readonly<Record<string, string>>;
  /** Traducciones por slug de la pieza. */
  summaries: Readonly<Record<string, string>>;
  visualSignals: Readonly<Record<string, string>>;
  imageAlts: Readonly<Record<string, string>>;
  publishedLabels: Readonly<Record<string, string>>;
  markName: string;
  statCopy: string;
  statEyebrow: string;
  panelScenario: string;
  panelPlace: string;
  panelLive: string;
  paperEyebrow: string;
  paperCode: string;
  paperFoot: string;
  archiveIdeas: string;
  /** Código de la tarjeta por slug (PANEL 11, ODR 2026…); vacío en español. */
  visualCodes: Readonly<Record<string, string>>;
  /** Antetítulo de la placa de evento por slug; vacío en español. */
  eventEyebrows: Readonly<Record<string, string>>;
};

export type HomeContactCopy = {
  eyebrow: string;
  titleLead: string;
  titleEmphasis: string;
  lead: string;
  /** Párrafo adicional sobre la entidad; null cuando no aplica. */
  entityStatement: string | null;
  cta: string;
  heroCtaAriaLabel: string;
  email: string;
  /** Botón que copia el correo al portapapeles, y su estado al copiar. */
  copyAction: string;
  copyDone: string;
  linkedInLabel: string;
  locations: readonly string[];
};

export type HowWeWorkStep = {
  number: string;
  title: string;
  detail: string;
};

export type HowWeWorkCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  steps: readonly HowWeWorkStep[];
  cta: string;
};

export type PartnerWallCopy = {
  eyebrow: string;
  title: string;
  note: string;
};

/**
 * Las secciones propias de la portada v5 (octubre de 2026). Lo que la portada
 * ya tenía —hero, muro, equipo, prensa, contacto— sigue leyendo sus bloques;
 * aquí sólo vive lo que no tenía dónde vivir, más los antetítulos sin
 * numeración de las secciones que se reutilizan.
 */
export type HomeV5Copy = {
  heroSecondaryCta: string;
  proof: {
    /** La cifra de Laudos sale de `work.ts`; aquí sólo su unidad. */
    laudosUnit: string;
    sourceLabel: string;
    portfolioSourceLabel: string;
    wallSourceLabel: string;
  };
  process: {
    eyebrow: string;
    title: string;
    deliverableLabel: string;
    phases: readonly { title: string; detail: string; deliverable: string }[];
  };
  products: {
    eyebrow: string;
    title: string;
    lead: string;
    tribaiLead: string;
    tribaiTag: string;
    tribaiCta: string;
    openCta: string;
    moreLabel: string;
    allCta: string;
    inDevelopment: string;
    terminalAriaLabel: string;
    terminalCall: string;
    terminalAnswer: string;
  };
  /** La banda de video «Desde Medellín, para Latinoamérica», con las cifras con fuente debajo. */
  latam: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  sectors: {
    eyebrow: string;
    title: string;
    items: readonly { title: string; detail: string; href: string }[];
  };
  audit: {
    eyebrow: string;
    title: string;
    items: readonly { title: string; detail: string }[];
    techEyebrow: string;
    techNote: string;
  };
  press: { eyebrow: string; title: string; readCta: string; archiveCta: string };
  team: { eyebrow: string; title: string };
  contactEyebrow: string;
};

export type HomeCopy = {
  locale: string;
  htmlLang: string;
  header: HeaderCopy;
  footer: FooterCopy;
  contactDialog: ContactDialogCopy;
  contactForm: ContactFormCopy;
  hero: HeroCopy;
  howWeWork: HowWeWorkCopy;
  partnerWall: PartnerWallCopy;
  heroStats: HeroStatsCopy;
  allyNotice: AllyNoticeCopy;
  clientWall: ClientWallCopy;
  experienceRail: ExperienceRailCopy;
  factoryScrolly: FactoryScrollyCopy;
  products: ProductBlocksCopy;
  apiChapter: ApiChapterCopy;
  sectors: SectorsCopy;
  sectorStrip: SectorStripCopy;
  build: BuildNarrativeCopy;
  team: TeamLeadersCopy;
  press: PressCopy;
  contact: HomeContactCopy;
  v5: HomeV5Copy;
};

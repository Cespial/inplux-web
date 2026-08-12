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

export type NavigationItem = {
  label: string;
  href: string;
  /** Marca el idioma del destino cuando difiere del idioma de la página. */
  hrefLang?: string;
};

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
  navigation: readonly NavigationItem[];
  /** Enlace al mismo contenido en el otro idioma. */
  languageSwitch: NavigationItem | null;
};

export type FooterNavGroup = {
  label: string;
  ariaLabel: string;
  items: readonly NavigationItem[];
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
  statementHint: string;
  relationExperience: string;
  relationPartner: string;
  clientNotes: Readonly<Record<string, string>>;
  /**
   * Categoría y estado de cada producto del ribbon, por slug.
   *
   * Necesitan una entrada por cada producto que publique `work.ts`: el
   * componente cae al valor de `work.ts` cuando falta la clave, y ese valor
   * está en español. El tipo es un `Record` abierto, así que TypeScript no
   * puede exigir las claves — quien agregue un producto tiene que agregarlas
   * aquí a mano.
   */
  productCategories: Readonly<Record<string, string>>;
  productStatuses: Readonly<Record<string, string>>;
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

export type SolutionCopy = {
  number: string;
  title: string;
  copy: string;
  status: string;
  outcome: string;
  modules: readonly string[];
  image: string;
  imagePosition: string;
  project: {
    id: string;
    name: string;
    owner: string;
    ownerInitials: string;
    state: string;
    environment: string;
    updated: string;
  };
  ui: {
    kind: "release" | "operation" | "knowledge" | "service";
    eyebrow: string;
    value: string;
    description: string;
    metrics: readonly (readonly [string, string])[];
    progress: number;
    progressLabel: string;
    activity: readonly (readonly [string, string])[];
    artifact: {
      /** release */
      stages?: readonly string[];
      cohortLabel?: string;
      cohortValue?: string;
      /** operation */
      queues?: readonly (readonly [string, string])[];
      /** knowledge */
      statement?: string;
      chips?: readonly string[];
      chipVerdict?: string;
      /** service */
      steps?: readonly (readonly [string, string, string])[];
    };
  };
  api: {
    method: string;
    endpoint: string;
    action: string;
    httpStatus: string;
    latency: string;
  };
};

export type SolutionsCopy = {
  eyebrow: string;
  titleLead: string;
  titleEmphasis: string;
  tabsAriaLabel: string;
  disclosure: string;
  projectPrefix: string;
  factoryLabel: string;
  toggleTitle: string;
  requestPaneLabel: string;
  responsePaneLabel: string;
  copyAction: string;
  copyDone: string;
  copyFailed: string;
  /** Plantillas con {project}. */
  copyRequestLabel: string;
  copyResponseLabel: string;
  responseNotRun: string;
  responseRunning: string;
  responseIdleHint: string;
  responseRunningHint: string;
  runRequest: string;
  runAgain: string;
  running: string;
  sandboxReady: string;
  validatingContract: string;
  responseReady: string;
  workbenchLabel: string;
  projectFieldLabel: string;
  ownerFieldLabel: string;
  stateFieldLabel: string;
  projectIdFieldLabel: string;
  environmentFieldLabel: string;
  updatedFieldLabel: string;
  appNavigation: readonly [string, string, string];
  /** Plantilla con {owner}. */
  ownerAriaLabel: string;
  recentActivityLabel: string;
  outcomeLabel: string;
  items: readonly SolutionCopy[];
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
  linkedInLabel: string;
  locations: readonly string[];
};

export type HomeCopy = {
  locale: string;
  htmlLang: string;
  header: HeaderCopy;
  footer: FooterCopy;
  contactDialog: ContactDialogCopy;
  contactForm: ContactFormCopy;
  hero: HeroCopy;
  experienceRail: ExperienceRailCopy;
  factoryScrolly: FactoryScrollyCopy;
  solutions: SolutionsCopy;
  apiChapter: ApiChapterCopy;
  sectors: SectorsCopy;
  build: BuildNarrativeCopy;
  press: PressCopy;
  contact: HomeContactCopy;
};

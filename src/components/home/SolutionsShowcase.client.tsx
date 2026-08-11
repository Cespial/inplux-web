"use client";

import Image from "next/image";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { homeCopyEs } from "@/content/copy/es";
import { formatCopy } from "@/content/copy/format";
import type { SolutionCopy, SolutionsCopy } from "@/content/copy/types";
import styles from "./home.module.css";
import ultra from "./SolutionsShowcaseUltra.module.css";

type DemoMode = "ui" | "api";
type ApiRunState = "ready" | "running" | "complete";
type CopyFeedback = {
  projectId: string;
  target: "request" | "response" | "error";
} | null;

type Solution = SolutionCopy;

function toApiKey(label: string) {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
}

function getApiRequest(item: Solution) {
  return JSON.stringify(
    {
      project_id: item.project.id,
      action: item.api.action,
      owner: item.project.owner,
      human_review: true,
    },
    null,
    2,
  );
}

function getApiResponse(item: Solution) {
  return JSON.stringify(
    {
      project_id: item.project.id,
      project_name: item.project.name,
      owner: item.project.owner,
      state: item.project.state,
      environment: item.project.environment,
      primary_value: item.ui.value,
      progress: `${item.ui.progress}%`,
      metrics: Object.fromEntries(
        item.ui.metrics.map(([label, value]) => [toApiKey(label), value]),
      ),
      recent_activity: Object.fromEntries(
        item.ui.activity.map(([label, value]) => [toApiKey(label), value]),
      ),
    },
    null,
    2,
  );
}

interface CodeToken {
  text: string;
  type: "plain" | "key" | "string" | "literal" | "number";
}

function tokenizeJson(source: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  const matcher =
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?/g;
  let cursor = 0;

  for (const match of source.matchAll(matcher)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      tokens.push({ text: source.slice(cursor, index), type: "plain" });
    }

    const [text, quoted, separator, literal] = match;
    tokens.push({
      text,
      type: quoted
        ? separator
          ? "key"
          : "string"
        : literal
          ? "literal"
          : "number",
    });
    cursor = index + text.length;
  }

  if (cursor < source.length) {
    tokens.push({ text: source.slice(cursor), type: "plain" });
  }

  return tokens;
}

function JsonCode({ value }: { value: string }) {
  return (
    <code>
      {tokenizeJson(value).map((token, index) => (
        <span className={ultra[`token${token.type}`]} key={`${token.type}-${index}`}>
          {token.text}
        </span>
      ))}
    </code>
  );
}

const mobileSolutionsQuery = "(max-width: 767px)";

function subscribeToMobileLayout(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(mobileSolutionsQuery);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getMobileLayoutSnapshot() {
  return window.matchMedia(mobileSolutionsQuery).matches;
}

function getMobileLayoutServerSnapshot() {
  return false;
}

function useMobileSolutionsLayout() {
  return useSyncExternalStore(
    subscribeToMobileLayout,
    getMobileLayoutSnapshot,
    getMobileLayoutServerSnapshot,
  );
}

function SolutionUiArtifact({ item }: { item: Solution }) {
  const artifact = item.ui.artifact;

  if (item.ui.kind === "release") {
    return (
      <div className={styles.solutionUiArtifact} data-kind="release">
        <div className={styles.releaseTrack}>
          {(artifact.stages ?? []).map((stage, index) => (
            <span data-state={index < 3 ? "done" : "current"} key={stage}>
              <i aria-hidden="true" />
              {stage}
            </span>
          ))}
        </div>
        <div className={styles.releaseCohort}>
          <span>{artifact.cohortLabel}</span>
          <b>{artifact.cohortValue}</b>
        </div>
      </div>
    );
  }

  if (item.ui.kind === "operation") {
    return (
      <div className={styles.solutionUiArtifact} data-kind="operation">
        {(artifact.queues ?? []).map(([label, count], index) => (
          <span key={label}>
            <i data-active={index === 2 ? "true" : undefined} aria-hidden="true" />
            <small>{label}</small>
            <b>{count}</b>
          </span>
        ))}
      </div>
    );
  }

  if (item.ui.kind === "knowledge") {
    return (
      <div className={styles.solutionUiArtifact} data-kind="knowledge">
        <p>{artifact.statement}</p>
        <div>
          {(artifact.chips ?? []).map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
          <b>{artifact.chipVerdict}</b>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.solutionUiArtifact} data-kind="service">
      {(artifact.steps ?? []).map(([number, label, status]) => (
        <span data-state={status.toLowerCase()} key={number}>
          <i>{number}</i>
          <b>{label}</b>
          <small>{status}</small>
        </span>
      ))}
    </div>
  );
}

interface SolutionTriggerProps {
  active: boolean;
  index: number;
  item: Solution;
  layout: "desktop" | "mobile";
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
  onSelect: (index: number) => void;
  panelId: string;
  summaryId: string;
}

function SolutionTrigger({
  active,
  index,
  item,
  layout,
  onKeyDown,
  onSelect,
  panelId,
  summaryId,
}: SolutionTriggerProps) {
  const mobile = layout === "mobile";
  const labelId = `solution-tab-${index}-label`;
  const numberId = `solution-tab-${index}-number`;

  return (
    <button
      id={`solution-tab-${index}`}
      className={`${active ? styles.isActive : ""} ${ultra.triggerButton}`}
      type="button"
      role={mobile ? undefined : "tab"}
      aria-labelledby={`${numberId} ${labelId}`}
      aria-describedby={active ? summaryId : undefined}
      aria-expanded={mobile ? active : undefined}
      tabIndex={mobile ? undefined : active ? 0 : -1}
      aria-selected={mobile ? undefined : active}
      aria-controls={mobile ? (active ? panelId : undefined) : panelId}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => onKeyDown(event, index)}
    >
      <span className={styles.solutionTabNumber} id={numberId}>
        {item.number}
      </span>
      <strong className={styles.solutionTabTitle} id={labelId}>
        {item.title}
      </strong>
      <i className={styles.solutionTabArrow} aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="m3.75 6 4.25 4 4.25-4" />
        </svg>
      </i>
    </button>
  );
}

interface SolutionSummaryProps {
  id: string;
  item: Solution;
  layout: "desktop" | "mobile";
}

function SolutionSummary({ id, item, layout }: SolutionSummaryProps) {
  return (
    <div id={id} className={ultra.solutionSummary} data-layout={layout}>
      <p className={ultra.summaryCopy}>{item.copy}</p>
      <ul className={ultra.summaryModules}>
        {item.modules.map((module) => (
          <li key={module}>
            <svg
              className={styles.solutionTabModuleIcon}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="m3.25 8.25 2.65 2.65 6-6" />
            </svg>
            {module}
          </li>
        ))}
      </ul>
      <p className={ultra.summaryOutcome}>{item.outcome}</p>
    </div>
  );
}

interface SolutionDemoPanelProps {
  active: number;
  apiRunState: ApiRunState;
  className: string;
  copy: SolutionsCopy;
  id: string;
  labelledBy: string;
  layout: "desktop" | "mobile";
  mode: DemoMode;
  onRunRequest: () => void;
  onToggleMode: (event: MouseEvent<HTMLButtonElement>) => void;
  role: "region" | "tabpanel";
}

function SolutionDemoPanel({
  active,
  apiRunState,
  className,
  copy,
  id,
  labelledBy,
  layout,
  mode,
  onRunRequest,
  onToggleMode,
  role,
}: SolutionDemoPanelProps) {
  const solutions = copy.items;
  const item = solutions[active];
  const ownerLabel = formatCopy(copy.ownerAriaLabel, {
    owner: item.project.owner,
  });
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>(null);
  const copyTimerRef = useRef<number | null>(null);
  const backdropIndexes = [active, (active + 1) % solutions.length];

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const copyCode = async (
    target: "request" | "response",
    projectId: string,
    value: string,
  ) => {
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);

    try {
      await navigator.clipboard.writeText(value);
      setCopyFeedback({ projectId, target });
    } catch {
      setCopyFeedback({ projectId, target: "error" });
    }

    copyTimerRef.current = window.setTimeout(() => {
      setCopyFeedback(null);
      copyTimerRef.current = null;
    }, 1600);
  };

  return (
    <div
      id={id}
      className={`${styles.solutionPanel} ${ultra.panel} ${className}`}
      data-layout={layout}
      role={role}
      aria-labelledby={labelledBy}
      tabIndex={0}
    >
      <div className={`${styles.solutionPanelTop} ${ultra.panelTop}`}>
        <span className={ultra.disclosure}>
          <i aria-hidden="true" />
          {copy.disclosure}
        </span>
        <span className={ultra.panelProject}>
          {`${copy.projectPrefix} `}{item.project.id} · {item.project.state}
        </span>
        <b>{`${copy.factoryLabel} · `}{item.number}</b>
      </div>

      <div className={`${styles.solutionPanelBody} ${ultra.panelBody}`}>
        <div
          className={`${styles.solutionVisual} ${ultra.visual}`}
          data-solution={item.ui.kind}
        >
          <div className={styles.solutionBackdrops} aria-hidden="true">
            {backdropIndexes.map((index) => {
              const item = solutions[index];

              return (
                <Image
                  className={`${styles.solutionBackdrop} ${ultra.backdrop}`}
                  data-active={active === index ? "true" : "false"}
                  data-prefetch={active !== index ? "next" : undefined}
                  src={item.image}
                  alt=""
                  fill
                  quality={75}
                  sizes="(max-width: 767px) calc(100vw - 1rem), (max-width: 980px) 60vw, 50vw"
                  style={{ objectPosition: item.imagePosition }}
                  key={item.image}
                />
              );
            })}
          </div>
          <div className={styles.solutionPhotoScrim} aria-hidden="true" />

          <div
            className={`${styles.solutionDemoStage} ${ultra.demoStage}`}
            data-mode={mode}
          >
            <button
              className={`${styles.solutionModeToggle} ${ultra.modeToggle}`}
              type="button"
              role="switch"
              aria-checked={mode === "api"}
              title={copy.toggleTitle}
              onClick={onToggleMode}
            >
              <span data-active={mode === "ui" ? "true" : undefined}>UI</span>
              <i aria-hidden="true" data-mode={mode}>
                <b className={ultra.toggleKnob} />
              </i>
              <span data-active={mode === "api" ? "true" : undefined}>API</span>
            </button>

            <div
              className={`${styles.solutionDemoScene} ${ultra.demoScene}`}
              data-active="true"
              key={item.number}
            >
                <div
                  className={`${styles.solutionDemoApi} ${ultra.demoApi}`}
                  aria-hidden={mode !== "api"}
                  inert={mode !== "api" ? true : undefined}
                >
                  <div
                    className={`${styles.solutionApiCard} ${ultra.apiCard}`}
                  >
                    <div className={ultra.appChrome}>
                      <div className={ultra.appIdentity}>
                        <span aria-hidden="true">IN</span>
                        <p>
                          {copy.factoryLabel}
                          <small>{copy.workbenchLabel}</small>
                        </p>
                      </div>
                      <span className={ultra.chromeProject}>
                        {item.project.id}
                      </span>
                      <span className={ultra.chromeEnvironment}>
                        {item.project.environment}
                      </span>
                    </div>

                    <div className={ultra.apiProjectStrip}>
                      <span>
                        {`${copy.projectFieldLabel} `}<b>{item.project.name}</b>
                      </span>
                      <span>
                        {`${copy.ownerFieldLabel} `}<b>{item.project.owner}</b>
                      </span>
                      <span>
                        {`${copy.stateFieldLabel} `}<b>{item.project.state}</b>
                      </span>
                    </div>

                    <div className={ultra.apiColumns}>
                      <section className={ultra.apiPane} aria-label={copy.requestPaneLabel}>
                        <header className={ultra.apiPaneHeader}>
                          <span>{"// REQUEST"}</span>
                          <button
                            type="button"
                            aria-label={formatCopy(copy.copyRequestLabel, {
                              project: item.project.id,
                            })}
                            onClick={() =>
                              copyCode(
                                "request",
                                item.project.id,
                                getApiRequest(item),
                              )
                            }
                          >
                            {copyFeedback?.projectId === item.project.id &&
                            copyFeedback.target === "request"
                              ? copy.copyDone
                              : copy.copyAction}
                          </button>
                        </header>
                        <div
                          className={`${styles.solutionApiEndpoint} ${ultra.endpoint}`}
                        >
                          <span>{item.api.method}</span>
                          <code>{item.api.endpoint}</code>
                        </div>
                        <pre className={ultra.apiCode}>
                          <JsonCode value={getApiRequest(item)} />
                        </pre>
                      </section>

                      <section
                        className={ultra.apiPane}
                        aria-label={copy.responsePaneLabel}
                      >
                        <header className={ultra.apiPaneHeader}>
                          <span>{"// RESPONSE"}</span>
                          <div className={ultra.responseMeta}>
                            <b data-state={apiRunState}>
                              {apiRunState === "complete"
                                ? `${item.api.httpStatus} · ${item.api.latency}`
                                : apiRunState === "running"
                                  ? copy.responseRunning
                                  : copy.responseNotRun}
                            </b>
                            <button
                              type="button"
                              disabled={apiRunState !== "complete"}
                              aria-label={formatCopy(copy.copyResponseLabel, {
                                project: item.project.id,
                              })}
                              onClick={() =>
                                copyCode(
                                  "response",
                                  item.project.id,
                                  getApiResponse(item),
                                )
                              }
                            >
                              {copyFeedback?.projectId === item.project.id &&
                              copyFeedback.target === "response"
                                ? copy.copyDone
                                : copy.copyAction}
                            </button>
                          </div>
                        </header>
                        <pre
                          className={`${ultra.apiCode} ${ultra.responseCode}`}
                          data-state={apiRunState}
                          aria-live="polite"
                        >
                          {apiRunState === "complete" ? (
                            <JsonCode value={getApiResponse(item)} />
                          ) : (
                            <code>
                              {apiRunState === "running"
                                ? copy.responseRunningHint
                                : copy.responseIdleHint}
                            </code>
                          )}
                        </pre>
                      </section>
                    </div>

                    <div
                      className={`${styles.solutionApiActions} ${ultra.apiActions}`}
                    >
                      <button
                        type="button"
                        disabled={apiRunState === "running"}
                        aria-busy={apiRunState === "running"}
                        tabIndex={mode === "api" ? 0 : -1}
                        onClick={onRunRequest}
                      >
                        {apiRunState === "running"
                          ? copy.running
                          : apiRunState === "complete"
                            ? copy.runAgain
                            : copy.runRequest}
                        <span aria-hidden="true">→</span>
                      </button>
                      <span role="status" aria-live="polite">
                        {copyFeedback?.projectId === item.project.id &&
                        copyFeedback.target === "error"
                          ? copy.copyFailed
                          : apiRunState === "complete"
                            ? `${item.api.httpStatus} · ${item.api.latency} · ${copy.responseReady}`
                            : apiRunState === "running"
                              ? copy.validatingContract
                              : copy.sandboxReady}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`${styles.solutionDemoUi} ${ultra.demoUi}`}
                  aria-hidden={mode !== "ui"}
                  inert={mode !== "ui" ? true : undefined}
                >
                  <div
                    className={`${styles.solutionUiCard} ${ultra.productCard}`}
                  >
                    <div className={ultra.appChrome}>
                      <div className={ultra.appIdentity}>
                        <span aria-hidden="true">IN</span>
                        <p>
                          {copy.factoryLabel}
                          <small>{item.project.name}</small>
                        </p>
                      </div>
                      <div className={ultra.appNavigation} aria-hidden="true">
                        <span data-current="true">{copy.appNavigation[0]}</span>
                        <span>{copy.appNavigation[1]}</span>
                        <span>{copy.appNavigation[2]}</span>
                      </div>
                      <span
                        className={ultra.projectOwner}
                        aria-label={ownerLabel}
                        title={ownerLabel}
                      >
                        {item.project.ownerInitials}
                      </span>
                    </div>

                    <div className={ultra.projectStrip}>
                      <span>
                        {`${copy.projectIdFieldLabel} `}<b>{item.project.id}</b>
                      </span>
                      <span>
                        {`${copy.ownerFieldLabel} `}<b>{item.project.owner}</b>
                      </span>
                      <span>
                        {`${copy.environmentFieldLabel} `}<b>{item.project.environment}</b>
                      </span>
                      <span>
                        {`${copy.updatedFieldLabel} `}<b>{item.project.updated}</b>
                      </span>
                    </div>

                    <div className={ultra.productMain}>
                      <div className={ultra.productPrimary}>
                        <div className={styles.solutionUiHeader}>
                          <span>{item.ui.eyebrow}</span>
                          <b>{item.project.state}</b>
                        </div>
                        <strong className={ultra.primaryValue}>
                          {item.ui.value}
                        </strong>
                        <p className={ultra.primaryDescription}>
                          {item.ui.description}
                        </p>
                        <SolutionUiArtifact item={item} />
                      </div>

                      <div className={ultra.productSecondary}>
                        <div
                          className={`${styles.solutionUiMetrics} ${ultra.metrics}`}
                        >
                          {item.ui.metrics.map(([label, value]) => (
                            <span key={label}>
                              {label}
                              <b>{value}</b>
                            </span>
                          ))}
                        </div>
                        <div
                          className={styles.solutionUiProgress}
                          role="progressbar"
                          aria-label={item.ui.progressLabel}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={item.ui.progress}
                        >
                          <i
                            className={ultra.progressFill}
                            style={{
                              transform: `scaleX(${item.ui.progress / 100})`,
                            }}
                          />
                        </div>
                        <div className={styles.solutionUiProgressMeta}>
                          <span>{item.ui.progressLabel}</span>
                          <b>{item.ui.progress}%</b>
                        </div>
                        <div className={styles.solutionUiActivity}>
                          <span>{copy.recentActivityLabel}</span>
                          {item.ui.activity.map(([label, value]) => (
                            <p key={label}>
                              {label}
                              <b>{value}</b>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>

        <div className={styles.solutionOutcome}>
          <span>{copy.outcomeLabel}</span>
          <p>{item.outcome}</p>
          <b aria-hidden="true">READY →</b>
        </div>
      </div>
    </div>
  );
}

export function SolutionsShowcase({
  copy = homeCopyEs.solutions,
}: {
  copy?: SolutionsCopy;
}) {
  const solutions = copy.items;
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<DemoMode>("ui");
  const [apiRunState, setApiRunState] = useState<ApiRunState>("ready");
  const [instantSelection, setInstantSelection] = useState(false);
  const runTimerRef = useRef<number | null>(null);
  const isMobileLayout = useMobileSolutionsLayout();

  useEffect(() => {
    return () => {
      if (runTimerRef.current) window.clearTimeout(runTimerRef.current);
    };
  }, []);

  const select = (index: number, instant = false) => {
    if (index === active) return;
    if (instant) {
      setInstantSelection(true);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setInstantSelection(false));
      });
    }
    setActive(index);
    setApiRunState("ready");
    if (runTimerRef.current) {
      window.clearTimeout(runTimerRef.current);
      runTimerRef.current = null;
    }
  };

  const toggleMode = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) {
      setInstantSelection(true);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setInstantSelection(false));
      });
    }
    setMode((current) => (current === "ui" ? "api" : "ui"));
  };

  const runRequest = () => {
    if (apiRunState === "running") return;
    if (runTimerRef.current) window.clearTimeout(runTimerRef.current);
    setApiRunState("running");
    runTimerRef.current = window.setTimeout(() => {
      setApiRunState("complete");
      runTimerRef.current = null;
    }, 720);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = solutions.length - 1;
    let next = index;
    if (event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;

    event.preventDefault();
    select(next, true);
    window.requestAnimationFrame(() => document.getElementById(`solution-tab-${next}`)?.focus());
  };

  return (
    <section
      id="que-construimos"
      className={styles.solutions}
      data-instant={instantSelection ? "true" : undefined}
      aria-labelledby="solutions-title"
    >
      <div className={styles.solutionsGrid}>
        <div className={styles.solutionRail}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 id="solutions-title">
              {copy.titleLead}<em>{copy.titleEmphasis}</em>
            </h2>
          </div>

          {isMobileLayout ? (
            <div
              className={styles.solutionMobileAccordion}
              aria-label={copy.tabsAriaLabel}
            >
              {solutions.map((item, index) => {
                const selected = active === index;
                const panelId = `solution-mobile-panel-${index}`;
                const summaryId = `solution-summary-${index}`;

                return (
                  <Fragment key={item.title}>
                    <div
                      className={`${styles.solutionTabs} ${styles.solutionMobileTrigger}`}
                    >
                      <SolutionTrigger
                        active={selected}
                        index={index}
                        item={item}
                        layout="mobile"
                        onKeyDown={onTabKeyDown}
                        onSelect={select}
                        panelId={`${summaryId} ${panelId}`}
                        summaryId={summaryId}
                      />
                    </div>
                    {selected ? (
                      <>
                        <SolutionSummary
                          id={summaryId}
                          item={item}
                          layout="mobile"
                        />
                        <SolutionDemoPanel
                          active={active}
                          apiRunState={apiRunState}
                          className={styles.solutionMobilePanel}
                          copy={copy}
                          id={panelId}
                          labelledBy={`solution-tab-${index}`}
                          layout="mobile"
                          mode={mode}
                          onRunRequest={runRequest}
                          onToggleMode={toggleMode}
                          role="region"
                        />
                      </>
                    ) : null}
                  </Fragment>
                );
              })}
            </div>
          ) : (
            <div className={ultra.desktopRailBody}>
              <div
                className={styles.solutionTabs}
                role="tablist"
                aria-label={copy.tabsAriaLabel}
                aria-orientation="vertical"
              >
                {solutions.map((item, index) => (
                  <SolutionTrigger
                    active={active === index}
                    index={index}
                    item={item}
                    layout="desktop"
                    onKeyDown={onTabKeyDown}
                    onSelect={select}
                    panelId="solution-panel"
                    summaryId={`solution-summary-${index}`}
                    key={item.title}
                  />
                ))}
              </div>
              <SolutionSummary
                id={`solution-summary-${active}`}
                item={solutions[active]}
                layout="desktop"
              />
            </div>
          )}
        </div>

        {isMobileLayout ? null : (
          <SolutionDemoPanel
            active={active}
            apiRunState={apiRunState}
            className={styles.solutionDesktopPanel}
            copy={copy}
            id="solution-panel"
            labelledBy={`solution-tab-${active}`}
            layout="desktop"
            mode={mode}
            onRunRequest={runRequest}
            onToggleMode={toggleMode}
            role="tabpanel"
          />
        )}
      </div>
    </section>
  );
}

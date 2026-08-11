"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { homeCopyEs } from "@/content/copy/es";
import { formatCopy } from "@/content/copy/format";
import type { FactoryRunCopy } from "@/content/copy/types";
import styles from "./FactoryRun.module.css";

type ItemState = FactoryRunCopy["phases"][number]["statusTone"];

function stateGlyph(state: ItemState) {
  if (state === "approved" || state === "ready") return "✓";
  if (state === "blocked") return "!";
  if (state === "review") return "?";
  if (state === "active") return "•";
  return "–";
}

export function FactoryRun({
  copy = homeCopyEs.build.factoryRun,
}: {
  copy?: FactoryRunCopy;
}) {
  const factoryPhases = copy.phases;
  const [activeIndex, setActiveIndex] = useState(0);
  const [instantSelection, setInstantSelection] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [showMobileScrollCue, setShowMobileScrollCue] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const activeViewBodyRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const instantTimerRef = useRef<number | null>(null);
  const activePhase = factoryPhases[activeIndex];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsCompact(entry.contentRect.width <= 650);
    });

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (instantTimerRef.current !== null) {
        window.clearTimeout(instantTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const viewBody = activeViewBodyRef.current;

    if (!viewBody || !isCompact) return;

    const syncScrollCue = () => {
      const isScrollable =
        viewBody.scrollHeight > viewBody.clientHeight + 8;
      setShowMobileScrollCue(isScrollable && viewBody.scrollTop < 8);
    };

    viewBody.addEventListener("scroll", syncScrollCue, { passive: true });

    const observer = new ResizeObserver(syncScrollCue);
    observer.observe(viewBody);
    const initialFrame = window.requestAnimationFrame(syncScrollCue);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      viewBody.removeEventListener("scroll", syncScrollCue);
      observer.disconnect();
    };
  }, [activeIndex, isCompact]);

  const activateTab = (index: number, moveFocus = false) => {
    if (moveFocus) {
      setInstantSelection(true);
      if (instantTimerRef.current !== null) {
        window.clearTimeout(instantTimerRef.current);
      }
      instantTimerRef.current = window.setTimeout(() => {
        setInstantSelection(false);
        instantTimerRef.current = null;
      }, 0);
    }

    setActiveIndex(index);
    if (moveFocus) tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex: number | null = null;

    if (
      (isCompact && event.key === "ArrowRight") ||
      (!isCompact && event.key === "ArrowDown")
    ) {
      nextIndex = (currentIndex + 1) % factoryPhases.length;
    } else if (
      (isCompact && event.key === "ArrowLeft") ||
      (!isCompact && event.key === "ArrowUp")
    ) {
      nextIndex =
        (currentIndex - 1 + factoryPhases.length) % factoryPhases.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = factoryPhases.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    activateTab(nextIndex, true);
  };

  return (
    <div
      id="factory-run"
      ref={rootRef}
      className={styles.factoryRun}
      role="region"
      aria-label={copy.regionAriaLabel}
      data-instant={instantSelection ? "true" : undefined}
    >
      <header className={styles.topbar}>
        <span className={styles.brand}>
          <svg aria-hidden="true" viewBox="0 0 16 16">
            <path d="M2.5 2.5h4v4h-4zM9.5 2.5h4v4h-4zM2.5 9.5h4v4h-4zM9.5 9.5h4v4h-4z" />
          </svg>
          INPLUX FACTORY
        </span>
        <span className={styles.demoFlag}>
          <i aria-hidden="true" />
          <strong>{copy.demoFlag}</strong>
          <span aria-hidden="true">·</span>
          <small>{copy.demoFlagDetail}</small>
        </span>
        <span className={styles.runMeta}>
          <span>{copy.runLabel}</span>
          <b aria-label={copy.runOwnerAriaLabel}>CE</b>
        </span>
      </header>

      <div className={styles.workspace}>
        <nav className={styles.phaseRail} aria-label={copy.railAriaLabel}>
          <div className={styles.railProject}>
            <span>{copy.projectLabel}</span>
            <strong>{copy.projectName}</strong>
            <small>{copy.projectMeta}</small>
          </div>
          <p className={styles.railLabel}>{copy.phasesLabel}</p>
          <div
            className={styles.phaseTabs}
            role="tablist"
            aria-label={copy.phaseTabsAriaLabel}
            aria-orientation={isCompact ? "horizontal" : "vertical"}
          >
            {factoryPhases.map((phase, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={phase.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`factory-run-tab-${phase.id}`}
                  className={styles.phaseTab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={
                    isActive ? `factory-run-panel-${phase.id}` : undefined
                  }
                  tabIndex={isActive ? 0 : -1}
                  data-active={isActive ? "true" : "false"}
                  onClick={() => activateTab(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  <span className={styles.phaseNumber}>{phase.code}</span>
                  <span className={styles.phaseTabCopy}>
                    <strong>{phase.title}</strong>
                    <small>{phase.id}</small>
                  </span>
                  <i aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <div className={styles.railStatus}>
            <i aria-hidden="true" />
            <span>{copy.runActive}</span>
          </div>
        </nav>

        <div className={styles.panelRegion}>
          <section
            key={activePhase.id}
            id={`factory-run-panel-${activePhase.id}`}
            className={styles.phasePanel}
            role="tabpanel"
            aria-labelledby={`factory-run-tab-${activePhase.id}`}
            data-active="true"
            tabIndex={!isCompact ? 0 : -1}
          >
                <header className={styles.viewHeader}>
                  <p>
                    <span>{copy.breadcrumbProject}</span>
                    <i aria-hidden="true">/</i>
                    <span>IX-0718</span>
                    <i aria-hidden="true">/</i>
                    <span>{`${copy.breadcrumbPhase} `}{activePhase.code}</span>
                    <i aria-hidden="true">/</i>
                    <strong>{activePhase.id}</strong>
                  </p>
                  <span
                    className={styles.statusPill}
                    data-state={activePhase.statusTone}
                  >
                    <i aria-hidden="true" />
                    {activePhase.status}
                  </span>
                </header>

                <div
                  ref={activeViewBodyRef}
                  className={styles.viewBody}
                  role={isCompact ? "region" : undefined}
                  aria-label={
                    isCompact
                      ? formatCopy(copy.scrollableDetailAriaLabel, {
                          phase: activePhase.title,
                        })
                      : undefined
                  }
                  tabIndex={isCompact ? 0 : undefined}
                >
                  <div className={styles.primaryView}>
                    <div className={styles.phaseIntro}>
                      <div>
                        <p>{`${copy.phasePrefix} `}{activePhase.code}</p>
                        <h3>{activePhase.title}</h3>
                        <span>{activePhase.id}</span>
                      </div>
                      <div className={styles.phaseContext}>
                        <p>{activePhase.summary}</p>
                        <div className={styles.phaseOwner}>
                          <span aria-hidden="true">
                            {activePhase.ownerInitials}
                          </span>
                          <p>
                            <small>{copy.ownerLabel}</small>
                            <strong>{activePhase.owner}</strong>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={styles.gateProgress}
                      role="progressbar"
                      aria-label={formatCopy(copy.gateProgressAriaLabel, {
                        gate: activePhase.gate,
                      })}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={activePhase.progress}
                    >
                      <p>
                        <span>{`${copy.gateLabel} · `}{activePhase.gate}</span>
                        <strong>{activePhase.progress}%</strong>
                      </p>
                      <i aria-hidden="true">
                        <span
                          style={{
                            transform: `scaleX(${activePhase.progress / 100})`,
                          }}
                        />
                      </i>
                    </div>

                    <dl className={styles.metrics}>
                      {activePhase.metrics.map((metric) => (
                        <div key={metric.label}>
                          <dt>{metric.label}</dt>
                          <dd>
                            <strong>{metric.value}</strong>
                            <span>{metric.detail}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <section
                      className={styles.workBoard}
                      aria-labelledby={`factory-board-${activePhase.id}`}
                    >
                      <header>
                        <div>
                          <h4 id={`factory-board-${activePhase.id}`}>
                            {activePhase.boardLabel}
                          </h4>
                          <p>{activePhase.boardNote}</p>
                        </div>
                        <span>{copy.boardPriorities}</span>
                      </header>
                      <ol>
                        {activePhase.workItems.slice(0, 3).map((item) => (
                          <li key={item.id} data-state={item.state}>
                            <span
                              className={styles.itemState}
                              aria-hidden="true"
                            >
                              {stateGlyph(item.state)}
                            </span>
                            <span className={styles.itemCopy}>
                              <small>
                                {item.type} · {item.id}
                              </small>
                              <strong>{item.title}</strong>
                              <span>{item.detail}</span>
                            </span>
                            <span className={styles.itemOwner}>{item.owner}</span>
                            <b>{item.stateLabel}</b>
                          </li>
                        ))}
                      </ol>
                    </section>
                  </div>

                  <aside
                    className={styles.inspector}
                    aria-label={formatCopy(copy.inspectorAriaLabel, {
                      phase: activePhase.title,
                    })}
                  >
                    <section className={styles.properties}>
                      <header className={styles.inspectorHeading}>
                        <h4>{copy.propertiesTitle}</h4>
                        <span>{activePhase.id}</span>
                      </header>
                      <dl>
                        <div>
                          <dt>{copy.gateFieldLabel}</dt>
                          <dd>{activePhase.gate}</dd>
                        </div>
                        <div>
                          <dt>{copy.milestoneFieldLabel}</dt>
                          <dd>{activePhase.milestone}</dd>
                        </div>
                        <div>
                          <dt>{copy.updatedFieldLabel}</dt>
                          <dd>{activePhase.updated}</dd>
                        </div>
                      </dl>
                    </section>

                    <section
                      className={styles.activity}
                      aria-labelledby={`factory-activity-${activePhase.id}`}
                    >
                      <header className={styles.inspectorHeading}>
                        <h4 id={`factory-activity-${activePhase.id}`}>
                          {copy.activityTitle}
                        </h4>
                        <span>{copy.activityCount}</span>
                      </header>
                      <ol>
                        {activePhase.activity.slice(0, 2).map((event) => (
                          <li
                            key={`${event.actor}-${event.time}`}
                            data-state={event.state}
                          >
                            <span>{event.initials}</span>
                            <p>
                              <strong>{event.actor}</strong>
                              {event.action}
                              <time>{event.time}</time>
                            </p>
                          </li>
                        ))}
                      </ol>
                    </section>

                    <div className={styles.authorityNote}>
                      <i aria-hidden="true" />
                      <p>
                        <small>{copy.authorityLabel}</small>
                        {copy.authorityNote}
                      </p>
                    </div>
                  </aside>
                </div>

                <span
                  className={styles.mobileScrollCue}
                  data-visible={
                    isCompact && showMobileScrollCue ? "true" : "false"
                  }
                  aria-hidden="true"
                >
                  {copy.scrollCue}
                  <svg viewBox="0 0 12 12">
                    <path d="M2.5 4.25 6 7.75l3.5-3.5" />
                  </svg>
                </span>

                <footer className={styles.commandBar}>
                  <div>
                    <strong>{copy.runApiLabel}</strong>
                    <code>{activePhase.command}</code>
                  </div>
                  <span>
                    <i aria-hidden="true" />
                    {copy.syncedLabel}
                  </span>
                </footer>
              </section>
        </div>
      </div>

      <p className={styles.srAnnouncement} aria-live="polite">
        {formatCopy(copy.announcement, {
          phase: activePhase.title,
          status: activePhase.status,
        })}
      </p>
    </div>
  );
}

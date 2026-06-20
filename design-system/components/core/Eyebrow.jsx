import React from "react";

/**
 * INPLUX Eyebrow — uppercase, tracked kicker above headings.
 * Pass an array of items to render the middot-separated form
 * (AGENTES DE IA · CEREBRO LEGAL · FÁBRICA DE SOFTWARE).
 */
export function Eyebrow({ children, items, onDark = false, style = {}, ...rest }) {
  const color = onDark ? "var(--text-on-ink-muted)" : "var(--text-muted)";
  const content = items
    ? items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ opacity: 0.5, margin: "0 0.5em" }}>·</span>}
          {it}
        </React.Fragment>
      ))
    : children;
  return (
    <span
      className="inplux-eyebrow"
      style={{
        display: "inline-block",
        fontFamily: "var(--font-body)",
        fontSize: "var(--fs-label)",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "var(--tracking-label)",
        color,
        ...style,
      }}
      {...rest}
    >
      {content}
    </span>
  );
}

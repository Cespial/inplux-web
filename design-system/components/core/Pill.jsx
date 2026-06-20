import React from "react";

/**
 * INPLUX Pill — outline capsule with a teal-accented leading figure.
 * The authority-stat motif: "+25 años", "+50 municipios", "+100 proyectos".
 */
export function Pill({ figure, label, onDark = false, style = {}, ...rest }) {
  return (
    <span
      className="inplux-pill"
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "6px",
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        fontWeight: 500,
        padding: "8px 16px",
        minHeight: "var(--touch-min)",
        boxSizing: "border-box",
        borderRadius: "var(--radius-pill)",
        border: onDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid var(--border)",
        background: onDark ? "rgba(255,255,255,0.04)" : "var(--white)",
        color: onDark ? "var(--text-on-ink-muted)" : "var(--text-body)",
        ...style,
      }}
      {...rest}
    >
      <strong style={{ color: onDark ? "var(--teal-bright)" : "var(--teal)", fontWeight: 700 }}>
        {figure}
      </strong>
      {label}
    </span>
  );
}

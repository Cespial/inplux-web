import React from "react";

/**
 * INPLUX Stat — a large serif figure over an uppercase label.
 * Used in authority bands and metric grids.
 */
export function Stat({ value, label, onDark = false, accent = false, align = "left", style = {}, ...rest }) {
  return (
    <div
      className="inplux-stat"
      style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: align, alignItems: align === "center" ? "center" : "flex-start", ...style }}
      {...rest}
    >
      <span style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 400,
        fontSize: "clamp(2.25rem, 1.5rem + 2.5vw, 3.25rem)",
        lineHeight: 1,
        letterSpacing: "var(--tracking-display)",
        color: accent ? (onDark ? "var(--teal-bright)" : "var(--teal)") : (onDark ? "var(--white)" : "var(--ink)"),
      }}>{value}</span>
      <span style={{
        fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "var(--tracking-label)",
        color: onDark ? "var(--text-on-ink-muted)" : "var(--text-muted)",
      }}>{label}</span>
    </div>
  );
}

import React from "react";

/**
 * INPLUX Badge / Tag — small uppercase or sentence-case pill.
 * Outline by default; soft-teal and ink-accent fills available.
 */
export function Badge({ children, variant = "outline", uppercase = false, style = {}, ...rest }) {
  const variants = {
    outline: { background: "transparent", color: "var(--text-body)", border: "1px solid var(--border)" },
    soft: { background: "var(--teal-soft)", color: "var(--teal)", border: "1px solid transparent" },
    teal: { background: "var(--teal)", color: "var(--white)", border: "1px solid var(--teal)" },
    ink: { background: "var(--ink)", color: "var(--white)", border: "1px solid var(--ink)" },
    onDark: { background: "rgba(255,255,255,0.06)", color: "var(--teal-bright)", border: "1px solid rgba(255,255,255,0.14)" },
  };
  return (
    <span
      className="inplux-badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: uppercase ? "11px" : "12.5px",
        lineHeight: 1,
        textTransform: uppercase ? "uppercase" : "none",
        letterSpacing: uppercase ? "var(--tracking-label)" : "0.01em",
        padding: uppercase ? "5px 11px" : "6px 13px",
        borderRadius: "var(--radius-pill)",
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

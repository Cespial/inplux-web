import React from "react";

/**
 * INPLUX Input + Field wrapper. White surface, hairline border, ink focus ring.
 * Field adds an optional uppercase label and helper/error text.
 */
export function Input({ invalid = false, style = {}, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const border = invalid ? "var(--teal)" : focus ? "var(--gray-800)" : "var(--border)";
  return (
    <input
      className="inplux-input"
      onFocus={(e) => { setFocus(true); rest.onFocus && rest.onFocus(e); }}
      onBlur={(e) => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
      style={{
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "var(--font-body)",
        fontSize: "15px",
        color: "var(--text-strong)",
        background: "var(--white)",
        border: `1px solid ${border}`,
        borderRadius: "var(--radius-sm)",
        padding: "14px 16px",
        minHeight: "48px",
        outline: "none",
        boxShadow: focus ? "0 0 0 3px rgba(0,0,0,0.04)" : "none",
        transition: "border-color var(--dur-fast) var(--ease-brand), box-shadow var(--dur-fast) var(--ease-brand)",
        ...style,
      }}
      {...rest}
    />
  );
}

export function Field({ label, htmlFor, helper, error, children, style = {} }) {
  return (
    <label htmlFor={htmlFor} style={{ display: "flex", flexDirection: "column", gap: "7px", ...style }}>
      {label && (
        <span style={{
          fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "var(--tracking-label)",
          color: "var(--text-muted)",
        }}>{label}</span>
      )}
      {children}
      {(error || helper) && (
        <span style={{ fontSize: "12.5px", color: error ? "var(--teal)" : "var(--text-muted)" }}>
          {error || helper}
        </span>
      )}
    </label>
  );
}

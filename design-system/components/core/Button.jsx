import React from "react";

/**
 * INPLUX Button — Editorial White System v3.
 * Primary = ink fill; secondary = ghost outline; subtle teal = quiet link-ish.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  iconLeft = null,
  iconRight = null,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: "8px 16px", fontSize: "13px", minHeight: "38px" },
    md: { padding: "12px 24px", fontSize: "var(--fs-button, 14px)", minHeight: "44px" },
    lg: { padding: "15px 30px", fontSize: "15px", minHeight: "52px" },
  };

  const variants = {
    primary: {
      background: "var(--ink)",
      color: "var(--white)",
      border: "1px solid var(--ink)",
    },
    secondary: {
      background: "transparent",
      color: "var(--ink)",
      border: "1px solid var(--border)",
    },
    teal: {
      background: "var(--teal)",
      color: "var(--white)",
      border: "1px solid var(--teal)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-body)",
      border: "1px solid transparent",
    },
  };

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    letterSpacing: "0.01em",
    lineHeight: 1,
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "var(--transition-button)",
    whiteSpace: "nowrap",
    textDecoration: "none",
    ...sizes[size],
    ...variants[variant],
    ...style,
  };

  const Tag = as;
  return (
    <Tag
      className={`inplux-btn inplux-btn--${variant}`}
      style={base}
      disabled={as === "button" ? disabled : undefined}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}

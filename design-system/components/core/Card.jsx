import React from "react";

/**
 * INPLUX Card — warm white surface, hairline border, 14px radius.
 * Optional hover lift. Composes freely (eyebrow, heading, body, footer).
 */
export function Card({ children, hover = true, padding = "2rem", as = "div", style = {}, ...rest }) {
  const [lift, setLift] = React.useState(false);
  const Tag = as;
  return (
    <Tag
      className="inplux-card"
      onMouseEnter={hover ? () => setLift(true) : undefined}
      onMouseLeave={hover ? () => setLift(false) : undefined}
      style={{
        background: "var(--surface-card)",
        border: `1px solid ${lift ? "var(--gray-200)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        padding,
        boxShadow: lift ? "var(--shadow-lg)" : "var(--shadow-xs)",
        transform: lift ? "translateY(-2px)" : "translateY(0)",
        transition: "var(--transition-card)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

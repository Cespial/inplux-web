import * as React from "react";

/**
 * Small pill-shaped tag/badge for categories, statuses and meta labels.
 * Outline by default; soft-teal, teal, ink and on-dark fills.
 */
export interface BadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  /** @default "outline" */
  variant?: "outline" | "soft" | "teal" | "ink" | "onDark";
  /** Uppercase + label tracking. @default false */
  uppercase?: boolean;
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): JSX.Element;

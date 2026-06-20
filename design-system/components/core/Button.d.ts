import * as React from "react";

/**
 * INPLUX primary action button. Ink fill by default; teal accent and ghost
 * outline variants for the warm editorial system. Min touch target 44px.
 *
 * @startingPoint section="Core" subtitle="Ink / ghost / teal buttons" viewport="700x150"
 */
export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  /** Visual style. @default "primary" */
  variant?: "primary" | "secondary" | "teal" | "ghost";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Element/component to render as (e.g. "a"). @default "button" */
  as?: any;
  /** Icon node rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;

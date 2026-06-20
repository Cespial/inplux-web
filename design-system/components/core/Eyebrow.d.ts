import * as React from "react";

/**
 * Uppercase tracked kicker above a heading. Pass `items` for the middot-
 * separated multi-label form.
 */
export interface EyebrowProps extends React.ComponentPropsWithoutRef<"span"> {
  /** Render a middot-separated list instead of children. */
  items?: React.ReactNode[];
  /** Muted-on-dark color. @default false */
  onDark?: boolean;
  children?: React.ReactNode;
}

export function Eyebrow(props: EyebrowProps): JSX.Element;

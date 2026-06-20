import * as React from "react";

/**
 * Official INPLUX logo lockups (SVG). Choose a variant; point `basePath` at
 * wherever the /assets/logos folder lives in the consuming project.
 */
export interface LogoProps extends Omit<React.ComponentPropsWithoutRef<"img">, "height"> {
  /** @default "horizontal" */
  variant?:
    | "horizontal" | "horizontal-inverse" | "horizontal-mono" | "horizontal-mono-white"
    | "stacked" | "stacked-inverse"
    | "wordmark-ink" | "wordmark-white"
    | "mark-teal" | "mark-ink" | "mark-white" | "mark-flux"
    | "appicon";
  /** Rendered height (px or CSS). @default 28 */
  height?: number | string;
  /** Path to the logos folder. @default "/assets/logos" */
  basePath?: string;
}

export function Logo(props: LogoProps): JSX.Element;

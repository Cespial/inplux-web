import * as React from "react";

/** Large serif figure over an uppercase label — authority metrics. */
export interface StatProps extends React.ComponentPropsWithoutRef<"div"> {
  value: React.ReactNode;
  label: React.ReactNode;
  /** Teal figure. @default false */
  accent?: boolean;
  /** For dark sections. @default false */
  onDark?: boolean;
  /** @default "left" */
  align?: "left" | "center";
}
export function Stat(props: StatProps): JSX.Element;

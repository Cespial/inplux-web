import * as React from "react";

/**
 * Warm white content card — hairline border, 14px radius, subtle hover lift.
 * Compose eyebrow + heading + body inside.
 *
 * @startingPoint section="Core" subtitle="Editorial white card" viewport="700x260"
 */
export interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Enable hover lift + shadow. @default true */
  hover?: boolean;
  /** CSS padding. @default "2rem" */
  padding?: string;
  as?: any;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;

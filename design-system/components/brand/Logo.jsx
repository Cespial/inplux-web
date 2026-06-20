import React from "react";

/**
 * INPLUX Logo — renders the official SVG lockups from /assets/logos.
 * `basePath` lets consumers point at wherever they copied the assets.
 */
const FILES = {
  "horizontal": "inplux-logo-horizontal.svg",
  "horizontal-inverse": "inplux-logo-horizontal-inverse.svg",
  "horizontal-mono": "inplux-logo-horizontal-mono.svg",
  "horizontal-mono-white": "inplux-logo-horizontal-mono-white.svg",
  "stacked": "inplux-logo-stacked.svg",
  "stacked-inverse": "inplux-logo-stacked-inverse.svg",
  "wordmark-ink": "inplux-wordmark-ink.svg",
  "wordmark-white": "inplux-wordmark-white.svg",
  "mark-teal": "inplux-mark-teal.svg",
  "mark-ink": "inplux-mark-ink.svg",
  "mark-white": "inplux-mark-white.svg",
  "mark-flux": "inplux-mark-flux-teal.svg",
  "appicon": "inplux-appicon.svg",
};

export function Logo({ variant = "horizontal", height = 28, basePath = "/assets/logos", alt = "INPLUX", style = {}, ...rest }) {
  const file = FILES[variant] || FILES.horizontal;
  return (
    <img
      src={`${basePath}/${file}`}
      alt={alt}
      style={{ height: typeof height === "number" ? `${height}px` : height, width: "auto", display: "block", ...style }}
      {...rest}
    />
  );
}

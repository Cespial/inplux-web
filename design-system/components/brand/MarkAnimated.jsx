import React from "react";

/**
 * INPLUX MarkAnimated — the Estratos mark with motion.
 * Bars rise into place in sequence. mode="enter" plays once (hero);
 * mode="loading" loops a rising wave (spinners, "thinking" states).
 * Honors prefers-reduced-motion (renders the settled mark, no motion).
 */
export function MarkAnimated({
  size = 96,
  mode = "enter",
  tile = false,
  onDark = false,
  style = {},
  ...rest
}) {
  const uid = React.useId().replace(/[:]/g, "");
  const low = tile ? "#ffffff" : onDark ? "#ffffff" : "#1a1918";
  const top = tile || onDark ? "#15dcc4" : "#0d7d74";
  const cls = `ipxm-${uid}`;

  // mark-only geometry (0..100); tile uses padded geometry
  const bars = tile
    ? [
        { x: 20, y: 58, w: 34, h: 11 },
        { x: 33, y: 43.5, w: 34, h: 11 },
        { x: 46, y: 29, w: 34, h: 11, accent: true },
      ]
    : [
        { x: 8, y: 57, w: 42, h: 13 },
        { x: 29, y: 39, w: 42, h: 13 },
        { x: 50, y: 21, w: 42, h: 13, accent: true },
      ];
  const rr = tile ? 5.5 : 6.5;

  const css = `
    .${cls} rect.bar { opacity: 1; }
    @keyframes ${cls}-enter {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes ${cls}-wave {
      0%, 70%, 100% { transform: translateY(0); }
      35%           { transform: translateY(-5px); }
    }
    .${cls}.is-enter rect.bar {
      transform-box: fill-box;
      animation: ${cls}-enter 0.5s cubic-bezier(0.25,1,0.5,1) both;
    }
    .${cls}.is-loading rect.bar {
      transform-box: fill-box;
      animation: ${cls}-wave 1.4s cubic-bezier(0.25,1,0.5,1) infinite;
    }
    .${cls} rect.b1 { animation-delay: 0s; }
    .${cls} rect.b2 { animation-delay: ${mode === "loading" ? "0.18s" : "0.12s"}; }
    .${cls} rect.b3 { animation-delay: ${mode === "loading" ? "0.36s" : "0.24s"}; }
    @media (prefers-reduced-motion: reduce) {
      .${cls} rect.bar { animation: none !important; opacity: 1 !important; transform: none !important; }
    }
  `;

  return (
    <div style={{ width: typeof size === "number" ? `${size}px` : size, ...style }} {...rest}>
      <svg viewBox="0 0 100 100" width="100%" role="img" aria-label="INPLUX">
        <style>{css}</style>
        <g className={`${cls} is-${mode}`}>
          {tile && <rect x="0" y="0" width="100" height="100" rx="22" fill={onDark ? "#0d0c0c" : "#1a1918"} />}
          {bars.map((b, i) => (
            <rect
              key={i}
              className={`bar b${i + 1}`}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={rr}
              fill={b.accent ? top : low}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

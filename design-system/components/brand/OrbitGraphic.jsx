import React from "react";

/**
 * INPLUX OrbitGraphic — the brand's signature spot illustration.
 * Concentric dotted rings with teal nodes orbiting a central labelled node.
 * Stands in for hero imagery on dark ink sections. Honors reduced-motion.
 */
export function OrbitGraphic({
  size = 360,
  label = "Agente",
  sublabel = "SELF-IMPROVING",
  onDark = true,
  animate = true,
  style = {},
  ...rest
}) {
  const teal = onDark ? "var(--teal-bright)" : "var(--teal)";
  const ring = onDark ? "rgba(21,220,196,0.28)" : "rgba(13,125,116,0.30)";
  const dim = onDark ? "rgba(255,255,255,0.04)" : "rgba(13,125,116,0.05)";

  const css = `
    @keyframes inplux-orbit { to { transform: rotate(360deg); } }
    @keyframes inplux-orbit-rev { to { transform: rotate(-360deg); } }
    @keyframes inplux-pulse { 0%,100% { opacity:.4; r:3 } 50% { opacity:1; r:4.5 } }
    .ipx-orbit-a { transform-origin:100px 100px; animation:inplux-orbit 26s linear infinite; }
    .ipx-orbit-b { transform-origin:100px 100px; animation:inplux-orbit-rev 38s linear infinite; }
    .ipx-node { animation:inplux-pulse 3s ease-in-out infinite; }
    .ipx-node.b { animation-delay:1.2s }
    .ipx-node.c { animation-delay:2.1s }
    @media (prefers-reduced-motion: reduce) {
      .ipx-orbit-a,.ipx-orbit-b,.ipx-node { animation:none !important; }
    }
  `;

  return (
    <div style={{ width: typeof size === "number" ? `${size}px` : size, ...style }} {...rest}>
      <svg viewBox="0 0 200 200" width="100%" role="img" aria-label="Diagrama de ecosistema INPLUX">
        {animate && <style>{css}</style>}
        {/* soft teal glow */}
        <defs>
          <radialGradient id="ipx-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={onDark ? "rgba(21,220,196,0.18)" : "rgba(13,125,116,0.10)"} />
            <stop offset="55%" stopColor="rgba(13,125,116,0.03)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="98" fill="url(#ipx-glow)" />

        {/* dotted rings */}
        <circle cx="100" cy="100" r="82" fill="none" stroke={ring} strokeWidth="1" strokeDasharray="1.5 7" />
        <circle cx="100" cy="100" r="58" fill="none" stroke={ring} strokeWidth="1" strokeDasharray="1.5 7" />
        <circle cx="100" cy="100" r="36" fill="none" stroke={dim} strokeWidth="1" />

        {/* orbiting nodes */}
        <g className={animate ? "ipx-orbit-a" : ""}>
          <circle className={animate ? "ipx-node" : ""} cx="182" cy="100" r="3.5" fill={teal} />
          <circle className={animate ? "ipx-node b" : ""} cx="100" cy="18" r="2.5" fill={teal} />
        </g>
        <g className={animate ? "ipx-orbit-b" : ""}>
          <circle className={animate ? "ipx-node c" : ""} cx="42" cy="100" r="3" fill={teal} />
          <circle cx="100" cy="158" r="2" fill={onDark ? "rgba(255,255,255,0.5)" : "var(--gray-400)"} />
        </g>

        {/* central node */}
        <circle cx="100" cy="100" r="26" fill={onDark ? "rgba(13,125,116,0.10)" : "var(--teal-soft)"} stroke={teal} strokeWidth="1.5" />
        <text x="100" y="98" textAnchor="middle" fontFamily="var(--font-body)" fontSize="9" fontWeight="700"
              fill={onDark ? "var(--white)" : "var(--ink)"}>{label}</text>
        <text x="100" y="109" textAnchor="middle" fontFamily="var(--font-body)" fontSize="4.4" fontWeight="600"
              letterSpacing="0.7" fill={teal}>{sublabel}</text>
      </svg>
    </div>
  );
}

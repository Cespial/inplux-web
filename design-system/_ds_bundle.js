/* @ds-bundle: {"format":3,"namespace":"INPLUXDesignSystem_318bee","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"MarkAnimated","sourcePath":"components/brand/MarkAnimated.jsx"},{"name":"OrbitGraphic","sourcePath":"components/brand/OrbitGraphic.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Field","sourcePath":"components/core/Input.jsx"},{"name":"Pill","sourcePath":"components/core/Pill.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"}],"sourceHashes":{"components/brand/Logo.jsx":"ed8e1d10144c","components/brand/MarkAnimated.jsx":"08f187d5f5f3","components/brand/OrbitGraphic.jsx":"d6b71a5ae589","components/core/Badge.jsx":"af91455a623b","components/core/Button.jsx":"cb6f1784a66e","components/core/Card.jsx":"bcfcaf9bf0fe","components/core/Eyebrow.jsx":"891bf7b4205f","components/core/Input.jsx":"547ce906302f","components/core/Pill.jsx":"3ce2b1040afd","components/core/Stat.jsx":"defdd90505fe","ui_kits/marketing-website/sections.jsx":"c1a00a0725f3","ui_kits/tribai/app.jsx":"83cbfe8095cb"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.INPLUXDesignSystem_318bee = window.INPLUXDesignSystem_318bee || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  "appicon": "inplux-appicon.svg"
};
function Logo({
  variant = "horizontal",
  height = 28,
  basePath = "/assets/logos",
  alt = "INPLUX",
  style = {},
  ...rest
}) {
  const file = FILES[variant] || FILES.horizontal;
  return /*#__PURE__*/React.createElement("img", _extends({
    src: `${basePath}/${file}`,
    alt: alt,
    style: {
      height: typeof height === "number" ? `${height}px` : height,
      width: "auto",
      display: "block",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/MarkAnimated.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * INPLUX MarkAnimated — the Estratos mark with motion.
 * Bars rise into place in sequence. mode="enter" plays once (hero);
 * mode="loading" loops a rising wave (spinners, "thinking" states).
 * Honors prefers-reduced-motion (renders the settled mark, no motion).
 */
function MarkAnimated({
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
  const bars = tile ? [{
    x: 20,
    y: 58,
    w: 34,
    h: 11
  }, {
    x: 33,
    y: 43.5,
    w: 34,
    h: 11
  }, {
    x: 46,
    y: 29,
    w: 34,
    h: 11,
    accent: true
  }] : [{
    x: 8,
    y: 57,
    w: 42,
    h: 13
  }, {
    x: 29,
    y: 39,
    w: 42,
    h: 13
  }, {
    x: 50,
    y: 21,
    w: 42,
    h: 13,
    accent: true
  }];
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
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: typeof size === "number" ? `${size}px` : size,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    width: "100%",
    role: "img",
    "aria-label": "INPLUX"
  }, /*#__PURE__*/React.createElement("style", null, css), /*#__PURE__*/React.createElement("g", {
    className: `${cls} is-${mode}`
  }, tile && /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "100",
    height: "100",
    rx: "22",
    fill: onDark ? "#0d0c0c" : "#1a1918"
  }), bars.map((b, i) => /*#__PURE__*/React.createElement("rect", {
    key: i,
    className: `bar b${i + 1}`,
    x: b.x,
    y: b.y,
    width: b.w,
    height: b.h,
    rx: rr,
    fill: b.accent ? top : low
  })))));
}
Object.assign(__ds_scope, { MarkAnimated });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/MarkAnimated.jsx", error: String((e && e.message) || e) }); }

// components/brand/OrbitGraphic.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * INPLUX OrbitGraphic — the brand's signature spot illustration.
 * Concentric dotted rings with teal nodes orbiting a central labelled node.
 * Stands in for hero imagery on dark ink sections. Honors reduced-motion.
 */
function OrbitGraphic({
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
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: typeof size === "number" ? `${size}px` : size,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 200",
    width: "100%",
    role: "img",
    "aria-label": "Diagrama de ecosistema INPLUX"
  }, animate && /*#__PURE__*/React.createElement("style", null, css), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: "ipx-glow",
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: onDark ? "rgba(21,220,196,0.18)" : "rgba(13,125,116,0.10)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "55%",
    stopColor: "rgba(13,125,116,0.03)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "rgba(0,0,0,0)"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "98",
    fill: "url(#ipx-glow)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "82",
    fill: "none",
    stroke: ring,
    strokeWidth: "1",
    strokeDasharray: "1.5 7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "58",
    fill: "none",
    stroke: ring,
    strokeWidth: "1",
    strokeDasharray: "1.5 7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "36",
    fill: "none",
    stroke: dim,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("g", {
    className: animate ? "ipx-orbit-a" : ""
  }, /*#__PURE__*/React.createElement("circle", {
    className: animate ? "ipx-node" : "",
    cx: "182",
    cy: "100",
    r: "3.5",
    fill: teal
  }), /*#__PURE__*/React.createElement("circle", {
    className: animate ? "ipx-node b" : "",
    cx: "100",
    cy: "18",
    r: "2.5",
    fill: teal
  })), /*#__PURE__*/React.createElement("g", {
    className: animate ? "ipx-orbit-b" : ""
  }, /*#__PURE__*/React.createElement("circle", {
    className: animate ? "ipx-node c" : "",
    cx: "42",
    cy: "100",
    r: "3",
    fill: teal
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "158",
    r: "2",
    fill: onDark ? "rgba(255,255,255,0.5)" : "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "26",
    fill: onDark ? "rgba(13,125,116,0.10)" : "var(--teal-soft)",
    stroke: teal,
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: "100",
    y: "98",
    textAnchor: "middle",
    fontFamily: "var(--font-body)",
    fontSize: "9",
    fontWeight: "700",
    fill: onDark ? "var(--white)" : "var(--ink)"
  }, label), /*#__PURE__*/React.createElement("text", {
    x: "100",
    y: "109",
    textAnchor: "middle",
    fontFamily: "var(--font-body)",
    fontSize: "4.4",
    fontWeight: "600",
    letterSpacing: "0.7",
    fill: teal
  }, sublabel)));
}
Object.assign(__ds_scope, { OrbitGraphic });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/OrbitGraphic.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * INPLUX Badge / Tag — small uppercase or sentence-case pill.
 * Outline by default; soft-teal and ink-accent fills available.
 */
function Badge({
  children,
  variant = "outline",
  uppercase = false,
  style = {},
  ...rest
}) {
  const variants = {
    outline: {
      background: "transparent",
      color: "var(--text-body)",
      border: "1px solid var(--border)"
    },
    soft: {
      background: "var(--teal-soft)",
      color: "var(--teal)",
      border: "1px solid transparent"
    },
    teal: {
      background: "var(--teal)",
      color: "var(--white)",
      border: "1px solid var(--teal)"
    },
    ink: {
      background: "var(--ink)",
      color: "var(--white)",
      border: "1px solid var(--ink)"
    },
    onDark: {
      background: "rgba(255,255,255,0.06)",
      color: "var(--teal-bright)",
      border: "1px solid rgba(255,255,255,0.14)"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "inplux-badge",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: uppercase ? "11px" : "12.5px",
      lineHeight: 1,
      textTransform: uppercase ? "uppercase" : "none",
      letterSpacing: uppercase ? "var(--tracking-label)" : "0.01em",
      padding: uppercase ? "5px 11px" : "6px 13px",
      borderRadius: "var(--radius-pill)",
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * INPLUX Button — Editorial White System v3.
 * Primary = ink fill; secondary = ghost outline; subtle teal = quiet link-ish.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  iconLeft = null,
  iconRight = null,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "8px 16px",
      fontSize: "13px",
      minHeight: "38px"
    },
    md: {
      padding: "12px 24px",
      fontSize: "var(--fs-button, 14px)",
      minHeight: "44px"
    },
    lg: {
      padding: "15px 30px",
      fontSize: "15px",
      minHeight: "52px"
    }
  };
  const variants = {
    primary: {
      background: "var(--ink)",
      color: "var(--white)",
      border: "1px solid var(--ink)"
    },
    secondary: {
      background: "transparent",
      color: "var(--ink)",
      border: "1px solid var(--border)"
    },
    teal: {
      background: "var(--teal)",
      color: "var(--white)",
      border: "1px solid var(--teal)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-body)",
      border: "1px solid transparent"
    }
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    letterSpacing: "0.01em",
    lineHeight: 1,
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "var(--transition-button)",
    whiteSpace: "nowrap",
    textDecoration: "none",
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `inplux-btn inplux-btn--${variant}`,
    style: base,
    disabled: as === "button" ? disabled : undefined
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * INPLUX Card — warm white surface, hairline border, 14px radius.
 * Optional hover lift. Composes freely (eyebrow, heading, body, footer).
 */
function Card({
  children,
  hover = true,
  padding = "2rem",
  as = "div",
  style = {},
  ...rest
}) {
  const [lift, setLift] = React.useState(false);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: "inplux-card",
    onMouseEnter: hover ? () => setLift(true) : undefined,
    onMouseLeave: hover ? () => setLift(false) : undefined,
    style: {
      background: "var(--surface-card)",
      border: `1px solid ${lift ? "var(--gray-200)" : "var(--border)"}`,
      borderRadius: "var(--radius-lg)",
      padding,
      boxShadow: lift ? "var(--shadow-lg)" : "var(--shadow-xs)",
      transform: lift ? "translateY(-2px)" : "translateY(0)",
      transition: "var(--transition-card)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * INPLUX Eyebrow — uppercase, tracked kicker above headings.
 * Pass an array of items to render the middot-separated form
 * (AGENTES DE IA · CEREBRO LEGAL · FÁBRICA DE SOFTWARE).
 */
function Eyebrow({
  children,
  items,
  onDark = false,
  style = {},
  ...rest
}) {
  const color = onDark ? "var(--text-on-ink-muted)" : "var(--text-muted)";
  const content = items ? items.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.5,
      margin: "0 0.5em"
    }
  }, "\xB7"), it)) : children;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "inplux-eyebrow",
    style: {
      display: "inline-block",
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-label)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color,
      ...style
    }
  }, rest), content);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * INPLUX Input + Field wrapper. White surface, hairline border, ink focus ring.
 * Field adds an optional uppercase label and helper/error text.
 */
function Input({
  invalid = false,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const border = invalid ? "var(--teal)" : focus ? "var(--gray-800)" : "var(--border)";
  return /*#__PURE__*/React.createElement("input", _extends({
    className: "inplux-input",
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      fontFamily: "var(--font-body)",
      fontSize: "15px",
      color: "var(--text-strong)",
      background: "var(--white)",
      border: `1px solid ${border}`,
      borderRadius: "var(--radius-sm)",
      padding: "14px 16px",
      minHeight: "48px",
      outline: "none",
      boxShadow: focus ? "0 0 0 3px rgba(0,0,0,0.04)" : "none",
      transition: "border-color var(--dur-fast) var(--ease-brand), box-shadow var(--dur-fast) var(--ease-brand)",
      ...style
    }
  }, rest));
}
function Field({
  label,
  htmlFor,
  helper,
  error,
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: "var(--text-muted)"
    }
  }, label), children, (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "12.5px",
      color: error ? "var(--teal)" : "var(--text-muted)"
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input, Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Pill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * INPLUX Pill — outline capsule with a teal-accented leading figure.
 * The authority-stat motif: "+25 años", "+50 municipios", "+100 proyectos".
 */
function Pill({
  figure,
  label,
  onDark = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "inplux-pill",
    style: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: "6px",
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      fontWeight: 500,
      padding: "8px 16px",
      minHeight: "var(--touch-min)",
      boxSizing: "border-box",
      borderRadius: "var(--radius-pill)",
      border: onDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid var(--border)",
      background: onDark ? "rgba(255,255,255,0.04)" : "var(--white)",
      color: onDark ? "var(--text-on-ink-muted)" : "var(--text-body)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: onDark ? "var(--teal-bright)" : "var(--teal)",
      fontWeight: 700
    }
  }, figure), label);
}
Object.assign(__ds_scope, { Pill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Pill.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * INPLUX Stat — a large serif figure over an uppercase label.
 * Used in authority bands and metric grids.
 */
function Stat({
  value,
  label,
  onDark = false,
  accent = false,
  align = "left",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "inplux-stat",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      textAlign: align,
      alignItems: align === "center" ? "center" : "flex-start",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "clamp(2.25rem, 1.5rem + 2.5vw, 3.25rem)",
      lineHeight: 1,
      letterSpacing: "var(--tracking-display)",
      color: accent ? onDark ? "var(--teal-bright)" : "var(--teal)" : onDark ? "var(--white)" : "var(--ink)"
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: onDark ? "var(--text-on-ink-muted)" : "var(--text-muted)"
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-website/sections.jsx
try { (() => {
/* INPLUX marketing website — UI kit sections.
   Recreation of inplux.co (Editorial White System v3).
   Composes DS primitives from the compiled bundle. Exports to window. */

const DS = window.INPLUXDesignSystem_318bee;
const {
  Button,
  Badge,
  Pill,
  Stat,
  Card,
  Eyebrow,
  Logo,
  OrbitGraphic,
  Input,
  Field
} = DS;
const ASSETS = "../../assets";

/* ---------- Nav ---------- */
function Nav({
  onContact,
  menuOpen,
  setMenuOpen
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const root = document.getElementById("site");
    const onScroll = () => setScrolled((root ? root.scrollTop : window.scrollY) > 12);
    const t = root || window;
    t.addEventListener("scroll", onScroll);
    return () => t.removeEventListener("scroll", onScroll);
  }, []);
  const links = ["Nosotros", "Ecosistema", "Sector público", "Blog"];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 30,
      background: "var(--nav-bg)",
      backdropFilter: "var(--blur-nav)",
      WebkitBackdropFilter: "var(--blur-nav)",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      boxShadow: scrolled ? "var(--shadow-xs)" : "none",
      transition: "border-color .3s, box-shadow .3s"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-lg)",
      margin: "0 auto",
      padding: "0 var(--gutter)",
      height: "72px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "24px"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "horizontal",
    height: 24,
    basePath: ASSETS + "/logos"
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: "30px",
      alignItems: "center"
    },
    className: "ipx-navlinks"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontSize: "14px",
      fontWeight: 500,
      color: "var(--text-body)",
      textDecoration: "none",
      transition: "color .2s"
    },
    onMouseEnter: e => e.target.style.color = "var(--teal)",
    onMouseLeave: e => e.target.style.color = "var(--text-body)"
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: onContact,
    className: "ipx-nav-cta"
  }, "Hablemos"), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Men\xFA",
    onClick: () => setMenuOpen(!menuOpen),
    className: "ipx-burger",
    style: {
      display: "none",
      width: "40px",
      height: "40px",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-sm)",
      background: "var(--white)",
      cursor: "pointer",
      flexDirection: "column",
      gap: "4px",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "16px",
      height: "1.5px",
      background: "var(--ink)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: "16px",
      height: "1.5px",
      background: "var(--ink)"
    }
  })))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "ipx-mobile-menu",
    style: {
      borderTop: "1px solid var(--border)",
      padding: "12px var(--gutter) 20px",
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => {
      e.preventDefault();
      setMenuOpen(false);
    },
    style: {
      padding: "12px 0",
      fontSize: "16px",
      color: "var(--text-strong)",
      textDecoration: "none",
      borderBottom: "1px solid var(--border-light)"
    }
  }, l))));
}

/* ---------- Hero (dark ink) ---------- */
function Hero({
  onContact
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      background: "var(--ink)",
      color: "var(--text-on-ink)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--glow-teal)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
      backgroundSize: "22px 22px",
      opacity: 0.6,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: "var(--container-lg)",
      margin: "0 auto",
      padding: "var(--section-y) var(--gutter)",
      display: "grid",
      gridTemplateColumns: "1.25fr 0.75fr",
      gap: "48px",
      alignItems: "center"
    },
    className: "ipx-hero-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    onDark: true,
    items: ["Agentes de IA", "Cerebro legal", "Fábrica de software"]
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "var(--fs-display)",
      lineHeight: "var(--leading-display)",
      letterSpacing: "var(--tracking-display)",
      margin: "20px 0 0"
    }
  }, "La norma la conocemos.", /*#__PURE__*/React.createElement("br", null), "La tecnolog\xEDa la ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "italic",
      color: "var(--teal-bright)"
    }
  }, "construimos.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-lead)",
      color: "var(--text-on-ink-muted)",
      lineHeight: "var(--leading-snug)",
      maxWidth: "46ch",
      margin: "26px 0 0"
    }
  }, "25 a\xF1os entre estatutos, NIC/NIIF y hacienda p\xFAblica \u2014 hoy convertidos en agentes de IA que aprenden y se mejoran solos."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "12px",
      marginTop: "32px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "teal",
    onClick: onContact
  }, "Hablemos"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onContact,
    style: {
      color: "var(--white)",
      borderColor: "rgba(255,255,255,0.22)",
      background: "transparent"
    }
  }, "Ver ecosistema")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px",
      marginTop: "32px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    figure: "+25",
    label: "a\xF1os",
    onDark: true
  }), /*#__PURE__*/React.createElement(Pill, {
    figure: "+50",
    label: "municipios",
    onDark: true
  }), /*#__PURE__*/React.createElement(Pill, {
    figure: "+100",
    label: "proyectos",
    onDark: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    },
    className: "ipx-hero-orbit"
  }, /*#__PURE__*/React.createElement(OrbitGraphic, {
    size: 380
  }))));
}

/* ---------- Logo strip ---------- */
function Allies() {
  const allies = ["Vegachí", "Cisneros", "CIS", "Parque Arví", "Think IT", "Alianza IT", "Navarro Ospina"];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--off-white)",
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-lg)",
      margin: "0 auto",
      padding: "28px var(--gutter)",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      flexWrap: "wrap",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: "var(--text-faint)",
      fontWeight: 600,
      marginRight: "8px"
    }
  }, "Conf\xEDan en nosotros"), allies.map(a => /*#__PURE__*/React.createElement("span", {
    key: a,
    style: {
      fontFamily: "var(--font-serif)",
      fontSize: "19px",
      color: "var(--gray-400)"
    }
  }, a))));
}

/* ---------- Ecosystem ---------- */
const PRODUCTS = [{
  name: "Tribai.co",
  tag: "Producto estrella",
  desc: "Inteligencia tributaria y financiera con IA que aprende.",
  star: true
}, {
  name: "Gobia",
  tag: "Gobernanza",
  desc: "Plataforma de gobernanza municipal y gestión pública."
}, {
  name: "Fourier",
  tag: "Cloud",
  desc: "Arquitectura de software e infraestructura en la nube."
}, {
  name: "Sistemas Aries",
  tag: "ERP · +31 años",
  desc: "ERP financiera modular para la operación contable."
}, {
  name: "Think IT",
  tag: "Ingeniería",
  desc: "Ingeniería de software y consultoría tecnológica."
}, {
  name: "Observatorio",
  tag: "Datos",
  desc: "Datos y analítica para la toma de decisiones."
}];
function Ecosystem() {
  return /*#__PURE__*/React.createElement("section", {
    id: "ecosistema",
    style: {
      background: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-lg)",
      margin: "0 auto",
      padding: "var(--section-y) var(--gutter)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "620px"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Ecosistema"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "var(--fs-h2)",
      lineHeight: "var(--leading-heading)",
      letterSpacing: "var(--tracking-display)",
      margin: "16px 0 0"
    }
  }, "Un hub, varios productos que ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "italic",
      color: "var(--teal)"
    }
  }, "conversan.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body)",
      color: "var(--text-body)",
      lineHeight: "var(--leading-body)",
      margin: "16px 0 0"
    }
  }, "Consultor\xEDa, tecnolog\xEDa e inteligencia artificial integradas en una sola propuesta de valor.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "18px",
      marginTop: "44px"
    },
    className: "ipx-eco-grid"
  }, PRODUCTS.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.name,
    padding: "1.75rem"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "14px"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "mark-teal",
    height: 26,
    basePath: ASSETS + "/logos"
  }), p.star ? /*#__PURE__*/React.createElement(Badge, {
    variant: "soft"
  }, p.tag) : /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    uppercase: true
  }, p.tag)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "24px",
      margin: "0 0 6px"
    }
  }, p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "14.5px",
      color: "var(--text-body)",
      lineHeight: "var(--leading-snug)",
      margin: 0
    }
  }, p.desc))))));
}

/* ---------- Pillars ---------- */
const PILLARS = [{
  n: "01",
  t: "Primero la norma, después el código",
  d: "El conocimiento regulatorio guía la tecnología, no al revés."
}, {
  n: "02",
  t: "Entregamos productos, no horas",
  d: "Entrega orientada a producto: algo que funciona y se queda."
}, {
  n: "03",
  t: "Medimos impacto, no cobramos por estar",
  d: "Enfoque en resultados medibles, no en la facturación de tiempo."
}];
function Pillars() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--off-white)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-lg)",
      margin: "0 auto",
      padding: "var(--section-y) var(--gutter)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Filosof\xEDa"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "40px",
      marginTop: "32px"
    },
    className: "ipx-pillars"
  }, PILLARS.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.n
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontSize: "40px",
      color: "var(--teal)",
      lineHeight: 1
    }
  }, p.n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "23px",
      lineHeight: "var(--leading-heading)",
      margin: "16px 0 8px"
    }
  }, p.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "15px",
      color: "var(--text-body)",
      lineHeight: "var(--leading-body)",
      margin: 0
    }
  }, p.d))))));
}

/* ---------- Stats band (dark) ---------- */
function StatsBand() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--ink)",
      color: "var(--text-on-ink)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-lg)",
      margin: "0 auto",
      padding: "calc(var(--section-y) * 0.7) var(--gutter)",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "24px"
    },
    className: "ipx-stats"
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "2000",
    label: "Desde",
    onDark: true
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "+25",
    label: "A\xF1os",
    onDark: true,
    accent: true
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "+50",
    label: "Municipios",
    onDark: true
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "+100",
    label: "Proyectos",
    onDark: true,
    accent: true
  })));
}

/* ---------- CTA + Contact ---------- */
function CTA({
  contactRef,
  sent,
  setSent
}) {
  return /*#__PURE__*/React.createElement("section", {
    ref: contactRef,
    style: {
      background: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-md)",
      margin: "0 auto",
      padding: "var(--section-y) var(--gutter)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Hablemos"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "var(--fs-h2)",
      lineHeight: "var(--leading-heading)",
      letterSpacing: "var(--tracking-display)",
      margin: "16px 0 0"
    }
  }, "Cu\xE9ntenos su reto. ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "italic",
      color: "var(--teal)"
    }
  }, "Le respondemos.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body)",
      color: "var(--text-body)",
      margin: "16px auto 0",
      maxWidth: "44ch"
    }
  }, "Tributaristas y financieros que escriben c\xF3digo. Escr\xEDbanos y le contamos qu\xE9 ya hemos hecho."), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "32px",
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      padding: "16px 24px",
      background: "var(--teal-soft)",
      color: "var(--teal)",
      borderRadius: "var(--radius-lg)",
      fontWeight: 600
    }
  }, "Gracias \u2014 le escribiremos pronto.") : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      marginTop: "32px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      maxWidth: "420px",
      margin: "32px auto 0",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Nombre",
    htmlFor: "n"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "n",
    required: true,
    placeholder: "Su nombre"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Correo",
    htmlFor: "c"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "c",
    type: "email",
    required: true,
    placeholder: "usted@empresa.co"
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "primary",
    style: {
      width: "100%",
      marginTop: "4px"
    }
  }, "Hablemos"))));
}

/* ---------- Footer ---------- */
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--gray-950)",
      color: "var(--text-on-ink-muted)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-lg)",
      margin: "0 auto",
      padding: "56px var(--gutter) 40px",
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr",
      gap: "40px"
    },
    className: "ipx-footer"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    variant: "horizontal-inverse",
    height: 24,
    basePath: ASSETS + "/logos"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "14px",
      lineHeight: "var(--leading-body)",
      margin: "16px 0 0",
      maxWidth: "32ch"
    }
  }, "Tributaristas que construyen tecnolog\xEDa. Medell\xEDn, Colombia \u2014 desde 2000.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: "var(--white)",
      fontWeight: 600,
      marginBottom: "14px"
    }
  }, "Ecosistema"), ["Tribai.co", "Gobia", "Fourier", "Sistemas Aries"].map(x => /*#__PURE__*/React.createElement("a", {
    key: x,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      display: "block",
      color: "var(--text-on-ink-muted)",
      textDecoration: "none",
      fontSize: "14px",
      padding: "5px 0"
    }
  }, x))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: "var(--white)",
      fontWeight: 600,
      marginBottom: "14px"
    }
  }, "Contacto"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "14px",
      margin: "0 0 6px"
    }
  }, "gerencia@inplux.co"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "14px",
      margin: "0 0 6px"
    }
  }, "(+57) 313 889 36 15"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "14px",
      margin: 0
    }
  }, "Calle 23 # 43 A 66, Medell\xEDn"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid rgba(255,255,255,0.1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-lg)",
      margin: "0 auto",
      padding: "20px var(--gutter)",
      display: "flex",
      justifyContent: "space-between",
      fontSize: "12.5px",
      color: "var(--gray-400)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 INPLUX S.A.S."), /*#__PURE__*/React.createElement("span", null, "inplux.co"))));
}
Object.assign(window, {
  Nav,
  Hero,
  Allies,
  Ecosystem,
  Pillars,
  StatsBand,
  CTA,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-website/sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tribai/app.jsx
try { (() => {
/* Tribai.co — product app UI kit.
   Inteligencia tributaria y financiera con IA que aprende.
   Warm editorial system: dark ink rail + white workspace, teal accent.
   Icons: Lucide (CDN) — documented substitute for the pending INPLUX icon set. */

const TDS = window.INPLUXDesignSystem_318bee;
const {
  Button,
  Badge,
  Input,
  Logo
} = TDS;
const MarkAnimated = TDS.MarkAnimated || (({
  size = 24
}) => React.createElement(Logo, {
  variant: "mark-teal",
  height: typeof size === "number" ? size : 24,
  basePath: TASSETS + "/logos"
}));
const TASSETS = "../../assets";
function Icon({
  name,
  size = 18,
  color = "currentColor",
  strokeWidth = 1.75,
  style = {}
}) {
  // Renders a Lucide icon; lucide.createIcons() is invoked after each render in App.
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: {
      width: size,
      height: size,
      color,
      display: "inline-flex",
      strokeWidth,
      ...style
    }
  });
}

/* ---------------- Login ---------------- */
function Login({
  onEnter
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr"
    },
    className: "tb-login"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--ink)",
      color: "var(--white)",
      position: "relative",
      overflow: "hidden",
      padding: "56px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--glow-teal)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
      backgroundSize: "22px 22px",
      opacity: 0.6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "mark-white",
    height: 26,
    basePath: TASSETS + "/logos"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      letterSpacing: "0.14em",
      fontSize: "15px"
    }
  }, "TRIBAI")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: "var(--text-on-ink-muted)",
      fontWeight: 600,
      marginBottom: "18px"
    }
  }, "Producto \xB7 INPLUX"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "44px",
      lineHeight: 1.05,
      letterSpacing: "var(--tracking-display)",
      margin: 0
    }
  }, "Inteligencia tributaria que ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "italic",
      color: "var(--teal-bright)"
    }
  }, "aprende.")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-on-ink-muted)",
      fontSize: "16px",
      lineHeight: 1.5,
      margin: "20px 0 0",
      maxWidth: "40ch"
    }
  }, "25 a\xF1os de gesti\xF3n tributaria convertidos en un agente que cita la norma viva.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontSize: "12.5px",
      color: "var(--gray-400)"
    }
  }, "tribai.co")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--white)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px"
    }
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onEnter();
    },
    style: {
      width: "100%",
      maxWidth: "340px",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "30px",
      margin: "0 0 6px"
    }
  }, "Entrar"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: "14px",
      margin: 0
    }
  }, "Acceda a su espacio de consultas.")), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "7px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: "var(--text-muted)"
    }
  }, "Correo"), /*#__PURE__*/React.createElement(Input, {
    type: "email",
    defaultValue: "laura@municipio.gov.co"
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "7px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: "var(--text-muted)"
    }
  }, "Contrase\xF1a"), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    defaultValue: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "primary",
    style: {
      width: "100%",
      marginTop: "4px"
    }
  }, "Entrar"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontSize: "13px",
      color: "var(--text-muted)",
      textAlign: "center",
      textDecoration: "none"
    }
  }, "\xBFOlvid\xF3 su contrase\xF1a?"))));
}

/* ---------------- Sidebar ---------------- */
function Sidebar({
  active,
  setActive,
  onLogout,
  threads
}) {
  const nav = [{
    id: "chat",
    icon: "messages-square",
    label: "Consultas"
  }, {
    id: "norms",
    icon: "scale",
    label: "Estatuto vivo"
  }, {
    id: "docs",
    icon: "file-text",
    label: "Documentos"
  }, {
    id: "data",
    icon: "bar-chart-3",
    label: "Observatorio"
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: "260px",
      flex: "none",
      background: "var(--ink)",
      color: "var(--text-on-ink)",
      display: "flex",
      flexDirection: "column",
      padding: "18px 14px"
    },
    className: "tb-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "4px 6px 16px"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "mark-teal",
    height: 22,
    basePath: TASSETS + "/logos"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      letterSpacing: "0.14em",
      fontSize: "14px"
    }
  }, "TRIBAI")), /*#__PURE__*/React.createElement(Button, {
    variant: "teal",
    size: "sm",
    style: {
      width: "100%",
      justifyContent: "flex-start",
      gap: "8px",
      marginBottom: "16px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16,
    color: "#fff"
  }), " Nueva consulta"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "2px"
    }
  }, nav.map(n => {
    const on = active === n.id;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => setActive(n.id),
      style: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 10px",
        border: "none",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "14px",
        fontWeight: 500,
        fontFamily: "var(--font-body)",
        background: on ? "rgba(255,255,255,0.07)" : "transparent",
        color: on ? "var(--white)" : "var(--text-on-ink-muted)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 17,
      color: on ? "var(--teal-bright)" : "currentColor"
    }), n.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "20px",
      fontSize: "10px",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: "var(--gray-500)",
      fontWeight: 600,
      padding: "0 10px 8px"
    }
  }, "Recientes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "1px",
      overflowY: "auto",
      flex: 1
    }
  }, threads.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    style: {
      display: "block",
      textAlign: "left",
      padding: "8px 10px",
      border: "none",
      background: "transparent",
      color: "var(--text-on-ink-muted)",
      fontSize: "13px",
      fontFamily: "var(--font-body)",
      cursor: "pointer",
      borderRadius: "var(--radius-sm)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid rgba(255,255,255,0.1)",
      paddingTop: "12px",
      marginTop: "8px",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "30px",
      height: "30px",
      borderRadius: "var(--radius-pill)",
      background: "var(--teal)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: 700
    }
  }, "LR"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "13px",
      fontWeight: 600,
      color: "var(--white)"
    }
  }, "Laura Restrepo"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: "var(--gray-400)"
    }
  }, "Hacienda \xB7 Cisneros")), /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    "aria-label": "Salir",
    style: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: "var(--gray-400)",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "log-out",
    size: 16
  }))));
}

/* ---------------- Chat thread ---------------- */
function AgentMessage({
  msg
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "14px",
      maxWidth: "760px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "30px",
      height: "30px",
      flex: "none",
      borderRadius: "var(--radius-sm)",
      background: "var(--teal-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "mark-teal",
    height: 15,
    basePath: TASSETS + "/logos"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      fontWeight: 600,
      color: "var(--text-muted)",
      marginBottom: "6px"
    }
  }, "Tribai"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "15px",
      lineHeight: 1.65,
      color: "var(--text-strong)"
    },
    dangerouslySetInnerHTML: {
      __html: msg.html
    }
  }), msg.citation && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "14px",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "14px 16px",
      background: "var(--off-white)",
      maxWidth: "520px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "6px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "scale",
    size: 15,
    color: "var(--teal)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "11px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: "var(--teal)"
    }
  }, msg.citation.tag), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    style: {
      marginLeft: "auto",
      fontSize: "10px"
    }
  }, "Estatuto vivo")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "14px",
      fontWeight: 600,
      color: "var(--text-strong)",
      marginBottom: "2px"
    }
  }, msg.citation.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "13px",
      color: "var(--text-body)",
      lineHeight: 1.5
    }
  }, msg.citation.body))));
}
function UserMessage({
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--ink)",
      color: "var(--white)",
      padding: "12px 18px",
      borderRadius: "var(--radius-lg)",
      fontSize: "15px",
      lineHeight: 1.5,
      maxWidth: "70%"
    }
  }, text));
}
function Welcome({
  onPick
}) {
  const prompts = ["¿Cómo calculo la sobretasa bomberil 2026?", "Diferencia entre NIC 12 y el impuesto diferido local", "Genera el borrador de acuerdo de exención de predial"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "640px",
      margin: "auto",
      textAlign: "center",
      padding: "40px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      padding: "14px",
      borderRadius: "var(--radius-lg)",
      background: "var(--teal-soft)",
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement(MarkAnimated, {
    size: 32,
    mode: "enter"
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "34px",
      margin: "0 0 10px"
    }
  }, "\xBFQu\xE9 consultamos ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: "italic",
      color: "var(--teal)"
    }
  }, "hoy?")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: "15px",
      margin: "0 0 28px"
    }
  }, "Pregunte sobre normativa, NIC/NIIF o hacienda p\xFAblica. Citamos la norma viva."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      maxWidth: "480px",
      margin: "0 auto"
    }
  }, prompts.map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => onPick(p),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      textAlign: "left",
      padding: "13px 16px",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      background: "var(--white)",
      cursor: "pointer",
      fontSize: "14px",
      color: "var(--text-body)",
      fontFamily: "var(--font-body)",
      transition: "border-color .2s, box-shadow .2s"
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = "var(--gray-200)";
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = "var(--border)";
      e.currentTarget.style.boxShadow = "none";
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 16,
    color: "var(--teal)"
  }), " ", p))));
}
function Chat({
  messages,
  onSend,
  thinking
}) {
  const [val, setVal] = React.useState("");
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);
  const send = text => {
    const t = (text ?? val).trim();
    if (!t) return;
    onSend(t);
    setVal("");
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "var(--white)",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "60px",
      flex: "none",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontSize: "19px"
    }
  }, "Consulta tributaria"), /*#__PURE__*/React.createElement(Badge, {
    variant: "soft"
  }, "IA \xB7 Estatuto vivo")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share-2",
    size: 15
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 15,
    style: {
      marginRight: 6
    }
  }), " Exportar"))), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "28px"
    }
  }, messages.length === 0 ? /*#__PURE__*/React.createElement(Welcome, {
    onPick: p => send(p)
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "26px",
      maxWidth: "820px",
      margin: "0 auto"
    }
  }, messages.map((m, i) => m.role === "user" ? /*#__PURE__*/React.createElement(UserMessage, {
    key: i,
    text: m.text
  }) : /*#__PURE__*/React.createElement(AgentMessage, {
    key: i,
    msg: m
  })), thinking && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "14px",
      alignItems: "center",
      color: "var(--text-muted)",
      fontSize: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "30px",
      height: "30px",
      borderRadius: "var(--radius-sm)",
      background: "var(--teal-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(MarkAnimated, {
    size: 20,
    mode: "loading"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tb-pulse"
  }, "Consultando la norma\u2026")))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      padding: "16px 28px 22px",
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "820px",
      margin: "0 auto",
      display: "flex",
      gap: "10px",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: val,
    onChange: e => setVal(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    placeholder: "Pregunte sobre normativa, NIC/NIIF, hacienda\u2026",
    rows: 1,
    style: {
      flex: 1,
      resize: "none",
      fontFamily: "var(--font-body)",
      fontSize: "15px",
      color: "var(--text-strong)",
      background: "var(--white)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      padding: "13px 16px",
      minHeight: "48px",
      maxHeight: "120px",
      outline: "none",
      lineHeight: 1.5
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => send(),
    style: {
      height: "48px",
      padding: "0 18px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up",
    size: 18,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "820px",
      margin: "8px auto 0",
      fontSize: "11px",
      color: "var(--text-faint)",
      textAlign: "center"
    }
  }, "Tribai cita la norma vigente. Verifique siempre antes de decisiones oficiales.")));
}
Object.assign(window, {
  TbIcon: Icon,
  Login,
  Sidebar,
  Chat
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tribai/app.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.MarkAnimated = __ds_scope.MarkAnimated;

__ds_ns.OrbitGraphic = __ds_scope.OrbitGraphic;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.Stat = __ds_scope.Stat;

})();

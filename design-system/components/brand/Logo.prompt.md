Renders the official INPLUX SVG lockups. Use `horizontal` in nav on light, `*-inverse` / `stacked-inverse` on dark ink, `mark-*` for the triangle only.

```jsx
<Logo variant="horizontal" height={28} basePath="assets/logos" />
<Logo variant="stacked-inverse" height={64} />
<Logo variant="mark-flux" height={40} />
```

Always set `basePath` to where you copied `/assets/logos`. Never recolor or distort; use the supplied mono/inverse variants instead.

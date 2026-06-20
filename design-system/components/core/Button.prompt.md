Primary action button for INPLUX — ink fill by default, with ghost and teal variants. Use for CTAs like "Hablemos". Min height 44px; lifts 1px on hover.

```jsx
<Button variant="primary">Hablemos</Button>
<Button variant="secondary">Ver productos</Button>
<Button variant="teal" iconRight={<ArrowIcon/>}>Probar Tribai</Button>
```

Variants: `primary` (ink), `secondary` (ghost outline), `teal` (accent fill — use sparingly), `ghost` (borderless). Sizes: `sm` / `md` / `lg`. Render as a link with `as="a" href="…"`.

The brand's signature ecosystem graphic — dotted orbital rings with pulsing teal nodes around a central labelled node. Use on dark ink hero/CTA sections instead of a photo.

```jsx
<OrbitGraphic size={420} label="Agente" sublabel="SELF-IMPROVING" />
<OrbitGraphic size={280} onDark={false} animate={false} />
```

`onDark` (default true) switches to teal-bright on ink; set `animate={false}` for static contexts. Self-contained SVG; respects reduced-motion.

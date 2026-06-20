Animated Estratos mark — the three bars rise into place in sequence. Use `mode="enter"` for a hero entrance (plays once) and `mode="loading"` for spinners / "thinking" states (loops). Respects reduced-motion.

```jsx
<MarkAnimated size={120} mode="enter" />
<MarkAnimated size={28} mode="loading" onDark />
<MarkAnimated size={96} tile mode="enter" />
```

`tile` wraps it on the rounded ink app-icon tile; `onDark` switches to white bars + teal-bright accent.

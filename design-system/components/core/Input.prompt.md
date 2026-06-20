Form input with the warm editorial treatment — white fill, hairline border, neutral ink focus ring (never blue). `Field` wraps any control with an uppercase label and helper/error text.

```jsx
<Field label="Correo" htmlFor="email" helper="Te respondemos en 24h.">
  <Input id="email" type="email" placeholder="tu@empresa.co" />
</Field>
```

Set `invalid` for error state (teal border) and pass `error` on Field for the message.

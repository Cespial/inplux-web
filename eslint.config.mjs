import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "design-system/**",
    // ⚠️ El árbol de trabajo de las herramientas de agente, que puede contener
    // una COPIA entera del repositorio (`.claude/worktrees/…`). Sin esta línea,
    // `npm run lint` entra ahí, vuelve a recorrer el proyecto —esta vez con el
    // `design-system/` que la línea de arriba solo ignora en la raíz— y falla
    // por archivos que no son fuente de este sitio.
    ".claude/**",
  ]),
]);

export default eslintConfig;

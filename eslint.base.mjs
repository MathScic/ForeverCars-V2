// Config ESLint commune à tous les paquets du monorepo.
// À placer EN DERNIER dans chaque eslint.config.mjs : eslint-config-prettier
// désactive les règles de mise en forme (Prettier s'en charge).
import prettier from "eslint-config-prettier";

const base = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/next-env.d.ts",
    ],
  },
  prettier,
];

export default base;

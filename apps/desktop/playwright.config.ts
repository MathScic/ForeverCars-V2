import { defineConfig } from "@playwright/test";

// Tests e2e de l'app Electron construite (out/), lancés par `pnpm e2e`.
export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  reporter: "list",
});

import { resolve } from "node:path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";

// CSP stricte en production. En dev, Vite/React Refresh injecte un script inline :
// on n'autorise 'unsafe-inline' que dans ce cas.
function cspPlugin(): Plugin {
  const policy = (dev: boolean) =>
    [
      "default-src 'self'",
      `script-src 'self'${dev ? " 'unsafe-inline'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      // Photos du parc : stockage Supabase (lecture publique, comme sur le site).
      "img-src 'self' data: blob: https://vptxtgqduoxdutimivnv.supabase.co",
      "font-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'none'",
    ].join("; ");
  return {
    name: "forevercars-csp",
    transformIndexHtml: (html, ctx) => html.replace("%CSP%", policy(Boolean(ctx.server))),
  };
}

export default defineConfig({
  // Tout le code est intégré au paquet ; seule « sharp » (traitement photo, binaire natif) reste à part
  // (« dependencies » du package.json), ce qui garde l'installateur léger.
  main: { plugins: [externalizeDepsPlugin()] },
  preload: { plugins: [externalizeDepsPlugin()] },
  renderer: {
    resolve: { alias: { "@renderer": resolve(__dirname, "src/renderer/src") } },
    plugins: [react(), tailwindcss(), cspPlugin()],
    // Config PostCSS vide : empêche Vite de remonter jusqu'à un postcss.config du dossier utilisateur.
    css: { postcss: {} },
  },
});

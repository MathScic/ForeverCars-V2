import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
// Polices auto-hébergées (aucune requête Google Fonts : l'app marche hors-ligne)
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./styles.css";
import { DemoStoreProvider } from "./demo/store";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DemoStoreProvider>
      <RouterProvider router={router} />
    </DemoStoreProvider>
  </StrictMode>,
);

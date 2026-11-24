import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
// Polices de la charte auto-hébergées (packages/design/fonts), déclarées dans styles.css
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

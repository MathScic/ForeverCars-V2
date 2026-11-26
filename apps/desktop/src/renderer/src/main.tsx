import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
// Polices de la charte auto-hébergées (packages/design/fonts), déclarées dans styles.css
import "./styles.css";
import { DemoStoreProvider } from "./demo/store";
import AuthGate from "./live/AuthGate";
import { router } from "./router";

// Mode réel par défaut (connexion puis parc Supabase) ; la démo sert aux tests et aux présentations.
const root = createRoot(document.getElementById("root")!);
void window.api.app.mode().then((mode) => {
  const app = <RouterProvider router={router} />;
  root.render(<StrictMode>{mode === "demo" ? <DemoStoreProvider>{app}</DemoStoreProvider> : <AuthGate>{app}</AuthGate>}</StrictMode>);
});

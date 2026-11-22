import { createHashRouter } from "react-router";
import Shell from "./layout/Shell";
import Dashboard from "./pages/Dashboard";
import Team from "./pages/Team";
import Wizard from "./wizard/Wizard";
import Success from "./wizard/Success";

// HashRouter : l'app est chargée depuis file:// une fois packagée.
export const router = createHashRouter([
  {
    element: <Shell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "vendre", element: <Wizard /> },
      { path: "vendre/:id", element: <Wizard /> },
      { path: "succes/:id", element: <Success /> },
      { path: "equipe", element: <Team /> },
    ],
  },
]);

import { useDemoStore } from "../demo/store";
import type { Role } from "../demo/types";

const roles: { value: Role; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "seller", label: "Vendeur" },
];

// Uniquement pour l'ébauche : simule la connexion d'un admin ou d'un vendeur.
export default function RoleSwitch() {
  const { state, dispatch } = useDemoStore();
  return (
    <div role="radiogroup" aria-label="Rôle simulé" className="flex items-center gap-1 p-1 rounded-full border border-brand-gray-medium/40">
      {roles.map((r) => {
        const active = state.role === r.value;
        return (
          <button
            key={r.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => dispatch({ type: "setRole", role: r.value })}
            className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors ${
              active ? "bg-brand-orange text-brand-black" : "text-brand-gray-light hover:text-brand-white"
            }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

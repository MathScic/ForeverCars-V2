import { useStore } from "../data/store";
import type { Role } from "../demo/types";

const roles: { value: Role; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "seller", label: "Vendeur" },
];

// Uniquement pour l'ébauche : simule la connexion d'un admin ou d'un vendeur.
export default function RoleSwitch() {
  const { state, dispatch } = useStore();
  return (
    <div role="radiogroup" aria-label="Rôle simulé" className="flex items-center gap-1 rounded-full border border-line-strong p-1">
      {roles.map((r) => {
        const active = state.role === r.value;
        return (
          <button
            key={r.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => dispatch({ type: "setRole", role: r.value })}
            className={`h-9 rounded-full px-4 text-xs font-medium transition-colors duration-300 ${
              active ? "bg-ivory text-carbon" : "text-silver hover:text-ivory"
            }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

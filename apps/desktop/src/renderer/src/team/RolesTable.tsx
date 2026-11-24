import { Check, Minus } from "lucide-react";
import Card from "../ui/Card";

// Mêmes droits que ceux prévus dans la base (RLS, phase 2) : l'écran ne fait que les expliquer.
const rows: [string, boolean, boolean][] = [
  ["Mettre en vente, modifier", true, true],
  ["Réserver, marquer vendu", true, true],
  ["Voir le prix d'achat et la marge", true, false],
  ["Supprimer un véhicule", true, false],
  ["Gérer l'équipe", true, false],
];

const Mark = ({ ok }: { ok: boolean }) =>
  ok ? <Check size={16} aria-label="oui" className="mx-auto text-success" /> : <Minus size={16} aria-label="non" className="mx-auto text-silver" />;

export default function RolesTable() {
  return (
    <Card className="grid content-start gap-6 p-7">
      <h2 className="fc-h3">Ce que chaque rôle peut faire</h2>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="fc-label pb-3 text-left">Action</th>
            <th className="fc-label w-20 pb-3">Admin</th>
            <th className="fc-label w-20 pb-3">Vendeur</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, admin, seller]) => (
            <tr key={label} className="border-t border-line">
              <td className="py-3">{label}</td>
              <td className="py-3"><Mark ok={admin} /></td>
              <td className="py-3"><Mark ok={seller} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

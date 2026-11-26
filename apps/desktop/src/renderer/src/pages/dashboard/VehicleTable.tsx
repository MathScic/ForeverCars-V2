import type { Vehicle } from "../../../../shared/model";
import VehicleRow from "./VehicleRow";

const th = "fc-label whitespace-nowrap border-b border-line px-3 pb-3.5 text-left";

interface Props {
  caption: string;
  vehicles: Vehicle[];
  isAdmin: boolean;
  now: number;
  /** Titre de la 3e colonne : durée en stock (parc) ou délai de vente (page Vendus). */
  daysLabel?: string;
}

// Tableau du parc (maquette) : partagé par le parc et la page Vendus.
export default function VehicleTable({ caption, vehicles, isAdmin, now, daysLabel = "En stock" }: Props) {
  return (
    <>
      {/* Fenêtre étroite : le tableau défile dans son cadre au lieu d'élargir la page. */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              <th className={th}>Véhicule</th>
              <th className={`${th} hidden @min-[1000px]:table-cell`}>Dossier</th>
              <th className={th}>{daysLabel}</th>
              <th className={`${th} text-right`}>Prix</th>
              <th className={th}>Statut</th>
              <th className={`${th} sticky right-0 bg-carbon`}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <VehicleRow key={v.id} vehicle={v} isAdmin={isAdmin} now={now} />
            ))}
          </tbody>
        </table>
      </div>
      {vehicles.length === 0 && <p className="py-10 text-center text-sm text-silver">Aucun véhicule ne correspond.</p>}
    </>
  );
}

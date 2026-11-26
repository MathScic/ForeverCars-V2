import { useState } from "react";
import { useStore } from "../data/store";
import DocPanel from "../documents/DocPanel";
import DocVehicleList from "../documents/DocVehicleList";

// Dossiers administratifs (maquette backoffice-docs.html) : un dossier par véhicule hors brouillon,
// le stock d'abord, puis les ventes de la plus récente à la plus ancienne.
const rank = (status: string) => (status === "sold" ? 1 : 0);

export default function Documents() {
  const { state, mode } = useStore();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>();

  const withFile = state.vehicles
    .filter((v) => v.status !== "draft")
    .sort((a, b) => rank(a.status) - rank(b.status) || (b.soldAt ?? b.updatedAt).localeCompare(a.soldAt ?? a.updatedAt));
  const q = query.trim().toLowerCase();
  const listed = withFile.filter((v) => !q || `${v.brand} ${v.model} ${v.fileNumber}`.toLowerCase().includes(q));
  const selected = withFile.find((v) => v.id === selectedId) ?? listed[0];

  return (
    <div className="@container mx-auto grid max-w-[1400px] gap-10">
      <div>
        <span className="fc-eyebrow">Documents</span>
        <h1 className="fc-h2 mt-5">Dossiers administratifs</h1>
        <p className="mt-4 text-silver">
          {mode === "live"
            ? "Les pièces de chaque véhicule au même endroit : carte grise, contrôle technique, non-gage, factures et documents de vente signés."
            : "Les pièces de chaque véhicule au même endroit, et les documents de vente générés en un clic."}
        </p>
      </div>
      <div className="grid items-start gap-6 @min-[900px]:grid-cols-[320px_minmax(0,1fr)]">
        <DocVehicleList vehicles={listed} selectedId={selected?.id} onSelect={setSelectedId} query={query} onQuery={setQuery} />
        {selected ? (
          <DocPanel vehicle={selected} />
        ) : (
          <p className="text-sm text-silver">Aucun dossier pour l&apos;instant : mets un véhicule en ligne pour ouvrir son dossier.</p>
        )}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import type { ActivityEntry, Vehicle } from "../../../shared/model";
import { errorText } from "../data/store";

/** Le parc réel en mémoire : chargé à l'ouverture, relu sur demande, mis à jour fiche par fiche. */
export function useParc(isAdmin: boolean) {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloads, setReloads] = useState(0);

  useEffect(() => {
    let alive = true;
    window.api.vehicles.list().then(
      (list) => {
        if (!alive) return;
        setVehicles(list);
        setLoadError(null);
      },
      (e: unknown) => alive && setLoadError(errorText(e)),
    );
    if (isAdmin) window.api.activity.list().then((log) => alive && setActivity(log), () => undefined);
    return () => {
      alive = false;
    };
  }, [reloads, isAdmin]);

  /** Relit tout depuis la base (après une erreur : on affiche l'état réel). */
  const refresh = useCallback(() => setReloads((n) => n + 1), []);
  const refreshActivity = useCallback(() => {
    if (isAdmin) window.api.activity.list().then(setActivity, () => undefined);
  }, [isAdmin]);
  const put = useCallback((v: Vehicle) => setVehicles((list) => [v, ...(list ?? []).filter((x) => x.id !== v.id)]), []);
  const drop = useCallback((id: string) => setVehicles((list) => (list ?? []).filter((x) => x.id !== id)), []);

  return { vehicles, activity, loadError, refresh, refreshActivity, put, drop };
}

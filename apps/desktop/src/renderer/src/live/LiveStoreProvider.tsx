import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { Photo, Profile } from "../../../shared/model";
import { errorText, StoreContext, type Store } from "../data/store";
import Notice from "../ui/Notice";
import { eachLimit } from "./eachLimit";
import Splash from "./Splash";
import { useParc } from "./useParc";

interface Props {
  profile: Profile;
  onSignOut: () => Promise<void>;
  children: ReactNode;
}

// Le parc réel : chaque action passe par le process main (Supabase), puis la fiche est mise à jour à l'écran.
export default function LiveStoreProvider({ profile, onSignOut, children }: Props) {
  const isAdmin = profile.role === "admin";
  const { vehicles, activity, loadError, refresh, refreshActivity, put, drop } = useParc(isAdmin);
  const [notice, setNotice] = useState<string | null>(null);
  const closeNotice = useCallback(() => setNotice(null), []);

  const store = useMemo<Store>(() => {
    const act: Store["act"] = async (id, type) => {
      const v = await window.api.vehicles.act(id, type);
      if (v) put(v);
      else drop(id);
      refreshActivity();
      return v;
    };
    return {
      mode: "live",
      state: { role: profile.role, vehicles: vehicles ?? [], activity },
      isAdmin,
      userName: profile.name,
      userId: profile.id,
      act,
      dispatch: async (a) => {
        if (a.type === "setRole" || a.type === "setDocument") return; // propres à la démo
        try {
          await act(a.id, a.type);
        } catch (e) {
          setNotice(errorText(e));
          refresh(); // on relit la base pour afficher son état réel
        }
      },
      saveVehicle: async (v) => {
        const saved = await window.api.vehicles.save(v);
        put(saved);
        refreshActivity();
        return saved;
      },
      claimVehicle: async (id) => {
        const v = await window.api.vehicles.claim(id);
        put(v);
        return v;
      },
      addPhotos: async (vehicleId, files, onProgress) => {
        const added: (Photo | undefined)[] = [];
        const failed: string[] = [];
        let done = 0;
        await eachLimit(files, 3, async (file, i) => {
          try {
            added[i] = await window.api.photos.add(vehicleId, file);
          } catch (e) {
            failed.push(errorText(e));
          }
          onProgress(++done);
        });
        if (failed.length) setNotice(failed.join("\n"));
        return added.filter((p): p is Photo => Boolean(p));
      },
      orderPhotos: (vehicleId, ids) => window.api.photos.order(vehicleId, ids),
      addDocument: async (vehicleId, docId, file) => put(await window.api.documents.add(vehicleId, docId, file)),
      removeDocument: async (vehicleId, docId) => put(await window.api.documents.remove(vehicleId, docId)),
      openDocument: (vehicleId, docId) => window.api.documents.open(vehicleId, docId),
      notify: setNotice,
      signOut: onSignOut,
    };
  }, [vehicles, activity, profile, isAdmin, put, drop, refresh, refreshActivity, onSignOut]);

  if (!vehicles) return <Splash message={loadError ?? "Chargement du parc…"} onRetry={loadError ? refresh : undefined} />;
  return (
    <StoreContext.Provider value={store}>
      {children}
      <Notice message={notice} onClose={closeNotice} />
    </StoreContext.Provider>
  );
}

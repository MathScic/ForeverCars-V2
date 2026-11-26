import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { StoreContext, type Store } from "../data/store";
import Notice from "../ui/Notice";
import { demoReducer, type DemoAction } from "./reducer";
import { createSeedState } from "./seed";
import type { DemoState } from "./types";

// Mode démo (tests, présentation) : données fictives conservées sur ce poste, rien n'est envoyé.
// v2 : ajout du numéro de dossier, de la couleur, de la garantie et des exports.
const STORAGE_KEY = "forevercars-demo-v2";

function load(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    const state = JSON.parse(raw) as DemoState;
    // Les photos importées (blob:) ne survivent pas à un redémarrage : on les retire.
    const vehicles = state.vehicles.map((v) => ({
      ...v,
      photos: v.photos.filter((p) => !p.url.startsWith("blob:")),
    }));
    return { ...state, vehicles };
  } catch {
    return createSeedState();
  }
}

export const nowIso = () => new Date().toISOString();

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, load);
  const [notice, setNotice] = useState<string | null>(null);
  const closeNotice = useCallback(() => setNotice(null), []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // stockage indisponible : la démo continue en mémoire
    }
  }, [state]);

  const store = useMemo<Store>(() => {
    const find = (id: string) => state.vehicles.find((v) => v.id === id) ?? null;
    return {
      mode: "demo",
      state,
      isAdmin: state.role === "admin",
      userName: state.role === "admin" ? "Clément" : "Vendeur",
      dispatch: async (a) => dispatch(a.type === "setRole" ? a : ({ ...a, now: nowIso() } as DemoAction)),
      act: async (id, type) => {
        dispatch({ type, id, now: nowIso() });
        return type === "remove" ? null : find(id);
      },
      saveVehicle: async (vehicle) => {
        const now = nowIso();
        const saved = { ...vehicle, updatedAt: now, revision: (vehicle.revision ?? 0) + 1 };
        dispatch({ type: "save", vehicle: saved, now });
        return saved;
      },
      claimVehicle: async (id) => {
        const v = find(id);
        if (!v) throw new Error("Ce véhicule n'existe plus.");
        return v;
      },
      addPhotos: async (_vehicleId, files, onProgress) => {
        onProgress(files.length);
        return files.map((f) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(f), name: f.name }));
      },
      orderPhotos: async () => undefined, // la démo garde l'ordre dans la fiche, enregistrée à chaque étape
      addDocument: async (id, doc) => dispatch({ type: "setDocument", id, doc, done: true, now: nowIso() }),
      removeDocument: async (id, doc) => dispatch({ type: "setDocument", id, doc, done: false, now: nowIso() }),
      openDocument: async () => setNotice("Démo : aucun vrai fichier n'est rangé dans ce dossier."),
      notify: setNotice,
      reset: () => dispatch({ type: "reset", state: createSeedState() }),
    };
  }, [state]);

  return (
    <StoreContext.Provider value={store}>
      {children}
      <Notice message={notice} onClose={closeNotice} />
    </StoreContext.Provider>
  );
}

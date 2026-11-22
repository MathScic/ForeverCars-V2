import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { demoReducer, type DemoAction } from "./reducer";
import { createSeedState } from "./seed";
import type { DemoState } from "./types";

// Les données de démo sont conservées localement entre deux lancements.
const STORAGE_KEY = "forevercars-demo-v1";

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

interface DemoStore {
  state: DemoState;
  dispatch: (action: DemoAction) => void;
  isAdmin: boolean;
}

const DemoStoreContext = createContext<DemoStore | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // stockage indisponible : l'ébauche continue en mémoire
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch, isAdmin: state.role === "admin" }), [state]);
  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore(): DemoStore {
  const store = useContext(DemoStoreContext);
  if (!store) throw new Error("useDemoStore doit être utilisé dans <DemoStoreProvider>");
  return store;
}

export const nowIso = () => new Date().toISOString();

export function resetDemo(dispatch: DemoStore["dispatch"]): void {
  dispatch({ type: "reset", state: createSeedState() });
}

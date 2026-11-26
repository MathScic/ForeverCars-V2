// Ce que les écrans savent des données : la démo (données fictives, tests) ou le parc réel (Supabase, via le main).
// Les deux fournisseurs (demo/store.tsx, live/LiveStoreProvider.tsx) remplissent ce même contrat.
import { createContext, useContext } from "react";
import type { ActivityEntry, Photo, Role, Vehicle, VehicleAct } from "../../../shared/model";

export type StoreAction =
  | { type: VehicleAct; id: string }
  | { type: "setDocument"; id: string; doc: string; done: boolean }
  | { type: "setRole"; role: Role };

export interface Store {
  mode: "demo" | "live";
  state: { role: Role; vehicles: Vehicle[]; activity: ActivityEntry[] };
  isAdmin: boolean;
  /** Personne connectée (démo : rôle simulé). */
  userName: string;
  userId?: string;
  /** Bouton du parc : en cas d'échec, un message s'affiche en bas de l'écran. */
  dispatch(action: StoreAction): Promise<void>;
  /** Action dont l'appelant gère l'échec (ex. publier depuis l'assistant). */
  act(id: string, act: VehicleAct): Promise<Vehicle | null>;
  saveVehicle(vehicle: Vehicle): Promise<Vehicle>;
  /** Véhicule ouvert pour être modifié (le réel en prend la main : Sanity ne l'écrase plus). */
  claimVehicle(id: string): Promise<Vehicle>;
  addPhotos(vehicleId: string, files: File[], onProgress: (done: number) => void): Promise<Photo[]>;
  orderPhotos(vehicleId: string, ids: string[]): Promise<void>;
  /** Pièces du dossier (identifiants de documents/catalog.ts). Démo : seulement cochées. */
  addDocument(vehicleId: string, docId: string, file: File): Promise<void>;
  removeDocument(vehicleId: string, docId: string): Promise<void>;
  openDocument(vehicleId: string, docId: string): Promise<void>;
  notify(message: string): void;
  signOut?(): Promise<void>;
  reset?(): void;
}

export const StoreContext = createContext<Store | null>(null);

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore doit être utilisé sous un fournisseur de données (démo ou réel)");
  return store;
}

/** Message d'une erreur venue du process main, sans le préfixe technique d'Electron. */
export const errorText = (e: unknown) =>
  (e instanceof Error ? e.message : String(e)).replace(/^Error invoking remote method '[^']+': (\w*Error: )?/, "");

// Reducer PUR de l'ébauche (aucun accès réseau). Les vraies règles de publication,
// de rôles et de synchronisation seront écrites en phases 2, 5 et 7.
import type { DemoState, DemoVehicle, Role } from "./types";

export type DemoAction =
  | { type: "setRole"; role: Role }
  | { type: "save"; vehicle: DemoVehicle; now: string }
  | { type: "publish"; id: string; now: string }
  | { type: "markSold"; id: string; now: string }
  | { type: "toggleFeatured"; id: string; now: string }
  | { type: "remove"; id: string; now: string }
  | { type: "reset"; state: DemoState };

const actorOf = (role: Role) => (role === "admin" ? "Clément" : "Vendeur");
const nameOf = (v: DemoVehicle) => `${v.brand} ${v.model}`.trim() || "Véhicule sans nom";

function log(state: DemoState, now: string, label: string): DemoState["activity"] {
  const entry = { id: `${now}-${state.activity.length}`, at: now, actor: actorOf(state.role), label };
  return [entry, ...state.activity].slice(0, 50);
}

function update(state: DemoState, id: string, now: string, patch: Partial<DemoVehicle>) {
  return state.vehicles.map((v) => (v.id === id ? { ...v, ...patch, updatedAt: now } : v));
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "setRole":
      return { ...state, role: action.role };
    case "reset":
      return action.state;
    case "save": {
      const v = { ...action.vehicle, updatedAt: action.now };
      const exists = state.vehicles.some((x) => x.id === v.id);
      const vehicles = exists
        ? state.vehicles.map((x) => (x.id === v.id ? v : x))
        : [v, ...state.vehicles];
      const label = exists ? `Modifié : ${nameOf(v)}` : `Brouillon créé : ${nameOf(v)}`;
      return { ...state, vehicles, activity: log(state, action.now, label) };
    }
    case "publish":
    case "markSold":
    case "toggleFeatured":
    case "remove":
      return applyVehicleAction(state, action);
  }
}

function applyVehicleAction(
  state: DemoState,
  action: Extract<DemoAction, { id: string }>,
): DemoState {
  const target = state.vehicles.find((v) => v.id === action.id);
  if (!target) return state;
  const { now } = action;
  switch (action.type) {
    case "publish":
      return { ...state, vehicles: update(state, target.id, now, { status: "online" }), activity: log(state, now, `Mis en ligne : ${nameOf(target)}`) };
    case "markSold":
      return { ...state, vehicles: update(state, target.id, now, { status: "sold", soldAt: now, isFeatured: false }), activity: log(state, now, `Vendu : ${nameOf(target)}`) };
    case "toggleFeatured": {
      const label = target.isFeatured ? "Retiré des coups de cœur" : "Coup de cœur";
      return { ...state, vehicles: update(state, target.id, now, { isFeatured: !target.isFeatured }), activity: log(state, now, `${label} : ${nameOf(target)}`) };
    }
    case "remove":
      return { ...state, vehicles: state.vehicles.filter((v) => v.id !== target.id), activity: log(state, now, `Supprimé : ${nameOf(target)}`) };
  }
}

// Reducer PUR de l'ébauche (aucun accès réseau). Les vraies règles de publication,
// de rôles et de synchronisation seront écrites en phases 2, 5 et 7.
import { docName } from "../documents/catalog";
import type { DemoState, DemoVehicle, Role } from "./types";

export type DemoAction =
  | { type: "setRole"; role: Role }
  | { type: "save"; vehicle: DemoVehicle; now: string }
  | { type: "publish"; id: string; now: string }
  | { type: "markSold"; id: string; now: string }
  | { type: "toggleReserved"; id: string; now: string }
  | { type: "setDocument"; id: string; doc: string; done: boolean; now: string }
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
    case "toggleReserved":
    case "toggleFeatured":
    case "remove":
      return applyVehicleAction(state, action);
    case "setDocument": {
      const target = state.vehicles.find((v) => v.id === action.id);
      if (!target) return state;
      const documents = { ...target.documents, [action.doc]: action.done };
      const vehicles = update(state, target.id, action.now, { documents });
      const activity = action.done ? log(state, action.now, `Dossier ${nameOf(target)} : ${docName(action.doc)}`) : state.activity;
      return { ...state, vehicles, activity };
    }
  }
}

function applyVehicleAction(
  state: DemoState,
  action: Extract<DemoAction, { type: "publish" | "markSold" | "toggleReserved" | "toggleFeatured" | "remove" }>,
): DemoState {
  const target = state.vehicles.find((v) => v.id === action.id);
  if (!target) return state;
  const { now } = action;
  switch (action.type) {
    case "publish":
      return { ...state, vehicles: update(state, target.id, now, { status: "online" }), activity: log(state, now, `Mis en ligne : ${nameOf(target)}`) };
    case "markSold":
      return { ...state, vehicles: update(state, target.id, now, { status: "sold", soldAt: now, isFeatured: false }), activity: log(state, now, `Vendu : ${nameOf(target)}`) };
    case "toggleReserved": {
      // Seul un véhicule visible sur le site (en ligne ou réservé) peut changer d'état ici.
      if (target.status !== "online" && target.status !== "reserved") return state;
      const reserve = target.status === "online";
      const label = reserve ? "Réservé" : "Remis en ligne";
      return { ...state, vehicles: update(state, target.id, now, { status: reserve ? "reserved" : "online" }), activity: log(state, now, `${label} : ${nameOf(target)}`) };
    }
    case "toggleFeatured": {
      const label = target.isFeatured ? "Retiré des coups de cœur" : "Coup de cœur";
      return { ...state, vehicles: update(state, target.id, now, { isFeatured: !target.isFeatured }), activity: log(state, now, `${label} : ${nameOf(target)}`) };
    }
    case "remove":
      return { ...state, vehicles: state.vehicles.filter((v) => v.id !== target.id), activity: log(state, now, `Supprimé : ${nameOf(target)}`) };
  }
}

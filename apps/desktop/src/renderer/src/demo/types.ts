// Types de l'app (partagés avec le process main) + état propre à la démo.
import type { ActivityEntry, Role, Vehicle } from "../../../shared/model";

export type { ActivityEntry, Body, Fuel, Gearbox, Photo, Role, VehicleStatus } from "../../../shared/model";
/** Nom historique : même forme que le véhicule réel. */
export type DemoVehicle = Vehicle;

export interface DemoState {
  role: Role;
  vehicles: Vehicle[];
  activity: ActivityEntry[];
}

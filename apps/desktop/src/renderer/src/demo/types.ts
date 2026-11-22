// Modèle de l'ébauche, calqué sur le schéma prévu en phase 2 (table vehicles).
export type Role = "admin" | "seller";
export type VehicleStatus = "draft" | "online" | "sold";
export type Fuel = "essence" | "diesel" | "hybride" | "electrique";
export type Gearbox = "manuelle" | "automatique";

export interface Photo {
  id: string;
  url: string;
  name: string;
}

export interface DemoVehicle {
  id: string;
  slug: string;
  plate: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  fuel: Fuel;
  gearbox: Gearbox;
  powerHp: number;
  mileage: number;
  price: number;
  description: string;
  equipment: string[];
  status: VehicleStatus;
  isFeatured: boolean;
  /** Ordre d'affichage ; la première photo est la couverture. */
  photos: Photo[];
  /** Données internes, réservées à l'admin (future table vehicle_costs). */
  purchasePrice?: number;
  repairCost?: number;
  createdAt: string;
  updatedAt: string;
  soldAt?: string;
}

export interface ActivityEntry {
  id: string;
  at: string;
  actor: string;
  label: string;
}

export interface DemoState {
  role: Role;
  vehicles: DemoVehicle[];
  activity: ActivityEntry[];
}

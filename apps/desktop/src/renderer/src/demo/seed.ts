import { slugify } from "@forevercars/shared";
import { demoPhotos as p } from "./photos";
import type { DemoState, DemoVehicle } from "./types";

const day = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

type Defaults = "id" | "fileNumber" | "slug" | "createdAt" | "updatedAt" | "warrantyMonths" | "exportLeboncoin" | "exportLaCentrale" | "descriptionIsAuto";
type Seed = Omit<DemoVehicle, Defaults> & { age: number };

// prettier-ignore -- données de démo, une ligne par véhicule
const seeds: Seed[] = [
  { brand: "Peugeot", model: "2008", version: "1.2 PureTech 130 GT", year: 2021, plate: "", color: "Rouge Elixir", owners: 1, fuel: "essence", gearbox: "automatique", powerHp: 130, mileage: 38500, price: 21490, purchasePrice: 17200, repairCost: 650, status: "online", isFeatured: true, photos: [p.peugeot2008], equipment: ["GPS intégré", "Caméra de recul", "Apple CarPlay / Android Auto", "Toit panoramique"], description: "Première main, entretien complet chez Peugeot. Distribution faite.", age: 3 },
  { brand: "Volkswagen", model: "Golf 8", version: "1.5 eTSI 150 DSG7 Style", year: 2022, plate: "", color: "Blanc Pur", owners: 1, fuel: "hybride", gearbox: "automatique", powerHp: 150, mileage: 27400, price: 26990, purchasePrice: 22500, repairCost: 300, status: "online", isFeatured: false, photos: [p.golf8], equipment: ["Régulateur adaptatif", "Sièges chauffants", "Jantes alliage"], description: "Garantie constructeur jusqu'en 2026. Véhicule non fumeur.", age: 9 },
  { brand: "Toyota", model: "C-HR", version: "1.8 Hybride 122 Dynamic", year: 2020, plate: "", color: "Blanc Lunaire", owners: 2, fuel: "hybride", gearbox: "automatique", powerHp: 122, mileage: 61200, price: 19990, purchasePrice: 16100, repairCost: 900, status: "online", isFeatured: false, photos: [p.toyotaChr], equipment: ["Caméra de recul", "Climatisation automatique"], description: "Idéal ville et périurbain, consommation réduite.", age: 15 },
  { brand: "Renault", model: "Clio 5", version: "TCe 90 Intens", year: 2021, plate: "", color: "Rouge Flamme", owners: 1, fuel: "essence", gearbox: "manuelle", powerHp: 90, mileage: 44800, price: 14490, purchasePrice: 11300, repairCost: 450, status: "draft", isFeatured: false, photos: [p.clio5], equipment: ["GPS intégré", "Climatisation automatique"], description: "", age: 1 },
  { brand: "BMW", model: "X1", version: "sDrive18d 150 M Sport", year: 2019, plate: "", color: "Blanc Alpin", owners: 2, fuel: "diesel", gearbox: "automatique", powerHp: 150, mileage: 89000, price: 23900, purchasePrice: 19800, repairCost: 1200, status: "sold", soldAt: day(4), isFeatured: false, photos: [p.bmwX1], equipment: ["GPS intégré", "Radars avant / arrière"], description: "Vendu.", age: 40 },
  { brand: "Mercedes-Benz", model: "GLA", version: "200 d 8G-DCT Progressive", year: 2020, plate: "", color: "Blanc Polaire", owners: 1, fuel: "diesel", gearbox: "automatique", powerHp: 150, mileage: 72300, price: 27900, purchasePrice: 23600, repairCost: 700, status: "sold", soldAt: day(18), isFeatured: false, photos: [p.mercedesGla], equipment: ["Caméra de recul", "Accès mains libres"], description: "Vendu.", age: 55 },
];

export function createSeedState(): DemoState {
  const year = new Date().getFullYear();
  const vehicles = seeds.map(({ age, ...v }, i): DemoVehicle => ({
    ...v,
    id: `demo-${i + 1}`,
    fileNumber: `FC-${year}-${String(i + 1).padStart(4, "0")}`,
    slug: slugify(v.brand, v.model, v.version, v.year),
    warrantyMonths: 12,
    exportLeboncoin: false,
    exportLaCentrale: false,
    descriptionIsAuto: false,
    createdAt: day(age),
    updatedAt: day(Math.max(0, age - 1)),
  }));
  return {
    role: "admin",
    vehicles,
    activity: [
      { id: "a1", at: day(1), actor: "Clément", label: "Brouillon créé : Renault Clio 5" },
      { id: "a2", at: day(3), actor: "Clément", label: "Mis en ligne : Peugeot 2008" },
      { id: "a3", at: day(4), actor: "Vendeur", label: "Vendu : BMW X1" },
    ],
  };
}

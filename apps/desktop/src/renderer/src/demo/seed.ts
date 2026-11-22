import { slugify } from "@forevercars/shared";
import { demoPhotos as p } from "./photos";
import type { DemoState, DemoVehicle } from "./types";

const day = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

type Seed = Omit<DemoVehicle, "id" | "slug" | "createdAt" | "updatedAt"> & { age: number };

// prettier-ignore -- données de démo, une ligne par véhicule
const seeds: Seed[] = [
  { brand: "Peugeot", model: "2008", version: "1.2 PureTech 130 GT", year: 2021, plate: "FX-482-KM", fuel: "essence", gearbox: "automatique", powerHp: 130, mileage: 38500, price: 21490, purchasePrice: 17200, repairCost: 650, status: "online", isFeatured: true, photos: [p.peugeot2008], equipment: ["GPS", "Caméra de recul", "Apple CarPlay", "Toit panoramique"], description: "Première main, entretien complet chez Peugeot. Distribution faite.", age: 3 },
  { brand: "Volkswagen", model: "Golf 8", version: "1.5 eTSI 150 DSG7 Style", year: 2022, plate: "GB-115-TR", fuel: "hybride", gearbox: "automatique", powerHp: 150, mileage: 27400, price: 26990, purchasePrice: 22500, repairCost: 300, status: "online", isFeatured: false, photos: [p.golf8], equipment: ["Régulateur adaptatif", "Sièges chauffants", "LED Matrix"], description: "Garantie constructeur jusqu'en 2026. Véhicule non fumeur.", age: 9 },
  { brand: "Toyota", model: "C-HR", version: "1.8 Hybride 122 Dynamic", year: 2020, plate: "FN-907-PL", fuel: "hybride", gearbox: "automatique", powerHp: 122, mileage: 61200, price: 19990, purchasePrice: 16100, repairCost: 900, status: "online", isFeatured: false, photos: [p.toyotaChr], equipment: ["Caméra de recul", "Aide au maintien de voie"], description: "Idéal ville et périurbain, consommation réduite.", age: 15 },
  { brand: "Renault", model: "Clio 5", version: "TCe 90 Intens", year: 2021, plate: "FY-233-BD", fuel: "essence", gearbox: "manuelle", powerHp: 90, mileage: 44800, price: 14490, purchasePrice: 11300, repairCost: 450, status: "draft", isFeatured: false, photos: [p.clio5], equipment: ["GPS", "Climatisation auto"], description: "", age: 1 },
  { brand: "BMW", model: "X1", version: "sDrive18d 150 M Sport", year: 2019, plate: "FE-640-AZ", fuel: "diesel", gearbox: "automatique", powerHp: 150, mileage: 89000, price: 23900, purchasePrice: 19800, repairCost: 1200, status: "sold", soldAt: day(4), isFeatured: false, photos: [p.bmwX1], equipment: ["Pack M", "Hayon électrique", "GPS Pro"], description: "Vendu.", age: 40 },
  { brand: "Mercedes-Benz", model: "GLA", version: "200 d 8G-DCT Progressive", year: 2020, plate: "FS-318-QE", fuel: "diesel", gearbox: "automatique", powerHp: 150, mileage: 72300, price: 27900, purchasePrice: 23600, repairCost: 700, status: "sold", soldAt: day(18), isFeatured: false, photos: [p.mercedesGla], equipment: ["MBUX", "Caméra 360°"], description: "Vendu.", age: 55 },
];

export function createSeedState(): DemoState {
  const vehicles = seeds.map(({ age, ...v }, i): DemoVehicle => ({
    ...v,
    id: `demo-${i + 1}`,
    slug: slugify(v.brand, v.model, v.version, v.year),
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

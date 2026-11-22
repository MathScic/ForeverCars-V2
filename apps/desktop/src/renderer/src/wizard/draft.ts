import { slugify } from "@forevercars/shared";
import type { DemoVehicle } from "../demo/types";

export const STEPS = ["Véhicule", "Photos", "Prix & description", "Aperçu"] as const;
export type StepIndex = 0 | 1 | 2 | 3;
export type Errors = Partial<Record<keyof DemoVehicle, string>>;

export function emptyVehicle(id: string, now: string): DemoVehicle {
  return {
    id,
    slug: "",
    plate: "",
    brand: "",
    model: "",
    version: "",
    year: new Date(now).getFullYear(),
    fuel: "essence",
    gearbox: "manuelle",
    powerHp: 0,
    mileage: 0,
    price: 0,
    description: "",
    equipment: [],
    status: "draft",
    isFeatured: false,
    photos: [],
    createdAt: now,
    updatedAt: now,
  };
}

/** « fx 482km » → « FX-482-KM » (format SIV). Laisse la saisie telle quelle si incomplète. */
export function normalizePlate(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const m = /^([A-Z]{2})(\d{3})([A-Z]{2})$/.exec(raw);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : input.toUpperCase();
}

const PLATE = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/;

/** Erreurs bloquantes de l'étape. Objet vide = on peut passer à la suite. */
export function validateStep(step: StepIndex, v: DemoVehicle, now = new Date()): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (v.plate && !PLATE.test(v.plate)) e.plate = "Format attendu : AA-123-AA";
    if (!v.brand.trim()) e.brand = "La marque est obligatoire";
    if (!v.model.trim()) e.model = "Le modèle est obligatoire";
    if (v.year < 1990 || v.year > now.getFullYear() + 1) e.year = "Année invalide";
    if (v.mileage < 0) e.mileage = "Kilométrage invalide";
    if (v.powerHp <= 0) e.powerHp = "Indiquez la puissance";
  }
  if (step === 1 && v.photos.length === 0) e.photos = "Ajoutez au moins une photo";
  if (step === 2) {
    if (v.price <= 0) e.price = "Indiquez un prix de vente";
    if (v.description.trim().length < 20) e.description = "20 caractères minimum";
  }
  return e;
}

/** Prépare le véhicule pour l'enregistrement : slug recalculé à partir de la fiche. */
export function finalize(v: DemoVehicle): DemoVehicle {
  return { ...v, slug: slugify(v.brand, v.model, v.version, v.year) };
}

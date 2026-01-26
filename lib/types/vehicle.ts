export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: "essence" | "diesel" | "hybride" | "electrique";
  transmission: "manuelle" | "automatique";
  type: "berline" | "suv" | "coupe" | "break" | "citadine" | "utilitaire";
  power: number;
  images: string[];
  description: string;
  features: string[];
  isNew: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

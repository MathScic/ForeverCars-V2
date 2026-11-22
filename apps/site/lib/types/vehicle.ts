// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SanityImage = any;

export interface Vehicle {
  _id: string;
  brand: string;
  model: string;
  slug: string;
  year: number;
  price: number;
  mileage: number;
  fuel: "essence" | "diesel" | "hybride" | "electrique";
  transmission: "manuelle" | "automatique";
  type: "berline" | "suv" | "coupe" | "break" | "citadine" | "utilitaire";
  power: number;
  images: SanityImage[];
  description: string;
  features: string[];
  isNew: boolean;
  isFeatured: boolean;
  status: "available" | "reserved" | "sold";
  _createdAt: string;
  soldDate?: string;
}

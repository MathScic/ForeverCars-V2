export type SanityImage = {
  _key?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asset?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hotspot?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  crop?: any;
  dimensions?: {
    width: number;
    height: number;
    aspectRatio: number;
  };
};

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

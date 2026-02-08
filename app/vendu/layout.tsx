import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Véhicules Vendus",
  description:
    "Retrouvez les véhicules vendus par ForeverCars dans le Loiret (45). Chaque client satisfait est notre meilleure publicité.",
  alternates: {
    canonical: "/vendu",
  },
  openGraph: {
    title: "Nos Ventes | ForeverCars",
    description:
      "Les véhicules vendus par ForeverCars. Découvrez nos réalisations.",
  },
};

export default function VenduLayout({ children }: { children: React.ReactNode }) {
  return children;
}

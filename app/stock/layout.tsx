import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre Stock de Véhicules d'Occasion",
  description:
    "Découvrez notre sélection de véhicules d'occasion vérifiés dans le Loiret (45). Berlines, SUV, citadines — tous contrôlés et garantis par ForeverCars.",
  alternates: {
    canonical: "/stock",
  },
  openGraph: {
    title: "Notre Stock | ForeverCars",
    description:
      "Véhicules d'occasion vérifiés dans le Loiret. Trouvez votre prochaine voiture chez ForeverCars.",
  },
};

export default function StockLayout({ children }: { children: React.ReactNode }) {
  return children;
}

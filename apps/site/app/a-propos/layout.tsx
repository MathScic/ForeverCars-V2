import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos",
  description:
    "Découvrez ForeverCars, agence d'achat et revente de véhicules dans le Loiret (45). Notre histoire, nos valeurs, nos services et notre engagement qualité.",
  alternates: {
    canonical: "/a-propos",
  },
  openGraph: {
    title: "À Propos de ForeverCars",
    description:
      "Une passion automobile au service de votre satisfaction. Découvrez qui nous sommes.",
  },
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return children;
}

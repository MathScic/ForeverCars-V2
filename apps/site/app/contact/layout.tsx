import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez ForeverCars pour l'achat ou la vente de votre véhicule dans le Loiret (45). Téléphone, email ou formulaire — nous vous répondons rapidement.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Nous Contacter | ForeverCars",
    description:
      "Besoin d'un véhicule ou envie de vendre le vôtre ? Contactez ForeverCars à Marigny-les-Usages (45).",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

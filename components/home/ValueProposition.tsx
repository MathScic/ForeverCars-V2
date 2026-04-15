"use client";

import { Wrench, ShieldCheck, HandHelping } from "lucide-react";
import FadeIn from "../ui/FadeIn";

const pillars = [
  {
    title: "Expertise",
    description: "Des années d'expérience dans l'automobile pour vous garantir les meilleurs véhicules.",
    icon: Wrench,
  },
  {
    title: "Transparence",
    description: "Historique complet, rapport d'inspection détaillé. Aucune mauvaise surprise.",
    icon: ShieldCheck,
  },
  {
    title: "Accompagnement",
    description: "De la recherche à l'immatriculation, on s'occupe de tout pour vous.",
    icon: HandHelping,
  },
];

export default function ValueProposition() {
  return (
    <section className="py-20 px-4 bg-brand-black">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-brand-white text-center mb-12">
            Pourquoi nous choisir ?
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <FadeIn key={pillar.title} delay={index * 0.15}>
              <div className="bg-brand-gray-dark p-8 rounded-lg border border-brand-gray-medium/20 text-center h-full">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <pillar.icon className="w-8 h-8 text-brand-orange" />
                </div>
                <h3 className="font-orbitron text-xl font-semibold text-brand-orange mb-4">
                  {pillar.title}
                </h3>
                <p className="font-inter text-brand-gray-light">{pillar.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

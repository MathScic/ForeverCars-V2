"use client";

import FadeIn from "../ui/FadeIn";

export default function ValueProposition() {
  const pillars = [
    {
      title: "Expertise",
      description:
        "Des années d'expérience dans l'automobile pour vous garantir les meilleurs véhicules.",
      icon: "🔧",
    },
    {
      title: "Transparence",
      description: "Historique complet, rapport d'inspection détaillé. Aucune mauvaise surprise.",
      icon: "📋",
    },
    {
      title: "Accompagnement",
      description: "De la recherche à l'immatriculation, on s'occupe de tout pour vous.",
      icon: "🤝",
    },
  ];
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
                <span className="text-4xl mb-4 block">{pillar.icon}</span>
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

"use client";

import FadeIn from "../ui/FadeIn";

export default function HowItWork() {
  const steps = [
    {
      number: "01",
      title: "Contactez-nous",
      description: "Décrivez-nous le véhicule de vos rêves ou celui que vous souhaitez vendre.",
    },
    {
      number: "02",
      title: "Recherche & Expertise",
      description: "On trouve le véhicule idéal ou on évalue le vôtre avec précision.",
    },
    {
      number: "03",
      title: "Vérification complète",
      description: "Contrôle technique, historique, essai routier. Rien n'est laissé au hasard.",
    },
    {
      number: "04",
      title: "Livraison",
      description: "On s'occupe de toutes les démarches. Vous recevez votre véhicule clé en main.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-brand-black">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-brand-white text-center mb-4">
            Comment ça marche ?
          </h2>
          <p className="font-inter text-brand-gray-light text-center mb-16">
            Un processus simple et transparent.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <FadeIn key={step.number} delay={index * 0.15}>
              <div className="text-center">
                <span className="font-orbitron text-5xl font-bold text-brand-orange">
                  {step.number}
                </span>
                <h3 className="font-orbitron text-xl font-semibold text-brand-white mt-4 mb-2">
                  {step.title}
                </h3>
                <p className="font-inter text-brand-gray-light">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

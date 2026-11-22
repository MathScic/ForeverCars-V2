"use client";

import { Car, ClipboardCheck, Handshake, Sparkles } from "lucide-react";
import FadeIn from "../ui/FadeIn";

export default function HowItWork() {
  const steps = [
    {
      icon: Car,
      title: "Vous vendez ?",
      description: "On s'occupe du reste, et vous avez l'esprit libéré.",
    },
    {
      icon: ClipboardCheck,
      title: "Expertise",
      description: "Contrôle technique, historique, essai routier. Rien n'est laissé au hasard.",
    },
    {
      icon: Handshake,
      title: "Accompagnement",
      description: "Plus de soucis de vérification des paiements, Forever gère pour vous la transaction.",
    },
    {
      icon: Sparkles,
      title: "Livraison",
      description: "Vous recevez votre véhicule clé en main, lustré et nettoyé.",
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
            <FadeIn key={step.title} delay={index * 0.15}>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-brand-orange" />
                </div>
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

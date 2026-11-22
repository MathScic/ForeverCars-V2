"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone } from "lucide-react";
import FadeIn from "../ui/FadeIn";

const actions = [
  { icon: Phone, label: "06 67 53 74 00", href: "tel:+33667537400" },
  { icon: Mail, label: "Écrire un message", href: "/contact" },
  { icon: ArrowRight, label: "Voir le stock", href: "/stock", iconAfter: true },
];

// Ressort volontairement un peu rebondi pour l'effet "élastique" de la surbrillance
const highlightSpring = { type: "spring", stiffness: 380, damping: 22, mass: 0.9 } as const;

export default function CTASection() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 px-4 bg-brand-gray-dark">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="max-w-3xl mx-auto text-center">
          <p className="font-inter text-xs uppercase tracking-[0.3em] text-brand-orange mb-6">
            Prêt à trouver votre prochain véhicule ?
          </p>

          <blockquote className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold text-brand-white leading-tight">
            Tu t&apos;occupes de rien,
            <br />
            <span className="text-brand-orange">je m&apos;occupe de tout.</span>
          </blockquote>

          <div className="w-16 h-px bg-brand-orange my-8 mx-auto" />

          <div className="space-y-4 font-inter text-brand-gray-light/80 max-w-xl mx-auto">
            <p>
              Chez ForeverCars, vous n&apos;avez pas affaire à un call center. C&apos;est moi qui
              décroche, moi qui inspecte chaque voiture et moi qui vous remets les clés.
            </p>
            <p>
              Vous cherchez un modèle précis ou vous voulez vendre le vôtre sans y passer vos
              week-ends ? Appelez-moi, on en parle.
            </p>
          </div>

          <p className="font-inter text-sm text-brand-gray-light/60 mt-6">
            — Clément, fondateur de ForeverCars
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="flex justify-center">
          <ul
            className="mt-10 w-fit flex flex-col sm:flex-row gap-1 p-1.5 rounded-3xl sm:rounded-full border border-brand-white/10 bg-brand-black/50"
            onMouseLeave={() => setActive(0)}
          >
            {actions.map((action, index) => {
              const isActive = active === index;
              const className =
                "group relative flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-orbitron text-xs sm:text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60";
              const handlers = {
                onMouseEnter: () => setActive(index),
                onFocus: () => setActive(index),
              };
              const icon = (
                <action.icon
                  className={`relative w-4 h-4 transition-all duration-300 ${
                    isActive ? "text-brand-black" : "text-brand-orange"
                  } ${action.iconAfter && isActive ? "translate-x-1" : ""}`}
                />
              );
              const content = (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="cta-highlight"
                      transition={highlightSpring}
                      className="absolute inset-0 rounded-full bg-brand-orange shadow-[0_8px_24px_-8px_rgba(255,140,66,0.7)]"
                    />
                  )}
                  {!action.iconAfter && icon}
                  <span
                    className={`relative whitespace-nowrap transition-colors duration-300 ${
                      isActive ? "text-brand-black" : "text-brand-white"
                    }`}
                  >
                    {action.label}
                  </span>
                  {action.iconAfter && icon}
                </>
              );

              return (
                <li key={action.label}>
                  {action.href.startsWith("tel:") ? (
                    <a href={action.href} className={className} {...handlers}>
                      {content}
                    </a>
                  ) : (
                    <Link href={action.href} className={className} {...handlers}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}

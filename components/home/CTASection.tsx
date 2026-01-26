"use client";

import Link from "next/link";
import FadeIn from "../ui/FadeIn";

export default function CTASection() {
  return (
    <section className="py-20 px-4 bg-brand-gray-dark">
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-brand-white mb-4">
            Prêt à trouver votre prochain véhicule ?
          </h2>
          <p className="font-inter text-lg text-brand-gray-light mb-8">
            Contactez-nous dès maintenant et laissez-nous nous occuper de tout.
          </p>
        </FadeIn>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="font-orbitron text-sm font-semibold px-8 py-3 bg-brand-orange text-brand-black rounded-full hover:bg-brand-orange/90 transition-all duration-300"
          >
            Nous contacter
          </Link>
          <Link
            href="/stock"
            className="font-orbitron text-sm font-semibold px-8 py-3 border-2 border-brand-orange text-brand-orange rounded-full hover:bg-brand-orange hover:text-brand-black transition-all duration-300"
          >
            Voir le stock
          </Link>
        </div>
      </div>
    </section>
  );
}

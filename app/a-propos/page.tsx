"use client";

import Link from "next/link";
import { Shield, Heart, Award, Users, Car, ClipboardCheck, FileText, Search, Truck } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

const valeurs = [
  {
    icon: Shield,
    title: "Transparence",
    description: "Aucune surprise, chaque véhicule est contrôlé et son historique vérifié.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "L'automobile est notre passion, nous la partageons avec vous.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Nous sélectionnons uniquement des véhicules de qualité.",
  },
  {
    icon: Users,
    title: "Proximité",
    description: "Un accompagnement personnalisé du début à la fin.",
  },
];

const services = [
  {
    icon: Car,
    title: "Gestion de la vente",
    description: "Confiez-nous la vente de votre véhicule. Photos professionnelles, annonces, négociation, nous gérons tout.",
  },
  {
    icon: ClipboardCheck,
    title: "Expertise complète",
    description: "Contrôle technique, historique, essai routier. Chaque véhicule est minutieusement vérifié.",
  },
  {
    icon: FileText,
    title: "Démarches administratives",
    description: "Carte grise, assurance, contrôle technique. On s'occupe de toute la paperasse.",
  },
  {
    icon: Search,
    title: "Recherche sur mesure",
    description: "Vous cherchez un véhicule précis ? On le trouve pour vous aux meilleures conditions.",
  },
];

export default function AProposPage() {
  return (
    <main className="bg-brand-black min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-brand-white text-center mb-6">
              À Propos de <span className="text-brand-orange">ForeverCars</span>
            </h1>
            <p className="font-inter text-lg text-brand-gray-light text-center max-w-3xl mx-auto">
              Une passion automobile au service de votre satisfaction
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Histoire */}
      <section className="py-16 px-4 bg-brand-gray-dark">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div className="relative h-80 rounded-lg overflow-hidden bg-brand-gray-medium">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-orbitron text-brand-gray-light">Photo fondateur</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <div>
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-brand-white mb-4">
                Notre Histoire
              </h2>
              <div className="space-y-4 font-inter text-brand-gray-light">
                <p>
                  ForeverCars est né d&apos;une passion pour l&apos;automobile et d&apos;un constat simple :
                  acheter ou vendre un véhicule peut être une expérience stressante et chronophage.
                </p>
                <p>
                  Fort de plusieurs années d&apos;expérience dans le secteur automobile, j&apos;ai décidé
                  de créer une agence différente, où le client est au centre de toutes les attentions.
                </p>
                <p className="text-brand-orange font-medium">
                  &quot;Acheter ou vendre autrement&quot;
                </p>
                <p>
                  Cette devise résume notre philosophie : vous accompagner de A à Z,
                  pour que votre projet automobile devienne une expérience sereine et agréable.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Nos Services */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-brand-white text-center mb-4">
              Nos Services
            </h2>
            <p className="font-inter text-brand-gray-light text-center mb-12 max-w-2xl mx-auto">
              Un accompagnement complet pour tous vos projets automobiles
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <FadeIn key={service.title} delay={index * 0.1}>
                <div className="bg-brand-gray-dark p-6 rounded-lg border border-brand-gray-medium/20 flex gap-4 h-full">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-lg font-semibold text-brand-white mb-2">
                      {service.title}
                    </h3>
                    <p className="font-inter text-sm text-brand-gray-light">
                      {service.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 px-4 bg-brand-gray-dark">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-brand-white text-center mb-12">
              Nos Valeurs
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valeurs.map((valeur, index) => (
              <FadeIn key={valeur.title} delay={index * 0.1}>
                <div className="bg-brand-black p-6 rounded-lg border border-brand-gray-medium/20 text-center h-full">
                  <div className="w-14 h-14 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <valeur.icon className="w-7 h-7 text-brand-orange" />
                  </div>
                  <h3 className="font-orbitron text-lg font-semibold text-brand-white mb-2">
                    {valeur.title}
                  </h3>
                  <p className="font-inter text-sm text-brand-gray-light">
                    {valeur.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Livraison */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="bg-brand-gray-dark p-8 rounded-lg border border-brand-orange/20 text-center">
              <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-brand-orange" />
              </div>
              <h2 className="font-orbitron text-xl md:text-2xl font-bold text-brand-white mb-4">
                Livraison à domicile
              </h2>
              <p className="font-inter text-brand-gray-light max-w-xl mx-auto">
                Possibilité de livrer votre véhicule directement devant chez vous.
                Nous nous déplaçons dans tout le Loiret et ses alentours.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Engagement Qualité */}
      <section className="py-16 px-4 bg-brand-gray-dark">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-brand-white mb-6">
              Notre Engagement Qualité
            </h2>
            <div className="space-y-4 font-inter text-brand-gray-light">
              <p>
                Chaque véhicule proposé chez ForeverCars passe par un processus rigoureux de sélection
                et de vérification. Nous contrôlons l&apos;historique, l&apos;état mécanique et la conformité
                de chaque automobile.
              </p>
              <p>
                Notre objectif : vous proposer uniquement des véhicules de confiance,
                à des prix justes et transparents.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="bg-brand-black p-4 rounded-lg">
                <p className="font-orbitron text-2xl font-bold text-brand-orange">100%</p>
                <p className="font-inter text-xs text-brand-gray-light mt-1">Véhicules vérifiés</p>
              </div>
              <div className="bg-brand-black p-4 rounded-lg">
                <p className="font-orbitron text-2xl font-bold text-brand-orange">45</p>
                <p className="font-inter text-xs text-brand-gray-light mt-1">Loiret</p>
              </div>
              <div className="bg-brand-black p-4 rounded-lg">
                <p className="font-orbitron text-2xl font-bold text-brand-orange">5★</p>
                <p className="font-inter text-xs text-brand-gray-light mt-1">Satisfaction</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-brand-white mb-4">
              Prêt à nous faire confiance ?
            </h2>
            <p className="font-inter text-brand-gray-light mb-8">
              Contactez-nous pour discuter de votre projet automobile.
            </p>
            <Link
              href="/contact"
              className="inline-block font-orbitron text-sm font-semibold px-8 py-3 bg-brand-orange text-brand-black rounded-full hover:bg-brand-orange/90 transition-all duration-300"
            >
              Nous contacter
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}

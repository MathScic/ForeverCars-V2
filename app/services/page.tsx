import FadeIn from "@/components/ui/FadeIn";
import { Search, FileCheck, Car, ClipboardCheck } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Search,
    title: "Recherche sur mesure",
    description:
      "Vous nous décrivez le véhicule de vos rêves, on le trouve pour vous. Marque, modèle, budget, options : on s'occupe de tout.",
  },
  {
    icon: FileCheck,
    title: "Expertise complète",
    description:
      "Chaque véhicule est minutieusement inspecté : historique, contrôle technique, essai routier. Aucune mauvaise surprise.",
  },
  {
    icon: Car,
    title: "Vente de votre véhicule",
    description:
      "Vous souhaitez vendre ? On estime votre véhicule au juste prix et on s'occupe de trouver l'acheteur.",
  },
  {
    icon: ClipboardCheck,
    title: "Démarches administratives",
    description:
      "Carte grise, assurance, contrôle technique : on gère toute la paperasse pour vous. Vous recevez votre véhicule clé en main.",
  },
];

export default function ServicesPage() {
  return (
    <section className="py-12 px-4 bg-brand-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-brand-white mb-4">
              Nos Services
            </h1>
            <p className="font-inter text-brand-gray-light max-w-2xl mx-auto">
              ForeverCars vous accompagne dans toutes les étapes de votre projet automobile. De la
              recherche à la livraison, on s&apos;occupe de tout.
            </p>
          </div>
        </FadeIn>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <FadeIn key={service.title} delay={index * 0.1}>
              <div className="bg-brand-gray-dark p-8 rounded-lg border border-brand-gray-medium/20 h-full">
                <service.icon className="w-12 h-12 text-brand-orange mb-4" />
                <h3 className="font-orbitron text-xl font-semibold text-brand-white mb-3">
                  {service.title}
                </h3>
                <p className="font-inter text-brand-gray-light leading-relaxed">
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Zone d'intervention */}
        <FadeIn delay={0.4}>
          <div className="bg-brand-gray-dark p-8 rounded-lg border border-brand-gray-medium/20 text-center">
            <h2 className="font-orbitron text-2xl font-bold text-brand-white mb-4">
              Zone d&apos;intervention
            </h2>
            <p className="font-inter text-brand-gray-light mb-6">
              Basés dans le <span className="text-brand-orange font-semibold">Loiret (45)</span>,
              nous intervenons dans tout le département et ses alentours. Déplacement possible sur
              demande.
            </p>
            <Link
              href="/contact"
              className="inline-block font-orbitron text-sm font-semibold px-8 py-3 bg-brand-orange text-brand-black rounded-full hover:bg-brand-orange/90 transition-all duration-300"
            >
              Nous contacter
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

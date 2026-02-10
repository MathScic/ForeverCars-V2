import Image from "next/image";
import { CheckCircle } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { client } from "@/sanity/client";
import { soldVehiclesQuery } from "@/sanity/lib/queries";
import { Vehicle } from "@/lib/types/vehicle";
import { urlForImage } from "@/sanity/lib/image";

export default async function VenduPage() {
  const vehiculesVendus: Vehicle[] = await client.fetch(soldVehiclesQuery, {}, { next: { revalidate: 3600 } });

  return (
    <main className="bg-brand-black min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-brand-white text-center mb-6">
              Nos <span className="text-brand-orange">Ventes</span>
            </h1>
            <p className="font-inter text-lg text-brand-gray-light text-center max-w-3xl mx-auto">
              Découvrez les véhicules que nous avons vendus. Chaque client satisfait est notre meilleure publicité.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Grille des véhicules vendus */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {vehiculesVendus.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehiculesVendus.map((vehicle, index) => (
                <FadeIn key={vehicle._id} delay={index * 0.1}>
                  <div className="bg-brand-gray-dark rounded-lg overflow-hidden border border-brand-gray-medium/20">
                    {/* Image */}
                    <div className="relative h-48 bg-brand-gray-medium">
                      {vehicle.images?.[0] ? (
                        <Image
                          src={urlForImage(vehicle.images[0]).width(400).height(300).url()}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-brand-gray-light font-inter text-sm">Photo à venir</span>
                        </div>
                      )}

                      {/* Badge Vendu */}
                      <div className="absolute top-3 right-3 bg-brand-orange text-brand-black px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={14} />
                        <span className="font-orbitron text-xs font-semibold">Vendu</span>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="p-4">
                      <h3 className="font-orbitron text-lg font-semibold text-brand-white">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="font-inter text-sm text-brand-gray-light mt-1">
                        {vehicle.year} • Vendu en{" "}
                        {vehicle.soldDate
                          ? new Date(vehicle.soldDate).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
                          : "récemment"}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn>
              <div className="text-center py-16">
                <p className="font-inter text-brand-gray-light">
                  Les véhicules vendus apparaîtront ici prochainement.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-brand-gray-dark">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="font-orbitron text-3xl md:text-4xl font-bold text-brand-orange">
                  {vehiculesVendus.length}+
                </p>
                <p className="font-inter text-sm text-brand-gray-light mt-2">Véhicules vendus</p>
              </div>
              <div>
                <p className="font-orbitron text-3xl md:text-4xl font-bold text-brand-orange">100%</p>
                <p className="font-inter text-sm text-brand-gray-light mt-2">Clients satisfaits</p>
              </div>
              <div>
                <p className="font-orbitron text-3xl md:text-4xl font-bold text-brand-orange">45</p>
                <p className="font-inter text-sm text-brand-gray-light mt-2">Loiret &amp; environs</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Message */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-brand-white mb-4">
              Votre véhicule pourrait être le prochain
            </h2>
            <p className="font-inter text-brand-gray-light mb-8">
              Vous souhaitez vendre votre véhicule rapidement et au meilleur prix ?
              Confiez-nous votre vente, on s&apos;occupe de tout.
            </p>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}

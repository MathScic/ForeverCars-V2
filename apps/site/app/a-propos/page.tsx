import type { CSSProperties } from "react";
import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import Button, { Arrow } from "@/components/ui/Button";

const wrap = "mx-auto w-[min(100%-32px,1320px)] md:w-[min(100%-48px,1320px)]";
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

const services = [
  { title: "Gestion de la vente", description: "Confiez-nous la vente de votre véhicule. Photos professionnelles, annonces, négociation, nous gérons tout." },
  { title: "Expertise complète", description: "Contrôle technique, historique, essai routier. Chaque véhicule est minutieusement vérifié." },
  { title: "Démarches administratives", description: "Carte grise, assurance, contrôle technique. On s'occupe de toute la paperasse." },
  { title: "Recherche sur mesure", description: "Vous cherchez un véhicule précis ? On le trouve pour vous aux meilleures conditions." },
];

const valeurs = [
  { title: "Transparence", description: "Aucune surprise, chaque véhicule est contrôlé et son historique vérifié." },
  { title: "Passion", description: "L'automobile est notre passion, nous la partageons avec vous." },
  { title: "Excellence", description: "Nous sélectionnons uniquement des véhicules de qualité." },
  { title: "Proximité", description: "Un accompagnement personnalisé du début à la fin." },
];

/** Liste sans cadres (choix validé) : numéros néon, beaucoup d'air. */
function Tiles({ items, cols }: { items: { title: string; description: string }[]; cols: string }) {
  return (
    <div className={`grid gap-x-16 gap-y-12 ${cols}`}>
      {items.map((item, i) => (
        <FadeIn key={item.title} delay={(i % 4) * 0.08}>
          <span className="fc-neon block font-display text-[40px] font-medium leading-none [font-stretch:125%]">0{i + 1}</span>
          <h3 className="fc-h3 mb-2.5 mt-5">{item.title}</h3>
          <p className="text-silver">{item.description}</p>
        </FadeIn>
      ))}
    </div>
  );
}

export default function AProposPage() {
  return (
    <>
      <section className={`${wrap} border-b border-line pb-12 pt-12 md:pb-16 md:pt-24`}>
        <span className="fc-eyebrow rise-in">Notre maison</span>
        <h1 className="fc-display focus-in mt-6" style={delay(100)}>
          À Propos de <span className="text-orange">ForeverCars</span>
        </h1>
        <p className="rise-in mt-6 text-base text-silver md:text-lg" style={delay(200)}>Une passion automobile au service de votre satisfaction</p>
      </section>

      <section className={`${wrap} grid items-center gap-12 pt-20 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:pt-36`}>
        <FadeIn>
          <figure className="relative aspect-[4/5] overflow-hidden">
            <Image src="/images/Fondateur.webp" alt="Clément Scicluna - Fondateur ForeverCars" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-[center_15%] [filter:grayscale(0.4)_brightness(0.82)_contrast(1.08)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_10_11/0.85),transparent_45%)]" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 text-[13px] text-silver">Clément Scicluna — Fondateur de ForeverCars</figcaption>
          </figure>
        </FadeIn>
        <FadeIn delay={0.15}>
          <span className="fc-eyebrow">01 — Histoire</span>
          <h2 className="fc-h2 mt-5">Notre Histoire</h2>
          <div className="mt-6 grid gap-4 text-silver">
            <p>ForeverCars est né d&apos;une passion pour l&apos;automobile et d&apos;un constat simple : acheter ou vendre un véhicule peut être une expérience stressante et chronophage.</p>
            <p>Fort de plusieurs années d&apos;expérience dans le secteur automobile, j&apos;ai décidé de créer une agence différente, où le client est au centre de toutes les attentions.</p>
          </div>
          <p className="my-8 border-l border-orange pl-6 font-display text-[22px] font-semibold leading-tight text-ivory [font-stretch:125%] md:text-[26px]">&quot;Acheter ou vendre autrement&quot;</p>
          <p className="text-silver">Cette devise résume notre philosophie : vous accompagner de A à Z, pour que votre projet automobile devienne une expérience sereine et agréable.</p>
        </FadeIn>
      </section>

      <section className={`${wrap} pt-24 lg:pt-36`}>
        <FadeIn className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><span className="fc-eyebrow">02 — Services</span><h2 className="fc-h2 mt-5">Nos Services</h2></div>
          <p className="max-w-[46ch] text-silver md:text-lg">Un accompagnement complet pour tous vos projets automobiles</p>
        </FadeIn>
        <Tiles items={services} cols="md:grid-cols-2" />
      </section>

      <section className={`${wrap} pt-24 lg:pt-36`}>
        <FadeIn className="mb-12"><span className="fc-eyebrow">03 — Valeurs</span><h2 className="fc-h2 mt-5">Nos Valeurs</h2></FadeIn>
        <Tiles items={valeurs} cols="sm:grid-cols-2 lg:grid-cols-4" />
      </section>

      <section className={`${wrap} grid gap-16 pt-24 lg:grid-cols-2 lg:gap-20 lg:pt-36`}>
        <FadeIn>
          <span className="fc-eyebrow">Livraison</span>
          <h2 className="fc-h2 mt-5 text-[34px]">Livraison à domicile</h2>
          <p className="mt-5 text-silver">Possibilité de livrer votre véhicule directement devant chez vous. Nous nous déplaçons dans tout le Loiret et ses alentours.</p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <span className="fc-eyebrow">Qualité</span>
          <h2 className="fc-h2 mt-5 text-[34px]">Notre Engagement Qualité</h2>
          <p className="mt-5 text-silver">Chaque véhicule proposé chez ForeverCars passe par un processus rigoureux de sélection et de vérification. Nous contrôlons l&apos;historique, l&apos;état mécanique et la conformité de chaque automobile.</p>
          <p className="mt-4 text-silver">Notre objectif : vous proposer uniquement des véhicules de confiance, à des prix justes et transparents.</p>
          <dl className="mt-8 grid grid-cols-3 gap-6">
            {[["100%", "Véhicules vérifiés"], ["45", "Loiret"], ["5★", "Satisfaction"]].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-3xl font-semibold text-orange [font-stretch:125%] [text-shadow:0_0_18px_rgb(255_140_66/0.45)]">{value}</dd>
                <dd className="mt-2 text-xs text-silver" aria-hidden>{label}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </section>

      <FadeIn className={`${wrap} py-24 text-center lg:pt-36`}>
        <h2 className="fc-h2">Prêt à nous faire confiance ?</h2>
        <p className="mb-9 mt-5 text-silver md:text-lg">Contactez-nous pour discuter de votre projet automobile.</p>
        <Button href="/contact" className="justify-between">Nous contacter <Arrow /></Button>
      </FadeIn>
    </>
  );
}

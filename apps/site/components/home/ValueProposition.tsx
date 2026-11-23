import FadeIn from "../ui/FadeIn";

const pillars = [
  { title: "Expertise", description: "Des années d'expérience dans l'automobile pour vous garantir les meilleurs véhicules." },
  { title: "Transparence", description: "Historique complet, rapport d'inspection détaillé. Aucune mauvaise surprise." },
  { title: "Accompagnement", description: "De la recherche à l'immatriculation, on s'occupe de tout pour vous." },
];

export default function ValueProposition() {
  return (
    <section className="mx-auto w-[min(100%-32px,1320px)] pt-24 md:w-[min(100%-48px,1320px)] lg:pt-36" aria-labelledby="pourquoi">
      <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <FadeIn className="lg:sticky lg:top-36 lg:self-start">
          <span className="fc-eyebrow">ForeverCars</span>
          <h2 id="pourquoi" className="fc-h2 mt-5">
            Pourquoi nous choisir ?
          </h2>
        </FadeIn>
        <div className="border-t border-line">
          {pillars.map((pillar, i) => (
            <FadeIn key={pillar.title} delay={i * 0.12}>
              <div className="grid grid-cols-[44px_1fr] gap-4 border-b border-line py-7 md:grid-cols-[72px_1fr] md:gap-6 md:py-9">
                <span className="fc-neon pt-1.5 font-display text-[13px] font-medium tracking-[0.1em] [font-stretch:125%]">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="fc-h3">{pillar.title}</h3>
                  <p className="mt-2.5 text-silver">{pillar.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

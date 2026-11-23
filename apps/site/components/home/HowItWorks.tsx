import type { CSSProperties } from "react";
import FadeIn from "../ui/FadeIn";
import InView from "../ui/InView";

const steps = [
  { title: "Vous vendez ?", description: "On s'occupe du reste, et vous avez l'esprit libéré." },
  { title: "Expertise", description: "Contrôle technique, historique, essai routier. Rien n'est laissé au hasard." },
  { title: "Accompagnement", description: "Plus de soucis de vérification des paiements, Forever gère pour vous la transaction." },
  { title: "Livraison", description: "Vous recevez votre véhicule clé en main, lustré et nettoyé." },
];

// Les 4 étapes : un filet orange se dessine, puis les numéros néon s'allument l'un après l'autre
// (.steps-line / .step-num dans globals.css).
export default function HowItWorks() {
  return (
    <section className="mx-auto w-[min(100%-32px,1320px)] pt-24 md:w-[min(100%-48px,1320px)] lg:pt-36" aria-labelledby="comment">
      <FadeIn>
        <span className="fc-eyebrow">Un processus simple et transparent.</span>
        <h2 id="comment" className="fc-h2 mt-5">
          Comment ça marche ?
        </h2>
      </FadeIn>

      <InView className="relative mt-14 border-t border-line lg:mt-16" margin="-10% 0px">
        <div aria-hidden className="steps-line absolute -top-px left-0 h-px w-full bg-orange shadow-[0_0_14px_var(--color-orange)]" />
        <ol className="grid gap-y-2 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="pt-8 md:pr-8 lg:pt-10">
              <span
                aria-hidden
                className="step-num fc-neon block font-display text-[56px] font-medium leading-none [font-stretch:125%] lg:text-[64px]"
                style={{ "--i": i } as CSSProperties}
              >
                0{i + 1}
              </span>
              <h3 className="fc-h3 mb-2.5 mt-5">{step.title}</h3>
              <p className="text-silver">{step.description}</p>
            </li>
          ))}
        </ol>
      </InView>
    </section>
  );
}

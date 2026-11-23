import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import FadeIn from "../ui/FadeIn";

// Bloc du fondateur, sans contour (choix validé) : photo à gauche, citation et actions à droite.
export default function CTASection() {
  return (
    <section className="mx-auto mt-24 w-[min(100%-32px,1320px)] md:w-[min(100%-48px,1320px)] lg:mt-40" aria-labelledby="pret">
      <FadeIn className="grid overflow-hidden lg:grid-cols-[5fr_7fr]">
        <div className="relative min-h-[380px] lg:min-h-[640px]">
          <Image
            src="/images/Fondateur.webp"
            alt="Clément, fondateur de ForeverCars"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-[center_15%] [filter:grayscale(0.4)_brightness(0.8)_contrast(1.08)]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-carbon),transparent_55%)] lg:bg-[linear-gradient(to_right,transparent_55%,var(--color-carbon))]" />
        </div>
        <div className="grid content-center gap-6 py-8 lg:px-16 lg:py-[72px]">
          <span id="pret" className="fc-eyebrow">Prêt à trouver votre prochain véhicule ?</span>
          <blockquote className="font-display text-[clamp(30px,3.4vw,52px)] font-semibold leading-[1.04] tracking-[-0.02em] [font-stretch:125%]">
            Tu t&apos;occupes de rien,
            <br />
            <span className="text-orange">je m&apos;occupe de tout.</span>
          </blockquote>
          <p className="max-w-[52ch] text-silver">
            Chez ForeverCars, vous n&apos;avez pas affaire à un call center. C&apos;est moi qui décroche, moi qui inspecte chaque voiture et moi qui vous remets les clés.
          </p>
          <p className="max-w-[52ch] text-silver">
            Vous cherchez un modèle précis ou vous voulez vendre le vôtre sans y passer vos week-ends ? Appelez-moi, on en parle.
          </p>
          <p className="text-sm">— Clément, fondateur de ForeverCars</p>
          <div className="flex flex-col gap-1 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
            <Button href="tel:+33667537400" className="justify-center">06 67 53 74 00</Button>
            <Link href="/contact" className="fc-link-arrow">Écrire un message <span aria-hidden>→</span></Link>
            <Link href="/stock" className="fc-link-arrow">Voir le stock <span aria-hidden>→</span></Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

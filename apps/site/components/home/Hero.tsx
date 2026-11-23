import type { CSSProperties } from "react";
import Button, { Arrow } from "@/components/ui/Button";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

// Hero plein écran : vidéo du garage (1,2 Mo + image d'attente), texte posé en bas à gauche.
export default function Hero() {
  return (
    <section className="relative -mt-[68px] h-svh min-h-[600px] overflow-hidden lg:-mt-[84px] lg:min-h-[680px]" aria-label="Présentation">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/hero-poster.webp"
        aria-hidden
        className="hero-media absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      {/* Dégradés : la vidéo respire en haut, le texte reste lisible en bas à gauche */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-carbon)_2%,rgb(10_10_11/0.55)_38%,rgb(10_10_11/0.15)_70%,rgb(10_10_11/0.45))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(10_10_11/0.7),transparent_60%)]" />

      <div className="absolute inset-x-0 bottom-0 z-10 pb-16 lg:pb-24">
        <div className="relative mx-auto w-[min(100%-32px,1320px)] md:w-[min(100%-48px,1320px)]">
          <span className="fc-eyebrow rise-in">Marigny-les-Usages · Loiret</span>
          <h1 className="fc-display focus-in mb-5 mt-6 max-w-[12ch]" style={delay(120)}>
            Votre prochain véhicule vous attend.
          </h1>
          <p className="rise-in max-w-[46ch] text-base text-silver md:text-lg" style={delay(240)}>
            Acheter ou vendre autrement
          </p>
          <div className="rise-in mt-9" style={delay(360)}>
            <Button href="/stock" className="w-full justify-between sm:w-auto">
              Voir notre stock <Arrow />
            </Button>
          </div>
          <div aria-hidden className="rise-in absolute bottom-0 right-0 hidden lg:block" style={delay(700)}>
            <div className="scroll-cue relative h-16 w-px overflow-hidden bg-line-strong" />
          </div>
        </div>
      </div>
    </section>
  );
}

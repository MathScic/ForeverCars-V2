"use client";

import type { RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { HOME_LINK, NAV_LINKS, isActive } from "./nav";

const slide = "duration-[450ms] ease-[var(--ease-spring)]";
// Visible tout de suite à l'ouverture (sinon le bouton Fermer ne peut pas recevoir le focus),
// masqué seulement à la fin du glissement à la fermeture.
const shown = (open: boolean, on: string, off: string) => (open ? `visible ${on}` : `invisible ${off}`);

interface Props {
  open: boolean;
  onClose: () => void;
  closeRef: RefObject<HTMLButtonElement | null>;
}

// Panneau noir opaque de 280 px qui glisse depuis la droite (même système que le site d'origine).
// Transitions CSS, réversibles à tout moment ; fermé, il reste dans la page mais inerte.
export default function MobileMenu({ open, onClose, closeRef }: Props) {
  const pathname = usePathname();

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-[58] bg-black/60 backdrop-blur-sm duration-300 ${shown(open, "opacity-100 transition-opacity", "opacity-0 transition-[opacity,visibility]")}`}
      />
      <nav
        id="menu-mobile"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[59] flex w-[280px] max-w-[86vw] flex-col border-l border-line-strong bg-carbon shadow-[-30px_0_60px_-20px_rgba(0,0,0,0.9)] ${slide} ${shown(open, "translate-x-0 transition-transform", "translate-x-full transition-[transform,visibility]")}`}
      >
        <div className="flex items-center justify-between border-b border-line py-4 pl-6 pr-3">
          <span className="font-display text-lg font-bold [font-stretch:112%]">Menu</span>
          <button ref={closeRef} onClick={onClose} aria-label="Fermer le menu" className="grid h-11 w-11 place-items-center text-ivory transition-colors hover:text-orange">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col py-4">
          {[HOME_LINK, ...NAV_LINKS].map((link, i) => {
            const active = isActive(pathname, link.href);
            return (
              // Le décalage d'apparition est porté par l'enveloppe, pour ne pas retarder le survol du lien.
              <div key={link.href} style={{ transitionDelay: open ? `${60 + i * 60}ms` : "0ms" }} className={`transition-[opacity,transform] ${slide} ${open ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"}`}>
                <Link prefetch={false}
                  href={link.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`block border-l-2 px-6 py-4 text-base font-medium transition-colors duration-300 ${
                    active ? "border-orange bg-graphite text-ivory" : "border-transparent text-silver hover:border-orange hover:bg-graphite hover:text-ivory"
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            );
          })}
        </div>
        <div className="mt-auto grid gap-4 px-4 pb-8 pt-4">
          <Link prefetch={false}
            href="/contact"
            onClick={onClose}
            className="flex h-12 items-center justify-center rounded-full bg-orange font-display text-xs font-semibold uppercase tracking-[0.2em] text-carbon [font-stretch:112%] active:scale-[0.98]"
          >
            Nous contacter
          </Link>
          <p className="text-center text-xs italic text-silver">&ldquo;Acheter ou vendre autrement&rdquo;</p>
        </div>
      </nav>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";

// Mobile (< 1024 px) : barre en haut + panneau de menu (MobileMenu). Le panneau est HORS de la barre
// translucide : un parent avec backdrop-filter l'enfermerait dans sa hauteur.
export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const close = () => setOpen(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) {
      if (wasOpen.current) menuBtn.current?.focus(); // le focus revient au bouton qui a ouvert
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="lg:hidden fixed inset-x-0 top-0 z-50">
      <div className="flex h-[68px] items-center justify-between border-b border-line bg-carbon/80 px-4 backdrop-blur-xl">
        <Link href="/" onClick={close} aria-label="ForeverCars, accueil">
          <Image src="/images/Forever-CarsLogo.svg" alt="ForeverCars" width={110} height={69} priority className="h-10 w-auto" />
        </Link>
        <button
          ref={menuBtn}
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          aria-controls="menu-mobile"
          className="grid h-12 w-12 place-items-center rounded-full text-ivory transition-colors hover:text-orange"
        >
          <Menu size={26} />
        </button>
      </div>
      <MobileMenu open={open} onClose={close} closeRef={closeBtn} />
    </header>
  );
}

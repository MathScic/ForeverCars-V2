"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, isActive } from "./nav";

// En-tête ordinateur (≥ 1024 px) : transparent sur le hero, verre dépoli dès qu'on défile.
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`hidden lg:block fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-400 ${
        scrolled ? "bg-carbon/75 backdrop-blur-xl backdrop-saturate-150 border-line" : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[84px] w-[min(100%-48px,1320px)] items-center justify-between">
        <Link href="/" aria-label="ForeverCars, accueil" className="rounded-sm">
          <Image src="/images/Forever-CarsLogo.svg" alt="ForeverCars" width={130} height={82} priority className="h-[52px] w-auto" />
        </Link>

        <nav aria-label="Navigation principale" className="flex gap-10">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`group relative py-2.5 font-display text-[11px] font-medium uppercase tracking-[0.24em] [font-stretch:112%] transition-colors duration-300 ${
                  active ? "text-ivory" : "text-silver hover:text-ivory"
                }`}
              >
                {link.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 bottom-0.5 h-px origin-left bg-orange transition-transform duration-500 ease-[var(--ease-spring)] ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="inline-flex h-11 items-center rounded-full bg-orange px-6 font-display text-xs font-semibold uppercase tracking-[0.2em] text-carbon [font-stretch:112%] transition-[background-color,transform] duration-300 hover:bg-[#ffa266] active:scale-[0.98]"
        >
          Nous contacter
        </Link>
      </div>
    </header>
  );
}

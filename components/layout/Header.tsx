"use client";

import Link from "next/link";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/stock", label: "Notre Stock" },
  { href: "/services", label: "Nos Services" },
  { href: "/a-propos", label: "À Propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-brand-black/95 backdrop-blur-sm border-b border-brand-gray-medium/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - À remplacer par <Image /> quand le logo sera prêt */}
          <Link href="/" className="flex items-center">
            {/* TODO: Remplacer par le logo
            <Image src="/images/logo.svg" alt="ForeverCars" width={180} height={40} />
            */}
            <span className="font-orbitron text-2xl font-bold text-brand-white">
              FOREVER<span className="text-brand-orange">CARS</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-inter text-sm font-medium text-brand-gray-light hover:text-brand-white transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="font-orbitron text-sm font-semibold px-6 py-2.5 bg-brand-orange text-brand-black rounded-full hover:bg-brand-orange/90 transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/20"
          >
            Nous Contacter
          </Link>
        </div>
      </div>
    </header>
  );
}

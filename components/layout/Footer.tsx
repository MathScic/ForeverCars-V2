import Link from "next/link";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/stock", label: "Notre Stock" },
  { href: "/services", label: "Nos Services" },
  { href: "/a-propos", label: "À Propos" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-black border-t border-brand-gray-medium/20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Tagline */}
          <div>
            <Link href="/" className="inline-block">
              <span className="font-orbitron text-2xl font-bold text-brand-white">
                FOREVER<span className="text-brand-orange">CARS</span>
              </span>
            </Link>
            <p className="font-inter text-sm text-brand-gray-light mt-4 italic">
              "Tu s'occupe de rien, je s'occupe de tout"
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-orbitron text-sm font-semibold text-brand-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-inter text-sm text-brand-gray-light hover:text-brand-orange transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-orbitron text-sm font-semibold text-brand-white mb-4">Contact</h4>
            <ul className="space-y-2 font-inter text-sm text-brand-gray-light">
              <li>Loiret (45), France</li>
              <li>contact@forevercars.fr</li>
              <li>06 XX XX XX XX</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-brand-gray-medium/20 mt-8 pt-8 text-center">
          <p className="font-inter text-sm text-brand-gray-medium">
            © {new Date().getFullYear()} ForeverCars. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

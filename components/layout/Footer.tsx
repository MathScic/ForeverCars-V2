import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/stock", label: "Notre Stock" },
  { href: "/vendu", label: "Vendu" },
  { href: "/a-propos", label: "À Propos" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-black border-t border-brand-gray-medium/20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Tagline */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/Forever-CarsLogo.svg"
                alt="Forever Cars Logo"
                width={200}
                height={50}
              />
            </Link>
            <p className="font-inter text-sm text-brand-gray-light mt-4 italic">
              "Acheter ou vendre autrement"
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
              <li>Lot N23, 1695 rue de la Grand Cour</li>
              <li>45760 Marigny-Les-Usages</li>
              <li>c.forevercars@gmail.com</li>
              <li>06.67.53.74.00</li>
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

import Image from "next/image";
import Link from "next/link";
import SocialIcon from "@/components/ui/SocialIcon";
import { socialLinks } from "@/lib/social";
import { HOME_LINK, NAV_LINKS } from "./nav";

const heading = "mb-5 font-display text-[11px] font-medium uppercase tracking-[0.24em] text-silver [font-stretch:112%]";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line lg:mt-32">
      <div className="mx-auto w-[min(100%-32px,1320px)] py-14 md:w-[min(100%-48px,1320px)] md:py-[72px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block" aria-label="ForeverCars, accueil">
              <Image src="/images/Forever-CarsLogo.svg" alt="ForeverCars" width={200} height={126} className="h-16 w-auto" />
            </Link>
            <p className="mt-5 text-sm italic text-silver">&ldquo;Acheter ou vendre autrement&rdquo;</p>
          </div>

          <div>
            <h2 className={heading}>Navigation</h2>
            <ul className="grid gap-3 text-sm">
              {[HOME_LINK, ...NAV_LINKS].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors duration-300 hover:text-orange">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={heading}>Contact</h2>
            <address className="not-italic">
              <ul className="grid gap-3 text-sm">
                <li>Lot N23, 1695 rue de la Grand Cour</li>
                <li>45760 Marigny-Les-Usages</li>
                <li><a href="mailto:c.forevercars@gmail.com" className="transition-colors hover:text-orange">c.forevercars@gmail.com</a></li>
                <li><a href="tel:+33667537400" className="transition-colors hover:text-orange">06.67.53.74.00</a></li>
              </ul>
            </address>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-silver transition-colors duration-300 hover:border-orange hover:text-orange"
                >
                  <SocialIcon name={social.name} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 text-xs text-silver md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} ForeverCars. Tous droits réservés.</span>
          <span>Tu t&apos;occupes de rien, je m&apos;occupe de tout.</span>
        </div>
      </div>
    </footer>
  );
}

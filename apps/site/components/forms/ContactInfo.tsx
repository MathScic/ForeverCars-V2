import SocialIcon from "@/components/ui/SocialIcon";
import { socialLinks } from "@/lib/social";

const row = "flex flex-col gap-1 border-b border-line py-4 text-sm sm:flex-row sm:justify-between sm:gap-4";

// Colonne d'informations de la page Contact (mêmes coordonnées et horaires qu'avant).
export default function ContactInfo() {
  return (
    <aside className="grid gap-12 lg:sticky lg:top-28">
      <div>
        <span className="fc-eyebrow">Informations</span>
        <dl className="mt-6 border-t border-line">
          <div className={row}>
            <dt className="text-silver">Adresse</dt>
            <dd className="sm:text-right">Lot N23, 1695 rue de la Grand Cour<br />45760 Marigny-Les-Usages</dd>
          </div>
          <div className={row}>
            <dt className="text-silver">Téléphone</dt>
            <dd><a href="tel:+33667537400" className="transition-colors hover:text-orange">06.67.53.74.00</a></dd>
          </div>
          <div className={row}>
            <dt className="text-silver">Email</dt>
            <dd><a href="mailto:c.forevercars@gmail.com" className="transition-colors hover:text-orange">c.forevercars@gmail.com</a></dd>
          </div>
        </dl>
      </div>

      <div>
        <span className="fc-eyebrow">Horaires</span>
        <dl className="mt-6 border-t border-line">
          {[["Lundi - Vendredi", "9h - 19h"], ["Samedi", "10h - 17h"], ["Dimanche", "Fermé"]].map(([day, hours]) => (
            <div key={day} className={row}>
              <dt className="text-silver">{day}</dt>
              <dd className={hours === "Fermé" ? "text-silver" : ""}>{hours}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <span className="fc-eyebrow">Suivez-nous</span>
        <div className="mt-6 flex gap-2.5">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="grid h-12 w-12 place-items-center rounded-full border border-line-strong text-silver transition-colors duration-300 hover:border-orange hover:text-orange"
            >
              <SocialIcon name={social.name} className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}

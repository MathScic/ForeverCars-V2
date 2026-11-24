import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { BarChart3, CarFront, FileText, Plus, Users } from "lucide-react";
import logo from "../assets/Forever-CarsLogo.svg";
import { useDemoStore } from "../demo/store";

// Liens de la maquette : capitales Archivo espacées ; actif = fond graphite + liseré orange.
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex h-11 items-center gap-3 rounded-sm border-l px-3.5 font-display text-[11px] font-medium uppercase tracking-[0.2em] [font-stretch:112%] transition-colors duration-300 ${
    isActive ? "border-orange bg-graphite text-ivory" : "border-transparent text-silver hover:text-ivory"
  }`;

export default function Sidebar() {
  const { isAdmin } = useDemoStore();
  const [version, setVersion] = useState("");

  useEffect(() => {
    window.api.app.version().then(setVersion).catch(() => setVersion("?"));
  }, []);

  return (
    <aside className="sticky top-0 flex h-full w-[248px] shrink-0 flex-col gap-9 border-r border-line px-[18px] py-7">
      <img src={logo} alt="ForeverCars" className="h-12 w-auto self-start" />
      <nav aria-label="Navigation principale" className="grid gap-0.5">
        <NavLink to="/" end className={linkClass}>
          <CarFront size={15} aria-hidden /> Parc
        </NavLink>
        <NavLink to="/vendre" className={linkClass}>
          <Plus size={15} aria-hidden /> Mettre en vente
        </NavLink>
        <NavLink to="/documents" className={linkClass}>
          <FileText size={15} aria-hidden /> Documents
        </NavLink>
        <NavLink to="/statistiques" className={linkClass}>
          <BarChart3 size={15} aria-hidden /> Statistiques
        </NavLink>
        {isAdmin && (
          <NavLink to="/equipe" className={linkClass}>
            <Users size={15} aria-hidden /> Équipe
          </NavLink>
        )}
      </nav>
      <div className="mt-auto text-xs text-silver">
        <p className="italic">« Acheter ou vendre autrement »</p>
        <p className="mt-1.5">Back-Office v{version}</p>
      </div>
    </aside>
  );
}

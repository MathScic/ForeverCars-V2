import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { CarFront, PlusCircle, Users } from "lucide-react";
import logo from "../assets/Forever-CarsLogo.svg";
import { useDemoStore } from "../demo/store";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 h-11 px-4 rounded-lg text-sm font-medium border-l-2 transition-colors ${
    isActive
      ? "bg-brand-gray-dark text-brand-white border-brand-orange"
      : "text-brand-gray-light border-transparent hover:text-brand-white hover:bg-brand-gray-dark/60"
  }`;

export default function Sidebar() {
  const { isAdmin } = useDemoStore();
  const [version, setVersion] = useState("");

  useEffect(() => {
    window.api.app.version().then(setVersion).catch(() => setVersion("?"));
  }, []);

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-brand-gray-medium/20 bg-brand-black">
      <div className="h-24 flex items-center px-6">
        <img src={logo} alt="ForeverCars" className="h-14 w-auto" />
      </div>
      <nav aria-label="Navigation principale" className="flex-1 flex flex-col gap-1 px-3">
        <NavLink to="/" end className={linkClass}>
          <CarFront size={18} /> Parc
        </NavLink>
        <NavLink to="/vendre" className={linkClass}>
          <PlusCircle size={18} /> Mettre en vente
        </NavLink>
        {isAdmin && (
          <NavLink to="/equipe" className={linkClass}>
            <Users size={18} /> Équipe
          </NavLink>
        )}
      </nav>
      <div className="px-6 py-5 text-xs text-brand-gray-light/50">
        <p className="italic">« Acheter ou vendre autrement »</p>
        <p className="mt-1">Back-Office v{version}</p>
      </div>
    </aside>
  );
}

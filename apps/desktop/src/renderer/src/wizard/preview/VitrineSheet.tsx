import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { formatMileage, formatPrice } from "@forevercars/shared";
import logo from "../../assets/Forever-CarsLogo.svg";
import type { DemoVehicle } from "../../demo/types";
import { FUEL_LABELS, GEARBOX_LABELS } from "../../services/equipment";
import { finalize } from "../draft";

const SITE_URL = "https://forevercars.fr";

/**
 * Fiche vitrine A4 à poser derrière le pare-brise. Papier blanc, texte noir, accents orange.
 * Seule cette zone (.print-area) sort à l'impression.
 */
export default function VitrineSheet({ vehicle: v }: { vehicle: DemoVehicle }) {
  const [qr, setQr] = useState("");
  // Slug recalculé depuis la fiche : il n'est figé qu'à l'enregistrement.
  const url = `${SITE_URL}/stock/${finalize(v).slug}`;

  useEffect(() => {
    QRCode.toDataURL(url, { margin: 0, width: 240, color: { dark: "#0a0a0a", light: "#ffffff" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, [url]);

  const specs: [string, string][] = [
    ["Année", String(v.year)],
    ["Km", formatMileage(v.mileage)],
    ["Énergie", FUEL_LABELS[v.fuel]],
    ["Boîte", GEARBOX_LABELS[v.gearbox]],
    ["Puiss.", `${v.powerHp} ch`],
    ["Garantie", v.warrantyMonths ? `${v.warrantyMonths} mois` : "—"],
  ];

  return (
    <div className="print-area aspect-[210/297] w-full bg-ivory text-carbon p-7 flex flex-col rounded-md shadow-lg">
      {/* Bandeau noir : le logo du site est prévu pour un fond sombre */}
      <div className="-mx-7 -mt-7 px-7 py-3 bg-carbon rounded-t-md flex items-center justify-between">
        <img src={logo} alt="ForeverCars" className="h-10 w-auto" />
        <span className="text-[10px] font-mono text-silver">{v.fileNumber}</span>
      </div>
      <h2 className="font-display text-2xl font-bold mt-4 leading-tight">{v.brand} {v.model}</h2>
      <p className="text-xs text-silver">{v.version}</p>
      <p className="font-display text-4xl font-bold mt-3 tabular-nums">{formatPrice(v.price)}</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 text-[11px]">
        {specs.map(([label, value]) => (
          <div key={label}>
            <dt className="inline font-bold">{label} </dt>
            <dd className="inline">{value}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-3 text-[10px] space-y-0.5">
        {v.equipment.slice(0, 8).map((item) => (
          <li key={item}><span className="text-orange font-bold">+</span> {item}</li>
        ))}
      </ul>
      <div className="mt-auto flex items-center gap-3 pt-3 border-t border-carbon/10">
        {qr && <img src={qr} alt={`QR code vers ${url}`} className="h-16 w-16" />}
        <p className="text-[10px] leading-snug">
          Scannez pour voir toutes les photos et réserver un essai
          <br />
          <span className="text-silver">forevercars.fr · « Tu t&apos;occupes de rien, je m&apos;occupe de tout »</span>
        </p>
      </div>
    </div>
  );
}

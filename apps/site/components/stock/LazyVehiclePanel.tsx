"use client";

import { useEffect, useState, type ComponentProps } from "react";
import dynamic from "next/dynamic";
import type VehicleDetailPanel from "./VehicleDetailPannel";

const load = () => import("./VehicleDetailPannel");
const Panel = dynamic(load, { ssr: false });

// Le panneau (galerie à glisser, ressorts framer-motion) n'est pas utile au premier affichage.
// On le télécharge 3 s après, ou dès que le doigt / la souris se pose sur la page (avant le clic).
// Il n'est rendu qu'à partir du premier véhicule ouvert : rendu plus tôt, dynamic() le
// téléchargerait aussitôt. Ensuite il reste monté pour jouer l'animation de fermeture.
export default function LazyVehiclePanel(props: ComponentProps<typeof VehicleDetailPanel>) {
  const [needed, setNeeded] = useState(false);
  if (props.vehicle && !needed) setNeeded(true);

  useEffect(() => {
    const preload = () => void load();
    const timer = setTimeout(preload, 3000);
    window.addEventListener("pointerdown", preload, { once: true, capture: true, passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", preload, { capture: true });
    };
  }, []);

  return needed ? <Panel {...props} /> : null;
}

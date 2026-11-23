"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { Vehicle } from "@/lib/types/vehicle";
import Gallery from "./panel/Gallery";
import Lightbox from "./panel/Lightbox";
import VehicleInfo from "./panel/VehicleInfo";

interface VehicleDetailPanelProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

// Panneau qui glisse depuis la droite (comportement d'origine conservé), habillage « Showroom Nocturne ».
export default function VehicleDetailPanel({ vehicle, onClose }: VehicleDetailPanelProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(1); // sens de navigation, pour l'animation
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const reduce = useReducedMotion();

  // Réinitialise la galerie quand on change de véhicule, pendant le rendu (pas dans un effet).
  const [prevVehicleId, setPrevVehicleId] = useState(vehicle?._id);
  if (vehicle?._id !== prevVehicleId) {
    setPrevVehicleId(vehicle?._id);
    setCurrentImage(0);
    setLightboxOpen(false);
  }

  const handleCopyLink = () => {
    if (!vehicle) return;
    navigator.clipboard.writeText(`${window.location.origin}/stock/${vehicle.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Bouton retour du navigateur : ferme le panneau au lieu de quitter la page ; Échap aussi.
  useEffect(() => {
    if (!vehicle) return;
    window.history.pushState({ vehiclePanel: true }, "");
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [vehicle, onClose]);

  const handleInterest = () => {
    if (!vehicle) return;
    const params = new URLSearchParams({ vehicule: `${vehicle.brand} ${vehicle.model}`, sujet: "achat" });
    router.push(`/contact?${params.toString()}`);
  };

  const images = vehicle?.images ?? [];
  const go = (index: number) => {
    if (!images.length) return;
    setDirection(index > currentImage ? 1 : -1);
    setCurrentImage((index + images.length) % images.length);
  };

  useEffect(() => {
    if (!vehicle) return;
    const onKey = (e: KeyboardEvent) => {
      if (lightboxOpen) return; // le plein écran gère lui-même Échap et les flèches
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowRight") go(currentImage + 1);
      if (e.key === "ArrowLeft") go(currentImage - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const name = vehicle ? `${vehicle.brand} ${vehicle.model}` : "";

  return (
    <AnimatePresence>
      {vehicle && (
        <>
          <motion.div key="voile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={onClose} className="fixed inset-0 z-[60] bg-[rgb(5_5_6/0.6)] backdrop-blur-[6px]" />
          <motion.aside
            key="panneau"
            role="dialog"
            aria-modal="true"
            aria-labelledby="panneau-titre"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={reduce ? { duration: 0.2 } : { type: "spring", bounce: 0, duration: 0.7 }}
            className="fixed inset-y-0 right-0 z-[61] w-full overflow-y-auto border-l border-line-strong bg-carbon shadow-[-40px_0_80px_-30px_rgba(0,0,0,0.8)] md:w-[min(720px,100%)]"
          >
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line bg-carbon/80 px-4 py-3.5 backdrop-blur-xl md:px-7">
              <h2 id="panneau-titre" className="fc-model text-sm">{name}</h2>
              <button type="button" onClick={onClose} aria-label="Fermer" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong transition-colors hover:border-ivory">
                <X size={18} />
              </button>
            </div>
            <Gallery images={images} current={currentImage} direction={direction} alt={name} onGo={go} onZoom={() => setLightboxOpen(true)} />
            <div className="px-4 pb-12 pt-8 md:px-7">
              <VehicleInfo vehicle={vehicle} copied={copied} onInterest={handleInterest} onCopy={handleCopyLink} showPageLink />
            </div>
          </motion.aside>
          <AnimatePresence>
            {lightboxOpen && <Lightbox key="plein-ecran" images={images} current={currentImage} alt={name} onGo={go} onClose={() => setLightboxOpen(false)} />}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

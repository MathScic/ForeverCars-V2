"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Vehicle } from "@/lib/types/vehicle";
import { urlForImage } from "@/lib/photos";
import Gallery from "@/components/stock/panel/Gallery";
import Lightbox from "@/components/stock/panel/Lightbox";
import VehicleInfo from "@/components/stock/panel/VehicleInfo";

interface Props {
  vehicle: Vehicle;
}

// Page fiche (liens partagés, Google, QR code de la fiche vitrine) : même contenu que le panneau.
export default function VehicleDetailPage({ vehicle }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const images = vehicle.images || [];
  const name = `${vehicle.brand} ${vehicle.model}`;
  const go = (index: number) => {
    if (!images.length) return;
    setDirection(index > currentImage ? 1 : -1);
    setCurrentImage((index + images.length) % images.length);
  };

  const handleInterest = () => {
    const params = new URLSearchParams({ vehicule: name, sujet: "achat" });
    router.push(`/contact?${params.toString()}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-[min(100%-32px,1320px)] pt-8 md:w-[min(100%-48px,1320px)] md:pt-12">
      <Link href="/stock" className="fc-link-arrow mb-7">
        <span aria-hidden>←</span> Retour au stock
      </Link>

      {/* grid-cols-1 + min-w-0 : sinon la bande de miniatures élargit la colonne (galerie géante sur téléphone) */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-14">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-md border border-line">
            <Gallery images={images} current={currentImage} direction={direction} alt={name} onGo={go} onZoom={() => setLightboxOpen(true)} priority />
          </div>
          {images.length > 1 && (
            <div className="mt-2.5 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none]">
              {images.map((img, i) => {
                const thumb = urlForImage(img)?.width(240).height(180).quality(70).url();
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Photo ${i + 1}`}
                    aria-current={i === currentImage ? "true" : undefined}
                    className={`relative aspect-[4/3] w-[72px] shrink-0 overflow-hidden rounded-sm border transition-[opacity,border-color] duration-300 md:w-[110px] ${
                      i === currentImage ? "border-orange opacity-100" : "border-line opacity-55 hover:opacity-100"
                    }`}
                  >
                    {thumb && <Image src={thumb} alt="" fill sizes="110px" className="object-cover" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28">
          <h1 className="fc-model mb-6 text-[22px] leading-tight tracking-[0.03em] md:text-[28px]">{name}</h1>
          <VehicleInfo vehicle={vehicle} copied={copied} onInterest={handleInterest} onCopy={handleCopyLink} />
        </aside>
      </div>

      <AnimatePresence>
        {lightboxOpen && <Lightbox key="plein-ecran" images={images} current={currentImage} alt={name} onGo={go} onClose={() => setLightboxOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

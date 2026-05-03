"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, X, ArrowLeft, Link2, Check } from "lucide-react";
import { Vehicle } from "@/lib/types/vehicle";
import { urlForImage } from "@/sanity/lib/image";

interface Props {
  vehicle: Vehicle;
}

export default function VehicleDetailPage({ vehicle }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const images = vehicle.images || [];

  const getImageUrl = (img: (typeof images)[number], width = 1200) =>
    urlForImage(img).width(width).quality(90).url();

  const getImageDimensions = (img: (typeof images)[number]) => {
    const w = img?.dimensions?.width || 1200;
    const h = img?.dimensions?.height || 900;
    return { width: w, height: h };
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const handleInterest = () => {
    const params = new URLSearchParams({
      vehicule: `${vehicle.brand} ${vehicle.model}`,
      sujet: "achat",
    });
    router.push(`/contact?${params.toString()}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="bg-brand-black min-h-screen">
      {/* Back */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Link
          href="/stock"
          className="inline-flex items-center gap-2 font-inter text-sm text-brand-gray-light hover:text-brand-white transition-colors duration-300"
        >
          <ArrowLeft size={16} />
          Retour au stock
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Galerie */}
        <div className="space-y-4">
          <div
            className="relative w-full bg-brand-black rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          >
            {images[currentImage] && (() => {
              const dims = getImageDimensions(images[currentImage]);
              return (
                <Image
                  src={getImageUrl(images[currentImage])}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  width={dims.width}
                  height={dims.height}
                  style={{ width: "100%", height: "auto", maxHeight: "70vh", objectFit: "contain" }}
                  priority
                />
              );
            })()}
            {vehicle.status === "reserved" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white text-brand-black font-orbitron font-bold text-sm px-6 py-2 rounded-full shadow-lg -rotate-6">
                  RÉSERVÉ
                </div>
              </div>
            )}
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-brand-black/70 text-brand-white text-xs px-3 py-1 rounded-full z-10">
              Cliquez pour agrandir
            </span>
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-brand-black/60 hover:bg-brand-black/80 rounded-full text-brand-white z-10">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-black/60 hover:bg-brand-black/80 rounded-full text-brand-white z-10">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            <div className="absolute bottom-3 right-4 bg-brand-black/70 px-3 py-1 rounded-full z-10">
              <span className="font-orbitron text-xs text-brand-white">{currentImage + 1} / {images.length}</span>
            </div>
          </div>

          {/* Miniatures */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-all ${index === currentImage ? "border-brand-orange" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <Image src={getImageUrl(img, 160)} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="space-y-6">
          <div>
            <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-brand-white">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="font-inter text-sm text-brand-gray-light mt-1">
              {vehicle.year} • {vehicle.mileage.toLocaleString()} km • {vehicle.fuel} • {vehicle.transmission}
            </p>
          </div>

          <div className="py-4 bg-brand-gray-dark rounded-lg text-center">
            <span className="font-orbitron text-3xl font-bold text-brand-orange">
              {vehicle.price.toLocaleString()} €
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Année", value: vehicle.year },
              { label: "Kilométrage", value: `${vehicle.mileage.toLocaleString()} km` },
              { label: "Carburant", value: vehicle.fuel },
              { label: "Boîte", value: vehicle.transmission },
              { label: "Puissance", value: `${vehicle.power} ch` },
              { label: "Type", value: vehicle.type },
            ].map(({ label, value }) => (
              <div key={label} className="bg-brand-gray-dark p-3 rounded-lg">
                <p className="font-inter text-xs text-brand-gray-light uppercase">{label}</p>
                <p className="font-orbitron text-sm font-semibold text-brand-white capitalize mt-1">{value}</p>
              </div>
            ))}
          </div>

          {vehicle.description && (
            <div>
              <h2 className="font-orbitron text-sm font-semibold text-brand-orange uppercase mb-2">Description</h2>
              <p className="font-inter text-sm text-brand-gray-light leading-relaxed whitespace-pre-line">{vehicle.description}</p>
            </div>
          )}

          {vehicle.features && vehicle.features.length > 0 && (
            <div>
              <h2 className="font-orbitron text-sm font-semibold text-brand-orange uppercase mb-2">Équipements</h2>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature) => (
                  <span key={feature} className="px-3 py-1 bg-brand-gray-dark text-brand-gray-light font-inter text-sm rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleInterest}
              className="w-full font-orbitron text-sm font-semibold px-8 py-4 bg-brand-orange text-brand-black rounded-full hover:bg-brand-orange/90 transition-all duration-300"
            >
              Je suis intéressé
            </button>
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 font-inter text-sm px-8 py-3 border border-brand-gray-medium/40 text-brand-gray-light rounded-full hover:border-brand-orange/50 hover:text-brand-white transition-all duration-300"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Link2 size={16} />}
              {copied ? "Lien copié !" : "Copier le lien de cette annonce"}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 p-3 bg-brand-gray-dark/80 rounded-full text-brand-white z-10">
            <X size={28} />
          </button>
          <div className="relative w-full h-full flex items-center justify-center p-8">
            {images[currentImage] && (() => {
              const dims = getImageDimensions(images[currentImage]);
              return (
                <Image
                  src={getImageUrl(images[currentImage], 1920)}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  width={dims.width}
                  height={dims.height}
                  style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", objectFit: "contain" }}
                  onClick={(e) => e.stopPropagation()}
                />
              );
            })()}
          </div>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-brand-gray-dark/80 rounded-full text-brand-white">
                <ChevronLeft size={32} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-brand-gray-dark/80 rounded-full text-brand-white">
                <ChevronRight size={32} />
              </button>
            </>
          )}
          <div className="absolute top-4 left-4 bg-brand-gray-dark/80 px-4 py-2 rounded-full">
            <span className="font-orbitron text-sm text-brand-white">{currentImage + 1} / {images.length}</span>
          </div>
        </div>
      )}
    </main>
  );
}

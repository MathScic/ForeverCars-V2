"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Vehicle } from "@/lib/types/vehicle";
import { urlForImage } from "@/sanity/lib/image";

interface VehicleDetailPanelProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export default function VehicleDetailPanel({ vehicle, onClose }: VehicleDetailPanelProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCurrentImage(0);
    setLightboxOpen(false);
  }, [vehicle?._id]);

  const handleInterest = () => {
    if (!vehicle) return;
    const params = new URLSearchParams({
      vehicule: `${vehicle.brand} ${vehicle.model}`,
      sujet: "achat",
    });
    router.push(`/contact?${params.toString()}`);
  };

  const getImages = () => {
    if (!vehicle) return [];
    return vehicle.images;
  };

  const images = getImages();

  const getImageUrl = (img: (typeof images)[number], width = 1200, height = 900) => {
    return urlForImage(img).width(width).height(height).url();
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      {vehicle && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Panel - 50% de l'écran */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full md:w-1/2 bg-brand-gray-dark border-l border-brand-gray-medium/20 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-brand-gray-dark/95 backdrop-blur-sm border-b border-brand-gray-medium/20 p-4 flex items-center justify-between z-10">
              <h2 className="font-orbitron text-lg font-bold text-brand-white">
                {vehicle.brand} {vehicle.model}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-brand-gray-light hover:text-brand-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Carousel - Cliquable pour lightbox */}
            <div
              className="relative h-72 md:h-96 bg-brand-gray-medium cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  {images[currentImage] ? (
                    <Image
                      src={getImageUrl(images[currentImage])}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-brand-black">
                      <span className="font-orbitron text-brand-gray-medium">
                        Photo {currentImage + 1}
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {vehicle.isNew && (
                <span className="absolute top-4 left-4 bg-brand-orange text-brand-black text-xs font-semibold px-3 py-1 rounded-full z-10">
                  Nouveau
                </span>
              )}

              {/* Hint pour cliquer */}
              <span className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-brand-black/70 text-brand-white text-xs px-3 py-1 rounded-full z-10">
                Cliquez pour agrandir
              </span>

              {/* Flèches navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-brand-black/60 hover:bg-brand-black/80 rounded-full text-brand-white transition-all z-10"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-black/60 hover:bg-brand-black/80 rounded-full text-brand-white transition-all z-10"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Indicateurs (dots) */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setCurrentImage(index); }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImage
                        ? "bg-brand-orange w-4"
                        : "bg-brand-white/50 hover:bg-brand-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Prix */}
              <div className="text-center py-4 bg-brand-black rounded-lg">
                <span className="font-orbitron text-3xl font-bold text-brand-orange">
                  {vehicle.price.toLocaleString()} €
                </span>
              </div>

              {/* Caractéristiques principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-black p-4 rounded-lg text-center">
                  <p className="font-inter text-xs text-brand-gray-light uppercase">Année</p>
                  <p className="font-orbitron text-lg font-semibold text-brand-white">{vehicle.year}</p>
                </div>
                <div className="bg-brand-black p-4 rounded-lg text-center">
                  <p className="font-inter text-xs text-brand-gray-light uppercase">Kilométrage</p>
                  <p className="font-orbitron text-lg font-semibold text-brand-white">{vehicle.mileage.toLocaleString()} km</p>
                </div>
                <div className="bg-brand-black p-4 rounded-lg text-center">
                  <p className="font-inter text-xs text-brand-gray-light uppercase">Carburant</p>
                  <p className="font-orbitron text-lg font-semibold text-brand-white capitalize">{vehicle.fuel}</p>
                </div>
                <div className="bg-brand-black p-4 rounded-lg text-center">
                  <p className="font-inter text-xs text-brand-gray-light uppercase">Boîte</p>
                  <p className="font-orbitron text-lg font-semibold text-brand-white capitalize">{vehicle.transmission}</p>
                </div>
              </div>

              {/* Puissance */}
              <div className="bg-brand-black p-4 rounded-lg flex items-center justify-between">
                <span className="font-inter text-sm text-brand-gray-light">Puissance</span>
                <span className="font-orbitron text-lg font-semibold text-brand-white">{vehicle.power} ch</span>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-orbitron text-sm font-semibold text-brand-orange uppercase mb-2">Description</h3>
                <p className="font-inter text-sm text-brand-gray-light leading-relaxed whitespace-pre-line">{vehicle.description}</p>
              </div>

              {/* Équipements */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div>
                  <h3 className="font-orbitron text-sm font-semibold text-brand-orange uppercase mb-2">Équipements</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature) => (
                      <span key={feature} className="px-3 py-1 bg-brand-black text-brand-gray-light font-inter text-sm rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleInterest}
                className="w-full font-orbitron text-sm font-semibold px-8 py-4 bg-brand-orange text-brand-black rounded-full hover:bg-brand-orange/90 transition-all duration-300"
              >
                Je suis intéressé
              </button>
            </div>
          </motion.div>

          {/* Lightbox - Plein écran */}
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
                onClick={() => setLightboxOpen(false)}
              >
                {/* Bouton fermer */}
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="absolute top-4 right-4 p-3 bg-brand-gray-dark/80 hover:bg-brand-gray-dark rounded-full text-brand-white transition-all z-10"
                >
                  <X size={28} />
                </button>

                {/* Image plein écran */}
                <div className="relative w-full h-full flex items-center justify-center p-8">
                  {images[currentImage] ? (
                    <Image
                      src={getImageUrl(images[currentImage], 1920, 1440)}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      className="object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="font-orbitron text-2xl text-brand-gray-medium">
                        Photo {currentImage + 1}
                      </span>
                    </div>
                  )}
                </div>

                {/* Flèches navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-brand-gray-dark/80 hover:bg-brand-gray-dark rounded-full text-brand-white transition-all"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-brand-gray-dark/80 hover:bg-brand-gray-dark rounded-full text-brand-white transition-all"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </>
                )}

                {/* Indicateurs */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => { e.stopPropagation(); setCurrentImage(index); }}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImage
                          ? "bg-brand-orange w-6"
                          : "bg-brand-white/50 hover:bg-brand-white/80"
                      }`}
                    />
                  ))}
                </div>

                {/* Compteur */}
                <div className="absolute top-4 left-4 bg-brand-gray-dark/80 px-4 py-2 rounded-full">
                  <span className="font-orbitron text-sm text-brand-white">
                    {currentImage + 1} / {images.length}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { urlForImage } from "@/lib/photos";
import type { SanityImage } from "@/lib/types/vehicle";

interface Props {
  images: SanityImage[];
  current: number;
  alt: string;
  onGo: (index: number) => void;
  onClose: () => void;
}

const ctrl = "absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-graphite/80 text-lg transition-colors hover:border-ivory";

// Plein écran : la photo grandit à l'ouverture ; glisser pour changer ; Échap ou ✕ pour fermer.
export default function Lightbox({ images, current, alt, onGo, onClose }: Props) {
  const reduce = useReducedMotion();
  const img = images[current];
  const meta = img?.asset?.metadata;
  const url = img ? urlForImage(img)?.width(1920).quality(90).url() : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onGo(current + 1);
      if (e.key === "ArrowLeft") onGo(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, onClose, onGo]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Photo en grand"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] grid place-items-center bg-black"
    >
      <button type="button" onClick={onClose} aria-label="Fermer l'agrandissement" className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-line-strong bg-graphite/80 text-xl">
        ✕
      </button>
      <span className="absolute left-4 top-4 rounded-full bg-graphite/80 px-4 py-2.5 font-display text-sm [font-stretch:112%]">
        {current + 1} / {images.length}
      </span>
      <motion.div
        initial={reduce ? false : { scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reduce ? { duration: 0.2 } : { type: "spring", bounce: 0, duration: 0.6 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50 || info.velocity.x < -400) onGo(current + 1);
          else if (info.offset.x > 50 || info.velocity.x > 400) onGo(current - 1);
        }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full select-none items-center justify-center p-6 md:p-10"
        style={{ touchAction: "pan-y" }}
      >
        {url && (
          <Image src={url} alt={alt} width={meta?.dimensions?.width || 1600} height={meta?.dimensions?.height || 1067} draggable={false} className="pointer-events-none max-h-full w-auto max-w-full object-contain" />
        )}
      </motion.div>
      {images.length > 1 && (
        <>
          <button type="button" onClick={(e) => (e.stopPropagation(), onGo(current - 1))} aria-label="Photo précédente" className={`${ctrl} left-4`}>←</button>
          <button type="button" onClick={(e) => (e.stopPropagation(), onGo(current + 1))} aria-label="Photo suivante" className={`${ctrl} right-4`}>→</button>
        </>
      )}
    </motion.div>
  );
}

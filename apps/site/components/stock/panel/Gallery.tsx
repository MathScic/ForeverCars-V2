"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { urlForImage } from "@/lib/photos";
import type { SanityImage } from "@/lib/types/vehicle";
import GalleryPhoto from "./GalleryPhoto";

interface Props {
  images: SanityImage[];
  current: number;
  direction: number;
  alt: string;
  onGo: (index: number) => void;
  onZoom: () => void;
  /** Photo chargée en priorité (page fiche : c'est le plus grand élément affiché). */
  priority?: boolean;
}

// Les photos entrent du côté vers lequel on navigue et sortent de l'autre.
const slide: Variants = {
  enter: (d: number) => ({ x: d > 0 ? "30%" : "-30%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? "-30%" : "30%", opacity: 0 }),
};
const fade: Variants = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } };
const ctrl = "absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-carbon/60 backdrop-blur-md transition-colors hover:border-ivory";
const DOTS_MAX = 10; // au-delà, les points passent sous le compteur sur téléphone : barre de progression à la place

export default function Gallery({ images, current, direction, alt, onGo, onZoom, priority = false }: Props) {
  const reduce = useReducedMotion();
  const img = images[current];
  const hasPhoto = Boolean(img && urlForImage(img));
  const count = images.length;

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-graphite">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.button
          key={current}
          type="button"
          custom={direction}
          variants={reduce ? fade : slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={reduce ? { duration: 0.2 } : { type: "spring", bounce: 0, duration: 0.5 }}
          drag={count > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50 || info.velocity.x < -400) onGo(current + 1);
            else if (info.offset.x > 50 || info.velocity.x > 400) onGo(current - 1);
          }}
          onClick={onZoom}
          aria-label="Agrandir la photo"
          className="absolute inset-0 cursor-zoom-in select-none"
          style={{ touchAction: "pan-y" }}
        >
          {hasPhoto ? (
            <GalleryPhoto image={img} alt={alt} priority={priority && current === 0} />
          ) : (
            <span className="grid h-full place-items-center text-silver">Photo {current + 1}</span>
          )}
        </motion.button>
      </AnimatePresence>

      {count > 1 && (
        <>
          <button type="button" onClick={() => onGo(current - 1)} aria-label="Photo précédente" className={`${ctrl} left-3`}>←</button>
          <button type="button" onClick={() => onGo(current + 1)} aria-label="Photo suivante" className={`${ctrl} right-3`}>→</button>
          {count <= DOTS_MAX ? (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onGo(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={i === current ? "true" : undefined}
                  className={`h-2 rounded-full transition-[width,background-color] duration-500 ease-[var(--ease-spring)] ${i === current ? "w-[22px] bg-orange" : "w-2 bg-ivory/45 hover:bg-ivory/80"}`}
                />
              ))}
            </div>
          ) : (
            <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-[3px] bg-ivory/15">
              <div className="h-full bg-orange transition-[width] duration-500 ease-[var(--ease-spring)]" style={{ width: `${((current + 1) / count) * 100}%` }} />
            </div>
          )}
        </>
      )}
      <span className="absolute bottom-4 right-4 z-10 rounded-sm bg-carbon/70 px-3 py-2 font-display text-[11px] font-semibold tracking-[0.2em] backdrop-blur-md [font-stretch:112%]">
        {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </span>
    </div>
  );
}

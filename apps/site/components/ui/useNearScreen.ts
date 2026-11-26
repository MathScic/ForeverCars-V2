"use client";

import { useEffect, useRef, useState } from "react";

/**
 * true dès que l'élément arrive à moins de `margin` de l'écran (puis reste true).
 * Sert à ne charger les photos du bas de la liste qu'au défilement : sur téléphone, Chrome
 * les chargeait toutes d'entrée et ralentissait la première photo (mesure Lighthouse).
 */
export function useNearScreen<T extends Element>(enabled: boolean, margin = "600px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(!enabled);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, margin]);

  return [ref, near] as const;
}

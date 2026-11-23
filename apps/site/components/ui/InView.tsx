"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

interface InViewProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Marge de déclenchement (IntersectionObserver), ex. "-8% 0px". */
  margin?: string;
}

// Ajoute la classe « is-in » la première fois que le bloc entre à l'écran ; le CSS (globals.css)
// fait l'animation. Remplace framer-motion pour les apparitions : rien à charger au démarrage.
export default function InView({ children, className = "", style, margin = "-8% 0px" }: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return (
    <div ref={ref} className={`${className} ${shown ? "is-in" : ""}`} style={style}>
      {children}
    </div>
  );
}

import type { CSSProperties, ReactNode } from "react";
import InView from "./InView";

interface FadeInProps {
  children: ReactNode;
  /** Délai en secondes. */
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

// Décalage court : un mouvement discret paraît plus soigné qu'un grand glissement.
const OFFSET = 28;
const OFFSETS = { up: [0, OFFSET], down: [0, -OFFSET], left: [OFFSET, 0], right: [-OFFSET, 0] } as const;

// Apparition au défilement (reprise de test-apple-design) : même courbe sans rebond que le ressort
// d'origine, jouée en CSS (.fade-in dans globals.css). Mouvement réduit : apparition directe.
export default function FadeIn({ children, delay = 0, direction = "up", className = "" }: FadeInProps) {
  const [x, y] = OFFSETS[direction];
  const style = { "--fade-x": `${x}px`, "--fade-y": `${y}px`, "--fade-delay": `${delay}s` } as CSSProperties;
  return (
    <InView className={`fade-in ${className}`} style={style}>
      {children}
    </InView>
  );
}

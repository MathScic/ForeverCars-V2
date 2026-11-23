// Charte ForeverCars « Showroom Nocturne » (validée le 22/11/2026).
// Source unique : le site (theme.css) et le back-office lisent ces valeurs.

export const colors = {
  carbon: "#0A0A0B", // fond
  graphite: "#151518", // cartes, panneaux
  graphite2: "#1D1D21", // survols, surfaces surélevées
  ivory: "#F4F1EA", // texte principal
  silver: "#9A9AA2", // texte secondaire (contraste AA sur carbon et graphite)
  orange: "#FF8C42", // accent rare : prix, actions, néon
  success: "#4ADE80",
  danger: "#EF4444",
  line: "rgb(244 241 234 / 0.09)", // filets
  lineStrong: "rgb(244 241 234 / 0.18)",
} as const;

export const fonts = {
  display: "Archivo", // titres, largeur étendue (font-stretch 112 à 125 %)
  body: "Inter",
} as const;

export const radii = { sm: "2px", md: "4px", pill: "999px" } as const;

/** Courbes d'animation : ressort critiquement amorti (pas de rebond) et sortie douce. */
export const easing = {
  spring: "cubic-bezier(0.16, 1, 0.3, 1)",
  out: "cubic-bezier(0.22, 0.61, 0.36, 1)",
} as const;

/** Même ressort côté Framer Motion. */
export const spring = { type: "spring", bounce: 0 } as const;

export const durations = { fast: 300, base: 700, slow: 1100 } as const;

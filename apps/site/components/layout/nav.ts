// Liens de navigation du site. « Accueil » n'apparaît pas dans l'en-tête ordinateur :
// le logo y ramène déjà (choix validé sur les maquettes). Il reste dans le menu mobile et le pied de page.
export const NAV_LINKS = [
  { href: "/stock", label: "Notre Stock" },
  { href: "/vendu", label: "Vendu" },
  { href: "/a-propos", label: "À Propos" },
] as const;

export const HOME_LINK = { href: "/", label: "Accueil" } as const;

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

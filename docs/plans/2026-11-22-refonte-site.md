# Refonte du site « Showroom Nocturne » : plan d'application

**Objectif :** appliquer au site `apps/site` la direction validée par l'utilisateur et son client (maquettes `docs/maquettes/`), sans changer contenu, URL, slugs ni métadonnées SEO.

**Architecture :** tokens dans `packages/design` (`tokens.ts` + `theme.css` Tailwind v4), importés par le site ; composants réécrits un par un ; animations reprises de la branche `test-apple-design` (commit `f3824bf`) et adaptées au style.

**Note de conception :** `docs/plans/2026-11-22-refonte-visuelle-design.md` · **Maquettes :** `docs/maquettes/sommaire.html`

## Contraintes globales
- Aucun changement d'URL, de slug, de métadonnées (`layout.tsx`, `sitemap.ts`, `robots.ts`, JSON-LD) ni de logique (filtres, panneau, formulaire web3forms, requêtes Sanity).
- Contraste AA, focus clavier visible, cibles ≥ 44 px, `prefers-reduced-motion` respecté.
- **Responsive téléphone vérifié à chaque tâche** (capture 390 px, aucun débordement horizontal).
- Polices auto-hébergées par `next/font` (aucune requête Google à l'exécution) : Archivo (axe de largeur) + Inter.
- Lighthouse performance ≥ 90 sur mobile.
- Branche `feat/refonte-site`. Push GitHub autorisé ; **aucun déploiement de production ni fusion dans `main` sans l'accord de l'utilisateur**.

## Choix validés sur les maquettes
Menu sans « Accueil » (le logo y mène) · « Nous contacter » orange en pilule · menu mobile = panneau noir opaque de 280 px depuis la droite · carrousel infini en accueil · numéros néon · À propos sans contours · clic sur une carte = panneau latéral, page fiche conservée · filtres du stock sur plusieurs lignes · remontée en haut de liste au changement de page.

## Tâches
1. **Référence « avant »** : captures ordinateur + téléphone de chaque page, Lighthouse mobile (accueil, stock).
2. **`packages/design`** : couleurs, polices, rayons, courbes ; `theme.css` (tokens Tailwind, base, apparitions, impression) ; branché dans `globals.css` ; polices via `next/font`.
3. **Socle** : `Header`, `MobileHeader` (panneau), `Footer`, `FadeIn` (ressort), `Button`.
4. **Accueil** : Hero (vidéo optimisée + poster), Pourquoi nous choisir, carrousel vedette, Comment ça marche (néon), bloc fondateur.
5. **Stock** : en-tête + compteur, filtres multi-lignes, `VehicleCard`, pagination (remontée), panneau latéral `VehicleDetailPannel`.
6. **Fiche véhicule** `/stock/[slug]`.
7. **Vendu, À propos, Contact.**
8. **Performance** : vidéo du hero recompressée (+ poster), photo du fondateur en WebP, préchargement inutile retiré.
9. **Vérification** : lint, types, tests, build ; captures après (ordinateur + téléphone), contrôle de débordement, Lighthouse après ; tableau avant / après.

## Points de vigilance
1. Le panneau latéral garde sa logique (`history.pushState`, bouton retour du navigateur, « Je suis intéressé » → `/contact?vehicule=…`).
2. Les données Sanity en MAJUSCULES et les titres trop longs sont affichés tels quels (nettoyage prévu à la migration) ; aucune coupe côté site.
3. Le formulaire de contact garde la même clé web3forms et les mêmes champs.
4. Le `/studio` Sanity n'est pas restylé.
5. Mouvement réduit : pas de défilement automatique du carrousel, pas de rideau ni de translation.

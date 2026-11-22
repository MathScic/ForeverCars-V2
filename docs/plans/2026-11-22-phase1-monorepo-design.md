# Phase 1 — Monorepo : note de conception

## Pourquoi
Préparer l'arrivée du back-office desktop (`apps/desktop`) et des packages partagés, sans rien changer au site en ligne.

## Objectifs
- Site Next.js déplacé dans `apps/site` avec `git mv` (historique conservé), fonctionnement identique.
- Monorepo pnpm : `pnpm-workspace.yaml`, `package.json` racine, `tsconfig.base.json`, ESLint et Prettier partagés.
- `packages/shared` vide, importé par le site pour prouver le câblage.
- CI GitHub Actions passée de npm à pnpm, au vert.

## Hors périmètre
- Charte / `packages/design` (phase 1 bis), Supabase, desktop.
- Travail d'animation (branche `test-apple-design`, repris à la fin du chantier).

## Anti-objectifs (échec même si « ça marche »)
- Toute différence visible sur le site de prévisualisation par rapport à la production.
- Production Vercel cassée ou modifiée avant la fusion validée.

## Approches envisagées pour la prévisualisation
- **A — 2ᵉ projet Vercel temporaire (choisie)** : même dépôt, Root Directory = `apps/site`. La production n'est pas touchée. À la fusion : bascule du réglage du projet principal, puis suppression du projet temporaire. Coût : recopier les variables d'environnement.
- B — Changer le réglage du projet principal juste avant la fusion, test en local seulement : écarté (pas de prévisualisation, risque en prod).

## Décisions
- L'utilisateur crée et règle lui-même les projets Vercel ; Claude fournit les réglages exacts au bon moment.
- Erreur de lint déjà présente (`VehicleDetailPannel.tsx`, `react-hooks/set-state-in-effect`) corrigée dans un **commit séparé, en début de branche**.
- Fichiers hors Git (`.env.local`, `public/videos/hero-videos_2.mp4`, `public/images/RADEK/`) : déplacés à la main par l'utilisateur, sur indication de Claude au moment du `git mv`.
- `.npmrc` prévu pour Sanity si pnpm strict pose problème.
- Façon de travailler : `docs/backoffice-regles.md` (boilerplate en bloc, logique tapée par l'utilisateur, vérification après chaque étape, pas de sous-agent qui écrit le code).

## Laissé au plan
Ordre exact des étapes, contenu des fichiers de config, commandes de vérification.

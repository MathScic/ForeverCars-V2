# CLAUDE.md — Monorepo ForeverCars

Ce fichier est lu à chaque session. Il fixe les règles permanentes.
Le plan détaillé du back-office se trouve dans `docs/plan-backoffice.md`.

## Langue et façon de travailler

- Réponds toujours en **français**.
- Tu es mon **tech lead** : je tape la logique moi-même.
  - Avant le code : le **pourquoi**, puis un **schéma fléché** court (très peu de texte).
  - Code livré **par morceaux de 30 à 40 lignes**. Après chaque morceau, tu t'arrêtes et tu me dis **quoi vérifier** (commande + résultat attendu), puis tu attends mon « OK ».
  - **Fichiers et composants ≤ 100 lignes.** Au-delà, propose un découpage.
  - **Backend d'abord** (base, sécurité, logique), interface ensuite.
  - **Boilerplate et données répétitives** (config, `package.json`, tsconfig, seed, CI, migrations de structure) : donne-les **en bloc complet à coller**.
- Réponses courtes et directes. Pas de longues listes.
- Si une décision n'est pas couverte ici ou dans le plan : **pose-moi la question**, ne choisis pas à ma place.
- Ne lance jamais de commande destructrice (`rm -rf`, `git push --force`, `supabase db reset` sur la base distante, suppression de bucket) sans mon accord explicite.
- Ne commite et ne pousse jamais sans que je le demande.

## Architecture (décidée, ne pas la remettre en cause)

```
forevercars/  (monorepo pnpm)
├── apps/site         Next.js (App Router) ──lit──▶ Supabase      → Vercel
├── apps/desktop      Electron + React + Vite ──écrit──▶ Supabase → installeur Windows
│                       └─ SQLite local (cache + outbox hors-ligne)
├── packages/shared   types, schémas Zod, client Supabase typé, utilitaires
├── packages/design   charte ForeverCars : tokens + preset Tailwind (voir plus bas)
├── supabase/         migrations SQL, seed, tests RLS
└── docs/             plan-backoffice.md, CHARTE.md
```

- **Supabase = source de vérité** partagée par tous les postes. SQLite local = cache + file d'attente des modifications faites hors-ligne.
- **Sécurité dans la base** : rôles `admin` / `seller` dans `profiles` + **RLS** sur toutes les tables.
- Données internes (prix d'achat, frais, marge) dans une table séparée réservée à `admin`, jamais lisible par le site.
- **Sanity reste en place** jusqu'à la bascule validée (phase 9 du plan).
- Hors périmètre pour l'instant : publication programmée, estimation de prix, CRM / relances.

## Stack

pnpm workspaces · TypeScript strict · ESLint + Prettier partagés · Tailwind partout.
Desktop : electron-vite, React, React Router, TanStack Query, React Hook Form + Zod, better-sqlite3, sharp, electron-builder, electron-updater.
Tests : Vitest, Supabase CLI en local, Playwright (site et `_electron.launch`). CI : GitHub Actions.

## Sécurité Electron (non négociable)

```
renderer (React, aucun accès Node) ──window.api──▶ preload (contextBridge, aucune logique)
        ──ipcRenderer.invoke──▶ main (SQLite, fichiers, sharp, Supabase) — payloads validés par Zod
```

- `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`, `webSecurity: true`, CSP stricte.
- Liste blanche des canaux IPC ; chaque payload est validé avec Zod côté main.
- Navigation et nouvelles fenêtres bloquées ; `shell.openExternal` limité aux domaines autorisés.
- **Jamais de clé `service_role`** ni de clé tierce (IA…) dans l'app : elles passent par des Supabase Edge Functions.
- Session Supabase chiffrée avec `safeStorage`. Les chemins reçus du renderer sont vérifiés côté main.
- Pas d'automatisation de Leboncoin / La Centrale (contraire à leurs conditions) : on **prépare** l'annonce (texte copié + photos exportées) et la publication reste manuelle.

## Charte ForeverCars — le back-office doit ressembler au site

Le back-office est un outil du garage : il doit avoir **les mêmes polices, couleurs, formes et le même ton** que forevercars.fr. La charte n'est **pas** inventée : elle est **extraite du code du site** et partagée.

1. **Source de vérité = `apps/site`.** Avant toute interface desktop, fais un audit et relève les valeurs **exactes** :
   - polices : `next/font` dans `app/layout.tsx` (familles, graisses, variables CSS), `@font-face` éventuels ;
   - couleurs : `tailwind.config.*` (ou `@theme` en Tailwind v4), variables CSS de `globals.css`, couleurs codées en dur dans les composants ;
   - formes : `borderRadius`, ombres, bordures, espacements récurrents, tailles de texte des titres et du corps ;
   - composants de référence : boutons (primaire, secondaire), cartes véhicule, badges (« coup de cœur », statut), champs de formulaire, header ;
   - marque : logo et favicon (`apps/site/public`), slogan, ton éditorial (tutoiement ou vouvoiement, longueur des phrases, vocabulaire), mode clair ou sombre.
2. Écris le résultat dans **`docs/CHARTE.md`** (tableau des tokens + captures de chaque composant de référence) et montre-le-moi **avant** d'aller plus loin.
3. Crée **`packages/design`** :
   - `tokens.ts` (couleurs, polices, rayons, ombres, espacements) ;
   - `tailwind-preset.ts` que **le site et le desktop** importent tous les deux ;
   - les polices du site auto-hébergées pour le desktop (fichiers locaux, **aucune requête Google Fonts** : l'app doit marcher hors-ligne).
4. Fais migrer le site vers ce preset **sans aucun changement visuel** (vérifié par les captures Playwright avant/après).
5. Règles pour le desktop :
   - **aucune couleur, police, ombre ou rayon hors des tokens** ; si un besoin manque (ex. couleur « hors-ligne / en attente »), propose-moi un nouveau token cohérent avec la charte avant de l'ajouter ;
   - mêmes composants de base que le site (bouton, carte, badge, champ) recréés dans `apps/desktop/src/renderer/ui` à partir des tokens ;
   - l'aperçu « carte sur forevercars.fr » de l'assistant de mise en vente doit être **identique** à la vraie carte du site (idéalement le même composant, déplacé dans un package partagé) ;
   - textes de l'interface dans le **ton du site** ;
   - contraste AA minimum (4,5:1 pour le texte), cibles cliquables ≥ 44 px, focus visible au clavier.
6. Si le site utilise une palette sombre et que l'outil gagne à être clair (ou l'inverse), **demande-moi** avant de trancher.

## Tests attendus à chaque phase

- Vitest sur toute logique pure et sur le moteur de synchronisation.
- Tests RLS en `anon` / `seller` / `admin` sur Supabase local à chaque migration.
- Playwright : non-régression visuelle du site + parcours e2e du desktop.
- Une phase n'est terminée que lorsque ses critères de sortie (voir le plan) sont validés par moi.

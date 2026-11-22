# Phase 1 — Migration en monorepo : plan d'exécution

> **Mode d'exécution (imposé)** : pas de sous-agent qui écrit le code. Claude code lui-même toute cette phase (config, boilerplate, CI, route de santé). À la fin de chaque tâche : diff + quoi tester, puis attente du « OK » avant le commit. Aucune action sur Vercel ni push sans accord. Règles : `docs/backoffice-regles.md`.

**Objectif :** le site Next.js vit dans `apps/site` d'un monorepo pnpm, avec un fonctionnement strictement identique.

**Architecture :** `git mv` du site vers `apps/site` (historique conservé), workspace pnpm à la racine avec config TypeScript / ESLint / Prettier partagée, `packages/shared` vide consommé par le site. Prévisualisation sur un **2ᵉ projet Vercel temporaire** ; la production ne bouge pas avant la fusion.

**Stack :** pnpm workspaces (via corepack) · Next.js 16 / Turbopack · Tailwind v4 · Sanity v5 · ESLint 9 (flat config) · Prettier 3 · GitHub Actions.

**Note de conception :** `docs/plans/2026-11-22-phase1-monorepo-design.md`

## Contraintes globales

- Aucun changement visible sur le site (pages, images, vidéo, Sanity, Studio `/studio`).
- Production Vercel intouchée jusqu'à la fusion validée par l'utilisateur.
- Déplacements de fichiers suivis par Git → `git mv` uniquement.
- Noms : paquet du site `site` (pour `pnpm --filter site`), paquet partagé `@forevercars/shared`, racine `forevercars`.
- Node 20 (CI et local), version de pnpm figée dans `packageManager` par corepack.
- Pas de commande destructrice lancée par Claude : les suppressions (`node_modules`, `.next`) sont faites par l'utilisateur.

## Points de vigilance (non couverts par les tests automatiques)

1. **Fichiers hors Git oubliés** (`.env.local`, vidéo, `RADEK/`) → site sans variables ou image manquante. *Contrôle :* tâche 2, étape 4.
2. **`.gitignore` ancré à la racine** (`/node_modules`, `/.next/`) → `apps/site/.next` ou `node_modules` qui apparaissent dans Git. *Contrôle :* `git status` propre après un build (tâche 3, étape 7).
3. **Assets de `public/`** servis au mauvais chemin. *Contrôle :* `curl -I /videos/hero-video.mp4` → `200` (tâche 3, étape 6).
4. **Sanity Studio sous pnpm** (dépendances strictes) qui ne charge plus. *Contrôle :* `/studio` s'ouvre en local (tâche 3, étape 6), `.npmrc` de secours.
5. **Le projet Vercel de production tente de builder la branche** et échoue. C'est sans impact sur la prod, mais il faut le savoir. *Contrôle :* l'URL de production est inchangée après chaque push (tâche 6).

---

## Arborescence cible

```
forevercars/
├── apps/site/            ← tout le Next.js actuel (app, components, lib, sanity, public, configs)
├── packages/shared/      ← vide pour l'instant (src/index.ts)
├── docs/
├── .github/workflows/ci.yml
├── pnpm-workspace.yaml   package.json   pnpm-lock.yaml
├── tsconfig.base.json    eslint.base.mjs   .prettierrc   .prettierignore
└── .gitignore  .husky/  CLAUDE.md  README.md
```

---

### Tâche 1 : corriger l'erreur de lint existante (commit séparé)

**Fichiers :** modifier `components/stock/VehicleDetailPannel.tsx:30-33`

Le `useEffect` qui remet la galerie à zéro quand le véhicule change déclenche `react-hooks/set-state-in-effect`. **Pas de `key` côté parent** : la clé passerait à `undefined` à la fermeture et casserait l'animation de sortie.

- [ ] **Étape 1 : remplacer l'effet par un ajustement pendant le rendu.** Garder l'id précédent dans un état `prevVehicleId`. Si `vehicle?._id !== prevVehicleId` : mettre à jour `prevVehicleId`, `setCurrentImage(0)`, `setLightboxOpen(false)`. Supprimer l'ancien `useEffect` (garder celui du `popstate`).
- [ ] **Étape 2 : vérifier.** `npx eslint . --quiet` → aucune sortie. `npx tsc --noEmit` → code 0.
- [ ] **Étape 3 : test manuel.** `npm run dev` → `/stock` : ouvrir le véhicule A, aller sur la photo 3, fermer, ouvrir le véhicule B → photo 1 affichée. La sortie du panneau reste animée.
- [ ] **Étape 4 : commit.** `fix(lint): réinitialiser la galerie sans setState dans un effet`

### Tâche 2 : déplacer le site dans `apps/site`

**Fichiers :** `git mv` de `app components lib sanity public next.config.ts postcss.config.mjs tailwind.config.ts tsconfig.json eslint.config.mjs components.json package.json` vers `apps/site/`. Restent à la racine : `.github .husky docs .gitignore .prettierrc .prettierignore CLAUDE.md README.md`. Modifier `.gitignore`. Supprimer `package-lock.json`.

- [ ] **Étape 1 : nettoyage local (par l'utilisateur).** Supprimer `node_modules/`, `.next/`, `tsconfig.tsbuildinfo` et `next-env.d.ts` (tous ignorés par Git, régénérés plus tard).
- [ ] **Étape 2 : `git mv`** (bloc de commandes fourni), puis `git rm package-lock.json`.
- [ ] **Étape 3 : `.gitignore`** : retirer le `/` initial des motifs de dossier (`node_modules`, `.next/`, `out/`, `build`, `coverage`, `.pnp`) pour qu'ils s'appliquent dans `apps/*` et `packages/*` (bloc fourni).
- [ ] **Étape 4 : déplacements à la main (hors Git)** :
  - `.env.local` → `apps/site/.env.local`
  - `public/videos/hero-videos_2.mp4` → `apps/site/public/videos/`
  - `public/images/RADEK/` → `apps/site/public/images/RADEK/`
  - `historique-git.csv` reste à la racine.
  Vérifier qu'il ne reste plus de dossier `public/` à la racine.
- [ ] **Étape 5 : vérifier.** `git status` → uniquement des `renamed:` vers `apps/site/`, plus `deleted: package-lock.json` et `modified: .gitignore`. `git log --follow --oneline apps/site/app/page.tsx` → l'historique d'avant le déplacement est visible.
- [ ] **Étape 6 : commit.** `chore: déplacer le site dans apps/site`. Le site ne se lance pas encore à ce commit : c'est attendu, la tâche 3 le rebranche.

### Tâche 3 : workspace pnpm et configs partagées

**Fichiers :**
- Créer : `pnpm-workspace.yaml` (`packages: ["apps/*", "packages/*"]`), `package.json` racine, `tsconfig.base.json`, `eslint.base.mjs`.
- Modifier : `apps/site/package.json`, `apps/site/tsconfig.json`, `apps/site/eslint.config.mjs`, `.prettierignore` (+ `pnpm-lock.yaml`).

**Interfaces :**
- Produit : `tsconfig.base.json` (strict, `moduleResolution: bundler`, `isolatedModules`, `skipLibCheck`) que tout paquet étend ; `eslint.base.mjs` exporte un tableau de config flat (ignores communs + `eslint-config-prettier`) que chaque paquet importe en premier.
- Racine `package.json` : `private: true`, `name: "forevercars"`, `packageManager` écrit par corepack, scripts `dev` (`pnpm --filter site dev`), `build` / `lint` / `typecheck` (`pnpm -r <script>`), `format`, `prepare: "husky"`. `husky`, `lint-staged`, `prettier`, `eslint-config-prettier` passent en devDependencies racine. `lint-staged` se limite à `prettier --write` : ESLint tourne par paquet (`pnpm -r lint`) et en CI. *Choix de Claude :* ESLint 9 ne trouve pas les configs des sous-dossiers depuis la racine, et le hook pre-commit n'existait de toute façon pas.
- `apps/site/package.json` : `name: "site"` ; retirer les scripts `prepare` et `format*`, le bloc `lint-staged`, et les devDependencies `husky`, `lint-staged`, `prettier` et `eslint-config-prettier` (déplacés à la racine). Les scripts `dev/build/start/lint/typecheck` sont inchangés.

- [ ] **Étape 1 : coller les 4 fichiers racine** (blocs fournis) et adapter les 3 configs du site.
- [ ] **Étape 2 : installer pnpm.** `corepack enable` puis `corepack use pnpm@latest` → le champ `packageManager` apparaît dans le `package.json` racine.
- [ ] **Étape 3 : `pnpm install`.** S'il y a un avertissement « Ignored build scripts » : `pnpm approve-builds` et accepter `sharp`, `esbuild`, `@tailwindcss/oxide` et `unrs-resolver`. Attendu : un seul `pnpm-lock.yaml` à la racine, aucun `package-lock.json`.
- [ ] **Étape 4 : vérifier.** `pnpm lint` et `pnpm typecheck` → 0 erreur.
- [ ] **Étape 5 : `pnpm build`.** Attendu : les mêmes 115 pages statiques générées qu'avant. **Si Sanity échoue** (module introuvable, `styled-components` en double) : ajouter `.npmrc` à la racine avec `public-hoist-pattern[]=*styled-components*` et `public-hoist-pattern[]=*sanity*`, relancer `pnpm install` puis `pnpm build`. En dernier recours : `node-linker=hoisted`. Le choix est noté dans le commit.
- [ ] **Étape 6 : `pnpm dev`.** Contrôler à la main `/`, `/stock`, une fiche `/stock/<slug>`, `/vendu`, `/a-propos`, `/contact` et `/studio` (connexion). `curl -I http://localhost:3000/videos/hero-video.mp4` → `200`.
- [ ] **Étape 7 : `git status`.** Aucun `.next`, `node_modules` ni `.env.local` listé.
- [ ] **Étape 8 : commit.** `chore: workspace pnpm et configs partagées`

### Tâche 4 : `packages/shared` branché au site

**Fichiers :**
- Créer : `packages/shared/package.json`, `packages/shared/tsconfig.json`, `packages/shared/eslint.config.mjs`, `packages/shared/src/index.ts`, `apps/site/app/api/health/route.ts`.
- Modifier : `apps/site/package.json` (`"@forevercars/shared": "workspace:*"`), `apps/site/next.config.ts` (`transpilePackages: ["@forevercars/shared"]`).

**Interfaces :**
- Produit : `@forevercars/shared` exporte la source TS directement (`"exports": { ".": "./src/index.ts" }`, pas d'étape de build), avec les scripts `lint` et `typecheck`. `src/index.ts` exporte `healthStatus(): { ok: true }`.
- `GET /api/health` → `200` avec le JSON `{ "ok": true }`, **et rien d'autre** : ni variable d'environnement ni version. La réponse vient de `healthStatus()`, ce qui prouve que l'import est résolu au runtime, pas seulement au typecheck. À la fin du chantier, on décide de retirer la route ou de la garder comme sonde.

- [ ] **Étape 1 : coller le boilerplate du paquet** (blocs fournis), puis `pnpm install`.
- [ ] **Étape 2 : écrire `healthStatus()` et `route.ts`** : un `GET` qui renvoie `Response.json(healthStatus())`.
- [ ] **Étape 3 : vérifier.** `pnpm typecheck && pnpm lint && pnpm build` → 0 erreur, `/api/health` listée dans les routes. `pnpm dev` puis `curl http://localhost:3000/api/health` → exactement `{"ok":true}`.
- [ ] **Étape 4 : commit.** `feat(shared): paquet partagé vide branché au site`

### Tâche 5 : CI en pnpm

**Fichiers :** modifier `.github/workflows/ci.yml`

Étapes du job : `actions/checkout@v4` → `pnpm/action-setup@v4` (lit `packageManager`) → `actions/setup-node@v4` (`node-version: 20`, `cache: pnpm`) → `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm typecheck` → `pnpm build`. Déclencheurs inchangés.

- [ ] **Étape 1 : coller le workflow** (bloc fourni).
- [ ] **Étape 2 : simuler la CI en local.** `pnpm install --frozen-lockfile && pnpm lint && pnpm typecheck && pnpm build` → tout passe.
- [ ] **Étape 3 : commit.** `ci: passer à pnpm`
- [ ] **Étape 4 : push de la branche (avec l'accord de l'utilisateur).** `git push -u origin chore/monorepo`. Ouvrir une PR vers `main`, en brouillon, sans fusion. Attendu : le job `verify` est vert.

### Tâche 6 : prévisualisation sur un projet Vercel temporaire (action de l'utilisateur)

Claude fournit les réglages, l'utilisateur crée le projet.

- [ ] **Étape 1 : créer le projet** depuis le même dépôt GitHub : Framework = Next.js, **Root Directory = `apps/site`**, « Include files outside the root directory » activé, commandes d'install et de build laissées par défaut (Vercel détecte pnpm via `pnpm-lock.yaml`).
- [ ] **Étape 2 : variables d'environnement** (Preview et Production du projet temporaire) : `NEXT_PUBLIC_SITE_URL` (= l'URL de prod, pour les canonical), `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_ADDRESS`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` (mêmes valeurs que la prod), plus `ENABLE_EXPERIMENTAL_COREPACK=1` pour que Vercel utilise la version de pnpm figée.
- [ ] **Étape 3 : déployer la branche `chore/monorepo`.** Attendu : build vert.
- [ ] **Étape 4 : comparer avec la production**, page par page : `/`, `/stock`, 2 fiches véhicule, `/vendu`, `/a-propos`, `/contact`, `/sitemap.xml`, `/robots.txt`, `/api/health`. Mêmes véhicules, mêmes images, même vidéo. Pour `/studio` sur la préview, ajouter l'origine de la préview dans les CORS Sanity (manage.sanity.io) : optionnel.
- [ ] **Étape 5 : ignorer la branche sur le projet principal.** Avant le premier push, dans Settings → Git → **Ignored Build Step** du projet de production, choisir « Custom » avec la commande :
  `[ "$VERCEL_GIT_COMMIT_REF" = "chore/monorepo" ]`
  Vercel ignore le build quand la commande sort avec le code 0, c'est-à-dire seulement sur cette branche. Les autres branches et `main` se construisent normalement. Sur la PR, le projet principal apparaît « Ignored » au lieu d'un échec.
- [ ] **Étape 6 : contrôle prod.** L'URL de production est inchangée.

## Critères de sortie (validés par l'utilisateur)

- `pnpm -r build`, `pnpm --filter site dev`, `pnpm lint` et `pnpm typecheck` passent en local, et la CI est verte sur la PR.
- La prévisualisation est identique à la production (liste de la tâche 6, étape 4).

## Fusion (seulement après l'OK de l'utilisateur)

1. Projet Vercel principal : Root Directory → `apps/site`, ajouter `ENABLE_EXPERIMENTAL_COREPACK=1`, remettre « Ignored Build Step » sur « Automatic ».
2. Fusionner la PR et vérifier le déploiement de production.
3. Supprimer le projet Vercel temporaire.

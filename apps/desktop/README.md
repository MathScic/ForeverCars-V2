# ForeverCars Back-Office (ébauche)

Application Electron du garage. **Ébauche avec données de démo** : rien n'est envoyé au site ni à Supabase.

## Lancer

- Double-clic sur `Lancer-BackOffice.cmd` à la racine du dépôt, ou
- `pnpm dev:desktop` depuis la racine (rechargement à chaud pendant le développement).

## Ce qui marche déjà

- Tableau de bord du parc : indicateurs, filtres par statut, recherche, coup de cœur, publier, marquer vendu, supprimer (admin), journal d'activité.
- Assistant de mise en vente en 4 étapes (fiche, photos, prix et description, aperçu de la carte du site) avec brouillon enregistré à chaque étape.
- Rôle simulé admin / vendeur : le vendeur ne voit ni coûts ni marge et ne peut pas supprimer.
- Fenêtre sécurisée : `contextIsolation`, `sandbox`, pas de Node dans l'interface, CSP stricte, canaux IPC sur liste blanche validés par Zod.

## Ce qui est simulé (phases suivantes du plan)

| Simulé ici | Remplacé par |
| --- | --- |
| Données dans le stockage local de l'app | Supabase + SQLite + synchronisation (phases 2 et 5) |
| Sélecteur de rôle | Connexion Supabase Auth + RLS (phases 2 et 6) |
| « Publier » change seulement le statut | Logique de publication + revalidation du site (phases 7 et 9) |
| Photos gardées en mémoire | Pipeline sharp dans le process main (phase 7) |
| Carte d'aperçu recopiée du site | Vrai composant partagé (phase 7) |

## Commandes

```
pnpm --filter desktop dev        # développement
pnpm --filter desktop test       # tests unitaires (Vitest)
pnpm --filter desktop e2e        # build + tests de bout en bout (Playwright + Electron)
pnpm --filter desktop typecheck
pnpm --filter desktop lint
```

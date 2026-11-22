# Plan — Back-office desktop ForeverCars (Electron)

> Les règles permanentes (façon de travailler, architecture, sécurité, charte) sont dans `CLAUDE.md`, à la racine.
> Une phase à la fois : on ne passe à la suivante qu'une fois ses critères de sortie validés.
> Ordre : 1 → 1 bis → 2 → … → 10.

## Phases

Chaque phase : **objectif → étapes → tests → critères de sortie**. Commence chaque phase par un schéma de ce qu'on va construire.

### Phase 1 — Migration en monorepo (sans rien casser)

Objectif : déplacer le site dans `apps/site`, à fonctionnement identique.

1. Créer une branche `chore/monorepo`.
2. `pnpm-workspace.yaml`, `package.json` racine, `tsconfig.base.json`, ESLint et Prettier partagés (bloc à coller).
3. Déplacer le Next.js dans `apps/site` avec `git mv` pour garder l'historique.
4. Mettre à jour Vercel : Root Directory = `apps/site`, commande d'installation pnpm.
5. Créer `packages/shared` vide, importé par le site pour vérifier que le câblage fonctionne.

Tests : `pnpm -r build`, `pnpm --filter site dev`, puis un déploiement de prévisualisation Vercel sur la branche.
Sortie : le site de prévisualisation est identique à la production (pages, images, Sanity encore branché). Fusion seulement après mon OK.

### Phase 1 bis — Charte ForeverCars partagée

Objectif : extraire la charte du site et la rendre réutilisable (règles complètes dans `CLAUDE.md`, section « Charte »).

1. Audit de `apps/site` : polices, couleurs, rayons, ombres, espacements, composants de référence, logo, ton éditorial.
2. Rédaction de `docs/CHARTE.md`, puis **présentation pour validation**.
3. `packages/design` : `tokens.ts`, `tailwind-preset.ts`, polices auto-hébergées.
4. Le site passe sur le preset, sans aucun changement visuel.

Tests : captures Playwright du site (accueil, liste, fiche véhicule) avant et après, avec un écart visuel nul.
Sortie : `docs/CHARTE.md` validé par moi et le site toujours identique en prévisualisation.

### Phase 2 — Base Supabase : schéma, rôles, RLS

Objectif : la base qui remplacera Sanity.

```
profiles(id → auth.users, full_name, role: admin|seller)
vehicles(id, slug, plate, brand, model, version, year, first_registration,
         fuel, gearbox, power_hp, fiscal_hp, color, body, critair, mileage,
         owners, warranty_months, price, description, equipment text[],
         status: draft|online|sold, is_featured, published_at, sold_at,
         created_by, updated_by, created_at, updated_at, version int)
vehicle_photos(id, vehicle_id, storage_path, position, is_cover, width, height)
vehicle_costs(vehicle_id PK, purchase_price, repair_cost)   ← admin seulement
activity_log(id, actor_id, action, entity, entity_id, payload jsonb, created_at)
```

1. Migrations SQL dans `supabase/migrations` (une migration par table, enums à part).
2. Trigger `updated_at`, incrément de `version` (sert à détecter les conflits de synchronisation), slug unique.
3. Fonctions `is_admin()` / `current_role()` en `security definer`.
4. Politiques RLS :
   - `anon` : lecture des `vehicles` en `online` et de leurs photos, rien d'autre.
   - `seller` : lecture de tout sauf `vehicle_costs`, création et modification de véhicules et de photos, pas de suppression.
   - `admin` : tout.
   - `activity_log` : insertion par tout utilisateur connecté, lecture par admin, aucune modification ni suppression.
5. Bucket Storage `vehicle-photos` : lecture publique, écriture réservée aux utilisateurs authentifiés.
6. Seed : 1 admin, 1 vendeur, 4 véhicules de démo (bloc à coller).
7. Générer les types (`supabase gen types`) dans `packages/shared`.

Tests (obligatoires) : tests RLS dans `supabase/tests` en se connectant tour à tour en `anon`, `seller` et `admin`. Il faut au minimum vérifier qu'`anon` ne voit pas les brouillons, que `seller` ne lit pas `vehicle_costs` et ne supprime pas, et que personne ne modifie `activity_log`.
Sortie : `supabase db reset` + les tests passent au vert en local.

### Phase 3 — packages/shared

1. Schémas Zod : `VehicleInput`, `VehicleUpdate`, `PhotoMeta`, `Role`, `OutboxOperation`.
2. Client Supabase typé (fabrique qui prend l'URL et la clé `anon`).
3. Utilitaires purs : formatage prix et kilométrage (fr-FR), slug, calcul de marge.

Tests : Vitest à 100 % sur les utilitaires et les schémas (cas valides et invalides).
Sortie : le site et le desktop importent `@forevercars/shared` sans erreur de types.

### Phase 4 — Squelette Electron sécurisé

1. `apps/desktop` avec electron-vite (React + TS + Tailwind), configuration de la section 3 appliquée.
2. Preload avec une API typée minimale : `app.version()`, `net.status()`.
3. Indicateur en ligne / hors-ligne dans l'interface (événements `online`/`offline` + ping Supabase).

Tests : Playwright `_electron.launch` : la fenêtre s'ouvre, le titre est correct, `window.require` est indéfini dans le renderer (preuve de l'isolation).
Sortie : `pnpm --filter desktop dev` lance l'app, le test e2e passe.

### Phase 5 — Couche locale et synchronisation

```
Action utilisateur ─▶ SQLite (écriture immédiate) ─▶ outbox
                                                     │ en ligne ?
                                         oui ◀───────┴──────▶ non : attend
                                          │
                          rejoue vers Supabase (ordre FIFO, idempotent)
                                          │
                 conflit (version distante > locale) ─▶ on garde le serveur
                                                        + on signale à l'utilisateur
```

1. Schéma SQLite miroir (véhicules, photos, outbox, meta de sync), avec migrations versionnées.
2. Repository local : CRUD véhicule qui écrit dans SQLite et ajoute l'opération à l'outbox, dans une seule transaction.
3. Moteur de sync dans le process main : envoi de l'outbox (avec réessais et backoff), puis récupération des changements distants depuis `updated_at`, puis abonnement Supabase Realtime pour les autres postes.
4. Gestion des conflits par la colonne `version` : le serveur gagne et l'utilisateur est prévenu.
5. Exposition IPC : `vehicles.list/get/create/update/delete`, `sync.status`, `sync.now`.

Tests :
- Vitest sur le moteur de sync avec un faux client Supabase : rejeu dans l'ordre, idempotence (une opération rejouée deux fois ne crée pas de doublon), conflit, coupure au milieu d'un lot.
- Intégration avec Supabase local : création hors-ligne, retour en ligne, véhicule présent en base.

Sortie : je coupe le Wi-Fi, je crée deux véhicules, je rallume : ils sont dans Supabase et apparaissent sur un deuxième poste.

### Phase 6 — Auth et rôles dans l'app

1. Écran de connexion (Supabase Auth), session stockée avec `safeStorage`.
2. Hors-ligne : réouverture possible avec la dernière session valide, en lecture et écriture locale.
3. Garde de routes et masquage d'interface selon le rôle (la vraie protection reste la RLS de la phase 2).
4. Écran admin « Équipe » : inviter un employé et changer son rôle, via une Edge Function protégée (admin seulement).

Tests : e2e Playwright en `seller` (pas de prix d'achat, pas de bouton supprimer) et en `admin`.
Sortie : un vendeur ne voit jamais `vehicle_costs`, même en forçant un appel IPC à la main.

### Phase 7 — Interface parc et assistant de mise en vente

Reprendre le prototype validé (dashboard, assistant en 4 étapes, page de succès) **habillé avec la charte de `packages/design`**. La carte « aperçu sur forevercars.fr » réutilise le vrai composant du site. Un composant par fichier, 100 lignes maximum.

1. Dashboard : KPI, filtres par statut, recherche, actions (mise en avant, vendu, publier un brouillon, supprimer pour l'admin), journal d'activité.
2. Assistant, étape 1 : plaque et fiche véhicule. Le module SIV (payant) est derrière une interface `PlateLookup`, avec une implémentation « saisie manuelle » par défaut.
3. Étape 2 : photos par glisser-déposer de fichiers ou d'un dossier. Dans le main avec sharp : rotation EXIF, 1600 px de large maximum, compression, filigrane, miniature. Choix de la couverture et ordre par glisser-déposer. Upload vers Storage via l'outbox.
4. Étape 3 : prix, coûts internes (admin), équipements, description, mise en avant.
5. Étape 4 : aperçu de la carte du site, fiche vitrine, publication.
6. Brouillon automatique à chaque étape (rien ne se perd si l'app se ferme).

Tests : unitaires sur le pipeline photo (dimensions, poids, filigrane présent) ; e2e du parcours complet de mise en vente, en ligne puis hors-ligne.
Sortie : je mets 3 véhicules en vente de bout en bout sans toucher à Sanity.

### Phase 8 — Fonctions annexes

1. **Fiche vitrine A4** : gabarit React dédié aux couleurs, polices et logo de la charte, `webContents.printToPDF`, QR code vers l'URL de l'annonce, impression directe ou export PDF.
2. **Préparer pour Leboncoin / La Centrale** : titre et description formatés copiés dans le presse-papiers, et dossier de photos exporté dans le bon ordre. **Aucune automatisation du site Leboncoin** (contraire à leurs conditions). La publication reste manuelle sur le Compte Pro.
3. **Description par IA** : bouton qui appelle une Edge Function (la clé reste côté serveur), avec texte modifiable et sans publication automatique.
4. **Sauvegardes** : export chiffré planifié (base locale + photos) vers un dossier choisi (OneDrive, NAS, disque externe), rotation des 7 dernières, et restauration testée.

Tests : génération du PDF (le fichier existe, une page A4) ; une sauvegarde puis une restauration redonnent les mêmes données.
Sortie : une fiche imprimée correcte, une restauration réussie sur une base vide.

### Phase 9 — Bascule du site vers Supabase et retrait de Sanity

```
Sanity ──script de migration──▶ Supabase (véhicules + photos)
                                    │
Site Next.js : lit Supabase ◀───────┘  + revalidation à la demande
```

1. Script de migration idempotent (relançable) : export Sanity, mapping des champs, téléchargement puis upload des images, rapport des écarts.
2. Site : remplacer les requêtes GROQ par des requêtes Supabase (lecture `anon`), avec les mêmes URLs et les mêmes slugs pour le SEO.
3. Route `POST /api/revalidate` protégée par un secret, appelée par une Edge Function ou un webhook de base à chaque publication, modification ou vente.
4. Période en parallèle : site sur Supabase en prévisualisation, Sanity intact en production.
5. Bascule après mon OK, puis retrait de Sanity (dépendances, `/studio`, variables d'environnement).

Tests : Playwright de non-régression sur le site (accueil, liste, fiche véhicule, mise en avant, 404 d'un véhicule vendu ou retiré, metadata SEO) ; comparaison du nombre de véhicules avant et après la migration.
Sortie : en production, une publication depuis l'app apparaît sur le site en moins d'une minute.

### Phase 10 — Packaging, mises à jour et CI

1. electron-builder : installeur Windows, icône tirée du logo du site, nom « ForeverCars Back-Office », raccourci sur le bureau.
2. electron-updater via les GitHub Releases. Prévenir du coût et de l'intérêt d'un certificat de signature de code (avertissement SmartScreen sinon).
3. GitHub Actions : à chaque PR, lint, typecheck, Vitest, tests RLS (Supabase local) et e2e du site ; sur un tag, build de l'installeur et release.
4. Journaux de l'app (electron-log) avec un bouton « Envoyer un rapport » (sans données sensibles).

Sortie : installation sur le PC du garage depuis l'installeur, puis mise à jour automatique vers une version suivante.

---

## Recette finale (checklist manuelle sur le PC du garage)

- [ ] Installation, connexion admin, connexion vendeur.
- [ ] Mise en vente complète de 3 véhicules (photos réelles depuis un dossier).
- [ ] Coupure internet : création, modification, vente, puis retour en ligne et synchronisation correcte.
- [ ] Deux postes en même temps : une modification sur l'un apparaît sur l'autre ; un conflit est signalé.
- [ ] Le vendeur ne voit ni marge ni prix d'achat, et ne peut pas supprimer.
- [ ] Fiche vitrine imprimée et QR code fonctionnel.
- [ ] Préparation Leboncoin : texte et photos prêts à coller.
- [ ] Sauvegarde puis restauration.
- [ ] Le site est à jour moins d'une minute après chaque action.
- [ ] Fermeture brutale de l'app pendant un import : rien de perdu ni de corrompu.

---

## Pour démarrer

Lis `CLAUDE.md`, puis commence par la **phase 1**. Donne-moi :
1. le schéma de l'arborescence cible ;
2. la liste ordonnée des étapes de la phase avec ce que je dois vérifier après chacune ;
3. le premier bloc de configuration à coller.

Puis attends mon OK.

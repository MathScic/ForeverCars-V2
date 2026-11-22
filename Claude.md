@docs/backoffice-regles.md

# 🚗 FOREVERCARS - Documentation Projet

> **Agence d'achat et revente de véhicules - Zone géographique : Loiret (45)**  
> _"Tu t'occupes de rien, je m'occupe de tout"_

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Charte graphique](#charte-graphique)
3. [Architecture du site](#architecture-du-site)
4. [Stack technique](#stack-technique)
5. [Fonctionnalités](#fonctionnalités)
6. [Structure des fichiers](#structure-des-fichiers)
7. [Roadmap de développement](#roadmap-de-développement)
8. [Déploiement](#déploiement)

---

## 🎯 VUE D'ENSEMBLE

### Concept

ForeverCars est une agence moderne d'achat et revente de véhicules mid-game avec ambition haut de gamme. Le site doit refléter professionnalisme, confiance et expertise automobile.

### Objectifs du site

- Présenter les véhicules disponibles de manière attractive
- Faciliter la prise de contact
- Expliquer clairement les services proposés
- Construire la confiance avec une image professionnelle
- Se démarquer de la concurrence avec un design unique

### Public cible

- Particuliers cherchant à acheter un véhicule mid-game
- Clients souhaitant revendre leur véhicule
- Futurs clients premium (évolution)

---

## 🎨 CHARTE GRAPHIQUE

### Palette de couleurs

```
Couleur principale (Noir)    : #0A0A0A
Couleur accent (Orange)      : #FF8C42
Couleur secondaire (Blanc)   : #FFFFFF
Gris foncé (Texte/BG)        : #1A1A1A
Gris moyen                   : #404040
Gris clair                   : #E5E5E5
```

### Typographie

**Titres (Headings)**

- Police : **Orbitron** (Google Fonts)
- Poids : Bold (700), ExtraBold (800)
- Usage : Titres principaux, navigation, boutons CTA

**Corps de texte**

- Police : **Inter** (Google Fonts)
- Poids : Regular (400), Medium (500), SemiBold (600)
- Usage : Paragraphes, descriptions, formulaires

**Hiérarchie typographique**

```
H1 : 48px (mobile: 32px) - Orbitron Bold
H2 : 36px (mobile: 28px) - Orbitron Bold
H3 : 28px (mobile: 24px) - Orbitron SemiBold
H4 : 24px (mobile: 20px) - Inter SemiBold
Body : 16px - Inter Regular
Small : 14px - Inter Regular
```

### Style visuel

**Identité : Garage Moderne**

- Design épuré avec touches industrielles
- Espaces généreux (breathing room)
- Grilles asymétriques pour dynamisme
- Photos de véhicules en grand format
- Effets de hover subtils mais présents
- Dark mode par défaut avec accents orange

**Éléments graphiques**

- Lignes fines orange pour séparer les sections
- Cartes avec bordures subtiles
- Ombres douces pour la profondeur
- Icônes outline minimalistes
- Animations fluides (transitions 300ms)

**Inspiration style**

- Mélange showroom moderne + atelier high-tech
- Référence : sites comme Carvana (simplifié), Vroom, AutoScout24

---

## 🏗️ ARCHITECTURE DU SITE

### Pages (5 pages principales)

#### 1. **Accueil** (`/`)

**Sections :**

- Hero : Slogan percutant + CTA "Voir le stock"
- Proposition de valeur (3 piliers : Expertise, Transparence, Accompagnement)
- Véhicules en vedette (3-4 véhicules mis en avant)
- Comment ça marche (processus en 4 étapes)
- Témoignages clients (section sociale proof)
- CTA final contact

#### 2. **Notre Stock** (`/stock`)

**Sections :**

- Filtres personnalisables (sidebar ou top)
- Grille de véhicules (cards responsive)
- Pagination
- Tri (prix, date, kilométrage)
- Badge "Nouveau" / "Coup de cœur"

#### 3. **Nos Services** (`/services`)

**Sections :**

- Introduction services
- Achat sur mesure (recherche du véhicule idéal)
- Revente de véhicule (estimation, gestion)
- Expertise automobile
- Accompagnement administratif
- Zone d'intervention (Loiret 45)

#### 4. **À Propos** (`/a-propos`)

**Sections :**

- Histoire de ForeverCars
- Valeurs et mission
- Expertise du fondateur
- Engagement qualité
- Photos de l'équipe/garage

#### 5. **Contact** (`/contact`)

**Sections :**

- Formulaire de contact (nom, email, tel, message, type demande)
- Informations pratiques (téléphone, email, horaires)
- Zone d'intervention
- Réseaux sociaux

---

## ⚙️ STACK TECHNIQUE

### Frontend

- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icons** : Lucide React
- **Fonts** : Google Fonts (Orbitron + Inter)

### Composants UI

- Composants custom (pas de bibliothèque UI externe pour originalité)
- Design system cohérent

### Gestion d'état

- React Context (si nécessaire)
- useState/useReducer pour états locaux

### Formulaires

- React Hook Form
- Validation avec Zod

### Images

- Next.js Image component (optimisation automatique)
- Placeholders pour véhicules (en attendant vraies photos)

---

## 🚀 FONCTIONNALITÉS

### Phase 1 - MVP (Priorité haute)

#### ✅ Catalogue véhicules

- Affichage grille responsive
- Filtres personnalisables :
  - Marque (dropdown multi-select)
  - Prix (slider min-max)
  - Année (slider ou input)
  - Kilométrage (slider min-max)
  - Carburant (essence, diesel, hybride, électrique)
  - Boîte de vitesse (manuelle, automatique)
  - Type de véhicule (berline, SUV, coupé, etc.)
- Tri (prix croissant/décroissant, km, date)
- Recherche textuelle
- Badge "Nouveau" (< 7 jours)

#### ✅ Pages véhicules détaillées

- Galerie photos (lightbox)
- Caractéristiques techniques complètes
- Description détaillée
- Prix bien visible
- Bouton CTA "Me contacter pour ce véhicule"

#### ✅ Formulaire de contact

- Champs : nom, prénom, email, téléphone, message, type de demande
- Validation côté client
- Messages d'erreur clairs
- Confirmation d'envoi

#### ✅ Responsive Design

- Mobile-first approach
- Breakpoints :
  - Mobile : < 640px
  - Tablet : 640px - 1024px
  - Desktop : > 1024px
  - Large : > 1440px

#### ✅ SEO

- Métadonnées optimisées
- Structure sémantique HTML
- Sitemap.xml
- Robots.txt
- Schema.org markup

### Phase 2 - Évolutions futures (Priorité moyenne)

- 🔄 Système de favoris (localStorage)
- 🔄 Comparateur de véhicules (max 3)
- 🔄 Demande de financement (formulaire dédié)
- 🔄 Estimation de reprise (formulaire)
- 🔄 Blog/Actualités
- 🔄 Espace client (historique demandes)

### Phase 3 - Premium (Long terme)

- 🔮 Intégration CMS (Sanity/Contentful)
- 🔮 Back-office gestion stock
- 🔮 Système de réservation en ligne
- 🔮 Chat en direct
- 🔮 Vidéos 360° des véhicules
- 🔮 Calculateur de financement

---

## 📁 STRUCTURE DES FICHIERS

```
forevercars/
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-bg.jpg
│   │   └── placeholders/
│   └── fonts/ (si locaux)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx (Layout global)
│   │   ├── page.tsx (Accueil)
│   │   ├── globals.css
│   │   ├── stock/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx (Détail véhicule)
│   │   ├── services/
│   │   │   └── page.tsx
│   │   ├── a-propos/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── FeaturedVehicles.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   └── ValueProposition.tsx
│   │   ├── stock/
│   │   │   ├── VehicleCard.tsx
│   │   │   ├── VehicleFilters.tsx
│   │   │   ├── VehicleGrid.tsx
│   │   │   └── VehicleDetail.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Modal.tsx
│   │   └── forms/
│   │       └── ContactForm.tsx
│   │
│   ├── lib/
│   │   ├── data/
│   │   │   └── vehicles.ts (données mock)
│   │   ├── types/
│   │   │   └── vehicle.ts
│   │   └── utils/
│   │       └── helpers.ts
│   │
│   └── styles/
│       └── (fichiers Tailwind custom si besoin)
│
├── .env.local (variables d'environnement)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── CLAUDE.md (ce fichier)
```

---

## 🗺️ ROADMAP DE DÉVELOPPEMENT

### Sprint 1 : Fondations (Semaine 1)

- [x] Setup projet Next.js + TypeScript
- [x] Configuration Tailwind CSS
- [x] Création CLAUDE.md
- [ ] Intégration fonts (Orbitron + Inter)
- [ ] Création composants UI de base (Button, Input, Card, Badge)
- [ ] Layout global (Header + Footer)
- [ ] System de couleurs Tailwind

### Sprint 2 : Page d'accueil (Semaine 1-2)

- [ ] Section Hero
- [ ] Section Proposition de valeur
- [ ] Section Véhicules en vedette
- [ ] Section Comment ça marche
- [ ] Section CTA final
- [ ] Responsive mobile/tablet

### Sprint 3 : Catalogue (Semaine 2-3)

- [ ] Création types TypeScript (Vehicle)
- [ ] Données mock véhicules
- [ ] Page /stock
- [ ] Composant VehicleCard
- [ ] Système de filtres
- [ ] Tri et pagination
- [ ] Page détail véhicule /stock/[id]

### Sprint 4 : Pages secondaires (Semaine 3)

- [ ] Page Services
- [ ] Page À propos
- [ ] Page Contact avec formulaire
- [ ] Validation formulaire

### Sprint 5 : Finitions (Semaine 4)

- [ ] Animations Framer Motion
- [ ] Optimisation SEO
- [ ] Tests responsive tous devices
- [ ] Performance optimization
- [ ] Accessibilité (a11y)

### Sprint 6 : Déploiement (Semaine 4)

- [ ] Configuration Vercel
- [ ] Variables d'environnement
- [ ] Tests production
- [ ] Documentation déploiement

---

## 🚀 DÉPLOIEMENT

### Plateforme : Vercel

**Configuration**

```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel

# Production
vercel --prod
```

**Variables d'environnement**

```env
NEXT_PUBLIC_SITE_URL=https://forevercars.fr
NEXT_PUBLIC_CONTACT_EMAIL=contact@forevercars.fr
NEXT_PUBLIC_PHONE=+33...
```

**Domaine personnalisé**

- Configuration DNS
- SSL automatique via Vercel

---

## 📝 NOTES IMPORTANTES

### Données véhicules (Structure type)

```typescript
interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: "essence" | "diesel" | "hybride" | "electrique";
  transmission: "manuelle" | "automatique";
  type: "berline" | "suv" | "coupe" | "break" | "citadine" | "utilitaire";
  power: number; // chevaux
  images: string[];
  description: string;
  features: string[];
  isNew: boolean; // Badge "Nouveau"
  isFeatured: boolean; // Mis en avant sur l'accueil
  createdAt: Date;
}
```

### Filtres personnalisables

Les filtres doivent être flexibles pour permettre :

- Ajout facile de nouvelles marques
- Modification des tranches de prix
- Ajout de nouveaux types de véhicules
- Extension future (couleur, nombre de portes, etc.)

### Accessibilité

- Contraste WCAG AA minimum
- Navigation clavier complète
- Attributs ARIA appropriés
- Focus visible sur tous les éléments interactifs

### Performance

- Images optimisées (Next.js Image)
- Lazy loading
- Code splitting automatique (Next.js)
- Lighthouse score > 90

---

## 🔗 RESSOURCES

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Fonts](https://fonts.google.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 📞 CONTACT PROJET

**Client** : ForeverCars  
**Zone** : Loiret (45)  
**Slogan** : _"Tu s'occupes de rien, je s'occupe de tout"_

---

**Dernière mise à jour** : 18 janvier 2026  
**Version** : 1.0.0  
**Statut** : 🚧 En développement

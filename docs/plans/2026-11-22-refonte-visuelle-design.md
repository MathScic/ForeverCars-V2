# Refonte visuelle « Showroom Nocturne » : note de conception

## Pourquoi
Donner à ForeverCars une image **actuelle, luxe, neuve**, « digne d'un bon design », à la place d'un site
qui ressemble à un modèle générique. Même identité pour le site et le back-office.

## Direction choisie : 1. Showroom Nocturne (22/11/2026)
*« Chaque voiture présentée comme dans le showroom d'une grande marque, le soir. »*

| | |
| --- | --- |
| Palette | noir carbone `#0A0A0B`, graphite `#151518`, ivoire `#F4F1EA` (texte), argent `#9A9AA2` (texte secondaire), **orange ForeverCars `#FF8C42` rare** : prix, actions, filet lumineux |
| Typo | titres **Archivo** en largeur étendue (capitales espacées pour les surtitres), texte **Inter** |
| Formes | angles nets (2 à 4 px), filets de 1 px, grandes marges, grilles asymétriques, photo plein cadre |
| Photos | fond sombre, lumière de studio, trois-quarts avant (dans l'esprit des photos actuelles du garage) |
| Animations | lentes et fluides : révélation des photos par rideau, profondeur au défilement, chiffres qui se posent en ressort sans rebond ; `prefers-reduced-motion` respecté |
| Logo | inchangé (blanc + « CARS » orange), fait pour fond sombre |

Approches écartées : « Galerie Blanche » (thème clair, demande des photos détourées et un logo noir),
« Maison de Loire » (s'éloigne du noir et orange de la marque).

## Contraintes
- Aucun changement de contenu, d'URL, de slug ni de métadonnées SEO sur le site.
- Contraste AA, focus clavier visible, cibles ≥ 44 px, mouvement réduit respecté.
- Lighthouse performance ≥ 90 sur mobile (vidéo du hero de 8 Mo à optimiser).
- Polices auto-hébergées en production (aucune requête Google Fonts).
- Les noms en majuscules saisis dans Sanity deviennent un **choix assumé** : capitales étendues et espacées.

## Étape suivante
Maquettes HTML (accueil, stock, fiche véhicule, tableau de bord du back-office) avec les vrais véhicules
et les vrais textes du site, à valider avant d'écrire les tokens et le plan d'application.

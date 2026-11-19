# Optique Vision Moderne — site vitrine

Site statique HTML/CSS/JS (aucune dépendance, aucun paiement en ligne) pour l'opticien **Optique Vision Moderne**, Cotonou.

## Ouvrir / héberger

Ouvrez `index.html` dans un navigateur. Pour un rendu proche de la production :

```bash
npx serve .
```

Hébergement gratuit : glissez le dossier sur **Netlify Drop** (app.netlify.com/drop), ou importez-le dans **Vercel** / **GitHub Pages**.

## Pages

- `index.html` — accueil : hero, maison, collections, sélection, services, agences, RDV
- `catalogue.html` — 16 modèles, filtres vue/solaire/public, recherche, fiche produit
- `services.html` — prestations, parcours en 4 étapes, verres, FAQ
- `agences.html` — Cadjèhoun & Steinmetz, horaires, cartes, itinéraires
- `rendez-vous.html` — formulaire → message WhatsApp pré-rempli

## À personnaliser avant publication

1. **Téléphone / WhatsApp** : ouvrez `assets/js/main.js` et modifiez l'objet `CONFIG` (lignes 16–20).
   Remplacez aussi `22901000000` et `+22901000000` dans les pages HTML par le numéro réel (recherche/remplacement global).
   Plus simple : `node _tools/set-phone.js 22997000000 "+229 97 00 00 00"` met à jour tout le site.
2. **Horaires** : actuellement lun.–ven. 8h30–19h, sam. 9h–18h, dim. fermé. À confirmer avec le gérant.3. **Photos** : les visuels de `assets/img/` viennent du modèle scrapé. Remplacez-les par les photos réelles des boutiques et des montures (mêmes noms de fichiers, format paysage 3:2 pour les produits).
4. **Modèles** : chaque carte de `catalogue.html` contient `data-name`, `data-material`, `data-desc`… Dupliquez une carte pour ajouter un modèle.
5. **Google Maps** : les liens utilisent une recherche par nom. Remplacez-les par les fiches Google Business exactes si nécessaire.

## Notes

- Aucun panier, aucun prix affiché : les CTA ouvrent WhatsApp avec un message contextualisé. C'est volontaire.
- Les images sont chargées en lazy loading ; en capture d'écran pleine page, certaines peuvent apparaître vides.
- `_tools/` sert à régénérer les pages intérieures (`node _tools/build-pages.js`). Ce dossier n'est pas nécessaire en production.

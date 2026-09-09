# Décisions de refonte — GOLD MINES

Ce fichier documente les choix pris quand le cahier des charges de refonte
("PROMPT DE REFONTE COMPLÈTE") ne pouvait pas s'appliquer littéralement,
parce que ce projet est un thème Shopify (Liquid/OS 2.0) et non une
application JS sur-mesure (Next.js, routing custom, TypeScript, etc.).

## 1. Stack

Le cahier des charges est écrit pour une stack générique (framework JS,
i18n en fichiers, TypeScript strict, tests unitaires/e2e, Lighthouse CI).
Ce projet est un thème Shopify OS 2.0 : Liquid, JSON templates, CSS/JS
vanilla. Les équivalents Shopify sont utilisés partout où c'est possible :

- **Routing** → géré nativement par Shopify (`/collections/*`, `/products/*`).
- **State des filtres dans l'URL** → déjà natif via les formulaires GET
  Shopify (`filter.v.option.*`, `filter.p.price.gte`…) : partageable,
  rechargeable, bouton retour fonctionnel, marche même sans JavaScript.
- **i18n** → `locales/fr.default.json` / `locales/en.json`, déjà en place.
- **TypeScript strict** → non applicable (Liquid + JS vanilla). Le JS est
  gardé simple, sans dépendance, avec des noms de fonctions explicites.
- **Tests unitaires/e2e** → pas d'équivalent standard sur un thème Liquid.
  Remplacés par : validation Shopify (schema/Liquid) systématique avant
  chaque upload, et une checklist de vérification manuelle par parcours.
- **Lighthouse CI** → pas de pipeline CI sur ce projet. Les bonnes
  pratiques de perf (lazy-loading, `aspect-ratio`, `srcset`, polices
  préchargées) sont appliquées à la main, sans rapport automatisé.

## 2. Comptes clients

Le cahier des charges décrit un écran de connexion/création sur-mesure
(deux onglets, image éditoriale, règles de mot de passe affichées).
**Décision : on garde le système de comptes natif Shopify**, sans le
recoder. Recoder l'authentification reviendrait à gérer nous-mêmes des
mots de passe et sessions — risque de sécurité inutile, et interdit de
toute façon par les scopes de l'API. La page `main-account.liquid`
redirige vers les vrais écrans Shopify (comptes classiques ou comptes
client nouvelle génération selon ce qui est activé dans la boutique).

## 3. Prise de rendez-vous

Shopify n'a pas de module de disponibilités/calendrier natif. Fabriquer
de fausses disponibilités violerait la règle "aucune donnée factice".

**Décision (validée avec le client le 09/09) : on garde un formulaire de
demande de rendez-vous simple**, sans calendrier temps réel. Le client
confirme le créneau par téléphone/e-mail après réception de la demande.
Si le besoin d'un vrai calendrier apparaît plus tard, deux options
existeront : intégrer un widget externe (Calendly ou équivalent) ou
installer une app Shopify dédiée (ex. Appointo, Tocada) — les deux
impliquent un compte/abonnement tiers, donc une décision business, pas
une décision technique.

## 4. Avis clients et presse

Le cahier des charges demande une section "Vu dans la presse" et une
section avis clients. **Le client n'a ni logos de presse réels ni avis
clients réels aujourd'hui.**

**Décision (validée avec le client le 09/09) : les sections sont créées
avec une structure complète et configurable depuis l'éditeur de thème
(blocs répétables : logo + lien pour la presse, note + texte + auteur
pour les avis), mais sans contenu par défaut.** Elles n'apparaissent pas
tant qu'aucun bloc n'est configuré (pas de bloc vide affiché). Le client
les remplira lui-même avec ses vrais avis/logos quand il en aura.

## 5. Assets

Aucune image ni texte n'a été copié d'un autre site. Les 5 photos de
substitution (accueil, bague, alliance, coffret, atelier) ont été
**générées par IA** à la demande du client pour visualiser la mise en
page en attendant les photos définitives — elles sont clairement
temporaires et devront être remplacées par de vraies photos produit
avant la mise en ligne publique.

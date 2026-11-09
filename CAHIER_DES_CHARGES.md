# Jour 23/30 — Anti-UX, le musée des erreurs d'interface

> Stack : **JavaScript**, **CSS** (sans framework) · hébergement **Coolify**, sous-domaine `anti-ux.projectp.fr`.
> Durée visée : **2 h 45** pour le MVP, les bonus ensuite.
> **Mobile first** : on conçoit d'abord pour un téléphone, puis on élargit.

Ce document est notre contrat : on le suit étape par étape, et toute décision qui s'en écarte est d'abord notée ici. Il s'ajuste au début de la journée.

## 1. L'idée

Un site qui apprend l'UX **par l'absurde**. **Anti-UX** est un musée : chaque salle regroupe une famille d'erreurs (boutons, champs de texte, formulaires, navigation, retours visuels, lisibilité, pièges commerciaux), et chaque œuvre exposée est un **spécimen** qu'on peut essayer pour de vrai : un bouton qui ne réagit pas, un champ qui efface tout à la première erreur, une bannière de cookies impossible à refuser.

Après avoir subi le spécimen, le visiteur appuie sur **« Réparer »** : la même interface réapparaît, corrigée, avec l'explication de ce qui n'allait pas et la règle à retenir.

Le paradoxe du projet, et sa règle d'or : **les spécimens sont ratés exprès, le musée qui les expose doit être irréprochable.** La navigation, la typographie, le clavier, les contrastes et le mobile du site lui-même servent d'exemple à suivre.

## 2. MVP — ce qui doit fonctionner à la fin

1. **Page d'accueil** : présentation du musée en une phrase, plan des salles, appel à l'action « Entrer dans le musée ».
2. **Sept salles**, chacune avec au moins **quatre spécimens** (voir section 3), soit 28 spécimens minimum.
3. **Chaque spécimen suit la même fiche** :
   - **Le piège** : la version ratée, interactive, dans un cadre bien délimité.
   - **Réparer** : un interrupteur qui bascule vers la version corrigée, au même endroit, pour comparer.
   - **Pourquoi ça ne va pas** : deux ou trois phrases, sans jargon.
   - **La règle à retenir** : une phrase, plus la référence (heuristique de Nielsen, critère WCAG 2.2, loi de Fitts, loi de Hick…).
4. **Le Frustromètre** : une jauge discrète qui compte les clics rageurs (plusieurs clics rapides au même endroit), les fautes de saisie provoquées et le temps perdu. Elle se remplit pendant la visite et se partage à la fin (« J'ai perdu 3 min 12 s au musée Anti-UX »).
5. **Parcours** : suivant / précédent entre spécimens, progression par salle (« 3 sur 4 »), spécimens visités marqués (stockage local).
6. **Lien direct vers chaque spécimen** (`/salle/boutons#bouton-fuyant`) pour pouvoir le partager.
7. **Le musée est exemplaire** : utilisable entièrement au clavier, focus visible, contrastes AA, cibles tactiles de 44 px, `prefers-reduced-motion` respecté, aucune erreur d'accessibilité automatique hors des cadres de spécimens.
8. **En ligne sur Coolify**, avec un README à jour et un aperçu de lien (Open Graph).

### Périmètre volontairement limité

- Site statique : tout se passe dans le navigateur, aucun serveur, aucune donnée envoyée. Les formulaires des spécimens n'envoient rien.
- Les pièges sont **simulés et confinés** à leur cadre : pas de vraie demande de notification, pas de vraie manipulation de l'historique, pas de vraie fenêtre qui empêche de quitter la page, pas de son automatique.
- Aucun clignotement de plus de trois éclairs par seconde (risque d'épilepsie), même dans un spécimen.
- Toujours une sortie : chaque spécimen a un bouton « Réparer » et un lien « Spécimen suivant » qui restent accessibles, même quand le piège couvre l'écran.

## 3. Cahier des charges fonctionnel — les salles et leurs spécimens

Les spécimens marqués **MVP** sont à faire en priorité ; les autres sont des pistes pour les bonus.

### Salle 1 · Les boutons

| Spécimen | Le piège | La version corrigée | Référence |
| --- | --- | --- | --- |
| **Le bouton muet** (MVP) | Aucun retour au survol, au clic ni pendant l'envoi : on ne sait pas si ça a marché, on reclique. | États survol, appui, chargement et succès ; bouton désactivé pendant l'envoi. | Nielsen 1, visibilité de l'état du système |
| **Le double envoi** (MVP) | Chaque clic relance la commande : trois clics, trois paiements. | Un seul envoi, bouton verrouillé, confirmation claire. | Nielsen 5, prévention des erreurs |
| **La hiérarchie inversée** (MVP) | « Supprimer mon compte » en gros bouton plein, « Annuler » en petit lien gris. | Action principale mise en avant, action destructrice en retrait et confirmée. | Nielsen 5 |
| **Le confetti** (MVP) | Bouton de 14 px de côté, collé à son voisin. | Cible de 44 px, espacement suffisant. | WCAG 2.5.8, loi de Fitts |
| Le bouton fuyant | Le bouton s'écarte quand le pointeur approche. | Bouton immobile. | Loi de Fitts |
| L'icône mystère | Une rangée d'icônes sans texte ni infobulle. | Icône accompagnée d'un libellé. | Nielsen 6, reconnaître plutôt que se souvenir |
| Le faux bouton | Un texte qui ressemble à un bouton mais ne fait rien, et un vrai lien déguisé en texte. | Les éléments cliquables se reconnaissent. | Nielsen 4, cohérence et standards |

### Salle 2 · Les champs de texte

| Spécimen | Le piège | La version corrigée | Référence |
| --- | --- | --- | --- |
| **Le texte d'exemple qui sert d'étiquette** (MVP) | L'intitulé est dans le `placeholder` : dès qu'on tape, on ne sait plus ce qu'on remplit. | Étiquette visible au-dessus du champ, exemple en aide. | WCAG 3.3.2 |
| **L'effaceur** (MVP) | Une erreur dans un champ vide tout le formulaire. | Les saisies sont conservées, seul le champ fautif est signalé. | Nielsen 9, aider à corriger |
| **Le format secret** (MVP) | Le téléphone est refusé s'il contient des espaces, sans dire quel format est attendu. | Format accepté avec espaces, tirets ou points, puis normalisé. | Loi de Postel, WCAG 3.3.3 |
| **Le copier-coller interdit** (MVP) | Le champ de confirmation du mot de passe bloque le collage. | Collage autorisé, bouton « Afficher le mot de passe ». | WCAG 3.3.8 |
| Le validateur pressé | Message d'erreur rouge dès la première lettre tapée. | Validation à la sortie du champ, puis en direct une fois l'erreur affichée. | Nielsen 5 |
| La limite silencieuse | Le texte est coupé à 20 caractères sans prévenir. | Compteur visible et message avant la limite. | Nielsen 1 |
| Le curseur sauteur | Le champ se reformate pendant la frappe et le curseur part à la fin. | Mise en forme qui garde la position du curseur. | Contrôle de l'utilisateur |
| La date de naissance infernale | Une liste déroulante de 120 années, ou un curseur. | Trois petits champs jour / mois / année. | Nielsen 7, efficacité |

### Salle 3 · Les formulaires

| Spécimen | Le piège | La version corrigée | Référence |
| --- | --- | --- | --- |
| **L'erreur vague** (MVP) | Un seul message en haut : « Erreur ». | Message près du champ, qui dit quoi corriger, et résumé des erreurs. | Nielsen 9, WCAG 3.3.1 |
| **Le bouton grisé sans raison** (MVP) | « Envoyer » reste désactivé et rien n'explique ce qui manque. | Bouton actif, la soumission indique les champs manquants. | Nielsen 1 |
| **L'obligatoire invisible** (MVP) | On découvre à l'envoi que tous les champs étaient obligatoires. | Champs obligatoires signalés, ou champs facultatifs marqués « (facultatif) ». | WCAG 3.3.2 |
| **Le bouton Effacer** (MVP) | « Réinitialiser » collé à « Envoyer », de la même taille. | Pas de bouton de réinitialisation, ou bien éloigné et confirmé. | Nielsen 5 |
| Le captcha absolu | « Cochez toutes les images contenant de la tristesse. » | Protection invisible ou question simple. | WCAG 1.1.1 |
| L'étiquette non cliquable | Une case à cocher minuscule dont le texte ne la coche pas. | `<label>` relié, toute la ligne est cliquable. | WCAG 1.3.1 |

### Salle 4 · La navigation

| Spécimen | Le piège | La version corrigée | Référence |
| --- | --- | --- | --- |
| **« Cliquez ici »** (MVP) | Des liens qui disent tous « ici », « en savoir plus ». | Le texte du lien dit où il mène. | WCAG 2.4.4 |
| **Le menu qui se ferme** (MVP) | Le sous-menu disparaît dès que le pointeur sort en diagonale. | Délai de fermeture et zone de tolérance. | Contrôle de l'utilisateur |
| **Le défilement infini sans fin** (MVP) | Le pied de page recule à chaque chargement : impossible d'atteindre le lien « Contact ». | Bouton « Charger plus » et pied de page atteignable. | Nielsen 3, liberté de l'utilisateur |
| **Le défilement détourné** (MVP) | La molette fait défiler à une vitesse imposée, par à-coups. | Défilement natif. | Nielsen 3 |
| Le hamburger sur ordinateur | Toute la navigation cachée derrière trois traits, sur un écran de 1 440 px. | Liens visibles quand la place le permet. | Nielsen 6 |
| Le labyrinthe | Aucun repère : pas de titre de page, pas de fil d'Ariane, pas de page active. | Titre, fil d'Ariane, lien actif marqué. | WCAG 2.4.2 et 2.4.8 |

### Salle 5 · Les retours visuels

| Spécimen | Le piège | La version corrigée | Référence |
| --- | --- | --- | --- |
| **Le sablier éternel** (MVP) | Un indicateur de chargement qui tourne sans fin, sans durée ni annulation. | Barre de progression, étape en cours, bouton « Annuler ». | Nielsen 1 |
| **Le saut de mise en page** (MVP) | Une bannière se charge au-dessus au moment du clic : on appuie sur « Supprimer » au lieu de « Garder ». | Place réservée, rien ne bouge. | Core Web Vitals (CLS) |
| **Le message éclair** (MVP) | Le message de confirmation disparaît en une seconde. | Message qui reste le temps de lire, ou qu'on ferme soi-même. | WCAG 2.2.1 |
| **La page vide** (MVP) | Une liste vide n'affiche rien, ni explication ni action. | État vide avec explication et action proposée. | Nielsen 10, aide |
| Le succès ambigu | « Opération effectuée » : laquelle ? | Message précis, avec annulation possible. | Nielsen 1 et 3 |

### Salle 6 · La lisibilité et l'accessibilité

| Spécimen | Le piège | La version corrigée | Référence |
| --- | --- | --- | --- |
| **Le gris sur gris** (MVP) | Texte gris clair sur fond blanc (contraste de 1,8:1). | Contraste d'au moins 4,5:1. | WCAG 1.4.3 |
| **Le focus effacé** (MVP) | `outline: none` partout : au clavier, on ne sait plus où on est. | Focus visible et contrasté. | WCAG 2.4.7 |
| **Le rouge et le vert** (MVP) | Seule la couleur distingue « valide » et « refusé ». | Couleur, icône et texte. Un filtre simule le daltonisme pour comparer. | WCAG 1.4.1 |
| **Le pavé** (MVP) | Texte justifié en 11 px, tout en majuscules, lignes de 160 caractères. | 16 px, aligné à gauche, 70 caractères par ligne, casse normale. | WCAG 1.4.8 |
| Le carrousel frénétique | Défile tout seul toutes les deux secondes, sans pause. | Pause, contrôles, défilement manuel. | WCAG 2.2.2 |
| Le texte dans l'image | Un titre en image, sans texte alternatif. | Texte réel, ou `alt` qui le reprend. | WCAG 1.1.1 |

### Salle 7 · Les pièges commerciaux (*dark patterns*)

| Spécimen | Le piège | La version corrigée | Référence |
| --- | --- | --- | --- |
| **La bannière de cookies** (MVP) | « Tout accepter » en gros, refuser demande quatre écrans. | « Tout refuser » au même niveau que « Tout accepter ». | RGPD, recommandations de la CNIL |
| **La honte** (MVP) | « Non merci, je préfère payer plus cher. » | « Non merci. » | Confirmshaming |
| **La case précochée** (MVP) | Abonnement à la lettre d'information coché par défaut, caché sous le bouton. | Case décochée, visible. | RGPD, consentement libre |
| **Le désabonnement sans fin** (MVP) | Douze étapes, des questions culpabilisantes, un lien caché. | Se désabonner en un clic, comme on s'est abonné. | *Roach motel* |
| Le faux compte à rebours | « Offre valable encore 4:59 », qui repart à zéro au rechargement. | Pas d'urgence inventée. | Urgence factice |
| La croix introuvable | Fenêtre surgissante dont la croix fait 6 px, en gris sur gris. | Croix visible, touche Échap, clic à l'extérieur. | WCAG 2.1.2 |
| Le panier qui grossit | Une assurance ajoutée en douce au panier. | Rien n'est ajouté sans action du visiteur. | *Sneak into basket* |

### Interface du musée

- Chaque spécimen est dans un **cadre** nettement séparé du reste (cartel de musée, bordure, étiquette « spécimen »), pour qu'on ne confonde jamais le piège et le site.
- L'interrupteur **Le piège / Réparé** garde la même position et la même taille : on compare d'un geste.
- Le cartel (pourquoi, règle, référence) est lisible sans avoir joué avec le spécimen.
- Le Frustromètre est discret, et peut se masquer.
- Animations sobres hors des spécimens, et tout effet de mouvement des spécimens coupé quand le système demande moins de mouvement (avec une phrase qui explique ce qui aurait bougé).

## 4. Cahier des charges technique

- JavaScript en modules ES et CSS, sans framework. Un fichier par spécimen (`src/specimens/<salle>/<nom>.js`) qui exporte ses métadonnées (titre, salle, référence, textes) et deux fonctions de rendu : `piege(cadre)` et `repare(cadre)`.
- Un registre des spécimens génère les pages des salles, la navigation et le sitemap : ajouter un spécimen = ajouter un fichier.
- Chaque spécimen nettoie derrière lui (écouteurs, minuteurs, intervalles) quand on change de version ou de page.
- Les fonctions pures (détection des clics rageurs, normalisation du téléphone, calcul du contraste, tirage du jeu du jour) sont testées avec `node --test`.
- Tests de bout en bout (Playwright) : navigation au clavier sur tout le musée, bascule piège / réparé sur chaque spécimen, sortie possible de chaque piège.
- Audit d'accessibilité automatique (axe) sur le musée, cadres de spécimens exclus : zéro erreur.
- Mise en ligne sur Coolify à chaque push sur la branche principale.

## 5. Critères de réussite

- [ ] Les 28 spécimens MVP fonctionnent sur téléphone et sur ordinateur, en version piège et en version réparée.
- [ ] Chaque version réparée respecte la règle qu'elle illustre (vérifié spécimen par spécimen).
- [ ] On peut sortir de chaque piège au clavier, sans recharger la page.
- [ ] Le musée (hors cadres) obtient zéro erreur à l'audit axe et 100 en accessibilité sur Lighthouse.
- [ ] Tout le site se parcourt au clavier, avec un focus toujours visible.
- [ ] Un lien vers un spécimen ouvre directement ce spécimen.
- [ ] Le Frustromètre compte les clics rageurs et produit un résultat partageable.
- [ ] Aucun piège n'agit en dehors de son cadre (historique, notifications, son, fermeture de page).
- [ ] Les tests passent.

## 6. Bonus facultatifs

Dans l'ordre de préférence, à faire si le MVP est terminé :

1. **Les spécimens non marqués MVP** de la section 3.
2. **Le formulaire de l'enfer** : une épreuve chronométrée qui combine dix pièges dans un seul formulaire d'inscription. Le temps final s'ajoute au Frustromètre.
3. **Le mode « Trouve l'erreur »** : une page entière ratée, le visiteur clique sur les défauts qu'il repère, et le site révèle ceux qu'il a manqués.
4. **La fiche à imprimer** : une page « Les 28 règles à retenir », propre à l'impression et téléchargeable en PDF.
5. **Version anglaise**, avec bascule dans le pied de page.

## 7. Définition du « terminé »

Le MVP fonctionne sur téléphone et ordinateur, les critères de la section 5 sont cochés, le site est en ligne sur `anti-ux.projectp.fr`, le README a son lien et sa capture, et la carte du projet passe à « terminé » sur la vitrine.

## 8. À me demander avant de coder

À poser **avant d'écrire le code**, et attendre ma réponse :

1. **Le jeu quotidien.** Chaque projet a un jeu du jour pour faire revenir les visiteurs : le même tirage pour tout le monde (d'après la date), une tentative par jour, une série 🔥 et un résultat à partager. Me proposer deux ou trois idées adaptées au projet (par exemple : « Lequel est le bon ? », deux versions d'une interface et une seule respecte la règle ; ou « L'erreur du jour », une capture ratée où il faut trouver le défaut en un clic), puis attendre mon choix.
2. **Le look.** Me demander une référence visuelle sur laquelle se baser (un site, une marque, une ambiance, une capture). Le site doit être original et agréable à regarder, **pas « basique »** : une vraie identité (typographie, palette, mise en page, détails, animations), pas un gabarit générique. Le contraste entre le musée soigné et les spécimens ratés doit sauter aux yeux. Si je n'ai pas d'idée, me proposer deux directions (par exemple : un vrai musée, murs blancs et cartels ; ou un laboratoire, fiches d'expérience et bocaux étiquetés) et attendre mon choix.
3. **Le ton.** Les textes du musée peuvent être neutres et pédagogiques, ou plus moqueurs (« ce bouton a été retrouvé sur un site de banque en 2009 »). Me proposer les deux, puis attendre mon choix.
4. **La liste des spécimens.** Me montrer la liste MVP de la section 3 et me demander s'il faut en ajouter, en retirer ou en remplacer, avant de commencer.

## 9. Aperçu du lien (à faire sans me le redemander)

- Image Open Graph **1200 × 630** stylisée aux couleurs du projet : nom, accroche, technos et capture, générée avec `scripts/og/build-og.py` (ajouter le projet à la liste).
- Sur chaque page publique : `og:title`, `og:description`, `og:url`, `og:image` (adresse absolue), `og:image:width`, `og:image:height`, `og:image:alt` et `twitter:card` = `summary_large_image`.
- Vérifier en ligne que l'image répond en 200 et que les balises sont servies.

## 10. Indexation (à faire sans me le redemander)

- `robots.txt` : pages privées et routes techniques en `Disallow`, lien vers le sitemap.
- `sitemap.xml` : l'accueil et chaque salle.
- Balise `canonical` sur chaque page publique ; `noindex` sur les pages privées.
- Données structurées JSON-LD sur l'accueil : `WebApplication`, avec `isPartOf` ProjectP (https://projectp.fr/).
- Lien « 30 jours, 30 projets » vers https://projectp.fr/ dans le pied de page.
- Site statique : ajouter le projet à `scripts/seo/apply-seo.py` et relancer le script.
- Vérifier en ligne, puis me rappeler de soumettre `https://anti-ux.projectp.fr/sitemap.xml` dans Google Search Console.

## 11. Vitrine 30days30projects (avec ma validation)

Une fois le projet en ligne, **me demander mon accord**, puis seulement :

- `projects.js` : l'entrée du jour 23 passe à `status: 'done'`, avec `folder: 'day-23-anti-ux'`, `name: 'Anti-UX'`, `url`, `repo`, `image` et `description`.
- `preview-days-images/day23_anti-ux.png` : la capture de l'accueil, en 1600 × 900.
- `README.md` : la ligne du jour 23 dans le tableau des 30 projets.
- Commit et push du dépôt `30days30projects`.

## 12. Décisions prises en cours de route

### Refonte du 6 novembre 2026

- **Look « Vrai musée »** (choisi parmi musée, laboratoire ou sombre affiné) : murs blanc cassé, Fraunces / Inter / JetBrains Mono, accent vermillon, cartels et numéros d’inventaire. Le thème sombre ambre et les émojis sont abandonnés.
- **37 salles à plat** : les 30 cas d’utilisation (`CAS_UTILISATION_UX.md`) deviennent des salles comme les 7 premières, une erreur par salle, rangées en six ailes. Plus de section « cas » séparée ; toutes les pages sont dans `salles/<salle>.html`. Les titres des anciens cas sont reformulés en spécimens (« La liste interminable », « Le brouillon perdu »…).
- **Pièce maîtresse Coiffeur Antique**, mise en avant juste après l’accueil : une version ratée qui cumule dix erreurs (pastilles numérotées et liens vers les salles concernées), une version réparée qui fonctionne. Les anciennes pages `coiffeur/index.html`, `contact.html` et `connexion.html` sont retirées.
- La fiche d’une salle garde les deux vitrines côte à côte (piège à gauche, réparé à droite, verrouillé jusqu’au piège subi) plutôt qu’un interrupteur au même endroit : la comparaison se fait d’un regard.
- Le plan du musée est défini une seule fois, dans `scripts/build/build.mjs`, qui génère aussi l’accueil.
- Les dossiers `src/specimens/` (28 spécimens d’une première version) et `scripts/create_specimens.py` ne sont plus utilisés par le site ; ils restent comme réserve pour de futures salles.

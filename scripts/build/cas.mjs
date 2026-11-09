/* Anti-UX · Les 30 cas d'utilisation (source : CAS_UTILISATION_UX.md).
 * Même format que salles.mjs. Les comportements interactifs sont dans scripts/demos.js.
 */

const VILLES = [
  'Strasbourg', 'Brest', 'Aix-en-Provence', 'Lille', 'Ajaccio', 'Nantes', 'Dijon', 'Pau', 'Lyon', 'Rennes',
  'Amiens', 'Toulon', 'Metz', 'Bayonne', 'Grenoble', 'Caen', 'Nîmes', 'Annecy', 'Limoges', 'Perpignan',
  'Reims', 'Tours', 'Le Havre', 'Besançon', 'Orléans', 'Rouen', 'Mulhouse', 'Clermont-Ferrand', 'Brive', 'Nancy',
  'Avignon', 'Poitiers', 'La Rochelle', 'Angers', 'Saint-Malo', 'Lorient', 'Quimper', 'Vannes', 'Calais', 'Dunkerque',
  'Arras', 'Troyes', 'Chartres', 'Bourges', 'Valence', 'Chambéry', 'Gap', 'Niort', 'Albi', 'Rodez',
  'Montpellier', 'Toulouse', 'Bordeaux', 'Marseille', 'Nice', 'Paris', 'Cannes', 'Biarritz', 'Colmar', 'Vichy',
];

const villesOptions = VILLES.map((v) => `    <option>${v}</option>`).join('\n');

export const cas = [
  {
    slug: 'cookies',
    title: 'Les cookies déjà posés',
    ref: 'RGPD art. 7 · CNIL, lignes directrices cookies',
    refUrl: 'https://www.cnil.fr/fr/cookies-et-autres-traceurs',
    explanation: 'Les traceurs sont déposés dès l’arrivée sur la page, avant toute réponse. La bannière annonce « en poursuivant, vous acceptez » : le seul bouton valide un fait accompli.',
    rule: 'Aucun traceur non essentiel avant le consentement. Accepter et refuser sont proposés au même niveau.',
    task: 'Essayez de refuser les cookies.',
    bad: `
<div class="fake-site">
  <p class="tracker-count">Traceurs déposés : <strong data-r="count">3</strong></p>
  <div class="consent-bar" data-r="bar">
    <p>En poursuivant votre navigation, vous acceptez l’utilisation de cookies.</p>
    <button type="button" class="btn btn-primary" data-r="ok">OK</button>
  </div>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    good: `
<div class="fake-site">
  <p class="tracker-count">Traceurs déposés : <strong data-r="count">0</strong></p>
  <div class="consent-bar" data-r="bar">
    <p>Nous aimerions mesurer l’audience avec 3 traceurs. Rien n’est déposé tant que vous n’avez pas choisi.</p>
    <div class="cookie-options">
      <button type="button" class="btn btn-muet" data-r="refuse">Refuser</button>
      <button type="button" class="btn btn-muet" data-r="accept">Accepter</button>
    </div>
  </div>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    before: `<!-- Chargé AVANT tout choix -->
<script src="https://pub.example/tracker.js"></script>
<div class="bar">
  En poursuivant, vous acceptez les cookies.
  <button>OK</button>
</div>`,
    after: `<div role="region" aria-label="Cookies">
  <button data-consent="refuse">Refuser</button>
  <button data-consent="accept">Accepter</button>
</div>
<script>
  // Aucun traceur tant que le choix n'est pas fait
  document.addEventListener('click', (e) => {
    const choix = e.target.dataset.consent;
    if (!choix) return;
    enregistrerChoix(choix);
    if (choix === 'accept') chargerTraceurs();
  });
</script>`,
    steps: [['click', '[data-r="ok"]']],
  },
  {
    slug: 'progression',
    title: 'La barre de progression muette',
    ref: 'WCAG 4.1.2 · Nom, rôle et valeur',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
    explanation: 'La barre de progression n’est qu’un div coloré. Visuellement, on voit « à moitié ». Un lecteur d’écran, lui, n’annonce rien : ni rôle, ni valeur, ni étape.',
    rule: 'Utiliser <progress> ou role="progressbar" avec aria-valuenow et un aria-valuetext lisible (« Étape 2 sur 4 : adresse »).',
    task: 'Écoutez ce que le lecteur d’écran annonce.',
    bad: `
<p class="demo-label">Inscription</p>
<div class="bar-visual"><div class="bar-fill" style="width: 50%"></div></div>
<button type="button" class="btn btn-muet" data-r="listen">🔈 Écouter (lecteur d’écran simulé)</button>
<p class="sr-sim" data-r="out" aria-live="polite"></p>`,
    good: `
<p class="demo-label" id="pg-label">Inscription</p>
<div class="bar-visual" role="progressbar" aria-labelledby="pg-label"
  aria-valuemin="0" aria-valuemax="4" aria-valuenow="2" aria-valuetext="Étape 2 sur 4 : adresse">
  <div class="bar-fill" style="width: 50%"></div>
</div>
<p class="hint">Étape 2 sur 4 · Adresse</p>
<button type="button" class="btn btn-muet" data-r="listen">🔈 Écouter (lecteur d’écran simulé)</button>
<p class="sr-sim" data-r="out" aria-live="polite"></p>`,
    before: `<div class="bar">
  <div class="fill" style="width: 50%"></div>
</div>`,
    after: `<p id="label">Inscription</p>
<div class="bar" role="progressbar"
  aria-labelledby="label"
  aria-valuemin="0" aria-valuemax="4"
  aria-valuenow="2"
  aria-valuetext="Étape 2 sur 4 : adresse">
  <div class="fill" style="width: 50%"></div>
</div>`,
    steps: [['click', '[data-r="listen"]']],
  },
  {
    slug: 'erreurs',
    title: 'Le formulaire qui efface tout',
    ref: 'WCAG 3.3.3 · Suggestion après une erreur',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html',
    explanation: 'Après l’envoi, un compteur « 3 erreurs » s’affiche en haut. Aucun champ n’est signalé et le mot de passe a été vidé. Il faut deviner, puis tout ressaisir.',
    rule: 'Un résumé avec des liens vers chaque champ, un message sous chaque champ qui dit comment corriger, et les valeurs saisies conservées.',
    task: 'Envoyez le formulaire tel quel.',
    bad: `
<form class="demo-form" data-r="form" novalidate>
  <p class="error-banner" data-r="summary" role="alert" hidden></p>
  <div class="field"><label for="er-m-email">Email</label><input type="text" id="er-m-email" value="marie@" data-r="email"></div>
  <div class="field"><label for="er-m-pass">Mot de passe</label><input type="password" id="er-m-pass" value="abc" data-r="pass"></div>
  <div class="field"><label for="er-m-cp">Code postal</label><input type="text" id="er-m-cp" value="7500" data-r="cp"></div>
  <button type="submit" class="btn btn-primary">Créer mon compte</button>
</form>`,
    good: `
<form class="demo-form" data-r="form" novalidate>
  <div class="error-summary" data-r="summary" role="alert" tabindex="-1" hidden></div>
  <div class="field"><label for="er-b-email">Email</label><input type="email" id="er-b-email" value="marie@" data-r="email" aria-describedby="er-b-email-err"><p class="field-error" id="er-b-email-err"></p></div>
  <div class="field"><label for="er-b-pass">Mot de passe</label><input type="password" id="er-b-pass" value="abc" data-r="pass" aria-describedby="er-b-pass-err"><p class="field-error" id="er-b-pass-err"></p></div>
  <div class="field"><label for="er-b-cp">Code postal</label><input type="text" id="er-b-cp" value="7500" inputmode="numeric" data-r="cp" aria-describedby="er-b-cp-err"><p class="field-error" id="er-b-cp-err"></p></div>
  <button type="submit" class="btn btn-primary">Créer mon compte</button>
  <p class="form-success" data-r="ok" role="status"></p>
</form>`,
    before: `<p class="error">3 erreurs dans le formulaire.</p>
<input type="password" value=""> <!-- vidé -->`,
    after: `<div role="alert" tabindex="-1">
  <a href="#email">Email : il manque le domaine</a>
</div>
<input id="email" aria-invalid="true"
  aria-describedby="email-err">
<p id="email-err">
  Il manque le domaine après @ (ex. marie@exemple.fr)
</p>`,
    steps: [['click', 'button[type="submit"]']],
  },
  {
    slug: 'navigation-contextuelle',
    title: 'La barre d’outils figée',
    ref: 'Nielsen #1 · Visibilité de l’état du système',
    refUrl: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    explanation: 'Toutes les actions sont toujours proposées, quel que soit l’état : « Enregistrer » sans modification, « Annuler » sans rien à annuler. On clique et on obtient un refus.',
    rule: 'Les actions reflètent l’état : désactivées avec une raison quand elles ne servent à rien, renommées selon le contexte (« Enregistré ✓ », « Annuler la frappe »).',
    task: 'Cliquez sur une action de la barre d’outils.',
    bad: `
<div class="toolbar" role="toolbar" aria-label="Édition (raté)">
  <button type="button" class="btn btn-muet btn-sm" data-r="act">Enregistrer</button>
  <button type="button" class="btn btn-muet btn-sm" data-r="act">Annuler</button>
  <button type="button" class="btn btn-muet btn-sm" data-r="act">Rétablir</button>
  <button type="button" class="btn btn-muet btn-sm" data-r="act">Exporter</button>
</div>
<label class="sr-only" for="nc-m-text">Texte</label>
<textarea id="nc-m-text" rows="3">Brouillon du compte-rendu.</textarea>
<p class="backstage" data-r="log" aria-live="polite"></p>`,
    good: `
<div class="toolbar" role="toolbar" aria-label="Édition (corrigé)">
  <button type="button" class="btn btn-muet btn-sm" data-r="save" disabled>Enregistré ✓</button>
  <button type="button" class="btn btn-muet btn-sm" data-r="undo" disabled>Annuler</button>
</div>
<label class="sr-only" for="nc-b-text">Texte</label>
<textarea id="nc-b-text" rows="3" data-r="text">Brouillon du compte-rendu.</textarea>
<p class="backstage" data-r="log" aria-live="polite">Aucune modification à enregistrer.</p>`,
    before: `<button onclick="save()">Enregistrer</button>
<button onclick="undo()">Annuler</button>`,
    after: `<button id="save" disabled>Enregistré ✓</button>
<script>
  texte.addEventListener('input', () => {
    save.disabled = false;
    save.textContent = 'Enregistrer';
  });
</script>`,
    steps: [['click', '[data-r="act"] >> nth=0']],
  },
  {
    slug: 'haptique',
    title: 'Le clavier qui vibre',
    ref: 'Apple HIG · Playing haptics',
    refUrl: 'https://developer.apple.com/design/human-interface-guidelines/playing-haptics',
    explanation: 'Chaque touche du clavier PIN déclenche une longue vibration, et c’est le seul retour : aucun point ne se remplit. Les vibrations fatiguent, et les personnes qui les ont coupées ne savent plus où elles en sont.',
    rule: 'Les vibrations restent rares, courtes et toujours doublées d’un retour visuel. Elles se désactivent.',
    task: 'Tapez un code à 4 chiffres. (Vibrations simulées, rien ne vibre réellement.)',
    bad: `
<div class="pin" data-r="pin">
  <p class="pin-dots" aria-hidden="true">_ _ _ _</p>
  <div class="pin-pad">
    <button type="button" class="btn btn-muet" data-r="key">1</button><button type="button" class="btn btn-muet" data-r="key">2</button><button type="button" class="btn btn-muet" data-r="key">3</button>
    <button type="button" class="btn btn-muet" data-r="key">4</button><button type="button" class="btn btn-muet" data-r="key">5</button><button type="button" class="btn btn-muet" data-r="key">6</button>
  </div>
  <p class="backstage">📳 Vibrations : <strong data-r="count">0</strong> × 400 ms</p>
</div>`,
    good: `
<div class="pin" data-r="pin">
  <p class="pin-dots" data-r="dots" aria-live="polite">○ ○ ○ ○</p>
  <div class="pin-pad">
    <button type="button" class="btn btn-muet" data-r="key">1</button><button type="button" class="btn btn-muet" data-r="key">2</button><button type="button" class="btn btn-muet" data-r="key">3</button>
    <button type="button" class="btn btn-muet" data-r="key">4</button><button type="button" class="btn btn-muet" data-r="key">5</button><button type="button" class="btn btn-muet" data-r="key">6</button>
  </div>
  <label class="check"><input type="checkbox" data-r="toggle" checked> Vibrer à la validation</label>
  <p class="backstage">📳 Vibrations : <strong data-r="count">0</strong> × 20 ms</p>
</div>`,
    before: `touche.addEventListener('click', () => {
  navigator.vibrate(400); // à chaque touche
});`,
    after: `touche.addEventListener('click', () => {
  remplirPoint();          // retour visuel d'abord
  if (codeComplet() && prefs.vibrer) {
    navigator.vibrate?.(20); // une seule, courte
  }
});`,
    steps: [['click', '[data-r="key"] >> nth=0'], ['click', '[data-r="key"] >> nth=1'], ['click', '[data-r="key"] >> nth=2'], ['click', '[data-r="key"] >> nth=3']],
  },
  {
    slug: 'distillation',
    title: 'La liste interminable',
    ref: 'Loi de Hick · Lois de l’UX',
    refUrl: 'https://lawsofux.com/hicks-law/',
    explanation: 'Une liste déroulante de 60 villes, sans ordre et sans recherche. Plus il y a d’options, plus le temps de décision s’allonge. Sur mobile, la liste occupe tout l’écran.',
    rule: 'Au-delà d’une quinzaine d’options, proposer un champ de recherche qui filtre pendant la frappe.',
    task: 'Choisissez « Lyon » comme ville de livraison.',
    bad: `
<div class="field">
  <label for="ds-m-ville">Ville de livraison</label>
  <select id="ds-m-ville" data-r="select">
    <option value="">— Choisir —</option>
${villesOptions}
  </select>
</div>
<p class="backstage" data-r="log" aria-live="polite"></p>`,
    good: `
<div class="field">
  <label for="ds-b-ville">Ville de livraison</label>
  <input type="search" id="ds-b-ville" data-r="search" autocomplete="off" aria-describedby="ds-b-count" placeholder="Ex. Lyon">
  <p class="hint" id="ds-b-count" data-r="count" aria-live="polite">Tapez les premières lettres</p>
  <ul class="filter-list" data-r="list"></ul>
</div>
<p class="backstage" data-r="log" aria-live="polite"></p>`,
    before: `<select>
  <option>Strasbourg</option>
  <option>Brest</option>
  <!-- … 58 autres, sans ordre -->
</select>`,
    after: `<input type="search" id="ville">
<ul id="resultats"></ul>
<script>
  ville.addEventListener('input', () => {
    const q = ville.value.toLowerCase();
    afficher(VILLES.filter(v =>
      v.toLowerCase().startsWith(q)).slice(0, 8));
  });
</script>`,
    steps: [['select', '[data-r="select"]', 'Lyon']],
  },
  {
    slug: 'validation-anticipe',
    title: 'Le validateur pressé',
    ref: 'L. Wroblewski · Inline validation in web forms',
    refUrl: 'https://alistapart.com/article/inline-validation-in-web-forms/',
    explanation: 'Le champ crie « invalide » dès la première lettre, avant même que l’adresse soit finie. Le bouton reste grisé sans dire pourquoi.',
    rule: 'Valider quand l’utilisateur quitte le champ (ou dès que la saisie devient valide), confirmer ce qui est juste, et ne jamais griser le bouton d’envoi sans explication.',
    task: 'Commencez à taper votre adresse email.',
    bad: `
<form class="demo-form" data-r="form" novalidate>
  <div class="field">
    <label for="va-m-email">Email</label>
    <input type="text" id="va-m-email" data-r="email" autocomplete="off">
    <p class="field-error" data-r="err"></p>
  </div>
  <button type="submit" class="btn btn-primary" data-r="submit" disabled>S’inscrire</button>
</form>`,
    good: `
<form class="demo-form" data-r="form" novalidate>
  <div class="field">
    <label for="va-b-email">Email</label>
    <input type="email" id="va-b-email" data-r="email" autocomplete="off" aria-describedby="va-b-msg">
    <p class="hint" id="va-b-msg" data-r="msg">Format : nom@exemple.fr</p>
  </div>
  <button type="submit" class="btn btn-primary">S’inscrire</button>
  <p class="form-success" data-r="ok" role="status"></p>
</form>`,
    before: `email.addEventListener('input', () => {
  erreur.textContent = estValide(email.value)
    ? '' : '✗ Adresse email invalide';
  envoyer.disabled = !estValide(email.value);
});`,
    after: `email.addEventListener('blur', verifier);
email.addEventListener('input', () => {
  // On ne corrige en direct qu'une erreur déjà signalée
  if (email.getAttribute('aria-invalid') === 'true') verifier();
});`,
    steps: [['type', '[data-r="email"]', 'ma']],
  },
  {
    slug: 'suppression',
    title: 'La corbeille piégée',
    ref: 'Nielsen #3 · Contrôle et liberté',
    refUrl: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    explanation: 'L’icône corbeille est collée à l’icône crayon. Un clic, le fichier disparaît : ni confirmation, ni annulation possible.',
    rule: 'Pour une suppression réversible : supprimer tout de suite, mais proposer « Annuler » quelques secondes. Pour une suppression définitive : une confirmation qui nomme l’élément.',
    task: 'Renommez « Devis.pdf »… en visant bien le crayon.',
    bad: `
<ul class="file-list" data-r="list">
  <li><span>Devis.pdf</span><span class="file-actions"><button type="button" class="icon-btn" aria-label="Renommer Devis.pdf" data-r="edit">✎</button><button type="button" class="icon-btn" aria-label="Supprimer Devis.pdf" data-r="del">🗑</button></span></li>
  <li><span>Facture-mars.pdf</span><span class="file-actions"><button type="button" class="icon-btn" aria-label="Renommer Facture-mars.pdf" data-r="edit">✎</button><button type="button" class="icon-btn" aria-label="Supprimer Facture-mars.pdf" data-r="del">🗑</button></span></li>
  <li><span>Contrat.pdf</span><span class="file-actions"><button type="button" class="icon-btn" aria-label="Renommer Contrat.pdf" data-r="edit">✎</button><button type="button" class="icon-btn" aria-label="Supprimer Contrat.pdf" data-r="del">🗑</button></span></li>
</ul>
<p class="backstage" data-r="log" aria-live="polite"></p>
<button type="button" class="link-plain" data-r="reset">Restaurer la démo</button>`,
    good: `
<ul class="file-list" data-r="list">
  <li><span>Devis.pdf</span><span class="file-actions spaced"><button type="button" class="btn btn-muet btn-sm" data-r="edit">Renommer</button><button type="button" class="btn btn-rouge btn-sm" data-r="del">Supprimer</button></span></li>
  <li><span>Facture-mars.pdf</span><span class="file-actions spaced"><button type="button" class="btn btn-muet btn-sm" data-r="edit">Renommer</button><button type="button" class="btn btn-rouge btn-sm" data-r="del">Supprimer</button></span></li>
  <li><span>Contrat.pdf</span><span class="file-actions spaced"><button type="button" class="btn btn-muet btn-sm" data-r="edit">Renommer</button><button type="button" class="btn btn-rouge btn-sm" data-r="del">Supprimer</button></span></li>
</ul>
<div class="toast" data-r="toast" role="status" hidden><span data-r="toast-text"></span> <button type="button" class="btn btn-ambre btn-sm" data-r="undo">Annuler</button></div>`,
    before: `<button onclick="supprimer(id)">🗑</button>
<!-- collé au crayon, effet immédiat -->`,
    after: `function supprimer(item) {
  item.remove();
  afficherToast(item.nom + ' supprimé', {
    action: 'Annuler',
    onAction: () => restaurer(item),
    duree: 8000,
  });
}`,
    steps: [['click', '[data-r="del"] >> nth=0']],
  },
  {
    slug: 'chargement',
    title: 'Le chargement aveugle',
    ref: 'NN/g · Skeleton screens',
    refUrl: 'https://www.nngroup.com/articles/skeleton-screens/',
    explanation: 'Un « Chargement… » figé occupe la zone, puis le contenu surgit d’un coup et pousse tout le reste. Pendant l’attente, rien n’indique ce qui se passe ni combien de temps ça va durer.',
    rule: 'Un squelette à la taille du contenu final, une étape lisible (« Récupération de 12 commandes, 2/3 ») et une estimation de durée.',
    task: 'Affichez vos commandes.',
    bad: `
<button type="button" class="btn btn-primary" data-r="go">Afficher mes commandes</button>
<div class="orders" data-r="zone"></div>
<p class="after-zone">Besoin d’aide ? Contactez le support.</p>`,
    good: `
<button type="button" class="btn btn-primary" data-r="go">Afficher mes commandes</button>
<p class="hint" data-r="status" role="status"></p>
<div class="orders" data-r="zone" aria-busy="false"></div>
<p class="after-zone">Besoin d’aide ? Contactez le support.</p>`,
    before: `zone.textContent = 'Chargement...';
const data = await fetch('/commandes');
zone.innerHTML = rendu(data); // saut de mise en page`,
    after: `zone.setAttribute('aria-busy', 'true');
zone.innerHTML = squelette(3); // même hauteur que le résultat
statut.textContent = 'Récupération des commandes (2/3), environ 3 s';
const data = await fetch('/commandes');
zone.innerHTML = rendu(data);
zone.setAttribute('aria-busy', 'false');`,
    steps: [['click', '[data-r="go"]'], ['wait', 3300]],
  },
  {
    slug: 'priorite',
    title: 'Les douze boutons',
    ref: 'NN/g · Progressive disclosure',
    refUrl: 'https://www.nngroup.com/articles/progressive-disclosure/',
    explanation: 'Douze boutons identiques, et l’action principale (« Envoyer ») est noyée au milieu. Tout a le même poids, donc rien n’est important.',
    rule: 'L’action principale est unique et visible. Deux ou trois actions secondaires, et le reste derrière « Plus d’options ».',
    task: 'Envoyez le message.',
    bad: `
<p class="demo-label">Message prêt à partir.</p>
<div class="toolbar wrap" data-r="bar">
  <button type="button" class="btn btn-gris btn-sm" data-r="b">Gras</button><button type="button" class="btn btn-gris btn-sm" data-r="b">Italique</button><button type="button" class="btn btn-gris btn-sm" data-r="b">Lien</button><button type="button" class="btn btn-gris btn-sm" data-r="b">Emoji</button>
  <button type="button" class="btn btn-gris btn-sm" data-r="b">Joindre</button><button type="button" class="btn btn-gris btn-sm" data-r="b">Programmer</button><button type="button" class="btn btn-gris btn-sm" data-r="b">Brouillon</button><button type="button" class="btn btn-gris btn-sm" data-r="send">Envoyer</button>
  <button type="button" class="btn btn-gris btn-sm" data-r="b">Imprimer</button><button type="button" class="btn btn-gris btn-sm" data-r="b">Traduire</button><button type="button" class="btn btn-gris btn-sm" data-r="b">Signature</button><button type="button" class="btn btn-gris btn-sm" data-r="b">Supprimer</button>
</div>
<p class="backstage" data-r="log" aria-live="polite"></p>`,
    good: `
<p class="demo-label">Message prêt à partir.</p>
<div class="toolbar">
  <button type="button" class="btn btn-primary" data-r="send">Envoyer</button>
  <button type="button" class="btn btn-muet btn-sm">Joindre</button>
  <button type="button" class="btn btn-muet btn-sm">Programmer</button>
  <button type="button" class="btn btn-muet btn-sm" aria-expanded="false" aria-controls="pr-more" data-r="more">Plus ▾</button>
</div>
<div class="toolbar wrap" id="pr-more" data-r="panel" hidden>
  <button type="button" class="btn btn-muet btn-sm">Imprimer</button><button type="button" class="btn btn-muet btn-sm">Traduire</button><button type="button" class="btn btn-muet btn-sm">Signature</button><button type="button" class="btn btn-rouge btn-sm">Supprimer</button>
</div>
<p class="backstage" data-r="log" aria-live="polite"></p>`,
    before: `<button class="btn">Gras</button>
<!-- … 6 boutons … -->
<button class="btn">Envoyer</button>
<!-- … 4 boutons … -->`,
    after: `<button class="btn btn-primary">Envoyer</button>
<button class="btn">Joindre</button>
<button class="btn" aria-expanded="false"
  aria-controls="plus">Plus ▾</button>
<div id="plus" hidden>…</div>`,
    steps: [['click', '[data-r="b"] >> nth=0'], ['click', '[data-r="b"] >> nth=1'], ['click', '[data-r="b"] >> nth=2']],
  },
  {
    slug: 'resume-commande',
    title: 'Les frais surprises',
    ref: 'Directive 2011/83/UE · Information sur le prix total',
    refUrl: 'https://eur-lex.europa.eu/eli/dir/2011/83/oj',
    explanation: 'Le panier affiche 49,90 €. Les frais de livraison et de service n’apparaissent qu’une fois le paiement validé. C’est le « drip pricing », la première cause d’abandon de panier.',
    rule: 'Avant le paiement, un récapitulatif complet avec tous les frais, le total TTC et des liens pour modifier. Le bouton annonce le montant exact.',
    task: 'Payez votre casque audio. (Simulation, aucun paiement réel.)',
    bad: `
<div class="recap">
  <p class="recap-line"><span>Casque audio</span><strong>49,90 €</strong></p>
  <button type="button" class="btn btn-primary" data-r="pay">Payer</button>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    good: `
<div class="recap">
  <p class="recap-line"><span>Casque audio</span><span>49,90 €</span></p>
  <p class="recap-line"><span>Livraison Colissimo 48 h <button type="button" class="link-plain">Modifier</button></span><span>6,90 €</span></p>
  <p class="recap-line"><span>Frais de service</span><span>4,90 €</span></p>
  <p class="recap-line total"><span>Total TTC</span><strong>61,70 €</strong></p>
  <button type="button" class="btn btn-primary" data-r="pay">Payer 61,70 €</button>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    before: `<p>Casque audio : 49,90 €</p>
<button>Payer</button>
<!-- frais ajoutés côté serveur -->`,
    after: `<dl class="recap">
  <dt>Casque audio</dt><dd>49,90 €</dd>
  <dt>Livraison 48 h</dt><dd>6,90 €</dd>
  <dt>Frais de service</dt><dd>4,90 €</dd>
  <dt>Total TTC</dt><dd>61,70 €</dd>
</dl>
<button>Payer 61,70 €</button>`,
    steps: [['click', '[data-r="pay"]']],
  },
  {
    slug: 'rappel',
    title: 'Les rappels imposés',
    ref: 'Nielsen #7 · Flexibilité et efficacité',
    refUrl: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    explanation: 'Les rappels sont activés d’office, toutes les heures, sans réglage possible. Au bout d’une journée, on les désactive tous… ou on désinstalle.',
    rule: 'Laisser choisir la fréquence, l’heure et le canal. Montrer le prochain rappel prévu. « Jamais » est une option légitime.',
    task: 'Simulez une journée d’utilisation.',
    bad: `
<p class="demo-label">Rappels : <strong>activés ✓</strong></p>
<button type="button" class="btn btn-muet" data-r="day">⏩ Simuler 24 h</button>
<p class="backstage">🔔 Rappels reçus : <strong data-r="count">0</strong></p>
<ul class="notif-pile" data-r="pile" aria-hidden="true"></ul>`,
    good: `
<div class="demo-form">
  <div class="field">
    <label for="rp-freq">Fréquence</label>
    <select id="rp-freq" data-r="freq">
      <option value="0">Jamais</option>
      <option value="1" selected>1 fois par jour</option>
      <option value="0.43">3 fois par semaine</option>
      <option value="0.14">1 fois par semaine</option>
    </select>
  </div>
  <div class="field">
    <label for="rp-heure">Heure</label>
    <input type="time" id="rp-heure" value="09:00" data-r="time">
  </div>
  <p class="hint" data-r="next" aria-live="polite"></p>
  <button type="button" class="btn btn-muet" data-r="day">⏩ Simuler 24 h</button>
  <p class="backstage">🔔 Rappels reçus : <strong data-r="count">0</strong></p>
</div>`,
    before: `// Activé par défaut, non configurable
setInterval(envoyerRappel, 60 * 60 * 1000);`,
    after: `<select id="frequence">
  <option value="jamais">Jamais</option>
  <option value="jour" selected>1 fois par jour</option>
  <option value="semaine">1 fois par semaine</option>
</select>
<input type="time" id="heure" value="09:00">
<p aria-live="polite">Prochain rappel : demain à 09:00</p>`,
    steps: [['click', '[data-r="day"]']],
  },
  {
    slug: 'sauvegarde',
    title: 'La sauvegarde qui bloque',
    ref: 'WCAG 4.1.3 · Messages d’état',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html',
    explanation: 'À chaque pause dans la frappe, un voile « Sauvegarde en cours… » bloque l’éditeur. Les lettres tapées pendant ce temps sont perdues.',
    rule: 'La sauvegarde automatique ne bloque jamais. Un statut discret (aria-live="polite") indique « Enregistrement… » puis « Enregistré à 14:02 ».',
    task: 'Écrivez une phrase et faites une courte pause.',
    bad: `
<div class="editor" data-r="editor">
  <label for="sv-m-text">Note</label>
  <textarea id="sv-m-text" rows="4" data-r="text"></textarea>
  <div class="editor-veil" data-r="veil" hidden><div class="spinner" aria-hidden="true"></div><p>Sauvegarde en cours… ne quittez pas</p></div>
</div>`,
    good: `
<div class="editor">
  <label for="sv-b-text">Note</label>
  <textarea id="sv-b-text" rows="4" data-r="text"></textarea>
  <p class="save-status" data-r="status" role="status">Toutes les modifications sont enregistrées.</p>
</div>`,
    before: `texte.addEventListener('input', debounce(async () => {
  voile.hidden = false;
  texte.disabled = true;   // bloque la frappe
  await sauvegarder();
  texte.disabled = false;
  voile.hidden = true;
}, 800));`,
    after: `<p id="statut" role="status"></p>
<script>
  texte.addEventListener('input', debounce(async () => {
    statut.textContent = 'Enregistrement…';
    await sauvegarder();
    statut.textContent = 'Enregistré à ' + heure();
  }, 800));
</script>`,
    steps: [['type', '[data-r="text"]', 'Bonjour'], ['wait', 1300]],
  },
  {
    slug: 'favoris',
    title: 'Le favori en trois étapes',
    ref: 'Loi de Fitts · Lois de l’UX',
    refUrl: 'https://lawsofux.com/fittss-law/',
    explanation: 'Mettre un article en favori demande trois écrans : choisir une liste, nommer le favori, confirmer. Un geste qui devrait prendre une seconde devient une corvée.',
    rule: 'Un bouton bascule en un clic (aria-pressed). Le classement en listes reste possible, mais après coup et en option.',
    task: 'Ajoutez cette randonnée à vos favoris.',
    bad: `
<div class="card-item">
  <p class="demo-label">Randonnée · Gorges du Verdon</p>
  <button type="button" class="btn btn-muet" data-r="open">Ajouter aux favoris</button>
  <div class="wizard" data-r="wizard" hidden>
    <p class="wizard-step" data-r="step"></p>
    <div data-r="body"></div>
    <button type="button" class="btn btn-primary btn-sm" data-r="next">Suivant</button>
  </div>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    good: `
<div class="card-item">
  <p class="demo-label">Randonnée · Gorges du Verdon</p>
  <button type="button" class="btn btn-muet fav-btn" aria-pressed="false" data-r="fav">♡ Ajouter aux favoris</button>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    before: `<button onclick="ouvrirAssistantFavori()">
  Ajouter aux favoris
</button> <!-- 3 étapes -->`,
    after: `<button aria-pressed="false" id="fav">♡ Ajouter aux favoris</button>
<script>
  fav.addEventListener('click', () => {
    const on = fav.getAttribute('aria-pressed') !== 'true';
    fav.setAttribute('aria-pressed', String(on));
    fav.textContent = on ? '♥ Dans vos favoris' : '♡ Ajouter aux favoris';
  });
</script>`,
    steps: [['click', '[data-r="open"]'], ['click', '[data-r="next"]']],
  },
  {
    slug: 'recherche-autocomplet',
    title: 'L’autocomplétion sponsorisée',
    ref: 'WAI-ARIA APG · Combobox',
    refUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
    explanation: 'Les suggestions commencent par deux produits sponsorisés sans rapport, se réordonnent à chaque lettre et ne s’atteignent qu’à la souris.',
    rule: 'Les suggestions correspondent à la saisie, avec la partie tapée mise en évidence, gardent un ordre stable et se parcourent aux flèches (role="combobox").',
    task: 'Cherchez « casque ».',
    bad: `
<div class="field">
  <label for="ac-m-q">Rechercher un produit</label>
  <input type="text" id="ac-m-q" data-r="q" autocomplete="off">
  <div class="suggest" data-r="list"></div>
</div>`,
    good: `
<div class="field combo">
  <label for="ac-b-q">Rechercher un produit</label>
  <input type="text" id="ac-b-q" data-r="q" role="combobox" aria-expanded="false" aria-controls="ac-b-list" aria-autocomplete="list" autocomplete="off">
  <ul class="suggest" id="ac-b-list" role="listbox" aria-label="Suggestions" data-r="list" hidden></ul>
  <p class="hint">↑ ↓ pour parcourir, Entrée pour choisir, Échap pour fermer.</p>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    before: `<input id="q">
<div class="suggestions"><!-- div cliquables, triés au hasard --></div>`,
    after: `<input id="q" role="combobox" aria-expanded="true"
  aria-controls="liste" aria-activedescendant="opt-1">
<ul id="liste" role="listbox">
  <li id="opt-1" role="option" aria-selected="true">
    <mark>cas</mark>que audio
  </li>
</ul>`,
    steps: [['type', '[data-r="q"]', 'cas']],
  },
  {
    slug: 'nouveaute',
    title: 'Le badge « Nouveau ! » partout',
    ref: 'WCAG 2.2.2 · Mettre en pause, arrêter, masquer',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html',
    explanation: 'Des badges « NOUVEAU ! » qui pulsent sur tout le menu, et une visite guidée qui se rouvre après fermeture. Quand tout est nouveau, plus rien ne l’est.',
    rule: 'Un repère discret et immobile sur la seule vraie nouveauté. Il disparaît une fois vu, et « Quoi de neuf ? » reste consultable à la demande.',
    task: 'Fermez la visite guidée pour accéder au menu.',
    bad: `
<div class="mini-app">
  <ul class="mini-menu">
    <li>Tableau de bord <span class="badge-loud">NOUVEAU !</span></li>
    <li>Projets <span class="badge-loud">NOUVEAU !</span></li>
    <li>Équipe <span class="badge-loud">NOUVEAU !</span></li>
    <li>Rapports <span class="badge-loud">NOUVEAU !</span></li>
  </ul>
  <div class="mini-popup" data-r="popup" role="dialog" aria-label="Visite guidée">
    <p>🎉 Découvrez nos 4 nouveautés !</p>
    <button type="button" class="btn btn-ambre btn-sm" data-r="close">Fermer</button>
  </div>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    good: `
<div class="mini-app">
  <ul class="mini-menu">
    <li>Tableau de bord</li>
    <li><button type="button" class="link-plain" data-r="item">Rapports</button> <span class="badge-quiet" data-r="dot">Nouveau</span></li>
    <li>Projets</li>
    <li>Équipe</li>
  </ul>
  <button type="button" class="link-plain" data-r="news">Quoi de neuf ?</button>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    before: `.badge { animation: pulse 0.8s infinite; }
popup.addEventListener('close', () =>
  setTimeout(() => popup.showModal(), 1500));`,
    after: `<li>
  Rapports
  <span class="badge-discret">Nouveau</span>
</li>
<script>
  // Le badge disparaît une fois la fonctionnalité visitée
  if (localStorage.getItem('vu-rapports')) badge.remove();
</script>`,
    steps: [['click', '[data-r="close"]'], ['wait', 1200], ['click', '[data-r="close"]']],
  },
  {
    slug: 'reexperience',
    title: 'Le paiement à refaire',
    ref: 'Nielsen #9 · Diagnostiquer et réparer les erreurs',
    refUrl: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    explanation: 'Une coupure réseau pendant l’envoi, et le formulaire est entièrement vidé avec « Une erreur est survenue ». Tout est à refaire, sans savoir si le paiement est passé.',
    rule: 'Expliquer ce qui s’est passé (et ce qui n’a pas été débité), conserver les saisies et proposer « Réessayer ».',
    task: 'Validez la réservation. (Le réseau va couper, c’est prévu.)',
    bad: `
<form class="demo-form" data-r="form" novalidate>
  <div class="field"><label for="rx-m-nom">Nom</label><input type="text" id="rx-m-nom" value="Camille Martin"></div>
  <div class="field"><label for="rx-m-date">Date</label><input type="text" id="rx-m-date" value="12/12/2026"></div>
  <div class="field"><label for="rx-m-pers">Personnes</label><input type="text" id="rx-m-pers" value="4"></div>
  <button type="submit" class="btn btn-primary">Réserver</button>
  <p class="error-banner" data-r="err" role="alert" hidden>Une erreur est survenue. Veuillez recommencer.</p>
</form>`,
    good: `
<form class="demo-form" data-r="form" novalidate>
  <div class="field"><label for="rx-b-nom">Nom</label><input type="text" id="rx-b-nom" value="Camille Martin"></div>
  <div class="field"><label for="rx-b-date">Date</label><input type="text" id="rx-b-date" value="12/12/2026"></div>
  <div class="field"><label for="rx-b-pers">Personnes</label><input type="text" id="rx-b-pers" value="4"></div>
  <button type="submit" class="btn btn-primary" data-r="submit">Réserver</button>
  <p class="notice" data-r="msg" role="alert" hidden></p>
</form>`,
    before: `} catch (e) {
  form.reset();
  alert('Une erreur est survenue.');
}`,
    after: `} catch (e) {
  // Les champs restent remplis
  message.textContent = 'Connexion interrompue. '
    + 'Vos informations sont conservées, rien n\\'a été réservé.';
  bouton.textContent = 'Réessayer';
}`,
    steps: [['click', 'button[type="submit"]']],
  },
  {
    slug: 'cache-saisi',
    title: 'Le brouillon perdu',
    ref: 'WCAG 2.2.5 · Nouvelle authentification (données conservées)',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/re-authenticating.html',
    explanation: 'Un long avis rédigé, un rafraîchissement accidentel (geste de tirer vers le bas, retour arrière), et tout est perdu.',
    rule: 'Enregistrer le brouillon localement pendant la saisie, le restaurer au retour, et proposer de l’effacer.',
    task: 'Écrivez quelques mots, puis simulez un rafraîchissement accidentel.',
    bad: `
<div class="field">
  <label for="cs-m-avis">Votre avis</label>
  <textarea id="cs-m-avis" rows="4" data-r="text">Très bon séjour, l’accueil était</textarea>
</div>
<button type="button" class="btn btn-muet" data-r="refresh">↻ Simuler un rafraîchissement</button>
<p class="backstage" data-r="log" aria-live="polite"></p>`,
    good: `
<div class="field">
  <label for="cs-b-avis">Votre avis</label>
  <textarea id="cs-b-avis" rows="4" data-r="text">Très bon séjour, l’accueil était</textarea>
</div>
<button type="button" class="btn btn-muet" data-r="refresh">↻ Simuler un rafraîchissement</button>
<p class="notice" data-r="restored" role="status" hidden>Brouillon restauré. <button type="button" class="link-plain" data-r="clear">Effacer le brouillon</button></p>`,
    before: `<textarea name="avis"></textarea>
<!-- rien n'est conservé -->`,
    after: `const CLE = 'brouillon-avis';
avis.value = sessionStorage.getItem(CLE) ?? '';
avis.addEventListener('input', () =>
  sessionStorage.setItem(CLE, avis.value));
form.addEventListener('submit', () =>
  sessionStorage.removeItem(CLE));`,
    steps: [['click', '[data-r="refresh"]']],
  },
  {
    slug: 'lecture-seule',
    title: 'L’article envahi',
    ref: 'WCAG 1.4.8 · Présentation visuelle',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html',
    explanation: 'L’article est recouvert par une pop-up de newsletter, une bannière promo collante et des boutons de partage. Le texte, qui est la raison de la visite, passe en dernier.',
    rule: 'Proposer une lecture épurée : texte seul, taille réglable, aucune sollicitation qui recouvre le contenu.',
    task: 'Lisez l’article.',
    bad: `
<div class="article-frame">
  <p class="promo-sticky">🔥 −50 % sur tout le site !</p>
  <h4>Pourquoi les forêts brûlent plus tôt</h4>
  <p>Les saisons des feux commencent désormais en avril dans le sud de la France. La sécheresse des sols, plus précoce, en est la cause principale.</p>
  <div class="share-col" aria-hidden="true">f · X · in · ✉</div>
  <div class="newsletter-pop" data-r="pop" role="dialog" aria-label="Newsletter">
    <p>Ne partez pas ! Inscrivez-vous à la newsletter.</p>
    <button type="button" class="close-tiny" aria-label="Fermer" data-r="close">×</button>
  </div>
</div>`,
    good: `
<div class="toolbar">
  <button type="button" class="btn btn-muet btn-sm" aria-pressed="false" data-r="reader">📖 Mode lecture</button>
  <button type="button" class="btn btn-muet btn-sm" data-r="minus" aria-label="Réduire le texte">A−</button>
  <button type="button" class="btn btn-muet btn-sm" data-r="plus" aria-label="Agrandir le texte">A+</button>
</div>
<div class="article-frame" data-r="article">
  <p class="promo-sticky soft" data-r="extra">Offre du moment : −50 %</p>
  <h4>Pourquoi les forêts brûlent plus tôt</h4>
  <p>Les saisons des feux commencent désormais en avril dans le sud de la France. La sécheresse des sols, plus précoce, en est la cause principale.</p>
</div>`,
    before: `<article>…</article>
<div class="promo" style="position: sticky"></div>
<dialog open class="newsletter">…</dialog>`,
    after: `<button aria-pressed="false" id="lecture">Mode lecture</button>
<style>
  .lecture .promo, .lecture .partage { display: none; }
  .lecture article { max-width: 65ch; font-size: 1.15rem; }
</style>`,
    steps: [['click', '[data-r="close"]']],
  },
  {
    slug: 'historique-nav',
    title: 'Le retour qui efface',
    ref: 'WCAG 3.3.7 · Saisie redondante',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html',
    explanation: 'Le parcours en 3 étapes n’a pas de bouton « Précédent ». Le retour du navigateur ramène à l’étape 1 avec des champs vides.',
    rule: 'Un fil d’étapes cliquable, un bouton « Précédent » qui conserve les données, et un retour navigateur qui revient d’une seule étape.',
    task: 'Passez à l’étape 2, puis revenez corriger votre nom.',
    bad: `
<div class="wizard-box" data-r="box">
  <p class="wizard-step" data-r="step">Étape 1 sur 3 · Coordonnées</p>
  <div class="field"><label for="hn-m-f" data-r="label">Nom</label><input type="text" id="hn-m-f" data-r="field" value="Camille"></div>
  <div class="toolbar">
    <button type="button" class="btn btn-gris btn-sm" data-r="back">← Retour (navigateur)</button>
    <button type="button" class="btn btn-primary btn-sm" data-r="next">Continuer</button>
  </div>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    good: `
<div class="wizard-box" data-r="box">
  <ol class="stepper" data-r="stepper">
    <li><button type="button" class="link-plain" data-r="goto" data-step="0">1. Coordonnées</button></li>
    <li><button type="button" class="link-plain" data-r="goto" data-step="1">2. Livraison</button></li>
    <li><button type="button" class="link-plain" data-r="goto" data-step="2">3. Paiement</button></li>
  </ol>
  <div class="field"><label for="hn-b-f" data-r="label">Nom</label><input type="text" id="hn-b-f" data-r="field" value="Camille"></div>
  <div class="toolbar">
    <button type="button" class="btn btn-muet btn-sm" data-r="prev">← Précédent</button>
    <button type="button" class="btn btn-primary btn-sm" data-r="next">Continuer</button>
  </div>
</div>`,
    before: `// Une seule URL pour tout le parcours,
// pas de bouton Précédent, état en mémoire seulement`,
    after: `<ol class="etapes">
  <li><a href="?etape=1" aria-current="step">Coordonnées</a></li>
  <li><a href="?etape=2">Livraison</a></li>
</ol>
<button type="button" onclick="precedent()">← Précédent</button>
<script>
  // Chaque étape a son URL, les données vivent dans un brouillon
  history.pushState({ etape }, '', '?etape=' + etape);
</script>`,
    steps: [['click', '[data-r="next"]'], ['click', '[data-r="back"]']],
  },
  {
    slug: 'aide-inline',
    title: 'L’aide qui fait quitter la page',
    ref: 'Nielsen #10 · Aide et documentation',
    refUrl: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    explanation: 'Le lien « Besoin d’aide ? » remplace le formulaire par un guide de 12 pages. Au retour, le champ est vide.',
    rule: 'L’aide s’affiche à côté du champ, sans quitter l’écran : indication permanente du format, et un bouton « ? » qui déplie une explication.',
    task: 'Trouvez où se trouve votre numéro fiscal.',
    bad: `
<div class="help-zone" data-r="zone">
  <div class="field">
    <label for="ai-m-nf">Numéro fiscal de référence</label>
    <input type="text" id="ai-m-nf" data-r="field" value="30 12">
  </div>
  <button type="button" class="link-plain" data-r="help">Besoin d’aide ?</button>
</div>
<div class="help-page" data-r="page" hidden>
  <p><strong>Guide du contribuable (PDF, 12 pages)</strong></p>
  <p>Chapitre 1 : Historique de l’impôt sur le revenu depuis 1914…</p>
  <button type="button" class="btn btn-muet btn-sm" data-r="return">Retour au formulaire</button>
</div>`,
    good: `
<div class="field">
  <div class="label-row">
    <label for="ai-b-nf">Numéro fiscal de référence</label>
    <button type="button" class="tip-btn" aria-expanded="false" aria-controls="ai-b-tip" data-r="tip" aria-label="Aide : numéro fiscal">?</button>
  </div>
  <input type="text" id="ai-b-nf" value="30 12" inputmode="numeric" aria-describedby="ai-b-hint">
  <p class="hint" id="ai-b-hint">13 chiffres, par exemple 30 12 345 678 901</p>
  <p class="tip" id="ai-b-tip" data-r="tipbox" hidden>Il figure en haut à gauche de votre dernier avis d’impôt, et dans votre espace particulier.</p>
</div>`,
    before: `<label for="nf">Numéro fiscal</label>
<input id="nf">
<a href="/guide.pdf">Besoin d'aide ?</a>`,
    after: `<label for="nf">Numéro fiscal</label>
<button aria-expanded="false" aria-controls="aide-nf">?</button>
<input id="nf" aria-describedby="format-nf">
<p id="format-nf">13 chiffres, ex. 30 12 345 678 901</p>
<p id="aide-nf" hidden>En haut à gauche de votre avis d'impôt.</p>`,
    steps: [['click', '[data-r="help"]']],
  },
  {
    slug: 'securite',
    title: 'Le paiement sans repère',
    ref: 'Baymard · Perceived security in checkout',
    refUrl: 'https://baymard.com/blog/perceived-security-of-payment-form',
    explanation: 'Le formulaire de carte bancaire arrive sans aucun repère : pas d’explication sur la protection, adresse en http, style différent du reste du site. On hésite à saisir sa carte, à raison.',
    rule: 'Une connexion https, et près du champ de carte une phrase claire : qui traite le paiement, ce qui est conservé et ce qui ne l’est pas.',
    task: 'Saisissez votre carte et payez. (Faux formulaire, rien n’est envoyé.)',
    bad: `
<div class="browser">
  <p class="browser-bar insecure">⚠ Non sécurisé · http://paiement-boutique.biz</p>
  <div class="demo-form pay-raw">
    <label for="sc-m-cb">CARTE</label>
    <input type="text" id="sc-m-cb" inputmode="numeric" value="4242 4242 4242 4242">
    <button type="button" class="btn btn-gris" data-r="pay">OK</button>
  </div>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    good: `
<div class="browser">
  <p class="browser-bar secure">🔒 https://boutique.fr/paiement</p>
  <div class="demo-form">
    <label for="sc-b-cb">Numéro de carte</label>
    <input type="text" id="sc-b-cb" inputmode="numeric" autocomplete="cc-number" value="4242 4242 4242 4242" aria-describedby="sc-b-info">
    <p class="hint" id="sc-b-info">🔒 Paiement chiffré, traité par notre prestataire bancaire. Votre numéro n’est jamais stocké chez nous.</p>
    <button type="button" class="btn btn-primary" data-r="pay">Payer 61,70 €</button>
  </div>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    before: `<form action="http://paiement-boutique.biz">
  <input name="carte"> <button>OK</button>
</form>`,
    after: `<form action="https://boutique.fr/paiement">
  <label for="cb">Numéro de carte</label>
  <input id="cb" autocomplete="cc-number"
    aria-describedby="info-cb">
  <p id="info-cb">🔒 Paiement chiffré, numéro jamais stocké.</p>
</form>`,
    steps: [['click', '[data-r="pay"]']],
  },
  {
    slug: 'zoom',
    title: 'Le zoom sans frein',
    ref: 'WCAG 1.4.4 · Redimensionnement du texte',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html',
    explanation: 'Le bouton « + » zoome sans limite, il n’y a ni « − » ni réinitialisation, et le niveau n’est jamais affiché. Après trois clics, on ne voit plus qu’un pixel géant.',
    rule: 'Un zoom borné (ici 100 à 300 %), avec « − », « + », « Réinitialiser », le niveau affiché, et un défilement pour explorer. Ne jamais bloquer le zoom natif (user-scalable=no).',
    task: 'Zoomez sur le plan, puis revenez à la vue d’ensemble.',
    bad: `
<div class="zoom-view" data-r="view"><div class="zoom-map" data-r="map" aria-hidden="true">🏠 🌳 🏫<br>🏪 📍 🏥<br>🌳 🚉 🏠</div></div>
<button type="button" class="btn btn-muet" data-r="plus" aria-label="Zoomer">+</button>`,
    good: `
<div class="zoom-view scroll" data-r="view"><div class="zoom-map" data-r="map" role="img" aria-label="Plan du quartier">🏠 🌳 🏫<br>🏪 📍 🏥<br>🌳 🚉 🏠</div></div>
<div class="toolbar">
  <button type="button" class="btn btn-muet btn-sm" data-r="minus" aria-label="Dézoomer">−</button>
  <output class="zoom-level" data-r="level" aria-live="polite">100 %</output>
  <button type="button" class="btn btn-muet btn-sm" data-r="plus" aria-label="Zoomer">+</button>
  <button type="button" class="btn btn-muet btn-sm" data-r="reset">Réinitialiser</button>
</div>`,
    before: `<meta name="viewport"
  content="width=device-width, user-scalable=no">
plus.onclick = () => (zoom *= 1.8);`,
    after: `const MIN = 1, MAX = 3, PAS = 0.25;
function zoomer(delta) {
  zoom = Math.min(MAX, Math.max(MIN, zoom + delta));
  carte.style.transform = 'scale(' + zoom + ')';
  niveau.value = Math.round(zoom * 100) + ' %';
  moins.disabled = zoom === MIN;
  plus.disabled = zoom === MAX;
}`,
    steps: [['click', '[data-r="plus"]'], ['click', '[data-r="plus"]'], ['click', '[data-r="plus"]']],
  },
  {
    slug: 'notation',
    title: 'La note sous condition',
    ref: 'Nielsen #8 · Design esthétique et minimaliste',
    refUrl: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    explanation: 'Cliquer sur une étoile ouvre un formulaire qui exige un commentaire de 50 caractères et un email. La note n’est pas enregistrée tant qu’on ne l’a pas rempli.',
    rule: 'La note est enregistrée dès le clic. Le commentaire reste facultatif et proposé ensuite.',
    task: 'Donnez 4 étoiles à ce restaurant.',
    bad: `
<div class="rating">
  <p class="demo-label">Chez Lucette · bistrot</p>
  <div class="stars" data-r="stars">
    <button type="button" class="star" aria-label="1 étoile" data-r="star">★</button><button type="button" class="star" aria-label="2 étoiles" data-r="star">★</button><button type="button" class="star" aria-label="3 étoiles" data-r="star">★</button><button type="button" class="star" aria-label="4 étoiles" data-r="star">★</button><button type="button" class="star" aria-label="5 étoiles" data-r="star">★</button>
  </div>
  <div class="wizard" data-r="modal" hidden>
    <p><strong>Pour publier votre note</strong>, rédigez un avis (50 caractères minimum) et indiquez votre email.</p>
    <label for="nt-m-avis">Avis</label><textarea id="nt-m-avis" rows="2"></textarea>
    <label for="nt-m-mail">Email</label><input type="email" id="nt-m-mail">
    <button type="button" class="btn btn-primary btn-sm" disabled>Publier (0/50)</button>
  </div>
</div>`,
    good: `
<fieldset class="rating">
  <legend class="demo-label">Chez Lucette · bistrot</legend>
  <div class="stars stars-radio" data-r="stars">
    <input type="radio" name="nt-b" id="nt-b-1" value="1"><label for="nt-b-1" aria-label="1 étoile">★</label>
    <input type="radio" name="nt-b" id="nt-b-2" value="2"><label for="nt-b-2" aria-label="2 étoiles">★</label>
    <input type="radio" name="nt-b" id="nt-b-3" value="3"><label for="nt-b-3" aria-label="3 étoiles">★</label>
    <input type="radio" name="nt-b" id="nt-b-4" value="4"><label for="nt-b-4" aria-label="4 étoiles">★</label>
    <input type="radio" name="nt-b" id="nt-b-5" value="5"><label for="nt-b-5" aria-label="5 étoiles">★</label>
  </div>
  <p class="backstage" data-r="log" role="status"></p>
</fieldset>`,
    before: `etoile.addEventListener('click', () =>
  ouvrirModale({ avisMin: 50, email: true }));`,
    after: `<fieldset>
  <legend>Votre note</legend>
  <input type="radio" name="note" id="n4" value="4">
  <label for="n4">4 étoiles</label>
</fieldset>
<script>
  form.addEventListener('change', (e) => {
    enregistrerNote(e.target.value); // immédiat
    proposerCommentaire();           // facultatif
  });
</script>`,
    steps: [['click', '[data-r="star"] >> nth=3']],
  },
  {
    slug: 'statut-multi',
    title: 'L’écrasement silencieux',
    ref: 'NN/g · Visibility of system status',
    refUrl: 'https://www.nngroup.com/articles/visibility-system-status/',
    explanation: 'Deux personnes modifient le même paragraphe sans le savoir. À l’enregistrement, la dernière version écrase l’autre, et on l’apprend après coup.',
    rule: 'Montrer la présence avant l’édition : qui est là, sur quelle partie. Proposer d’attendre, de suggérer, ou de travailler ailleurs.',
    task: 'Modifiez le budget et enregistrez.',
    bad: `
<div class="doc">
  <label for="sm-m-budget">Budget 2027</label>
  <textarea id="sm-m-budget" rows="2" data-r="text">12 000 € pour la communication.</textarea>
  <button type="button" class="btn btn-primary btn-sm" data-r="save">Enregistrer</button>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    good: `
<div class="doc">
  <p class="presence" data-r="presence"><span class="avatar" aria-hidden="true">C</span> Camille modifie ce paragraphe</p>
  <label for="sm-b-budget">Budget 2027</label>
  <textarea id="sm-b-budget" rows="2" data-r="text" readonly aria-describedby="sm-b-lock">12 000 € pour la communication.</textarea>
  <p class="hint" id="sm-b-lock" data-r="lock">Verrouillé pendant que Camille écrit.</p>
  <button type="button" class="btn btn-muet btn-sm" data-r="notify">Me prévenir quand c’est libre</button>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    before: `enregistrer.onclick = () =>
  api.put('/doc/budget', texte.value); // écrase sans prévenir`,
    after: `socket.on('presence', ({ nom, section }) => {
  afficherPresence(nom, section);
  if (section === 'budget') {
    texte.readOnly = true;
    verrou.textContent = nom + ' modifie ce paragraphe';
  }
});`,
    steps: [['click', '[data-r="save"]']],
  },
  {
    slug: 'session',
    title: 'La session expirée',
    ref: 'WCAG 2.2.5 · Nouvelle authentification',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/re-authenticating.html',
    explanation: 'Après une pause, la session a expiré : retour à l’accueil, panier vide, il faut tout recommencer.',
    rule: 'Prévenir avant l’expiration avec « Prolonger », puis, après reconnexion, revenir exactement à la même étape avec les mêmes données.',
    task: 'Faites une pause café en pleine commande.',
    bad: `
<div class="session-box" data-r="box">
  <p class="wizard-step">Étape 3 sur 4 · Livraison</p>
  <p data-r="cart">🛒 2 articles · 61,70 €</p>
  <button type="button" class="btn btn-muet" data-r="pause">☕ Revenir après 30 min</button>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    good: `
<div class="session-box" data-r="box">
  <p class="wizard-step">Étape 3 sur 4 · Livraison</p>
  <p data-r="cart">🛒 2 articles · 61,70 €</p>
  <button type="button" class="btn btn-muet" data-r="pause">☕ Revenir après 30 min</button>
  <p class="notice" data-r="log" role="status" hidden></p>
</div>`,
    before: `if (sessionExpiree()) {
  location.href = '/'; // panier et étape perdus
}`,
    after: `if (sessionExpiree()) {
  const reprise = encodeURIComponent(location.pathname);
  location.href = '/connexion?retour=' + reprise;
  // panier et étape conservés côté serveur
}`,
    steps: [['click', '[data-r="pause"]']],
  },
  {
    slug: 'validation-personnalisee',
    title: 'Le code en six cases',
    ref: 'WCAG 3.3.8 · Authentification accessible',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html',
    explanation: 'Seule méthode proposée : un code SMS, à taper dans 6 cases qui bloquent le collage. Pas de « renvoyer », pas d’alternative. Sans réseau, on est bloqué dehors.',
    rule: 'Plusieurs méthodes au choix (SMS, email, application, clé de sécurité), un seul champ qui accepte le collage et l’autoremplissage (autocomplete="one-time-code").',
    task: 'Collez (Ctrl+V) ou tapez le code reçu : 123456.',
    bad: `
<div class="otp">
  <p class="demo-label">Code envoyé au 06 •• •• •• 12</p>
  <div class="otp-boxes" data-r="boxes">
    <input type="text" maxlength="1" aria-label="Chiffre 1" data-r="box"><input type="text" maxlength="1" aria-label="Chiffre 2" data-r="box"><input type="text" maxlength="1" aria-label="Chiffre 3" data-r="box"><input type="text" maxlength="1" aria-label="Chiffre 4" data-r="box"><input type="text" maxlength="1" aria-label="Chiffre 5" data-r="box"><input type="text" maxlength="1" aria-label="Chiffre 6" data-r="box">
  </div>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    good: `
<form class="demo-form" data-r="form" novalidate>
  <fieldset class="methods">
    <legend>Recevoir un code par</legend>
    <label><input type="radio" name="vp-m" checked> SMS</label>
    <label><input type="radio" name="vp-m"> Email</label>
    <label><input type="radio" name="vp-m"> Application d’authentification</label>
    <label><input type="radio" name="vp-m"> Clé de sécurité</label>
  </fieldset>
  <div class="field">
    <label for="vp-b-code">Code à 6 chiffres</label>
    <input type="text" id="vp-b-code" data-r="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-describedby="vp-b-hint">
    <p class="hint" id="vp-b-hint">Démo : 123456. Le collage est accepté.</p>
  </div>
  <div class="toolbar">
    <button type="submit" class="btn btn-primary btn-sm">Valider</button>
    <button type="button" class="link-plain">Renvoyer le code</button>
  </div>
  <p class="backstage" data-r="log" role="status"></p>
</form>`,
    before: `<input maxlength="1" onpaste="return false">
<!-- × 6, SMS uniquement -->`,
    after: `<fieldset>
  <legend>Recevoir un code par</legend>
  <label><input type="radio" name="m" checked> SMS</label>
  <label><input type="radio" name="m"> Email</label>
</fieldset>
<input inputmode="numeric" maxlength="6"
  autocomplete="one-time-code">`,
    steps: [['type', '[data-r="box"] >> nth=0', '1']],
  },
  {
    slug: 'activite',
    title: 'L’écran figé',
    ref: 'Seuil de Doherty · Lois de l’UX',
    refUrl: 'https://lawsofux.com/doherty-threshold/',
    explanation: 'Pendant la synchronisation, l’interface semble figée : aucun mouvement, aucun compteur. On pense que l’application a planté, on relance, et on crée des doublons.',
    rule: 'Pendant un traitement long, montrer que ça avance : compteur, élément en cours, signe de vie, et une annulation possible.',
    task: 'Synchronisez vos fichiers.',
    bad: `
<button type="button" class="btn btn-primary" data-r="go">Synchroniser 128 fichiers</button>
<p class="backstage">Synchronisations lancées : <strong data-r="count">0</strong></p>
<p class="backstage" data-r="log" aria-live="polite"></p>`,
    good: `
<button type="button" class="btn btn-primary" data-r="go">Synchroniser 128 fichiers</button>
<div class="activity" data-r="box" hidden>
  <span class="pulse-dot" aria-hidden="true"></span>
  <p data-r="text" role="status"></p>
  <progress max="128" value="0" data-r="bar" aria-label="Fichiers synchronisés"></progress>
  <button type="button" class="btn btn-muet btn-sm" data-r="cancel">Annuler</button>
</div>`,
    before: `bouton.onclick = async () => {
  await synchroniser(fichiers); // 4 s sans aucun signe
  info.textContent = 'Terminé';
};`,
    after: `bouton.disabled = true;
for (const [i, f] of fichiers.entries()) {
  statut.textContent = (i + 1) + ' / ' + fichiers.length + ' · ' + f.nom;
  barre.value = i + 1;
  await synchroniser(f);
}`,
    steps: [['click', '[data-r="go"]'], ['wait', 4300]],
  },
  {
    slug: 'priorite-notif',
    title: 'Tout en rouge',
    ref: 'Apple HIG · Managing notifications',
    refUrl: 'https://developer.apple.com/design/human-interface-guidelines/managing-notifications',
    explanation: 'Huit notifications, toutes en rouge, toutes au même niveau. Le paiement refusé est coincé entre un sticker gratuit et un rappel de newsletter.',
    rule: 'Trier par urgence (urgent, aujourd’hui, plus tard), réserver le rouge aux vraies urgences, et permettre de couper une catégorie entière.',
    task: 'Trouvez la notification urgente.',
    bad: `
<ul class="notif-list" data-r="list">
  <li><button type="button" class="notif loud" data-r="n">🔴 Nouveau sticker disponible !</button></li>
  <li><button type="button" class="notif loud" data-r="n">🔴 Léa a aimé votre photo</button></li>
  <li><button type="button" class="notif loud" data-r="n">🔴 -20 % ce week-end</button></li>
  <li><button type="button" class="notif loud" data-r="n">🔴 Votre résumé hebdo</button></li>
  <li><button type="button" class="notif loud" data-r="urgent">🔴 Paiement refusé : abonnement suspendu demain</button></li>
  <li><button type="button" class="notif loud" data-r="n">🔴 3 nouveaux abonnés</button></li>
  <li><button type="button" class="notif loud" data-r="n">🔴 Mise à jour disponible</button></li>
  <li><button type="button" class="notif loud" data-r="n">🔴 Rappel : newsletter</button></li>
</ul>
<p class="backstage" data-r="log" aria-live="polite"></p>`,
    good: `
<div class="notif-groups">
  <h4 class="notif-h urgent">Urgent (1)</h4>
  <ul class="notif-list"><li><span class="notif urgent">Paiement refusé : abonnement suspendu demain. <button type="button" class="link-plain">Mettre à jour la carte</button></span></li></ul>
  <h4 class="notif-h">Aujourd’hui</h4>
  <ul class="notif-list"><li><span class="notif">Léa a aimé votre photo</span></li><li><span class="notif">3 nouveaux abonnés</span></li></ul>
  <h4 class="notif-h">Plus tard <button type="button" class="btn btn-muet btn-sm" aria-pressed="false" data-r="mute">🔕 Couper les promos</button></h4>
  <ul class="notif-list" data-r="promos"><li><span class="notif">−20 % ce week-end</span></li><li><span class="notif">Nouveau sticker disponible</span></li></ul>
</div>`,
    before: `notifications.forEach(n => afficher(n, { couleur: 'rouge' }));`,
    after: `const groupes = Object.groupBy(notifications, n => n.priorite);
afficherGroupe('Urgent', groupes.urgent);
afficherGroupe('Aujourd\\'hui', groupes.normal);
if (!prefs.muet.promo) afficherGroupe('Plus tard', groupes.promo);`,
    steps: [['click', '[data-r="n"] >> nth=0'], ['click', '[data-r="n"] >> nth=1']],
  },
  {
    slug: 'export',
    title: 'L’export par courrier',
    ref: 'RGPD art. 20 · Droit à la portabilité',
    refUrl: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
    explanation: 'Pour récupérer ses données, il faut écrire un courrier avec une pièce d’identité, attendre 30 jours, et on reçoit un PDF scanné qu’aucun autre service ne sait importer.',
    rule: 'Un bouton en libre-service, le choix des catégories, un format structuré et lisible par machine (JSON, CSV), sans démarche papier.',
    task: 'Exportez vos données.',
    bad: `
<button type="button" class="btn btn-muet" data-r="go">Exporter mes données</button>
<div class="notice" data-r="msg" role="status" hidden>
  <p>Votre demande doit être adressée par <strong>courrier recommandé</strong>, accompagnée d’une copie de pièce d’identité, à : Service Données, BP 1234, 75999 Paris Cedex.</p>
  <p>Délai de traitement : 30 jours. Format : PDF (image scannée).</p>
</div>`,
    good: `
<form class="demo-form" data-r="form" novalidate>
  <fieldset class="methods">
    <legend>Données à inclure</legend>
    <label><input type="checkbox" name="cat" value="profil" checked> Profil</label>
    <label><input type="checkbox" name="cat" value="commandes" checked> Commandes</label>
    <label><input type="checkbox" name="cat" value="messages" checked> Messages</label>
  </fieldset>
  <fieldset class="methods">
    <legend>Format</legend>
    <label><input type="radio" name="fmt" value="json" checked> JSON</label>
    <label><input type="radio" name="fmt" value="csv"> CSV</label>
  </fieldset>
  <button type="submit" class="btn btn-primary">Télécharger l’archive</button>
  <p class="backstage" data-r="log" role="status"></p>
</form>`,
    before: `<p>Envoyez un courrier recommandé
avec une pièce d'identité…</p>`,
    after: `form.addEventListener('submit', (e) => {
  e.preventDefault();
  const donnees = collecter(categoriesChoisies());
  const blob = new Blob([JSON.stringify(donnees, null, 2)],
    { type: 'application/json' });
  telecharger(blob, 'mes-donnees.json');
});`,
    steps: [['click', '[data-r="go"]']],
  },
];

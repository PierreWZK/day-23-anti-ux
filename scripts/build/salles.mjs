/* Anti-UX · Données des 7 salles (un spécimen phare par salle).
 * Chaque entrée : contenu pédagogique, démo ratée, démo corrigée, code avant/après,
 * et `steps` : les gestes qui font "subir" le piège (utilisés par les tests Playwright).
 */

export const salles = [
  {
    slug: 'boutons',
    title: 'Le bouton muet',
    ref: 'Nielsen #1 · Visibilité de l’état du système',
    refUrl: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    explanation: 'Le bouton ne montre rien quand on clique : pas d’état de chargement, pas de confirmation. L’utilisateur doute, reclique, et la commande part deux ou trois fois.',
    rule: 'Toute action doit produire un retour visible en moins de 100 ms, et un bouton d’envoi se désactive pendant le traitement.',
    task: 'Validez la commande. Cliquez autant de fois que nécessaire pour être sûr que ça a marché.',
    bad: `<button class="btn btn-primary" id="btn-mal-boutons" data-r="btn">Cliquez ici</button>
<p class="backstage">En coulisses : <strong data-r="count">0</strong> commande(s) créée(s)</p>`,
    good: `<button class="btn btn-primary" id="btn-bien-boutons" data-r="btn">Cliquez ici</button>
<p class="backstage">En coulisses : <strong data-r="count">0</strong> commande(s) créée(s)</p>`,
    html: {
      before: `<button class="btn btn-primary" onclick="envoyer()">
  Cliquez ici
</button>`,
      after: `<button class="btn btn-primary disabled" id="btn-bien-boutons" data-r="btn">Cliquez ici</button>
<p class="backstage">Commande envoyée</p>
<script>
  envoi.addEventListener('click', async () => {
    envoi.disabled = true;
    envoi.textContent = 'Envoi…';
    await envoyer();
    envoi.textContent = '✓ Envoyé !';
  });
</script>`,
    },
    cssAfter: `.btn.btn-primary:disabled {
  background: #38a169;
  cursor: not-allowed;
  opacity: 0.8;
}

.btn.btn-primary::after {
  content: '✓';
  margin-left: 0.5rem;
}`,
    before: ``,
    after: ``,
    steps: [['click', '[data-r="btn"]'], ['click', '[data-r="btn"]']],
  },
  {
    slug: 'textes',
    title: 'Le texte d’exemple qui sert d’étiquette',
    ref: 'WCAG 3.3.2 · Étiquettes ou instructions',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html',
    explanation: 'L’intitulé est écrit en gris dans le champ et disparaît dès la première lettre. Impossible de vérifier ce qui était demandé, ni le format attendu. Ce gris clair est en plus peu lisible.',
    rule: 'Une étiquette visible au-dessus du champ, et le format attendu affiché en permanence en dessous.',
    task: 'Remplissez la date de naissance, puis essayez de retrouver le format demandé.',
    bad: `<div class="demo-form">
  <input type="text" class="input-ph" placeholder="Prénom" aria-label="Prénom" data-r="f1">
  <input type="text" class="input-ph" placeholder="Date de naissance (JJ/MM/AAAA)" aria-label="Date de naissance" data-r="f2">
  <input type="text" class="input-ph" placeholder="Code client (8 chiffres, sur la facture)" aria-label="Code client" data-r="f3">
</div>`,
    good: `<div class="demo-form">
  <div class="field">
    <label for="tx-prenom">Prénom</label>
    <input type="text" id="tx-prenom" autocomplete="given-name">
  </div>
  <div class="field">
    <label for="tx-naissance">Date de naissance</label>
    <input type="text" id="tx-naissance" inputmode="numeric" autocomplete="bday" aria-describedby="tx-naissance-hint">
    <p class="hint" id="tx-naissance-hint">Format : JJ/MM/AAAA, par exemple 14/07/1992</p>
  </div>
  <div class="field">
    <label for="tx-client">Code client</label>
    <input type="text" id="tx-client" inputmode="numeric" aria-describedby="tx-client-hint">
    <p class="hint" id="tx-client-hint">8 chiffres, en haut à droite de votre facture</p>
  </div>
</div>`,
    html: {
      before: `<div class="demo-form">
  <input type="text" class="input-ph" placeholder="Date de naissance (JJ/MM/AAAA)" aria-label="Date de naissance" data-r="f2">
</div>`,
      after: `<div class="field">
  <label for="naissance">Date de naissance</label>
  <input type="text" id="naissance"
    inputmode="numeric" autocomplete="bday"
    aria-describedby="naissance-hint">
  <p id="naissance-hint">Format : JJ/MM/AAAA</p>
</div>`,
    },
    cssAfter: `.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.field label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #d0d0d0;
}

.field input {
  padding: 0.6rem;
  border: 1px solid #555;
  border-radius: 0.35rem;
  background: #111;
  color: #fff;
}

.hint {
  font-size: 0.85rem;
  color: #888;
  margin-top: -0.5rem;
}`,
    before: ``,
    after: ``,
    steps: [['fill', '[data-r="f2"]', '14/07']],
  },
  {
    slug: 'formulaires',
    title: 'L’erreur vague',
    ref: 'WCAG 3.3.1 · Identification des erreurs',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html',
    explanation: 'Le formulaire refuse l’envoi avec un message global. Il ne dit ni quel champ pose problème, ni comment le corriger. On relit tout en devinant.',
    rule: 'Chaque erreur est liée à son champ (aria-describedby, aria-invalid), dit ce qui ne va pas et comment corriger.',
    task: 'Trouvez le champ fautif et renvoyez le formulaire.',
    bad: `<form class="demo-form" data-r="form" novalidate>
  <p class="error-message" role="alert">⚠ Erreur dans le formulaire</p>
  <div class="field">
    <label for="fm-prenom">Prénom</label>
    <input type="text" id="fm-prenom" value="Marie">
  </div>
  <div class="field">
    <label for="fm-email">Email</label>
    <input type="text" id="fm-email" value="marie@exemple">
  </div>
  <button type="submit" class="btn btn-primary">Envoyer</button>
</form>`,
    good: `<form class="demo-form" id="form-bien" novalidate>
  <div class="field">
    <label for="prenom">Prénom</label>
    <input type="text" id="prenom" value="Marie" autocomplete="given-name" aria-describedby="error-prenom">
    <p class="field-error" id="error-prenom" role="alert"></p>
  </div>
  <div class="field">
    <label for="email">Email</label>
    <input type="email" id="email" value="marie@exemple" autocomplete="email" aria-describedby="error-email">
    <p class="field-error" id="error-email" role="alert"></p>
  </div>
  <button type="submit" class="btn btn-primary">Envoyer</button>
  <p class="form-success" data-r="ok" role="status"></p>
</form>`,
    html: {
      before: `<form>
  <p class="error">⚠ Erreur dans le formulaire</p>
  <input type="text" id="email">
</form>`,
      after: `<form>
  <label for="email">Email</label>
  <input type="email" id="email"
    aria-invalid="true"
    aria-describedby="error-email">
  <p id="error-email" role="alert">
    Email invalide : il manque le domaine (ex. marie@exemple.fr)
  </p>
</form>`,
    },
    cssAfter: `.form-success {
  color: #38a169;
  font-weight: 600;
  margin-top: 1rem;
}

.field-error {
  color: #fc8181;
  font-size: 0.85rem;
  min-height: 1.5rem;
}

.form-success,
.field-error {
  transition: opacity 0.2s;
}

.field-error.fade-out {
  opacity: 0;
}`,
    before: ``,
    after: ``,
    steps: [['click', 'button[type="submit"]']],
  },
  {
    slug: 'navigation',
    title: 'Le menu qui se ferme tout seul',
    ref: 'WCAG 1.4.13 · Contenu au survol ou au focus',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html',
    explanation: 'Le sous-menu se referme au bout d’une seconde, avant qu’on ait eu le temps de viser. Au clavier ou avec un tremblement, il est inutilisable.',
    rule: 'Un menu reste ouvert jusqu’à une action explicite : clic, Échap ou clic à l’extérieur. L’état est exposé avec aria-expanded.',
    task: 'Ouvrez le menu Produits et choisissez Tarifs.',
    bad: `<nav class="demo-menu" aria-label="Menu de démonstration (raté)">
  <button type="button" class="btn btn-muet" id="menu-toggle-bad" data-r="toggle">Produits ▾</button>
  <ul class="demo-submenu" data-r="menu" hidden>
    <li><a href="#col-mal-navigation" data-r="item">Fonctionnalités</a></li>
    <li><a href="#col-mal-navigation" data-r="item">Tarifs</a></li>
    <li><a href="#col-mal-navigation" data-r="item">Témoignages</a></li>
  </ul>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</nav>`,
    good: `<nav class="demo-menu" aria-label="Menu de démonstration (corrigé)">
  <button type="button" class="btn btn-muet" id="menu-toggle-good" aria-expanded="false" aria-controls="menu-good" data-r="toggle">Produits ▾</button>
  <ul class="demo-submenu" id="menu-good" data-r="menu" hidden>
    <li><a href="#col-bien-navigation" data-r="item">Fonctionnalités</a></li>
    <li><a href="#col-bien-navigation" data-r="item">Tarifs</a></li>
    <li><a href="#col-bien-navigation" data-r="item">Témoignages</a></li>
  </ul>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</nav>`,
    html: {
      before: `<button id="toggle-bad">Menu</button>
<ul id="menu-bad" hidden>
  <li><a href="#">Tarifs</a></li>
</ul>`,
      after: `<button id="toggle-good" aria-expanded="false" aria-controls="menu-good">Menu</button>
<ul id="menu-good" hidden>
  <li><a href="#">Tarifs</a></li>
</ul>`,
    },
    cssAfter: `.demo-submenu {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.demo-submenu li {
  padding: 0.4rem 0.75rem;
  border-radius: 0.35rem;
}

.demo-submenu li:hover {
  background: rgba(255, 172, 51, 0.1);
}

.demo-submenu li:focus-within {
  outline: 2px solid var(--c-ambre);
}`,
    before: ``,
    after: ``,
    steps: [['click', '[data-r="toggle"]'], ['wait', 1400]],
  },
  {
    slug: 'retours',
    title: 'Le sablier éternel',
    ref: 'Nielsen · Les 3 limites de temps de réponse',
    refUrl: 'https://www.nngroup.com/articles/response-times-3-important-limits/',
    explanation: 'Un spinner tourne sans fin : pas de pourcentage, pas d’estimation, pas d’annulation. Au-delà de 10 secondes, on ne sait plus si l’application travaille ou si elle est bloquée.',
    rule: 'Au-delà d’1 s, un indicateur. Au-delà de 10 s, une progression chiffrée, une estimation et un bouton Annuler.',
    task: 'Attendez la fin de l’export du rapport… (3 secondes suffisent pour comprendre).',
    bad: `<div class="loader-box" role="status">
  <div class="spinner" aria-hidden="true"></div>
  <p>Chargement…</p>
</div>`,
    good: `<div class="loader-box" id="loader-bien">
  <label for="progress-export">Export du rapport</label>
  <progress id="progress-export" value="75" max="100">75 %</progress>
  <p data-r="text" role="status">75 %, environ 10 s restantes</p>
  <button type="button" class="btn btn-muet btn-cancel" data-r="cancel">Annuler</button>
</div>`,
    html: {
      before: `<div class="spinner"></div>
<p>Chargement…</p>`,
      after: `<div>
  <progress value="75" max="100">75 %</progress>
  <p>75 %, environ 10 s restantes</p>
  <button>Annuler</button>
</div>`,
    },
    cssAfter: `.loader-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.loader-box progress {
  width: 100%;
  height: 1rem;
  accent-color: var(--c-ambre);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #111;
  border-top: 4px solid var(--c-ambre);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}`,
    before: ``,
    after: ``,
    steps: [['wait', 3300]],
  },
  {
    slug: 'lisibilite',
    title: 'Le gris sur gris',
    ref: 'WCAG 1.4.3 · Contraste minimum (4,5:1)',
    refUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
    explanation: 'L’information importante est écrite en gris clair et en petit. Au soleil, sur un écran bas de gamme ou avec une vue fatiguée, elle devient invisible.',
    rule: 'Texte courant : contraste d’au moins 4,5:1 avec le fond. Les conditions importantes ne sont jamais en petites lignes.',
    task: 'Lisez l’encadré, puis répondez : combien coûte la livraison ?',
    bad: `<div class="text-low-contrast">
  <p class="contrast-title">Casque audio · 49,90 €</p>
  <p class="contrast-small">Livraison 7,90 € · Retour payant sous 14 jours</p>
</div>
<p class="contrast-ratio bad">Contraste 2,1:1 ✗</p>
<fieldset class="quiz">
  <legend>Combien coûte la livraison ?</legend>
  <button type="button" class="btn btn-muet" data-r="answer">Gratuite</button>
  <button type="button" class="btn btn-muet" data-r="answer">7,90 €</button>
  <button type="button" class="btn btn-muet" data-r="answer">Je ne sais pas</button>
</fieldset>
<p class="backstage" data-r="log" aria-live="polite"></p>`,
    good: `<div class="text-high-contrast">
  <p class="contrast-title">Casque audio · 49,90 €</p>
  <p>Livraison <strong>7,90 €</strong> · Retour payant sous 14 jours</p>
</div>
<p class="contrast-ratio good">Contraste 12,6:1 ✓ AAA</p>`,
    html: {
      before: `<p class="conditions">Livraison 7,90 €</p>`,
      after: `<p class="conditions"><strong>Livraison 7,90 €</strong></p>`,
    },
    cssAfter: `.text-high-contrast {
  font-size: 1.1rem;
  line-height: 1.5;
  color: #333;
}

.contrast-ratio {
  font-family: var(--t-code);
  font-size: 0.85rem;
}

.contrast-ratio.good {
  color: #38a169;
}

.contrast-ratio.bad {
  color: #fc8181;
}`,
    before: ``,
    after: ``,
    steps: [['click', '[data-r="answer"] >> nth=0']],
  },
  {
    slug: 'pieges',
    title: 'La bannière de cookies piégée',
    ref: 'CNIL · Refuser doit être aussi simple qu’accepter',
    refUrl: 'https://www.cnil.fr/fr/cookies-et-autres-traceurs',
    explanation: '« Tout accepter » est un gros bouton coloré. Le refus se cache derrière « Paramétrer », dans une liste de cases déjà cochées. Le choix n’est plus libre, il est extorqué.',
    rule: 'Accepter et Refuser au même niveau, avec la même taille et la même couleur, dès le premier écran. Aucune case précochée.',
    task: 'Refusez les cookies.',
    bad: `<div class="cookie-banner" role="region" aria-label="Cookies (version ratée)">
  <p>Nous et nos 847 partenaires respectons votre vie privée.</p>
  <button type="button" class="btn btn-primary btn-big" data-r="accept">Tout accepter</button>
  <button type="button" class="link-tiny" data-r="settings">Paramétrer</button>
  <div class="cookie-settings" data-r="panel" hidden>
    <label><input type="checkbox" checked> Mesure d’audience</label>
    <label><input type="checkbox" checked> Publicité personnalisée</label>
    <label><input type="checkbox" checked> Réseaux sociaux</label>
    <label><input type="checkbox" checked> Intérêt légitime (847 partenaires)</label>
  </div>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    good: `<div class="cookie-correct" role="region" aria-label="Cookies (version corrigée)">
  <p>Nous utilisons 2 cookies de mesure d’audience. Rien n’est déposé sans votre accord.</p>
  <div class="cookie-options">
    <button type="button" class="btn btn-muet" data-r="choice">Refuser</button>
    <button type="button" class="btn btn-muet" data-r="choice">Accepter</button>
  </div>
  <button type="button" class="link-plain" data-r="more">Personnaliser</button>
  <p class="backstage" data-r="log" aria-live="polite"></p>
</div>`,
    html: {
      before: `<button class="btn-big">Tout accepter</button>
<a class="tiny" href="#parametres">Paramétrer</a>`,
      after: `<div class="cookie-options">
  <button>Refuser</button>
  <button>Accepter</button>
</div>
<button class="link-plain">Personnaliser</button>`,
    },
    cssAfter: `.cookie-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cookie-options .btn {
  flex: 1 1 8rem;
}

.link-plain {
  text-decoration: underline;
  color: var(--c-ambre);
  padding: 0;
}

.cookie-correct {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: #111;
  border-radius: 0.5rem;
  border: 1px solid #333;
}`,
    before: ``,
    after: ``,
    steps: [['click', '[data-r="settings"]']],
  },
];
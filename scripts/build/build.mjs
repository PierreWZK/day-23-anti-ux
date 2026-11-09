/* Anti-UX · Générateur du musée.
 * Usage : node scripts/build/build.mjs
 * Produit : index.html, salles/<slug>.html (37 salles), sitemap.xml et tests/specimens.json.
 * Le plan du musée (ailes, ordre, résumé de chaque salle) est défini ici : c'est la seule liste.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { salles } from './salles.mjs';
import { cas } from './cas.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://anti-ux.projectp.fr';

/* ---------- Plan du musée ---------- */

const PLAN = [
  {
    id: 'A', name: 'Gestes et boutons',
    intro: 'Ce qu’on touche doit répondre, et ce qu’on casse doit pouvoir se réparer.',
    salles: [
      ['boutons', 'Un bouton qui ne dit rien : on reclique, la commande part trois fois.'],
      ['haptique', 'Des vibrations à chaque touche, sans retour visuel.'],
      ['favoris', 'Trois étapes pour un simple favori.'],
      ['notation', 'Une note perdue faute de commentaire obligatoire.'],
      ['zoom', 'Un zoom bloqué, ou incontrôlable.'],
      ['suppression', 'Supprimé d’un geste, sans retour possible.'],
    ],
  },
  {
    id: 'B', name: 'Saisie et formulaires',
    intro: 'Remplir un formulaire ne devrait jamais ressembler à un examen.',
    salles: [
      ['textes', 'L’intitulé caché dans le champ disparaît dès la première lettre.'],
      ['formulaires', 'Un « Erreur » en haut du formulaire, et débrouillez-vous.'],
      ['erreurs', 'Un message vague, et toutes les saisies effacées.'],
      ['validation-anticipe', 'Une erreur rouge dès la première lettre tapée.'],
      ['validation-personnalisee', 'Six cases pour un code, collage impossible.'],
      ['cache-saisi', 'Un rechargement, et le texte disparaît.'],
      ['aide-inline', 'L’aide ouvre une autre page et fait perdre le fil.'],
      ['resume-commande', 'Des frais surprises au moment de payer.'],
    ],
  },
  {
    id: 'C', name: 'Navigation et repères',
    intro: 'Savoir où l’on est, d’où l’on vient et comment en sortir.',
    salles: [
      ['navigation', 'Un menu qui se referme avant qu’on ait choisi.'],
      ['navigation-contextuelle', 'Des actions inutiles et des libellés figés.'],
      ['historique-nav', 'Le bouton Retour fait tout perdre.'],
      ['distillation', 'Une liste de 60 villes, sans recherche.'],
      ['recherche-autocomplet', 'Des suggestions hors sujet qui changent d’ordre.'],
      ['priorite', 'Dix boutons du même poids, aucun repère.'],
      ['lecture-seule', 'Des pop-ups et des bandeaux par-dessus le texte.'],
    ],
  },
  {
    id: 'D', name: 'Retours et états',
    intro: 'Une interface qui se tait laisse croire qu’elle est en panne.',
    salles: [
      ['retours', 'Un sablier éternel, sans durée ni annulation.'],
      ['chargement', 'Un écran blanc, aucune idée de la durée.'],
      ['progression', 'Une barre de progression muette pour les lecteurs d’écran.'],
      ['activite', 'Un long traitement sans signe de vie.'],
      ['sauvegarde', 'Une sauvegarde automatique qui bloque l’écran.'],
      ['statut-multi', 'Un conflit découvert après l’enregistrement.'],
      ['session', 'Session expirée, retour à zéro.'],
      ['reexperience', 'Le paiement échoue, tout est à refaire.'],
    ],
  },
  {
    id: 'E', name: 'Lisibilité et attention',
    intro: 'Ce qui ne se lit pas n’existe pas. Ce qui crie tout le temps non plus.',
    salles: [
      ['lisibilite', 'L’information importante écrite en gris clair sur blanc.'],
      ['nouveaute', 'Des badges clignotants partout, qui reviennent sans cesse.'],
      ['priorite-notif', 'Tout est en rouge, donc rien n’est urgent.'],
      ['rappel', 'Des rappels imposés, sans réglage.'],
    ],
  },
  {
    id: 'F', name: 'Confiance et pièges',
    intro: 'Les pièges commerciaux, ou l’art de faire dire oui.',
    salles: [
      ['pieges', 'Refuser les cookies demande quatre écrans.'],
      ['cookies', 'Des traceurs posés avant même votre choix.'],
      ['securite', 'Aucune indication sur qui traite votre carte.'],
      ['export', 'Un courrier papier pour récupérer ses données.'],
    ],
  },
];

const bySlug = new Map([...salles, ...cas].map((s) => [s.slug, s]));
const all = [];
for (const wing of PLAN) {
  for (const [slug, card] of wing.salles) {
    const spec = bySlug.get(slug);
    if (!spec) throw new Error(`Salle inconnue dans le plan : ${slug}`);
    all.push({ ...spec, card, wing, num: String(all.length + 1).padStart(2, '0') });
  }
}
if (all.length !== bySlug.size) throw new Error(`Plan incomplet : ${all.length} salles sur ${bySlug.size}`);

/* ---------- Outils ---------- */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const indent = (html, pad) => html.trim().split('\n').map((l) => (l ? pad + l : l)).join('\n');

function write(rel, content) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, 'utf8');
}

const icon = {
  arrow: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  back: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  lock: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  cross: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>',
};

/* ---------- Gabarit commun ---------- */

function head({ title, description, path, root, extra = '' }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#f4efe6">
  <link rel="canonical" href="${SITE}/${path}">
  <link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Anti-UX">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${SITE}/${path}">
  <meta property="og:image" content="${SITE}/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Anti-UX, le musée des erreurs d’interface">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${SITE}/og-image.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${root}styles.css">${extra}
</head>`;
}

function header(root, current = '') {
  const link = (href, label, key) => `<a href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `  <a class="skip-link" href="#contenu">Aller au contenu</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="${root}index.html" aria-label="Anti-UX, retour à l’accueil">
        <span class="logo-mark" aria-hidden="true">A</span>
        <span class="logo-text">Anti-UX</span>
      </a>
      <nav class="main-nav" aria-label="Navigation principale">
        ${link(`${root}index.html#plan`, 'Plan', 'plan')}
        ${link(`${root}index.html#piece-maitresse`, 'Pièce maîtresse', 'coiffeur')}
        ${link(`${root}index.html#frustrometre`, 'Frustromètre', 'frustro')}
      </nav>
    </div>
  </header>`;
}

function footer(root, extraScripts = []) {
  const scripts = [`${root}scripts/main.js`, ...extraScripts]
    .map((src) => `  <script src="${src}" type="module"></script>`).join('\n');
  return `  <footer class="site-footer">
    <div class="container footer-inner">
      <p class="footer-brand"><span class="logo-mark" aria-hidden="true">A</span> Anti-UX, le musée des erreurs d’interface</p>
      <p>Les pièges sont simulés et confinés à leur vitrine : rien n’est envoyé, rien ne sort de la page.</p>
      <p>Jour 23 du défi <a href="https://projectp.fr/" target="_blank" rel="noopener">30 jours, 30 projets</a> · © 2026 Pierre WZK</p>
    </div>
  </footer>

${scripts}
</body>
</html>
`;
}

/* ---------- Page d'une salle ---------- */

function specimenPage(spec, i) {
  const s = spec.slug;
  const prev = all[i - 1];
  const next = all[i + 1];
  const ref = spec.refUrl
    ? `<a href="${esc(spec.refUrl)}" target="_blank" rel="noopener">${esc(spec.ref)}</a>`
    : esc(spec.ref);
  const pagerLink = (x, rel) => `<a class="pager-link ${rel}" href="${x.slug}.html" rel="${rel}">
              <span class="pager-dir">${rel === 'prev' ? `${icon.back} Salle précédente` : `Salle suivante ${icon.arrow}`}</span>
              <span class="pager-title"><span class="inv">${x.num}</span> ${esc(x.title)}</span>
            </a>`;
  const code = (label, html, css) => `<div class="code-item">
                <h3>${label}</h3>
                <pre class="code-block"><code>${esc(html)}</code></pre>${css ? `
                <pre class="code-block"><code>${esc(css)}</code></pre>` : ''}
              </div>`;
  const before = spec.html ? spec.html.before : spec.before;
  const after = spec.html ? spec.html.after : spec.after;
  const hasCode = (before && before.trim()) || (after && after.trim());

  return `${head({
    title: `${spec.title} · Salle ${spec.num} · Anti-UX`,
    description: `${spec.title}. ${spec.rule}`,
    path: `salles/${s}.html`,
    root: '../',
  })}
<body class="page-salle">
${header('../')}

  <main id="contenu">
    <article class="container salle">
      <nav class="breadcrumb" aria-label="Fil d’Ariane">
        <ol>
          <li><a href="../index.html">Accueil</a></li>
          <li><a href="../index.html#aile-${spec.wing.id.toLowerCase()}">Aile ${spec.wing.id} · ${esc(spec.wing.name)}</a></li>
          <li><span aria-current="page">Salle ${spec.num}</span></li>
        </ol>
      </nav>

      <header class="salle-head">
        <p class="kicker"><span class="inv">Salle ${spec.num}</span> <span>Aile ${spec.wing.id} · ${esc(spec.wing.name)}</span></p>
        <h1>${esc(spec.title)}</h1>
        <p class="lede">${esc(spec.card)}</p>
        <p class="progress" id="progress-${s}" data-total="${all.length}">0 salle visitée sur ${all.length}</p>
      </header>

      <div class="vitrines specimen-container" id="specimen-${s}" data-specimen="${s}" data-group="salle">
        <section class="vitrine specimen-col bad" id="col-mal-${s}" aria-labelledby="titre-mal-${s}">
          <header class="vitrine-label">
            <span class="tag tag-piege">${icon.cross} Le piège</span>
            <h2 id="titre-mal-${s}">Version ratée</h2>
          </header>
          <p class="task"><strong>À vous :</strong> ${esc(spec.task)}</p>
          <div class="specimen-content">
${indent(spec.bad, '            ')}
          </div>
        </section>

        <section class="vitrine specimen-col good blurred" id="col-bien-${s}" aria-labelledby="titre-bien-${s}">
          <header class="vitrine-label">
            <span class="tag tag-repare">${icon.check} Réparé</span>
            <h2 id="titre-bien-${s}">Version corrigée</h2>
          </header>
          <div class="specimen-content">
${indent(spec.good, '            ')}
          </div>
          <div class="unlock-overlay" id="overlay-${s}">
            <div class="unlock-content">
              <p class="unlock-title">${icon.lock} Vitrine fermée</p>
              <p class="unlock-hint">Subissez d’abord le piège : elle s’ouvre toute seule.</p>
              <button type="button" class="btn-reveal" id="reveal-btn-${s}">Ouvrir quand même</button>
            </div>
          </div>
        </section>
      </div>
      <p class="unlock-status" id="status-${s}" role="status"></p>

      <aside class="cartel" aria-label="Cartel de la salle">
        <p class="cartel-num">N° ${spec.num}</p>
        <dl>
          <div>
            <dt>Pourquoi ça ne va pas</dt>
            <dd>${esc(spec.explanation)}</dd>
          </div>
          <div class="cartel-rule">
            <dt>La règle à retenir</dt>
            <dd>${esc(spec.rule)}</dd>
          </div>
          <div>
            <dt>Référence</dt>
            <dd>${ref}</dd>
          </div>
        </dl>
      </aside>
${hasCode ? `
      <details class="code-section">
        <summary>Voir le code, avant et après</summary>
        <div class="code-comparison">
              ${code('Version ratée', before, spec.cssBefore)}
              ${code('Version corrigée', after, spec.cssAfter)}
        </div>
      </details>
` : ''}
      <nav class="pager" aria-label="Salles voisines">
            ${prev ? pagerLink(prev, 'prev') : '<span></span>'}
            ${next ? pagerLink(next, 'next') : `<a class="pager-link next" href="../index.html#piece-maitresse">
              <span class="pager-dir">Fin du parcours ${icon.arrow}</span>
              <span class="pager-title">La pièce maîtresse : Coiffeur Antique</span>
            </a>`}
      </nav>
    </article>
  </main>

${footer('../', ['../scripts/specimen.js'])}`;
}

/* ---------- Accueil ---------- */

function homePage() {
  const wings = PLAN.map((wing) => {
    const cards = all.filter((x) => x.wing === wing).map((x) => `            <li>
              <a class="salle-card" href="salles/${x.slug}.html" data-slug="${x.slug}">
                <span class="salle-num inv">${x.num}</span>
                <span class="salle-title">${esc(x.title)}</span>
                <span class="salle-card-text">${esc(x.card)}</span>
                <span class="salle-state" aria-hidden="true"></span>
              </a>
            </li>`).join('\n');
    return `        <section class="aile" id="aile-${wing.id.toLowerCase()}" aria-labelledby="titre-aile-${wing.id}">
          <header class="aile-head">
            <p class="aile-letter" aria-hidden="true">${wing.id}</p>
            <div>
              <h3 id="titre-aile-${wing.id}">Aile ${wing.id} · ${esc(wing.name)}</h3>
              <p>${esc(wing.intro)}</p>
            </div>
          </header>
          <ol class="salles-grid">
${cards}
          </ol>
        </section>`;
  }).join('\n\n');

  const jsonld = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Anti-UX",
    "url": "${SITE}/",
    "description": "Le musée des erreurs d’interface : ${all.length} salles où l’on subit une erreur d’UX, puis où on la répare.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "inLanguage": "fr",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
    "isPartOf": { "@type": "WebSite", "name": "ProjectP · 30 jours, 30 projets", "url": "https://projectp.fr/" }
  }
  </script>`;

  return `${head({
    title: 'Anti-UX · Le musée des erreurs d’interface',
    description: `Un musée où l’on subit ${all.length} erreurs d’interface pour de vrai, puis où on les répare d’un geste. Gratuit, sans inscription.`,
    path: '',
    root: '',
    extra: jsonld,
  })}
<body class="page-accueil">
${header('')}

  <main id="contenu">
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <p class="kicker"><span class="inv">Entrée libre</span> <span>${all.length} salles · 6 ailes</span></p>
          <h1>Le musée des erreurs d’interface</h1>
          <p class="hero-lede">Chaque œuvre exposée est une erreur d’UX qu’on essaie pour de vrai. On la subit, puis la vitrine voisine montre la version réparée, avec la règle à retenir.</p>
          <div class="hero-actions">
            <a class="btn-museum" href="salles/${all[0].slug}.html">Entrer dans le musée ${icon.arrow}</a>
            <a class="btn-museum btn-ghost" href="#piece-maitresse">Voir la pièce maîtresse</a>
          </div>
          <p class="progress progress-home" data-total="${all.length}">0 salle visitée sur ${all.length}</p>
        </div>

        <figure class="hero-oeuvre" aria-labelledby="hero-cartel">
          <div class="cadre">
            <div class="oeuvre">
              <p class="oeuvre-q">Valider la commande ?</p>
              <span class="oeuvre-btn" aria-hidden="true">Cliquez ici</span>
              <span class="oeuvre-cursor" aria-hidden="true"></span>
              <p class="oeuvre-count">Commandes envoyées : <strong>3</strong></p>
            </div>
          </div>
          <figcaption class="cartel cartel-mini" id="hero-cartel">
            <span class="cartel-num">N° 01</span>
            <strong>Le bouton muet</strong>
            <span>HTML sans retour visuel, vers 2009. Il a été cliqué trois fois, trois commandes sont parties.</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="visite" aria-labelledby="titre-visite">
      <div class="container">
        <h2 id="titre-visite" class="sr-only">Comment visiter</h2>
        <ol class="visite-steps">
          <li><span class="inv">1</span><strong>Subissez le piège.</strong> Chaque vitrine de gauche contient une interface ratée, à essayer pour de vrai.</li>
          <li><span class="inv">2</span><strong>Ouvrez la vitrine réparée.</strong> Elle se déverrouille dès que le piège a fait effet.</li>
          <li><span class="inv">3</span><strong>Lisez le cartel.</strong> Pourquoi ça ne va pas, la règle à retenir et sa source.</li>
        </ol>
      </div>
    </section>

    <section class="piece-maitresse" id="piece-maitresse" aria-labelledby="titre-coiffeur">
      <div class="container">
        <header class="section-head">
          <p class="kicker"><span class="inv">Pièce maîtresse</span> <span>Exposition permanente</span></p>
          <h2 id="titre-coiffeur">Coiffeur Antique, un site en deux versions</h2>
          <p>Le même salon de coiffure, la même page de contact. L’une cumule les erreurs des salles, l’autre les corrige toutes. Ouvrez les deux et comparez.</p>
        </header>
        <div class="diptyque">
          <a class="panneau panneau-sans" href="coiffeur/sans-ux.html">
            <span class="cadre cadre-sm" aria-hidden="true">
              <span class="mock mock-sans">
                <span class="mock-nav"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
                <span class="mock-banner"></span>
                <span class="mock-field"></span><span class="mock-field"></span><span class="mock-field"></span><span class="mock-field"></span>
                <span class="mock-btn"></span>
              </span>
            </span>
            <span class="panneau-text">
              <span class="tag tag-piege">${icon.cross} Sans UX</span>
              <strong>Onze liens dans l’en-tête, des cookies imposés, un formulaire interminable.</strong>
              <span class="panneau-link">Visiter la version ratée ${icon.arrow}</span>
            </span>
          </a>
          <a class="panneau panneau-avec" href="coiffeur/avec-ux.html">
            <span class="cadre cadre-sm" aria-hidden="true">
              <span class="mock mock-avec">
                <span class="mock-nav"><i></i><i></i><i></i></span>
                <span class="mock-title"></span>
                <span class="mock-field"></span><span class="mock-field"></span>
                <span class="mock-btn"></span>
              </span>
            </span>
            <span class="panneau-text">
              <span class="tag tag-repare">${icon.check} Avec UX</span>
              <strong>Quatre liens, quatre champs, des retours clairs. On prend rendez-vous en trente secondes.</strong>
              <span class="panneau-link">Visiter la version réparée ${icon.arrow}</span>
            </span>
          </a>
        </div>
      </div>
    </section>

    <section class="plan" id="plan" aria-labelledby="titre-plan">
      <div class="container">
        <header class="section-head">
          <p class="kicker"><span class="inv">Plan du musée</span> <span>${all.length} salles</span></p>
          <h2 id="titre-plan">Six ailes, une erreur par salle</h2>
          <p>Suivez le parcours dans l’ordre, ou entrez directement dans la salle qui vous intéresse. Les salles visitées sont marquées.</p>
        </header>

${wings}
      </div>
    </section>

    <section class="frustrometre" id="frustrometre" aria-labelledby="titre-frustro">
      <div class="container frustro-inner">
        <div>
          <p class="kicker"><span class="inv">Frustromètre</span></p>
          <h2 id="titre-frustro">Votre colère, mesurée</h2>
          <p>Le musée compte vos clics rageurs : trois clics rapides au même endroit. Plus il monte, plus la salle a bien fait son travail.</p>
        </div>
        <p class="score-card"><span class="score-value" aria-live="polite">0</span> <span class="score-label">clics rageurs depuis votre arrivée</span></p>
      </div>
    </section>
  </main>

${footer('')}`;
}

/* ---------- Génération ---------- */

write('index.html', homePage());
const out = [];
all.forEach((spec, i) => {
  const path = `salles/${spec.slug}.html`;
  write(path, specimenPage(spec, i));
  out.push({ slug: spec.slug, path, title: spec.title, num: spec.num, steps: spec.steps });
});

const urls = ['', ...out.map((o) => o.path), 'coiffeur/sans-ux.html', 'coiffeur/avec-ux.html'];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE}/${u}</loc>
    <priority>${u === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`);

write('tests/specimens.json', `${JSON.stringify(out, null, 2)}\n`);

console.log(`${all.length} salles en ${PLAN.length} ailes, ${urls.length} URL dans le sitemap.`);

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to create all 30 Anti-UX specimens (10.1 to 10.30)
"""

import os

BASE_DIR = r"C:\Users\pierr\Desktop\Code\30DaysProjects\day-23-anti-ux"

specimens = [
    # (slug, full_title, reference, bad_content, good_content)
    (
        "cookies",
        "10.1 Consentement préalable aux cookies",
        "RGPD Art. 7 - Consentement explicite",
        '''<div class="cookie-banner" role="region" aria-label="Gestion des cookies">
                <p>Ce site utilise des cookies pour améliorer l'expérience.</p>
                <button class="btn btn-primary" style="padding: 1rem 2rem;">Tout accepter</button>
                <a href="#" class="btn-reject" style="margin-left: 0.5rem; color: #888;">Refuser</a>
              </div>''',
        '''<div class="cookie-correct" role="region" aria-label="Gestion des cookies">
                <p>Ce site utilise des cookies.</p>
                <div class="cookie-options">
                  <button class="btn btn-ambre">Accepter</button>
                  <button class="btn btn-muet">Refuser</button>
                </div>
              </div>'''
    ),
    (
        "progression",
        "10.2 Indicateur de progression accessible",
        "WCAG 1.4.13 - Contenu supplémentaire",
        '''<div class="progress-bar-visual">
                  <div class="progress-fill" style="width: 65%;"></div>
                </div>''',
        '''<div class="progress-accessible">
                  <progress value="65" max="100" aria-label="Progression">65%</progress>
                  <span class="progress-text">65% terminé</span>
                </div>'''
    ),
    (
        "erreurs",
        "10.3 Gestion des erreurs de formulaire",
        "Nielsen 4 - Aide à la correction des erreurs",
        '''<form id="form-mal">
                  <label>Email</label>
                  <input type="email" value="invalid">
                  <button>Envoyer</button>
                </form>
                <p class="error-message">⚠ Erreur dans le formulaire</p>''',
        '''<form id="form-bien">
                  <label>Email</label>
                  <input type="email" id="email">
                  <div id="error-email" role="alert">Email invalide</div>
                  <button>Envoyer</button>
                </form>'''
    ),
    (
        "navigation",
        "10.4 Navigation contextuelle",
        "Nielsen 8 - Prévisibilité des états",
        '''<nav>
                  <a href="/" class="active">Accueil</a>
                  <a href="/parametres">Paramètres</a>
                </nav>
                <main><h1>Pas d'action contextuelle</h1></main>''',
        '''<nav aria-label="Navigation">
                  <a href="/" class="active">Tableau de bord</a>
                  <a href="/parametres">Paramètres</a>
                  <button id="action-contextuelle">Sauvegarder</button>
                </nav>
                <main><h1>Page avec action contextuelle</h1></main>'''
    ),
    (
        "haptique",
        "10.5 Feedback haptique limité",
        "Nielsen 1 - Visibilité de l'état",
        '''<button id="btn-haptique">Cliquez ici</button>''',
        '''<button id="btn-haptique">
                  <span id="btn-text">Cliquez ici</span>
                </button>'''
    ),
    (
        "distillation",
        "10.6 Anti-distillation des informations",
        "Nielsen 3 - Recherche et filtrage",
        '''<select multiple style="width: 100%;">
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                  <option>Option 4</option>
                  <option>Option 5</option>
                  <option>Option 6</option>
                  <option>Option 7</option>
                  <option>Option 8</option>
                  <option>Option 9</option>
                  <option>Option 10</option>
                  <option>Option 11</option>
                  <option>Option 12</option>
                </select>''',
        '''<div class="searchable-select">
                  <input type="search" placeholder="Taper pour filtrer...">
                  <select multiple style="max-height: 200px; overflow-y: auto;">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                </div>'''
    ),
    (
        "validation-anticipe",
        "10.7 Validation anticipée",
        "Nielsen 2 - Taux de saisie",
        '''<input type="email" style="border: 2px solid red;">
                <div class="alert-modal">Email invalide!</div>''',
        '''<label>Email</label>
                <input type="email" id="email-val">
                <div id="error-email" class="hint-error"></div>'''
    ),
    (
        "suppression",
        "10.8 Gestion de suppression sécurisée",
        "Nielsen 8 - Prévisibilité",
        '''<button class="btn btn-rouge" onclick="supprimer()">Supprimer</button>''',
        '''<div class="delete-action">
                  <button class="btn-rouge">Supprimer</button>
                  <div class="modal hidden">
                    <p>Voulez-vous vraiment supprimer ?</p>
                    <button class="btn-vert">Oui</button>
                    <button class="btn-muet">Annuler</button>
                  </div>
                </div>'''
    ),
    (
        "chargement",
        "10.9 Chargement asynchrone optimisé",
        "WCAG 2.2.2 - Arrêt, Pause, Rejouer",
        '''<div class="loader">
                  <div class="spinner"></div>
                </div>''',
        '''<div class="loader-good">
                  <progress value="45" max="100"></progress>
                  <span>45% - Chargement...</span>
                </div>'''
    ),
    (
        "priorite",
        "10.10 Priorisation des tâches",
        "Nielsen 9 - Flexibilité et prévisibilité",
        '''<div class="action-list">
                  <button>Options avancées</button>
                  <button>Aide</button>
                  <button>Sauvegarder</button>
                </div>''',
        '''<div class="action-list-good">
                  <button class="btn-primary">Sauvegarder</button>
                  <details>
                    <summary>Options avancées</summary>
                    <button>Exporter</button>
                  </details>
                </div>'''
    ),
    (
        "resume-commande",
        "10.11 Résumé de commande",
        "Nielsen 4 - Aide à la correction des erreurs",
        '''<div class="order-summary">
                  <p>Total: 25€</p>
                  <button>Valider</button>
                </div>''',
        '''<div class="order-summary-good">
                  <h3>Récapitulatif</h3>
                  <ul>
                    <li>Article A - 15€</li>
                    <li>Livraison - 5€</li>
                    <li>Taxes - 5€</li>
                  </ul>
                  <p class="total">Total: 25€</p>
                  <button class="btn-primary">Valider</button>
                </div>'''
    ),
    (
        "rappel",
        "10.12 Système de rappel progressif",
        "Nielsen 4 - Aide à la correction des erreurs",
        '''<div class="notification-system">
                  <p>Rappel: tâche à faire</p>
                </div>''',
        '''<div class="notification-system-good">
                  <p>Rappel: tâche à faire</p>
                  <button class="btn-vert">Terminé</button>
                  <button class="btn-muet">Modifier</button>
                </div>'''
    ),
    (
        "sauvegarde",
        "10.13 Indicateur de sauvegarde automatique",
        "Nielsen 1 - Visibilité de l'état",
        '''<div class="save-status">
                  <p>Sauvegarde en cours...</p>
                </div>''',
        '''<div class="save-status-good">
                  <span class="saved-indicator">✓ Sauvegardé</span>
                  <span class="saving-indicator">→ Sauvegarde...</span>
                </div>'''
    ),
    (
        "favoris",
        "10.14 Gestion des favoris partagés",
        "Nielsen 9 - Flexibilité",
        '''<button id="favori-bad" style="opacity: 0.3;">⭐ Ajouter aux favoris</button>''',
        '''<button id="favori-bien" class="btn-ambre">⭐ Ajouter aux favoris</button>
                <span id="favori-status">Favori ajouté</span>'''
    ),
    (
        "recherche-autocomplet",
        "10.15 Recherche avec autocomplétion",
        "Nielsen 3 - Recherche",
        '''<input type="text" placeholder="Rechercher...">
                <ul></ul>''',
        '''<div class="search-autocomplete">
                  <input type="search" id="search-input" placeholder="Taper pour rechercher...">
                  <ul id="suggestions" class="suggestions-list"></ul>
                </div>'''
    ),
    (
        "nouveaute",
        "10.16 Indicateur de nouveauté",
        "Nielsen 1 - Visibilité",
        '''<a href="#"><span style="background: red; padding: 2px 8px;">NEW</span> Mon élément</a>''',
        '''<a href="#"><span class="new-badge" title="Nouvelle fonctionnalité"></span> Mon élément</a>'''
    ),
    (
        "reexperience",
        "10.17 Réexpérience utilisateur",
        "Nielsen 2 - Taux de saisie",
        '''<div class="error-page">
                  <h1>Erreur</h1>
                  <button>Reessayer</button>
                </div>''',
        '''<div class="retry-page">
                  <h1>Quelque chose s'est mal passé</h1>
                  <button id="retry-btn">Réessayer</button>
                  <button id="back-btn">Retour à l'accueil</button>
                </div>'''
    ),
    (
        "cache-saisi",
        "10.18 Cache de saisie persistant",
        "Nielsen 9 - Flexibilité",
        '''<form><input type="text" name="données"></form>''',
        '''<form id="persistant-form">
                  <input type="text" name="données" id="cache-input">
                  <button type="submit">Sauvegarder</button>
                </form>'''
    ),
    (
        "lecture-seule",
        "10.19 Mode lecture uniquement",
        "WCAG 1.3.1 - Structure",
        '''<div>Aller trop vite pour lire</div>''',
        '''<article class="reading-mode">
                  <h1>Titre</h1>
                  <p>Contenu ici...</p>
                  <button id="edit-mode">Modifier</button>
                </article>'''
    ),
    (
        "historique-nav",
        "10.20 Historique de navigation",
        "Nielsen 8 - Prévisibilité",
        '''<button onclick="history.back()">Retour</button>''',
        '''<nav aria-label="Historique">
                  <button id="step-back">← étape précédente</button>
                  <button id="view-history">Historique complet</button>
                </nav>'''
    ),
    (
        "aide-inline",
        "10.21 Aide contextuelle inline",
        "Nielsen 3 - Recherche",
        '''<input title="Entrez votre email"><button>Aide</button></input>''',
        '''<div class="field-with-help">
                  <label>Email</label>
                  <input type="email">
                  <button class="help-btn" aria-label="Aide">?</button>
                  <div class="tooltip">Format: nom@domaine.com</div>
                </div>'''
    ),
    (
        "securite",
        "10.22 Indicateur de sécurité",
        "Nielsen 1 - Visibilité",
        '''<p>Connexion sécurisée</p>''',
        '''<div class="security-indicator">
                  <span class="lock-icon">🔒</span>
                  <span>Connexion sécurisée</span>
                  <span class="https-badge">HTTPS</span>
                </div>'''
    ),
    (
        "zoom",
        "10.23 Gestuelle de zoom contrôlée",
        "WCAG 2.3.3 - Sécurité",
        '''<img src="image.jpg" style="width: 100vw; height: auto;">''',
        '''<div class="zoom-container">
                  <img src="image.jpg" id="zoomable">
                  <div class="zoom-controls">
                    <button id="zoom-out">-</button>
                    <span id="zoom-level">100%</span>
                    <button id="zoom-in">+</button>
                  </div>
                </div>'''
    ),
    (
        "notation",
        "10.24 Système de notation fluide",
        "Nielsen 4 - Aide",
        '''<div class="rating-form">
                  <button>1 star</button>
                  <button>2 stars</button>
                  <button>3 stars</button>
                  <button>4 stars</button>
                  <button>5 stars</button>
                </div>
                <button>Submit</button>''',
        '''<div class="rating-simple">
                  <div class="stars" id="stars">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <span class="rating-value">3/5</span>
                </div>'''
    ),
    (
        "statut-multi",
        "10.25 Indicateur de statut multi-utilisateur",
        "Nielsen 1 - Visibilité",
        '''<p>Édité par quelqu'un</p>''',
        '''<div class="collaboration-status">
                  <span class="user-avatar">👤</span>
                  <span class="user-name">Marie en train d'éditer</span>
                  <span class="status-badge">En ligne</span>
                </div>'''
    ),
    (
        "session",
        "10.26 Récupération de session",
        "Nielsen 8 - Prévisibilité",
        '''<form><input type="text">Non sauvegardé!</form>''',
        '''<form id="saved-form">
                  <input type="text" name="champ1" value="Sauvegardé">
                  <input type="text" name="champ2" value="Automatiquement restauré">
                  <button>Continuer</button>
                </form>'''
    ),
    (
        "validation-personnalisee",
        "10.27 Validation par contrôle personnalisé",
        "WCAG 1.3.1 - Structure",
        '''<form><input type="text" placeholder="Code de validation"></form>''',
        '''<form class="custom-validation">
                  <div class="validation-method">
                    <button>SMS</button>
                    <button>Email</button>
                    <button>Biométrie</button>
                  </div>
                  <input type="text" id="validation-code" placeholder="Entrez le code">
                  <button id="verify-code">Vérifier</button>
                </form>'''
    ),
    (
        "activite",
        "10.28 Indicateur d'activité en temps réel",
        "WCAG 2.2.2 - Contenu",
        '''<p>Chargement...</p>''',
        '''<div class="activity-indicator">
                  <div class="spinner"></div>
                  <span>L'application répond...</span>
                  <button class="interrupt-btn">Interrompre</button>
                </div>'''
    ),
    (
        "priorite-notif",
        "10.29 Système de priorité des notifications",
        "Nielsen 4 - Aide",
        '''<div class="notifications">
                  <p>Alert 1</p>
                  <p>Alert 2</p>
                  <p>Alert 3</p>
                </div>''',
        '''<div class="notifications-prioritized">
                  <div class="notification high">Alerte critique</div>
                  <div class="notification medium">Information</div>
                  <div class="notification low">Newsletter</div>
                  <button id="mute-all">Muet toutes les notifications</button>
                </div>'''
    ),
    (
        "export",
        "10.30 Export de données autonome",
        "RGPD Art. 20 - Droit à l'exportation",
        '''<button>Export</button>''',
        '''<div class="export-tool">
                  <button id="export-json">Exporter JSON</button>
                  <button id="export-csv">Exporter CSV</button>
                  <button id="export-pdf">Exporter PDF</button>
                  <p id="export-info">Données exportées: 152 éléments</p>
                </div>'''
    ),
]

for i, (slug, title, reference, bad_html, good_html) in enumerate(specimens, 1):
    progress = i

    html_content = f'''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{title} · Anti-UX">
  <title>{title} · Anti-UX</title>
  <link rel="stylesheet" href="../styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="canonical" href="https://anti-ux.projectp.fr/salles/{slug}.html">
</head>
<body>
  <div class="site-wrapper">
    <header class="fixed-header">
      <div class="container">
        <div class="logo">Anti-UX</div>
        <nav aria-label="Navigation principale">
          <a href="../index.html">Accueil</a>
          <a href="cookies.html">Consentement</a>
          <a href="../index.html#frustrome">Frustromètre</a>
          <a href="https://projectp.fr" target="_blank" rel="noopener">ProjectP</a>
        </nav>
      </div>
    </header>

    <main>
      <article class="specimen">
        <div class="container">
          <header class="specimen-header">
            <h2 class="specimen-title">{title}</h2>
            <p class="specimen-reference">{reference}</p>
          </header>

          <p class="specimen-explanation">
            Anti-pattern: ce cas cible un scénario UX spécifique.
            Testez la version ratée pour comprendre les ennuis.
          </p>

          <p class="specimen-rule">
            <strong>Règle :</strong> Implémenter correctement cette fonctionnalité UX.
          </p>

          <div class="progress-info">
            <span id="progress-{slug}">{progress} sur 30 cas testés</span>
          </div>

          <div class="specimen-container" id="specimen-{slug}">
            <div class="specimen-col bad" id="col-mal-{slug}">
              <h3 class="col-title bad">❌ Version ratée</h3>
              <div class="specimen-content">
                {bad_html}
                <p class="specimen-note">"Anti-pattern testable - cliquez pour interagir"</p>
              </div>
            </div>

            <div class="specimen-col good blurred" id="col-bien-{slug}">
              <h3 class="col-title good">✅ Version corrigée</h3>
              <div class="specimen-content">
                {good_html}
                <p class="specimen-note good-note">"Version correcte - bonnes pratiques UX appliquées"</p>
              </div>
              <div class="unlock-overlay" id="overlay-{slug}">
                <div class="unlock-content">
                  <p>🔒 Version corrigée verrouillée</p>
                  <p>Testez la version ratée pour débloquer</p>
                  <button class="btn-test btn-vert" id="reveal-btn-{slug}">Révéler quand même</button>
                </div>
              </div>
            </div>
          </div>

          <div class="code-section">
            <h4>Avant / Après</h4>
            <div class="code-comparison">
              <div class="code-block">
                <pre><code class="language-html">&lt;!-- ❌ Mauvais --&gt;
{bad_html}

&lt;!-- ✅ Bon --&gt;
{good_html}</code></pre>
              </div>
              <div class="code-block">
                <pre><code class="language-css">/* CSS Adapté */
/* Styles UX appropriés */</code></pre>
              </div>
            </div>
          </div>

          <a href="../index.html#salles" class="back-link">← Retour aux salles</a>
        </div>
      </article>
    </main>

    <footer role="contentinfo">
      <div class="container">
        <p class="footer-text">© 2026 Pierre WZK • <a href="https://projectp.fr">ProjectP</a> • Jour 23</p>
        <p class="footer-small"><a href="https://projectp.fr" rel="noopener">30 jours, 30 projets</a></p>
      </div>
    </footer>
  </div>

  <div class="frustrome-footer">
    <span class="score-value" id="score-{slug}">0</span> clics rageurs
  </div>

  <script src="../scripts/main.js" type="module"></script>
  <script src="../scripts/salles/{slug}.js" type="module"></script>
</body>
</html>'''

    # Extract description from title (e.g., "10.1 Consentement..." -> "Consentement")
    desc_from_title = title.split(' ', 1)[1] if ' ' in title else title
    js_content = f'''/* Spécimen : {desc_from_title} - script dédié */

import {{ updateFrustrome }} from '../main.js';

document.addEventListener('DOMContentLoaded', () => {{
  const colMal = document.getElementById('col-mal-{slug}');
  const colBien = document.getElementById('col-bien-{slug}');
  const overlay = document.getElementById('overlay-{slug}');
  const revealBtn = document.getElementById('reveal-btn-{slug}');
  const progressSpan = document.getElementById('progress-{slug}');

  const SPECIMEN_ID = '{slug}';
  const SPECIMEN_KEY = 'anti-ux-specimen-' + SPECIMEN_ID;

  // Vérifier si déjà testé
  const tested = localStorage.getItem(SPECIMEN_KEY) === 'true';

  if (tested) {{
    colBien.classList.remove('blurred');
    overlay.classList.add('hidden');
    revealBtn.disabled = true;
    revealBtn.textContent = '✅ Révélé';
    updateTestStatus();
  }}

  // Bouton Révéler quand même
  revealBtn?.addEventListener('click', () => {{
    if (!tested) {{
      localStorage.setItem(SPECIMEN_KEY, 'true');
    }}
    colBien.classList.remove('blurred');
    overlay.classList.add('hidden');
    revealBtn.disabled = true;
    revealBtn.textContent = '✅ Révélé';
    updateTestStatus();
    updateFrustrome();
  }});

  function updateTestStatus() {{
    const testedCount = (parseInt(localStorage.getItem('anti-ux-specimens-count') || '0') + 1);
    localStorage.setItem('anti-ux-specimens-count', testedCount);
    if (progressSpan) {{
      progressSpan.textContent = testedCount + ' sur 30 spécimens testés';
    }}
  }}
}});
'''

    # Write files
    html_path = os.path.join(BASE_DIR, f"salles\\{slug}.html")
    js_path = os.path.join(BASE_DIR, f"scripts\\salles\\{slug}.js")

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"Created: {slug}.html et {slug}.js (cas {progress}/30)")

print("\n✅ Tous les 30 spécimens ont été créés!")
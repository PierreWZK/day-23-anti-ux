/* Anti-UX · Scripts principaux v3.0 */

// Compteur de clics rageurs (Frustromètre)
const FRUSTROME_KEY = 'anti-ux-frustrome';

function getFrustrome() {
  try {
    const saved = localStorage.getItem(FRUSTROME_KEY);
    return saved ? JSON.parse(saved) : { clics: 0 };
  } catch {
    return { clics: 0 };
  }
}

function setFrustrome(data) {
  localStorage.setItem(FRUSTROME_KEY, JSON.stringify(data));
}

function updateFrustrome() {
  const data = getFrustrome();
  const scoreElements = document.querySelectorAll('.score-value');
  scoreElements.forEach(el => {
    if (el) {
      el.textContent = data.clics;
    }
  });
}

// Détection des clics rageurs (3 clics rapides sur le même élément)
export function detectClicsRageurs() {
  const frustrome = getFrustrome();
  let lastClickTime = 0;
  let clickCount = 0;
  let lastTarget = null;

  document.addEventListener('click', (e) => {
    const now = Date.now();
    const target = e.target;

    // Reset si cible différente ou assez de temps
    if (target !== lastTarget || now - lastClickTime > 1000) {
      clickCount = 0;
      lastTarget = target;
    }

    clickCount++;
    lastClickTime = now;

    // 3 clics rapides = rage
    if (clickCount >= 3) {
      frustrome.clics += 1;
      setFrustrome(frustrome);
      updateFrustrome();
      clickCount = 0;
    }
  });
}

// Salles visitées : marque les cartes du plan et affiche la progression de l'accueil.
const SALLE_PREFIX = 'anti-ux-specimen-';

function markVisited() {
  let keys = [];
  try {
    keys = Object.keys(localStorage);
    // Les anciens « cas » sont devenus des salles : on reprend leur progression.
    keys.filter((k) => k.startsWith(SALLE_PREFIX + 'cas-')).forEach((k) => {
      localStorage.setItem(SALLE_PREFIX + k.slice((SALLE_PREFIX + 'cas-').length), localStorage.getItem(k));
      localStorage.removeItem(k);
    });
    keys = Object.keys(localStorage);
  } catch { /* stockage indisponible */ }
  const visited = new Set(keys.filter((k) => k.startsWith(SALLE_PREFIX) && localStorage.getItem(k) === 'true')
    .map((k) => k.slice(SALLE_PREFIX.length)));
  document.querySelectorAll('.salle-card[data-slug]').forEach((card) => {
    if (!visited.has(card.dataset.slug)) return;
    card.classList.add('is-visited');
    card.querySelector('.salle-state').textContent = 'Visitée';
    card.setAttribute('aria-label', `${card.querySelector('.salle-title').textContent}, salle visitée`);
  });
  document.querySelectorAll('.progress-home').forEach((el) => {
    const n = visited.size;
    el.textContent = `${n} salle${n > 1 ? 's' : ''} visitée${n > 1 ? 's' : ''} sur ${el.dataset.total}`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  markVisited();
  updateFrustrome();
  detectClicsRageurs();
});

// Export pour tests
export { getFrustrome, setFrustrome, updateFrustrome };
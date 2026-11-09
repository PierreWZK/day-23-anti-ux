/* Anti-UX · Moteur des spécimens
 * - La version ratée (gauche) est libre d'accès.
 * - La version corrigée (droite) reste floutée et inerte tant que le piège n'a pas été subi.
 * - « Révéler quand même » reste toujours disponible comme sortie clavier.
 */

import { demos } from './demos.js';

const PREFIX = 'anti-ux-specimen-';

const storage = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { /* stockage indisponible : on continue sans mémoire */ }
  },
  keys() {
    try { return Object.keys(localStorage); } catch { return []; }
  },
};

/* Compte les salles visitées (une clé par salle). */
export function countTested() {
  return storage.keys().filter((key) => key.startsWith(PREFIX) && storage.get(key) === 'true').length;
}

export function storageKey(slug) {
  return PREFIX + slug;
}

export function isTested(slug) {
  return storage.get(storageKey(slug)) === 'true';
}

function renderProgress(el) {
  if (!el) return;
  const n = countTested();
  el.textContent = `${n} salle${n > 1 ? 's' : ''} visitée${n > 1 ? 's' : ''} sur ${el.dataset.total}`;
}

function initSpecimen(container) {
  const slug = container.dataset.specimen;
    const colMal = document.getElementById(`col-mal-${slug}`);
  const colBien = document.getElementById(`col-bien-${slug}`);
  const overlay = document.getElementById(`overlay-${slug}`);
  const revealBtn = document.getElementById(`reveal-btn-${slug}`);
  const progress = document.getElementById(`progress-${slug}`);
  const status = document.getElementById(`status-${slug}`);
  const goodContent = colBien.querySelector('.specimen-content');

  const lock = () => {
    colBien.classList.add('blurred');
    goodContent.inert = true;
  };

  const unlock = (reason) => {
    if (!colBien.classList.contains('blurred')) return;
    storage.set(storageKey(slug), 'true');
    colBien.classList.remove('blurred');
    goodContent.inert = false;
    overlay.classList.add('hidden');
    revealBtn.disabled = true;
    revealBtn.textContent = 'Vitrine ouverte';
    colMal.classList.add('done');
    if (status) {
      status.textContent = reason === 'done'
        ? 'Piège subi : la vitrine réparée est ouverte.'
        : 'Vitrine réparée ouverte.';
    }
    renderProgress(progress);
  };

  if (isTested(slug)) {
    unlock('memory');
    if (status) status.textContent = '';
  } else {
    lock();
  }

  revealBtn.addEventListener('click', () => unlock('reveal'));

  const demo = demos[slug];
  if (demo) {
    demo({
      bad: colMal,
      good: colBien,
      done: () => unlock('done'),
    });
  }

  renderProgress(progress);
}

document.addEventListener('DOMContentLoaded', () => {
  /* Ancien compteur incrémental (faux) : on le supprime. */
  try { localStorage.removeItem('anti-ux-specimens-count'); } catch { /* rien */ }
  document.querySelectorAll('.specimen-container[data-specimen]').forEach(initSpecimen);

});

/* Spécimen : Le saut de mise en page */
export default {
  title: "Saut de mise en page",
  reference: "Core Web Vitals (CLS)",
  explanation: "Une bannière se charge au-dessus au moment du clic : l'utilisateur appuie sur « Supprimer » au lieu de « Garder ».",
  rule: "Réserver l'espace à l'avance pour les éléments qui peuvent apparaître dynamiquement.",
  htmlBefore: `<!-- ❌ Mauvais : contenu qui déplace -->
<button id="show-banner">Montrer bannière</button>
<div id="banner-container"></div>
<button>Supprimer</button>

<!-- ✅ Bon : espace réservé -->
<button id="show-banner-reserve">Montrer bannière</button>
<div class="banner-placeholder" style="height: 60px;"></div>
<button id="delete-btn">Supprimer</button>`,
  htmlAfter: `/* Espace réservé stable */
.banner-placeholder {
  background: var(--c-gris);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}`,
  piege(cadre) {
    const showBtn = document.createElement('button');
    showBtn.textContent = 'Afficher bannière';
    showBtn.className = 'btn btn-primary';

    const bannerContainer = document.createElement('div');
    bannerContainer.id = 'banner-container-piage';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.className = 'btn btn-rouge';
    deleteBtn.style.marginTop = '0.5rem';

    showBtn.addEventListener('click', () => {
      bannerContainer.innerHTML = '<div class="alert alert-warning">⚠ Cette bannière déplace tout le contenu !</div>';
    });

    deleteBtn.addEventListener('click', () => {
      alert('Supprimé (mais vous avez cliqué par mauvaise position)');
    });

    cadre.appendChild(showBtn);
    cadre.appendChild(bannerContainer);
    cadre.appendChild(deleteBtn);
  },
  repare(cadre) {
    const showBtn = document.createElement('button');
    showBtn.textContent = 'Afficher bannière';
    showBtn.className = 'btn btn-primary';
    showBtn.style.marginBottom = '1rem';

    const placeholder = document.createElement('div');
    placeholder.className = 'banner-placeholder';
    placeholder.style.height = '60px';
    placeholder.style.background = 'var(--c-gris)';
    placeholder.style.borderRadius = '0.5rem';
    placeholder.style.marginBottom = '1rem';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.color = 'var(--c-gris-clair)';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.className = 'btn btn-rouge';

    showBtn.addEventListener('click', () => {
      placeholder.innerHTML = '<div class="alert">⚠ Bannière affichée sans saut</div>';
    });

    deleteBtn.addEventListener('click', () => {
      alert('Supprimé avec succès');
    });

    cadre.appendChild(showBtn);
    cadre.appendChild(placeholder);
    cadre.appendChild(deleteBtn);
  }
};
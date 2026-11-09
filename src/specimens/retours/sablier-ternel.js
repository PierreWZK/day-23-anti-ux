/* Spécimen : Le sablier éternel */
export default {
  title: "Sablier éternel",
  reference: "Nielsen 1 · Visibilité de l'état du système",
  explanation: "Un indicateur de chargement qui tourne sans fin, sans durée estimée ni bouton d'annulation. L'utilisateur reste bloqué.",
  rule: "Tout indicateur de chargement doit afficher une durée estimée ou un état de progression.",
  htmlBefore: `<!-- ❌ Mauvais : spinner infini -->
<div class="spinner"></div>

<!-- ✅ Bon : loader avec état -->
<div class="loader">
  <progress max="100" value="45"></progress>
  <span>45% terminé</span>
  <button class="btn-cancel">Annuler</button>
</div>`,
  htmlAfter: `/* Progress bar accessible */
loader {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}
progress {
  width: 100%;
  height: 1rem;
}`,
  piege(cadre) {
    const spinner = document.createElement('div');
    spinner.style.border = '4px solid var(--c-gris)';
    spinner.style.borderTop = '4px solid var(--c-ambre)';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '40px';
    spinner.style.height = '40px';
    spinner.style.animation = 'spin 1s linear infinite';

    const style = document.createElement('style');
    style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);

    const label = document.createElement('p');
    label.textContent = 'Chargement...';
    label.style.textAlign = 'center';

    cadre.appendChild(spinner);
    cadre.appendChild(label);
  },
  repare(cadre) {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.style.display = 'flex';
    loader.style.flexDirection = 'column';
    loader.style.gap = '0.5rem';
    loader.style.alignItems = 'center';

    const progress = document.createElement('progress');
    progress.max = 100;
    progress.value = 75;
    progress.style.width = '100%';
    progress.style.height = '1rem';

    const label = document.createElement('p');
    label.textContent = '75% terminé';
    label.style.fontSize = '0.9rem';
    label.style.color = 'var(--c-gris-clair)';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-muet';
    cancelBtn.textContent = 'Annuler';
    cancelBtn.style.padding = '0.5rem 1rem';

    cancelBtn.addEventListener('click', () => {
      label.textContent = 'Annulé';
      progress.value = 0;
    });

    loader.appendChild(progress);
    loader.appendChild(label);
    loader.appendChild(cancelBtn);
    cadre.appendChild(loader);
  }
};
/* Spécimen : Le bouton muet */
export default {
  title: "Le bouton muet",
  reference: "Nielsen 1 · Visibilité de l'état du système",
  explanation: "Le bouton ne donne aucune indication visuelle quand on clique dessus. L'utilisateur ne sait pas si l'action a été prise en compte, il peut cliquer plusieurs fois.",
  rule: "Toute interaction doit avoir un retour visuel immédiat.",
  htmlBefore: `<!-- ❌ Mauvais : pas de feedback -->
<button class="btn btn-muet">Cliquez ici</button>

<!-- ✅ Bon : feedback complet -->
<button class="btn btn-primary" disabled>Envoi...</button>`,
  htmlAfter: `/* États visuels complets */
.btn {
  padding: 0.85rem 1.75rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  transition: all 0.2s;
}
.btn:active { transform: scale(0.98); }
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #6B7280;
}
.btn:enabled:hover {
  background: #FFAC33;
  transform: translateY(-2px);
}`,
  piege(cadre) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Cliquez ici';
    btn.id = 'btn-test-muet';

    let clickCount = 0;
    btn.addEventListener('click', () => {
      clickCount++;
      // Pas de feedback visuel - le bouton ne change jamais
      console.log(`Clic #${clickCount} - pas de feedback !`);
    });

    cadre.appendChild(btn);
  },
  repare(cadre) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Cliquez ici';
    btn.id = 'btn-test-reparé';

    btn.addEventListener('click', () => {
      btn.disabled = true;
      btn.textContent = '✓ Envoyé !';
      btn.style.background = '#38A169';
      btn.style.borderColor = '#38A169';
    });

    cadre.appendChild(btn);
  }
};
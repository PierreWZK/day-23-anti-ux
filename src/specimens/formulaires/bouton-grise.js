/* Spécimen : Le bouton grisé sans raison */
export default {
  title: "Bouton grisé sans raison",
  reference: "Nielsen 1 · Visibilité de l'état du système",
  explanation: "Le bouton 'Envoyer' est désactivé sans aucune explication. L'utilisateur ne sait pas ce qui empêche l'envoi.",
  rule: "Un bouton désactivé doit expliquer pourquoi, ou être activé dès que le formulaire est valide.",
  htmlBefore: `<!-- ❌ Mauvais : bouton désactivé sans raison -->
<form>
  <input type="text" required>
  <button disabled>Envoyer</button>
</form>

<!-- ✅ Bon : bouton activé quand valide -->
<form>
  <input type="text" required>
  <button type="submit">Envoyer</button>
</form>`,
  htmlAfter: `/* Indicateur de validation */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn:enabled {
  background: var(--c-ambre);
}
.was-validated .btn:disabled {
  background: var(--c-ambre);
}`,
  piege(cadre) {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1rem';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Entrez quelque chose';
    input.required = true;

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.disabled = true;
    btn.textContent = 'Envoyer';
    btn.style.opacity = '0.6';
    btn.style.cursor = 'not-allowed';

    form.appendChild(input);
    form.appendChild(btn);

    btn.addEventListener('click', () => {
      alert('Pourquoi ce bouton est-il grisé ?');
    });

    cadre.appendChild(form);
  },
  repare(cadre) {
    const form = document.createElement('form');
    form.className = 'was-validated';
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1rem';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Entrez quelque chose';
    input.required = true;
    input.style.padding = '0.85rem';
    input.style.border = '1px solid var(--c-gris)';

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Envoyer';
    btn.style.padding = '0.85rem 1.75rem';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value.trim()) {
        alert('Envoyé avec succès !');
      }
    });

    form.appendChild(input);
    form.appendChild(btn);
    cadre.appendChild(form);
  }
};
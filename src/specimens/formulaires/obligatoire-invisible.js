/* Spécimen : L'obligatoire invisible */
export default {
  title: "Obligatoire invisible",
  reference: "WCAG 3.3.2 · Champs requis",
  explanation: "On découvre à l'envoi que tous les champs étaient obligatoires. L'utilisateur doit tout reprendre.",
  rule: "Les champs obligatoires doivent être clairement signalés, ou les champs facultatifs doivent être indiqués.",
  htmlBefore: `<!-- ❌ Mauvais : obligation cachée -->
<form>
  <input type="text" name="prenom">
  <input type="email" name="email">
  <button>Envoyer</button>
</form>

<!-- ✅ Bon : champs requis visibles -->
<form>
  <label>Nom *</label>
  <input type="text" name="prenom" required>
  <label>Email (facultatif)</label>
  <input type="email" name="email">
  <button>Envoyer</button>
</form>`,
  htmlAfter: `/* Indicateur de champs requis */
label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.required-indicator {
  color: #E53E3E;
  font-weight: bold;
}
.optional {
  color: var(--c-gris-clair);
  opacity: 0.7;
}`,
  piege(cadre) {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1rem';

    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.name = 'prenom';
    input1.required = true;
    input1.style.padding = '0.85rem';
    input1.style.border = '1px solid var(--c-gris)';

    const input2 = document.createElement('input');
    input2.type = 'email';
    input2.name = 'email';
    input2.style.padding = '0.85rem';
    input2.style.border = '1px solid var(--c-gris)';

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Envoyer';

    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(btn);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input1.value || !input2.value) {
        alert('Tous les champs sont obligatoires !');
      } else {
        alert('Envoyé');
      }
    });

    cadre.appendChild(form);
  },
  repare(cadre) {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1rem';

    const label1 = document.createElement('label');
    label1.textContent = 'Nom ';
    const req1 = document.createElement('span');
    req1.className = 'required-indicator';
    req1.textContent = '*';
    label1.appendChild(req1);

    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.name = 'prenom';
    input1.required = true;
    input1.style.padding = '0.85rem';
    input1.style.border = '1px solid var(--c-gris)';

    const label2 = document.createElement('label');
    label2.textContent = 'Email (facultatif)';
    const optional = document.createElement('span');
    optional.className = 'optional';
    optional.textContent = ' (optionnel)';
    label2.appendChild(optional);

    const input2 = document.createElement('input');
    input2.type = 'email';
    input2.name = 'email';
    input2.style.padding = '0.85rem';
    input2.style.border = '1px solid var(--c-gris)';

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Envoyer';

    form.appendChild(label1);
    form.appendChild(input1);
    form.appendChild(label2);
    form.appendChild(input2);
    form.appendChild(btn);
    cadre.appendChild(form);
  }
};
/* Spécimen : Le texte d'exemple qui sert d'étiquette */
export default {
  title: "Placeholder qui sert d'étiquette",
  reference: "WCAG 3.3.2 · Étiquettes visibles",
  explanation: "L'intitulé est dans le placeholder : dès qu'on tape quelque chose, l'étiquette disparaît et l'utilisateur ne sait plus ce qu'il remplissait.",
  rule: "L'étiquette doit être visible en permanence, le placeholder sert d'exemple ou d'aide.",
  htmlBefore: `<!-- ❌ Mauvais : placeholder = étiquette -->
<input type="text" placeholder="Entrez votre nom" required>

<!-- ✅ Bon : étiquette visible -->
<label for="nom">Nom *</label>
<input type="text" id="nom" placeholder="Entrez votre nom" required>`,
  htmlAfter: `/* Étiquettes correctes */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
label {
  font-weight: 500;
  color: var(--c-gris-clair);
}
input {
  padding: 0.85rem 1rem;
  border: 1px solid var(--c-gris);
  border-radius: 0.5rem;
  font-size: 1rem;
}
input:focus {
  outline: 2px solid var(--c-ambre);
  outline-offset: 2px;
}`,
  piege(cadre) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Entrez votre nom';
    input.required = true;
    input.className = 'champ-placeholder';
    cadre.appendChild(input);
  },
  repare(cadre) {
    const label = document.createElement('label');
    label.htmlFor = 'nom-input';
    label.textContent = 'Nom *';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'nom-input';
    input.placeholder = 'Entrez votre nom';
    input.required = true;
    input.className = 'champ-etiquette';
    input.style.padding = '0.85rem 1rem';
    input.style.border = '1px solid var(--c-gris)';
    input.style.borderRadius = '0.5rem';
    input.style.fontSize = '1rem';

    label.appendChild(input);
    cadre.appendChild(label);
  }
};
/* Spécimen : L'effaceur */
export default {
  title: "L'effaceur",
  reference: "Nielsen 9 · Aider à corriger",
  explanation: "Lorsqu'un champ a une erreur, tout le formulaire est effacé. L'utilisateur doit tout re-saisir.",
  rule: "Conserver les saisies valides, ne réinitialiser que les champs erronés.",
  htmlBefore: `<!-- ❌ Mauvais : tout effacer -->
<form>
  <input type="text" name="prenom" required>
  <input type="email" name="email" required>
  <button type="submit">Envoyer</button>
</form>

<!-- ✅ Bon : conserver les saisies -->
<form>
  <div class="error-summary">⚠ Veuillez corriger les champs ci-dessous</div>
  <input type="text" name="prenom" required value="Jean">
  <input type="email" name="email" required value="email">
  <div class="error">Email invalide</div>
  <button type="submit">Envoyer</button>
</form>`,
  htmlAfter: `/* Conservation des saisies */
.error-summary {
  background: #FEF2F2;
  border-left: 4px solid #E53E3E;
  padding: 1rem;
  margin-bottom: 1rem;
}
.error {
  color: #E53E3E;
  font-size: 0.85rem;
  margin-top: -0.5rem;
}`,
  piege(cadre) {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1rem';

    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = 'Prénom';
    input1.name = 'prenom';
    input1.required = true;

    const input2 = document.createElement('input');
    input2.type = 'email';
    input2.placeholder = 'Email';
    input2.name = 'email';
    input2.required = true;

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Envoyer';

    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(btn);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input2.value.includes('@')) {
        alert('Email invalide ! Tout le formulaire est effacé...');
        form.reset();
      }
    });

    cadre.appendChild(form);
  },
  repare(cadre) {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1rem';

    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = 'Prénom';
    input1.name = 'prenom';
    input1.required = true;
    input1.value = 'Jean';

    const input2 = document.createElement('input');
    input2.type = 'email';
    input2.placeholder = 'Email';
    input2.name = 'email';
    input2.required = true;
    input2.value = 'exemple@email.com';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-summary';
    errorDiv.style.background = '#FEF2F2';
    errorDiv.style.borderLeft = '4px solid #E53E3E';
    errorDiv.style.padding = '1rem';
    errorDiv.style.marginBottom = '1rem';

    const emailError = document.createElement('div');
    emailError.className = 'error';
    emailError.style.color = '#E53E3E';
    emailError.style.fontSize = '0.85rem';
    emailError.textContent = 'Email invalide';

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Envoyer';

    form.appendChild(errorDiv);
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(emailError);
    form.appendChild(btn);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input2.value.includes('@')) {
        emailError.style.display = 'block';
      } else {
        alert('Formulaire envoyé !');
      }
    });

    cadre.appendChild(form);
  }
};
/* Spécimen : L'erreur vague */
export default {
  title: "Erreur vague",
  reference: "Nielsen 9 · WCAG 3.3.1",
  explanation: "Un seul message en haut de page dit 'Erreur' sans indiquer quels champs sont en faute. L'utilisateur doit chercher seul.",
  rule: "Les messages d'erreur doivent identifier le problème et indiquer comment le corriger.",
  htmlBefore: `<!-- ❌ Mauvais : message vague -->
<div class="erreur-generale">⚠ Erreur dans le formulaire</div>
<form>
  <input type="text" required>
  <input type="email" required>
  <button>Envoyer</button>
</form>

<!-- ✅ Bon : messages ciblés -->
<form>
  <div class="error-message" data-field="email">Email invalide. Format attendu: nom@domaine</div>
  <input type="email" aria-describedby="error-email">
  <button>Envoyer</button>
</form>`,
  htmlAfter: `/* Messages d'erreur ciblés */
.error-message {
  background: #FEF2F2;
  border-left: 4px solid #E53E3E;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
}
.field-error {
  border-color: #E53E3E;
}
.field-error input {
  background: #FFF5F5;
}`,
  piege(cadre) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'erreur-generale';
    errorDiv.style.background = '#FEF2F2';
    errorDiv.style.padding = '1rem';
    errorDiv.style.marginBottom = '1rem';
    errorDiv.style.borderLeft = '4px solid #E53E3E';
    errorDiv.textContent = '⚠ Erreur dans le formulaire';

    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1rem';

    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = 'Nom';
    input1.required = true;

    const input2 = document.createElement('input');
    input2.type = 'email';
    input2.placeholder = 'Email';
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
        alert('Erreur: email invalide');
      } else {
        alert('Envoyé');
      }
    });

    cadre.appendChild(errorDiv);
    cadre.appendChild(form);
  },
  repare(cadre) {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1rem';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('data-field', 'email');
    errorDiv.style.display = 'none';
    errorDiv.textContent = 'Email invalide. Format attendu: nom@domaine';

    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = 'Nom';
    input1.required = true;

    const input2 = document.createElement('input');
    input2.type = 'email';
    input2.id = 'email-field';
    input2.setAttribute('aria-describedby', 'error-email');
    input2.className = '';
    input2.style.padding = '0.85rem';
    input2.style.border = '1px solid var(--c-gris)';

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Envoyer';

    const emailError = document.createElement('div');
    emailError.id = 'error-email';
    emailError.style.color = '#E53E3E';
    emailError.style.fontSize = '0.85rem';

    form.appendChild(errorDiv);
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(emailError);
    form.appendChild(btn);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input2.value.includes('@')) {
        errorDiv.style.display = 'block';
        input2.classList.add('field-error');
        emailError.textContent = 'Email invalide';
      } else {
        alert('Formulaire envoyé avec succès');
      }
    });

    cadre.appendChild(form);
  }
};
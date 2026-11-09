/* Spécimen : La case précochée */
export default {
  title: "Case précochée",
  reference: "RGPD · Consentement libre, spécifique, éclairé",
  explanation: "Abonnement à la lettre d'information coché par défaut, caché sous le bouton 'Suivant'. L'utilisateur doit le découvrir en décochant.",
  rule: "Les cases à cocher pour le consentement doivent être décochées par défaut.",
  htmlBefore: `<!-- ❌ Mauvais : case cochée -->
<form>
  <input type="email" placeholder="Email">
  <label><input type="checkbox" checked> Je veux recevoir des newsletters</label>
  <button>Suivant</button>
</form>

<!-- ✅ Bon : case décochée -->
<form>
  <input type="email" placeholder="Email">
  <label><input type="checkbox"> Je veux recevoir des newsletters (facultatif)</label>
  <button>Suivant</button>
</form>`,
  htmlAfter: `/* Consentement explicite */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}`,
  piege(cadre) {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '0.5rem';

    const email = document.createElement('input');
    email.type = 'email';
    email.placeholder = 'Email';
    email.required = true;

    const checkLabel = document.createElement('label');
    checkLabel.style.display = 'flex';
    checkLabel.style.alignItems = 'center';
    checkLabel.style.gap = '0.5rem';
    checkLabel.style.cursor = 'pointer';
    checkLabel.style.color = 'var(--c-gris-clair)';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true; // Piège!

    const span = document.createElement('span');
    span.textContent = 'Je veux recevoir des newsletters';

    checkLabel.appendChild(checkbox);
    checkLabel.appendChild(span);

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Suivant';
    btn.style.padding = '0.75rem 1.5rem';
    btn.style.background = 'var(--c-ambre)';
    btn.style.color = 'var(--c-noir)';
    btn.style.fontWeight = '600';

    form.appendChild(email);
    form.appendChild(checkLabel);
    form.appendChild(btn);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (checkbox.checked) {
        alert('Abonné à la newsletter (sans consentement explicite)');
      }
    });

    cadre.appendChild(form);
  },
  repare(cadre) {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1rem';

    const email = document.createElement('input');
    email.type = 'email';
    email.placeholder = 'Email';
    email.required = true;
    email.style.padding = '0.85rem';
    email.style.border = '1px solid var(--c-gris)';

    const checkLabel = document.createElement('label');
    checkLabel.className = 'checkbox-label';
    checkLabel.style.display = 'flex';
    checkLabel.style.alignItems = 'center';
    checkLabel.style.gap = '0.5rem';
    checkLabel.style.cursor = 'pointer';
    checkLabel.style.color = 'var(--c-gris-clair)';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = false; // Correct!

    const span = document.createElement('span');
    span.textContent = 'Je veux recevoir des newsletters (facultatif)';
    span.style.fontSize = '0.9rem';

    checkLabel.appendChild(checkbox);
    checkLabel.appendChild(span);

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Suivant';
    btn.className = 'btn btn-ambre';

    form.appendChild(email);
    form.appendChild(checkLabel);
    form.appendChild(btn);
    cadre.appendChild(form);
  }
};
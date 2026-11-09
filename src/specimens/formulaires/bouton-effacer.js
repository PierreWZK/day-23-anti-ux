/* Spécimen : Le bouton Effacer */
export default {
  title: "Bouton Effacer",
  reference: "Nielsen 5 · Prévention des erreurs",
  explanation: "Le bouton 'Réinitialiser' est collé au bouton 'Envoyer', de la même taille. Un clic accidentel perd tout ce qui a été saisi.",
  rule: "Le bouton de réinitialisation doit être éloigné et séparé du bouton principal, ou supprimé au profit d'un contrôle détaillé.",
  htmlBefore: `<!-- ❌ Mauvais : bouton effacer collé -->
<button>Envoyer</button>
<button>Réinitialiser</button>

<!-- ✅ Bon : bouton effacer éloigné -->
<div>
  <button class="btn-principal">Envoyer</button>
</div>
<button class="btn-secondary" onclick="if(confirm('Vraiment tout effacer ?'))document.querySelector('form').reset()">
  Réinitialiser
</button>`,
  htmlAfter: `/* Séparation des actions */
.btn-principal {
  background: var(--c-ambre);
  color: var(--c-noir);
  font-weight: 600;
}
.btn-secondary {
  background: transparent;
  color: var(--c-rouge);
  border: 2px solid var(--c-rouge);
}`,
  piege(cadre) {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '0.5rem';

    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = 'Nom';
    input1.required = true;

    const input2 = document.createElement('input');
    input2.type = 'email';
    input2.placeholder = 'Email';
    input2.required = true;

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '0.5rem';

    const sendBtn = document.createElement('button');
    sendBtn.type = 'submit';
    sendBtn.textContent = 'Envoyer';
    sendBtn.className = 'btn btn-primary';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.textContent = 'Réinitialiser';
    resetBtn.className = 'btn btn-muet';
    resetBtn.style.background = '#6B7280';

    container.appendChild(sendBtn);
    container.appendChild(resetBtn);

    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(container);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Formulaire envoyé');
    });

    resetBtn.addEventListener('click', () => {
      form.reset();
      alert('Formulaire effacé !');
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
    input1.placeholder = 'Nom';
    input1.required = true;
    input1.style.padding = '0.85rem';

    const input2 = document.createElement('input');
    input2.type = 'email';
    input2.placeholder = 'Email';
    input2.required = true;
    input2.style.padding = '0.85rem';

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '1rem';
    actions.style.flexWrap = 'wrap';

    const sendBtn = document.createElement('button');
    sendBtn.type = 'submit';
    sendBtn.textContent = 'Envoyer';
    sendBtn.className = 'btn btn-ambre';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.textContent = 'Réinitialiser';
    resetBtn.className = 'btn btn-muet';

    actions.appendChild(sendBtn);
    actions.appendChild(resetBtn);

    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(actions);
    cadre.appendChild(form);
  }
};
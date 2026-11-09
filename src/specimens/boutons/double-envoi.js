/* Spécimen : Le double envoi */
export default {
  title: "Double envoi",
  reference: "Nielsen 5 · Prévention des erreurs",
  explanation: "Chaque fois que l'utilisateur clique sur le bouton, une nouvelle action est déclenchée. Trois clics = trois paiements, trois envois de formulaire, trois appels API.",
  rule: "Un clic doit déclencher une action unique. Verrouiller le bouton dès le premier clic.",
  htmlBefore: `<!-- ❌ Mauvais : chaque clic relance -->
<button class="btn btn-primary">Supprimer le compte</button>

<!-- ✅ Bon : bouton verrouillé après clic -->
<button class="btn btn-primary" disabled>Suppression en cours...</button>`,
  htmlAfter: `/* Gestion unique des clics */
.btn-submit {
  padding: 0.85rem 1.75rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  transition: all 0.2s;
}
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #6B7280;
}
.btn-submit:enabled:active {
  transform: scale(0.98);
  background: #E53E3E;
}`,
  piege(cadre) {
    let submitCount = 0;
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1rem';
    form.id = 'form-double-envoi';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Raison de la suppression';
    input.required = true;
    form.appendChild(input);

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn btn-rouge';
    btn.textContent = 'Supprimer mon compte';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitCount++;
      alert(`Action #${submitCount} exécutée ! (Le piège permet de cliquer plusieurs fois)`);
    });

    btn.addEventListener('click', (e) => {
      alert('Suppression confirmée ! (Mais vous pouvez cliquer de nouveau)');
    });

    form.appendChild(btn);
    cadre.appendChild(form);
  },
  repare(cadre) {
    let submitted = false;
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1rem';
    form.id = 'form-double-envoi-correct';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Raison de la suppression';
    input.required = true;
    form.appendChild(input);

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn btn-rouge';
    btn.textContent = 'Supprimer mon compte';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (submitted) return;
      submitted = true;
      btn.disabled = true;
      btn.textContent = 'Suppression en cours...';
      setTimeout(() => {
        btn.textContent = '✓ Compte supprimé';
        btn.style.background = '#38A169';
      }, 1000);
    });

    form.appendChild(btn);
    cadre.appendChild(form);
  }
};
/* Spécimen : Le copier-coller interdit */
export default {
  title: "Copier-coller interdit",
  reference: "WCAG 3.3.8 · Copie et collage",
  explanation: "Le champ de confirmation du mot de passe empêche le collage. Cela force l'utilisateur à taper à la main, ce qui est source d'erreurs.",
  rule: "Permettre le collage dans les champs de saisie, surtout dans les champs de mot de passe.",
  htmlBefore: `<!-- ❌ Mauvais : collage bloqué -->
<input type="password" id="mdp" placeholder="Mot de passe">
<input type="password" id="mdp-confirm" placeholder="Confirmation" onpaste="return false">

<!-- ✅ Bon : collage autorisé -->
<label for="mdp">Mot de passe</label>
<input type="password" id="mdp-bien" placeholder="Entrez votre mot de passe">
<button type="button" class="btn-show">👁️ Afficher</button>`,
  htmlAfter: `/* Champ de mot de passe amélioré */
.password-group {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.btn-show {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--c-cyan);
  cursor: pointer;
  font-size: 1rem;
}`,
  piege(cadre) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.5rem';

    const label1 = document.createElement('label');
    label1.textContent = 'Mot de passe';
    const input1 = document.createElement('input');
    input1.type = 'password';
    input1.placeholder = 'Mot de passe';
    input1.id = 'mdp-piecage';

    const label2 = document.createElement('label');
    label2.textContent = 'Confirmation';
    const input2 = document.createElement('input');
    input2.type = 'password';
    input2.placeholder = 'Confirmation';
    input2.id = 'mdp-confirm-piecage';

    input2.addEventListener('paste', (e) => {
      e.preventDefault();
      alert('Le collage est interdit ici !');
      return false;
    });

    label1.appendChild(input1);
    label2.appendChild(input2);
    container.appendChild(label1);
    container.appendChild(label2);
    cadre.appendChild(container);
  },
  repare(cadre) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.5rem';

    const pwdGroup = document.createElement('div');
    pwdGroup.className = 'password-group';

    const label1 = document.createElement('label');
    label1.htmlFor = 'mdp-bien';
    label1.textContent = 'Mot de passe';
    label1.style.display = 'block';
    label1.style.marginBottom = '0.25rem';

    const input1 = document.createElement('input');
    input1.type = 'password';
    input1.id = 'mdp-bien';
    input1.placeholder = 'Entrez votre mot de passe';
    input1.className = 'champ-bien';

    pwdGroup.appendChild(label1);
    pwdGroup.appendChild(input1);
    container.appendChild(pwdGroup);
    cadre.appendChild(container);
  }
};
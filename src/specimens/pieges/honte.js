/* Spécimen : La honte (confirmshaming) */
export default {
  title: "Honte",
  reference: "Confirmshaming · RGPD",
  explanation: "« Non merci, je préfère payer plus cher ». Le texte met en faute l'utilisateur qui refuse, créant un sentiment de culpabilité.",
  rule: "Le texte du bouton refus doit être neutre, sans jugement moral.",
  htmlBefore: `<!-- ❌ Mauvais : texte honteur -->
<button class="btn-refuser">Non merci, je préfère payer plus cher</button>

<!-- ✅ Bon : texte neutre -->
<button class="btn-refuser btn-correct">Non merci</button>`,
  htmlAfter: `/* Boutons de réponse équilibrés */
.btn-refuser {
  background: transparent;
  border: 2px solid #E53E3E;
  color: #E53E3E;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}
.btn-accepter {
  background: #FFAC33;
  color: #0a0a0a;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}`,
  piege(cadre) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '0.5rem';
    container.style.flexDirection = 'column';

    const acceptBtn = document.createElement('button');
    acceptBtn.textContent = 'Oui, je veux la promo';
    acceptBtn.style.background = '#FFAC33';
    acceptBtn.style.color = '#0a0a0a';
    acceptBtn.style.fontWeight = '600';
    acceptBtn.style.padding = '0.75rem 1.5rem';
    acceptBtn.style.borderRadius = '0.5rem';

    const refuseBtn = document.createElement('button');
    refuseBtn.textContent = 'Non merci, je préfère payer plus cher';
    refuseBtn.style.background = 'transparent';
    refuseBtn.style.border = '2px solid #E53E3E';
    refuseBtn.style.color = '#E53E3E';
    refuseBtn.style.padding = '0.75rem 1.5rem';
    refuseBtn.style.borderRadius = '0.5rem';

    container.appendChild(acceptBtn);
    container.appendChild(refuseBtn);
    cadre.appendChild(container);
  },
  repare(cadre) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '0.75rem';
    container.style.flexDirection = 'column';

    const acceptBtn = document.createElement('button');
    acceptBtn.textContent = 'Oui, je veux la promo';
    acceptBtn.className = 'btn btn-ambre';

    const refuseBtn = document.createElement('button');
    refuseBtn.textContent = 'Non merci';
    refuseBtn.className = 'btn btn-muet';

    container.appendChild(acceptBtn);
    container.appendChild(refuseBtn);
    cadre.appendChild(container);
  }
};
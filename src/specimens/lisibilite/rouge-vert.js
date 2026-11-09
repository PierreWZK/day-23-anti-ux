/* Spécimen : Le rouge et le vert */
export default {
  title: "Rouge et vert",
  reference: "WCAG 1.4.1 · Couleur",
  explanation: "Seule la couleur distingue « valide » et « refusé ». Les personnes daltoniennes ou en noir et blanc ne distinguent pas les états.",
  rule: "Ne pas se fier qu'à la couleur pour transmettre de l'information. Ajouter un symbole ou du texte.",
  htmlBefore: `<!-- ❌ Mauvais : couleur seule -->
<span class="status-valid">✓ Valide</span>
<span class="status-invalid">✗ Refusé</span>

<!-- ✅ Bon : couleur + symbole + texte -->
<span class="status-valid">✓ Valide</span>
<span class="status-invalid">✗ Refusé</span>`,
  htmlAfter: `/* Statuts accessibles */
.status-valid {
  color: #38A169;
  font-weight: bold;
}
.status-invalid {
  color: #E53E3E;
  font-weight: bold;
}
.status-valid::before { content: "✓ "; }
.status-invalid::before { content: "✗ "; }`,
  piege(cadre) {
    const valid = document.createElement('span');
    valid.textContent = 'Valide';
    valid.style.color = '#38A169';
    valid.style.fontWeight = 'bold';

    const invalid = document.createElement('span');
    invalid.textContent = 'Refusé';
    invalid.style.color = '#E53E3E';
    invalid.style.fontWeight = 'bold';

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '1rem';
    container.style.flexDirection = 'column';

    container.appendChild(valid);
    container.appendChild(invalid);
    cadre.appendChild(container);
  },
  repare(cadre) {
    const messages = [
      {text: 'Valide', type: 'valid'},
      {text: 'Refusé', type: 'invalid'}
    ];

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.5rem';

    messages.forEach(m => {
      const span = document.createElement('span');
      span.textContent = `${m.type === 'valid' ? '✓' : '✗'} ${m.text}`;
      span.style.fontWeight = 'bold';
      span.style.color = m.type === 'valid' ? '#38A169' : '#E53E3E';
      container.appendChild(span);
    });

    cadre.appendChild(container);
  }
};
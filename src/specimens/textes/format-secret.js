/* Spécimen : Le format secret */
export default {
  title: "Format secret",
  reference: "Loi de Postel · WCAG 3.3.3",
  explanation: "Le téléphone est refusé s'il contient des espaces ou des tirets, sans indiquer le format attendu. L'utilisateur tape et tape sans succès.",
  rule: "Accepter plusieurs formats et normaliser les données avant traitement.",
  htmlBefore: `<!-- ❌ Mauvais : format strict -->
<input type="tel" placeholder="+33 1 23 45 67 89" pattern="[0-9]{10}">

<!-- ✅ Bon : flexibilité -->
<input type="tel" placeholder="+33 1 23 45 67 89" class="format-flexible">`,
  htmlAfter: `/* Normalisation du format */
.format-flexible {
  padding: 0.85rem 1rem;
  border: 1px solid var(--c-gris);
  border-radius: 0.5rem;
}
.format-flexible::after {
  content: "(Ex: +33 1 23 45 67 89)";
  color: var(--c-cyan);
  font-size: 0.8rem;
}
`,
  piege(cadre) {
    const input = document.createElement('input');
    input.type = 'tel';
    input.placeholder = '+33 1 23 45 67 89';
    input.pattern = '[0-9]{10}';
    input.id = 'tel-mal';

    input.addEventListener('input', () => {
      const raw = input.value.replace(/\D/g, '');
      if (input.value.includes(' ') || input.value.includes('-')) {
        input.setCustomValidity('Format invalide');
      } else {
        input.setCustomValidity('');
      }
    });

    input.addEventListener('submit', () => {
      if (input.validity.valid) {
        alert('OK');
      } else {
        alert('Format incorrect');
      }
    });

    cadre.appendChild(input);
  },
  repare(cadre) {
    const input = document.createElement('input');
    input.type = 'tel';
    input.placeholder = '+33 1 23 45 67 89';
    input.id = 'tel-bien';
    input.className = 'format-flexible';

    input.addEventListener('input', (e) => {
      let raw = e.target.value.replace(/\D/g, '');
      if (raw.length > 0 && !raw.startsWith('33')) raw = '33' + raw;
      const formatted = raw.replace(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, '+$1 $2 $3 $4 $5');
      e.target.value = formatted;
    });

    const helper = document.createElement('small');
    helper.style.color = '#0891B2';
    helper.style.fontSize = '0.85rem';
    helper.textContent = 'Format accepté : +33 1 23 45 67 89 ou 06 12 34 56 78';

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.5rem';

    container.appendChild(input);
    container.appendChild(helper);
    cadre.appendChild(container);
  }
};
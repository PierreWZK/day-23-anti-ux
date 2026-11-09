/* Spécimen : Le confetti 14px */
export default {
  title: "Confetti 14px",
  reference: "WCAG 2.5.8 · Cibles tactiles",
  explanation: "Le bouton fait seulement 14px de côté, collé à son voisin. Sur mobile, c'est impossible à cliquer sans se tromper de cible.",
  rule: "Les cibles tactiles doivent faire au moins 44px de côté avec un espace suffisant entre elles.",
  htmlBefore: `<!-- ❌ Mauvais : bouton trop petit -->
<div>
  <button class="btn-confett">✓</button>
  <button class="btn-confett">✘</button>
  <button class="btn-confett">?</button>
</div>

<!-- ✅ Bon : boutons accessibles -->
<div>
  <button class="btn-confett btn-ok">✓ OK</button>
  <button class="btn-confett btn-cancel">✘ Annuler</button>
  <button class="btn-confett btn-help">? Aide</button>
</div>`,
  htmlAfter: `/* Cibles tactiles accessibles */
.btn-confett {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 10px;
  margin: 5px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: all 0.2s;
}
.btn-confett.ok {
  background: #38A169;
  color: white;
}
.btn-confett.cancel {
  background: #E53E3E;
  color: white;
}
.btn-confett.help {
  background: #0891B2;
  color: white;
}`,
  piege(cadre) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '2px';
    container.style.flexDirection = 'row';

    for (let i = 0; i < 3; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-confett';
      btn.style.width = '14px';
      btn.style.height = '14px';
      btn.style.padding = '0';
      btn.style.margin = '0';
      btn.style.fontSize = '10px';
      btn.textContent = i === 0 ? '✓' : i === 1 ? '✘' : '?';
      container.appendChild(btn);
    }

    cadre.appendChild(container);
  },
  repare(cadre) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.flexWrap = 'wrap';

    const labels = ['OK', 'Annuler', 'Aide'];
    const classes = ['ok', 'cancel', 'help'];

    for (let i = 0; i < 3; i++) {
      const btn = document.createElement('button');
      btn.className = `btn btn-confett ${classes[i]}`;
      btn.style.padding = '10px';
      btn.style.margin = '5px';
      btn.style.fontSize = '1rem';
      btn.textContent = labels[i];
      row.appendChild(btn);
    }

    container.appendChild(row);
    cadre.appendChild(container);
  }
};
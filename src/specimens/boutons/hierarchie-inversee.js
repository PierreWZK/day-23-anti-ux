/* Spécimen : La hiérarchie inversée */
export default {
  title: "Hiérarchie inversée",
  reference: "Nielsen 5 · Prévention des erreurs",
  explanation: "L'action destructrice (supprimer) est mise en avant comme l'action principale, tandis que l'action de conservation est en retrait. Cela incite l'utilisateur à cocher le mauvais bouton.",
  rule: "Les actions destructrices doivent être moins visibles que les actions de conservation.",
  htmlBefore: `<!-- ❌ Mauvais : suppression en premier plan -->
<button class="btn btn-large btn-rouge">Supprimer mon compte</button>
<a href="#" class="btn-link">Conserver mes données</a>

<!-- ✅ Bon : conservation en premier plan -->
<a href="#" class="btn btn-vert">Conserver mes données</a>
<button class="btn btn-rouge-outline">Supprimer mon compte</button>`,
  htmlAfter: `/* Hiérarchie correcte */
.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  transition: all 0.2s;
}
.btn-rouge {
  background: #E53E3E;
  color: white;
}
.btn-vert {
  background: #38A169;
  color: white;
  padding: 0.85rem 1.75rem;
  border-radius: 0.5rem;
}
.btn-rouge-outline {
  background: transparent;
  color: #E53E3E;
  border: 2px solid #E53E3E;
}
.btn-link {
  color: #0891B2;
  font-size: 0.9rem;
  text-decoration: underline;
}`,
  piege(cadre) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '1rem';
    container.style.flexDirection = 'column';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-rouge';
    deleteBtn.style.padding = '1.25rem 2.5rem';
    deleteBtn.style.fontSize = '1.1rem';
    deleteBtn.textContent = '❌ Supprimer mon compte';

    const cancelLink = document.createElement('a');
    cancelLink.href = '#';
    cancelLink.className = 'btn btn-gris';
    cancelLink.textContent = 'Conserver mes données';
    cancelLink.style.padding = '0.75rem 1.5rem';
    cancelLink.style.fontSize = '0.9rem';

    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Compte supprimé ! (Mauvaise hiérarchie incite à ce choix)');
    });

    cancelLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Données conservées');
    });

    container.appendChild(deleteBtn);
    container.appendChild(cancelLink);
    cadre.appendChild(container);
  },
  repare(cadre) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '1rem';
    container.style.flexDirection = 'column';

    const cancelLink = document.createElement('a');
    cancelLink.href = '#';
    cancelLink.className = 'btn btn-vert';
    cancelLink.textContent = 'Conserver mes données';
    cancelLink.style.padding = '0.85rem 1.75rem';
    cancelLink.style.fontSize = '1rem';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn-rouge-outline';
    deleteBtn.textContent = 'Supprimer mon compte';

    container.appendChild(cancelLink);
    container.appendChild(document.createElement('br'));
    container.appendChild(deleteBtn);
    cadre.appendChild(container);
  }
};
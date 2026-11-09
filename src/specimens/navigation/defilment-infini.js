/* Spécimen : Le défilement infini */
export default {
  title: "Défilement infini",
  reference: "Nielsen 3 · Liberté de l'utilisateur",
  explanation: "Le pied de page recule à chaque chargement. L'utilisateur descend, le pied de page remonte, impossible d'atteindre le lien Contact.",
  rule: "Lorsque le contenu se charge dynamiquement, prévoir un point d'arrêt ou un bouton 'Charger plus'.",
  htmlBefore: `<!-- ❌ Mauvais : pied de page inaccessible -->
<div class="liste-infini">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <!-- ... tous les items remontent -->
</div>
<div class="pied-de-page">Contact</div>

<!-- ✅ Bon : bouton charger plus -->
<div class="liste">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
</div>
<button class="btn-charger">Charger plus</button>
<div class="pied-de-page">Contact</div>`,
  htmlAfter: `/* Charge plus contrôlé */
.btn-charger {
  display: block;
  margin: 2rem auto;
  padding: 1rem 2rem;
}`,
  piege(cadre) {
    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';
    list.style.margin = '0';

    let items = [];
    const addItem = () => {
      const item = document.createElement('li');
      item.textContent = `Item ${items.length + 1}`;
      item.style.padding = '1rem';
      item.style.borderBottom = '1px solid var(--c-gris)';
      list.insertBefore(item, list.firstChild);
      items.push(item);
    };

    for (let i = 1; i <= 5; i++) addItem();

    list.addEventListener('mouseenter', () => {
      // Les items remontent - bug
      items.forEach((item, idx) => {
        setTimeout(() => {
          list.insertBefore(item, list.firstChild);
        }, idx * 100);
      });
    });

    const footer = document.createElement('footer');
    footer.textContent = 'Contact : contact@example.com';
    footer.style.padding = '2rem';
    footer.style.background = 'var(--c-noir)';
    footer.style.color = 'var(--c-gris-clair)';

    const container = document.createElement('div');
    container.style.height = '300px';
    container.style.overflow = 'auto';
    container.appendChild(list);
    container.appendChild(footer);

    cadre.appendChild(container);
  },
  repare(cadre) {
    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';
    list.style.margin = '0 0 1rem 0';

    for (let i = 1; i <= 5; i++) {
      const item = document.createElement('li');
      item.textContent = `Item ${i}`;
      item.style.padding = '1rem';
      item.style.borderBottom = '1px solid var(--c-gris)';
      list.appendChild(item);
    }

    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'btn-charger';
    loadMoreBtn.textContent = 'Charger plus';
    loadMoreBtn.style.display = 'block';
    loadMoreBtn.style.margin = '2rem auto';
    loadMoreBtn.style.padding = '1rem 2rem';

    loadMoreBtn.addEventListener('click', () => {
      const newItemCount = list.children.length + 1;
      const item = document.createElement('li');
      item.textContent = `Item ${newItemCount}`;
      item.style.padding = '1rem';
      item.style.borderBottom = '1px solid var(--c-gris)';
      list.appendChild(item);
    });

    const footer = document.createElement('footer');
    footer.textContent = 'Contact : contact@example.com';
    footer.style.padding = '2rem';
    footer.style.background = 'var(--c-noir)';
    footer.style.color = 'var(--c-gris-clair)';
    footer.style.textAlign = 'center';

    cadre.appendChild(list);
    cadre.appendChild(loadMoreBtn);
    cadre.appendChild(footer);
  }
};
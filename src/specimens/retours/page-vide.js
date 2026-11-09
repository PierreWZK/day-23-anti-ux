/* Spécimen : La page vide */
export default {
  title: "Page vide",
  reference: "Nielsen 10 · Aide",
  explanation: "Une liste vide n'affiche rien, ni explication ni action. L'utilisateur ne sait pas s'il y a un problème ou si la liste est simplement vide.",
  rule: "Tout état vide doit présenter une explication et une action possible.",
  htmlBefore: `<!-- ❌ Mauvais : rien pour voir -->
<ul class="liste-vide">
  <!-- Aucun élément -->
</ul>

<!-- ✅ Bon : état vide explicite -->
<div class="empty-state">
  <p>Aucune donnée à afficher</p>
  <button class="btn-primary">Actualiser</button>
</div>`,
  htmlAfter: `/* État vide stylisé */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}
.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}`,
  piege(cadre) {
    const list = document.createElement('ul');
    list.className = 'liste-vide';
    list.style.listStyle = 'none';
    list.style.padding = '0';
    list.style.margin = '0';

    cadre.appendChild(list);
  },
  repare(cadre) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.style.textAlign = 'center';
    emptyState.style.padding = '3rem 1rem';

    const icon = document.createElement('div');
    icon.className = 'empty-state-icon';
    icon.textContent = '📭';
    icon.style.fontSize = '3rem';
    icon.style.marginBottom = '1rem';
    icon.style.opacity = '0.5';

    const text = document.createElement('p');
    text.textContent = 'Aucune donnée à afficher';
    text.style.opacity = '0.7';
    text.style.marginBottom = '1rem';

    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Actualiser';
    btn.addEventListener('click', () => {
      text.textContent = 'Données actualisées !';
      btn.style.display = 'none';
    });

    emptyState.appendChild(icon);
    emptyState.appendChild(text);
    emptyState.appendChild(btn);
    cadre.appendChild(emptyState);
  }
};
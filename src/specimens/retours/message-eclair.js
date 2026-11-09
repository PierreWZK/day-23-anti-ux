/* Spécimen : Le message éclair */
export default {
  title: "Message éclair",
  reference: "WCAG 2.2.1 · Durée d'affichage",
  explanation: "Le message de confirmation disparaît en une seconde. L'utilisateur n'a pas le temps de le lire avant qu'il soit partie.",
  rule: "Les messages d'information doivent rester visibles assez longtemps pour être lus, ou être manuellement fermables.",
  htmlBefore: `<!-- ❌ Mauvais : disparition immédiate -->
<div class="message">✓ Action réussie</div>

<!-- ✅ Bon : message persistant -->
<div class="message message-persistant">
  ✓ Action réussie
  <button class="btn-close">×</button>
</div>`,
  htmlAfter: `/* Message contrôlable */
.message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.5;
}`,
  piege(cadre) {
    const msg = document.createElement('div');
    msg.className = 'message';
    msg.style.background = '#38A169';
    msg.style.color = 'white';
    msg.style.padding = '1rem';
    msg.style.borderRadius = '0.5rem';
    msg.textContent = '✓ Action réussie !';
    msg.style.marginBottom = '1rem';

    setTimeout(() => {
      msg.style.opacity = '0';
      msg.style.transition = 'opacity 0.5s';
    }, 1000);

    cadre.appendChild(msg);
  },
  repare(cadre) {
    const container = document.createElement('div');
    container.className = 'message message-persistant';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '0.5rem';
    container.style.padding = '1rem';
    container.style.marginBottom = '1rem';
    container.style.borderRadius = '0.5rem';
    container.style.background = '#38A169';
    container.style.color = 'white';

    const text = document.createElement('span');
    text.textContent = '✓ Action réussie !';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-close';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1.2rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.opacity = '0.5';
    closeBtn.textContent = '×';

    closeBtn.addEventListener('click', () => {
      container.style.transition = 'opacity 0.3s';
      container.style.opacity = '0';
    });

    container.appendChild(text);
    container.appendChild(closeBtn);
    cadre.appendChild(container);
  }
};
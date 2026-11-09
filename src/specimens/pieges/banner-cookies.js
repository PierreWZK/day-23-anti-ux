/* Spécimen : La bannière de cookies */
export default {
  title: "Bannière de cookies",
  reference: "RGPD, CNIL · Consentement libre et spécifique",
  explanation: "« Tout accepter » en gros bouton, refuser la demande sur quatre écrans. L'utilisateur doit combattre l'agresseur pour ses droits.",
  rule: "Offrir égalité entre accepter et refuser, avec un rejet aisé et immédiat.",
  htmlBefore: `<!-- ❌ Mauvais : accepter en premier -->
<div class="cookie-banniere">
  <p>Nous utilisons des cookies pour améliorer votre expérience.</p>
  <button class="btn-accepter">Tout accepter</button>
  <a href="#">Gérer les préférences</a>
</div>

<!-- ✅ Bon : refuser aussi visible -->
<div class="cookie-banniere cookie-correct">
  <p>Nous utilisons des cookies pour améliorer votre expérience.</p>
  <button class="btn-refuser">Refuser</button>
  <button class="btn-accepter">Accepter</button>
  <a href="#">Gérer les préférences</a>
</div>`,
  htmlAfter: `/* Bannière équilibrée */
.cookie-banniere {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #1a1a1a;
  color: #e2e2e2;
}
.cookie-banniere .btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin-right: 0.5rem;
}
`,
  piege(cadre) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banniere';
    banner.style.background = '#1a1a1a';
    banner.style.color = '#e2e2e2';
    banner.style.padding = '1rem';
    banner.style.borderRadius = '0.5rem';
    banner.style.marginBottom = '1rem';

    const text = document.createElement('p');
    text.textContent = 'Nous utilisons des cookies pour améliorer votre expérience.';
    text.style.marginBottom = '0.5rem';

    const acceptBtn = document.createElement('button');
    acceptBtn.textContent = 'Tout accepter';
    acceptBtn.style.background = '#FFAC33';
    acceptBtn.style.color = '#0a0a0a';
    acceptBtn.style.fontWeight = '600';
    acceptBtn.style.padding = '0.75rem 1.5rem';
    acceptBtn.style.borderRadius = '0.5rem';
    acceptBtn.style.marginRight = '0.5rem';

    const manageLink = document.createElement('a');
    manageLink.href = '#';
    manageLink.textContent = 'Gérer les préférences';
    manageLink.style.color = '#0891B2';

    banner.appendChild(text);
    banner.appendChild(acceptBtn);
    banner.appendChild(manageLink);
    cadre.appendChild(banner);
  },
  repare(cadre) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banniere cookie-correct';
    banner.style.display = 'flex';
    banner.style.flexDirection = 'column';
    banner.style.gap = '0.75rem';
    banner.style.padding = '1rem';
    banner.style.background = '#1a1a1a';
    banner.style.color = '#e2e2e2';
    banner.style.borderRadius = '0.5rem';

    const text = document.createElement('p');
    text.textContent = 'Nous utilisons des cookies pour améliorer votre expérience.';

    const btnRefuser = document.createElement('button');
    btnRefuser.textContent = 'Refuser';
    btnRefuser.style.background = 'transparent';
    btnRefuser.style.border = '2px solid #FFAC33';
    btnRefuser.style.color = '#FFAC33';
    btnRefuser.style.padding = '0.5rem 1rem';
    btnRefuser.style.borderRadius = '0.5rem';
    btnRefuser.style.cursor = 'pointer';

    const btnAccepter = document.createElement('button');
    btnAccepter.textContent = 'Accepter';
    btnAccepter.style.background = '#FFAC33';
    btnAccepter.style.color = '#0a0a0a';
    btnAccepter.style.fontWeight = '600';
    btnAccepter.style.padding = '0.5rem 1rem';
    btnAccepter.style.borderRadius = '0.5rem';
    btnAccepter.style.cursor = 'pointer';

    const manageLink = document.createElement('a');
    manageLink.href = '#';
    manageLink.textContent = 'Gérer les préférences';
    manageLink.style.color = '#0891B2';
    manageLink.style.fontSize = '0.9rem';

    banner.appendChild(text);
    banner.appendChild(btnRefuser);
    banner.appendChild(btnAccepter);
    banner.appendChild(manageLink);
    cadre.appendChild(banner);
  }
};
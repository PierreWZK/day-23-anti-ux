/* Spécimen : Le désabonnement sans fin */
export default {
  title: "Désabonnement sans fin",
  reference: "*Roach motel* · RGPD",
  explanation: "Douze étapes, des questions culpabilisantes, un lien caché. S'abonner prend 1 clic, se désabonner prend 12 minutes.",
  rule: "Le processus de désabonnement doit être aussi simple que l'abonnement. Un clic suffit.",
  htmlBefore: `<!-- ❌ Mauvais : désabonnement complexe -->
<div class="unsubscribe-process">
  <p>Étape 1/12: Confirmez votre email</p>
  <p>Étape 2/12: Sélectionnez le motif</p>
  <!-- ... 10 étapes plus -->
  <p>Étape 12/12: Pourquoi nous quitter ?</p>
</div>

<!-- ✅ Bon : désabonnement simple -->
<button class="btn-unsubscribe">Se désabonner en un clic</button>`,
  htmlAfter: `/* Désabonnement simple */
.btn-unsubscribe {
  padding: 1rem 2rem;
  background: #E53E3E;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}`,
  piege(cadre) {
    const process = document.createElement('div');
    process.className = 'unsubscribe-process';
    process.style.padding = '1rem';
    process.style.background = '#1a1a1a';
    process.style.borderRadius = '0.5rem';
    process.style.marginBottom = '1rem';

    const steps = Array(12).fill(0).map((_, i) => `Étape ${i + 1}/12`);

    steps.forEach((step, i) => {
      const p = document.createElement('p');
      p.textContent = step;
      p.style.padding = '0.5rem';
      p.style.background = '#111';
      p.style.marginBottom = '0.25rem';
      p.style.borderLeft = '3px solid #FFAC33';
      if (i === 11) p.style.fontWeight = 'bold';
      process.appendChild(p);
    });

    const fakeLink = document.createElement('a');
    fakeLink.href = '#';
    fakeLink.textContent = 'Cliquez ici pour un abonnement gratuit';
    fakeLink.style.display = 'block';
    fakeLink.style.textAlign = 'center';
    fakeLink.style.color = 'var(--c-cyan)';
    fakeLink.style.marginTop = '1rem';

    fakeLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Malheureusement, le vrai désabonnement est caché...');
    });

    cadre.appendChild(process);
    cadre.appendChild(fakeLink);
  },
  repare(cadre) {
    const btn = document.createElement('button');
    btn.className = 'btn-unsubscribe';
    btn.textContent = 'Se désabonner en un clic';
    btn.style.padding = '1rem 2rem';
    btn.style.background = '#E53E3E';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '0.5rem';
    btn.style.fontWeight = '600';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '1rem';

    btn.addEventListener('click', () => {
      alert('Désabonnement effectué avec succès !');
    });

    cadre.appendChild(btn);
  }
};
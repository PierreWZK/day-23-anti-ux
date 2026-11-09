/* Spécimen : Le défilement détourné */
export default {
  title: "Défilement détourné",
  reference: "Nielsen 3 · Navigation cohérente",
  explanation: "La molette fait défiler à une vitesse imposée, sautant plusieurs éléments à la fois. L'utilisateur perd le fil d'Ariane.",
  rule: "Utiliser le défilement natif du navigateur pour une expérience cohérente.",
  htmlBefore: `<!-- ❌ Mauvais : scroll custom -->
<div class="scroll-custom" style="overflow-y: scroll; scroll-behavior: smooth;">
  <div style="height: 3000px;">
    <div>Section 1</div>
    <div>Section 2</div>
    <!-- ... -->
  </div>
</div>

<!-- ✅ Bon : scroll natif -->
<div style="scroll-behavior: smooth;">
  <section>Section 1</section>
  <section>Section 2</section>
</div>`,
  htmlAfter: `/* Scroll naturel */
.scroll-container {
  overflow-y: auto;
  scroll-behavior: smooth;
}
`,
  piege(cadre) {
    const container = document.createElement('div');
    container.className = 'scroll-custom';
    container.style.overflowY = 'auto';
    container.style.height = '200px';
    container.style.scrollBehavior = 'smooth';
    container.style.border = '1px solid var(--c-gris)';

    // Intercepter la molette
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      container.scrollTop += e.deltaY * 3; // Scroll 3 fois plus vite
    });

    const content = document.createElement('div');
    content.style.height = '1000px';

    for (let i = 1; i <= 5; i++) {
      const section = document.createElement('div');
      section.textContent = `Section ${i}`;
      section.style.padding = '2rem';
      section.style.background = `var(--c-gris)`;
      section.style.color = 'var(--c-gris-clair)';
      section.style.borderBottom = '1px solid var(--c-noir)';
      content.appendChild(section);
    }

    container.appendChild(content);
    cadre.appendChild(container);
  },
  repare(cadre) {
    const section1 = document.createElement('section');
    section1.textContent = 'Section 1';
    section1.style.padding = '2rem';
    section1.style.background = 'var(--c-gris)';
    section1.style.color = 'var(--c-gris-clair)';
    section1.style.borderBottom = '1px solid var(--c-noir)';

    const section2 = document.createElement('section');
    section2.textContent = 'Section 2';
    section2.style.padding = '2rem';
    section2.style.background = 'var(--c-gris)';
    section2.style.color = 'var(--c-gris-clair)';
    section2.style.borderBottom = '1px solid var(--c-noir)';

    cadre.appendChild(section1);
    cadre.appendChild(section2);
  }
};
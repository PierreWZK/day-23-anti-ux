/* Spécimen : Le pavé */
export default {
  title: "Le pavé",
  reference: "WCAG 1.4.8 · Mise en page visuelle",
  explanation: "Texte justifié en 11px, tout en majuscules, lignes de 160 caractères. C'est illisible et fatigant à lire.",
  rule: "Texte de 16px minimum, alignement à gauche, max 70 caractères par ligne, casse normale.",
  htmlBefore: `<!-- ❌ Mauvais : pavé illisible -->
<p style="font-size: 11px; text-align: justify; line-height: 1; text-transform: uppercase; max-width: 1200px;">
  CE TEXTE EST TRÈS DIFFICILE À LUire CAR IL SAUTE DE TIERE ET IL EST TROIS PEU LISIBLE.
</p>

<!-- ✅ Bon : lecture aisée -->
<p style="font-size: 16px; text-align: left; line-height: 1.5; max-width: 45rem; margin: 0 auto;">
  Ce texte est clair et facile à lire. Chaque ligne fait un maximum de 70 caractères.
</p>`,
  htmlAfter: `/* Texte lisible */
.text-readable {
  font-size: 16px;
  line-height: 1.5;
  max-width: 45rem;
  margin: 0 auto;
  text-align: left;
}`,
  piege(cadre) {
    const p = document.createElement('p');
    p.textContent = 'CE TEXTE EST TRÈS DIFFICILE À LUire CAR IL SAUTE DE TIERE ET IL EST TROIS PEU LISIBLE.';
    p.style.fontSize = '11px';
    p.style.textAlign = 'justify';
    p.style.lineHeight = '1';
    p.style.text_transform = 'uppercase';
    p.style.maxWidth = '1200px';

    cadre.appendChild(p);
  },
  repare(cadre) {
    const p = document.createElement('p');
    p.className = 'text-readable';
    p.textContent = 'Ce texte est clair et facile à lire. Chaque ligne fait un maximum de 70 caractères. Cette police de caractères respectueuse du confort de lecture prévient aussi les problèmes de dyslexie.';
    cadre.appendChild(p);
  }
};
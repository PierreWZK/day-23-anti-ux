/* Spécimen : Le gris sur gris */
export default {
  title: "Gris sur gris",
  reference: "WCAG 1.4.3 · Contraste",
  explanation: "Texte gris clair sur fond blanc (ou texte gris sur fond gris) : le contraste est trop faible pour être lisible, surtout pour les personnes âgées ou daltoniennes.",
  rule: "Le contraste entre le texte et le fond doit être d'au moins 4.5:1 pour le texte normal.",
  htmlBefore: `<!-- ❌ Mauvais : faible contraste -->
<div style="background: #FFFFFF; color: #808080;">
  <p>Texte peu lisible</p>
</div>

<!-- ✅ Bon : contraste suffisant -->
<div style="background: #FFFFFF; color: #333333;">
  <p>Texte lisible</p>
</div>`,
  htmlAfter: `/* Contraste conforme WCAG */
.high-contrast {
  background: #FFFFFF;
  color: #333333;
}`,
  piege(cadre) {
    const p = document.createElement('p');
    p.textContent = 'Texte peu lisible - contraste faible';
    p.style.background = '#FFFFFF';
    p.style.color = '#808080';
    p.style.padding = '1rem';
    cadre.appendChild(p);
  },
  repare(cadre) {
    const p = document.createElement('p');
    p.textContent = 'Texte lisible - contraste suffisant';
    p.style.background = '#FFFFFF';
    p.style.color = '#333333';
    p.style.padding = '1rem';
    p.style.borderRadius = '0.5rem';
    cadre.appendChild(p);
  }
};
/* Spécimen : « Cliquez ici » */
export default {
  title: "« Cliquez ici »",
  reference: "WCAG 2.4.4 · Destinée des liens",
  explanation: "Des liens qui disent tous « ici », « en savoir plus ». L'utilisateur ne sait pas où le lien mène avant de cliquer.",
  rule: "Le texte d'un lien doit indiquer sa destination ou son action.",
  htmlBefore: `<!-- ❌ Mauvais : texte générique -->
<p>Lire les <a href="#">ici</a></p>
<p>Plus de <a href="#">détails</a></p>

<!-- ✅ Bon : texte descriptif -->
<p>Lire les <a href="#">_conditions générales_ici</a></p>
<p>Voir les <a href="#">détails_de_la_commande</a></p>`,
  htmlAfter: `/* Liens descriptifs */
a {
  color: var(--c-ambre);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}`,
  piege(cadre) {
    const p1 = document.createElement('p');
    p1.innerHTML = 'Lire les <a href="#">conditions générales</a>';

    const p2 = document.createElement('p');
    p2.innerHTML = 'En savoir <a href="#">plus</a> sur notre service';

    const p3 = document.createElement('p');
    p3.innerHTML = 'Voir <a href="#">ici</a> les options avancées';

    cadre.appendChild(p1);
    cadre.appendChild(p2);
    cadre.appendChild(p3);
  },
  repare(cadre) {
    const links = [
      {text: 'conditions générales', href: '#'},
      {text: 'plus sur notre service', href: '#'},
      {text: 'options avancées', href: '#'}
    ];

    links.forEach(l => {
      const p = document.createElement('p');
      p.innerHTML = `Lire les <a href="${l.href}">${l.text}_ici</a>`;
      cadre.appendChild(p);
    });
  }
};
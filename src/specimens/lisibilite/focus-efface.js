/* Spécimen : Le focus effacé */
export default {
  title: "Focus effacé",
  reference: "WCAG 2.4.7 · Focus visible",
  explanation: "`outline: none` partout : au clavier, on ne sait plus où on est. Cela rend l'interface inutilisable sans souris.",
  rule: "Tout élément recevable du focus doit avoir un contournement visible et contrasté.",
  htmlBefore: `<!-- ❌ Mauvais : focus invisible -->
<style>
  * { outline: none; }
</style>
<button>Mon bouton</button>

<!-- ✅ Bon : focus visible -->
<style>
  button:focus { outline: 3px solid #FFAC33; outline-offset: 2px; }
</style>
<button class="btn-focus">Mon bouton</button>`,
  htmlAfter: `/* Focus visible et contrasté */
.btn-focus:focus {
  outline: 3px solid var(--c-ambre);
  outline-offset: 2px;
}`,
  piege(cadre) {
    const style = document.createElement('style');
    style.textContent = '* { outline: none !important; }';
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Mon bouton';
    btn.style.padding = '0.85rem 1.75rem';

    cadre.appendChild(btn);
    cadre.appendChild(document.createElement('br'));
    cadre.appendChild(document.createElement('p')).textContent = 'Naviguez avec Tab - le focus est invisible !';
  },
  repare(cadre) {
    const style = document.createElement('style');
    style.textContent = '.btn-focus:focus { outline: 3px solid var(--c-ambre); outline-offset: 2px; }';
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.className = 'btn btn-primary btn-focus';
    btn.textContent = 'Mon bouton';
    btn.style.padding = '0.85rem 1.75rem';

    const p = document.createElement('p');
    p.textContent = 'Naviguez avec Tab - le focus est visible !';
    p.style.color = 'var(--c-vert)';

    cadre.appendChild(btn);
    cadre.appendChild(p);
  }
};
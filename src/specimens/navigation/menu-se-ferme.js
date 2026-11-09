/* Spécimen : Le menu qui se ferme */
export default {
  title: "Menu qui se ferme",
  reference: "Contrôle de l'utilisateur",
  explanation: "Le sous-menu disparaît dès que le pointeur sort en diagonale. L'utilisateur arrive en côte et le menu se referme, il faut recommencer.",
  rule: "Donner un délai de fermeture et une zone de tolérance pour le menu déroulant.",
  htmlBefore: `<!-- ❌ Mauvais : fermeture immédiate -->
<div class="menu">
  <button class="menu-toggle">Options</button>
  <div class="submenu">
    <a href="#">Profil</a>
    <a href="#">Paramètres</a>
    <a href="#">Déconnexion</a>
  </div>
</div>

<!-- ✅ Bon : fermeture avec délai -->
<div class="menu menu-stable">
  <button class="menu-toggle">Options</button>
  <div class="submenu submenu-delay">
    <a href="#">Profil</a>
    <a href="#">Paramètres</a>
    <a href="#">Déconnexion</a>
  </div>
</div>`,
  htmlAfter: `/* Menu stable */
.menu {
  position: relative;
}
.submenu {
  position: absolute;
  top: 100%;
  left: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
}
.menu:hover .submenu,
.menu:focus-within .submenu {
  opacity: 1;
  visibility: visible;
}
`,
  piege(cadre) {
    const menu = document.createElement('div');
    menu.style.position = 'relative';
    menu.style.display = 'inline-block';

    const toggle = document.createElement('button');
    toggle.textContent = 'Options';
    toggle.style.padding = '0.5rem 1rem';
    toggle.style.cursor = 'pointer';

    const submenu = document.createElement('div');
    submenu.style.position = 'absolute';
    submenu.style.top = '100%';
    submenu.style.left = '0';
    submenu.style.background = 'var(--c-gris)';
    submenu.style.padding = '0.5rem';
    submenu.style.display = 'none';

    submenu.style.zIndex = '100';
    submenu.style.borderRadius = '0.5rem';
    submenu.style.boxShadow = 'var(--shadow-md)';

    ['Profil', 'Paramètres', 'Déconnexion'].forEach(text => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = text;
      a.style.display = 'block';
      a.style.padding = '0.5rem 1rem';
      a.style.color = 'var(--c-gris-clair)';
      a.style.textDecoration = 'none';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`Navigation: ${text}`);
      });
      submenu.appendChild(a);
    });

    toggle.addEventListener('click', () => {
      submenu.style.display = submenu.style.display === 'none' ? 'block' : 'none';
    });

    menu.appendChild(toggle);
    menu.appendChild(submenu);
    cadre.appendChild(menu);
  },
  repare(cadre) {
    const menu = document.createElement('div');
    menu.className = 'menu-stable';
    menu.style.position = 'relative';
    menu.style.display = 'inline-block';

    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.textContent = 'Options';
    toggle.style.padding = '0.5rem 1rem';
    toggle.style.cursor = 'pointer';

    const submenu = document.createElement('div');
    submenu.className = 'submenu-delay';
    submenu.style.position = 'absolute';
    submenu.style.top = '100%';
    submenu.style.left = '0';
    submenu.style.background = 'var(--c-gris)';
    submenu.style.padding = '0.75rem';
    submenu.style.opacity = '0';
    submenu.style.visibility = 'hidden';
    submenu.style.transition = 'opacity 0.2s, visibility 0.2s';
    submenu.style.zIndex = '100';
    submenu.style.borderRadius = '0.5rem';
    submenu.style.boxShadow = 'var(--shadow-md)';
    submenu.style.minWidth = '120px';

    ['Profil', 'Paramètres', 'Déconnexion'].forEach(text => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = text;
      a.style.display = 'block';
      a.style.padding = '0.5rem 1rem';
      a.style.color = 'var(--c-gris-clair)';
      a.style.textDecoration = 'none';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`Navigation: ${text}`);
      });
      submenu.appendChild(a);
    });

    menu.appendChild(toggle);
    menu.appendChild(submenu);

    menu.addEventListener('mouseenter', () => {
      submenu.style.opacity = '1';
      submenu.style.visibility = 'visible';
    });

    menu.appendChild(menu);
    cadre.appendChild(menu);
  }
};
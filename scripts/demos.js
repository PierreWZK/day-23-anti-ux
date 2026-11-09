/* Anti-UX · Comportements des démos.
 * Chaque démo reçoit { bad, good, done } : les deux colonnes et la fonction
 * à appeler quand le piège de la version ratée a été subi.
 * Tout reste confiné à la colonne : pas de vraie notification, pas de vibration,
 * pas de manipulation de l'historique, pas de son.
 */

const q = (root, r) => root.querySelector(`[data-r="${r}"]`);
const qa = (root, r) => [...root.querySelectorAll(`[data-r="${r}"]`)];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const say = (el, text) => { if (el) { el.hidden = false; el.textContent = text; } };
const heure = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

/* « done » ne doit être déclenché qu'une fois. */
const once = (fn) => { let called = false; return () => { if (!called) { called = true; fn(); } }; };

/* Erreurs « bavardes » de la version corrigée de 10.3. */
function fieldMessage(field, message) {
  const err = document.getElementById(field.getAttribute('aria-describedby'));
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (err) err.textContent = message;
}

export const demos = {
  /* ============ SALLES ============ */

  boutons({ bad, good, done }) {
    let nBad = 0;
    q(bad, 'btn').addEventListener('click', () => {
      nBad += 1;
      q(bad, 'count').textContent = nBad;
      if (nBad >= 2) done();
    });
    const btn = q(good, 'btn');
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      btn.textContent = 'Envoi…';
      await wait(700);
      q(good, 'count').textContent = '1';
      btn.removeAttribute('aria-busy');
      btn.textContent = '✓ Envoyé !';
    });
  },

  textes({ bad, done }) {
    const d = once(done);
    qa(bad, 'f1').concat(qa(bad, 'f2'), qa(bad, 'f3')).forEach((input) => {
      input.addEventListener('input', () => { if (input.value.length >= 3) d(); });
    });
  },

  formulaires({ bad, good, done }) {
    q(bad, 'form').addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = bad.querySelector('.error-message');
      msg.textContent = '';
      requestAnimationFrame(() => { msg.textContent = '⚠ Erreur dans le formulaire'; });
      done();
    });

    const form = good.querySelector('#form-bien');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const prenom = form.querySelector('#prenom');
      const email = form.querySelector('#email');
      const errors = [];
      if (!prenom.value.trim()) {
        fieldMessage(prenom, 'Indiquez votre prénom.');
        errors.push(prenom);
      } else fieldMessage(prenom, '');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        fieldMessage(email, 'Email invalide : il manque le domaine (ex. marie@exemple.fr)');
        errors.push(email);
      } else fieldMessage(email, '');
      const ok = q(form, 'ok');
      if (errors.length) {
        ok.textContent = '';
        errors[0].focus();
      } else {
        ok.textContent = '✓ Inscription envoyée.';
      }
    });
  },

  navigation({ bad, good, done }) {
    const d = once(done);
    const tBad = q(bad, 'toggle');
    const mBad = q(bad, 'menu');
    let timer;
    tBad.addEventListener('click', () => {
      mBad.hidden = false;
      clearTimeout(timer);
      timer = setTimeout(() => {
        mBad.hidden = true;
        say(q(bad, 'log'), 'Le menu s’est refermé tout seul.');
        d();
      }, 1000);
    });
    qa(bad, 'item').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      say(q(bad, 'log'), `Vous êtes sur : ${a.textContent} (bravo, vous avez visé à temps).`);
    }));

    const tGood = q(good, 'toggle');
    const mGood = q(good, 'menu');
    const setOpen = (open) => {
      tGood.setAttribute('aria-expanded', String(open));
      mGood.hidden = !open;
    };
    tGood.addEventListener('click', () => setOpen(tGood.getAttribute('aria-expanded') !== 'true'));
    good.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mGood.hidden) { setOpen(false); tGood.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (!good.querySelector('.demo-menu').contains(e.target)) setOpen(false);
    });
    qa(good, 'item').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      setOpen(false);
      say(q(good, 'log'), `Vous êtes sur : ${a.textContent}`);
    }));
  },

  retours({ good, done }) {
    setTimeout(done, 3000);
    const progress = good.querySelector('progress');
    const text = q(good, 'text');
    const cancel = q(good, 'cancel');
    cancel.addEventListener('click', () => {
      if (cancel.dataset.state === 'cancelled') {
        cancel.dataset.state = '';
        progress.value = 75;
        text.textContent = '75 % · environ 10 s restantes';
        cancel.textContent = 'Annuler';
      } else {
        cancel.dataset.state = 'cancelled';
        text.textContent = 'Export annulé. Rien n’a été envoyé.';
        cancel.textContent = 'Relancer';
      }
    });
  },

  lisibilite({ bad, done }) {
    qa(bad, 'answer').forEach((b) => b.addEventListener('click', () => {
      say(q(bad, 'log'), b.textContent === '7,90 €'
        ? 'Bonne réponse… si vous avez réussi à la lire.'
        : 'Raté : c’était 7,90 €, écrit en gris clair.');
      done();
    }));
  },

  pieges({ bad, good, done }) {
    const d = once(done);
    q(bad, 'accept').addEventListener('click', () => {
      say(q(bad, 'log'), 'Accepté. Vous vouliez refuser ? Dommage.');
      d();
    });
    q(bad, 'settings').addEventListener('click', () => {
      q(bad, 'panel').hidden = false;
      say(q(bad, 'log'), '4 cases déjà cochées, et toujours pas de bouton « Tout refuser ».');
      d();
    });
    qa(good, 'choice').forEach((b) => b.addEventListener('click', () => {
      say(q(good, 'log'), `Choix enregistré : ${b.textContent.toLowerCase()}. Modifiable à tout moment en pied de page.`);
    }));
    q(good, 'more').addEventListener('click', () => {
      say(q(good, 'log'), 'Deux interrupteurs, tous désactivés par défaut.');
    });
  },

  /* ============ 30 CAS ============ */

  cookies({ bad, good, done }) {
    q(bad, 'ok').addEventListener('click', () => {
      q(bad, 'bar').hidden = true;
      q(bad, 'count').textContent = '7';
      say(q(bad, 'log'), 'Il n’y avait pas de refus possible. 4 traceurs de plus.');
      done();
    });
    const pick = (accept) => {
      q(good, 'bar').hidden = true;
      q(good, 'count').textContent = accept ? '3' : '0';
      say(q(good, 'log'), accept
        ? 'Accepté : 3 traceurs déposés, après votre accord.'
        : 'Refusé : aucun traceur. Choix modifiable en pied de page.');
    };
    q(good, 'refuse').addEventListener('click', () => pick(false));
    q(good, 'accept').addEventListener('click', () => pick(true));
  },

  progression({ bad, good, done }) {
    q(bad, 'listen').addEventListener('click', () => {
      say(q(bad, 'out'), 'Lecteur d’écran : « Inscription. » … puis rien. La barre est invisible pour lui.');
      done();
    });
    q(good, 'listen').addEventListener('click', () => {
      say(q(good, 'out'), 'Lecteur d’écran : « Inscription, barre de progression, Étape 2 sur 4 : adresse. »');
    });
  },

  erreurs({ bad, good, done }) {
    q(bad, 'form').addEventListener('submit', (e) => {
      e.preventDefault();
      q(bad, 'pass').value = '';
      say(q(bad, 'summary'), '3 erreurs dans le formulaire.');
      done();
    });

    const form = q(good, 'form');
    const rules = [
      ['email', (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Il manque le domaine après @ (ex. marie@exemple.fr).'), 'Email'],
      ['pass', (v) => (v.length >= 8 ? '' : `8 caractères minimum (actuellement ${v.length}).`), 'Mot de passe'],
      ['cp', (v) => (/^\d{5}$/.test(v) ? '' : `5 chiffres attendus (actuellement ${v.replace(/\D/g, '').length}).`), 'Code postal'],
    ];
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const summary = q(form, 'summary');
      const errors = [];
      rules.forEach(([r, check, label]) => {
        const field = q(form, r);
        const msg = check(field.value.trim());
        fieldMessage(field, msg);
        if (msg) errors.push({ field, label, msg });
      });
      summary.innerHTML = '';
      if (errors.length) {
        const title = document.createElement('p');
        title.textContent = `${errors.length} champ(s) à corriger :`;
        const list = document.createElement('ul');
        errors.forEach(({ field, label, msg }) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `#${field.id}`;
          a.textContent = `${label} : ${msg}`;
          a.addEventListener('click', (ev) => { ev.preventDefault(); field.focus(); });
          li.append(a);
          list.append(li);
        });
        summary.append(title, list);
        summary.hidden = false;
        summary.focus();
        q(form, 'ok').textContent = '';
      } else {
        summary.hidden = true;
        q(form, 'ok').textContent = '✓ Compte créé.';
      }
    });
  },

  'navigation-contextuelle'({ bad, good, done }) {
    const replies = {
      Enregistrer: 'Erreur : rien à enregistrer.',
      Annuler: 'Rien à annuler.',
      Rétablir: 'Rien à rétablir.',
      Exporter: 'Enregistrez d’abord le document.',
    };
    qa(bad, 'act').forEach((b) => b.addEventListener('click', () => {
      say(q(bad, 'log'), replies[b.textContent]);
      done();
    }));

    const text = q(good, 'text');
    const save = q(good, 'save');
    const undo = q(good, 'undo');
    const log = q(good, 'log');
    let saved = text.value;
    text.addEventListener('input', () => {
      const dirty = text.value !== saved;
      save.disabled = !dirty;
      save.textContent = dirty ? 'Enregistrer' : 'Enregistré ✓';
      undo.disabled = !dirty;
      undo.textContent = dirty ? 'Annuler la frappe' : 'Annuler';
      log.textContent = dirty ? 'Modifications non enregistrées.' : 'Aucune modification à enregistrer.';
    });
    save.addEventListener('click', () => {
      saved = text.value;
      save.disabled = true;
      save.textContent = 'Enregistré ✓';
      undo.disabled = true;
      undo.textContent = 'Annuler';
      log.textContent = `Enregistré à ${heure()}.`;
      text.focus();
    });
    undo.addEventListener('click', () => {
      text.value = saved;
      text.dispatchEvent(new Event('input'));
      text.focus();
    });
  },

  haptique({ bad, good, done }) {
    let n = 0;
    qa(bad, 'key').forEach((k) => k.addEventListener('click', () => {
      n += 1;
      q(bad, 'count').textContent = n;
      const pin = q(bad, 'pin');
      pin.classList.remove('buzz');
      void pin.offsetWidth;
      pin.classList.add('buzz');
      if (n >= 4) done();
    }));

    let code = '';
    let vibrations = 0;
    const dots = q(good, 'dots');
    const render = () => { dots.textContent = Array.from({ length: 4 }, (_, i) => (i < code.length ? '●' : '○')).join(' '); };
    qa(good, 'key').forEach((k) => k.addEventListener('click', () => {
      code += k.textContent;
      render();
      if (code.length === 4) {
        if (q(good, 'toggle').checked) {
          vibrations += 1;
          q(good, 'count').textContent = vibrations;
        }
        dots.textContent = '✓ Code saisi';
        code = '';
        setTimeout(render, 1500);
      }
    }));
  },

  distillation({ bad, good, done }) {
    q(bad, 'select').addEventListener('change', (e) => {
      if (!e.target.value) return;
      say(q(bad, 'log'), `Ville choisie : ${e.target.value}. Combien de temps pour la trouver ?`);
      done();
    });

    const villes = [...bad.querySelectorAll('option')].map((o) => o.textContent).filter((v) => !v.startsWith('—')).sort((a, b) => a.localeCompare(b, 'fr'));
    const search = q(good, 'search');
    const list = q(good, 'list');
    const count = q(good, 'count');
    search.addEventListener('input', () => {
      const v = search.value.trim().toLowerCase();
      list.innerHTML = '';
      if (!v) { count.textContent = 'Tapez les premières lettres'; return; }
      const found = villes.filter((c) => c.toLowerCase().startsWith(v));
      count.textContent = `${found.length} résultat(s)`;
      found.slice(0, 8).forEach((c) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'filter-item';
        b.textContent = c;
        b.addEventListener('click', () => {
          search.value = c;
          list.innerHTML = '';
          count.textContent = '';
          say(q(good, 'log'), `Ville choisie : ${c}.`);
        });
        li.append(b);
        list.append(li);
      });
    });
  },

  'validation-anticipe'({ bad, good, done }) {
    const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    const email = q(bad, 'email');
    email.addEventListener('input', () => {
      const ok = valid(email.value);
      q(bad, 'err').textContent = ok ? '' : '✗ Adresse email invalide';
      q(bad, 'submit').disabled = !ok;
      if (email.value.length >= 2) done();
    });

    const input = q(good, 'email');
    const msg = q(good, 'msg');
    const check = () => {
      if (!input.value) {
        input.removeAttribute('aria-invalid');
        msg.className = 'hint';
        msg.textContent = 'Format : nom@exemple.fr';
        return false;
      }
      const ok = valid(input.value);
      input.setAttribute('aria-invalid', String(!ok));
      msg.className = ok ? 'hint ok' : 'field-error';
      msg.textContent = ok ? '✓ Adresse valide' : 'Il manque une partie : le format attendu est nom@exemple.fr';
      return ok;
    };
    input.addEventListener('blur', check);
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true' || valid(input.value)) check();
    });
    q(good, 'form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (check()) q(good, 'ok').textContent = '✓ Inscription envoyée.';
      else input.focus();
    });
  },

  suppression({ bad, good, done }) {
    const badList = q(bad, 'list');
    const initial = badList.innerHTML;
    const wire = () => {
      qa(bad, 'del').forEach((b) => b.addEventListener('click', () => {
        const name = b.closest('li').querySelector('span').textContent;
        b.closest('li').remove();
        say(q(bad, 'log'), `« ${name} » a disparu. Définitivement.`);
        done();
      }));
      qa(bad, 'edit').forEach((b) => b.addEventListener('click', () => {
        say(q(bad, 'log'), 'Mode renommage (simulé). Vous avez bien visé.');
      }));
    };
    wire();
    q(bad, 'reset').addEventListener('click', () => {
      badList.innerHTML = initial;
      q(bad, 'log').textContent = '';
      wire();
    });

    const toast = q(good, 'toast');
    let last = null;
    let timer;
    qa(good, 'del').forEach((b) => b.addEventListener('click', () => {
      const li = b.closest('li');
      last = { li, next: li.nextElementSibling, parent: li.parentElement };
      li.remove();
      q(good, 'toast-text').textContent = `« ${li.querySelector('span').textContent} » supprimé.`;
      toast.hidden = false;
      q(good, 'undo').focus();
      clearTimeout(timer);
      timer = setTimeout(() => { toast.hidden = true; last = null; }, 8000);
    }));
    q(good, 'undo').addEventListener('click', () => {
      if (!last) return;
      last.parent.insertBefore(last.li, last.next);
      last.li.querySelector('button').focus();
      toast.hidden = true;
      last = null;
    });
  },

  chargement({ bad, good, done }) {
    const rows = '<li>Commande #1042 · 12 nov. · 61,70 €</li><li>Commande #1037 · 28 oct. · 19,90 €</li><li>Commande #1021 · 3 oct. · 104,00 €</li>';
    q(bad, 'go').addEventListener('click', async (e) => {
      e.currentTarget.disabled = true;
      const zone = q(bad, 'zone');
      zone.textContent = 'Chargement...';
      await wait(3000);
      zone.innerHTML = `<ul class="order-list">${rows}</ul>`;
      done();
    });
    q(good, 'go').addEventListener('click', async (e) => {
      e.currentTarget.disabled = true;
      const zone = q(good, 'zone');
      const status = q(good, 'status');
      zone.setAttribute('aria-busy', 'true');
      zone.innerHTML = '<ul class="order-list skeleton" aria-hidden="true"><li></li><li></li><li></li></ul>';
      status.textContent = 'Connexion au serveur (1/3) · environ 3 s';
      await wait(1000);
      status.textContent = 'Récupération de 3 commandes (2/3) · environ 2 s';
      await wait(1000);
      status.textContent = 'Mise en forme (3/3) · presque fini';
      await wait(1000);
      zone.innerHTML = `<ul class="order-list">${rows}</ul>`;
      zone.setAttribute('aria-busy', 'false');
      status.textContent = '3 commandes affichées.';
    });
  },

  priorite({ bad, good, done }) {
    let misses = 0;
    const d = once(done);
    qa(bad, 'b').forEach((b) => b.addEventListener('click', () => {
      misses += 1;
      say(q(bad, 'log'), `« ${b.textContent} » : ce n’était pas Envoyer. Clics perdus : ${misses}.`);
      if (misses >= 3) d();
    }));
    q(bad, 'send').addEventListener('click', () => {
      say(q(bad, 'log'), `Envoyé, après ${misses} clic(s) perdu(s) à chercher.`);
      d();
    });

    const more = q(good, 'more');
    more.addEventListener('click', () => {
      const open = more.getAttribute('aria-expanded') !== 'true';
      more.setAttribute('aria-expanded', String(open));
      q(good, 'panel').hidden = !open;
    });
    q(good, 'send').addEventListener('click', () => say(q(good, 'log'), '✓ Message envoyé du premier coup.'));
  },

  'resume-commande'({ bad, good, done }) {
    q(bad, 'pay').addEventListener('click', (e) => {
      e.currentTarget.disabled = true;
      say(q(bad, 'log'), 'Débité : 61,70 € (49,90 € + livraison 6,90 € + frais de service 4,90 €). Surprise ! (simulation)');
      done();
    });
    q(good, 'pay').addEventListener('click', (e) => {
      e.currentTarget.disabled = true;
      say(q(good, 'log'), '✓ Commande confirmée : 61,70 €, comme annoncé. (simulation)');
    });
  },

  rappel({ bad, good, done }) {
    q(bad, 'day').addEventListener('click', () => {
      q(bad, 'count').textContent = '24';
      q(bad, 'pile').innerHTML = Array.from({ length: 6 }, () => '<li>🔔 N’oubliez pas votre séance !</li>').join('') + '<li>… et 18 autres</li>';
      done();
    });

    const freq = q(good, 'freq');
    const time = q(good, 'time');
    const next = q(good, 'next');
    let total = 0;
    const labels = { 0: 'Aucun rappel prévu.', 1: 'demain', 0.43: 'mercredi', 0.14: 'lundi prochain' };
    const render = () => {
      next.textContent = freq.value === '0' ? labels[0] : `Prochain rappel : ${labels[freq.value]} à ${time.value}.`;
    };
    freq.addEventListener('change', render);
    time.addEventListener('change', render);
    render();
    q(good, 'day').addEventListener('click', () => {
      total += freq.value === '1' ? 1 : 0;
      q(good, 'count').textContent = total;
    });
  },

  sauvegarde({ bad, good, done }) {
    const text = q(bad, 'text');
    const veil = q(bad, 'veil');
    let timer;
    text.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        veil.hidden = false;
        text.disabled = true;
        await wait(1500);
        text.disabled = false;
        veil.hidden = true;
        done();
      }, 800);
    });

    const goodText = q(good, 'text');
    const status = q(good, 'status');
    let goodTimer;
    goodText.addEventListener('input', () => {
      status.textContent = 'Modifications non enregistrées…';
      clearTimeout(goodTimer);
      goodTimer = setTimeout(async () => {
        status.textContent = 'Enregistrement…';
        await wait(600);
        status.textContent = `✓ Enregistré à ${heure()}`;
      }, 800);
    });
  },

  favoris({ bad, good, done }) {
    const steps = [
      ['Étape 1 sur 3 · Choisissez une liste', '<label>Liste <select><option>Mes favoris</option><option>Week-end</option></select></label>'],
      ['Étape 2 sur 3 · Nommez ce favori', '<label>Nom <input type="text" value="Randonnée"></label>'],
      ['Étape 3 sur 3 · Confirmez', '<p>Ajouter « Randonnée » à « Mes favoris » ?</p>'],
    ];
    let i = 0;
    const wizard = q(bad, 'wizard');
    const show = () => {
      q(bad, 'step').textContent = steps[i][0];
      q(bad, 'body').innerHTML = steps[i][1];
      q(bad, 'next').textContent = i === 2 ? 'Confirmer' : 'Suivant';
    };
    q(bad, 'open').addEventListener('click', () => { i = 0; show(); wizard.hidden = false; });
    q(bad, 'next').addEventListener('click', () => {
      if (i < 2) { i += 1; show(); done(); return; }
      wizard.hidden = true;
      say(q(bad, 'log'), 'Ajouté aux favoris… en 4 clics.');
    });

    const fav = q(good, 'fav');
    fav.addEventListener('click', () => {
      const on = fav.getAttribute('aria-pressed') !== 'true';
      fav.setAttribute('aria-pressed', String(on));
      fav.textContent = on ? '♥ Dans vos favoris' : '♡ Ajouter aux favoris';
      say(q(good, 'log'), on ? 'Ajouté en un clic.' : 'Retiré des favoris.');
    });
  },

  'recherche-autocomplet'({ bad, good, done }) {
    const products = ['Casque audio sans fil', 'Casque de vélo', 'Casquette en lin', 'Câble USB-C', 'Caméra de sport', 'Carnet A5', 'Clavier mécanique', 'Enceinte portable'];
    const sponsored = ['⭐ Sponsorisé · Aspirateur robot', '⭐ Sponsorisé · Crédit conso 0 %'];
    const input = q(bad, 'q');
    input.addEventListener('input', () => {
      const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 4);
      q(bad, 'list').innerHTML = sponsored.concat(shuffled).map((p) => `<div class="suggest-item">${p}</div>`).join('');
      if (input.value.length >= 2) done();
    });

    const box = q(good, 'q');
    const list = q(good, 'list');
    let items = [];
    let active = -1;
    const close = () => {
      list.hidden = true;
      box.setAttribute('aria-expanded', 'false');
      box.removeAttribute('aria-activedescendant');
      active = -1;
    };
    const choose = (value) => {
      box.value = value;
      close();
      say(q(good, 'log'), `Recherche : ${value}`);
    };
    const highlight = () => {
      [...list.children].forEach((li, i) => li.setAttribute('aria-selected', String(i === active)));
      if (active >= 0) box.setAttribute('aria-activedescendant', list.children[active].id);
    };
    box.addEventListener('input', () => {
      const v = box.value.trim().toLowerCase();
      items = v ? products.filter((p) => p.toLowerCase().includes(v)).slice(0, 6) : [];
      list.innerHTML = '';
      items.forEach((p, i) => {
        const li = document.createElement('li');
        li.id = `ac-b-opt-${i}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        const start = p.toLowerCase().indexOf(v);
        li.append(p.slice(0, start));
        const mark = document.createElement('mark');
        mark.textContent = p.slice(start, start + v.length);
        li.append(mark, p.slice(start + v.length));
        li.addEventListener('mousedown', (e) => { e.preventDefault(); choose(p); });
        list.append(li);
      });
      active = -1;
      list.hidden = items.length === 0;
      box.setAttribute('aria-expanded', String(items.length > 0));
    });
    box.addEventListener('keydown', (e) => {
      if (list.hidden) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % items.length; highlight(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + items.length) % items.length; highlight(); }
      if (e.key === 'Enter' && active >= 0) { e.preventDefault(); choose(items[active]); }
      if (e.key === 'Escape') close();
    });
    box.addEventListener('blur', close);
  },

  nouveaute({ bad, good, done }) {
    const popup = q(bad, 'popup');
    let closes = 0;
    q(bad, 'close').addEventListener('click', async () => {
      popup.hidden = true;
      closes += 1;
      if (closes >= 2) {
        say(q(bad, 'log'), 'Fermée deux fois. Elle reviendra à la prochaine visite.');
        done();
        return;
      }
      await wait(1000);
      popup.hidden = false;
      say(q(bad, 'log'), 'La visite guidée s’est rouverte toute seule.');
      q(bad, 'close').focus();
    });

    q(good, 'item').addEventListener('click', () => {
      const dot = q(good, 'dot');
      if (dot) dot.remove();
      say(q(good, 'log'), 'Rapports visité : le badge a disparu.');
    });
    q(good, 'news').addEventListener('click', () => {
      say(q(good, 'log'), 'Quoi de neuf : export PDF des rapports. Consultable quand vous voulez.');
    });
  },

  reexperience({ bad, good, done }) {
    const form = q(bad, 'form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      await wait(500);
      form.querySelectorAll('input').forEach((i) => { i.value = ''; });
      q(bad, 'err').hidden = false;
      btn.disabled = false;
      done();
    });

    const goodForm = q(good, 'form');
    const msg = q(good, 'msg');
    const submit = q(good, 'submit');
    let attempts = 0;
    goodForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      submit.disabled = true;
      submit.textContent = 'Envoi…';
      await wait(500);
      attempts += 1;
      submit.disabled = false;
      if (attempts === 1) {
        msg.className = 'notice warn';
        say(msg, 'Connexion interrompue. Vos informations sont conservées, rien n’a été réservé.');
        submit.textContent = 'Réessayer';
      } else {
        msg.className = 'notice ok';
        say(msg, '✓ Réservation confirmée pour 4 personnes le 12/12/2026.');
        submit.textContent = 'Réservé ✓';
        submit.disabled = true;
      }
    });
  },

  'cache-saisi'({ bad, good, done }) {
    q(bad, 'refresh').addEventListener('click', () => {
      q(bad, 'text').value = '';
      say(q(bad, 'log'), 'Page rechargée : votre texte a disparu.');
      done();
    });

    const KEY = 'anti-ux-demo-brouillon';
    const text = q(good, 'text');
    const restored = q(good, 'restored');
    const store = {
      get: () => { try { return sessionStorage.getItem(KEY); } catch { return null; } },
      set: (v) => { try { sessionStorage.setItem(KEY, v); } catch { /* rien */ } },
      clear: () => { try { sessionStorage.removeItem(KEY); } catch { /* rien */ } },
    };
    text.addEventListener('input', () => store.set(text.value));
    q(good, 'refresh').addEventListener('click', async () => {
      store.set(text.value);
      text.value = '';
      restored.hidden = true;
      await wait(400);
      const draft = store.get();
      if (draft) {
        text.value = draft;
        restored.hidden = false;
      }
    });
    q(good, 'clear').addEventListener('click', () => {
      store.clear();
      text.value = '';
      restored.hidden = true;
      text.focus();
    });
  },

  'lecture-seule'({ bad, good, done }) {
    q(bad, 'close').addEventListener('click', () => {
      q(bad, 'pop').hidden = true;
      done();
    });

    const article = q(good, 'article');
    const reader = q(good, 'reader');
    let size = 1;
    reader.addEventListener('click', () => {
      const on = reader.getAttribute('aria-pressed') !== 'true';
      reader.setAttribute('aria-pressed', String(on));
      article.classList.toggle('reader', on);
      q(good, 'extra').hidden = on;
    });
    const resize = (delta) => {
      size = Math.min(1.5, Math.max(0.875, size + delta));
      article.style.fontSize = `${size}rem`;
    };
    q(good, 'minus').addEventListener('click', () => resize(-0.125));
    q(good, 'plus').addEventListener('click', () => resize(0.125));
  },

  'historique-nav'({ bad, good, done }) {
    const steps = [['Coordonnées', 'Nom', 'Camille'], ['Livraison', 'Adresse', ''], ['Paiement', 'Titulaire de la carte', '']];

    let iBad = 0;
    const renderBad = () => {
      q(bad, 'step').textContent = `Étape ${iBad + 1} sur 3 · ${steps[iBad][0]}`;
      q(bad, 'label').textContent = steps[iBad][1];
      q(bad, 'field').value = '';
    };
    q(bad, 'next').addEventListener('click', () => { if (iBad < 2) { iBad += 1; renderBad(); } });
    q(bad, 'back').addEventListener('click', () => {
      iBad = 0;
      renderBad();
      say(q(bad, 'log'), 'Retour à l’étape 1… et le nom saisi a disparu.');
      done();
    });

    let iGood = 0;
    const values = steps.map((s) => s[2]);
    const field = q(good, 'field');
    const renderGood = () => {
      q(good, 'label').textContent = steps[iGood][1];
      field.value = values[iGood];
      qa(good, 'goto').forEach((b, i) => {
        if (i === iGood) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        b.disabled = i > iGood;
      });
      q(good, 'prev').disabled = iGood === 0;
    };
    field.addEventListener('input', () => { values[iGood] = field.value; });
    q(good, 'next').addEventListener('click', () => { if (iGood < 2) { iGood += 1; renderGood(); } });
    q(good, 'prev').addEventListener('click', () => { if (iGood > 0) { iGood -= 1; renderGood(); } });
    qa(good, 'goto').forEach((b) => b.addEventListener('click', () => { iGood = Number(b.dataset.step); renderGood(); }));
    renderGood();
  },

  'aide-inline'({ bad, good, done }) {
    q(bad, 'help').addEventListener('click', () => {
      q(bad, 'zone').hidden = true;
      q(bad, 'page').hidden = false;
      q(bad, 'return').focus();
      done();
    });
    q(bad, 'return').addEventListener('click', () => {
      q(bad, 'page').hidden = true;
      q(bad, 'zone').hidden = false;
      q(bad, 'field').value = '';
      q(bad, 'field').focus();
    });

    const tip = q(good, 'tip');
    tip.addEventListener('click', () => {
      const open = tip.getAttribute('aria-expanded') !== 'true';
      tip.setAttribute('aria-expanded', String(open));
      q(good, 'tipbox').hidden = !open;
    });
  },

  securite({ bad, good, done }) {
    q(bad, 'pay').addEventListener('click', () => {
      say(q(bad, 'log'), 'Vous venez d’envoyer une carte sur une page non chiffrée, sans savoir à qui. (simulation)');
      done();
    });
    q(good, 'pay').addEventListener('click', () => {
      say(q(good, 'log'), '✓ Paiement transmis de façon chiffrée. (simulation)');
    });
  },

  zoom({ bad, good, done }) {
    let zBad = 1;
    let clicks = 0;
    q(bad, 'plus').addEventListener('click', () => {
      zBad *= 1.8;
      clicks += 1;
      q(bad, 'map').style.transform = `scale(${zBad})`;
      if (clicks >= 3) done();
    });

    const MIN = 1;
    const MAX = 3;
    let z = 1;
    const map = q(good, 'map');
    const apply = () => {
      map.style.transform = `scale(${z})`;
      q(good, 'level').value = `${Math.round(z * 100)} %`;
      q(good, 'minus').disabled = z <= MIN;
      q(good, 'plus').disabled = z >= MAX;
    };
    q(good, 'minus').addEventListener('click', () => { z = Math.max(MIN, z - 0.25); apply(); });
    q(good, 'plus').addEventListener('click', () => { z = Math.min(MAX, z + 0.25); apply(); });
    q(good, 'reset').addEventListener('click', () => { z = 1; apply(); });
    apply();
  },

  notation({ bad, good, done }) {
    qa(bad, 'star').forEach((s, i) => s.addEventListener('click', () => {
      qa(bad, 'star').forEach((x, j) => x.classList.toggle('on', j <= i));
      q(bad, 'modal').hidden = false;
      done();
    }));
    q(good, 'stars').addEventListener('change', (e) => {
      good.querySelectorAll('.stars-radio label').forEach((l, j) => l.classList.toggle('on', j < Number(e.target.value)));
      say(q(good, 'log'), `Merci ! Note ${e.target.value}/5 enregistrée. Ajouter un commentaire ? (facultatif)`);
    });
  },

  'statut-multi'({ bad, good, done }) {
    const text = q(bad, 'text');
    const original = text.value;
    q(bad, 'save').addEventListener('click', () => {
      text.value = original.replace('12 000', '15 000').replace('communication', 'communication et l’événementiel');
      say(q(bad, 'log'), '⚠ Conflit : Camille a enregistré entre-temps. Vos modifications sont perdues.');
      done();
    });

    q(good, 'notify').addEventListener('click', async (e) => {
      e.currentTarget.disabled = true;
      say(q(good, 'log'), 'D’accord, nous vous prévenons dès que Camille a terminé.');
      await wait(2000);
      q(good, 'presence').textContent = 'Camille a quitté ce paragraphe.';
      q(good, 'lock').textContent = 'Paragraphe libre : vous pouvez le modifier.';
      q(good, 'text').readOnly = false;
      say(q(good, 'log'), '✓ C’est à vous.');
    });
  },

  session({ bad, good, done }) {
    q(bad, 'pause').addEventListener('click', (e) => {
      e.currentTarget.disabled = true;
      bad.querySelector('.wizard-step').textContent = 'Accueil';
      q(bad, 'cart').textContent = '🛒 Panier vide';
      say(q(bad, 'log'), 'Session expirée. Tout est à refaire.');
      done();
    });
    q(good, 'pause').addEventListener('click', (e) => {
      e.currentTarget.disabled = true;
      say(q(good, 'log'), 'Bon retour ! Session renouvelée. Vous reprenez à l’étape 3 · Livraison, panier intact.');
    });
  },

  'validation-personnalisee'({ bad, good, done }) {
    const boxes = qa(bad, 'box');
    const d = once(done);
    boxes.forEach((b, i) => {
      b.addEventListener('paste', (e) => {
        e.preventDefault();
        say(q(bad, 'log'), 'Collage bloqué. Tapez les chiffres un par un.');
        d();
      });
      b.addEventListener('input', () => {
        if (b.value && boxes[i + 1]) boxes[i + 1].focus();
        d();
      });
    });

    q(good, 'form').addEventListener('submit', (e) => {
      e.preventDefault();
      const code = q(good, 'code').value.replace(/\s/g, '');
      say(q(good, 'log'), code === '123456' ? '✓ Identité vérifiée.' : 'Code incorrect. Vérifiez les 6 chiffres ou demandez un nouveau code.');
    });
  },

  activite({ bad, good, done }) {
    let launched = 0;
    let running = false;
    q(bad, 'go').addEventListener('click', async () => {
      launched += 1;
      q(bad, 'count').textContent = launched;
      if (running) return;
      running = true;
      q(bad, 'log').textContent = '';
      await wait(4000);
      running = false;
      say(q(bad, 'log'), launched > 1 ? `Terminé… ${launched} synchronisations lancées, doublons créés.` : 'Terminé. (Aviez-vous l’impression que ça marchait ?)');
      done();
    });

    const btn = q(good, 'go');
    const box = q(good, 'box');
    const bar = q(good, 'bar');
    const text = q(good, 'text');
    let cancelled = false;
    q(good, 'cancel').addEventListener('click', () => { cancelled = true; });
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      cancelled = false;
      box.hidden = false;
      for (let i = 1; i <= 128; i += 8) {
        if (cancelled) break;
        bar.value = i;
        text.textContent = `${i} / 128 fichiers · photo-${String(i).padStart(3, '0')}.jpg`;
        await wait(250);
      }
      text.textContent = cancelled ? 'Synchronisation annulée. Les fichiers déjà envoyés sont conservés.' : '✓ 128 fichiers synchronisés.';
      if (!cancelled) bar.value = 128;
      btn.disabled = false;
    });
  },

  'priorite-notif'({ bad, good, done }) {
    let misses = 0;
    const d = once(done);
    qa(bad, 'n').forEach((n) => n.addEventListener('click', () => {
      misses += 1;
      say(q(bad, 'log'), `Pas celle-là (${misses}). Tout est rouge, tout semble urgent.`);
      if (misses >= 2) d();
    }));
    q(bad, 'urgent').addEventListener('click', () => {
      say(q(bad, 'log'), `Trouvée après ${misses} essai(s).`);
      d();
    });

    const mute = q(good, 'mute');
    mute.addEventListener('click', () => {
      const on = mute.getAttribute('aria-pressed') !== 'true';
      mute.setAttribute('aria-pressed', String(on));
      mute.textContent = on ? '🔔 Réactiver les promos' : '🔕 Couper les promos';
      q(good, 'promos').hidden = on;
    });
  },

  export({ bad, good, done }) {
    q(bad, 'go').addEventListener('click', () => {
      q(bad, 'msg').hidden = false;
      done();
    });

    const form = q(good, 'form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cats = [...form.querySelectorAll('input[name="cat"]:checked')].map((c) => c.value);
      const fmt = form.querySelector('input[name="fmt"]:checked').value;
      if (!cats.length) { say(q(good, 'log'), 'Choisissez au moins une catégorie.'); return; }
      const data = {
        profil: { prenom: 'Camille', email: 'camille@exemple.fr' },
        commandes: [{ id: 1042, date: '2026-11-12', total: 61.7 }],
        messages: [{ date: '2026-10-02', texte: 'Bonjour, ma commande est-elle partie ?' }],
      };
      const subset = Object.fromEntries(cats.map((c) => [c, data[c]]));
      const rows = [['categorie', 'champ', 'valeur']];
      cats.forEach((c) => {
        const value = subset[c];
        const entries = Array.isArray(value) ? value : [value];
        entries.forEach((obj, i) => Object.entries(obj).forEach(([k, v]) => {
          rows.push([c, Array.isArray(value) ? `${i + 1}.${k}` : k, v]);
        }));
      });
      const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
      const content = fmt === 'json' ? JSON.stringify(subset, null, 2) : csv;
      const blob = new Blob([content], { type: fmt === 'json' ? 'application/json' : 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `mes-donnees.${fmt}`;
      a.click();
      URL.revokeObjectURL(a.href);
      say(q(good, 'log'), `✓ Archive mes-donnees.${fmt} générée (${blob.size} octets) : ${cats.join(', ')}.`);
    });
  },
};

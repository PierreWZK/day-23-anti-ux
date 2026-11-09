/* Coiffeur Antique · comportements des deux versions. Rien n'est envoyé : tout reste dans la page. */

const $ = (sel) => document.querySelector(sel);

/* Pastilles des erreurs / corrections (barre du musée) */
const toggle = $('#toggle-pins');
toggle?.addEventListener('click', () => {
  const on = toggle.getAttribute('aria-pressed') !== 'true';
  toggle.setAttribute('aria-pressed', String(on));
  document.body.classList.toggle('show-pins', on);
});

/* Liens du salon : pages fictives */
let toastTimer;
document.querySelectorAll('[data-404]').forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault();
  let toast = $('.toast-404');
  if (!toast) {
    toast = document.createElement('p');
    toast.className = 'toast-404';
    toast.setAttribute('role', 'status');
    document.body.append(toast);
  }
  toast.textContent = document.body.classList.contains('sans-ux')
    ? 'Erreur 404 : page introuvable.'
    : `« ${a.textContent} » : page fictive, le salon n’existe que dans ce musée.`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), 2500);
}));

/* Le téléphone accepte espaces, points et tirets ; on garde 10 chiffres commençant par 0 (ou +33). */
export function normaliserTel(v) {
  const d = v.replace(/[\s.\-()]/g, '').replace(/^\+33/, '0');
  return /^0\d{9}$/.test(d) ? d : null;
}

/* ---------- Version sans UX ---------- */
if (document.body.classList.contains('sans-ux')) {
  const form = $('#form-sans');
  const wall = $('#cookie-wall');

  $('#cookies-ok').addEventListener('click', () => {
    wall.hidden = true;
    form.classList.remove('form-bloque');
  });
  // Le « refus » referme la bannière… puis elle revient.
  $('#cookies-refus').addEventListener('click', () => {
    wall.style.visibility = 'hidden';
    setTimeout(() => { wall.style.visibility = ''; }, 1500);
  });

  // Pop-up de newsletter après 4 secondes, qui revient une fois fermée.
  const popup = $('#popup-news');
  let retours = 0;
  const ouvrir = () => { popup.hidden = false; };
  setTimeout(ouvrir, 4000);
  $('#popup-close').addEventListener('click', () => {
    popup.hidden = true;
    if (retours++ < 1) setTimeout(ouvrir, 6000);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const tel = $('#s-tel').value;
    const ok = $('#s-nom').value.trim() && /\S+@\S+\.\S+/.test($('#s-mail').value)
      && /^0\d{9}$/.test(tel) && $('#s-msg').value.trim().length >= 50 && $('#s-creneau').value;
    if (!ok) {
      form.reset();
      $('#s-news').checked = true;
      $('#erreur-vague').hidden = false;
      $('#erreur-vague').scrollIntoView({ block: 'center' });
      return;
    }
    $('#erreur-vague').hidden = true;
    form.innerHTML = '<p>Message reçu. (Vous êtes aussi inscrit à 312 newsletters.)</p>';
  });
}

/* ---------- Version avec UX ---------- */
if (document.body.classList.contains('avec-ux')) {
  const form = $('#form-avec');
  const champs = {
    'a-nom': (v) => (v.trim() ? '' : 'Indiquez votre nom et prénom.'),
    'a-mail': (v) => (!v.trim() ? 'Indiquez votre email.'
      : /^\S+@\S+\.\S{2,}$/.test(v.trim()) ? '' : 'Cet email semble incomplet, par exemple marie@exemple.fr.'),
    'a-tel': (v) => (!v.trim() || normaliserTel(v) ? '' : 'Ce numéro doit contenir 10 chiffres, par exemple 06 12 34 56 78.'),
    'a-creneau': (v) => (v ? '' : 'Choisissez un créneau.'),
  };

  const verifier = (id) => {
    const el = document.getElementById(id);
    const msg = champs[id](el.value);
    document.getElementById(`${id}-err`).textContent = msg;
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return msg;
  };

  // Validation à la sortie du champ, puis en direct une fois l'erreur affichée.
  Object.keys(champs).forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener('blur', () => { if (el.value) verifier(id); });
    el.addEventListener('input', () => { if (el.hasAttribute('aria-invalid')) verifier(id); });
    el.addEventListener('change', () => { if (el.tagName === 'SELECT') verifier(id); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const erreurs = Object.keys(champs).map((id) => [id, verifier(id)]).filter(([, m]) => m);
    const resume = $('#resume');
    const succes = $('#succes');
    if (erreurs.length) {
      succes.hidden = true;
      $('#resume-liste').innerHTML = '';
      erreurs.forEach(([id, m]) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = m;
        a.addEventListener('click', (ev) => { ev.preventDefault(); document.getElementById(id).focus(); });
        li.append(a);
        $('#resume-liste').append(li);
      });
      resume.querySelector('h2').textContent = erreurs.length > 1
        ? `Il reste ${erreurs.length} points à corriger :` : 'Il reste un point à corriger :';
      resume.hidden = false;
      resume.focus();
      return;
    }
    resume.hidden = true;
    const tel = normaliserTel($('#a-tel').value);
    $('#succes-texte').textContent = `Merci ${$('#a-nom').value.trim()}. Nous vous écrivons à ${$('#a-mail').value.trim()}${tel ? ` ou appelons au ${tel.replace(/(\d{2})(?=\d)/g, '$1 ')}` : ''} pour confirmer votre créneau (${$('#a-creneau').value.toLowerCase()}). Démonstration : rien n’a été envoyé.`;
    succes.hidden = false;
    succes.focus();
  });
}

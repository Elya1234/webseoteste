/* GOLD MINES — BY ORPAZ · prototype de page d'accueil (direction « Rue Bleue ») */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Matières ---------- */
  const METALS = {
    jaune:   { name: 'Or jaune 18 ct',  stops: ['#6e4f1c', '#c79b45', '#f7e3a8', '#b88a3a', '#fff4d2', '#8a6526'] },
    blanc:   { name: 'Or blanc 18 ct',  stops: ['#6f757e', '#bfc5cd', '#f7f9fb', '#a9b0ba', '#ffffff', '#858c96'] },
    rose:    { name: 'Or rose 18 ct',   stops: ['#7a4334', '#c98a72', '#f7d2c0', '#b9765f', '#ffe7dc', '#8f5544'] },
    platine: { name: 'Platine 950',     stops: ['#5f6672', '#a7afba', '#e8ecf1', '#959eaa', '#f6f8fa', '#737b87'] },
  };
  const STONES = {
    diamant:  { name: 'Diamant',  c: ['#ffffff', '#dfe9f7', '#a9bcd6', '#f4f8ff'], ppc: 7600 },
    saphir:   { name: 'Saphir',   c: ['#5d86ff', '#2346c9', '#0b1a66', '#8fb0ff'], ppc: 3200 },
    rubis:    { name: 'Rubis',    c: ['#ff5d7a', '#c4153a', '#5e0414', '#ff9aad'], ppc: 3900 },
    emeraude: { name: 'Émeraude', c: ['#54e0a6', '#11935f', '#043d27', '#a6f5d3'], ppc: 3500 },
  };

  /* ---------- Bague solitaire en SVG (croquis + rendu) ---------- */
  let uid = 0;
  const pts = a => a.map(p => p.join(',')).join(' ');
  const G = {
    TL: [168, 58], M: [200, 58], TR: [232, 58],
    GL: [140, 88], g1: [180, 88], g2: [200, 88], g3: [220, 88], GR: [260, 88], C: [200, 150],
  };
  const crown = [[G.GL, G.TL, G.g1], [G.TL, G.M, G.g1], [G.M, G.g3, G.g1], [G.M, G.TR, G.g3], [G.TR, G.GR, G.g3]];
  const pav = [[G.GL, G.g1, G.C], [G.g1, G.g2, G.C], [G.g2, G.g3, G.C], [G.g3, G.GR, G.C]];
  const prongs = ['M150 168 Q139 126 136 82', 'M250 168 Q261 126 264 82', 'M177 160 Q168 124 165 84', 'M223 160 Q232 124 235 84'];

  function band(r1, r2, cx = 200, cy = 268) {
    return `M${cx - r1} ${cy}a${r1} ${r1} 0 1 0 ${r1 * 2} 0a${r1} ${r1} 0 1 0 ${-r1 * 2} 0Z` +
           `M${cx - r2} ${cy}a${r2} ${r2} 0 1 1 ${r2 * 2} 0a${r2} ${r2} 0 1 1 ${-r2 * 2} 0Z`;
  }

  function ringSVG(el) {
    const id = 'r' + (++uid);
    const m = METALS[el.dataset.metal] || METALS.jaune;
    const s = STONES[el.dataset.stone] || STONES.diamant;
    const thick = parseFloat(el.dataset.band || 2.2);
    const r1 = 112, r2 = r1 - thick * 8;
    const sketch = el.dataset.sketch === 'true';
    const metalStops = m.stops.map((c, i) => `<stop offset="${(i / (m.stops.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join('');

    const sketchLayer = !sketch ? '' : `
      <g class="sk" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
        <path class="draw" pathLength="1" d="${band(r1, r2)}"/>
        <path class="draw" pathLength="1" d="M160 172 L178 140 L222 140 L240 172"/>
        ${[...crown, ...pav].map(p => `<polygon class="draw" pathLength="1" points="${pts(p)}"/>`).join('')}
        ${prongs.map(d => `<path class="draw" pathLength="1" d="${d}"/>`).join('')}
        <g class="dim" stroke-width=".8">
          <path class="draw" pathLength="1" d="M200 30 V408" stroke-dasharray="4 5"/>
          <path class="draw" pathLength="1" d="M${200 - r2} 268 H${200 + r2}"/>
          <path class="draw" pathLength="1" d="M${200 - r2} 262 v12 M${200 + r2} 262 v12"/>
          <path class="draw" pathLength="1" d="M128 58 H160 M128 150 H190 M134 58 V150"/>
          <circle class="draw" pathLength="1" cx="200" cy="268" r="${r1 + 14}" stroke-dasharray="2 6"/>
        </g>
      </g>`;

    return `
    <svg viewBox="0 0 400 420" class="ring" role="img" aria-label="Bague solitaire — ${m.name}, ${s.name}">
      <defs>
        <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(0 .5 .5)">${metalStops}</linearGradient>
        <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${s.c[0]}"/><stop offset=".45" stop-color="${s.c[1]}"/><stop offset="1" stop-color="${s.c[2]}"/>
        </linearGradient>
        <radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <filter id="${id}sh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
      </defs>
      ${sketchLayer}
      <g class="rd">
        <ellipse cx="200" cy="396" rx="118" ry="10" fill="#000" opacity=".18" filter="url(#${id}sh)"/>
        <path d="${band(r1, r2)}" fill="url(#${id}m)" fill-rule="evenodd"/>
        <path d="M${200 - r1 + 10} 250 A${r1 - 10} ${r1 - 10} 0 0 1 ${200 - 40} ${168}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M${200 + r2 + 3} 300 A${r2 + 3} ${r2 + 3} 0 0 1 ${200 + 30} ${268 + r2 - 4}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="3"/>
        <path d="M160 172 L178 140 L222 140 L240 172 Z" fill="url(#${id}m)"/>
        <path d="M168 168 L182 146 L218 146 L232 168" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1.5"/>
        <g class="gem">
          ${crown.map((p, i) => `<polygon points="${pts(p)}" fill="url(#${id}s)" opacity="${[0.95, 0.7, 1, 0.75, 0.9][i]}"/>`).join('')}
          ${pav.map((p, i) => `<polygon points="${pts(p)}" fill="url(#${id}s)" opacity="${[0.8, 1, 0.6, 0.85][i]}"/>`).join('')}
          <g fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".8">${[...crown, ...pav].map(p => `<polygon points="${pts(p)}"/>`).join('')}</g>
          <polygon points="${pts([G.TL, G.M, G.g1])}" fill="#fff" opacity=".55"/>
          <polygon points="${pts([G.g1, G.g2, G.C])}" fill="${s.c[3]}" opacity=".55"/>
        </g>
        <g fill="none" stroke="url(#${id}m)" stroke-width="6.5" stroke-linecap="round">${prongs.map(d => `<path d="${d}"/>`).join('')}</g>
        <g class="spark" fill="url(#${id}g)">
          <path d="M186 56 l3 -12 3 12 12 3 -12 3 -3 12 -3 -12 -12 -3z" />
          <path d="M240 96 l2 -8 2 8 8 2 -8 2 -2 8 -2 -8 -8 -2z" />
          <path d="M160 120 l1.6 -6 1.6 6 6 1.6 -6 1.6 -1.6 6 -1.6 -6 -6 -1.6z" />
        </g>
      </g>
    </svg>`;
  }

  const renderRing = el => { el.innerHTML = ringSVG(el); };
  document.querySelectorAll('[data-ring]').forEach(renderRing);

  /* ---------- Cartes collections ---------- */
  const ICONS = {
    ring: '<circle cx="50" cy="60" r="26"/><circle cx="50" cy="60" r="21"/><path class="g" d="M42 30 l8-12 8 12 -8 6z"/>',
    bangle: '<ellipse cx="50" cy="52" rx="34" ry="20"/><ellipse cx="50" cy="52" rx="28" ry="15"/><circle class="g" cx="50" cy="32" r="4.5"/><circle class="g" cx="36" cy="34.5" r="3"/><circle class="g" cx="64" cy="34.5" r="3"/>',
    necklace: '<path d="M20 20 C 22 62, 78 62, 80 20"/><path d="M26 20 C 29 54, 71 54, 74 20" stroke-dasharray="1.5 3.5"/><path class="g" d="M50 58 l7 9 -7 14 -7 -14z"/>',
    earrings: '<circle cx="34" cy="56" r="14"/><circle cx="66" cy="56" r="14"/><circle class="g" cx="34" cy="38" r="4"/><circle class="g" cx="66" cy="38" r="4"/>',
    pendant: '<path d="M26 16 L50 50 L74 16"/><path class="g" d="M50 54 C 60 66, 62 72, 62 76 a12 12 0 0 1 -24 0 c0-4 2-10 12-22z"/>',
    diamond: '<path class="g" d="M28 38 L38 24 H62 L72 38 L50 76 Z"/><path d="M28 38 H72 M38 24 L44 38 L50 24 L56 38 L62 24 M44 38 L50 76 L56 38"/>',
    gem: '<ellipse class="g" cx="50" cy="50" rx="20" ry="26"/><ellipse cx="50" cy="50" rx="12" ry="17"/><path d="M30 50 H38 M62 50 H70 M50 24 V33 M50 67 V76"/>',
    signet: '<circle cx="50" cy="62" r="24"/><circle cx="50" cy="62" r="19"/><rect class="g" x="35" y="26" width="30" height="18" rx="4"/><path d="M44 35 h12"/>',
    bespoke: '<path d="M22 78 C 40 70, 46 40, 72 24"/><path class="g" d="M64 18 l14 14 -6 6 -14 -14z"/><circle cx="30" cy="34" r="10" stroke-dasharray="2 3"/>',
  };
  const CATS = [
    ['Bagues', 'ring', 48], ['Bracelets', 'bangle', 26], ['Colliers', 'necklace', 31],
    ['Boucles d\'oreilles', 'earrings', 37], ['Pendentifs', 'pendant', 22], ['Diamants', 'diamond', 64],
    ['Pierres précieuses', 'gem', 40], ['Joaillerie masculine', 'signet', 18], ['Créations sur mesure', 'bespoke', '∞'],
  ];
  document.getElementById('cards').innerHTML = CATS.map(([t, ic, n], i) => `
    <a href="#" class="card reveal${i === 8 ? ' card--feature' : ''}" style="--d:${i * 60}ms">
      <span class="card__n">${String(i + 1).padStart(2, '0')}</span>
      <svg class="card__ico" viewBox="0 0 100 100" aria-hidden="true">${ICONS[ic]}</svg>
      <span class="card__meta"><span class="card__t">${t}</span><span class="card__c">${n} créations</span></span>
      <span class="card__go">→</span>
    </a>`).join('');

  /* ---------- Signature : options, prix, panier ---------- */
  const sig = document.getElementById('sigRing');
  const state = { metal: 'jaune', stone: 'diamant', carat: 1 };
  const fmt = n => new Intl.NumberFormat('fr-FR').format(Math.round(n / 10) * 10) + ' €';
  const price = () => 1300 + (state.metal === 'platine' ? 600 : 0) + STONES[state.stone].ppc * Math.pow(state.carat, 1.3);

  function update() {
    sig.dataset.metal = state.metal; sig.dataset.stone = state.stone;
    renderRing(sig);
    sig.querySelector('.gem').style.transform = `scale(${0.8 + state.carat * 0.2})`;
    document.getElementById('metalName').textContent = METALS[state.metal].name;
    document.getElementById('stoneName').textContent = STONES[state.stone].name;
    const p = document.getElementById('price');
    p.textContent = fmt(price());
    p.classList.remove('tick'); void p.offsetWidth; p.classList.add('tick');
  }
  document.querySelectorAll('.signature [data-group]').forEach(group => {
    group.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      group.querySelectorAll('button').forEach(x => x.classList.toggle('is-on', x === b));
      const k = group.dataset.group;
      state[k] = k === 'carat' ? parseFloat(b.dataset.v) : b.dataset.v;
      update();
    });
  });
  update();

  let cart = 0;
  document.getElementById('addCart').addEventListener('click', e => {
    cart++; document.querySelector('.cart__count').textContent = cart;
    document.querySelector('.cart').classList.add('bump');
    setTimeout(() => document.querySelector('.cart').classList.remove('bump'), 500);
    e.currentTarget.textContent = 'Ajouté ✓';
    setTimeout(() => (e.currentTarget.textContent = 'Ajouter au panier'), 1600);
  }, { passive: true });

  /* Lumière qui suit le doigt / la souris sur le métal */
  const stage = document.querySelector('.signature__stage');
  const tilt = (x, y) => {
    sig.style.setProperty('--rx', `${(0.5 - y) * 14}deg`);
    sig.style.setProperty('--ry', `${(x - 0.5) * 24}deg`);
    sig.querySelectorAll('linearGradient[id$="m"]').forEach(g =>
      g.setAttribute('gradientTransform', `rotate(${(x - 0.5) * 120} .5 .5)`));
  };
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    tilt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  });
  stage.addEventListener('pointerleave', () => tilt(0.5, 0.5));

  /* ---------- Studio : épaisseur & gravure ---------- */
  const studio = document.getElementById('studioRing');
  const bandIn = document.getElementById('band');
  bandIn.addEventListener('input', () => {
    studio.dataset.band = bandIn.value;
    document.getElementById('bandVal').textContent = bandIn.value.replace('.', ',') + ' mm';
    renderRing(studio);
    studio.classList.add('drawn');
  });
  const engr = document.getElementById('engr');
  engr.addEventListener('input', () => (document.getElementById('engrPreview').textContent = engr.value || '—'));
  document.querySelectorAll('.shapes').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    e.preventDefault();
    g.querySelectorAll('button').forEach(x => x.classList.toggle('is-on', x === b));
  }));

  /* ---------- Révélations au défilement ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal, .step, .blueprint, .thread').forEach(el => io.observe(el));

  /* Hero : titre puis croquis qui se dessine et se « remplit » d'or */
  requestAnimationFrame(() => document.body.classList.add('loaded'));

  /* En-tête compact au défilement */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Parallaxe légère du croquis */
  if (!reduce) {
    const sheet = document.querySelector('.sheet');
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, 900);
      sheet.style.transform = `translate3d(0, ${y * 0.12}px, 0) rotate(${-2 + y * 0.003}deg)`;
    }, { passive: true });
  }

  /* Menu mobile */
  document.querySelector('.nav__burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));
})();

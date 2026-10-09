/* GOLD MINES — BY ORPAZ · « Noir Royal » */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* Ouverture */
  const start = () => setTimeout(() => document.body.classList.add('loaded'), reduce ? 0 : 900);
  document.readyState === 'complete' ? start() : addEventListener('load', start);

  /* En-tête */
  const nav = document.getElementById('nav');
  const lightSections = [...document.querySelectorAll('.collections, .maison')];
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', scrollY > 30);
    const y = nav.offsetHeight / 2;
    nav.classList.toggle('on-light', lightSections.some(s => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom >= y; }));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Menu plein écran */
  document.querySelector('.nav__menu').addEventListener('click', () => document.body.classList.toggle('menu-open'));
  document.querySelectorAll('.drawer a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  /* Manifeste : les mots s'allument au défilement */
  const man = document.getElementById('manifesto');
  const gold = ['lumière', 'pierre', 'main,', 'Paris.'];
  man.innerHTML = man.textContent.trim().split(/\s+/).map(w => `<span class="w${gold.includes(w) ? ' gold' : ''}">${w}</span>`).join(' ');
  const words = [...man.querySelectorAll('.w')];
  const lightWords = () => {
    const r = man.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', reduce || i < n));
  };
  addEventListener('scroll', lightWords, { passive: true }); lightWords();

  /* Apparitions */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* Parallaxe douce */
  const quoteImg = document.querySelector('.quote__media img');
  const heroImg = document.querySelector('.hero__media img');
  if (!reduce) addEventListener('scroll', () => {
    const r = quoteImg.parentElement.parentElement.getBoundingClientRect();
    quoteImg.style.transform = `translate3d(0, ${(r.top + r.height / 2 - innerHeight / 2) * -0.12}px, 0)`;
    if (scrollY < innerHeight) heroImg.parentElement.style.transform = `translate3d(0, ${scrollY * 0.25}px, 0)`;
  }, { passive: true });

  /* Liste des catégories : aperçu photo qui suit le curseur */
  const prev = document.querySelector('.catlist__preview');
  const prevImg = prev.querySelector('img');
  if (finePointer) document.querySelectorAll('#catlist li').forEach(li => {
    li.addEventListener('mouseenter', () => { prevImg.src = li.dataset.img; prev.classList.add('show'); });
    li.addEventListener('mouseleave', () => prev.classList.remove('show'));
    li.addEventListener('mousemove', e => { prev.style.left = e.clientX + 'px'; prev.style.top = e.clientY + 'px'; });
  });

  /* Signature : zoom loupe */
  const media = document.getElementById('sigMedia');
  const img = document.getElementById('sigImg');
  media.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = media.getBoundingClientRect();
    img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    media.classList.add('zooming');
  });
  media.addEventListener('pointerleave', () => media.classList.remove('zooming'));
  media.addEventListener('click', () => media.classList.toggle('zooming'));

  /* Signature : options & prix */
  const METALS = { jaune: 'Or jaune 18 ct', blanc: 'Or blanc 18 ct', rose: 'Or rose 18 ct', platine: 'Platine 950' };
  const state = { metal: 'jaune', carat: 1 };
  const fmt = n => new Intl.NumberFormat('fr-FR').format(Math.round(n / 10) * 10) + ' €';
  const priceEl = document.getElementById('price');
  const update = () => {
    document.getElementById('metalName').textContent = METALS[state.metal];
    document.getElementById('caratName').textContent = state.carat.toFixed(2).replace('.', ',') + ' ct';
    priceEl.textContent = fmt(1300 + (state.metal === 'platine' ? 600 : 0) + 7600 * Math.pow(state.carat, 1.3));
    priceEl.classList.remove('tick'); void priceEl.offsetWidth; priceEl.classList.add('tick');
  };
  document.querySelectorAll('[data-group]').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    g.querySelectorAll('button').forEach(x => x.classList.toggle('is-on', x === b));
    state[g.dataset.group] = g.dataset.group === 'carat' ? parseFloat(b.dataset.v) : b.dataset.v;
    update();
  }));

  /* Panier */
  let count = 0;
  const cart = document.querySelector('.cart');
  document.getElementById('addCart').addEventListener('click', e => {
    const btn = e.currentTarget;
    cart.querySelector('.cart__count').textContent = ++count;
    cart.classList.remove('bump'); void cart.offsetWidth; cart.classList.add('bump');
    btn.textContent = 'Ajouté à votre panier';
    setTimeout(() => (btn.textContent = 'Ajouter au panier'), 1800);
  });
})();

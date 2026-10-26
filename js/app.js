// NETCLONE — lógica principal (vanilla JS, sin dependencias).
// Flujo igual que Netflix: elegir perfil → catálogo personalizado → detalles → reproducir.
// Lo que en Netflix vive en el servidor (Mi lista, progreso de visionado) aquí se guarda
// en localStorage, separado por perfil.

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

const state = {
  profile: null,
  filter: 'all',
  query: '',
};

// ---------- Persistencia por perfil ----------

function storageKey(name) {
  return `netclone:${state.profile.id}:${name}`;
}

function load(name, fallback) {
  try {
    const raw = localStorage.getItem(storageKey(name));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(name, value) {
  try {
    localStorage.setItem(storageKey(name), JSON.stringify(value));
  } catch {
    // Almacenamiento no disponible (modo privado): la app sigue funcionando sin persistir.
  }
}

const getMyList = () => load('mylist', []);
const getProgress = () => load('progress', {});

function toggleMyList(id) {
  const list = getMyList();
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1);
  else list.unshift(id);
  save('mylist', list);
  return i < 0;
}

function saveProgress(id, time, duration) {
  const progress = getProgress();
  // Como Netflix: si casi se ha terminado, se quita de "Seguir viendo".
  if (!duration || time / duration > 0.95) delete progress[id];
  else progress[id] = { time, duration, at: Date.now() };
  save('progress', progress);
}

// ---------- Catálogo visible según perfil ----------

function catalog() {
  return state.profile.kids ? TITLES.filter(t => t.kids) : TITLES;
}

const byId = id => TITLES.find(t => t.id === id);

function rowItems(row) {
  const items = catalog();
  if (row.dynamic === 'mylist') return getMyList().map(byId).filter(t => t && items.includes(t));
  if (row.dynamic === 'continue') {
    const progress = getProgress();
    return Object.entries(progress)
      .sort((a, b) => b[1].at - a[1].at)
      .map(([id]) => byId(Number(id)))
      .filter(t => t && items.includes(t));
  }
  let list = items.filter(row.filter);
  if (row.sort) list = [...list].sort(row.sort);
  return list;
}

// ---------- Perfiles ----------

function renderProfiles() {
  $('#profile-list').innerHTML = PROFILES.map(p => `
    <button class="profile" data-id="${p.id}">
      <span class="avatar" style="background:${p.color}">${p.name[0]}</span>
      <span class="profile-name">${p.name}</span>
    </button>`).join('');
  $$('.profile').forEach(btn => btn.addEventListener('click', () => selectProfile(btn.dataset.id)));
}

function selectProfile(id) {
  state.profile = PROFILES.find(p => p.id === id);
  const avatar = $('#avatar-btn');
  avatar.style.background = state.profile.color;
  avatar.textContent = state.profile.name[0];
  $('#profiles').classList.add('hidden');
  $('#browse').classList.remove('hidden');
  window.scrollTo(0, 0);
  setFilter('all');
}

function showProfiles() {
  $('#browse').classList.add('hidden');
  $('#profiles').classList.remove('hidden');
}

// ---------- Portada (billboard) ----------

function renderHero() {
  const pool = catalog().filter(t => state.filter === 'all' || state.filter === 'mylist' || t.type === state.filter);
  const t = pool[Math.floor(Math.random() * pool.length)];
  const hero = $('#hero');
  if (!t) { hero.innerHTML = ''; return; }
  hero.style.backgroundImage = `url(${t.backdrop}), ${t.fallback}`;
  hero.innerHTML = `
    <div class="hero-shade"></div>
    <div class="hero-info">
      <div class="hero-tag">${t.type === 'serie' ? 'S E R I E' : 'P E L Í C U L A'}</div>
      <h2 class="hero-title">${t.title}</h2>
      ${t.top10 ? `<div class="hero-top"><span class="top-badge">TOP<b>10</b></span> N.º ${t.top10} en España hoy</div>` : ''}
      <p class="hero-desc">${t.desc}</p>
      <div class="hero-buttons">
        <button class="btn btn-play" data-play="${t.id}">▶ Reproducir</button>
        <button class="btn btn-info" data-info="${t.id}">ⓘ Más información</button>
      </div>
    </div>
    <div class="hero-rating">${t.rating}</div>`;
}

// ---------- Filas ----------

function cardHtml(t, rank) {
  const p = getProgress()[t.id];
  const pct = p ? Math.round((p.time / p.duration) * 100) : 0;
  return `
    <div class="card ${rank ? 'card-rank' : ''}" data-id="${t.id}" tabindex="0">
      ${rank ? `<span class="rank">${rank}</span>` : ''}
      <div class="card-img" style="background-image:url(${t.thumb}), ${t.fallback}">
        <span class="card-title">${t.title}</span>
        ${pct ? `<div class="progress"><div style="width:${pct}%"></div></div>` : ''}
      </div>
      <div class="card-hover">
        <div class="card-actions">
          <button class="circle white" data-play="${t.id}" title="Reproducir">▶</button>
          <button class="circle" data-list="${t.id}" title="Mi lista">${getMyList().includes(t.id) ? '✓' : '+'}</button>
          <button class="circle right" data-info="${t.id}" title="Más información">⌄</button>
        </div>
        <div class="card-meta">
          <span class="match">${t.match}% para ti</span>
          <span class="age">${t.rating}</span>
          <span>${t.type === 'serie' ? `${t.seasons} temp.` : t.duration}</span>
        </div>
        <div class="card-genres">${t.genres.join(' • ')}</div>
      </div>
    </div>`;
}

function renderRows() {
  const main = $('#rows');
  let rows;
  if (state.filter === 'mylist') {
    rows = [ROWS.find(r => r.id === 'mylist')];
  } else {
    rows = ROWS;
  }
  const html = rows.map(row => {
    let items = rowItems(row);
    if (state.filter === 'serie' || state.filter === 'pelicula') items = items.filter(t => t.type === state.filter);
    if (!items.length) {
      return state.filter === 'mylist'
        ? `<section class="row"><h3>Mi lista</h3><p class="empty">Aún no has añadido nada. Pulsa <b>+</b> en cualquier título.</p></section>`
        : '';
    }
    return `
      <section class="row" data-row="${row.id}">
        <h3>${row.title}</h3>
        <div class="row-wrap">
          <button class="row-arrow left" aria-label="Anterior">‹</button>
          <div class="row-track">${items.map((t, i) => cardHtml(t, row.top10 ? i + 1 : 0)).join('')}</div>
          <button class="row-arrow right" aria-label="Siguiente">›</button>
        </div>
      </section>`;
  }).join('');
  main.innerHTML = html;

  $$('.row-wrap', main).forEach(wrap => {
    const track = $('.row-track', wrap);
    $('.left', wrap).addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * 0.9, behavior: 'smooth' }));
    $('.right', wrap).addEventListener('click', () => track.scrollBy({ left: track.clientWidth * 0.9, behavior: 'smooth' }));
  });
}

function setFilter(filter) {
  state.filter = filter;
  $$('.nav-links a').forEach(a => a.classList.toggle('active', a.dataset.filter === filter));
  $('#hero').classList.toggle('hidden', filter === 'mylist');
  clearSearch();
  renderHero();
  renderRows();
}

function refresh() {
  if (state.query) renderSearch();
  else renderRows();
}

// ---------- Búsqueda ----------

function normalize(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function renderSearch() {
  const q = normalize(state.query);
  const results = catalog().filter(t =>
    normalize(t.title).includes(q) ||
    t.genres.some(g => normalize(g).includes(q)) ||
    normalize(t.desc).includes(q));
  const box = $('#search-results');
  box.innerHTML = results.length
    ? `<h3>Resultados para “${state.query}”</h3><div class="grid">${results.map(t => cardHtml(t)).join('')}</div>`
    : `<p class="empty">Tu búsqueda de “${state.query}” no tuvo resultados.</p>`;
}

function onSearch(value) {
  state.query = value.trim();
  const searching = !!state.query;
  $('#search-results').classList.toggle('hidden', !searching);
  $('#rows').classList.toggle('hidden', searching);
  $('#hero').classList.toggle('hidden', searching || state.filter === 'mylist');
  if (searching) renderSearch();
}

function clearSearch() {
  $('#search-input').value = '';
  onSearch('');
}

// ---------- Ventana de detalles ----------

function similar(t) {
  return catalog()
    .filter(o => o.id !== t.id)
    .map(o => ({ o, score: o.genres.filter(g => t.genres.includes(g)).length + (o.type === t.type ? 0.5 : 0) }))
    .filter(x => x.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(x => x.o);
}

function episodes(t) {
  // Episodios de relleno para las series.
  const names = ['Piloto', 'El plan', 'Sin salida', 'La verdad', 'Punto de no retorno', 'Final'];
  return names.map((name, i) => ({
    n: i + 1,
    name,
    mins: 42 + ((t.id * 7 + i * 5) % 18),
  }));
}

function openModal(id) {
  const t = byId(id);
  const inList = getMyList().includes(t.id);
  const sims = similar(t);
  $('#modal-content').innerHTML = `
    <div class="modal-hero" style="background-image:url(${t.backdrop}), ${t.fallback}">
      <div class="modal-shade"></div>
      <div class="modal-hero-info">
        <h2>${t.title}</h2>
        <div class="hero-buttons">
          <button class="btn btn-play" data-play="${t.id}">▶ Reproducir</button>
          <button class="circle" data-list="${t.id}" title="Mi lista">${inList ? '✓' : '+'}</button>
        </div>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-cols">
        <div>
          <div class="card-meta">
            <span class="match">${t.match}% para ti</span>
            <span>${t.year}</span>
            <span class="age">${t.rating}</span>
            <span>${t.type === 'serie' ? `${t.seasons} temporadas` : t.duration}</span>
            <span class="hd">HD</span>
          </div>
          ${t.top10 ? `<div class="hero-top"><span class="top-badge">TOP<b>10</b></span> N.º ${t.top10} en España hoy</div>` : ''}
          <p>${t.desc}</p>
        </div>
        <div class="modal-side">
          <p><span class="muted">Géneros:</span> ${t.genres.join(', ')}</p>
          <p><span class="muted">Este título es:</span> ${t.match > 92 ? 'Emocionante, Aclamado' : 'Entretenido'}</p>
        </div>
      </div>
      ${t.type === 'serie' ? `
        <h3>Episodios <span class="muted small">Temporada 1</span></h3>
        <div class="episodes">
          ${episodes(t).map(e => `
            <div class="episode" data-play="${t.id}">
              <span class="ep-n">${e.n}</span>
              <div class="ep-img" style="background-image:url(https://picsum.photos/seed/netclone-${t.id}-ep${e.n}/240/135), ${t.fallback}"><span>▶</span></div>
              <div class="ep-info"><div class="ep-head"><b>${e.name}</b><span>${e.mins} min</span></div>
                <p class="muted">Capítulo ${e.n} de ${t.title}.</p></div>
            </div>`).join('')}
        </div>` : ''}
      ${sims.length ? `
        <h3>Más títulos similares a este</h3>
        <div class="similar">
          ${sims.map(s => `
            <div class="sim" data-info="${s.id}">
              <div class="sim-img" style="background-image:url(${s.thumb}), ${s.fallback}"><span class="card-title">${s.title}</span></div>
              <div class="sim-body">
                <div class="card-meta"><span class="match">${s.match}%</span><span class="age">${s.rating}</span><span>${s.year}</span></div>
                <p>${s.desc}</p>
              </div>
            </div>`).join('')}
        </div>` : ''}
    </div>`;
  $('#modal').classList.remove('hidden');
  $('#modal .modal-box').scrollTop = 0;
  document.body.classList.add('no-scroll');
}

function closeModal() {
  $('#modal').classList.add('hidden');
  document.body.classList.remove('no-scroll');
}

// ---------- Reproductor ----------

let playing = null;

function play(id) {
  const t = byId(id);
  playing = t;
  closeModal();
  const video = $('#video');
  video.src = t.video;
  const p = getProgress()[t.id];
  video.addEventListener('loadedmetadata', () => {
    if (p) video.currentTime = p.time; // Reanudar donde se quedó
  }, { once: true });
  $('#player-msg').classList.add('hidden');
  $('#player').classList.remove('hidden');
  document.body.classList.add('no-scroll');
  video.play().catch(() => {});
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

function stopPlayer() {
  const video = $('#video');
  if (playing && video.duration) saveProgress(playing.id, video.currentTime, video.duration);
  video.pause();
  video.removeAttribute('src');
  video.load();
  playing = null;
  $('#player').classList.add('hidden');
  document.body.classList.remove('no-scroll');
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  refresh();
}

// Guardar progreso periódicamente mientras se reproduce.
let lastSaved = 0;
$('#video').addEventListener('timeupdate', e => {
  const v = e.target;
  if (playing && v.duration && Math.abs(v.currentTime - lastSaved) > 5) {
    lastSaved = v.currentTime;
    saveProgress(playing.id, v.currentTime, v.duration);
  }
});
$('#video').addEventListener('ended', stopPlayer);
$('#video').addEventListener('error', () => {
  if (playing) $('#player-msg').classList.remove('hidden');
});

// ---------- Eventos globales ----------

// Delegación: cualquier elemento con data-play / data-info / data-list.
document.addEventListener('click', e => {
  const playBtn = e.target.closest('[data-play]');
  const infoBtn = e.target.closest('[data-info]');
  const listBtn = e.target.closest('[data-list]');
  if (listBtn) {
    const added = toggleMyList(Number(listBtn.dataset.list));
    $$(`[data-list="${listBtn.dataset.list}"]`).forEach(b => { b.textContent = added ? '✓' : '+'; });
    if (!$('#modal').classList.contains('hidden')) {
      // No re-renderizar las filas bajo el modal para no perder el scroll; se hará al cerrar.
      $('#modal').dataset.dirty = '1';
    } else {
      refresh();
    }
    return;
  }
  if (playBtn) return play(Number(playBtn.dataset.play));
  if (infoBtn) return openModal(Number(infoBtn.dataset.info));
  const card = e.target.closest('.card');
  if (card) openModal(Number(card.dataset.id));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (playing) stopPlayer();
    else if (!$('#modal').classList.contains('hidden')) closeModalAndRefresh();
  }
  if (e.key === 'Enter' && e.target.classList.contains('card')) openModal(Number(e.target.dataset.id));
});

function closeModalAndRefresh() {
  closeModal();
  if ($('#modal').dataset.dirty) {
    delete $('#modal').dataset.dirty;
    refresh();
  }
}

$('#modal-close').addEventListener('click', closeModalAndRefresh);
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModalAndRefresh(); });
$('#player-back').addEventListener('click', stopPlayer);

$$('.nav-links a').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  setFilter(a.dataset.filter);
  window.scrollTo(0, 0);
}));

$('#search-toggle').addEventListener('click', () => {
  const box = $('.search');
  box.classList.toggle('open');
  if (box.classList.contains('open')) $('#search-input').focus();
});
$('#search-input').addEventListener('input', e => onSearch(e.target.value));
$('#search-input').addEventListener('blur', e => {
  if (!e.target.value) $('.search').classList.remove('open');
});

$('#avatar-btn').addEventListener('click', showProfiles);

// La barra de navegación pasa de transparente a negra al hacer scroll.
window.addEventListener('scroll', () => {
  $('#nav').classList.toggle('solid', window.scrollY > 40);
});

renderProfiles();

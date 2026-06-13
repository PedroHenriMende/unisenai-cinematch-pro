/**
 * display.js — Funções de renderização do catálogo (catalogo.html).
 * Lê o localStorage via Storage (main.js) e injeta os cards no HTML.
 * Depende de: main.js (deve ser carregado antes).
 */

/* ── Criar elemento <article class="card"> para um filme ── */
function criarCard(filme) {
  const article = document.createElement('article');
  article.className = 'film-card';
  article.setAttribute('tabindex', '0');
  article.setAttribute('aria-label', `${filme.titulo}, ${filme.ano}`);

  const temTrailer = Boolean(filme.youtubeId);

  article.innerHTML = `
    ${filme.capa
      ? `<img
           class="card-poster"
           src="${filme.capa}"
           alt="Pôster do filme ${filme.titulo}"
           loading="lazy"
           onerror="this.style.display='none'"
         />`
      : `<div class="card-poster card-poster--empty" aria-hidden="true">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
             <rect x="2" y="2" width="20" height="20" rx="2"/>
             <circle cx="9" cy="9" r="2"/>
             <path d="m21 15-5-5L5 21"/>
           </svg>
         </div>`
    }

    <button
      class="delete-btn"
      data-id="${filme.id}"
      aria-label="Remover ${filme.titulo}"
      title="Remover filme"
    >
      ✕
    </button>

    ${temTrailer
      ? `<div class="card-overlay" aria-hidden="true">
           <button class="play-btn" aria-label="Assistir trailer de ${filme.titulo}">
             ▶
           </button>
         </div>`
      : ''
    }

    <div class="card-info">
      <p class="card-title">${filme.titulo}</p>

      <div class="card-meta">
        <span>${filme.ano || '—'}</span>
        ${filme.genero ? `<span class="card-genre">${filme.genero}</span>` : ''}
        <span class="card-duration">${filme.duracaoFormatada()}</span>
      </div>

      ${filme.notas ? `<p class="card-notes">${filme.notas}</p>` : ''}
    </div>
  `;

  return article;
}

/* ── Renderizar grid com lista de filmes ── */
function renderGrid(lista, container) {
  container.innerHTML = '';

  if (lista.length === 0) {
    container.innerHTML = `
      <div class="empty-state" role="status">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/>
        </svg>
        <h3>Nenhum filme encontrado</h3>
        <p>Tente outro termo de busca ou <a href="index.html" style="color:var(--red)">adicione um filme</a>.</p>
      </div>
    `;
    return;
  }

  lista.forEach(filme => {
    container.appendChild(criarCard(filme));
  });
}

/* ── Popular select de gêneros dinamicamente ── */
function popularFiltroGeneros(filmes, selectEl) {
  const generosUnicos = [...new Set(filmes.map(f => f.genero).filter(Boolean))].sort();

  generosUnicos.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    selectEl.appendChild(opt);
  });
}

/* ── Atualizar painel de estatísticas ── */
function renderStats(ids = {}) {
  const s = Storage.estatisticas();

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set(ids.total || 'stat-total', s.total);
  set(ids.horas || 'stat-horas', s.horas);
  set(ids.minutos || 'stat-minutos', s.minutos);
  set(ids.generos || 'stat-generos', s.generos);
}
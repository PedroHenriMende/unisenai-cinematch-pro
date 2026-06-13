/**
 * main.js — Classe Filme e camada de persistência (localStorage).
 * Compartilhado entre index.html e catalogo.html.
 */

/**
 * Classe Filme — representa uma obra no catálogo.
 * Armazena todos os dados necessários para exibição e persistência.
 */
class Filme {
  constructor({ id, titulo, ano, genero, duracao, capa, youtubeId, notas }) {
    this.id        = id        || crypto.randomUUID();
    this.titulo    = titulo    || '';
    this.ano       = ano       || '';
    this.genero    = genero    || '';
    this.duracao   = Number(duracao) || 0; // em minutos
    this.capa      = capa      || '';
    this.youtubeId = youtubeId || '';
    this.notas     = notas     || '';
    this.criadoEm  = new Date().toISOString();
  }

  /** Retorna a duração formatada (ex: 1h 42min) */
  duracaoFormatada() {
    if (!this.duracao) return '—';
    const h   = Math.floor(this.duracao / 60);
    const min = this.duracao % 60;
    return h > 0 ? `${h}h ${min}min` : `${min}min`;
  }

  /** URL do embed do YouTube para o trailer */
  trailerUrl() {
    return this.youtubeId
      ? `https://www.youtube.com/embed/${this.youtubeId}?autoplay=1`
      : null;
  }
}

/* ── Camada de Storage (localStorage) ── */
const Storage = {
  KEY: 'cinematch_filmes',

  /** @returns {Filme[]} Lista de todos os filmes salvos */
  listar() {
    try {
      const raw = localStorage.getItem(this.KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return arr.map(obj => new Filme(obj));
    } catch {
      return [];
    }
  },

  /** @param {Filme} filme — Salva um novo filme no localStorage */
  salvar(filme) {
    const lista = this.listar();
    lista.push(filme);
    localStorage.setItem(this.KEY, JSON.stringify(lista));
  },

  /** @param {string} id — Remove um filme pelo ID */
  remover(id) {
    const lista = this.listar().filter(f => f.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(lista));
  },

  /**
   * Estatísticas calculadas com filter/reduce.
   * @returns {{ total, minutos, horas, generos }}
   */
  estatisticas() {
    const lista   = this.listar();
    const total   = lista.length;
    const minutos = lista.reduce((acc, f) => acc + f.duracao, 0);
    const horas   = Math.round(minutos / 60);
    const generos = new Set(lista.map(f => f.genero).filter(Boolean)).size;
    return { total, minutos, horas, generos };
  },
};

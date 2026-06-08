'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchAnime, getGenres, Anime } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import GenreFilter from '@/components/GenreFilter';

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string; status?: string; type?: string; page?: string }>;
}) {
  const params = use(searchParams);
  const router = useRouter();
  const [query, setQuery] = useState(params.q || '');
  const [genre, setGenre] = useState(params.genre || '');
  const [status, setStatus] = useState(params.status || '');
  const [type, setType] = useState(params.type || '');
  const [page, setPage] = useState(Number(params.page) || 1);
  const [results, setResults] = useState<Anime[]>([]);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string, g: string, s: string, t: string, p: number) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchAnime(q || 'all', p, g || undefined, s || undefined, t || undefined);
      setResults(res.data);
      setTotal(res.pagination.items.total);
      setHasNext(res.pagination.has_next_page);
    } catch {
      setResults([]);
      setTotal(0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const q = params.q || '';
    const g = params.genre || '';
    const s = params.status || '';
    const t = params.type || '';
    const p = Number(params.page) || 1;
    setQuery(q);
    setGenre(g);
    setStatus(s);
    setType(t);
    setPage(p);
    if (q || g || s || t) doSearch(q, g, s, t, p);
  }, [params.q, params.genre, params.status, params.type, params.page, doSearch]);

  const updateParams = (updates: Record<string, string>) => {
    const sp = new URLSearchParams();
    const q = updates.q ?? query;
    const g = updates.genre ?? genre;
    const s = updates.status ?? status;
    const t = updates.type ?? type;
    if (q) sp.set('q', q);
    if (g) sp.set('genre', g);
    if (s) sp.set('status', s);
    if (t) sp.set('type', t);
    sp.set('page', updates.page || '1');
    router.push(`/search?${sp.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: query, page: '1' });
  };

  const handleGenre = (id: string) => {
    setGenre(id);
    updateParams({ genre: id, page: '1' });
  };

  const handleStatus = (s: string) => {
    setStatus(s);
    updateParams({ status: s, page: '1' });
  };

  const handleType = (t: string) => {
    setType(t);
    updateParams({ type: t, page: '1' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
      <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 mb-8">
        <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
        Browse Anime
      </h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative max-w-2xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_15px_var(--accent-glow)] transition-all"
          />
        </div>
      </form>

      <div className="flex flex-wrap gap-4 mb-6 items-start">
        <div className="flex-1 min-w-0">
          <label className="text-xs text-[var(--text-muted)] block mb-3 uppercase tracking-wider font-semibold">Genre</label>
          <GenreFilter selected={genre} onSelect={handleGenre} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mb-10">
        <div>
          <label className="text-xs text-[var(--text-muted)] block mb-3 uppercase tracking-wider font-semibold">Status</label>
          <div className="flex flex-wrap gap-2">
            {['', 'airing', 'complete', 'upcoming'].map(s => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${
                  status === s
                    ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg shadow-green-500/20'
                    : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-white'
                }`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)] block mb-3 uppercase tracking-wider font-semibold">Type</label>
          <div className="flex flex-wrap gap-2">
            {['', 'tv', 'movie', 'ova', 'special', 'ona'].map(t => (
              <button
                key={t}
                onClick={() => handleType(t)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all uppercase ${
                  type === t
                    ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg shadow-green-500/20'
                    : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-white'
                }`}
              >
                {t || 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-[var(--bg-card)] shimmer" />
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-20">
          <svg className="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg text-[var(--text-secondary)]">No results found</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Try adjusting your filters or search term</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-sm text-[var(--text-muted)] mb-4">{total.toLocaleString()} results</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map(anime => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => updateParams({ page: String(page - 1) })}
              disabled={page <= 1}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="text-sm text-[var(--text-muted)]">Page {page}</span>
            <button
              onClick={() => updateParams({ page: String(page + 1) })}
              disabled={!hasNext}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </>
      )}

      {!searched && (
        <div className="text-center py-20">
          <svg className="w-20 h-20 mx-auto text-[var(--text-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg text-[var(--text-secondary)]">Search for your favorite anime</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Use the search bar or filter by genre above</p>
        </div>
      )}
    </div>
  );
}

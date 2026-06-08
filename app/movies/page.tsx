'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getTopMovies, getTopTVShows, MediaItem } from '@/lib/media-api';
import MovieCard from '@/components/MovieCard';

type Tab = 'movies' | 'tv';
type SortKey = 'default' | 'rating' | 'title' | 'year';

const PAGE_SIZE = 25;

export default function MoviesPage() {
  const [tab, setTab] = useState<Tab>('movies');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [kidsMode, setKidsMode] = useState(false);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [sort, setSort] = useState<SortKey>('default');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setLoading(true);
    setVisibleCount(PAGE_SIZE);
    setSearch('');
    setGenreFilter('');
    setSort('default');
    Promise.resolve(tab === 'movies' ? getTopMovies() : getTopTVShows())
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [tab]);

  const allGenres = useMemo(() => {
    const gs = new Set<string>();
    items.forEach(i => i.genres?.forEach(g => gs.add(g)));
    return Array.from(gs).sort();
  }, [items]);

  const filtered = useMemo(() => {
    let result = kidsMode ? items.filter(i => !i.mature) : [...items];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(i => i.title.toLowerCase().includes(q));
    }

    if (genreFilter) {
      result = result.filter(i => i.genres?.includes(genreFilter) || i.category === genreFilter);
    }

    switch (sort) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'year':
        result.sort((a, b) => (b.year || '').localeCompare(a.year || ''));
        break;
    }

    return result;
  }, [items, kidsMode, search, genreFilter, sort]);

  const displayItems = filtered.slice(0, visibleCount);
  const totalFiltered = filtered.length;
  const hasMore = visibleCount < totalFiltered;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Movies & TV</h1>
            <p className="text-sm text-gray-500">Popular movies and TV shows free to stream</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          {([{ k: 'movies', l: 'Movies' }, { k: 'tv', l: 'TV Shows' }] as { k: Tab; l: string }[]).map(t => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.k
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-[var(--bg-card)] border border-[var(--border)] text-gray-400 hover:text-white hover:border-blue-500/30'
              }`}
            >
              {t.l}
            </button>
          ))}

          <div className="flex items-center gap-2">
            <label
              htmlFor="kids-toggle"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all select-none ${
                kidsMode
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-[var(--bg-card)] border border-[var(--border)] text-gray-400 hover:text-white'
              }`}
            >
              <div className="relative w-9 h-5 rounded-full transition-colors duration-200" style={{ backgroundColor: kidsMode ? '#22c55e' : '#374151' }}>
                <div
                  className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: kidsMode ? 'translateX(16px)' : 'translateX(0)' }}
                />
              </div>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Kids
            </label>
            <input
              id="kids-toggle"
              type="checkbox"
              checked={kidsMode}
              onChange={e => setKidsMode(e.target.checked)}
              className="sr-only"
            />
          </div>
        </div>

        {!loading && items.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
                placeholder={`Search ${tab === 'movies' ? 'movies' : 'TV shows'}...`}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-gray-600 focus:outline-none focus:border-[var(--accent)] transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <select
              value={genreFilter}
              onChange={e => { setGenreFilter(e.target.value); setVisibleCount(PAGE_SIZE); }}
              className="px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm text-gray-400 focus:outline-none focus:border-[var(--accent)] transition-all appearance-none cursor-pointer"
            >
              <option value="">All Genres</option>
              {allGenres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={e => { setSort(e.target.value as SortKey); setVisibleCount(PAGE_SIZE); }}
              className="px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm text-gray-400 focus:outline-none focus:border-[var(--accent)] transition-all appearance-none cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Title A-Z</option>
              <option value="year">Newest</option>
            </select>

            {totalFiltered > 0 && (
              <span className="text-xs text-gray-600 whitespace-nowrap">
                {totalFiltered} {tab === 'movies' ? 'movies' : 'shows'}
                {kidsMode && <span className="text-gray-700"> · Kids Mode</span>}
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl bg-[var(--bg-card)] shimmer" />
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-gray-500">
              {search || genreFilter
                ? 'No results match your filters'
                : kidsMode
                  ? `No kid-friendly ${tab === 'movies' ? 'movies' : 'TV shows'} found`
                  : `No ${tab === 'movies' ? 'movies' : 'TV shows'} found`}
            </p>
            {(search || genreFilter) && (
              <button
                onClick={() => { setSearch(''); setGenreFilter(''); }}
                className="mt-4 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm text-gray-400 hover:text-white transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayItems.map((item, i) => (
                <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${(i % PAGE_SIZE) * 30}ms` }}>
                  <MovieCard item={item} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className="px-8 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm font-medium text-gray-400 hover:text-white hover:border-[var(--accent)]/30 transition-all hover:shadow-lg hover:shadow-green-500/5"
                >
                  Load More ({totalFiltered - visibleCount} remaining)
                </button>
              </div>
            )}

            <p className="text-center text-xs text-gray-700 mt-10">
              Data from SampleAPIs and TVmaze &middot; Stream via free embed sources
            </p>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTopMovies, getTopTVShows, MediaItem } from '@/lib/media-api';
import MovieCard from '@/components/MovieCard';

type Tab = 'movies' | 'tv';

export default function MoviesPage() {
  const [tab, setTab] = useState<Tab>('movies');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [kidsMode, setKidsMode] = useState(false);

  const displayItems = kidsMode ? items.filter(i => !i.mature) : items;
  const filteredCount = items.length - displayItems.length;

  useEffect(() => {
    setLoading(true);
    Promise.resolve(tab === 'movies' ? getTopMovies() : getTopTVShows())
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Movies & TV</h1>
            <p className="text-sm text-gray-500">Popular movies and TV shows free to stream</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          {([{ k: 'movies', l: 'Movies' }, { k: 'tv', l: 'TV Shows' }] as { k: Tab; l: string }[]).map(t => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.k
                  ? 'bg-blue-500 text-white'
                  : 'bg-[var(--bg-card)] border border-[var(--border)] text-gray-400 hover:text-white hover:border-blue-500/30'
              }`}
            >
              {t.l}
            </button>
          ))}

          <div className="flex items-center gap-2 ml-auto">
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
              Kids Mode
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

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl bg-[var(--bg-card)] shimmer" />
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No {kidsMode ? 'kid-friendly ' : ''}{tab === 'movies' ? 'movies' : 'TV shows'} found</p>
          </div>
        ) : (
          <>
            {filteredCount > 0 && (
              <p className="text-xs text-gray-600 mb-3">
                Showing {displayItems.length} {tab === 'movies' ? 'movies' : 'TV shows'}
                {kidsMode && filteredCount > 0 && (
                  <span> (filtered {filteredCount} mature titles)</span>
                )}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayItems.map(item => (
                <MovieCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}

        <p className="text-center text-xs text-gray-600 mt-8">
          Data from SampleAPIs and TVmaze &middot; Stream via free embed sources
        </p>
      </div>
    </div>
  );
}

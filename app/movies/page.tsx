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

  useEffect(() => {
    setLoading(true);
    (tab === 'movies' ? getTopMovies() : getTopTVShows())
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
            <p className="text-sm text-gray-500">Popular movies and TV shows from the iTunes Store</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {([{ k: 'movies', l: 'Top Movies' }, { k: 'tv', l: 'Top TV Shows' }] as { k: Tab; l: string }[]).map(t => (
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
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl bg-[var(--bg-card)] shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map(item => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-600 mt-8">
          Powered by the{' '}
          <a href="https://rss.applemarketingtools.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-light)]">Apple RSS Feed</a>
          {' '}· Data from the iTunes Store
        </p>
      </div>
    </div>
  );
}

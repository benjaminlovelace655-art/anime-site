'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { MediaItem } from '@/lib/media-api';

export default function MovieCard({ item }: { item: MediaItem }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const details = useMemo(() => new URLSearchParams({
    title: item.title,
    poster: item.image,
    year: item.year || item.releaseDate,
    type: item.type,
    artist: item.artist,
    rating: String(item.rating),
    genres: item.genres.join(','),
    description: item.description,
  }).toString(), [item]);

  const hasRating = item.rating > 0;
  const hasYear = !!item.year;
  const topGenre = item.genres?.[0] || item.category;

  return (
    <div
      onClick={() => router.push(`/watch-movie/${item.imdbId}?${details}`)}
      className="group relative block rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all duration-300 card-hover cursor-pointer"
    >
      <div className="aspect-[2/3] overflow-hidden bg-[var(--bg-secondary)] relative">
        {!imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 shimmer" />
            )}
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)] p-4">
            <svg className="w-10 h-10 text-gray-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span className="text-[10px] text-gray-700 text-center leading-tight">{item.title}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-600 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <div className="absolute top-2 left-2 z-10 flex gap-1.5">
          <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-medium uppercase backdrop-blur-sm">
            {item.type === 'tv' ? 'TV' : 'Film'}
          </span>
          {item.mature && (
            <span className="px-2 py-0.5 rounded bg-red-600/80 text-[10px] text-white font-bold backdrop-blur-sm">
              18+
            </span>
          )}
        </div>

        {hasRating && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-[10px] text-yellow-400 font-semibold">{item.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-semibold truncate group-hover:text-[var(--accent-light)] transition-colors leading-tight">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
          {hasYear && <span>{item.year}</span>}
          {topGenre && (
            <>
              {hasYear && <span className="w-1 h-1 rounded-full bg-gray-600" />}
              <span className="truncate">{topGenre}</span>
            </>
          )}
        </div>

        {item.artist && item.artist !== 'TV' && (
          <p className="text-[11px] text-gray-600 truncate">{item.artist}</p>
        )}

        {item.description && (
          <p className="text-[10px] text-gray-700 leading-tight line-clamp-2">{item.description}</p>
        )}
      </div>
    </div>
  );
}

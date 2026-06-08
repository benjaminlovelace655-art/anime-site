'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Anime } from '@/lib/api';
import { useWatchlist, WatchStatus } from '@/lib/useWatchlist';
import TiltCard from './TiltCard';

export default function AnimeCard({ anime }: { anime: Anime }) {
  const [flipped, setFlipped] = useState(false);
  const { status, update } = useWatchlist(anime.mal_id);

  const handleStatus = (s: WatchStatus) => {
    update(s === status ? null : s);
    setFlipped(false);
  };

  const statuses: WatchStatus[] = ['Watching', 'Planning', 'Completed', 'Paused', 'Dropped'];

  return (
    <div className="group perspective-[1000px]">
      <div className={`relative transition-transform duration-500 preserve-3d ${flipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
        <div className="backface-hidden">
          <TiltCard>
          <Link href={`/anime/${anime.mal_id}`} className="block card-hover">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--bg-card)]">
              <img
                src={anime.images.webp?.large_image_url || anime.images.jpg.large_image_url || ''}
                alt={anime.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {anime.airing && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/20 backdrop-blur text-[10px] font-semibold text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    AIRING
                  </span>
                )}
                {anime.status === 'Not yet aired' && (
                  <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 backdrop-blur text-[10px] font-semibold text-yellow-400">
                    UPCOMING
                  </span>
                )}
                {status && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 backdrop-blur text-[10px] font-semibold text-emerald-300">
                    {status}
                  </span>
                )}
              </div>

              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {anime.score && (
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-xs font-bold text-yellow-400 flex items-center gap-1">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    {anime.score.toFixed(1)}
                  </span>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-2 flex gap-1">
                {anime.type && (
                  <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-600/80 to-green-500/80 backdrop-blur text-[10px] font-bold text-white uppercase tracking-wide">
                    {anime.type}
                  </span>
                )}
                {anime.episodes && (
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur text-[10px] font-medium text-white">
                    {anime.episodes} ep
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/70 backdrop-blur text-[10px] font-bold text-white uppercase">
                  SUB
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/70 backdrop-blur text-[10px] font-bold text-white uppercase">
                  DUB
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/80 backdrop-blur flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
            </div>
          </Link>
          <div className="mt-2.5 px-0.5">
            <h3 className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent-light)] transition-colors">
              {anime.title_english || anime.title}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {anime.genres?.slice(0, 2).map(g => g.name).join(', ')}
              {anime.genres?.length > 2 && ' +more'}
            </p>
          </div>
          </TiltCard>
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--bg-card)] p-4 flex flex-col">
            <button
              onClick={() => setFlipped(false)}
              aria-label="Close watchlist"
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white text-xs hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
            <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-2">Watchlist</h4>
            <div className="flex flex-col gap-2 flex-1">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatus(s)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    status === s
                      ? 'bg-emerald-500/15 text-green-400 border border-green-500/30'
                      : 'bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:bg-emerald-500/10 hover:text-green-400 hover:border hover:border-green-500/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Anime, getTopAnime } from '@/lib/api';

export default function HeroSection() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopAnime(1, 'airing').then(res => {
      setAnimeList(res.data.slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % animeList.length);
  }, [animeList.length]);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + animeList.length) % animeList.length);
  }, [animeList.length]);

  useEffect(() => {
    if (animeList.length < 2) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [animeList.length, next]);

  if (loading || !animeList.length) {
    return (
      <div className="relative h-[85dvh] min-h-[650px] bg-[var(--bg-secondary)] shimmer" />
    );
  }

  const anime = animeList[current];

  return (
    <section className="relative h-[85dvh] min-h-[650px] overflow-hidden">
      {animeList.map((a, i) => (
        <div
          key={a.mal_id}
          className={`absolute inset-0 transition-all duration-1000 ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-[1]" />
          {Math.abs(i - current) <= 1 || Math.abs(i - current) >= animeList.length - 1 ? (
            <img
              src={a.images.webp?.large_image_url || a.images.jpg.large_image_url || ''}
              alt={a.title}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
      ))}

      <div className="relative z-[3] flex items-center h-full">
        <div className="max-w-7xl mx-auto px-4 w-full pt-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              {[1, 2, 3].map(i => {
                const dotAnime = animeList[(current + i) % animeList.length];
                return (
                  <button
                    key={i}
                    onClick={() => setCurrent((current + i) % animeList.length)}
                    className={`group relative w-24 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                      i === 0 ? 'border-[var(--accent)]' : 'border-transparent hover:border-white/30'
                    }`}
                  >
                    <img
                      src={dotAnime.images.webp?.image_url || dotAnime.images.jpg.image_url}
                      alt={dotAnime.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white drop-shadow-lg">
                      {i === 1 ? 'Next' : i === 2 ? 'Later' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 mb-4 animate-fade-in">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-green-500 text-xs font-bold text-white tracking-wide">
                FEATURED
              </span>
              {anime.type && (
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-[var(--text-secondary)] uppercase tracking-wide">
                  {anime.type}
                </span>
              )}
              {anime.score && (
                <span className="flex items-center gap-1 text-sm text-yellow-400 font-semibold">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  {anime.score.toFixed(1)}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-3 animate-slide-up drop-shadow-lg" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              {anime.title_english || anime.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-4 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              {anime.episodes && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                  {anime.episodes} Episodes
                </span>
              )}
              {anime.status && (
                <span className="flex items-center gap-1 capitalize">
                  <span className={`w-2 h-2 rounded-full ${anime.airing ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                  {anime.status.replace(/_/g, ' ')}
                </span>
              )}
              {anime.genres?.slice(0, 3).map(g => (
                <span key={g.mal_id} className="text-[var(--text-muted)] hidden sm:inline">{g.name}</span>
              ))}
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-8 max-w-xl animate-slide-up drop-shadow-lg" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              {anime.synopsis}
            </p>

            <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <Link
                href={`/watch/${anime.mal_id}?ep=1`}
                className="group relative flex -skew-x-12 items-center justify-center overflow-hidden bg-emerald-500 px-5 py-2 transition-all duration-300 hover:scale-105 hover:bg-emerald-500/90 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-green-500/50 sm:px-8 sm:py-3"
              >
                <div className="absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center bg-black/20" />
                <div className="absolute -right-1.5 -bottom-1.5 flex size-5 items-center justify-center bg-white/20" />
                <div className="pointer-events-none absolute inset-0 flex h-full w-full [transform:translateX(-150%)] justify-center group-hover:[transform:translateX(150%)] group-hover:duration-1000">
                  <div className="relative h-full w-12 bg-white/40 blur-[2px]" />
                </div>
                <div className="relative z-10 flex skew-x-12 items-center gap-2 text-xs font-black tracking-[0.2em] text-black uppercase sm:text-sm">
                  <svg className="size-4 fill-current sm:size-5" viewBox="0 0 24 24"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg>
                  <span>Watch Now</span>
                </div>
              </Link>
              <Link
                href={`/anime/${anime.mal_id}`}
                className="group relative flex -skew-x-12 items-center justify-center overflow-hidden border border-white/20 bg-black/60 px-5 py-2 transition-all duration-300 hover:scale-105 hover:border-green-500/80 hover:bg-black/80 sm:px-8 sm:py-3"
              >
                <div className="absolute top-0 right-0 h-full w-1 bg-white/10 transition-colors group-hover:bg-green-500/50" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex skew-x-12 items-center gap-2 text-xs font-black tracking-[0.2em] text-white uppercase sm:text-sm">
                  <svg className="size-4 sm:size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Details</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex items-center gap-2">
        {animeList.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-green-500' : 'w-1.5 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-[3] w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/50 transition-all opacity-0 hover:opacity-100"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-[3] w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/50 transition-all opacity-0 hover:opacity-100"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </section>
  );
}

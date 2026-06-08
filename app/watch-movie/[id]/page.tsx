'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import CommentSection from '@/components/CommentSection';

const EMBED_SOURCES = [
  { name: '2Embed', url: (id: string) => `https://www.2embed.stream/embed/movie/${id}` },
  { name: 'VidSrc', url: (id: string) => `https://vidsrc.xyz/embed/movie/${id}` },
  { name: 'MultiEmbed', url: (id: string) => `https://multiembed.mov/directstream.php?video_id=${id}` },
];

export default function WatchMoviePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string; poster?: string; year?: string; type?: string; artist?: string }>;
}) {
  const { id } = use(params);
  const sp = use(searchParams);

  const imdbId = id.startsWith('tt') ? id : '';
  const title = sp.title || '';
  const poster = sp.poster || '';
  const year = sp.year || '';
  const mediaType = sp.type || 'movie';
  const artist = sp.artist || '';

  const [embedSrc, setEmbedSrc] = useState(0);
  const [embedError, setEmbedError] = useState(false);

  if (!imdbId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center pt-24">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Invalid media ID</h1>
        <p className="text-sm text-gray-500 mb-6">No valid IMDb ID provided</p>
        <Link href="/movies" className="inline-flex px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all">
          Back to Movies
        </Link>
      </div>
    );
  }

  const currentEmbed = EMBED_SOURCES[embedSrc];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pt-20">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/movies" className="hover:text-white transition-colors">Movies & TV</Link>
        <span>/</span>
        <span className="text-white truncate">{title || imdbId}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-[var(--border)]">
            <iframe
              src={currentEmbed.url(imdbId)}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title={title}
              onError={() => setEmbedError(true)}
            />
            {embedError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6">
                <p className="text-sm text-gray-400 mb-3">Failed to load from {currentEmbed.name}</p>
                {embedSrc < EMBED_SOURCES.length - 1 ? (
                  <button
                    onClick={() => { setEmbedSrc(s => s + 1); setEmbedError(false); }}
                    className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-all"
                  >
                    Try Next Source
                  </button>
                ) : (
                  <p className="text-xs text-gray-600">No alternative sources available</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3">
            {EMBED_SOURCES.map((s, i) => (
              <button
                key={s.name}
                onClick={() => { setEmbedSrc(i); setEmbedError(false); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  embedSrc === i
                    ? 'bg-blue-500 text-white'
                    : 'bg-[var(--bg-card)] border border-[var(--border)] text-gray-400 hover:text-white'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-4">
            {poster && (
              <img
                src={poster}
                alt={title}
                className="w-24 shrink-0 rounded-lg object-cover hidden sm:block"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div className="min-w-0">
              <h1 className="text-xl font-bold mb-1">{title || 'Untitled'}</h1>
              {(year || artist) && (
                <p className="text-sm text-gray-400 mb-2">
                  {year} {artist && <>&middot; {artist}</>} &middot; {mediaType === 'tv' ? 'TV Series' : 'Movie'}
                </p>
              )}
              <a
                href={`https://www.imdb.com/title/${imdbId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs text-gray-400 hover:text-yellow-400 hover:border-yellow-500/30 transition-all mt-2"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.564 9.336v-2.16c0-1.812-1.476-3.288-3.288-3.288H8.724c-1.812 0-3.288 1.476-3.288 3.288v8.448c0 1.812 1.476 3.288 3.288 3.288h5.552c1.812 0 3.288-1.476 3.288-3.288v-2.16l-4.764 2.76v-5.688l4.764 2.76zM21 12c0 4.968-4.032 9-9 9s-9-4.032-9-9 4.032-9 9-9 9 4.032 9 9z"/></svg>
                View on IMDb
              </a>
            </div>
          </div>

          <CommentSection
            animeId={0}
            episode={0}
            storageKey={`anibyte_comments_movie_${imdbId}`}
          />
        </div>
      </div>
    </div>
  );
}

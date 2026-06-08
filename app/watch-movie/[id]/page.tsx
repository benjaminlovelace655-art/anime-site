'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchOMDb, type OMDbResult } from '@/lib/omdb-api';
import CommentSection from '@/components/CommentSection';

const EMBED_SOURCES = [
  { name: '2Embed', url: (id: string) => `https://www.2embed.stream/embed/movie/${id}` },
  { name: 'VidSrc', url: (id: string) => `https://vidsrc.xyz/embed/movie/${id}` },
  { name: 'MultiEmbed', url: (id: string) => `https://multiembed.mov/directstream.php?video_id=${id}` },
];

export default function WatchMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const title = decodeURIComponent(id);

  const [movie, setMovie] = useState<OMDbResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [embedSrc, setEmbedSrc] = useState(0);
  const [embedError, setEmbedError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    searchOMDb(title)
      .then(data => {
        if (data) {
          setMovie(data);
          setEmbedError(false);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [title]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <div className="aspect-video rounded-2xl bg-[var(--bg-card)] shimmer mb-6" />
        <div className="h-8 w-64 bg-[var(--bg-card)] shimmer rounded-lg mb-4" />
        <div className="h-4 w-96 bg-[var(--bg-card)] shimmer rounded-lg" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center pt-24">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Unable to load stream</h1>
        <p className="text-sm text-gray-500 mb-6">We couldn&apos;t find streaming sources for &ldquo;{title}&rdquo;</p>
        <Link href="/movies" className="inline-flex px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all">
          Back to Movies
        </Link>
      </div>
    );
  }

  const imdbId = movie.imdbID;
  const currentEmbed = EMBED_SOURCES[embedSrc];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pt-20">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/movies" className="hover:text-white transition-colors">Movies & TV</Link>
        <span>/</span>
        <span className="text-white truncate">{movie.Title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-[var(--border)]">
            <iframe
              src={currentEmbed.url(imdbId)}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title={movie.Title}
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
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : ''}
              alt={movie.Title}
              className="w-24 shrink-0 rounded-lg object-cover hidden sm:block"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="min-w-0">
              <h1 className="text-xl font-bold mb-1">{movie.Title}</h1>
              <p className="text-sm text-gray-400 mb-2">
                {movie.Year} &middot; {movie.Runtime} &middot; {movie.Rated}
              </p>
              {movie.Genre !== 'N/A' && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {movie.Genre.split(', ').map(g => (
                    <span key={g} className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-hover)] text-gray-400">
                      {g}
                    </span>
                  ))}
                </div>
              )}
              {movie.Plot !== 'N/A' && (
                <p className="text-sm text-gray-300 leading-relaxed mb-3">{movie.Plot}</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                {movie.Director !== 'N/A' && <span>Director: {movie.Director}</span>}
                {movie.Actors !== 'N/A' && <span>Cast: {movie.Actors}</span>}
                {movie.imdbRating !== 'N/A' && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {movie.imdbRating}/10
                  </span>
                )}
              </div>
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

'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { getAnimeById, getAnimeEpisodes, Anime, AnimeEpisode } from '@/lib/api';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeList from '@/components/EpisodeList';
import CommentSection from '@/components/CommentSection';

export default function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
}) {
  const { id } = use(params);
  const { ep } = use(searchParams);
  const numId = Number(id);
  const currentEp = Number(ep) || 1;

  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      getAnimeById(numId).catch(() => ({ data: null })),
      getAnimeEpisodes(numId).catch(() => ({ data: [] })),
    ]).then(([animeRes, epRes]) => {
      setAnime(animeRes.data);
      setEpisodes(epRes.data);
      setLoading(false);
    });
  }, [numId]);

  const currentEpisode = episodes.find(e => e.mal_id === currentEp);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <div className="aspect-video rounded-2xl bg-[var(--bg-card)] shimmer mb-6" />
        <div className="h-8 w-64 bg-[var(--bg-card)] shimmer rounded-lg mb-4" />
        <div className="h-4 w-96 bg-[var(--bg-card)] shimmer rounded-lg" />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center pt-24">
        <h1 className="text-2xl font-bold mb-2">Anime not found</h1>
        <Link href="/" className="text-[var(--accent-light)] hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pt-20">
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/anime/${anime.mal_id}`} className="hover:text-white transition-colors truncate">
          {anime.title_english || anime.title}
        </Link>
        <span>/</span>
        <span className="text-white">Episode {currentEp}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <VideoPlayer
            animeId={anime.mal_id}
            episode={currentEp}
            title={currentEpisode?.title || `Episode ${currentEp}`}
            animeTitle={anime.title_english || anime.title}
            image={anime.images.webp?.large_image_url || anime.images.jpg.large_image_url || ''}
            trailerId={anime.trailer?.youtube_id}
            totalEpisodes={episodes.length}
          />

          <div className="mt-6">
            <h2 className="text-lg font-bold mb-1">
              {anime.title_english || anime.title} <span className="text-[var(--text-muted)] font-normal">—</span> Episode {currentEp}
            </h2>
            {currentEpisode?.title && (
              <p className="text-sm text-[var(--text-secondary)] mb-4">{currentEpisode.title}</p>
            )}

            <div className="flex items-center gap-3">
              <Link
                href={`/anime/${anime.mal_id}`}
                className="text-sm text-[var(--accent-light)] hover:underline flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                View Details
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 mb-4 md:hidden">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Episodes</h3>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-sm text-[var(--accent-light)]"
            >
              {sidebarOpen ? 'Hide' : 'Show Episodes'}
            </button>
          </div>
        </div>

        <div className={`w-full md:w-80 shrink-0 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
          <div className="sticky top-20">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Episodes {episodes.length > 0 && `(${episodes.length})`}
            </h3>
            <div className="max-h-[calc(100vh-120px)] overflow-y-auto pr-2 space-y-1">
              <EpisodeList episodes={episodes} animeId={anime.mal_id} currentEp={currentEp} animeTitle={anime.title_english || anime.title} />
            </div>
          </div>
        </div>
      </div>

      <CommentSection animeId={anime.mal_id} episode={currentEp} />
    </div>
  );
}

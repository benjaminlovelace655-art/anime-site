'use client';

import { AnimeEpisode } from '@/lib/api';

export default function EpisodeList({
  episodes,
  animeId,
  currentEp,
  animeTitle,
}: {
  episodes: AnimeEpisode[];
  animeId: number;
  currentEp?: number;
  animeTitle?: string;
}) {
  if (!episodes.length) {
    return (
      <div className="text-center py-12 text-[var(--text-muted)]">
        <p className="text-lg">No episode data available</p>
        <p className="text-sm mt-1">Episode information will appear once available from the source</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {episodes.map((ep) => {
        const isActive = currentEp === ep.mal_id;
        return (
          <a
            key={ep.mal_id}
            href={`/watch/${animeId}?ep=${ep.mal_id}`}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
              isActive
                ? 'bg-[var(--accent)]/10 border border-[var(--accent)]/30'
                : 'hover:bg-[var(--bg-hover)] border border-transparent'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-card)] flex items-center justify-center text-sm font-bold text-[var(--text-muted)] shrink-0">
              {ep.mal_id}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isActive ? 'text-[var(--accent-light)]' : 'text-[var(--text-primary)]'}`}>
                Episode {ep.mal_id}{ep.title ? ` — ${ep.title}` : ''}
              </p>
              {ep.title_japanese && (
                <p className="text-xs text-[var(--text-muted)] truncate">{ep.title_japanese}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {ep.filler && <span className="px-1.5 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-400 font-medium">FILLER</span>}
              {ep.score && <span className="text-xs text-[var(--text-muted)]">★ {ep.score.toFixed(1)}</span>}
              {animeTitle && (
                <>
                  <a
                    href={`https://nyaa.si/?q=${encodeURIComponent(animeTitle)}+Episode+${ep.mal_id}&c=1_2`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--accent-light)] transition-all"
                    title="Download episode from Nyaa.si"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </a>
                  <a
                    href={`https://nyaa.si/?q=${encodeURIComponent(animeTitle)}+Episode+${ep.mal_id}+English+Subtitles&c=1_3`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--accent-light)] transition-all"
                    title="Download subtitles from Nyaa.si"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                  </a>
                </>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}

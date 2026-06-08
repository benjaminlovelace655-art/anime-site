'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MediaItem } from '@/lib/media-api';

export default function MovieCard({ item }: { item: MediaItem }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => router.push(`/watch-movie/${encodeURIComponent(item.title)}`)}
      className="group relative block rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all duration-300 card-hover cursor-pointer"
    >
      <div className="aspect-[2/3] overflow-hidden bg-[var(--bg-secondary)]">
        {!imgError ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white text-xs font-semibold shadow-lg shadow-green-500/25">
            Watch Free
          </span>
        </div>
      </div>
      <div className="absolute top-2 left-2 z-10">
        <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-medium uppercase">
          {item.type === 'tv' ? 'TV' : 'Movie'}
        </span>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold truncate group-hover:text-[var(--accent-light)] transition-colors">
            {item.title}
          </h3>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="shrink-0 p-1 rounded-md hover:bg-[var(--bg-hover)] text-gray-500 hover:text-gray-300 transition-colors"
            title="View on iTunes"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.564 9.336v-2.16c0-1.812-1.476-3.288-3.288-3.288H8.724c-1.812 0-3.288 1.476-3.288 3.288v8.448c0 1.812 1.476 3.288 3.288 3.288h5.552c1.812 0 3.288-1.476 3.288-3.288v-2.16l-4.764 2.76v-5.688l4.764 2.76zM21 12c0 4.968-4.032 9-9 9s-9-4.032-9-9 4.032-9 9-9 9 4.032 9 9z"/></svg>
          </a>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-1 truncate">{item.artist}</p>
        {item.category && (
          <span className="inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-hover)] text-gray-500">
            {item.category}
          </span>
        )}
      </div>
    </div>
  );
}

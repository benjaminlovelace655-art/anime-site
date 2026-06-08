'use client';

import { useState } from 'react';
import type { MediaItem } from '@/lib/media-api';

export default function MovieCard({ item }: { item: MediaItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all duration-300 card-hover"
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
      </div>
      <div className="absolute top-2 left-2 z-10">
        <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-medium uppercase">
          {item.type === 'tv' ? 'TV' : 'Movie'}
        </span>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold truncate group-hover:text-[var(--accent-light)] transition-colors">
          {item.title}
        </h3>
        <p className="text-[11px] text-[var(--text-muted)] mt-1 truncate">{item.artist}</p>
        {item.category && (
          <span className="inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-hover)] text-gray-500">
            {item.category}
          </span>
        )}
      </div>
    </a>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ContinueItem {
  mal_id: number;
  title: string;
  image: string;
  episode: number;
  progress: number;
  totalEpisodes?: number;
}

export default function ContinueWatching() {
  const [items, setItems] = useState<ContinueItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('anibyte_continue');
      if (stored) {
        const parsed = JSON.parse(stored) as ContinueItem[];
        setItems(parsed.slice(0, 10));
      }
    } catch {}
  }, []);

  const removeItem = (mal_id: number) => {
    const updated = items.filter(i => i.mal_id !== mal_id);
    setItems(updated);
    localStorage.setItem('anibyte_continue', JSON.stringify(updated));
  };

  if (!items.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
          Continue Watching
        </h2>
        <button
          onClick={() => { setItems([]); localStorage.removeItem('anibyte_continue'); }}
          className="text-xs text-[var(--text-muted)] hover:text-white transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
        {items.map((item) => (
          <div key={item.mal_id} className="group relative w-44 shrink-0 snap-start">
            <Link href={`/watch/${item.mal_id}?ep=${item.episode}`} className="block">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--bg-card)]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-[10px] font-bold text-white drop-shadow-lg">
                    Ep. {item.episode}
                  </p>
                  {item.progress > 0 && (
                    <div className="mt-1 h-1 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all"
                        style={{ width: `${Math.min(item.progress, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); removeItem(item.mal_id); }}
                  aria-label={`Remove ${item.title} from continue watching`}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            </Link>
            <p className="text-xs font-medium text-[var(--text-primary)] truncate mt-1.5 px-0.5">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

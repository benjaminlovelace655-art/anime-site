'use client';

import { useEffect, useState } from 'react';
import { getGenres } from '@/lib/api';

export default function GenreFilter({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const [genres, setGenres] = useState<{ mal_id: number; name: string }[]>([]);

  useEffect(() => {
    getGenres().then(res => setGenres(res.data.slice(0, 20))).catch(() => {});
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('')}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          !selected ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
        }`}
      >
        All
      </button>
      {genres.map(g => (
        <button
          key={g.mal_id}
          onClick={() => onSelect(String(g.mal_id))}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selected === String(g.mal_id) ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';

export type WatchStatus = 'Watching' | 'Planning' | 'Completed' | 'Paused' | 'Dropped' | null;

const STORAGE_KEY = 'anibyte-watchlist';

export function useWatchlist(animeId: number) {
  const [status, setStatus] = useState<WatchStatus>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data[animeId]) setStatus(data[animeId]);
      }
    } catch {}
  }, [animeId]);

  const update = useCallback((newStatus: WatchStatus) => {
    setStatus(newStatus);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : {};
      if (newStatus) data[animeId] = newStatus;
      else delete data[animeId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [animeId]);

  return { status, update };
}

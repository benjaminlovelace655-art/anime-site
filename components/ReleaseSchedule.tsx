'use client';

import { useState, useEffect } from 'react';
import { getSchedule, Anime } from '@/lib/api';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ReleaseSchedule() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState(days.includes(today) ? today : 'Monday');
  const [schedule, setSchedule] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSchedule(selectedDay).then(res => {
      if (!cancelled) {
        const withBroadcast = res.data.filter(a => a.broadcast?.string);
        const sorted = withBroadcast.sort((a, b) => {
          const aTime = a.broadcast?.time || '00:00';
          const bTime = b.broadcast?.time || '00:00';
          return aTime.localeCompare(bTime);
        });
        setSchedule(sorted.slice(0, 10));
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) { setSchedule([]); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [selectedDay]);

  return (
    <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
      <div className="p-5 pb-4">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Release Schedule
        </h3>

        <div className="flex gap-1 mb-4 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-none">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedDay === day
                  ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg shadow-green-500/20'
                  : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-hover)]'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl">
                  <div className="w-10 h-4 bg-[var(--bg-hover)] rounded shimmer" />
                  <div className="w-0.5 h-8 bg-[var(--border)]" />
                  <div className="flex-1">
                    <div className="h-3 w-32 bg-[var(--bg-hover)] rounded shimmer" />
                    <div className="h-2 w-16 bg-[var(--bg-hover)] rounded shimmer mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : schedule.length > 0 ? (
            schedule.map((item, i) => {
              const time = item.broadcast?.time?.slice(0, 5) || '--:--';
              const dayLabel = item.broadcast?.day || '';
              return (
                <div key={item.mal_id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors group cursor-pointer">
                  <div className="w-10 text-center">
                    <p className="text-[10px] font-bold text-[var(--accent-light)]">{time}</p>
                    {dayLabel && <p className="text-[8px] text-[var(--text-muted)] uppercase">{dayLabel.slice(0, 3)}</p>}
                  </div>
                  <div className="w-0.5 h-8 rounded-full bg-[var(--border)] group-hover:bg-[var(--accent)] transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate group-hover:text-[var(--accent-light)] transition-colors">{item.title_english || item.title}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{item.type || 'TV'}</p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/15 text-green-400 font-semibold">EP</span>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-[var(--text-muted)] text-center py-4">No releases scheduled for this day</p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import AniTanksGame from '@/components/AniTanksGame';
import AniTanksMultiplayer from '@/components/AniTanksMultiplayer';

export default function AniTanksPage() {
  const [mode, setMode] = useState<'single' | 'multi'>('single');

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border)] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">
              ← Back
            </Link>
            <div>
              <h1 className="text-lg font-bold text-emerald-400">AniTanks</h1>
              <p className="text-xs text-gray-500">WASD move · Mouse aim · Click to shoot</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex rounded-lg bg-[var(--bg-card)] border border-[var(--border)] p-0.5">
              <button
                onClick={() => setMode('single')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'single' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Offline
              </button>
              <button
                onClick={() => setMode('multi')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'multi' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Online
              </button>
            </div>
            {mode === 'single' && (
              <>
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  8 bots
                </span>
                <span className="text-gray-500">Power-ups</span>
                <span className="text-gray-500">Walls</span>
                <span className="text-gray-500">Sound FX</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 bg-[#0d1117]">
        {mode === 'single' ? <AniTanksGame /> : <AniTanksMultiplayer />}
      </div>
    </div>
  );
}

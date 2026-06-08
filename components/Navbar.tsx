'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 z-[10000] border-b transition-all duration-300"
      style={{ borderColor: scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)' }}
    >
      <div
        className="absolute inset-0 z-[-1] bg-black/80 backdrop-blur-2xl transition-opacity duration-300"
        style={{ opacity: scrolled ? 1 : 0 }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[-2] w-64 bg-gradient-to-r from-black/80 to-transparent md:w-[400px] transition-opacity duration-300"
        style={{ opacity: scrolled ? 1 : 0, maskImage: 'linear-gradient(black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(black 50%, transparent 100%)' }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[-2] w-48 bg-gradient-to-l from-black/80 to-transparent md:w-64 transition-opacity duration-300"
        style={{ opacity: scrolled ? 1 : 0, maskImage: 'linear-gradient(black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(black 50%, transparent 100%)' }}
      />
      <div className="relative z-10 flex w-full items-center justify-between py-3 pr-4 pl-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden group-hover:shadow-lg group-hover:shadow-green-500/25 transition-shadow">
              <img src="/founder-icon.png" alt="AniByte" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg hidden sm:block">
              <span className="gradient-text">AniByte</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-[var(--text-secondary)]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/search" className="hover:text-white transition-colors">Browse</Link>
            <Link href="/anitanks" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Play
            </Link>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative group">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search anime..."
              className="w-full pl-10 pr-12 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-all focus:shadow-[0_0_15px_var(--accent-glow)]"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[var(--bg-hover)] text-[10px] text-[var(--text-muted)] font-mono">
              <span>⌘</span>K
            </kbd>
          </div>
        </form>

        <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Sign In
        </button>

        <div className="flex sm:hidden items-center gap-2">
          <button className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-secondary)]" aria-label="Sign In">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

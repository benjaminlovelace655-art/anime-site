'use client';

import Link from 'next/link';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/search', label: 'Search', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { href: '/search?status=airing', label: 'Schedule', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/founder', label: 'Community', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { href: '/search', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function SideDock() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <nav
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-[9999] transition-all duration-300 hidden lg:flex flex-col items-center gap-1 py-4 rounded-r-2xl border border-l-0 border-[var(--border)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl ${
          collapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.3)' }}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-label={link.label}
            className="group relative flex items-center justify-center w-12 h-12 rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-light)] hover:bg-[var(--accent)]/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
            </svg>
            <span className="absolute left-14 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-xl">
              {link.label}
            </span>
          </Link>
        ))}

        <button
          onClick={() => setCollapsed(true)}
          aria-label="Collapse sidebar"
          className="mt-2 flex items-center justify-center w-12 h-12 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-hover)] transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </nav>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          className="fixed left-0 top-1/2 -translate-y-1/2 z-[9999] w-8 h-16 rounded-r-xl bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-l-0 border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-light)] hover:bg-[var(--accent)]/10 transition-all hidden lg:flex"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </>
  );
}

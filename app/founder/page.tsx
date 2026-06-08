import Link from 'next/link';

export default function FounderPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 pt-32">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-5 ring-2 ring-[var(--accent)]/30 shadow-lg shadow-green-500/10">
          <img src="/founder-icon.png" alt="Founder" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-black mb-1">Founder</h1>
        <p className="text-lg text-[var(--accent-light)] font-semibold">Benjamin Lovelace</p>
        <div className="h-px bg-[var(--border)] my-6" />
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
          Creator of AniLove — a free anime streaming platform built for fans, by fans.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm font-semibold hover:border-[var(--accent)] hover:text-white transition-all"
        >
          ← Back to AniLove
        </Link>
      </div>
    </div>
  );
}

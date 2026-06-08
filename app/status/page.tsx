import Link from 'next/link';

export const metadata = { title: 'Status — AniByte' };

export default function StatusPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 pt-28">
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
        <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
        Service Status
      </h1>
      <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
        <div className="flex items-center gap-3 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="font-semibold text-emerald-400">All Systems Operational</p>
            <p className="text-xs text-[var(--text-muted)]">All services are running normally.</p>
          </div>
        </div>
        <div className="space-y-3 mt-6">
          {[
            { name: 'Website', status: 'Operational', color: 'bg-emerald-500' },
            { name: 'Jikan API', status: 'Operational', color: 'bg-emerald-500' },
            { name: 'Video Sources', status: 'Operational', color: 'bg-emerald-500' },
            { name: 'AniTanks Game', status: 'Operational', color: 'bg-emerald-500' },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <span className="font-medium text-white text-sm">{s.name}</span>
              <span className={`flex items-center gap-1.5 text-xs font-medium text-emerald-400`}>
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Link href="/" className="inline-flex items-center gap-2 mt-8 text-sm text-[var(--accent-light)] hover:underline">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Home
      </Link>
    </div>
  );
}

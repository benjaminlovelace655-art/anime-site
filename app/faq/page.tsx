import Link from 'next/link';

export const metadata = { title: 'FAQ — AniLove' };

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 pt-28">
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
        <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
        Frequently Asked Questions
      </h1>
      <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        {[
          { q: 'Is AniLove free?', a: 'Yes, AniLove is completely free to use. No registration or payment required.' },
          { q: 'Do you host any videos on your servers?', a: 'No. AniLove does not host, store, or upload any video content. We only provide links to third-party streaming services.' },
          { q: 'Where does the anime data come from?', a: 'All anime metadata (titles, images, descriptions, ratings) is provided by MyAnimeList through the Jikan API.' },
          { q: 'Why are some episodes not loading?', a: 'The video sources are third-party services that may occasionally be down. Try switching to a different server in the player controls.' },
          { q: 'What is AniTanks?', a: 'AniTanks is a browser-based tank battle game built as a companion to AniLove. Fight AI bots, collect power-ups, and climb the leaderboard.' },
          { q: 'How do I use the watchlist?', a: 'Click on any anime card to flip it and see watchlist options. Your selections are saved in your browser.' },
          { q: 'Is there a mobile app?', a: 'Not yet. AniLove is a web app optimized for both desktop and mobile browsers.' },
        ].map((faq, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
            <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>
      <Link href="/" className="inline-flex items-center gap-2 mt-8 text-sm text-[var(--accent-light)] hover:underline">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Home
      </Link>
    </div>
  );
}

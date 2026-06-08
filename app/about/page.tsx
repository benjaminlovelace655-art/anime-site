import Link from 'next/link';

export const metadata = { title: 'About — AniByte' };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 pt-28">
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
        <span className="w-1 h-7 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
        About AniByte
      </h1>
      <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
        <p>AniByte is a free anime discovery and streaming platform built for fans by a fan. We aggregate anime metadata from MyAnimeList via the Jikan API and provide direct links to streaming sources.</p>
        <p>Our mission is to make anime discovery simple and enjoyable. Browse trending titles, search by genre, track your watchlist, and dive into episodes — all in one place with a sleek, modern interface.</p>
        <h2 className="text-lg font-bold text-white pt-4">Features</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Browse top airing, seasonal, and upcoming anime</li>
          <li>Search by title, genre, status, and type</li>
          <li>Episode lists with direct watch links</li>
          <li>Multiple server options for streaming</li>
          <li>Personal watchlist tracking</li>
          <li>Continue watching from where you left off</li>
          <li>Play AniTanks — a browser tank battle game</li>
        </ul>
        <h2 className="text-lg font-bold text-white pt-4">Disclaimer</h2>
        <p>AniByte does not host any video content. All video streams are provided by third-party services. This site is for testing and educational purposes only. We are not affiliated with any anime studio or distributor.</p>
        <p className="pt-4">Made with ❤ by <a href="https://www.instagram.com/benjamin.lovel4ce/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-light)] hover:underline">Benjamin Lovelace</a>.</p>
      </div>
      <Link href="/" className="inline-flex items-center gap-2 mt-8 text-sm text-[var(--accent-light)] hover:underline">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Home
      </Link>
    </div>
  );
}

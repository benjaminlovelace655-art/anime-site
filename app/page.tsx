import Link from 'next/link';
import { getTopAnime, getSeasonalAnime, getUpcomingAnime, type Anime } from "@/lib/api";
import HeroSection from "@/components/HeroSection";
import AnimeCard from "@/components/AnimeCard";
import ContinueWatching from "@/components/ContinueWatching";
import ReleaseSchedule from "@/components/ReleaseSchedule";
import ScrollReveal from "@/components/ScrollReveal";

export default async function Home() {
  const [top, seasonal, upcoming, trending] = await Promise.all([
    getTopAnime(1).catch(() => ({ data: [] as Anime[] })),
    getSeasonalAnime().catch(() => ({ data: [] as Anime[] })),
    getUpcomingAnime().catch(() => ({ data: [] as Anime[] })),
    getTopAnime(1).catch(() => ({ data: [] as Anime[] })),
  ]);

  const trendingData = trending.data.slice(0, 10);

  return (
    <div>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10 pb-20">
        <ScrollReveal delay={0}>
          <Link
            href="/anitanks"
            className="group relative block mt-8 mb-8 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-900/20 via-[var(--bg-card)] to-emerald-900/10 p-5 transition-all hover:border-emerald-500/40"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(16,185,129,0.08),transparent_70%)]" />
            <div className="relative z-[1] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  Support My Game: AniTanks
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tank battle .io game — WASD move, mouse aim, click to shoot. Free to play!
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black text-sm font-bold group-hover:bg-emerald-400 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Play Now
              </div>
              <svg className="w-5 h-5 text-emerald-500/50 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9 space-y-12">
            <ScrollReveal><ContinueWatching /></ScrollReveal>

            <ScrollReveal delay={100}>
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                  <span className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
                  Top Airing
                </h2>
                <Link href="/search?status=airing" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-light)] transition-colors">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {top.data.slice(0, 8).map(anime => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            </section>
            </ScrollReveal>

            <ScrollReveal delay={200}>
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                  <span className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
                  Seasonal
                </h2>
                <Link href="/search" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-light)] transition-colors">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {seasonal.data.slice(0, 8).map(anime => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            </section>
            </ScrollReveal>

            <ScrollReveal delay={300}>
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                  <span className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
                  New on Site
                </h2>
                <Link href="/search?status=upcoming" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-light)] transition-colors">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {upcoming.data.slice(0, 4).map(anime => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            </section>
            </ScrollReveal>

            <ScrollReveal delay={400}>
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/20 via-[var(--bg-card)] to-[var(--bg-card)] border border-emerald-500/20 p-6 md:p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
              <div className="relative z-[1] flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-emerald-400">Support My Game: AniTanks</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    A tank battle .io game I built. Fight bots, collect power-ups, climb the leaderboard.
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <Link
                      href="/anitanks"
                      className="px-5 py-2 rounded-xl bg-emerald-500 text-black text-sm font-bold hover:bg-emerald-400 transition-all inline-flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      Play Now
                    </Link>
                    <span className="text-xs text-gray-600">Free · Browser · 8 bots · Touch support</span>
                  </div>
                </div>
              </div>
            </section>
            </ScrollReveal>
          </div>

          <aside className="lg:col-span-3 space-y-8">
            <div className="sticky top-20 space-y-8">
              <TrendingSidebar trending={trendingData} />
              <ReleaseSchedule />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function TrendingSidebar({ trending }: { trending: Anime[] }) {
  return (
    <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
      <div className="p-5 pb-3">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.63-.16a.68.68 0 0 1-.12-.5c-.54 1.06-.63 2.28-.27 3.41.46 1.46 1.54 2.55 2.96 3.1 1.12.44 2.33.5 3.5.35 1.88-.25 3.53-1.26 4.63-2.74.86-1.17 1.25-2.5 1.25-3.92 0-1.4-.35-2.71-1.04-3.87z" /></svg>
          Top Trending
        </h3>
        <div className="space-y-2">
          {trending.map((anime, i) => (
            <Link
              key={anime.mal_id}
              href={`/anime/${anime.mal_id}`}
              className="group relative flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-all overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl overflow-hidden"
                style={{ background: `linear-gradient(135deg, rgba(34,197,94,0.08), transparent 60%)` }}
              />
              <span
                className="trending-number w-8 text-right shrink-0 relative z-[1] text-2xl"
                style={{
                  ['WebkitTextStroke' as string]: i < 3
                    ? i === 0 ? '1px rgba(34,197,94,0.6)' : i === 1 ? '1px rgba(34,197,94,0.4)' : '1px rgba(34,197,94,0.3)'
                    : '1px rgba(255,255,255,0.1)',
                  color: 'transparent',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="w-10 h-14 rounded-lg overflow-hidden bg-[var(--bg-card)] shrink-0 relative z-[1]">
                <img
                  src={anime.images.webp?.image_url || anime.images.jpg.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1 relative z-[1]">
                <p className="text-xs font-medium truncate group-hover:text-[var(--accent-light)] transition-colors">
                  {anime.title_english || anime.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {anime.score && (
                    <span className="text-[10px] text-yellow-400 font-semibold">★ {anime.score.toFixed(1)}</span>
                  )}
                  {anime.type && (
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">{anime.type}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/15 text-green-400 font-semibold">SUB</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/15 text-blue-400 font-semibold">DUB</span>
                  {anime.episodes && (
                    <span className="text-[9px] text-[var(--text-muted)]">{anime.episodes} ep</span>
                  )}
                </div>
              </div>
              <div className="relative z-[1]">
                <div className="w-7 h-7 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10">
                  <svg className="w-3 h-3 text-[var(--accent-light)] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

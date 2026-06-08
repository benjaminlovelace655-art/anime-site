import Link from 'next/link';
import { getAnimeById, getAnimeEpisodes } from '@/lib/api';
import EpisodeList from '@/components/EpisodeList';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { data } = await getAnimeById(Number(id));
    return { title: `${data.title_english || data.title} — AniLove`, description: data.synopsis?.slice(0, 160) };
  } catch {
    return { title: 'Anime Not Found — AniLove' };
  }
}

export default async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);

  const [{ data: anime }, { data: episodes }] = await Promise.all([
    getAnimeById(numId).catch(() => ({ data: null })),
    getAnimeEpisodes(numId, 1).catch(() => ({ data: [] })),
  ]);

  if (!anime) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center pt-24">
        <svg className="w-20 h-20 mx-auto text-[var(--text-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold mb-2">Anime not found</h1>
        <p className="text-[var(--text-secondary)] mb-6">This anime doesn&apos;t exist or the ID is invalid.</p>
        <Link href="/" className="group relative flex -skew-x-12 items-center justify-center overflow-hidden bg-emerald-500 px-6 py-3 transition-all duration-300 hover:scale-105 hover:bg-emerald-500/90 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-green-500/50">
          <div className="absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center bg-black/20" />
          <div className="absolute -right-1.5 -bottom-1.5 flex size-5 items-center justify-center bg-white/20" />
          <div className="relative z-10 flex skew-x-12 items-center gap-2 text-xs font-black tracking-[0.2em] text-black uppercase">
            <span>Back to Home</span>
          </div>
        </Link>
      </div>
    );
  }

  const trailerId = anime.trailer?.youtube_id;

  return (
    <div>
      <div className="relative h-[55vh] min-h-[450px] overflow-hidden">
        <img
          src={anime.images.webp?.large_image_url || anime.images.jpg.large_image_url || ''}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000] via-transparent to-[#000]/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-52 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-green-500/10 border border-[var(--border)]">
              <img
          src={anime.images.webp?.large_image_url || anime.images.jpg.large_image_url || ''}
                alt={anime.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-4 md:pt-20">
            <h1 className="text-2xl md:text-4xl font-black mb-1">{anime.title_english || anime.title}</h1>
            {anime.title_japanese && (
              <p className="text-sm text-[var(--text-muted)] mb-4">{anime.title_japanese}</p>
            )}

            <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
              {anime.score && (
                <span className="px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 font-bold flex items-center gap-1 text-xs">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  {anime.score.toFixed(1)}
                </span>
              )}
              {anime.rank && (
                <span className="px-3 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium">
                  #{anime.rank} Ranked
                </span>
              )}
              {anime.popularity && (
                <span className="px-3 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium">
                  #{anime.popularity} Popular
                </span>
              )}
              {anime.episodes && (
                <span className="px-3 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium">
                  {anime.episodes} Episodes
                </span>
              )}
              {anime.status && (
                <span className="px-3 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium capitalize">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${anime.airing ? 'bg-green-500 animate-pulse' : 'bg-gray-500'} mr-1.5`} />
                  {anime.status.replace(/_/g, ' ')}
                </span>
              )}
              {anime.type && (
                <span className="px-3 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium">
                  {anime.type}
                </span>
              )}
              {anime.season && anime.year && (
                <span className="px-3 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium capitalize">
                  {anime.season} {anime.year}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {anime.genres?.map(g => (
                <Link
                  key={g.mal_id}
                  href={`/search?genre=${g.mal_id}`}
                  className="px-3 py-1 rounded-full bg-emerald-500/10 border border-green-500/20 text-[var(--accent-light)] text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-8">
              <Link
                href={`/watch/${anime.mal_id}?ep=1`}
                className="group relative flex -skew-x-12 items-center justify-center overflow-hidden bg-emerald-500 px-8 py-3 transition-all duration-300 hover:scale-105 hover:bg-emerald-500/90 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-green-500/50"
              >
                <div className="absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center bg-black/20" />
                <div className="absolute -right-1.5 -bottom-1.5 flex size-5 items-center justify-center bg-white/20" />
                <div className="pointer-events-none absolute inset-0 flex h-full w-full [transform:translateX(-150%)] justify-center group-hover:[transform:translateX(150%)] group-hover:duration-1000">
                  <div className="relative h-full w-12 bg-white/40 blur-[2px]" />
                </div>
                <div className="relative z-10 flex skew-x-12 items-center gap-2 text-xs font-black tracking-[0.2em] text-black uppercase sm:text-sm">
                  <svg className="size-4 fill-current sm:size-5" viewBox="0 0 24 24"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg>
                  <span>Start Watching</span>
                </div>
              </Link>
              {anime.trailer?.url && (
                <a
                  href={anime.trailer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex -skew-x-12 items-center justify-center overflow-hidden border border-white/20 bg-black/60 px-6 py-3 transition-all duration-300 hover:scale-105 hover:border-green-500/80 hover:bg-black/80"
                >
                  <div className="absolute top-0 right-0 h-full w-1 bg-white/10 transition-colors group-hover:bg-green-500/50" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 flex skew-x-12 items-center gap-2 text-xs font-black tracking-[0.2em] text-white uppercase sm:text-sm">
                    <svg className="size-4 sm:size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                    <span>Trailer</span>
                  </div>
                </a>
              )}
            </div>

            {anime.synopsis && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Synopsis</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{anime.synopsis}</p>
              </div>
            )}

            {anime.background && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Background</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{anime.background}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              {anime.source && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Source</p>
                  <p className="text-sm font-medium mt-0.5">{anime.source}</p>
                </div>
              )}
              {anime.duration && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Duration</p>
                  <p className="text-sm font-medium mt-0.5">{anime.duration}</p>
                </div>
              )}
              {anime.rating && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Rating</p>
                  <p className="text-sm font-medium mt-0.5">{anime.rating}</p>
                </div>
              )}
              {anime.studios?.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Studio</p>
                  <p className="text-sm font-medium mt-0.5">{anime.studios.map(s => s.name).join(', ')}</p>
                </div>
              )}
              {anime.broadcast?.string && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Broadcast</p>
                  <p className="text-sm font-medium mt-0.5">{anime.broadcast.string}</p>
                </div>
              )}
              {anime.members > 0 && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Members</p>
                  <p className="text-sm font-medium mt-0.5">{anime.members.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {trailerId && (
          <section className="mb-12">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
              <span className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
              Trailer
            </h2>
            <div className="aspect-video rounded-2xl overflow-hidden bg-black max-w-3xl border border-[var(--border)]">
              <iframe
                src={`https://www.youtube.com/embed/${trailerId}`}
                title="Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-600 to-green-500" />
              Episodes
            </h2>
            {anime.episodes && episodes.length < (anime.episodes || 0) && (
              <span className="text-xs text-[var(--text-muted)]">
                Showing {episodes.length} of {anime.episodes} episodes
              </span>
            )}
          </div>
          <EpisodeList episodes={episodes} animeId={anime.mal_id} animeTitle={anime.title_english || anime.title} />
        </section>
      </div>
    </div>
  );
}

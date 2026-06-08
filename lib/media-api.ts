export interface MediaItem {
  id: string;
  title: string;
  image: string;
  artist: string;
  category: string;
  releaseDate: string;
  url: string;
  type: 'movie' | 'tv';
  imdbId: string;
  mature: boolean;
}

interface SampleMovie {
  id: number;
  title: string;
  posterURL: string;
  imdbId: string;
}

interface TVmazeShow {
  id: number;
  name: string;
  genres: string[];
  image: { medium: string; original: string } | null;
  premiered: string;
  externals: { tvrage?: number; thetvdb?: number; imdb?: string };
  network?: { name: string };
  webChannel?: { name: string };
  rating?: { average: number };
}

const MATURE_GENRES = new Set(['Adult', 'Erotic', 'Horror']);

function isMatureTV(tv: TVmazeShow): boolean {
  return tv.genres?.some(g => MATURE_GENRES.has(g)) ?? false;
}

const MOVIE_ENDPOINTS = [
  { url: 'https://api.sampleapis.com/movies/drama', category: 'Drama', mature: false },
  { url: 'https://api.sampleapis.com/movies/comedy', category: 'Comedy', mature: false },
  { url: 'https://api.sampleapis.com/movies/animation', category: 'Animation', mature: false },
  { url: 'https://api.sampleapis.com/movies/horror', category: 'Horror', mature: true },
  { url: 'https://api.sampleapis.com/movies/western', category: 'Western', mature: false },
  { url: 'https://api.sampleapis.com/movies/action', category: 'Action', mature: false },
  { url: 'https://api.sampleapis.com/movies/thriller', category: 'Thriller', mature: true },
  { url: 'https://api.sampleapis.com/movies/scifi', category: 'Sci-Fi', mature: false },
  { url: 'https://api.sampleapis.com/movies/fantasy', category: 'Fantasy', mature: false },
  { url: 'https://api.sampleapis.com/movies/romance', category: 'Romance', mature: false },
];

async function fetchMoviesFromEndpoint(ep: typeof MOVIE_ENDPOINTS[0]): Promise<MediaItem[]> {
  try {
    const res = await fetch(ep.url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data: SampleMovie[] = await res.json();
    return data.map(item => ({
      id: `movie-${ep.category}-${item.id}`,
      title: item.title,
      image: item.posterURL,
      artist: ep.category,
      category: ep.category,
      releaseDate: '',
      url: `https://www.imdb.com/title/${item.imdbId}`,
      type: 'movie' as const,
      imdbId: item.imdbId,
      mature: ep.mature,
    }));
  } catch {
    return [];
  }
}

export async function getTopMovies(): Promise<MediaItem[]> {
  const results = await Promise.all(MOVIE_ENDPOINTS.map(fetchMoviesFromEndpoint));
  const flat = results.flat();
  const seen = new Set<string>();
  return flat.filter(item => {
    if (seen.has(item.imdbId)) return false;
    seen.add(item.imdbId);
    return true;
  });
}

const TVMAZE_PAGES = [0, 1, 2, 3, 4];

async function fetchTVPage(page: number): Promise<MediaItem[]> {
  try {
    const res = await fetch(`https://api.tvmaze.com/shows?page=${page}`, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data: TVmazeShow[] = await res.json();
    return data
      .filter(s => s.externals?.imdb)
      .map(item => ({
        id: `tv-${item.id}`,
        title: item.name,
        image: item.image?.original?.replace('http:', 'https:') || item.image?.medium?.replace('http:', 'https:') || '',
        artist: item.network?.name || item.webChannel?.name || 'TV',
        category: item.genres?.[0] || '',
        releaseDate: item.premiered || '',
        url: `https://www.imdb.com/title/${item.externals.imdb}`,
        type: 'tv' as const,
        imdbId: item.externals.imdb || '',
        mature: isMatureTV(item),
      }));
  } catch {
    return [];
  }
}

export async function getTopTVShows(): Promise<MediaItem[]> {
  const results = await Promise.all(TVMAZE_PAGES.map(fetchTVPage));
  const flat = results.flat();
  const seen = new Set<string>();
  return flat.filter(item => {
    if (seen.has(item.imdbId)) return false;
    seen.add(item.imdbId);
    return true;
  });
}

export async function getTopMovies10(): Promise<MediaItem[]> {
  return (await getTopMovies()).slice(0, 10);
}

export async function getTopTVShows10(): Promise<MediaItem[]> {
  return (await getTopTVShows()).slice(0, 10);
}

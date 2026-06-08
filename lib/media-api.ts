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
}

export async function getTopMovies(): Promise<MediaItem[]> {
  try {
    const res = await fetch('https://api.sampleapis.com/movies/classic', { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data: SampleMovie[] = await res.json();
    return data.slice(0, 50).map(item => ({
      id: String(item.id),
      title: item.title,
      image: item.posterURL,
      artist: 'Classic Film',
      category: 'Classic',
      releaseDate: '',
      url: `https://www.imdb.com/title/${item.imdbId}`,
      type: 'movie' as const,
      imdbId: item.imdbId,
    }));
  } catch {
    return [];
  }
}

export async function getTopTVShows(): Promise<MediaItem[]> {
  try {
    const res = await fetch('https://api.tvmaze.com/shows?page=0', { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data: TVmazeShow[] = await res.json();
    return data
      .filter(s => s.externals?.imdb)
      .slice(0, 50)
      .map(item => ({
        id: String(item.id),
        title: item.name,
        image: item.image?.original?.replace('http:', 'https:') || item.image?.medium?.replace('http:', 'https:') || '',
        artist: item.network?.name || item.webChannel?.name || 'TV',
        category: item.genres?.[0] || '',
        releaseDate: item.premiered || '',
        url: `https://www.imdb.com/title/${item.externals.imdb}`,
        type: 'tv' as const,
        imdbId: item.externals.imdb || '',
      }));
  } catch {
    return [];
  }
}

export async function getTopMovies10(): Promise<MediaItem[]> {
  return (await getTopMovies()).slice(0, 10);
}

export async function getTopTVShows10(): Promise<MediaItem[]> {
  return (await getTopTVShows()).slice(0, 10);
}

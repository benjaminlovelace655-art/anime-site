export interface MediaItem {
  id: string;
  title: string;
  image: string;
  artist: string;
  category: string;
  releaseDate: string;
  url: string;
  type: 'movie' | 'tv';
}

interface RSSResult {
  results: {
    id: string;
    name: string;
    artworkUrl100: string;
    artistName: string;
    genres: { name: string }[];
    releaseDate: string;
    url: string;
  }[];
}

async function fetchRSS(feed: string): Promise<MediaItem[]> {
  try {
    const res = await fetch(feed, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data: RSSResult = await res.json();
    return (data.results || []).map(item => ({
      id: item.id,
      title: item.name,
      image: item.artworkUrl100.replace('100x100', '600x600'),
      artist: item.artistName,
      category: item.genres?.[0]?.name || '',
      releaseDate: item.releaseDate || '',
      url: item.url,
      type: feed.includes('tv-shows') ? 'tv' as const : 'movie' as const,
    }));
  } catch {
    return [];
  }
}

export async function getTopMovies() {
  return fetchRSS('https://rss.applemarketingtools.com/api/v2/us/movies/top-movies/25.json');
}

export async function getTopTVShows() {
  return fetchRSS('https://rss.applemarketingtools.com/api/v2/us/tv-shows/top-tv-shows/25.json');
}

export async function getTopMovies10() {
  return fetchRSS('https://rss.applemarketingtools.com/api/v2/us/movies/top-movies/10.json');
}

export async function getTopTVShows10() {
  return fetchRSS('https://rss.applemarketingtools.com/api/v2/us/tv-shows/top-tv-shows/10.json');
}

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_KEY || '';

const BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

export interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: string;
  genre_ids: number[];
  original_language: string;
}

interface TMDBResponse {
  results: TMDBItem[];
  total_pages: number;
  total_results: number;
}

async function fetchTMDB(endpoint: string): Promise<TMDBResponse> {
  if (!TMDB_KEY) return { results: [], total_pages: 0, total_results: 0 };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${TMDB_KEY}` },
    signal: controller.signal,
  });
  clearTimeout(timeout);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export function posterUrl(path: string | null, size: 'w500' | 'original' = 'w500') {
  return path ? `${IMG_BASE}/${size}${path}` : null;
}

export function backdropUrl(path: string | null) {
  return path ? `${IMG_BASE}/original${path}` : null;
}

export async function getTrending(mediaType: 'movie' | 'tv' = 'movie', page = 1) {
  return fetchTMDB(`/trending/${mediaType}/week?language=en-US&page=${page}`);
}

export async function getPopular(mediaType: 'movie' | 'tv' = 'movie', page = 1) {
  return fetchTMDB(`/${mediaType}/popular?language=en-US&page=${page}`);
}

export async function getTopRated(mediaType: 'movie' | 'tv' = 'movie', page = 1) {
  return fetchTMDB(`/${mediaType}/top_rated?language=en-US&page=${page}`);
}

export async function getNowPlaying(page = 1) {
  return fetchTMDB(`/movie/now_playing?language=en-US&page=${page}`);
}

export async function getAiringToday(page = 1) {
  return fetchTMDB(`/tv/airing_today?language=en-US&page=${page}`);
}

export async function searchTMDB(query: string, page = 1) {
  return fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=${page}`);
}

export const GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality',
  10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics',
};

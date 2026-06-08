const BASE = "https://api.jikan.moe/v4";

async function fetchJikan(endpoint: string, revalidate = 60) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const res = await fetch(`${BASE}${endpoint}`, { next: { revalidate }, signal: controller.signal });
  clearTimeout(timeout);
  if (!res.ok) throw new Error(`Jikan error: ${res.status}`);
  return res.json();
}

export interface Anime {
  mal_id: number;
  url: string;
  images: { jpg: { image_url: string; large_image_url: string | null; small_image_url: string }; webp: { image_url: string; large_image_url: string | null } };
  trailer: { url: string | null; youtube_id: string | null; embed_url: string | null };
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  score: number | null;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  genres: { mal_id: number; name: string }[];
  studios: { mal_id: number; name: string }[];
  producers: { mal_id: number; name: string }[];
  licensors: { mal_id: number; name: string }[];
  duration: string;
  rating: string;
  broadcast: { day: string | null; time: string | null; timezone: string | null; string: string | null };
}

export interface AnimeEpisode {
  mal_id: number;
  url: string;
  title: string;
  title_japanese: string | null;
  title_romanji: string | null;
  aired: string | null;
  score: number | null;
  filler: boolean;
  recap: boolean;
  forum_url: string | null;
}

interface Pagination {
  current_page: number;
  has_next_page: boolean;
  last_visible_page: number;
  items: { count: number; per_page: number; total: number };
}

export async function getTopAnime(page = 1, filter?: string) {
  const f = filter ? `&filter=${filter}` : "";
  return fetchJikan(`/top/anime?page=${page}${f}`, 120) as Promise<{ data: Anime[]; pagination: Pagination }>;
}

export async function getSeasonalAnime(page = 1) {
  return fetchJikan(`/seasons/now?page=${page}`, 300) as Promise<{ data: Anime[]; pagination: Pagination }>;
}

export async function getAnimeById(id: number) {
  return fetchJikan(`/anime/${id}/full`, 600) as Promise<{ data: Anime }>;
}

export async function searchAnime(query: string, page = 1, genre?: string, status?: string, type?: string) {
  let q = `&q=${encodeURIComponent(query)}`;
  if (genre) q += `&genres=${genre}`;
  if (status) q += `&status=${status}`;
  if (type) q += `&type=${type}`;
  return fetchJikan(`/anime?page=${page}${q}&sfw=true`, 60) as Promise<{ data: Anime[]; pagination: Pagination }>;
}

export async function getAnimeEpisodes(id: number, page = 1) {
  return fetchJikan(`/anime/${id}/episodes?page=${page}`, 600) as Promise<{ data: AnimeEpisode[]; pagination: Pagination }>;
}

export async function getGenres() {
  return fetchJikan(`/genres/anime`, 86400) as Promise<{ data: { mal_id: number; name: string; count: number }[] }>;
}

export async function getRandomAnime() {
  return fetchJikan(`/random/anime`, 0) as Promise<{ data: Anime }>;
}

export async function getUpcomingAnime(page = 1) {
  return fetchJikan(`/seasons/upcoming?page=${page}`, 300) as Promise<{ data: Anime[]; pagination: Pagination }>;
}

export async function getSchedule(day?: string) {
  const d = day ? `?day=${day.toLowerCase()}&filter=monday` : '?filter=monday';
  return fetchJikan(`/schedules${d}`, 600) as Promise<{ data: Anime[]; pagination: Pagination }>;
}

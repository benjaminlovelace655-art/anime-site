const OMDb_KEY = '977246a1';
const BASE = 'https://www.omdbapi.com';

export interface OMDbResult {
  Title: string;
  Year: string;
  Rated: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Plot: string;
  Genre: string;
  Director: string;
  Actors: string;
  Runtime: string;
  imdbRating: string;
  Response: string;
  Error?: string;
}

export async function searchOMDb(title: string): Promise<OMDbResult | null> {
  try {
    const res = await fetch(`${BASE}/?apikey=${OMDb_KEY}&t=${encodeURIComponent(title)}&plot=short`);
    if (!res.ok) return null;
    const data: OMDbResult = await res.json();
    return data.Response === 'True' ? data : null;
  } catch {
    return null;
  }
}

export async function searchOMDbByImdbId(imdbId: string): Promise<OMDbResult | null> {
  try {
    const res = await fetch(`${BASE}/?apikey=${OMDb_KEY}&i=${imdbId}&plot=short`);
    if (!res.ok) return null;
    const data: OMDbResult = await res.json();
    return data.Response === 'True' ? data : null;
  } catch {
    return null;
  }
}

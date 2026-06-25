const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
const OMDB_BASE_URL = "https://www.omdbapi.com";

function getApiKey() {
  return process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
}

function getOmdbKey() {
  return process.env.OMDB_API_KEY || process.env.NEXT_PUBLIC_OMDB_API_KEY || "";
}

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const apiKey = getApiKey();
  if (!apiKey) return { results: [] };
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", apiKey);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchTrending(mediaType: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "week", page = 1) {
  return tmdbFetch(`/trending/${mediaType}/${timeWindow}`, { page: String(page) });
}

export async function fetchPopularMovies(page = 1) {
  return tmdbFetch("/movie/popular", { page: String(page) });
}

export async function fetchTopRatedMovies(page = 1) {
  return tmdbFetch("/movie/top_rated", { page: String(page) });
}

export async function fetchPopularShows(page = 1) {
  return tmdbFetch("/tv/popular", { page: String(page) });
}

export async function fetchTopRatedShows(page = 1) {
  return tmdbFetch("/tv/top_rated", { page: String(page) });
}

export async function fetchMoviesByGenre(genreId: number, page = 1) {
  return tmdbFetch("/discover/movie", { with_genres: String(genreId), sort_by: "popularity.desc", page: String(page) });
}

export async function fetchShowsByGenre(genreId: number, page = 1) {
  return tmdbFetch("/discover/tv", { with_genres: String(genreId), sort_by: "popularity.desc", page: String(page) });
}

export async function fetchMovieDetails(id: number) {
  return tmdbFetch(`/movie/${id}`, { append_to_response: "external_ids,videos,credits" });
}

export async function fetchShowDetails(id: number) {
  return tmdbFetch(`/tv/${id}`, { append_to_response: "external_ids,videos,credits" });
}

export async function searchMulti(query: string, page = 1) {
  return tmdbFetch("/search/multi", { query, include_adult: "false", page: String(page) });
}

export async function searchMovies(query: string, page = 1) {
  return tmdbFetch("/search/movie", { query, include_adult: "false", page: String(page) });
}

export async function searchShows(query: string, page = 1) {
  return tmdbFetch("/search/tv", { query, include_adult: "false", page: String(page) });
}

export async function fetchOmdbData(imdbId: string) {
  const apiKey = getOmdbKey();
  if (!apiKey || !imdbId) return null;
  try {
    const url = `${OMDB_BASE_URL}/?i=${imdbId}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.Response === "True" ? data : null;
  } catch {
    return null;
  }
}

export function getImageUrl(path: string | null, size: "w300" | "w500" | "w780" | "original" = "w500"): string {
  if (!path) return "/placeholder.svg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export async function fetchNowPlayingMovies() {
  return tmdbFetch("/movie/now_playing");
}

export async function fetchUpcomingMovies() {
  return tmdbFetch("/movie/upcoming");
}

export async function fetchAiringToday() {
  return tmdbFetch("/tv/airing_today");
}

export async function fetchSimilar(mediaType: "movie" | "tv", id: number) {
  return tmdbFetch(`/${mediaType}/${id}/similar`);
}

export async function fetchSeasonDetails(showId: number, seasonNumber: number) {
  return tmdbFetch(`/tv/${showId}/season/${seasonNumber}`, {
    append_to_response: "credits,videos",
  });
}

export async function fetchEpisodeDetails(
  showId: number,
  seasonNumber: number,
  episodeNumber: number
) {
  return tmdbFetch(
    `/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`,
    { append_to_response: "credits,videos" }
  );
}

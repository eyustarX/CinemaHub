const TMDB_API_KEY = "d242d82f96ef6b09ac9f2225df5bd6d0";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "en-US");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
}

export async function getPopularMovies(page = 1) {
  const data = await tmdbFetch("/movie/popular", { page });
  return data.results;
}

export function posterUrl(path, size = "w500") {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

export function backdropUrl(path, size = "w1280") {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

export async function getGenres() {
  const data = await tmdbFetch("/genre/movie/list");
  return data.genres;
}

export async function discoverMovies({
  page = 1,
  genreId = "",
  sortBy = "popularity.desc",
} = {}) {
  const params = { page, sort_by: sortBy };
  if (genreId) params.with_genres = genreId;
  const data = await tmdbFetch("/discover/movie", params);
  return { results: data.results, totalPages: data.total_pages };
}

export async function searchMovies(query, page = 1) {
  const data = await tmdbFetch("/search/movie", { query, page });
  return { results: data.results, totalPages: data.total_pages };
}

export async function getMovieDetails(movieId) {
  return tmdbFetch(`/movie/${movieId}`, {
    append_to_response: "videos,credits",
  });
}

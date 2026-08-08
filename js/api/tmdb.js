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

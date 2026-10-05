const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const IMG = {
  poster: (path) => (path ? `https://image.tmdb.org/t/p/w342${path}` : null),
  backdrop: (path) => (path ? `https://image.tmdb.org/t/p/w1280${path}` : null),
  profile: (path) => (path ? `https://image.tmdb.org/t/p/w185${path}` : null),
};

/** Single place that talks to the API, so every error is shaped the same way. */
async function request(path, params = {}, signal) {
  if (!API_KEY) {
    throw new Error(
      "Missing API key. Add VITE_TMDB_API_KEY to your .env file and restart the dev server."
    );
  }
  const url = new URL(`${BASE_URL}${path}`);
  url.search = new URLSearchParams({ api_key: API_KEY, language: "en-US", ...params });

  let res;
  try {
    res = await fetch(url, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("Network error. Check your connection and try again.");
  }

  if (!res.ok) {
    if (res.status === 401) throw new Error("The API key was rejected. Check VITE_TMDB_API_KEY.");
    if (res.status === 404) throw new Error("We couldn't find that movie.");
    if (res.status === 429) throw new Error("Too many requests. Wait a moment and retry.");
    throw new Error(`The movie service returned an error (${res.status}).`);
  }
  return res.json();
}

export const getGenres = (signal) => request("/genre/movie/list", {}, signal);

export const getMovies = ({ query, genre, page = 1 }, signal) => {
  if (query) return request("/search/movie", { query, page, include_adult: false }, signal);
  const params = { page, sort_by: "popularity.desc", "vote_count.gte": 50 };
  if (genre) params.with_genres = genre;
  return request("/discover/movie", params, signal);
};

export const getMovieDetails = (id, signal) =>
  request(`/movie/${id}`, { append_to_response: "credits,videos" }, signal);

const TMDB_API_KEY = "a45420333457411e78d5ad35d6c51a2d";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDB(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export async function getTrending(type: "movie" | "tv" | "all" = "all", timeWindow: "day" | "week" = "week") {
  return fetchTMDB(`/trending/${type}/${timeWindow}`);
}

export async function getPopularMovies(page = 1) {
  return fetchTMDB("/movie/popular", { page: String(page) });
}

export async function getPopularTV(page = 1) {
  return fetchTMDB("/tv/popular", { page: String(page) });
}

export async function getTopRatedMovies(page = 1) {
  return fetchTMDB("/movie/top_rated", { page: String(page) });
}

export async function getTopRatedTV(page = 1) {
  return fetchTMDB("/tv/top_rated", { page: String(page) });
}

export async function getNowPlayingMovies(page = 1) {
  return fetchTMDB("/movie/now_playing", { page: String(page) });
}

export async function getUpcomingMovies(page = 1) {
  return fetchTMDB("/movie/upcoming", { page: String(page) });
}

export async function getMovieDetails(id: string | number) {
  return fetchTMDB(`/movie/${id}`, { append_to_response: "credits,videos,recommendations,similar,release_dates,watch/providers" });
}

export async function getTVDetails(id: string | number) {
  return fetchTMDB(`/tv/${id}`, { append_to_response: "credits,videos,recommendations,similar,content_ratings,watch/providers" });
}

export async function getTVSeason(id: string | number, season: number) {
  return fetchTMDB(`/tv/${id}/season/${season}`);
}

export async function searchMulti(query: string, page = 1) {
  return fetchTMDB("/search/multi", { query, page: String(page) });
}

export async function searchMovies(query: string, page = 1) {
  return fetchTMDB("/search/movie", { query, page: String(page) });
}

export async function searchTV(query: string, page = 1) {
  return fetchTMDB("/search/tv", { query, page: String(page) });
}

export async function getGenreMovies(genreId: number, page = 1) {
  return fetchTMDB("/discover/movie", { with_genres: String(genreId), page: String(page), sort_by: "popularity.desc" });
}

export async function getGenreTV(genreId: number, page = 1) {
  return fetchTMDB("/discover/tv", { with_genres: String(genreId), page: String(page), sort_by: "popularity.desc" });
}

export async function getMoviesByGenre(genreId: number, page = 1) {
  return fetchTMDB("/discover/movie", {
    with_genres: String(genreId),
    page: String(page),
    sort_by: "popularity.desc",
  });
}

export async function getProviderMovies(providerId: number, page = 1) {
  return fetchTMDB("/discover/movie", {
    with_watch_providers: String(providerId),
    watch_region: "US",
    page: String(page),
    sort_by: "popularity.desc",
  });
}

export async function getProviderTV(providerId: number, page = 1) {
  return fetchTMDB("/discover/tv", {
    with_watch_providers: String(providerId),
    watch_region: "US",
    page: String(page),
    sort_by: "popularity.desc",
  });
}

export async function getSimilar(type: "movie" | "tv", id: number, page = 1) {
  return fetchTMDB(`/${type}/${id}/similar`, { page: String(page) });
}

export async function getRecommendations(type: "movie" | "tv", id: number, page = 1) {
  return fetchTMDB(`/${type}/${id}/recommendations`, { page: String(page) });
}

export const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

export const TV_GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 9648, name: "Mystery" },
  { id: 10768, name: "War & Politics" },
];

export const PROVIDERS = [
  { id: 8, name: "Netflix", logo: "https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg" },
  { id: 9, name: "Amazon Prime Video", logo: "https://image.tmdb.org/t/p/original/emthp39XA2YScoYL1p0sdbAH2WA.jpg" },
  { id: 337, name: "Disney+", logo: "https://image.tmdb.org/t/p/original/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg" },
  { id: 2, name: "Apple TV+", logo: "https://image.tmdb.org/t/p/original/4KAy34EHvRM25Ih8wb82AHWTm3Q.jpg" },
  { id: 15, name: "Hulu", logo: "https://image.tmdb.org/t/p/original/zxrVdFjIjLqkfnwyghnfywTn3Lh.jpg" },
  { id: 384, name: "HBO Max", logo: "https://image.tmdb.org/t/p/original/Ajqyt5aNxNGjmF9uOfxArGrdf3X.jpg" },
  { id: 531, name: "Paramount+", logo: "https://image.tmdb.org/t/p/original/fi83B1oztoS47xxcemFdPMhIzK.jpg" },
  { id: 386, name: "Peacock", logo: "https://image.tmdb.org/t/p/original/xTHltMrZPAJFLQ6qyCBjAnXSmZt.jpg" },
  { id: 283, name: "Crunchyroll", logo: "https://image.tmdb.org/t/p/original/8Gt1iClBlzTeQs8WQm8UrCoIxnQ.jpg" },
  { id: 43, name: "Starz", logo: "https://image.tmdb.org/t/p/original/mFnHoam1pyzMWovLH8RmSgtRqSA.jpg" },
];

import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies, MOVIE_GENRES } from "@/lib/tmdb";
import MoviesClient from "./MoviesClient";

export const metadata = {
  title: "Movies - Priva Movies",
};

export default async function MoviesPage() {
  const [popular, topRated, nowPlaying, upcoming] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
  ]);

  return (
    <MoviesClient
      popular={popular.results || []}
      topRated={topRated.results || []}
      nowPlaying={nowPlaying.results || []}
      upcoming={upcoming.results || []}
      genres={MOVIE_GENRES}
    />
  );
}

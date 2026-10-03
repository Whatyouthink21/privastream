import { getTrending, getPopularMovies, getPopularTV, getTopRatedMovies, getNowPlayingMovies } from "@/lib/tmdb";
import { PROVIDERS } from "@/lib/tmdb";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const [trending, popularMovies, popularTV, topRatedMovies, nowPlaying] = await Promise.all([
    getTrending("all", "week"),
    getPopularMovies(),
    getPopularTV(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
  ]);

  return (
    <HomeClient
      trending={trending.results || []}
      popularMovies={popularMovies.results || []}
      popularTV={popularTV.results || []}
      topRatedMovies={topRatedMovies.results || []}
      nowPlaying={nowPlaying.results || []}
      providers={PROVIDERS}
    />
  );
}

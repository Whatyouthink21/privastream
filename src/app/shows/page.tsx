import { getPopularTV, getTopRatedTV, TV_GENRES } from "@/lib/tmdb";
import ShowsClient from "./ShowsClient";

export const metadata = {
  title: "TV Shows - Priva Movies",
};

export default async function ShowsPage() {
  const [popular, topRated] = await Promise.all([
    getPopularTV(),
    getTopRatedTV(),
  ]);

  return (
    <ShowsClient
      popular={popular.results || []}
      topRated={topRated.results || []}
      genres={TV_GENRES}
    />
  );
}

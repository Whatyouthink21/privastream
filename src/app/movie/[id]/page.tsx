import { getMovieDetails } from "@/lib/tmdb";
import MovieDetailClient from "./MovieDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(id);
    return {
      title: `${movie.title} - Priva Movies`,
      description: movie.overview,
    };
  } catch {
    return { title: "Movie - Priva Movies" };
  }
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(id);
    if (!movie || movie.success === false) notFound();
    return <MovieDetailClient movie={movie} />;
  } catch {
    notFound();
  }
}

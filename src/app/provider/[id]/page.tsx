import { getProviderMovies, getProviderTV, PROVIDERS } from "@/lib/tmdb";
import ProviderClient from "./ProviderClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const provider = PROVIDERS.find(p => p.id === parseInt(id));
  return {
    title: `${provider?.name || "Provider"} - Priva Movies`,
  };
}

export default async function ProviderPage({ params }: Props) {
  const { id } = await params;
  const providerId = parseInt(id);
  const provider = PROVIDERS.find(p => p.id === providerId);
  if (!provider) notFound();

  const [movies, shows] = await Promise.all([
    getProviderMovies(providerId),
    getProviderTV(providerId),
  ]);

  return (
    <ProviderClient
      provider={provider}
      movies={movies.results || []}
      shows={shows.results || []}
    />
  );
}

import { getTVDetails } from "@/lib/tmdb";
import TVDetailClient from "./TVDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const show = await getTVDetails(id);
    return {
      title: `${show.name} - Priva Movies`,
      description: show.overview,
    };
  } catch {
    return { title: "Show - Priva Movies" };
  }
}

export default async function TVPage({ params }: Props) {
  const { id } = await params;
  try {
    const show = await getTVDetails(id);
    if (!show || show.success === false) notFound();
    return <TVDetailClient show={show} />;
  } catch {
    notFound();
  }
}

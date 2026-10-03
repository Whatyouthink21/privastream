"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Plus, Check, Play } from "lucide-react";
import { useUser } from "./UserContext";
import { tmdbImage, getYear } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  item: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string;
    backdrop_path?: string;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
    media_type?: string;
    genre_ids?: number[];
  };
  mediaType?: "movie" | "tv";
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  progressValue?: number;
  timeLeft?: string;
  episodeInfo?: string;
  onRemove?: () => void;
  index?: number;
}

export default function MovieCard({
  item, mediaType, size = "md", showProgress, progressValue, timeLeft, episodeInfo, index = 0,
}: MovieCardProps) {
  const { user, toggleWatchlist, isInWatchlist } = useUser();
  const type = mediaType || item.media_type || "movie";
  const title = item.title || item.name || "Unknown";
  const year = getYear(item.release_date || item.first_air_date || "");
  const rating = item.vote_average?.toFixed(1);
  const href = type === "movie" ? `/movie/${item.id}` : `/show/${item.id}`;
  const inList = isInWatchlist(item.id, type);

  const handleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    await toggleWatchlist({ tmdbId: item.id, mediaType: type, title, posterPath: item.poster_path || null, backdropPath: item.backdrop_path || null, rating: rating || null, year: year || null });
  };

  const sizeClasses = { sm: "w-32", md: "w-40", lg: "w-48" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn("relative flex-shrink-0 group cursor-pointer", sizeClasses[size])}
    >
      <Link href={href} className="block">
        <motion.div
          whileHover={{ scale: 1.08, y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative rounded-xl overflow-hidden bg-[#1a1a1a] aspect-[2/3] border-2 border-transparent hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/20"
          style={{ transition: "border-color 0.3s, box-shadow 0.3s" }}
        >
          {item.poster_path ? (
            <Image src={tmdbImage(item.poster_path, "w342")} alt={title} fill className="object-cover" sizes="(max-width: 768px) 150px, 200px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#111]">
              <span className="text-4xl">🎬</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-xl shadow-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Play size={20} className="text-white ml-0.5" fill="white" />
            </motion.div>
          </div>

          {/* Progress bar */}
          {showProgress && progressValue !== undefined && progressValue > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(progressValue, 100)}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full bg-red-500 rounded-full" />
            </div>
          )}

          {/* Rating */}
          {rating && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 border border-red-500/20">
              <Star size={10} className="text-red-400" fill="currentColor" />
              <span className="text-white text-xs font-bold">{rating}</span>
            </div>
          )}

          {/* Watchlist */}
          {user && (
            <motion.button
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={handleWatchlist}
              className={cn(
                "absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                inList ? "bg-red-500 text-white shadow-lg shadow-red-500/40" : "bg-black/60 backdrop-blur border border-white/20 text-white hover:bg-red-500 hover:border-red-500"
              )}
            >
              {inList ? <Check size={12} /> : <Plus size={12} />}
            </motion.button>
          )}
        </motion.div>

        <div className="mt-2 px-0.5">
          <p className="text-white text-xs font-medium truncate group-hover:text-red-400 transition-colors duration-300">{title}</p>
          {(timeLeft || episodeInfo) ? (
            <p className="text-red-400/60 text-xs mt-0.5">{episodeInfo || timeLeft}</p>
          ) : (
            <p className="text-white/30 text-xs mt-0.5">{year}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

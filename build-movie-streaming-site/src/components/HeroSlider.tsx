"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Info, Star, Calendar, Tag, Check } from "lucide-react";
import { useUser } from "./UserContext";
import { tmdbImage, getYear } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface HeroItem {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  media_type?: string;
  genres?: { id: number; name: string }[];
}

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 14: "Fantasy",
  27: "Horror", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  53: "Thriller", 10759: "Action & Adventure", 10765: "Sci-Fi & Fantasy",
  10751: "Family", 10768: "War & Politics",
};

export default function HeroSlider({ items, mediaType }: { items: HeroItem[]; mediaType?: "movie" | "tv" }) {
  const [current, setCurrent] = useState(0);
  const { user, toggleWatchlist, isInWatchlist } = useUser();

  const goTo = useCallback((idx: number) => setCurrent(idx), []);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % items.length), 7000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items || items.length === 0) return null;
  const item = items[current];
  const type = mediaType || item.media_type || "movie";
  const title = item.title || item.name || "";
  const year = getYear(item.release_date || item.first_air_date || "");
  const rating = item.vote_average?.toFixed(1);
  const href = type === "movie" ? `/movie/${item.id}` : `/show/${item.id}`;
  const genres = item.genres?.slice(0, 2).map(g => g.name) || item.genre_ids?.slice(0, 2).map(id => GENRE_MAP[id]).filter(Boolean) || [];
  const inList = isInWatchlist(item.id, type);

  const handleWatchlist = async () => {
    if (!user) return;
    await toggleWatchlist({ tmdbId: item.id, mediaType: type, title, posterPath: item.poster_path || null, backdropPath: item.backdrop_path || null, rating: rating || null, year: year || null });
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {item.backdrop_path && (
            <Image
              src={tmdbImage(item.backdrop_path, "original")}
              alt={title}
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Red tint overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-transparent to-transparent" />
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 hero-bottom-gradient" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" style={{ top: "60%" }} />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 40, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute bottom-32 left-12 max-w-xl"
        >
          {genres.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-3">
              {genres.map((g, i) => (
                <span key={g} className="text-red-400/80 text-sm font-medium">{g}{i < genres.length - 1 && <span className="text-white/20 ml-3">•</span>}</span>
              ))}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-5xl md:text-6xl font-black text-white mb-3 leading-[1.1] drop-shadow-2xl"
          >
            {title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-4 mb-4 text-sm text-white/60"
          >
            {rating && (
              <span className="flex items-center gap-1">
                <Star size={14} className="text-red-500" fill="currentColor" />
                <span className="text-white font-semibold">{rating}/10</span>
              </span>
            )}
            {year && <span className="flex items-center gap-1"><Calendar size={14} className="text-red-400/60" />{year}</span>}
            {genres[0] && <span className="flex items-center gap-1"><Tag size={14} className="text-red-400/60" />{genres[0]}</span>}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3 max-w-md"
          >
            {item.overview}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <Link href={href}>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 btn-red px-7 py-3.5 rounded-full font-bold text-sm cursor-pointer"
              >
                <Play size={16} fill="white" />
                Play
              </motion.span>
            </Link>
            <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full overflow-hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWatchlist}
                className="flex items-center gap-2 px-4 py-3.5 text-white/70 hover:text-red-400 transition-colors"
              >
                {inList ? <Check size={16} className="text-red-400" /> : <Plus size={16} />}
              </motion.button>
              <div className="w-px h-6 bg-white/10" />
              <Link href={href} className="flex items-center gap-2 px-4 py-3.5 text-white/70 hover:text-red-400 transition-colors">
                <Info size={16} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-20 right-12 flex items-center gap-2">
        {items.slice(0, 8).map((_, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.3 }}
            onClick={() => goTo(i)}
            className="relative"
          >
            <motion.div
              animate={i === current ? { width: 24, height: 8 } : { width: 8, height: 8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn("rounded-full", i === current ? "bg-red-500 shadow-lg shadow-red-500/40" : "bg-white/20")}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Clock, X, ArrowUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import ContentRow from "@/components/ContentRow";
import { useUser } from "@/components/UserContext";
import { formatTimeLeft, tmdbImage } from "@/lib/utils";

interface Provider { id: number; name: string; logo: string; }

interface HomeClientProps {
  trending: any[];
  popularMovies: any[];
  popularTV: any[];
  topRatedMovies: any[];
  nowPlaying: any[];
  providers: Provider[];
}

export default function HomeClient({ trending, popularMovies, popularTV, topRatedMovies, nowPlaying, providers }: HomeClientProps) {
  const { user, continueWatching, removeContinueWatching, refreshContinueWatching } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => { if (user) refreshContinueWatching(); }, [user]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cwItems = continueWatching.map(item => ({
    ...item,
    id: item.tmdbId,
    title: item.title,
    media_type: item.mediaType,
    poster_path: item.posterPath,
    backdrop_path: item.backdropPath,
    progress: item.progress || 0,
    timeLeft: item.duration && item.timestamp ? formatTimeLeft(item.timestamp, item.duration) : undefined,
    episodeInfo: item.mediaType === "tv" && item.season && item.episode ? `S${item.season}:E${item.episode}` : undefined,
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <HeroSlider items={trending.slice(0, 8)} />

      <div className="relative z-10 px-6 md:px-12 pb-20 space-y-12 -mt-8">
        {/* Continue Watching */}
        {user && cwItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-white text-lg font-bold">Continue Watching</h2>
                <div className="h-px w-8 bg-gradient-to-r from-red-500 to-transparent" />
              </div>
              <motion.button whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }} onClick={() => setEditMode(!editMode)} className={`transition-colors ${editMode ? "text-red-400" : "text-white/30 hover:text-red-400"}`}>
                <Pencil size={16} />
              </motion.button>
            </div>
            <div className="flex gap-4 overflow-x-auto scroll-container pb-2" style={{ scrollbarWidth: "none" }}>
              <AnimatePresence>
                {cwItems.map((item, i) => (
                  <motion.div
                    key={`${item.tmdbId}-${item.mediaType}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="relative flex-shrink-0 w-60 group/cw"
                  >
                    <Link href={item.mediaType === "movie" ? `/movie/${item.tmdbId}` : `/show/${item.tmdbId}`}>
                      <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="relative rounded-xl overflow-hidden bg-[#111] aspect-video border border-transparent hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/10" style={{ transition: "border-color 0.3s, box-shadow 0.3s" }}>
                        {item.backdrop_path ? (
                          <Image src={tmdbImage(item.backdrop_path, "w500")} alt={item.title} fill className="object-cover" sizes="240px" />
                        ) : item.poster_path ? (
                          <Image src={tmdbImage(item.poster_path, "w342")} alt={item.title} fill className="object-cover" sizes="240px" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center"><span className="text-4xl">🎬</span></div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(item.progress, 100)}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-red-500 rounded-full" />
                        </div>
                      </motion.div>
                      <div className="mt-2">
                        <p className="text-white text-xs font-medium truncate group-hover/cw:text-red-400 transition-colors">{item.title}</p>
                        <p className="text-red-400/50 text-xs flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          {item.episodeInfo}{item.timeLeft ? ` • ${item.timeLeft}` : ""}
                        </p>
                      </div>
                    </Link>
                    {editMode && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => removeContinueWatching(item.tmdbId, item.mediaType)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/40 z-10 pulse-red"
                      >
                        <X size={12} />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Browse by Provider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-white text-lg font-bold">Browse by Provider</h2>
            <div className="h-px w-8 bg-gradient-to-r from-red-500 to-transparent" />
          </div>
          <div className="flex gap-5 overflow-x-auto scroll-container pb-2" style={{ scrollbarWidth: "none" }}>
            {providers.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/provider/${p.id}`} className="flex-shrink-0 flex flex-col items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.15, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-16 h-16 rounded-2xl overflow-hidden bg-[#111] relative border border-transparent hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/15"
                    style={{ transition: "border-color 0.3s, box-shadow 0.3s" }}
                  >
                    <Image src={p.logo} alt={p.name} fill className="object-cover" sizes="64px" />
                  </motion.div>
                  <span className="text-white/40 text-xs text-center w-16 leading-tight">{p.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <ContentRow title="Trending This Week" items={trending} titleAction={<Link href="/movies" className="text-red-400/60 text-sm hover:text-red-400 transition-colors red-underline">See all →</Link>} />
        <ContentRow title="Popular Movies" items={popularMovies} mediaType="movie" titleAction={<Link href="/movies" className="text-red-400/60 text-sm hover:text-red-400 transition-colors red-underline">See all →</Link>} />
        <ContentRow title="Popular TV Shows" items={popularTV} mediaType="tv" titleAction={<Link href="/shows" className="text-red-400/60 text-sm hover:text-red-400 transition-colors red-underline">See all →</Link>} />
        <ContentRow title="Top Rated Movies" items={topRatedMovies} mediaType="movie" />
        <ContentRow title="Now Playing" items={nowPlaying} mediaType="movie" />
      </div>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-500/30 z-50 pulse-red"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

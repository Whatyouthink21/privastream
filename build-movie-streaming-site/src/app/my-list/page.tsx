"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { useUser } from "@/components/UserContext";
import AuthModal from "@/components/AuthModal";
import { cn } from "@/lib/utils";

export default function MyListPage() {
  const { user, watchlist, refreshWatchlist } = useUser();
  const [authOpen, setAuthOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  useEffect(() => { if (user) refreshWatchlist(); }, [user]);

  const filtered = filter === "all" ? watchlist : watchlist.filter(w => w.mediaType === filter);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-20">
        <Navbar />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="text-6xl">🔒</motion.div>
          <h1 className="text-2xl font-bold text-white">Sign in to view your list</h1>
          <p className="text-white/40 text-sm">Create an account to save movies and shows</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setAuthOpen(true)} className="px-8 py-3 btn-red rounded-full font-bold">Sign In / Register</motion.button>
        </motion.div>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <Navbar />
      <div className="px-6 md:px-12 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center"><List size={20} className="text-red-400" /></div>
            <h1 className="text-3xl font-black text-white">My List</h1>
            <span className="bg-red-500/10 text-red-400 text-sm px-3 py-1 rounded-full font-bold border border-red-500/20">{watchlist.length}</span>
            <div className="h-px w-8 bg-gradient-to-r from-red-500 to-transparent hidden md:block" />
          </div>
          <div className="flex gap-2">
            {(["all", "movie", "tv"] as const).map(f => (
              <motion.button key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFilter(f)} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all", filter === f ? "btn-red" : "bg-white/5 text-white/50 border border-white/10 hover:text-red-400 hover:border-red-500/30")}>{f === "all" ? "All" : f === "movie" ? "Movies" : "TV Shows"}</motion.button>
            ))}
          </div>
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-5xl">📋</motion.div>
            <p className="text-white/40">{filter === "all" ? "Your list is empty" : `No ${filter === "movie" ? "movies" : "TV shows"} in your list`}</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <MovieCard
                  key={`${item.tmdbId}-${item.mediaType}`}
                  item={{ id: item.tmdbId, title: item.title, name: item.title, poster_path: item.posterPath || undefined, backdrop_path: item.backdropPath || undefined, vote_average: item.rating ? parseFloat(item.rating) : undefined, release_date: item.year || undefined, media_type: item.mediaType }}
                  mediaType={item.mediaType as "movie" | "tv"}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import ContentRow from "@/components/ContentRow";
import MovieCard from "@/components/MovieCard";
import { cn } from "@/lib/utils";

interface Genre { id: number; name: string; }
interface Props { popular: any[]; topRated: any[]; nowPlaying: any[]; upcoming: any[]; genres: Genre[]; }

export default function MoviesClient({ popular, topRated, nowPlaying, upcoming, genres }: Props) {
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const filteredPopular = activeGenre ? popular.filter(m => m.genre_ids?.includes(activeGenre)) : popular;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSlider items={popular.slice(0, 6)} mediaType="movie" />

      <div className="relative z-10 px-6 md:px-12 pb-20 space-y-12 -mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-8"
        >
          <h1 className="text-4xl font-black text-white">Movies</h1>
          <div className="h-px flex-1 bg-gradient-to-r from-red-500/30 to-transparent" />
        </motion.div>

        {/* Genre Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          className="flex gap-2 flex-wrap mb-8"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
            onClick={() => setActiveGenre(null)} 
            className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all", activeGenre === null ? "btn-red" : "bg-white/5 text-white/50 border border-white/10 hover:text-red-400 hover:border-red-500/30")}
          >
            All
          </motion.button>
          {genres.map((g, i) => (
            <motion.button 
              key={g.id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.02 }} 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
              onClick={() => setActiveGenre(activeGenre === g.id ? null : g.id)} 
              className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all", activeGenre === g.id ? "btn-red" : "bg-white/5 text-white/50 border border-white/10 hover:text-red-400 hover:border-red-500/30")}
            >
              {g.name}
            </motion.button>
          ))}
        </motion.div>

        <div className="space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-white text-lg font-bold">
                {activeGenre ? `${genres.find(g => g.id === activeGenre)?.name} Movies` : "Latest Releases"}
              </h2>
              <div className="h-px w-8 bg-gradient-to-r from-red-500 to-transparent" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredPopular.slice(0, 24).map((movie, i) => (
                <MovieCard key={movie.id} item={movie} mediaType="movie" index={i} />
              ))}
            </div>
          </div>
          
          {!activeGenre && (
            <>
              <ContentRow title="Top Rated Movies" items={topRated} mediaType="movie" />
              <ContentRow title="Now Playing" items={nowPlaying} mediaType="movie" />
              <ContentRow title="Coming Soon" items={upcoming} mediaType="movie" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

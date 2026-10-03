"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { cn } from "@/lib/utils";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(query);

  const fetchTrending = useCallback(async () => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=a45420333457411e78d5ad35d6c51a2d`);
      const data = await res.json();
      setTrending(data.results?.slice(0, 10) || []);
    } catch {}
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=a45420333457411e78d5ad35d6c51a2d&query=${encodeURIComponent(q)}&page=1`);
      const data = await res.json();
      setResults(data.results?.filter((r: any) => r.media_type !== "person") || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  useEffect(() => {
    doSearch(query);
    setInputValue(query);
  }, [query, doSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      window.history.pushState(null, "", `/search?q=${encodeURIComponent(inputValue.trim())}`);
      doSearch(inputValue);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] search-bg">
      <div className="wavy-texture" />
      <Navbar />
      
      <div className="relative z-10 px-6 pt-32 pb-20 flex flex-col items-center">
        {/* Search Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 w-full max-w-2xl"
        >
          <h1 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">
            What would you like to watch?
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-red-500 transition-colors">
              <SearchIcon size={20} />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search movies, TV shows & people..."
              className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full py-4 pl-14 pr-6 text-white outline-none focus:border-red-500/50 focus:bg-white/10 transition-all text-lg"
            />
            {inputValue && (
              <button 
                type="button" 
                onClick={() => setInputValue("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </form>

          {/* Suggestions */}
          <div className="flex justify-center gap-2 mt-4">
            {["the 100", "avengers", "stranger things"].map(tag => (
              <button
                key={tag}
                onClick={() => { setInputValue(tag); window.history.pushState(null, "", `/search?q=${encodeURIComponent(tag)}`); doSearch(tag); }}
                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/60 hover:text-white transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results / Trending */}
        <div className="w-full max-w-[1400px] mt-12">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
              >
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] skeleton rounded-2xl" />
                ))}
              </motion.div>
            ) : results.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <h2 className="text-white/60 text-sm font-bold uppercase tracking-widest mb-6 text-center">Results</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {results.map((item, i) => (
                    <MovieCard key={`${item.id}-${item.media_type}`} item={item} index={i} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="trending"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <h2 className="text-white/60 text-sm font-bold uppercase tracking-widest mb-8 text-center">Trending Today</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {trending.map((item, i) => (
                    <MovieCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] search-bg"><Navbar /></div>}>
      <SearchResults />
    </Suspense>
  );
}

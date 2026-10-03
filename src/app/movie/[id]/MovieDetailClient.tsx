"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Download, Star, ChevronLeft, Check, ExternalLink, X, ArrowUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContentRow from "@/components/ContentRow";
import { useUser } from "@/components/UserContext";
import { tmdbImage, formatRuntime, formatDate, getYear, calcEndsAt, formatMoney } from "@/lib/utils";
import { cn } from "@/lib/utils";

const VIDSTUCK_BASE = "https://vidstuck.xyz/embed";
const ZXCRC_BASE = "https://player.zxcrc.com/player";
type Source = "vidstuck" | "zxcrc";

export default function MovieDetailClient({ movie }: { movie: any }) {
  const router = useRouter();
  const { user, toggleWatchlist, isInWatchlist, updateContinueWatching } = useUser();
  const [playing, setPlaying] = useState(false);
  const [source, setSource] = useState<Source>("vidstuck");
  const [expanded, setExpanded] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const inList = isInWatchlist(movie.id, "movie");
  const title = movie.title;
  const year = getYear(movie.release_date);
  const runtime = movie.runtime;
  const rating = movie.vote_average?.toFixed(1);
  const genres = movie.genres?.map((g: any) => g.name) || [];
  const director = movie.credits?.crew?.find((c: any) => c.job === "Director");
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const trailers = movie.videos?.results?.filter((v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")) || [];
  const recommendations = movie.recommendations?.results?.slice(0, 20) || [];
  const certification = movie.release_dates?.results?.find((r: any) => r.iso_3166_1 === "US")?.release_dates?.find((d: any) => d.certification)?.certification;

  const getEmbedUrl = () => source === "vidstuck" ? `${VIDSTUCK_BASE}/movie/${movie.id}?color=e50914&branding=PRIVA&overlay=true` : `${ZXCRC_BASE}/movie/${movie.id}?color=e50914&autoplay=true`;

  useEffect(() => { const s = () => setShowTop(window.scrollY > 500); window.addEventListener("scroll", s, { passive: true }); return () => window.removeEventListener("scroll", s); }, []);

  useEffect(() => {
    if (!playing) return;
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;
      try {
        const data = JSON.parse(event.data);
        if (data.timestamp !== undefined && user) {
          updateContinueWatching({ tmdbId: movie.id, mediaType: "movie", title, posterPath: movie.poster_path, backdropPath: movie.backdrop_path, progress: data.progress || 0, timestamp: data.timestamp || 0, duration: data.duration || 0, season: null, episode: null, year });
        }
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [playing, user, movie, updateContinueWatching, title, year]);

  const handleWatchlist = async () => {
    if (!user) return;
    await toggleWatchlist({ tmdbId: movie.id, mediaType: "movie", title, posterPath: movie.poster_path || null, backdropPath: movie.backdrop_path || null, rating: rating || null, year: year || null });
  };

  const downloadUrls = [
    { name: "VidVault", url: `https://vidvault.to/search/${encodeURIComponent(title)}` },
    { name: "VidSrc Party", url: `https://dl.vidsrc.party/movie/${movie.id}` },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ x: -4 }}
        onClick={() => router.back()}
        className="fixed top-20 left-6 z-40 flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-red-500/20 rounded-full px-4 py-2 text-white/60 hover:text-red-400 hover:border-red-500/40 transition-all text-sm"
      >
        <ChevronLeft size={16} />
        Back
      </motion.button>

      {/* Hero */}
      <div className="relative w-full" style={{ height: "85vh" }}>
        {movie.backdrop_path && (
          <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2 }} className="absolute inset-0">
            <Image src={tmdbImage(movie.backdrop_path, "original")} alt={title} fill className="object-cover object-top" priority sizes="100vw" />
          </motion.div>
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/97 via-black/70 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" style={{ top: "40%" }} />
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Player */}
        <AnimatePresence>
          {playing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-black">
              <div className="relative w-full h-full">
                <iframe ref={iframeRef} src={getEmbedUrl()} className="w-full h-full" frameBorder="0" allowFullScreen allow="encrypted-media; autoplay; fullscreen" />
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setPlaying(false)} className="absolute top-4 right-4 w-10 h-10 bg-black/70 backdrop-blur rounded-full flex items-center justify-center text-white z-30">
                  <X size={18} />
                </motion.button>
                <div className="absolute bottom-4 right-4 flex gap-2 z-30">
                  {(["vidstuck", "zxcrc"] as const).map(s => (
                    <motion.button key={s} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSource(s)} className={cn("px-3 py-1.5 rounded-full text-xs font-bold transition-all", source === s ? "btn-red" : "bg-black/60 text-white border border-white/20")}>{s.toUpperCase()}</motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!playing && (
          <div className="absolute bottom-0 left-0 right-0 flex items-end">
            <div className="px-12 pb-10 flex-1">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 mb-2">
                {genres.slice(0, 3).map((g: string, i: number) => (<span key={g} className="text-red-400/70 text-sm font-medium">{g}{i < 2 && genres[i + 1] && <span className="text-white/20 mx-2">•</span>}</span>))}
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">{title}</motion.h1>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-3 mb-6 flex-wrap">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPlaying(true)} className="flex items-center gap-2 btn-red px-8 py-3.5 rounded-full font-bold text-sm">
                  <Play size={16} fill="white" /> Play
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleWatchlist} className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all border", inList ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30" : "bg-white/5 border-white/15 text-white/60 hover:border-red-500/50 hover:text-red-400")}>
                  {inList ? <Check size={18} /> : <Plus size={18} />}
                </motion.button>

                <div className="relative">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setDownloadOpen(!downloadOpen)} className="w-12 h-12 bg-white/5 border border-white/15 rounded-full flex items-center justify-center text-white/60 hover:border-red-500/50 hover:text-red-400 transition-all">
                    <Download size={18} />
                  </motion.button>
                  <AnimatePresence>
                    {downloadOpen && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-14 left-0 bg-[#111] border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-red-500/10 w-48 z-30">
                        {downloadUrls.map(d => (
                          <a key={d.name} href={d.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors">
                            <Download size={14} className="text-red-400/60" />
                            <span className="text-white text-sm">{d.name}</span>
                            <ExternalLink size={12} className="text-white/20 ml-auto" />
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSource(source === "vidstuck" ? "zxcrc" : "vidstuck")} className="flex items-center gap-2 h-12 px-4 bg-white/5 border border-white/15 rounded-full text-xs hover:border-red-500/50 transition-all">
                  <span className="text-white/30">Server:</span>
                  <span className="text-red-400 font-bold">{source.toUpperCase()}</span>
                </motion.button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-3 text-sm text-white/50 mb-2 flex-wrap">
                <span className="text-white font-semibold">{year}</span>
                {runtime && <span>{formatRuntime(runtime)}</span>}
                {certification && <span className="border border-red-500/30 text-red-400/80 rounded px-1.5 py-0.5 text-xs">{certification}</span>}
                <span className="border border-white/15 rounded px-2 py-0.5 text-xs text-white/40">{source === "vidstuck" ? "Blu-ray" : "WEB-DL"}</span>
                {rating && <span className="flex items-center gap-1"><Star size={13} className="text-red-500" fill="currentColor" /><span className="text-white font-semibold">{rating}</span></span>}
              </motion.div>

              {director && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="text-white/40 text-sm mb-3">Director: <span className="text-red-400/80">{director.name}</span></motion.p>}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="max-w-lg">
                <p className={cn("text-white/50 text-sm leading-relaxed", !expanded && "line-clamp-3")}>{movie.overview}</p>
                {movie.overview?.length > 150 && <button onClick={() => setExpanded(!expanded)} className="text-red-400/60 text-sm mt-1 hover:text-red-400 transition-colors">{expanded ? "Show Less" : "Read More"}</button>}
              </motion.div>
            </div>

            <div className="w-72 px-8 pb-10 text-right hidden lg:block">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-3 bg-white/3 backdrop-blur rounded-2xl p-5 border border-white/5">
                {runtime && <div><p className="text-white/30 text-xs">Runtime</p><p className="text-white text-sm"><span className="text-red-400">{formatRuntime(runtime)}</span> • Ends {calcEndsAt(runtime)}</p></div>}
                <div><p className="text-white/30 text-xs">Language</p><p className="text-white text-sm uppercase">{movie.original_language}</p></div>
                {movie.release_date && <div><p className="text-white/30 text-xs">Release Date</p><p className="text-red-400/80 text-sm">{formatDate(movie.release_date)}</p></div>}
                {movie.revenue > 0 && <div><p className="text-white/30 text-xs">Revenue</p><p className="text-white text-sm">{formatMoney(movie.revenue)}</p></div>}
                <div className="flex flex-wrap gap-2 justify-end mt-2">
                  {movie.production_companies?.slice(0, 3).map((c: any) => c.logo_path ? <div key={c.id} className="relative h-6 w-16"><Image src={tmdbImage(c.logo_path, "w92")} alt={c.name} fill className="object-contain invert opacity-40" sizes="64px" /></div> : null)}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Below fold */}
      <div className="px-6 md:px-12 py-10 space-y-14">
        {/* Cast */}
        {cast.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-6"><h2 className="text-white text-xl font-bold">Cast</h2><div className="h-px w-8 bg-gradient-to-r from-red-500 to-transparent" /></div>
            <div className="flex gap-6 overflow-x-auto scroll-container pb-4" style={{ scrollbarWidth: "none" }}>
              {cast.map((actor: any, i: number) => (
                <motion.div key={actor.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }} className="flex-shrink-0 flex flex-col items-center gap-2 w-24">
                  <motion.div whileHover={{ scale: 1.1, borderColor: "rgba(229,9,20,0.6)" }} className="cast-circle">
                    {actor.profile_path ? <Image src={tmdbImage(actor.profile_path, "w185")} alt={actor.name} width={100} height={100} className="object-cover w-full h-full" /> : <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-2xl">👤</div>}
                  </motion.div>
                  <div className="text-center"><p className="text-white text-xs font-medium leading-tight">{actor.name}</p><p className="text-red-400/50 text-xs leading-tight mt-0.5">{actor.character}</p></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Trailers */}
        {trailers.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-6"><h2 className="text-white text-xl font-bold">Trailers</h2><div className="h-px w-8 bg-gradient-to-r from-red-500 to-transparent" /></div>
            <div className="flex gap-4 overflow-x-auto scroll-container pb-2" style={{ scrollbarWidth: "none" }}>
              {trailers.slice(0, 6).map((trailer: any, i: number) => (
                <motion.a key={trailer.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.03, y: -4 }} href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer" className="relative flex-shrink-0 w-64 rounded-xl overflow-hidden bg-[#111] group border border-transparent hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10" style={{ transition: "border-color 0.3s, box-shadow 0.3s" }}>
                  <div className="relative aspect-video">
                    <Image src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`} alt={trailer.name} fill className="object-cover" sizes="256px" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <motion.div whileHover={{ scale: 1.2 }} className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-500/30">
                        <Play size={16} className="text-white ml-0.5" fill="white" />
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-3"><p className="text-white text-xs font-medium">{trailer.name}</p><p className="text-red-400/50 text-xs">{trailer.type}</p></div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {recommendations.length > 0 && <ContentRow title="More Like This" items={recommendations} mediaType="movie" />}
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-8 right-8 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-500/30 z-50 pulse-red">
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

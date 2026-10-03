"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

interface ContentRowProps {
  title: string;
  items: any[];
  mediaType?: "movie" | "tv";
  showProgress?: boolean;
  titleExtra?: React.ReactNode;
  titleAction?: React.ReactNode;
}

export default function ContentRow({ title, items, mediaType, showProgress, titleExtra, titleAction }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 500 : -500, behavior: "smooth" });
  };

  if (!items || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative group/row"
    >
      <div className="flex items-center justify-between mb-4 px-0">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-lg font-bold">{title}</h2>
          <div className="h-px w-8 bg-gradient-to-r from-red-500 to-transparent" />
          {titleExtra}
        </div>
        {titleAction}
      </div>

      <div className="relative">
        {/* Scroll Left */}
        <motion.button
          whileHover={{ scale: 1.15, x: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-red-600/90 backdrop-blur border border-red-500/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 shadow-lg shadow-red-500/20 hover:bg-red-500"
        >
          <ChevronLeft size={18} />
        </motion.button>

        {/* Scroll Right */}
        <motion.button
          whileHover={{ scale: 1.15, x: 2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-red-600/90 backdrop-blur border border-red-500/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 shadow-lg shadow-red-500/20 hover:bg-red-500"
        >
          <ChevronRight size={18} />
        </motion.button>

        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scroll-container pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {items.map((item, i) => (
            <MovieCard
              key={`${item.id}-${i}`}
              item={item}
              mediaType={mediaType || item.media_type}
              showProgress={showProgress}
              progressValue={item.progress || 0}
              timeLeft={item.timeLeft}
              episodeInfo={item.episodeInfo}
              index={i}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

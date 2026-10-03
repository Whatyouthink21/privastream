"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ContentRow from "@/components/ContentRow";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Provider { id: number; name: string; logo: string; }
interface Props { provider: Provider; movies: any[]; shows: any[]; }

export default function ProviderClient({ provider, movies, shows }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <Navbar />
      <div className="px-6 md:px-12 py-8">
        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: -4 }} onClick={() => router.back()} className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors mb-6 text-sm">
          <ChevronLeft size={16} /> Back
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-10">
          <motion.div whileHover={{ scale: 1.1, rotate: 3 }} className="w-16 h-16 rounded-2xl overflow-hidden relative border border-red-500/20 shadow-lg shadow-red-500/10">
            <Image src={provider.logo} alt={provider.name} fill className="object-cover" sizes="64px" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-black text-white">{provider.name}</h1>
            <p className="text-red-400/50 text-sm mt-1">Browse available content</p>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-red-500/30 to-transparent" />
        </motion.div>

        <div className="space-y-10">
          {movies.length > 0 && <ContentRow title="Movies" items={movies} mediaType="movie" />}
          {shows.length > 0 && <ContentRow title="TV Shows" items={shows} mediaType="tv" />}
        </div>
      </div>
    </div>
  );
}

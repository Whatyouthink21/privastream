"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Settings, Home, Film, Tv, List, X } from "lucide-react";
import { useUser } from "./UserContext";
import AuthModal from "./AuthModal";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useUser();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/movies", label: "Movies", icon: Film },
    { href: "/shows", label: "Shows", icon: Tv },
    { href: "/my-list", label: "My List", icon: List },
  ];

  const getIcon = (label: string) => {
    if (label === "Movies") return <Film size={16} className="text-black" />;
    if (label === "Shows") return <Tv size={16} className="text-black" />;
    return null;
  };

  const getActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-500",
          scrolled ? "bg-black/90 backdrop-blur-xl shadow-lg shadow-red-500/5" : "bg-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30"
          >
            <span className="text-white font-black text-lg">P</span>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white font-bold text-sm hidden sm:block"
          >
            PRIVA
          </motion.span>
        </Link>

        {/* Nav Links - Center */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-1 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1.5"
        >
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                getActive(href)
                  ? "text-white"
                  : "text-white/50 hover:text-white"
              )}
            >
              {getActive(href) && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg shadow-red-500/30"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {getActive(href) && (label === "Movies" || label === "Shows") && (
                  <span className="mr-1">{getIcon(label)}</span>
                )}
                {getActive(href) && label !== "Movies" && label !== "Shows" && <Icon size={14} />}
                {label}
              </span>
            </Link>
          ))}
        </motion.div>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.form
                key="search-form"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                onSubmit={handleSearch}
                className="flex items-center bg-black/70 backdrop-blur-xl border border-red-500/30 rounded-full px-4 py-2 gap-2 overflow-hidden"
              >
                <Search size={16} className="text-red-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search movies, shows..."
                  className="bg-transparent outline-none text-white text-sm w-48 placeholder:text-white/30"
                />
                <motion.button
                  whileHover={{ rotate: 90 }}
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-white/40 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </motion.form>
            ) : (
              <motion.button
                key="search-btn"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-red-400 hover:border-red-500/40 transition-all"
              >
                <Search size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 45 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-red-400 hover:border-red-500/40 transition-all"
            >
              <Settings size={18} />
            </motion.button>

            <AnimatePresence>
              {settingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-12 w-56 bg-[#111] border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-red-500/10"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs text-white/40">Signed in as</p>
                        <p className="text-sm font-mono font-bold text-red-400 mt-0.5">{user.accountNumber}</p>
                      </div>
                      <button
                        onClick={() => { signOut(); setSettingsOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs text-white/40">Not signed in</p>
                      </div>
                      <button
                        onClick={() => { setAuthOpen(true); setSettingsOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-red-500/10 transition-colors"
                      >
                        Sign In / Register
                      </button>
                    </>
                  )}
                  <div className="px-4 py-3 border-t border-white/10">
                    <p className="text-xs text-red-400/40">Priva Movies v1.0</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth button */}
          {!user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAuthOpen(true)}
              className="px-5 py-2 btn-red rounded-full text-sm font-bold"
            >
              Sign In
            </motion.button>
          )}
        </div>
      </motion.nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

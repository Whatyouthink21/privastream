"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  id: string;
  accountNumber: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  tmdbId: number;
  mediaType: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  rating: string | null;
  year: string | null;
  addedAt: string;
}

export interface ContinueWatchingItem {
  id: string;
  userId: string;
  tmdbId: number;
  mediaType: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  progress: number | null;
  timestamp: number | null;
  duration: number | null;
  season: number | null;
  episode: number | null;
  year: string | null;
  updatedAt: string;
}

interface UserContextType {
  user: User | null;
  watchlist: WatchlistItem[];
  continueWatching: ContinueWatchingItem[];
  signIn: (accountNumber: string) => Promise<boolean>;
  register: () => Promise<string | null>;
  signOut: () => void;
  toggleWatchlist: (item: Omit<WatchlistItem, "id" | "userId" | "addedAt">) => Promise<void>;
  isInWatchlist: (tmdbId: number, mediaType: string) => boolean;
  updateContinueWatching: (item: Omit<ContinueWatchingItem, "id" | "userId" | "updatedAt">) => Promise<void>;
  removeContinueWatching: (tmdbId: number, mediaType: string) => Promise<void>;
  refreshWatchlist: () => Promise<void>;
  refreshContinueWatching: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("priva_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
      } catch {}
    }
  }, []);

  const refreshWatchlist = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/watchlist?userId=${user.id}`);
      const data = await res.json();
      setWatchlist(data.items || []);
    } catch {}
  }, [user]);

  const refreshContinueWatching = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/continue-watching?userId=${user.id}`);
      const data = await res.json();
      setContinueWatching(data.items || []);
    } catch {}
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshWatchlist();
      refreshContinueWatching();
    } else {
      setWatchlist([]);
      setContinueWatching([]);
    }
  }, [user, refreshWatchlist, refreshContinueWatching]);

  const signIn = async (accountNumber: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber }),
      });
      const data = await res.json();
      if (data.success) {
        const u = data.user;
        setUser(u);
        localStorage.setItem("priva_user", JSON.stringify(u));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const register = async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/auth/register", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        const u = { id: data.id, accountNumber: data.accountNumber };
        setUser(u);
        localStorage.setItem("priva_user", JSON.stringify(u));
        return data.accountNumber;
      }
      return null;
    } catch {
      return null;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("priva_user");
    setWatchlist([]);
    setContinueWatching([]);
  };

  const toggleWatchlist = async (item: Omit<WatchlistItem, "id" | "userId" | "addedAt">) => {
    if (!user) return;
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...item }),
      });
      const data = await res.json();
      if (data.action === "removed") {
        setWatchlist(prev => prev.filter(w => !(w.tmdbId === item.tmdbId && w.mediaType === item.mediaType)));
      } else if (data.action === "added") {
        await refreshWatchlist();
      }
    } catch {}
  };

  const isInWatchlist = (tmdbId: number, mediaType: string): boolean => {
    return watchlist.some(w => w.tmdbId === tmdbId && w.mediaType === mediaType);
  };

  const updateContinueWatching = async (item: Omit<ContinueWatchingItem, "id" | "userId" | "updatedAt">) => {
    if (!user) return;
    try {
      await fetch("/api/continue-watching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...item }),
      });
      await refreshContinueWatching();
    } catch {}
  };

  const removeContinueWatching = async (tmdbId: number, mediaType: string) => {
    if (!user) return;
    try {
      await fetch("/api/continue-watching", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, tmdbId, mediaType }),
      });
      setContinueWatching(prev => prev.filter(c => !(c.tmdbId === tmdbId && c.mediaType === mediaType)));
    } catch {}
  };

  return (
    <UserContext.Provider value={{
      user, watchlist, continueWatching,
      signIn, register, signOut,
      toggleWatchlist, isInWatchlist,
      updateContinueWatching, removeContinueWatching,
      refreshWatchlist, refreshContinueWatching,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

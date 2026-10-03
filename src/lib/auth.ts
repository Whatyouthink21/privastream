"use server";

import { db } from "@/db";
import { users, watchlist, continueWatching } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateId, generateAccountNumber } from "./utils";

export async function createAccount() {
  const accountNumber = generateAccountNumber();
  const id = generateId();
  await db.insert(users).values({ id, accountNumber });
  return { id, accountNumber };
}

export async function signIn(accountNumber: string) {
  const user = await db.select().from(users).where(eq(users.accountNumber, accountNumber)).limit(1);
  if (user.length === 0) return null;
  return user[0];
}

export async function getWatchlist(userId: string) {
  return db.select().from(watchlist).where(eq(watchlist.userId, userId)).orderBy(watchlist.addedAt);
}

export async function addToWatchlist(userId: string, item: {
  tmdbId: number;
  mediaType: string;
  title: string;
  posterPath?: string;
  backdropPath?: string;
  rating?: string;
  year?: string;
}) {
  const existing = await db.select().from(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.tmdbId, item.tmdbId), eq(watchlist.mediaType, item.mediaType)))
    .limit(1);
  if (existing.length > 0) return existing[0];
  const id = generateId();
  const result = await db.insert(watchlist).values({ id, userId, ...item }).returning();
  return result[0];
}

export async function removeFromWatchlist(userId: string, tmdbId: number, mediaType: string) {
  await db.delete(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.tmdbId, tmdbId), eq(watchlist.mediaType, mediaType)));
}

export async function isInWatchlist(userId: string, tmdbId: number, mediaType: string) {
  const result = await db.select().from(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.tmdbId, tmdbId), eq(watchlist.mediaType, mediaType)))
    .limit(1);
  return result.length > 0;
}

export async function getContinueWatching(userId: string) {
  return db.select().from(continueWatching)
    .where(eq(continueWatching.userId, userId))
    .orderBy(continueWatching.updatedAt);
}

export async function upsertContinueWatching(userId: string, item: {
  tmdbId: number;
  mediaType: string;
  title: string;
  posterPath?: string;
  backdropPath?: string;
  progress?: number;
  timestamp?: number;
  duration?: number;
  season?: number;
  episode?: number;
  year?: string;
}) {
  const existing = await db.select().from(continueWatching)
    .where(and(eq(continueWatching.userId, userId), eq(continueWatching.tmdbId, item.tmdbId), eq(continueWatching.mediaType, item.mediaType)))
    .limit(1);

  if (existing.length > 0) {
    await db.update(continueWatching)
      .set({
        progress: item.progress,
        timestamp: item.timestamp,
        duration: item.duration,
        season: item.season,
        episode: item.episode,
        updatedAt: new Date(),
      })
      .where(eq(continueWatching.id, existing[0].id));
    return existing[0];
  }

  const id = generateId();
  const result = await db.insert(continueWatching).values({
    id,
    userId,
    tmdbId: item.tmdbId,
    mediaType: item.mediaType,
    title: item.title,
    posterPath: item.posterPath,
    backdropPath: item.backdropPath,
    progress: item.progress ?? 0,
    timestamp: item.timestamp ?? 0,
    duration: item.duration ?? 0,
    season: item.season,
    episode: item.episode,
    year: item.year,
  }).returning();
  return result[0];
}

export async function removeContinueWatching(userId: string, tmdbId: number, mediaType: string) {
  await db.delete(continueWatching)
    .where(and(eq(continueWatching.userId, userId), eq(continueWatching.tmdbId, tmdbId), eq(continueWatching.mediaType, mediaType)));
}

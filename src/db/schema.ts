import { pgTable, text, integer, timestamp, boolean, jsonb, bigint } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // 8-digit number as string
  accountNumber: text("account_number").notNull().unique(), // 8-digit login
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchlist = pgTable("watchlist", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull(), // 'movie' | 'tv'
  title: text("title").notNull(),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  rating: text("rating"),
  year: text("year"),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const continueWatching = pgTable("continue_watching", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  tmdbId: integer("tmdb_id").notNull(),
  mediaType: text("media_type").notNull(), // 'movie' | 'tv'
  title: text("title").notNull(),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  progress: integer("progress").default(0), // percentage
  timestamp: integer("timestamp_seconds").default(0), // seconds
  duration: integer("duration_seconds").default(0),
  season: integer("season"),
  episode: integer("episode"),
  year: text("year"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

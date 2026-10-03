import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { continueWatching } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const items = await db.select().from(continueWatching)
    .where(eq(continueWatching.userId, userId))
    .orderBy(continueWatching.updatedAt);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, tmdbId, mediaType, title, posterPath, backdropPath, progress, timestamp, duration, season, episode, year } = body;
    if (!userId || !tmdbId || !mediaType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const existing = await db.select().from(continueWatching)
      .where(and(eq(continueWatching.userId, userId), eq(continueWatching.tmdbId, tmdbId), eq(continueWatching.mediaType, mediaType)))
      .limit(1);
    if (existing.length > 0) {
      await db.update(continueWatching)
        .set({ progress, timestamp, duration, season, episode, updatedAt: new Date() })
        .where(eq(continueWatching.id, existing[0].id));
      return NextResponse.json({ success: true, action: "updated" });
    }
    const id = generateId();
    await db.insert(continueWatching).values({ id, userId, tmdbId, mediaType, title, posterPath, backdropPath, progress: progress ?? 0, timestamp: timestamp ?? 0, duration: duration ?? 0, season, episode, year });
    return NextResponse.json({ success: true, action: "created" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, tmdbId, mediaType } = body;
    await db.delete(continueWatching)
      .where(and(eq(continueWatching.userId, userId), eq(continueWatching.tmdbId, tmdbId), eq(continueWatching.mediaType, mediaType)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

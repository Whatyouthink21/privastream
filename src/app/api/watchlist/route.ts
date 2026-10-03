import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { watchlist } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const items = await db.select().from(watchlist).where(eq(watchlist.userId, userId)).orderBy(watchlist.addedAt);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, tmdbId, mediaType, title, posterPath, backdropPath, rating, year } = body;
    if (!userId || !tmdbId || !mediaType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const existing = await db.select().from(watchlist)
      .where(and(eq(watchlist.userId, userId), eq(watchlist.tmdbId, tmdbId), eq(watchlist.mediaType, mediaType)))
      .limit(1);
    if (existing.length > 0) {
      await db.delete(watchlist).where(eq(watchlist.id, existing[0].id));
      return NextResponse.json({ action: "removed" });
    }
    const id = generateId();
    await db.insert(watchlist).values({ id, userId, tmdbId, mediaType, title, posterPath, backdropPath, rating, year });
    return NextResponse.json({ action: "added" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, tmdbId, mediaType } = body;
    await db.delete(watchlist)
      .where(and(eq(watchlist.userId, userId), eq(watchlist.tmdbId, tmdbId), eq(watchlist.mediaType, mediaType)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

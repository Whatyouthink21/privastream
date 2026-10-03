import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { accountNumber } = await req.json();
    if (!accountNumber) {
      return NextResponse.json({ success: false, error: "Account number required" }, { status: 400 });
    }
    const user = await db.select().from(users).where(eq(users.accountNumber, accountNumber)).limit(1);
    if (user.length === 0) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, user: user[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

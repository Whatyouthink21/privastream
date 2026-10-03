import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { generateId, generateAccountNumber } from "@/lib/utils";

export async function POST() {
  try {
    const accountNumber = generateAccountNumber();
    const id = generateId();
    await db.insert(users).values({ id, accountNumber });
    return NextResponse.json({ success: true, accountNumber, id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create account" }, { status: 500 });
  }
}

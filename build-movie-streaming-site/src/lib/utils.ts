import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRuntime(minutes: number): string {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function formatMoney(amount: number): string {
  if (!amount) return "N/A";
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `$${amount.toLocaleString()}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function getYear(dateStr: string): string {
  if (!dateStr) return "";
  return dateStr.split("-")[0];
}

export function generateAccountNumber(): string {
  // Generate 8-digit number
  const num = Math.floor(10000000 + Math.random() * 90000000);
  return num.toString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function tmdbImage(path: string | null, size = "w500"): string {
  if (!path) return "/placeholder.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function calcEndsAt(runtimeMinutes: number): string {
  const now = new Date();
  const ends = new Date(now.getTime() + runtimeMinutes * 60 * 1000);
  return ends.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatTimeLeft(seconds: number, totalSeconds: number): string {
  const left = totalSeconds - seconds;
  if (left <= 0) return "Finished";
  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  if (h > 0) return `${h}hr ${m}m left`;
  return `${m}m left`;
}

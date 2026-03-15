import { ConvexHttpClient } from "convex/browser";
import { ConvexReactClient } from "convex/react";

/**
 * Convex URL dari deployment Anda.
 * Ganti dengan URL yang ada di file .env.local atau .env (CONVEX_URL)
 */
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL || "https://happy-eagle-123.convex.cloud";

console.log("[Convex] Connecting to:", CONVEX_URL);
if (CONVEX_URL.includes("happy-eagle-123")) {
  console.warn("[Convex] WARNING: Using fallback URL. Please set EXPO_PUBLIC_CONVEX_URL in .env.local");
}

export const convexClient = new ConvexReactClient(CONVEX_URL);
export const convexHttp = new ConvexHttpClient(CONVEX_URL);

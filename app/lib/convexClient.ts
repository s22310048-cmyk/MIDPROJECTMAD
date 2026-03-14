import { ConvexHttpClient } from "convex/browser";
import { ConvexReactClient } from "convex/react";

/**
 * Convex URL dari deployment Anda.
 * Ganti dengan URL yang ada di file .env.local atau .env (CONVEX_URL)
 */
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL || "https://happy-eagle-123.convex.cloud";

export const convexClient = new ConvexReactClient(CONVEX_URL);
export const convexHttp = new ConvexHttpClient(CONVEX_URL);

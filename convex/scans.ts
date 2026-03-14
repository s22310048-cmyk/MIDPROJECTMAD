import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 🔍 SCAN ID - QUERIES
export const getRecentScans = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx: any, args: any) => {
    const limit = args.limit ?? 20;
    const scans = await ctx.db.query("scanLogs").order("desc").take(limit);

    return await Promise.all(
      scans.map(async (scan: any) => {
        const user = scan.userId ? await ctx.db.get(scan.userId) : null;
        return { ...scan, user };
      })
    );
  },
});

// 🔍 SCAN ID - MUTATIONS
export const processIdScan = mutation({
  args: {
    cardId: v.string(),
    scanType: v.union(v.literal("borrow"), v.literal("return"), v.literal("identify"), v.literal("attendance")),
    processedBy: v.optional(v.id("users")), // Admin ID
  },
  handler: async (ctx: any, args: any) => {
    const now = Date.now();
    
    // 1. Cari user berdasarkan ID kartu
    const user = await ctx.db
      .query("users")
      .withIndex("by_cardId", (q: any) => q.eq("cardId", args.cardId))
      .first();

    let scanResult: "success" | "not_found" | "inactive" | "error" = "success";
    let resultMessage = "Scan berhasil.";
    let userId = user?._id;

    if (!user) {
      scanResult = "not_found";
      resultMessage = `Kartu dengan ID "${args.cardId}" tidak terdaftar.`;
    } else if (!user.isActive) {
      scanResult = "inactive";
      resultMessage = `Anggota "${user.name}" tidak aktif. Silakan hubungi petugas admin.`;
    } else {
        resultMessage = `Identitas anggota ditemukan: ${user.name}.`;
    }

    // 2. Log hasil scan
    const scanLogId = await ctx.db.insert("scanLogs", {
      cardId: args.cardId,
      userId,
      scanType: args.scanType,
      scanResult,
      resultMessage,
      scannedAt: now,
      scannedBy: args.processedBy,
    });

    return {
      scanLogId,
      user,
      scanResult,
      resultMessage,
    };
  },
});

export const registerCard = mutation({
  args: {
    userId: v.id("users"),
    cardId: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User tidak ditemukan.");

    // Cek apakah kartu sudah dipakai user lain
    const existing = await ctx.db
      .query("users")
      .withIndex("by_cardId", (q: any) => q.eq("cardId", args.cardId))
      .first();

    if (existing && existing._id !== args.userId) {
      throw new Error("Kartu ID ini sudah terdaftar oleh anggota lain.");
    }

    await ctx.db.patch(args.userId, {
      cardId: args.cardId,
      updatedAt: Date.now(),
    });

    return { success: true, message: `Kartu ID berhasil didaftarkan untuk ${user.name}` };
  },
});

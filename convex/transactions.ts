import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ══════════════════════════════════════════════════════════════════════════
// 🧾 TRANSACTIONS - QUERIES
// ══════════════════════════════════════════════════════════════════════════

export const getTransactions = query({
  args: {
    filterType: v.optional(v.string()), // "all", "borrow", "return", "fine_payment"
    searchQuery: v.optional(v.string()), // mencari berdasarkan nama user atau judul buku
  },
  handler: async (ctx, args) => {
    let transactions;
    if (args.filterType && args.filterType !== "all") {
      transactions = await ctx.db
        .query("transactions")
        .withIndex("by_type", (q) => q.eq("transaction_type", args.filterType as any))
        .order("desc")
        .collect();
    } else {
      transactions = await ctx.db.query("transactions").order("desc").collect();
    }

    // Fetch related users and books
    let enrichedTransactions = await Promise.all(
      transactions.map(async (t) => {
        const user = await ctx.db.get(t.userId);
        const book = t.bookId ? await ctx.db.get(t.bookId) : null;
        return {
          ...t,
          user_name: user?.name || "Unknown User",
          book_title: book?.title || null,
        };
      })
    );

    // Terapkan Filter Pencarian Teks
    if (args.searchQuery) {
      const searchLower = args.searchQuery.toLowerCase();
      enrichedTransactions = enrichedTransactions.filter(
        (t) =>
          t.user_name.toLowerCase().includes(searchLower) ||
          (t.book_title && t.book_title.toLowerCase().includes(searchLower))
      );
    }

    return enrichedTransactions;
  },
});

// ══════════════════════════════════════════════════════════════════════════
// 🧾 TRANSACTIONS - MUTATIONS
// ══════════════════════════════════════════════════════════════════════════

export const createTransaction = mutation({
  args: {
    userId: v.id("users"),
    bookId: v.optional(v.id("books")),
    transaction_type: v.union(v.literal("borrow"), v.literal("return"), v.literal("fine_payment")),
    transaction_date: v.optional(v.number()),
    fine_amount: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const newTransactionId = await ctx.db.insert("transactions", {
      userId: args.userId,
      bookId: args.bookId,
      transaction_type: args.transaction_type,
      transaction_date: args.transaction_date ?? now,
      fine_amount: args.fine_amount ?? 0,
      status: args.status ?? "completed",
      createdAt: now,
    });
    
    return newTransactionId;
  },
});

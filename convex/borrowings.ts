import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const borrowBook = mutation({
  args: {
    userId: v.id("users"),
    bookId: v.id("books"),
  },
  handler: async (ctx: any, args: any) => {
    const book = await ctx.db.get(args.bookId);
    if (!book) throw new Error("Buku tidak ditemukan");
    if (book.availableCopies <= 0) throw new Error("Stok buku habis");

    const now = Date.now();
    const dueDate = now + 7 * 24 * 60 * 60 * 1000;

    const borrowingId = await ctx.db.insert("borrowings", {
      userId: args.userId,
      bookId: args.bookId,
      borrowDate: now,
      dueDate,
      status: "borrowed",
    });

    await ctx.db.patch(args.bookId, {
      availableCopies: book.availableCopies - 1,
    });

    return borrowingId;
  },
});

export const getActiveByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx: any, args: any) => {
    const borrowings = await ctx.db
      .query("borrowings")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .filter((q: any) => q.eq(q.field("status"), "borrowed"))
      .collect();

    return await Promise.all(
      borrowings.map(async (b: any) => {
        const book = await ctx.db.get(b.bookId);
        const now = Date.now();
        const daysRemaining = Math.ceil((b.dueDate - now) / (1000 * 60 * 60 * 24));
        const isOverdue = now > b.dueDate;
        const estimatedFine = isOverdue ? Math.abs(daysRemaining) * 1000 : 0;

        return { ...b, book, daysRemaining, isOverdue, estimatedFine };
      })
    );
  },
});

export const getRecentHistory = query({
  args: { userId: v.id("users"), limit: v.number() },
  handler: async (ctx: any, args: any) => {
    const borrowings = await ctx.db
      .query("borrowings")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit);

    return await Promise.all(
      borrowings.map(async (b: any) => {
        const book = await ctx.db.get(b.bookId);
        // Find return record if exists
        const returnRec = await ctx.db
            .query("returns")
            .withIndex("by_borrowingId", (q: any) => q.eq("borrowingId", b._id))
            .first();
        
        return { ...b, book, returnDate: returnRec?.returnDate };
      })
    );
  },
});

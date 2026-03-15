import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllBooks = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("books").collect();
  },
});

export const addBook = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    category: v.string(),
    isbn: v.string(),
    totalCopies: v.number(),
    coverImage: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("books", {
      ...args,
      availableCopies: args.totalCopies,
    });
  },
});

export const updateBook = mutation({
  args: {
    bookId: v.id("books"),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    category: v.optional(v.string()),
    isbn: v.optional(v.string()),
    totalCopies: v.optional(v.number()),
    coverImage: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const { bookId, ...updates } = args;
    const book = await ctx.db.get(bookId);
    if (!book) throw new Error("Buku tidak ditemukan");

    if (updates.totalCopies !== undefined) {
      const borrowedCount = book.totalCopies - book.availableCopies;
      updates.availableCopies = updates.totalCopies - borrowedCount;
      if (updates.availableCopies < 0) throw new Error("Total eksemplar tidak boleh kurang dari buku yang sedang dipinjam");
    }

    await ctx.db.patch(bookId, updates);
  },
});

export const deleteBook = mutation({
  args: { bookId: v.id("books") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.bookId);
  },
});

export const getTopBooks = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx: any, args: any) => {
    const limit = args.limit ?? 5;
    return await ctx.db
      .query("books")
      .order("desc")
      .take(limit);
  },
});

export const getPopularBooks = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx: any, args: any) => {
    const limit = args.limit ?? 5;
    return await ctx.db
      .query("books")
      .order("desc")
      .take(limit);
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 📚 KELOLA BUKU - QUERIES
export const getAllBooks = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db
      .query("books")
      .withIndex("by_isActive", (q: any) => q.eq("isActive", true))
      .collect();
  },
});

export const getBookById = query({
  args: { bookId: v.id("books") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.get(args.bookId);
  },
});

export const getBookByIsbn = query({
  args: { isbn: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("books")
      .withIndex("by_isbn", (q: any) => q.eq("isbn", args.isbn))
      .first();
  },
});

export const searchBooks = query({
  args: {
    searchTerm: v.string(),
    genre: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    let searchQuery = ctx.db
      .query("books")
      .withSearchIndex("search_books", (q: any) => {
        let search = q.search("title", args.searchTerm);
        if (args.genre) {
          search = search.eq("genre", args.genre);
        }
        return search.eq("isActive", true);
      });

    return await searchQuery.collect();
  },
});

export const getBooksByGenre = query({
  args: { genre: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("books")
      .withIndex("by_genre", (q: any) => q.eq("genre", args.genre))
      .collect();
  },
});

export const getPopularBooks = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx: any, args: any) => {
    const limit = args.limit ?? 10;
    const books = await ctx.db
      .query("books")
      .withIndex("by_isActive", (q: any) => q.eq("isActive", true))
      .collect();

    return books
      .filter((b: any) => (b.rating ?? 0) > 0)
      .sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, limit);
  },
});

export const getBookStats = query({
  args: {},
  handler: async (ctx: any) => {
    const allBooks = await ctx.db
      .query("books")
      .withIndex("by_isActive", (q: any) => q.eq("isActive", true))
      .collect();

    const totalBooks = allBooks.length;
    const totalCopies = allBooks.reduce((sum: number, b: any) => sum + b.totalCopies, 0);
    const availableCopies = allBooks.reduce((sum: number, b: any) => sum + b.availableCopies, 0);
    const borrowedCopies = totalCopies - availableCopies;

    const genreCount: Record<string, number> = {};
    allBooks.forEach((b: any) => {
      genreCount[b.genre] = (genreCount[b.genre] ?? 0) + 1;
    });

    return {
      totalBooks,
      totalCopies,
      availableCopies,
      borrowedCopies,
      genreDistribution: genreCount,
    };
  },
});

// 📚 KELOLA BUKU - MUTATIONS
export const addBook = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    isbn: v.string(),
    genre: v.string(),
    description: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    publisher: v.optional(v.string()),
    publishYear: v.optional(v.number()),
    totalCopies: v.number(),
    rating: v.optional(v.number()),
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("books")
      .withIndex("by_isbn", (q: any) => q.eq("isbn", args.isbn))
      .first();

    if (existing) {
      throw new Error(`Buku dengan ISBN ${args.isbn} sudah ada.`);
    }

    const now = Date.now();
    return await ctx.db.insert("books", {
      ...args,
      availableCopies: args.totalCopies,
      rating: args.rating ?? 0,
      totalRatings: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateBook = mutation({
  args: {
    bookId: v.id("books"),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    genre: v.optional(v.string()),
    description: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    publisher: v.optional(v.string()),
    publishYear: v.optional(v.number()),
    totalCopies: v.optional(v.number()),
  },
  handler: async (ctx: any, args: any) => {
    const book = await ctx.db.get(args.bookId);
    if (!book) throw new Error("Buku tidak ditemukan.");

    const updates: any = { updatedAt: Date.now() };
    Object.keys(args).forEach(key => {
        if (key !== "bookId" && args[key] !== undefined) {
            updates[key] = args[key];
        }
    });

    if (args.totalCopies !== undefined) {
      const borrowedCopies = book.totalCopies - book.availableCopies;
      if (args.totalCopies < borrowedCopies) {
        throw new Error("Stok tidak bisa kurang dari peminjaman aktif.");
      }
      updates.availableCopies = args.totalCopies - borrowedCopies;
    }

    await ctx.db.patch(args.bookId, updates);
    return args.bookId;
  },
});

export const deactivateBook = mutation({
  args: { bookId: v.id("books") },
  handler: async (ctx: any, args: any) => {
    const book = await ctx.db.get(args.bookId);
    if (!book) throw new Error("Buku tidak ditemukan.");

    const activeBorrowings = await ctx.db
      .query("borrowings")
      .withIndex("by_bookId", (q: any) => q.eq("bookId", args.bookId))
      .filter((q: any) => q.or(q.eq(q.field("status"), "active"), q.eq(q.field("status"), "overdue")))
      .collect();

    if (activeBorrowings.length > 0) {
      throw new Error("Masih ada peminjaman aktif.");
    }

    await ctx.db.patch(args.bookId, { isActive: false, updatedAt: Date.now() });
    return args.bookId;
  },
});

export const reactivateBook = mutation({
  args: { bookId: v.id("books") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.bookId, { isActive: true, updatedAt: Date.now() });
    return args.bookId;
  },
});

export const deleteBook = mutation({
  args: { bookId: v.id("books") },
  handler: async (ctx: any, args: any) => {
    const borrowings = await ctx.db
      .query("borrowings")
      .withIndex("by_bookId", (q: any) => q.eq("bookId", args.bookId))
      .first();

    if (borrowings) throw new Error("Buku sudah pernah dipinjam.");
    await ctx.db.delete(args.bookId);
    return { success: true };
  },
});

import { v } from "convex/values";
import { query } from "./_generated/server";

export const getCatalog = query({
  args: {},
  handler: async (ctx: any) => {
    const books = await ctx.db.query("books").collect();
    // Return only requested fields for listing
    return books.map((b: any) => ({
      _id: b._id,
      title: b.title,
      author: b.author,
      category: b.category,
      availableCopies: b.availableCopies,
      coverImage: b.coverImage,
      rating: b.rating,
    }));
  },
});

export const searchBooks = query({
  args: { queryText: v.string() },
  handler: async (ctx: any, args: any) => {
    // Basic filter-based search (no full-text index setup for exact "searchBooks(query)" requirement yet)
    // but can be improved with searchIndex if title/author are the only fields.
    const books = await ctx.db.query("books").collect();
    const lowQuery = args.queryText.toLowerCase();
    
    return books.filter((b: any) => 
      b.title.toLowerCase().includes(lowQuery) || 
      b.author.toLowerCase().includes(lowQuery)
    );
  },
});

export const getBookDetail = query({
  args: { bookId: v.id("books") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.get(args.bookId);
  },
});

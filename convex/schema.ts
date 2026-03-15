import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    studentId: v.string(), // NIM
    username: v.string(),
    password: v.string(),
    role: v.union(v.literal("student"), v.literal("admin")),
    email: v.string(),
    avatarUrl: v.optional(v.string()), // Added for UI aesthetics
    points: v.optional(v.number()),    // Added for UI aesthetics
  })
    .index("by_studentId", ["studentId"])
    .index("by_username", ["username"]),

  books: defineTable({
    title: v.string(),
    author: v.string(),
    category: v.string(), // genre
    isbn: v.string(),
    totalCopies: v.number(),
    availableCopies: v.number(),
    coverImage: v.string(), // URL or emoji
    rating: v.optional(v.number()), // Added for UI aesthetics
  })
    .index("by_isbn", ["isbn"])
    .index("by_category", ["category"])
    .searchIndex("search_books", {
      searchField: "title",
      filterFields: ["category", "author"],
    }),

  borrowings: defineTable({
    userId: v.id("users"),
    bookId: v.id("books"),
    borrowDate: v.number(),
    dueDate: v.number(),
    status: v.union(v.literal("borrowed"), v.literal("returned")),
  })
    .index("by_userId", ["userId"])
    .index("by_bookId", ["bookId"])
    .index("by_status", ["status"]),

  returns: defineTable({
    borrowingId: v.id("borrowings"),
    userId: v.id("users"), // Added for easier query
    bookId: v.id("books"), // Added for easier query
    returnDate: v.number(),
    fine: v.number(),
  })
    .index("by_borrowingId", ["borrowingId"])
    .index("by_userId", ["userId"]),

  scans: defineTable({
    studentId: v.string(),
    scanTime: v.number(),
  }).index("by_studentId", ["studentId"]),
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 👤 USERS - QUERIES
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.get(args.userId);
  },
});

export const getUserByNim = query({
  args: { nim: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("users")
      .withIndex("by_nim", (q: any) => q.eq("nim", args.nim))
      .first();
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("users").order("desc").collect();
  },
});

export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx: any, args: any) => {
    const limit = args.limit ?? 5;
    const users = await ctx.db.query("users").collect();
    return users
      .sort((a: any, b: any) => (b.points || 0) - (a.points || 0))
      .slice(0, limit);
  },
});

// 👤 USERS - MUTATIONS
export const createUser = mutation({
  args: {
    name: v.string(),
    nim: v.string(),
    email: v.optional(v.string()),
    role: v.union(v.literal("mahasiswa"), v.literal("dosen"), v.literal("admin")),
    cardId: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_nim", (q: any) => q.eq("nim", args.nim))
      .first();
    
    if (existing) throw new Error(`User NIM ${args.nim} sudah ada.`);

    const now = Date.now();
    return await ctx.db.insert("users", {
      ...args,
      cardId: args.cardId ?? `CARD-${args.nim}`,
      points: 0,
      isActive: true,
      maxBorrowLimit: args.role === "dosen" ? 10 : 3,
      currentBorrowCount: 0,
      totalFines: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const updates: any = { updatedAt: Date.now() };
    Object.keys(args).forEach(key => {
        if (key !== "userId" && args[key] !== undefined) {
            updates[key] = args[key];
        }
    });
    await ctx.db.patch(args.userId, updates);
    return args.userId;
  },
});

export const updatePoints = mutation({
  args: { userId: v.id("users"), amount: v.number() },
  handler: async (ctx: any, args: any) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User tidak ditemukan.");

    await ctx.db.patch(args.userId, {
      points: Math.max(0, (user.points || 0) + args.amount),
      updatedAt: Date.now(),
    });
    return { currentPoints: Math.max(0, (user.points || 0) + args.amount) };
  },
});

export const seedInitialData = mutation({
  args: {},
  handler: async (ctx: any) => {
    const now = Date.now();
    
    // Admin
    const admin = await ctx.db.query("users").withIndex("by_nim", (q: any) => q.eq("nim", "admin1")).first();
    if (!admin) {
      await ctx.db.insert("users", {
        name: "Administrator Library",
        nim: "admin1",
        role: "admin",
        cardId: "ADMIN-CARD",
        points: 0,
        isActive: true,
        maxBorrowLimit: 100,
        currentBorrowCount: 0,
        totalFines: 0,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Student
    const student = await ctx.db.query("users").withIndex("by_nim", (q: any) => q.eq("nim", "22310048")).first();
    if (!student) {
      await ctx.db.insert("users", {
        name: "Ahmad Rizky",
        nim: "22310048",
        role: "mahasiswa",
        cardId: "STUDENT-CARD-01",
        avatarUrl: "👤",
        points: 50,
        isActive: true,
        maxBorrowLimit: 3,
        currentBorrowCount: 0,
        totalFines: 0,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Books for dashboard
    const books = [
      { title: "React Native in Action", author: "Erik Hanchett", isbn: "9781617294051", genre: "Programming", rating: 4.8 },
      { title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884", genre: "Software Engineering", rating: 4.9 },
      { title: "The Pragmatic Programmer", author: "Andrew Hunt", isbn: "9780135957059", genre: "Career", rating: 4.7 },
      { title: "Refactoring", author: "Martin Fowler", isbn: "9780134757599", genre: "Design Patterns", rating: 4.6 },
      { title: "Design Patterns", author: "Gof", isbn: "9780201633610", genre: "Architecture", rating: 4.5 },
    ];

    for (const b of books) {
      const existing = await ctx.db.query("books").withIndex("by_isbn", (q: any) => q.eq("isbn", b.isbn)).first();
      if (!existing) {
        await ctx.db.insert("books", {
          ...b,
          totalCopies: 5,
          availableCopies: 5,
          totalRatings: 10,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    return { message: "Seeding complete" };
  },
});

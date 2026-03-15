import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Mutation for registering a new user (Student or Admin)
export const registerUser = mutation({
  args: {
    name: v.string(),
    studentId: v.string(),
    username: v.string(),
    password: v.string(),
    email: v.string(),
    role: v.union(v.literal("student"), v.literal("admin")),
  },
  handler: async (ctx: any, args: any) => {
    console.log("[Convex] Registering user:", args.username);
    
    // Trim and Clean inputs
    const username = args.username.trim().toLowerCase();
    const studentId = args.studentId.trim();
    const email = args.email.trim().toLowerCase();

    // Check if username already exists
    const existingUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q: any) => q.eq("username", username))
      .first();
    
    if (existingUsername) {
      console.warn("[Convex] Username already exists:", username);
      throw new Error("Username '" + username + "' sudah digunakan. Silakan gunakan username lain.");
    }

    // Check if Student ID already exists
    const existingStudentId = await ctx.db
      .query("users")
      .withIndex("by_studentId", (q: any) => q.eq("studentId", studentId))
      .first();
    
    if (existingStudentId) {
      console.warn("[Convex] Student ID already exists:", studentId);
      throw new Error("NIM/Student ID '" + studentId + "' sudah terdaftar.");
    }

    // Insert new user record
    const userId = await ctx.db.insert("users", {
      name: args.name.trim(),
      studentId: studentId,
      username: username,
      password: args.password,
      email: email,
      role: args.role,
      avatarUrl: "👤",
      points: 0,
    });

    console.log("[Convex] User registered successfully with ID:", userId);
    return userId;
  },
});

export const loginUser = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const username = args.username.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q: any) => q.eq("username", username))
      .first();
    
    if (!user) throw new Error("Username tidak ditemukan");
    if (user.password !== args.password) throw new Error("Password salah");

    return user;
  },
});

export const resetPassword = mutation({
  args: {
    username: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const username = args.username.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q: any) => q.eq("username", username))
      .first();
    
    if (!user) throw new Error("Username tidak ditemukan");

    await ctx.db.patch(user._id, { password: args.newPassword });
    return { success: true };
  },
});

export const getUserByStudentId = query({
  args: { studentId: v.string() },
  handler: async (ctx: any, args: any) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_studentId", (q: any) => q.eq("studentId", args.studentId))
      .first();
    
    if (!user) return null;

    // Calculate total fines from returns table
    const unpaidReturns = await ctx.db
      .query("returns")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .collect();
    
    const totalFines = unpaidReturns.reduce((sum: number, r: any) => sum + (r.fine || 0), 0);

    return { ...user, totalFines };
  },
});

export const seedInitialData = mutation({
  args: {},
  handler: async (ctx: any) => {
    const now = Date.now();
    console.log("[Seeding] Starting data initialization...");
    
    // 1. Seed/Patch Users
    const studentId = "22310048";
    const existingStudent = await ctx.db.query("users").withIndex("by_studentId", (q: any) => q.eq("studentId", studentId)).first();
    
    if (!existingStudent) {
      console.log("[Seeding] Creating demo student...");
      await ctx.db.insert("users", {
        name: "Ahmad Rizky",
        studentId: studentId,
        username: "rizky",
        password: "password123",
        role: "student",
        email: "rizky@student.univ.id",
        avatarUrl: "🦊",
        points: 120,
      });
    } else if (!existingStudent.username) {
      console.log("[Seeding] Patching existing student with credentials...");
      await ctx.db.patch(existingStudent._id, {
        username: "rizky",
        password: "password123",
      });
    }

    const adminId = "admin1";
    const existingAdmin = await ctx.db.query("users").withIndex("by_studentId", (q: any) => q.eq("studentId", adminId)).first();
    
    if (!existingAdmin) {
      console.log("[Seeding] Creating demo admin...");
      await ctx.db.insert("users", {
        name: "Admin Perpus",
        studentId: adminId,
        username: "admin",
        password: "adminpassword",
        role: "admin",
        email: "admin@univ.id",
        avatarUrl: "🤖",
        points: 0,
      });
    } else if (!existingAdmin.username) {
      console.log("[Seeding] Patching existing admin with credentials...");
      await ctx.db.patch(existingAdmin._id, {
        username: "admin",
        password: "adminpassword",
      });
    }

    // 2. Seed Books
    const bookData = [
      { title: "React Native Hero", author: "Coder X", category: "Programming", isbn: "RN001", totalCopies: 5, coverImage: "📱", rating: 4.8 },
      { title: "Clean Code", author: "Robert C. Martin", category: "Software", isbn: "CC002", totalCopies: 3, coverImage: "🧙‍♂️", rating: 4.9 },
      { title: "UI/UX Magic", author: "Designer Y", category: "Design", isbn: "UX003", totalCopies: 2, coverImage: "🎨", rating: 4.7 },
      { title: "Database Systems", author: "Oracle Team", category: "Data", isbn: "DB004", totalCopies: 4, coverImage: "📊", rating: 4.5 },
    ];

    const bookIds = [];
    for (const b of bookData) {
      const existing = await ctx.db.query("books").withIndex("by_isbn", (q: any) => q.eq("isbn", b.isbn)).first();
      if (!existing) {
        const id = await ctx.db.insert("books", {
          ...b,
          availableCopies: b.totalCopies,
          rating: b.rating,
        });
        bookIds.push(id);
      } else {
        bookIds.push(existing._id);
      }
    }

    // 3. Seed Borrowings for the demo student
    const studentUser = await ctx.db.query("users").withIndex("by_studentId", (q: any) => q.eq("studentId", "22310048")).first();
    if (studentUser) {
      const hasBorrowings = await ctx.db.query("borrowings").withIndex("by_userId", (q: any) => q.eq("userId", studentUser._id)).first();
      if (!hasBorrowings) {
        const oneDay = 24 * 60 * 60 * 1000;
        await ctx.db.insert("borrowings", {
          userId: studentUser._id,
          bookId: bookIds[0],
          borrowDate: now - (10 * oneDay),
          dueDate: now - (3 * oneDay),
          status: "borrowed",
        });
        await ctx.db.insert("borrowings", {
          userId: studentUser._id,
          bookId: bookIds[1],
          borrowDate: now - (2 * oneDay),
          dueDate: now + (5 * oneDay),
          status: "borrowed",
        });
      }
    }
    return { success: true, message: "Demo data seeded/updated." };
  },
});

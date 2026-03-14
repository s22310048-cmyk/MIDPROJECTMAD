import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 🔄 PENGEMBALIAN BUKU - QUERIES
export const getAllReturns = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx: any, args: any) => {
    const limit = args.limit ?? 50;
    const items = await ctx.db.query("returns").order("desc").take(limit);

    return await Promise.all(
      items.map(async (item: any) => {
        const user = await ctx.db.get(item.userId);
        const book = await ctx.db.get(item.bookId);
        return { ...item, user, book };
      })
    );
  },
});

export const getReturnsByUser = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx: any, args: any) => {
    const limit = args.limit ?? 20;
    const items = await ctx.db
      .query("returns")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    return await Promise.all(
      items.map(async (item: any) => {
        const book = await ctx.db.get(item.bookId);
        return { ...item, book };
      })
    );
  },
});

// 🔄 PENGEMBALIAN BUKU - MUTATIONS
export const processReturn = mutation({
  args: {
    borrowingId: v.id("borrowings"),
    condition: v.union(v.literal("good"), v.literal("damaged"), v.literal("lost")),
    notes: v.optional(v.string()),
    processedBy: v.optional(v.id("users")), // Admin ID
  },
  handler: async (ctx: any, args: any) => {
    const now = Date.now();
    
    // 1. Validasi peminjaman
    const borrowing = await ctx.db.get(args.borrowingId);
    if (!borrowing) throw new Error("Peminjaman tidak ditemukan.");
    if (borrowing.status === "returned") throw new Error("Buku sudah dikembalikan sebelumnya.");

    const user = await ctx.db.get(borrowing.userId);
    const book = await ctx.db.get(borrowing.bookId);

    // 2. Hitung denda keterlambatan
    const daysLate = Math.max(0, Math.ceil((now - borrowing.dueDate) / (1000 * 60 * 60 * 24)));
    const isLate = daysLate > 0;
    const FINE_PER_DAY = 1000;
    let fineAmount = isLate ? daysLate * FINE_PER_DAY : 0;

    // Tambahan denda kondisi
    if (args.condition === "damaged") fineAmount += 20000; 
    if (args.condition === "lost") fineAmount += book.price ?? 50000; 

    // 3. Buat record pengembalian
    const returnId = await ctx.db.insert("returns", {
      borrowingId: args.borrowingId,
      userId: borrowing.userId,
      bookId: borrowing.bookId,
      returnDate: now,
      condition: args.condition,
      isLate,
      daysLate,
      fineAmount,
      fineStatus: fineAmount > 0 ? "unpaid" : "none",
      processedBy: args.processedBy,
      notes: args.notes,
      createdAt: now,
    });

    // 4. Update status peminjaman
    await ctx.db.patch(args.borrowingId, {
      returnDate: now,
      status: args.condition === "lost" ? "lost" : "returned",
      fineAmount: borrowing.fineAmount + fineAmount,
      fineStatus: (borrowing.fineAmount + fineAmount) > 0 ? "unpaid" : "none",
      updatedAt: now,
    });

    // 5. Update user
    await ctx.db.patch(borrowing.userId, {
      currentBorrowCount: Math.max(0, user.currentBorrowCount - 1),
      totalFines: (user.totalFines || 0) + fineAmount,
      points: (user.points || 0) + (isLate ? 0 : 5), // Bonus poin jika tepat waktu
      updatedAt: now,
    });

    // 6. Update stok buku (jika tidak hilang)
    if (args.condition !== "lost") {
      await ctx.db.patch(borrowing.bookId, {
        availableCopies: book.availableCopies + 1,
        updatedAt: now,
      });
    } else {
      await ctx.db.patch(borrowing.bookId, {
        totalCopies: book.totalCopies - 1,
        updatedAt: now,
      });
    }

    return {
      returnId,
      fineAmount,
      message: `Buku "${book.title}" berhasil dikembalikan. ${fineAmount > 0 ? `Denda: Rp ${fineAmount.toLocaleString("id-ID")}` : "Terima kasih!"}`,
    };
  },
});

export const payFine = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    borrowingId: v.optional(v.id("borrowings")),
  },
  handler: async (ctx: any, args: any) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User tidak ditemukan.");

    const newTotalFines = Math.max(0, (user.totalFines || 0) - args.amount);
    await ctx.db.patch(args.userId, {
      totalFines: newTotalFines,
      updatedAt: Date.now(),
    });

    if (args.borrowingId) {
        const b = await ctx.db.get(args.borrowingId);
        if (b) {
            await ctx.db.patch(args.borrowingId, { fineStatus: "paid", updatedAt: Date.now() });
        }
    }

    return { success: true, remainingFines: newTotalFines };
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ══════════════════════════════════════════════════════════════════════════════
// 📋 PEMINJAMAN BUKU - QUERIES
// ══════════════════════════════════════════════════════════════════════════════

const FINE_PER_DAY = 1000; // Rp 1.000 per hari
const DEFAULT_BORROW_DAYS = 14; // 14 hari masa peminjaman
const MAX_RENEW_COUNT = 2; // Maksimal 2x perpanjangan

/**
 * Mengambil semua peminjaman aktif
 */
export const getActiveBorrowings = query({
  args: {},
  handler: async (ctx: any) => {
    const borrowings = await ctx.db
      .query("borrowings")
      .withIndex("by_status", (q: any) => q.eq("status", "active"))
      .collect();

    // Enrich data with user and book info
    const enriched = await Promise.all(
      borrowings.map(async (b: any) => {
        const user = await ctx.db.get(b.userId);
        const book = await ctx.db.get(b.bookId);
        return { ...b, user, book };
      })
    );

    return enriched;
  },
});

/**
 * Mengambil peminjaman berdasarkan user ID
 */
export const getBorrowingsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx: any, args: any) => {
    const borrowings = await ctx.db
      .query("borrowings")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const enriched = await Promise.all(
      borrowings.map(async (b: any) => {
        const book = await ctx.db.get(b.bookId);
        return { ...b, book };
      })
    );

    return enriched;
  },
});

/**
 * Mengambil peminjaman aktif berdasarkan user ID
 */
export const getActiveByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx: any, args: any) => {
    const borrowings = await ctx.db
      .query("borrowings")
      .withIndex("by_userId_status", (q: any) =>
        q.eq("userId", args.userId).eq("status", "active")
      )
      .collect();

    const enriched = await Promise.all(
      borrowings.map(async (b: any) => {
        const book = await ctx.db.get(b.bookId);
        const now = Date.now();
        const daysRemaining = Math.ceil(
          (b.dueDate - now) / (1000 * 60 * 60 * 24)
        );
        const isOverdue = daysRemaining < 0;
        const estimatedFine = isOverdue
          ? Math.abs(daysRemaining) * FINE_PER_DAY
          : 0;

        return {
          ...b,
          book,
          daysRemaining,
          isOverdue,
          estimatedFine,
        };
      })
    );

    return enriched;
  },
});

/**
 * Mengambil peminjaman yang terlambat (overdue)
 */
export const getOverdueBorrowings = query({
  args: {},
  handler: async (ctx: any) => {
    const now = Date.now();

    // Ambil semua peminjaman aktif
    const activeBorrowings = await ctx.db
      .query("borrowings")
      .withIndex("by_status", (q: any) => q.eq("status", "active"))
      .collect();

    // Filter yang sudah melewati due date
    const overdue = activeBorrowings.filter((b: any) => b.dueDate < now);

    const enriched = await Promise.all(
      overdue.map(async (b: any) => {
        const user = await ctx.db.get(b.userId);
        const book = await ctx.db.get(b.bookId);
        const daysLate = Math.ceil(
          (now - b.dueDate) / (1000 * 60 * 60 * 24)
        );
        const fineAmount = daysLate * FINE_PER_DAY;

        return { ...b, user, book, daysLate, fineAmount };
      })
    );

    return enriched;
  },
});

/**
 * Mengambil detail peminjaman berdasarkan ID
 */
export const getBorrowingById = query({
  args: { borrowingId: v.id("borrowings") },
  handler: async (ctx: any, args: any) => {
    const borrowing = await ctx.db.get(args.borrowingId);
    if (!borrowing) return null;

    const user = await ctx.db.get(borrowing.userId);
    const book = await ctx.db.get(borrowing.bookId);

    const now = Date.now();
    const daysRemaining = Math.ceil(
      (borrowing.dueDate - now) / (1000 * 60 * 60 * 24)
    );
    const isOverdue = daysRemaining < 0 && borrowing.status === "active";
    const estimatedFine = isOverdue
      ? Math.abs(daysRemaining) * FINE_PER_DAY
      : (borrowing.fineAmount || 0);

    return {
      ...borrowing,
      user,
      book,
      daysRemaining,
      isOverdue,
      estimatedFine,
    };
  },
});

/**
 * Mengambil riwayat peminjaman terakhir (untuk dashboard)
 */
export const getRecentHistory = query({
  args: {
    userId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx: any, args: any) => {
    const limit = args.limit ?? 5;

    let borrowingsQuery;
    if (args.userId) {
      borrowingsQuery = ctx.db
        .query("borrowings")
        .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
        .order("desc");
    } else {
      borrowingsQuery = ctx.db.query("borrowings").order("desc");
    }

    const borrowings = await borrowingsQuery.take(limit + 10); // Get extra to filter

    // Filter only returned/completed borrowings
    const returned = borrowings
      .filter((b: any) => b.status === "returned")
      .slice(0, limit);

    const enriched = await Promise.all(
      returned.map(async (b: any) => {
        const user = await ctx.db.get(b.userId);
        const book = await ctx.db.get(b.bookId);
        return { ...b, user, book };
      })
    );

    return enriched;
  },
});

/**
 * Statistik peminjaman untuk dashboard admin
 */
export const getBorrowingStats = query({
  args: {},
  handler: async (ctx: any) => {
    const now = Date.now();

    const allBorrowings = await ctx.db.query("borrowings").collect();

    const active = allBorrowings.filter((b: any) => b.status === "active");
    const overdue = active.filter((b: any) => b.dueDate < now);
    const returned = allBorrowings.filter((b: any) => b.status === "returned");
    const totalFines = allBorrowings.reduce((sum: number, b: any) => sum + (b.fineAmount || 0), 0);
    const unpaidFines = allBorrowings
      .filter((b: any) => b.fineStatus === "unpaid")
      .reduce((sum: number, b: any) => sum + (b.fineAmount || 0), 0);

    // Peminjaman hari ini
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayBorrowings = allBorrowings.filter(
      (b: any) => b.borrowDate >= todayStart.getTime()
    );

    return {
      totalBorrowings: allBorrowings.length,
      activeBorrowings: active.length,
      overdueBorrowings: overdue.length,
      returnedBorrowings: returned.length,
      todayBorrowings: todayBorrowings.length,
      totalFines,
      unpaidFines,
      finePerDay: FINE_PER_DAY,
    };
  },
});

// ══════════════════════════════════════════════════════════════════════════════
// 📋 PEMINJAMAN BUKU - MUTATIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Membuat peminjaman buku baru
 */
export const borrowBook = mutation({
  args: {
    userId: v.id("users"),
    bookId: v.id("books"),
    borrowDays: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const now = Date.now();
    const borrowDays = args.borrowDays ?? DEFAULT_BORROW_DAYS;

    // 1. Validasi user
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User tidak ditemukan.");
    if (!user.isActive) throw new Error("Akun user tidak aktif.");
    if (user.currentBorrowCount >= user.maxBorrowLimit) {
      throw new Error(
        `User sudah mencapai batas maksimal peminjaman (${user.maxBorrowLimit} buku).`
      );
    }
    if ((user.totalFines || 0) > 0) {
      throw new Error(
        `User memiliki denda yang belum dibayar sebesar Rp ${user.totalFines.toLocaleString("id-ID")}. Harap bayar denda terlebih dahulu.`
      );
    }

    // 2. Validasi buku
    const book = await ctx.db.get(args.bookId);
    if (!book) throw new Error("Buku tidak ditemukan.");
    if (!book.isActive) throw new Error("Buku tidak tersedia.");
    if (book.availableCopies <= 0) {
      throw new Error("Stok buku habis. Tidak ada eksemplar yang tersedia.");
    }

    // 3. Cek apakah user sudah meminjam buku yang sama
    const existingBorrowing = await ctx.db
      .query("borrowings")
      .withIndex("by_userId_status", (q: any) =>
        q.eq("userId", args.userId).eq("status", "active")
      )
      .filter((q: any) => q.eq(q.field("bookId"), args.bookId))
      .first();

    if (existingBorrowing) {
      throw new Error("User sudah meminjam buku ini dan belum mengembalikan.");
    }

    // 4. Hitung due date
    const dueDate = now + borrowDays * 24 * 60 * 60 * 1000;

    // 5. Buat record peminjaman
    const borrowingId = await ctx.db.insert("borrowings", {
      userId: args.userId,
      bookId: args.bookId,
      borrowDate: now,
      dueDate,
      status: "active",
      fineAmount: 0,
      fineStatus: "none",
      notes: args.notes,
      renewCount: 0,
      maxRenews: MAX_RENEW_COUNT,
      createdAt: now,
      updatedAt: now,
    });

    // 6. Update stok buku
    await ctx.db.patch(args.bookId, {
      availableCopies: book.availableCopies - 1,
      updatedAt: now,
    });

    // 7. Update jumlah peminjaman user
    await ctx.db.patch(args.userId, {
      currentBorrowCount: user.currentBorrowCount + 1,
      updatedAt: now,
    });

    return {
      borrowingId,
      dueDate,
      borrowDays,
      message: `Buku "${book.title}" berhasil dipinjam. Batas pengembalian: ${new Date(dueDate).toLocaleDateString("id-ID")}.`,
    };
  },
});

/**
 * Perpanjangan masa peminjaman
 */
export const renewBorrowing = mutation({
  args: {
    borrowingId: v.id("borrowings"),
    additionalDays: v.optional(v.number()),
  },
  handler: async (ctx: any, args: any) => {
    const now = Date.now();
    const additionalDays = args.additionalDays ?? DEFAULT_BORROW_DAYS;

    const borrowing = await ctx.db.get(args.borrowingId);
    if (!borrowing) throw new Error("Peminjaman tidak ditemukan.");
    if (borrowing.status !== "active") {
      throw new Error("Hanya peminjaman aktif yang bisa diperpanjang.");
    }
    if (borrowing.renewCount >= borrowing.maxRenews) {
      throw new Error(
        `Sudah mencapai batas maksimal perpanjangan (${borrowing.maxRenews}x).`
      );
    }

    // Cek apakah sudah overdue
    if (borrowing.dueDate < now) {
      throw new Error(
        "Peminjaman sudah terlambat. Harap kembalikan dan bayar denda terlebih dahulu."
      );
    }

    const newDueDate =
      borrowing.dueDate + additionalDays * 24 * 60 * 60 * 1000;

    await ctx.db.patch(args.borrowingId, {
      dueDate: newDueDate,
      renewCount: borrowing.renewCount + 1,
      updatedAt: now,
    });

    return {
      newDueDate,
      renewsRemaining: borrowing.maxRenews - (borrowing.renewCount + 1),
      message: `Peminjaman berhasil diperpanjang. Batas pengembalian baru: ${new Date(newDueDate).toLocaleDateString("id-ID")}.`,
    };
  },
});

/**
 * Update status overdue secara batch (dipanggil berkala)
 */
export const updateOverdueStatus = mutation({
  args: {},
  handler: async (ctx: any) => {
    const now = Date.now();

    const activeBorrowings = await ctx.db
      .query("borrowings")
      .withIndex("by_status", (q: any) => q.eq("status", "active"))
      .collect();

    let updatedCount = 0;

    for (const borrowing of activeBorrowings) {
      if (borrowing.dueDate < now) {
        const daysLate = Math.ceil(
          (now - borrowing.dueDate) / (1000 * 60 * 60 * 24)
        );
        const fineAmount = daysLate * FINE_PER_DAY;

        await ctx.db.patch(borrowing._id, {
          status: "overdue",
          fineAmount,
          fineStatus: "unpaid",
          updatedAt: now,
        });

        // Update user fines
        const user = await ctx.db.get(borrowing.userId);
        if (user) {
          await ctx.db.patch(borrowing.userId, {
            totalFines: (user.totalFines || 0) + fineAmount,
            updatedAt: now,
          });
        }

        updatedCount++;
      }
    }

    return { updatedCount };
  },
});

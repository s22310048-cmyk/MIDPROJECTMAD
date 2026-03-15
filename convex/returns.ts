import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const returnBook = mutation({
  args: {
    borrowingId: v.id("borrowings"),
  },
  handler: async (ctx: any, args: any) => {
    const borrowing = await ctx.db.get(args.borrowingId);
    if (!borrowing) throw new Error("Data peminjaman tidak ditemukan");
    if (borrowing.status === "returned") throw new Error("Buku sudah dikembalikan");

    const now = Date.now();
    let fine = 0;
    
    if (now > borrowing.dueDate) {
      const daysLate = Math.ceil((now - borrowing.dueDate) / (1000 * 60 * 60 * 24));
      fine = daysLate * 1000;
    }

    // 1. Update borrowing status
    await ctx.db.patch(args.borrowingId, {
      status: "returned",
    });

    // 2. Increase book availableCopies
    const book = await ctx.db.get(borrowing.bookId);
    if (book) {
      await ctx.db.patch(borrowing.bookId, {
        availableCopies: book.availableCopies + 1,
      });
    }

    // 3. Create return record
    const returnId = await ctx.db.insert("returns", {
      borrowingId: args.borrowingId,
      userId: borrowing.userId,
      bookId: borrowing.bookId,
      returnDate: now,
      fine,
    });

    return { returnId, fine };
  },
});

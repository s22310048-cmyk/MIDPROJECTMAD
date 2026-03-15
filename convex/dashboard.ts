import { query } from "./_generated/server";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx: any) => {
    const books = await ctx.db.query("books").collect();
    const borrowings = await ctx.db.query("borrowings").collect();

    const totalBooks = books.length;
    const borrowedBooksCount = borrowings.filter((b: any) => b.status === "borrowed").length;
    const returnedBooksCount = borrowings.filter((b: any) => b.status === "returned").length;
    
    // activeBorrowings could mean unique users currently borrowing or just the borrowed books
    const activeBorrowings = borrowedBooksCount;

    return {
      totalBooks,
      borrowedBooks: borrowedBooksCount,
      returnedBooks: returnedBooksCount,
      activeBorrowings,
    };
  },
});

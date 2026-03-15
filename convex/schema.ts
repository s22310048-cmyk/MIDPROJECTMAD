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

<<<<<<< HEAD
  scans: defineTable({
    studentId: v.string(),
    scanTime: v.number(),
  }).index("by_studentId", ["studentId"]),
=======
  // ══════════════════════════════════════════════════════════════════════════
  // 🔍 TABEL SCAN LOG (Riwayat Scan ID)
  // Menyimpan log setiap scan kartu ID
  // ══════════════════════════════════════════════════════════════════════════
  scanLogs: defineTable({
    cardId: v.string(),                  // ID kartu yang di-scan
    userId: v.optional(v.id("users")),   // User terkait (optional jika kartu tidak ditemukan)
    scanType: v.union(                   // Tipe scan
      v.literal("borrow"),               // Scan untuk peminjaman
      v.literal("return"),               // Scan untuk pengembalian
      v.literal("identify"),             // Scan untuk identifikasi saja
      v.literal("attendance")            // Scan untuk kehadiran
    ),
    scanResult: v.union(                 // Hasil scan
      v.literal("success"),              // Berhasil
      v.literal("not_found"),            // Kartu tidak ditemukan
      v.literal("inactive"),             // User tidak aktif
      v.literal("error")                 // Error
    ),
    resultMessage: v.optional(v.string()), // Pesan hasil scan
    scannedAt: v.number(),               // Waktu scan
    scannedBy: v.optional(v.id("users")), // Admin yang melakukan scan
  })
    .index("by_cardId", ["cardId"])
    .index("by_userId", ["userId"])
    .index("by_scanType", ["scanType"])
    .index("by_scannedAt", ["scannedAt"]),

  // ══════════════════════════════════════════════════════════════════════════
  // 🧾 TABEL TRANSAKSI (Transaction History)
  // Menyimpan riwayat semua jenis transaksi perpustakaan
  // ══════════════════════════════════════════════════════════════════════════
  transactions: defineTable({
    userId: v.id("users"),                  // User yang melakukan transaksi
    bookId: v.optional(v.id("books")),      // Buku yang terkait transaksi (opsional)
    transaction_type: v.union(              // Jenis transaksi
      v.literal("borrow"),
      v.literal("return"),
      v.literal("fine_payment")
    ),
    transaction_date: v.number(),           // Tanggal transaksi (timestamp)
    fine_amount: v.number(),                // Jumlah denda (opsional, isi 0 jika tidak ada)
    status: v.string(),                     // Status (contoh: "completed", "pending")
    createdAt: v.number(),
  })
    .index("by_type", ["transaction_type"])
    .index("by_date", ["transaction_date"])
    .index("by_userId", ["userId"]),
>>>>>>> df3d2279fa1317ff3f70367447745f3900eab54c
});

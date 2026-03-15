import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ══════════════════════════════════════════════════════════════════════════
  // 📚 TABEL BUKU (Kelola Buku)
  // Menyimpan data lengkap semua buku di perpustakaan
  // ══════════════════════════════════════════════════════════════════════════
  books: defineTable({
    title: v.string(),                    // Judul buku
    author: v.string(),                   // Penulis buku
    isbn: v.string(),                     // ISBN buku (unik)
    genre: v.string(),                    // Genre/kategori buku
    description: v.optional(v.string()),  // Deskripsi/sinopsis buku
    coverUrl: v.optional(v.string()),     // URL gambar cover buku
    publisher: v.optional(v.string()),    // Penerbit buku
    publishYear: v.optional(v.number()),  // Tahun terbit
    totalCopies: v.number(),              // Jumlah total eksemplar
    availableCopies: v.number(),          // Jumlah eksemplar yang tersedia
    rating: v.optional(v.number()),       // Rating rata-rata (1-5)
    totalRatings: v.optional(v.number()), // Jumlah total rating
    isActive: v.boolean(),               // Apakah buku masih aktif di sistem
    createdAt: v.number(),               // Waktu dibuat (timestamp)
    updatedAt: v.number(),               // Waktu terakhir diperbarui
  })
    .index("by_isbn", ["isbn"])
    .index("by_genre", ["genre"])
    .index("by_title", ["title"])
    .index("by_isActive", ["isActive"])
    .searchIndex("search_books", {
      searchField: "title",
      filterFields: ["genre", "isActive"],
    }),

  // ══════════════════════════════════════════════════════════════════════════
  // 👤 TABEL USERS (Pengguna / Anggota)
  // Menyimpan data anggota perpustakaan
  // ══════════════════════════════════════════════════════════════════════════
  users: defineTable({
    name: v.string(),                     // Nama lengkap pengguna
    nim: v.string(),                      // NIM / nomor identitas
    email: v.optional(v.string()),        // Email pengguna
    phone: v.optional(v.string()),        // Nomor telepon
    role: v.union(                        // Peran pengguna
      v.literal("mahasiswa"),
      v.literal("dosen"),
      v.literal("admin")
    ),
    cardId: v.string(),                   // ID kartu (untuk scan)
    avatarUrl: v.optional(v.string()),    // URL foto profil
    points: v.number(),                   // Poin rewards
    isActive: v.boolean(),               // Status aktif
    maxBorrowLimit: v.number(),          // Batas maksimal peminjaman
    currentBorrowCount: v.number(),      // Jumlah peminjaman saat ini
    totalFines: v.number(),              // Total denda yang belum dibayar
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_nim", ["nim"])
    .index("by_cardId", ["cardId"])
    .index("by_role", ["role"])
    .index("by_email", ["email"]),

  // ══════════════════════════════════════════════════════════════════════════
  // 📋 TABEL PEMINJAMAN (Borrowings/Loans)
  // Menyimpan data peminjaman buku
  // ══════════════════════════════════════════════════════════════════════════
  borrowings: defineTable({
    userId: v.id("users"),               // Referensi ke user yang meminjam
    bookId: v.id("books"),               // Referensi ke buku yang dipinjam
    borrowDate: v.number(),              // Tanggal peminjaman (timestamp)
    dueDate: v.number(),                 // Tanggal batas pengembalian (timestamp)
    returnDate: v.optional(v.number()),  // Tanggal pengembalian aktual
    status: v.union(                     // Status peminjaman
      v.literal("active"),               // Sedang dipinjam
      v.literal("returned"),             // Sudah dikembalikan
      v.literal("overdue"),              // Terlambat (belum dikembalikan)
      v.literal("lost")                  // Buku hilang
    ),
    fineAmount: v.number(),              // Jumlah denda (Rp)
    fineStatus: v.union(                 // Status pembayaran denda
      v.literal("none"),                 // Tidak ada denda
      v.literal("unpaid"),               // Belum dibayar
      v.literal("paid")                  // Sudah dibayar
    ),
    notes: v.optional(v.string()),       // Catatan tambahan
    renewCount: v.number(),              // Jumlah perpanjangan
    maxRenews: v.number(),               // Batas maksimal perpanjangan
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_bookId", ["bookId"])
    .index("by_status", ["status"])
    .index("by_userId_status", ["userId", "status"])
    .index("by_dueDate", ["dueDate"]),

  // ══════════════════════════════════════════════════════════════════════════
  // 🔄 TABEL PENGEMBALIAN (Returns)
  // Menyimpan riwayat/detail pengembalian buku
  // ══════════════════════════════════════════════════════════════════════════
  returns: defineTable({
    borrowingId: v.id("borrowings"),     // Referensi ke peminjaman
    userId: v.id("users"),               // Referensi ke user
    bookId: v.id("books"),               // Referensi ke buku
    returnDate: v.number(),              // Tanggal pengembalian aktual
    condition: v.union(                  // Kondisi buku saat dikembalikan
      v.literal("good"),                 // Baik
      v.literal("damaged"),              // Rusak
      v.literal("lost")                  // Hilang
    ),
    isLate: v.boolean(),                 // Apakah terlambat
    daysLate: v.number(),                // Jumlah hari keterlambatan
    fineAmount: v.number(),              // Jumlah denda
    fineStatus: v.union(                 // Status pembayaran
      v.literal("none"),
      v.literal("unpaid"),
      v.literal("paid")
    ),
    processedBy: v.optional(v.id("users")), // Admin yang memproses
    notes: v.optional(v.string()),       // Catatan kondisi buku, dll.
    createdAt: v.number(),
  })
    .index("by_borrowingId", ["borrowingId"])
    .index("by_userId", ["userId"])
    .index("by_bookId", ["bookId"])
    .index("by_returnDate", ["returnDate"]),

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
});

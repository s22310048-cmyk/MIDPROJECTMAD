import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Convex Imports
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthStore } from "../store/authStore";

// ── Constants (Tetap ada untuk fallback/config) ──────────────────────────
const FINE_PER_DAY = 1000; // Rp 1.000 per hari

// ── Helper Functions ───────────────────────────────────────────────────────
function getDaysRemaining(dueDate: number): number {
  const now = Date.now();
  const diff = dueDate - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(date: number | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number | undefined | null): string {
  const val = amount || 0;
  return `Rp ${val.toLocaleString("id-ID")}`;
}

// ── Star Rating Component ──────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Ionicons key={`full-${i}`} name="star" size={12} color="#FFD700" />
    );
  }
  if (hasHalf) {
    stars.push(
      <Ionicons key="half" name="star-half" size={12} color="#FFD700" />
    );
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {stars}
      <Text style={{ fontSize: 11, color: "#8E8E93", marginLeft: 4 }}>
        {rating}
      </Text>
    </View>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // ── Database Queries ───────────────────────────────────────────────────
  const { userStudentId } = useAuthStore();
  
  // Ambil user dengan Student ID demo
  const user = useQuery(
    api?.users?.getUserByStudentId || ("users:getUserByStudentId" as any), 
    (api?.users && userStudentId) ? { studentId: userStudentId } : "skip"
  );
  
  // Hanya jalankan query jika user sudah dimuat
  const activeLoans = useQuery(
    api?.borrowings?.getActiveByUser || ("borrowings:getActiveByUser" as any), 
    (api?.borrowings && user?._id) ? { userId: user._id } : "skip"
  ) || [];
  
  const popularBooks = useQuery(
    api?.catalog?.getCatalog || ("catalog:getCatalog" as any), 
    (api?.catalog) ? {} : "skip"
  ) || [];
  
  const loanHistory = useQuery(
    api?.borrowings?.getRecentHistory || ("borrowings:getRecentHistory" as any), 
    (api?.borrowings && user?._id) ? { userId: user._id, limit: 10 } : "skip"
  ) || [];

  const totalFine = user?.totalFines || 0;
  const overdueLoanCount = activeLoans.filter((l: any) => l.isOverdue).length;

  // ── Colors ─────────────────────────────────────────────────────────────
  const colors = {
    bg: isDark ? "#0A0A0F" : "#F0F2F8",
    card: isDark ? "#1A1A25" : "#FFFFFF",
    cardAlt: isDark ? "#1E1E2D" : "#F8F9FE",
    text: isDark ? "#FFFFFF" : "#1A1A2E",
    textSecondary: isDark ? "#9A9AB0" : "#6B6B80",
    accent: "#6C63FF",
    accentLight: isDark ? "rgba(108,99,255,0.15)" : "rgba(108,99,255,0.08)",
    success: "#00C853",
    successBg: isDark ? "rgba(0,200,83,0.12)" : "rgba(0,200,83,0.08)",
    warning: "#FF9500",
    warningBg: isDark ? "rgba(255,149,0,0.12)" : "rgba(255,149,0,0.08)",
    danger: "#FF3B5C",
    dangerBg: isDark ? "rgba(255,59,92,0.12)" : "rgba(255,59,92,0.08)",
    border: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    gradient1: "#6C63FF",
    gradient2: "#4ECDC4",
  };

  const isApiReady = !!api?.users;

  if (!isApiReady || user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg, padding: 40 }}>
        <Ionicons name="cloud-offline-outline" size={64} color={colors.accent} style={{ marginBottom: 20 }} />
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700", textAlign: "center" }}>
          {!isApiReady ? "Backend Belum Terhubung" : "Memuat Data Perpustakaan..."}
        </Text>
        {!isApiReady ? (
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 12 }}>
            Antarmuka API Convex belum ter-generate. Silakan jalankan "npx convex dev" di terminal.
          </Text>
        ) : (
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 12 }}>
            Sedang menyambungkan ke database cloud...
          </Text>
        )}
      </View>
    );
  }

  if (user === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg, padding: 40 }}>
        <Ionicons name="person-add-outline" size={64} color={colors.warning} style={{ marginBottom: 20 }} />
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700", textAlign: "center" }}>
          User Tidak Ditemukan
        </Text>
        <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 12 }}>
          Data untuk Student ID "{userStudentId}" belum ada di database. Silakan jalankan perintah berikut di terminal:
        </Text>
        <View style={{ backgroundColor: isDark ? "#222" : "#EEE", padding: 12, borderRadius: 8, marginTop: 16 }}>
          <Text style={{ fontFamily: Platform.OS === "ios" ? "Courier" : "monospace", color: colors.accent, fontSize: 12 }}>
            npx convex run users:seedInitialData
          </Text>
        </View>
      </View>
    );
  }

  const shadowStyle = Platform.OS !== "web" ? {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowRadius: 12,
    elevation: 6,
  } : {
    boxShadow: isDark
      ? "0 4px 12px rgba(0,0,0,0.3)"
      : "0 4px 12px rgba(0,0,0,0.08)",
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Greeting Header ─────────────────────────────────────────── */}
      <View style={[styles.greetingContainer, {
        backgroundColor: colors.accent,
        borderColor: colors.border,
      }]}>
        <View style={styles.greetingGlow} />
        <View style={styles.greetingContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingLabel}>Selamat Datang 👋</Text>
            <Text style={styles.greetingName}>{user?.name || "Tamu"}</Text>
            <Text style={styles.greetingSubtitle}>
              ID: {user?.studentId || "-"} · {user?.role || "Pengguna"}
            </Text>
          </View>
          <View style={styles.greetingAvatar}>
            <Text style={{ fontSize: 28 }}>{user?.avatarUrl || "👤"}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>{activeLoans.length}</Text>
            <Text style={styles.quickStatLabel}>Dipinjam</Text>
          </View>
          <View style={[styles.quickStatDivider]} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>{overdueLoanCount}</Text>
            <Text style={styles.quickStatLabel}>Terlambat</Text>
          </View>
          <View style={[styles.quickStatDivider]} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>{loanHistory.length}</Text>
            <Text style={styles.quickStatLabel}>Total Riwayat</Text>
          </View>
        </View>
      </View>

      {/* ── Fine Alert ──────────────────────────────────────────────── */}
      {totalFine > 0 && (
        <View style={[styles.fineAlert, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}>
          <View style={styles.fineAlertIcon}>
            <Ionicons name="warning" size={22} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.fineAlertTitle, { color: colors.danger }]}>
              Denda Keterlambatan
            </Text>
            <Text style={[styles.fineAlertAmount, { color: colors.danger }]}>
              {formatCurrency(totalFine)}
            </Text>
            <Text style={[styles.fineAlertDesc, { color: colors.textSecondary }]}>
              Tarif: {formatCurrency(FINE_PER_DAY)}/hari · {overdueLoanCount} buku terlambat
            </Text>
          </View>
        </View>
      )}

      {/* ── Active Borrowing Status ─────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconBadge, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="book" size={16} color={colors.accent} />
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Status Peminjaman Aktif
          </Text>
        </View>

        {activeLoans.length === 0 ? (
          <View style={[styles.loanCard, { padding: 20, alignItems: "center", backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ color: colors.textSecondary }}>Tidak ada peminjaman aktif</Text>
          </View>
        ) : activeLoans.map((loan: any) => {
          if (!loan) return null;
          const daysLeft = loan.daysRemaining || 0;
          const isOverdue = !!loan.isOverdue;
          const isUrgent = daysLeft >= 0 && daysLeft <= 3;
          const estimatedFine = loan.estimatedFine || 0;

          let statusColor = colors.success;
          let statusBg = colors.successBg;
          let statusText = `${daysLeft} hari lagi`;
          let statusIcon: "checkmark-circle" | "alert-circle" | "close-circle" = "checkmark-circle";

          if (isOverdue) {
            statusColor = colors.danger;
            statusBg = colors.dangerBg;
            statusText = `Terlambat ${Math.abs(daysLeft)} hari`;
            statusIcon = "close-circle";
          } else if (isUrgent) {
            statusColor = colors.warning;
            statusBg = colors.warningBg;
            statusText = daysLeft === 0 ? "Hari ini!" : `${daysLeft} hari lagi`;
            statusIcon = "alert-circle";
          }

          return (
            <View
              key={loan._id}
              style={[styles.loanCard, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]}
            >
              <View style={styles.loanCardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.loanTitle, { color: colors.text }]} numberOfLines={1}>
                    {loan.book?.title}
                  </Text>
                  <Text style={[styles.loanAuthor, { color: colors.textSecondary }]}>
                    {loan.book?.author}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                  <Ionicons name={statusIcon} size={14} color={statusColor} />
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {statusText}
                  </Text>
                </View>
              </View>

              <View style={[styles.loanCardBottom, { borderTopColor: colors.border }]}>
                <View style={styles.loanDateRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                  <Text style={[styles.loanDateText, { color: colors.textSecondary }]}>
                    Pinjam: {formatDate(loan.borrowDate)}
                  </Text>
                </View>
                <View style={styles.loanDateRow}>
                  <Ionicons name="time-outline" size={14} color={isOverdue ? colors.danger : colors.textSecondary} />
                  <Text style={[styles.loanDateText, { color: isOverdue ? colors.danger : colors.textSecondary }]}>
                    Batas: {formatDate(loan.dueDate)}
                  </Text>
                </View>
              </View>

              {isOverdue && (
                <View style={[styles.fineRow, { backgroundColor: colors.dangerBg }]}>
                  <Ionicons name="cash-outline" size={14} color={colors.danger} />
                  <Text style={[styles.fineText, { color: colors.danger }]}>
                    Denda: {formatCurrency(estimatedFine)}
                  </Text>
                  <Text style={[styles.fineCalc, { color: colors.textSecondary }]}>
                    ({Math.abs(daysLeft)} × {formatCurrency(FINE_PER_DAY)})
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* ── Popular Books ───────────────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconBadge, { backgroundColor: "rgba(255,149,0,0.1)" }]}>
            <Ionicons name="flame" size={16} color={colors.warning} />
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Rekomendasi Buku Populer
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.booksRow}
        >
          {popularBooks.length === 0 ? (
            <Text style={{ color: colors.textSecondary, marginLeft: 16 }}>Belum ada buku tersedia</Text>
          ) : popularBooks.map((book: any) => (
            <View
              key={book._id}
              style={[styles.bookCard, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]}
            >
              <View style={[styles.bookCover, { backgroundColor: colors.accentLight }]}>
                {book.coverImage ? (
                   <Text style={{ fontSize: 36 }}>{book.coverImage}</Text>
                ) : (
                  <Text style={{ fontSize: 36 }}>📖</Text>
                )}
              </View>
              <View style={styles.bookInfo}>
                <Text style={[styles.bookGenre, { color: colors.accent }]}>
                  {book.category}
                </Text>
                <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={2}>
                  {book.title}
                </Text>
                <Text style={[styles.bookAuthor, { color: colors.textSecondary }]} numberOfLines={1}>
                  {book.author}
                </Text>
                <StarRating rating={book.rating || 0} />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ── Last 5 Loan History ─────────────────────────────────────── */}
      <View style={[styles.section, { marginBottom: 40 }]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconBadge, { backgroundColor: colors.successBg }]}>
            <Ionicons name="time" size={16} color={colors.success} />
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            5 Riwayat Peminjaman Terakhir
          </Text>
        </View>

        <View style={[styles.historyContainer, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]}>
          {loanHistory.length === 0 ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: colors.textSecondary }}>Belum ada riwayat peminjaman</Text>
            </View>
          ) : loanHistory.map((item: any, index: number) => {
            if (!item) return null;
            const isCompleted = item.status === "returned";
            const isLate = isCompleted ? (item.returnDate > item.dueDate) : (Date.now() > item.dueDate);
            return (
              <View key={item._id}>
                <View style={styles.historyItem}>
                  <View style={[
                    styles.historyIndex,
                    { backgroundColor: isLate ? colors.dangerBg : colors.accentLight }
                  ]}>
                    <Text style={[styles.historyIndexText, { color: isLate ? colors.danger : colors.accent }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.historyTitle, { color: colors.text }]} numberOfLines={1}>
                      {item.book?.title}
                    </Text>
                    <Text style={[styles.historyAuthor, { color: colors.textSecondary }]}>
                      {item.book?.author}
                    </Text>
                    <View style={styles.historyDates}>
                      <Text style={[styles.historyDateText, { color: colors.textSecondary }]}>
                        {formatDate(item.borrowDate)} → {item.returnDate ? formatDate(item.returnDate) : "Aktif"}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.historyBadge,
                    { backgroundColor: isLate ? colors.dangerBg : (isCompleted ? colors.successBg : colors.accentLight) }
                  ]}>
                    <Text style={[
                      styles.historyBadgeText,
                      { color: isLate ? colors.danger : (isCompleted ? colors.success : colors.accent) }
                    ]}>
                      {isLate ? "Terlambat" : (isCompleted ? "Kembali" : "Dipinjam")}
                    </Text>
                  </View>
                </View>
                {index < loanHistory.length - 1 && (
                  <View style={[styles.historyDivider, { backgroundColor: colors.border }]} />
                )}
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 120,
  },

  // Greeting
  greetingContainer: {
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
  },
  greetingGlow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  greetingContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 14,
  },
  greetingLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  greetingName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  greetingSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
  },
  greetingAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickStats: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  quickStatItem: {
    flex: 1,
    alignItems: "center",
  },
  quickStatNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  quickStatLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // Fine Alert
  fineAlert: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  fineAlertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,59,92,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  fineAlertTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  fineAlertAmount: {
    fontSize: 20,
    fontWeight: "800",
  },
  fineAlertDesc: {
    fontSize: 11,
    marginTop: 2,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 14,
    gap: 10,
  },
  sectionIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  // Loan Card
  loanCard: {
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  loanCardTop: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  loanTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  loanAuthor: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  loanCardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  loanDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  loanDateText: {
    fontSize: 12,
  },
  fineRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  fineText: {
    fontSize: 13,
    fontWeight: "700",
  },
  fineCalc: {
    fontSize: 11,
  },
  fineEstText: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Book Card
  booksRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  bookCard: {
    width: 155,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  bookCover: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  bookInfo: {
    padding: 12,
    gap: 3,
  },
  bookGenre: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  bookAuthor: {
    fontSize: 12,
    marginBottom: 4,
  },

  // History
  historyContainer: {
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  historyIndex: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  historyIndexText: {
    fontSize: 14,
    fontWeight: "800",
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  historyAuthor: {
    fontSize: 12,
    marginTop: 1,
  },
  historyDates: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  historyDateText: {
    fontSize: 11,
  },
  historyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  historyBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  historyDivider: {
    height: 1,
    marginHorizontal: 14,
  },
});

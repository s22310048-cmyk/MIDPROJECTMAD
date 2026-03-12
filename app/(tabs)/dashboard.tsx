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

// ── Mock Data ──────────────────────────────────────────────────────────────
const POPULAR_BOOKS = [
  {
    id: 1,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    rating: 4.8,
    cover: "📘",
    genre: "Fiksi",
  },
  {
    id: 2,
    title: "Bumi Manusia",
    author: "Pramoedya A. Toer",
    rating: 4.9,
    cover: "📕",
    genre: "Sejarah",
  },
  {
    id: 3,
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    rating: 4.7,
    cover: "📗",
    genre: "Self-Help",
  },
  {
    id: 4,
    title: "Atomic Habits",
    author: "James Clear",
    rating: 4.9,
    cover: "📙",
    genre: "Produktivitas",
  },
  {
    id: 5,
    title: "Sapiens",
    author: "Yuval N. Harari",
    rating: 4.8,
    cover: "📒",
    genre: "Sains",
  },
];

const ACTIVE_LOANS = [
  {
    id: 1,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    borrowDate: "2026-02-28",
    dueDate: "2026-03-14",
    status: "active",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    borrowDate: "2026-03-01",
    dueDate: "2026-03-15",
    status: "active",
  },
  {
    id: 3,
    title: "Bumi Manusia",
    author: "Pramoedya A. Toer",
    borrowDate: "2026-02-15",
    dueDate: "2026-03-01",
    status: "overdue",
  },
];

const LOAN_HISTORY = [
  {
    id: 1,
    title: "Sapiens",
    author: "Yuval N. Harari",
    borrowDate: "2026-01-10",
    returnDate: "2026-01-24",
    status: "returned",
  },
  {
    id: 2,
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    borrowDate: "2026-01-05",
    returnDate: "2026-01-19",
    status: "returned",
  },
  {
    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    borrowDate: "2025-12-20",
    returnDate: "2026-01-05",
    status: "late",
  },
  {
    id: 4,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    borrowDate: "2025-12-15",
    returnDate: "2025-12-29",
    status: "returned",
  },
  {
    id: 5,
    title: "Educated",
    author: "Tara Westover",
    borrowDate: "2025-12-01",
    returnDate: "2025-12-15",
    status: "returned",
  },
];

const FINE_PER_DAY = 1000; // Rp 1.000 per hari

// ── Helper Functions ───────────────────────────────────────────────────────
function getDaysRemaining(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
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

  const totalFine = ACTIVE_LOANS.reduce((sum, loan) => {
    const days = getDaysRemaining(loan.dueDate);
    if (days < 0) {
      return sum + Math.abs(days) * FINE_PER_DAY;
    }
    return sum;
  }, 0);

  const overdueLoanCount = ACTIVE_LOANS.filter(
    (l) => getDaysRemaining(l.dueDate) < 0
  ).length;

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
            <Text style={styles.greetingName}>Ahmad Rizky</Text>
            <Text style={styles.greetingSubtitle}>
              NIM: 22310048 · Mahasiswa
            </Text>
          </View>
          <View style={styles.greetingAvatar}>
            <Text style={{ fontSize: 28 }}>👤</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>{ACTIVE_LOANS.length}</Text>
            <Text style={styles.quickStatLabel}>Dipinjam</Text>
          </View>
          <View style={[styles.quickStatDivider]} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>{overdueLoanCount}</Text>
            <Text style={styles.quickStatLabel}>Terlambat</Text>
          </View>
          <View style={[styles.quickStatDivider]} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>{LOAN_HISTORY.length}</Text>
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

        {ACTIVE_LOANS.map((loan) => {
          const daysLeft = getDaysRemaining(loan.dueDate);
          const isOverdue = daysLeft < 0;
          const isUrgent = daysLeft >= 0 && daysLeft <= 3;
          const estimatedFine = isOverdue ? Math.abs(daysLeft) * FINE_PER_DAY : 0;

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
              key={loan.id}
              style={[styles.loanCard, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]}
            >
              <View style={styles.loanCardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.loanTitle, { color: colors.text }]} numberOfLines={1}>
                    {loan.title}
                  </Text>
                  <Text style={[styles.loanAuthor, { color: colors.textSecondary }]}>
                    {loan.author}
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

              {!isOverdue && (
                <View style={[styles.fineRow, { backgroundColor: colors.warningBg }]}>
                  <Ionicons name="information-circle-outline" size={14} color={colors.warning} />
                  <Text style={[styles.fineEstText, { color: colors.warning }]}>
                    Estimasi denda jika terlambat 1 hari: {formatCurrency(FINE_PER_DAY)}
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
          {POPULAR_BOOKS.map((book) => (
            <View
              key={book.id}
              style={[styles.bookCard, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]}
            >
              <View style={[styles.bookCover, { backgroundColor: colors.accentLight }]}>
                <Text style={{ fontSize: 36 }}>{book.cover}</Text>
              </View>
              <View style={styles.bookInfo}>
                <Text style={[styles.bookGenre, { color: colors.accent }]}>
                  {book.genre}
                </Text>
                <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={2}>
                  {book.title}
                </Text>
                <Text style={[styles.bookAuthor, { color: colors.textSecondary }]} numberOfLines={1}>
                  {book.author}
                </Text>
                <StarRating rating={book.rating} />
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
          {LOAN_HISTORY.map((item, index) => {
            const isLate = item.status === "late";
            return (
              <View key={item.id}>
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
                      {item.title}
                    </Text>
                    <Text style={[styles.historyAuthor, { color: colors.textSecondary }]}>
                      {item.author}
                    </Text>
                    <View style={styles.historyDates}>
                      <Text style={[styles.historyDateText, { color: colors.textSecondary }]}>
                        {formatDate(item.borrowDate)} → {formatDate(item.returnDate)}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.historyBadge,
                    { backgroundColor: isLate ? colors.dangerBg : colors.successBg }
                  ]}>
                    <Text style={[
                      styles.historyBadgeText,
                      { color: isLate ? colors.danger : colors.success }
                    ]}>
                      {isLate ? "Terlambat" : "Tepat Waktu"}
                    </Text>
                  </View>
                </View>
                {index < LOAN_HISTORY.length - 1 && (
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

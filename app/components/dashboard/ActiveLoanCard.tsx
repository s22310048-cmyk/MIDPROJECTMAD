import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function ActiveLoanCard({ loan, colors, shadowStyle, formatCurrency, FINE_PER_DAY }: any) {
  const { book, daysRemaining: daysLeft, isOverdue, estimatedFine, borrowDate, dueDate } = loan;
  const isUrgent = daysLeft >= 0 && daysLeft <= 3;

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

  const formatDate = (date: number | string) => {
    return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <View style={[styles.loanCard, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle]}>
      <View style={styles.loanCardTop}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.loanTitle, { color: colors.text }]} numberOfLines={1}>
            {book?.title || "Buku Tidak Ditemukan"}
          </Text>
          <Text style={[styles.loanAuthor, { color: colors.textSecondary }]}>
            {book?.author || "-"}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Ionicons name={statusIcon} size={14} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        </View>
      </View>

      <View style={[styles.loanCardBottom, { borderTopColor: colors.border }]}>
        <View style={styles.loanDateRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.loanDateText, { color: colors.textSecondary }]}>
            Pinjam: {formatDate(borrowDate)}
          </Text>
        </View>
        <View style={styles.loanDateRow}>
          <Ionicons name="time-outline" size={14} color={isOverdue ? colors.danger : colors.textSecondary} />
          <Text style={[styles.loanDateText, { color: isOverdue ? colors.danger : colors.textSecondary }]}>
            Batas: {formatDate(dueDate)}
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
}

const styles = StyleSheet.create({
  loanCard: { marginHorizontal: 16, borderRadius: 18, borderWidth: 1, marginBottom: 12, overflow: "hidden" },
  loanCardTop: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  loanTitle: { fontSize: 16, fontWeight: "700" },
  loanAuthor: { fontSize: 13, marginTop: 2 },
  statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4 },
  statusText: { fontSize: 12, fontWeight: "600" },
  loanCardBottom: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
  loanDateRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  loanDateText: { fontSize: 12 },
  fineRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 8, gap: 6 },
  fineText: { fontSize: 13, fontWeight: "700" },
  fineCalc: { fontSize: 11 },
});

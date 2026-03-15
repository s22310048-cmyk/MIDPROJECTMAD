import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function LoanHistoryItem({ item, index, isLast, colors }: any) {
  const isLate = item.status === "late" || item.status === "overdue";

  const formatDate = (date: number | string) => {
    return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <View>
      <View style={styles.historyItem}>
        <View style={[styles.historyIndex, { backgroundColor: isLate ? colors.dangerBg : colors.accentLight }]}>
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
        <View style={[styles.historyBadge, { backgroundColor: isLate ? colors.dangerBg : colors.successBg }]}>
          <Text style={[styles.historyBadgeText, { color: isLate ? colors.danger : colors.success }]}>
            {isLate ? "Terlambat" : "Tepat Waktu"}
          </Text>
        </View>
      </View>
      {!isLast && <View style={[styles.historyDivider, { backgroundColor: colors.border }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  historyItem: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  historyIndex: { width: 32, height: 32, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  historyIndexText: { fontSize: 14, fontWeight: "800" },
  historyTitle: { fontSize: 14, fontWeight: "700" },
  historyAuthor: { fontSize: 12, marginTop: 1 },
  historyDates: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  historyDateText: { fontSize: 11 },
  historyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  historyBadgeText: { fontSize: 10, fontWeight: "700" },
  historyDivider: { height: 1, marginHorizontal: 14 },
});

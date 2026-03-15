import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, SectionList, StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthStore } from "../store/authStore";

import { ActiveLoanCard } from "../components/dashboard/ActiveLoanCard";
import { PopularBookCard } from "../components/dashboard/PopularBookCard";
import { LoanHistoryItem } from "../components/dashboard/LoanHistoryItem";

const FINE_PER_DAY = 1000;

export default function Dashboard() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { userNim } = useAuthStore();
  
  const user = useQuery(
    api.users.getUserByStudentId, 
    userNim ? { studentId: userNim } : "skip"
  );
  
  const activeLoans = useQuery(
    api.borrowings.getActiveByUser, 
    user?._id ? { userId: user._id } : "skip"
  ) || [];
  
  const popularBooks = useQuery(
    api.books.getTopBooks, 
    { limit: 5 }
  ) || [];
  
  const loanHistory = useQuery(
    api.borrowings.getRecentHistory, 
    user?._id ? { userId: user._id, limit: 5 } : "skip"
  ) || [];

  const totalFine = user?.totalFines || 0;
  const overdueLoanCount = activeLoans.filter((l: any) => l.isOverdue).length;

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

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`;

  const renderHeader = () => (
    <View style={{ paddingBottom: 16 }}>
      <View style={[styles.greetingContainer, { backgroundColor: colors.accent, borderColor: colors.border }]}>
        <View style={styles.greetingGlow} />
        <View style={styles.greetingContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingLabel}>Selamat Datang 👋</Text>
            <Text style={styles.greetingName}>{user?.name || "Tamu"}</Text>
            <Text style={styles.greetingSubtitle}>NIM: {user?.nim || "-"} · {user?.role || "Pengguna"}</Text>
          </View>
          <View style={styles.greetingAvatar}>
            <Text style={{ fontSize: 28 }}>{user?.avatarUrl || "👤"}</Text>
          </View>
        </View>

        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>{activeLoans.length}</Text>
            <Text style={styles.quickStatLabel}>Dipinjam</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>{overdueLoanCount}</Text>
            <Text style={styles.quickStatLabel}>Terlambat</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>{loanHistory.length}</Text>
            <Text style={styles.quickStatLabel}>Total Riwayat</Text>
          </View>
        </View>
      </View>

      {totalFine > 0 && (
        <View style={[styles.fineAlert, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}>
          <View style={styles.fineAlertIcon}>
            <Ionicons name="warning" size={22} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.fineAlertTitle, { color: colors.danger }]}>Denda Keterlambatan</Text>
            <Text style={[styles.fineAlertAmount, { color: colors.danger }]}>{formatCurrency(totalFine)}</Text>
            <Text style={[styles.fineAlertDesc, { color: colors.textSecondary }]}>Tarif: {formatCurrency(FINE_PER_DAY)}/hari · {overdueLoanCount} buku terlambat</Text>
          </View>
        </View>
      )}
    </View>
  );

  const sections = [
    { title: "Status Peminjaman Aktif", data: activeLoans.length > 0 ? activeLoans.map(l => ({ type: "loan", data: l })) : [{ type: "empty_loan" }] },
    { title: "Rekomendasi Buku Populer", data: [{ type: "popular", data: popularBooks }] },
    { title: "5 Riwayat Peminjaman Terakhir", data: loanHistory.length > 0 ? loanHistory.map((h, i) => ({ type: "history", data: h, index: i, isLast: i === loanHistory.length - 1 })) : [{ type: "empty_history" }] },
    { title: "Akses Cepat", data: [{ type: "quick_access" }] }
  ];

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.sectionHeader}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {section.title === "Akses Cepat" && (
          <View style={[styles.sectionIconBadge, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="grid" size={16} color={colors.accent} />
          </View>
        )}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case "loan":
        return <ActiveLoanCard loan={item.data} colors={colors} shadowStyle={shadowStyle} formatCurrency={formatCurrency} FINE_PER_DAY={FINE_PER_DAY} />;
      case "empty_loan":
        return <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={{ color: colors.textSecondary }}>Tidak ada peminjaman aktif</Text></View>;
      case "popular":
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.booksRow}>
            {item.data.length === 0 ? <Text style={{ color: colors.textSecondary, marginLeft: 16 }}>Belum ada buku tersedia</Text> : item.data.map((book: any) => <PopularBookCard key={book._id} book={book} colors={colors} shadowStyle={shadowStyle} />)}
          </ScrollView>
        );
      case "history":
        return (
          <View style={[{ marginHorizontal: 16, backgroundColor: colors.card, borderColor: colors.border, borderWidth: item.index === 0 ? 1 : 0, borderBottomWidth: item.isLast ? 1 : 0, borderTopWidth: item.index === 0 ? 1 : 0, borderLeftWidth: 1, borderRightWidth: 1, borderTopLeftRadius: item.index === 0 ? 18 : 0, borderTopRightRadius: item.index === 0 ? 18 : 0, borderBottomLeftRadius: item.isLast ? 18 : 0, borderBottomRightRadius: item.isLast ? 18 : 0 }, shadowStyle as any]}>
             <LoanHistoryItem item={item.data} index={item.index} isLast={item.isLast} colors={colors} />
          </View>
        );
      case "empty_history":
        return <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={{ color: colors.textSecondary }}>Belum ada riwayat peminjaman</Text></View>;
      case "quick_access":
        return (
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity 
              style={[styles.quickAccessItem, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]} 
              onPress={() => router.push("/(user)/katalog" as any)}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: 'rgba(108,99,255,0.1)' }]}>
                <Ionicons name="library" size={24} color={colors.accent} />
              </View>
              <Text style={[styles.quickAccessText, { color: colors.text }]}>Cari Buku</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickAccessItem, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]} 
              onPress={() => router.push("/(user)/tebus_point" as any)}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: 'rgba(255,149,0,0.1)' }]}>
                <Ionicons name="gift" size={24} color="#FF9500" />
              </View>
              <Text style={[styles.quickAccessText, { color: colors.text }]}>Tebus Poin</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickAccessItem, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]} 
              onPress={() => router.push("/(user)/riwayat" as any)}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: 'rgba(0,200,83,0.1)' }]}>
                <Ionicons name="time" size={24} color="#00C853" />
              </View>
              <Text style={[styles.quickAccessText, { color: colors.text }]}>Riwayat</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickAccessItem, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]} 
              onPress={() => router.push("/(user)/Profile_Logout" as any)}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: 'rgba(255,59,92,0.1)' }]}>
                <Ionicons name="person" size={24} color="#FF3B5C" />
              </View>
              <Text style={[styles.quickAccessText, { color: colors.text }]}>Profil</Text>
            </TouchableOpacity>
          </View>
        );
      default: return null;
    }
  };

  return (
    <SectionList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={styles.container}
      sections={sections}
      keyExtractor={(item, index) => item.type + index}
      ListHeaderComponent={renderHeader}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 16, paddingBottom: 40 },
  greetingContainer: { marginHorizontal: 16, borderRadius: 24, overflow: "hidden", marginBottom: 16 },
  greetingGlow: { position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.15)" },
  greetingContent: { flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 14 },
  greetingLabel: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 4 },
  greetingName: { fontSize: 22, fontWeight: "800", color: "#FFFFFF", letterSpacing: 0.3 },
  greetingSubtitle: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4 },
  greetingAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  quickStats: { flexDirection: "row", backgroundColor: "rgba(0,0,0,0.15)", borderBottomLeftRadius: 24, borderBottomRightRadius: 24, paddingVertical: 12, paddingHorizontal: 8 },
  quickStatItem: { flex: 1, alignItems: "center" },
  quickStatNumber: { fontSize: 20, fontWeight: "800", color: "#FFFFFF" },
  quickStatLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  quickStatDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  fineAlert: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 16, gap: 12 },
  fineAlertIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,59,92,0.12)", justifyContent: "center", alignItems: "center" },
  fineAlertTitle: { fontSize: 13, fontWeight: "700", marginBottom: 2 },
  fineAlertAmount: { fontSize: 20, fontWeight: "800" },
  fineAlertDesc: { fontSize: 11, marginTop: 2 },
  sectionHeader: { marginHorizontal: 16, marginBottom: 10, marginTop: 10 },
  sectionTitle: { fontSize: 17, fontWeight: "700", letterSpacing: 0.2 },
  booksRow: { paddingHorizontal: 16, gap: 12, paddingBottom: 16 },
  emptyCard: { marginHorizontal: 16, padding: 20, alignItems: "center", borderRadius: 18, borderWidth: 1, marginBottom: 12 },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  quickAccessItem: {
    width: (Platform.OS === 'web' ? 150 : '48%'),
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  quickAccessIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAccessText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

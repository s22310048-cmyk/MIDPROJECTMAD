import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuthStore } from "../store/authStore";

export default function AdminDashboard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { userNim } = useAuthStore();

  const colors = {
    bg: isDark ? "#0A0A0F" : "#F0F2F8",
    card: isDark ? "#1A1A25" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1A1A2E",
    textSecondary: isDark ? "#9A9AB0" : "#6B6B80",
    accent: "#34C759", // Admin green
    accentLight: isDark ? "rgba(52,199,89,0.15)" : "rgba(52,199,89,0.08)",
    border: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={40} color={colors.accent} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Admin Panel</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Login sebagai ID: {userNim || "Admin"}
        </Text>
      </View>

      <View style={styles.grid}>
        <View style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="book" size={32} color={colors.accent} style={{ marginBottom: 12 }} />
          <Text style={[styles.gridTitle, { color: colors.text }]}>Kelola Buku</Text>
          <Text style={[styles.gridDesc, { color: colors.textSecondary }]}>Tambah, edit, hapus buku</Text>
        </View>
        
        <View style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="swap-horizontal" size={32} color={colors.accent} style={{ marginBottom: 12 }} />
          <Text style={[styles.gridTitle, { color: colors.text }]}>Transaksi</Text>
          <Text style={[styles.gridDesc, { color: colors.textSecondary }]}>Pantau peminjaman</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerCard: { borderRadius: 20, padding: 30, alignItems: "center", borderWidth: 1, marginBottom: 20 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(52,199,89,0.1)", justifyContent: "center", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 6 },
  subtitle: { fontSize: 14 },
  grid: { flexDirection: "row", gap: 16 },
  gridItem: { flex: 1, padding: 20, borderRadius: 16, borderWidth: 1, alignItems: "center" },
  gridTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  gridDesc: { fontSize: 12, textAlign: "center" }
});

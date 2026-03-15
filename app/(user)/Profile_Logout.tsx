import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { handleLogout } from "../../lib/auth/logout";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { userNim } = useAuthStore();
  const user = useQuery(api.users.getUserByNim, userNim ? { nim: userNim } : "skip");

  const colors = {
    bg: isDark ? "#0A0A0F" : "#F0F2F8",
    card: isDark ? "#1A1A25" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1A1A2E",
    textSecondary: isDark ? "#9A9AB0" : "#6B6B80",
    accent: "#6C63FF",
    accentLight: isDark ? "rgba(108,99,255,0.15)" : "rgba(108,99,255,0.08)",
    danger: "#FF3B5C",
    border: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
  };

  const shadowStyle = Platform.OS !== "web" ? {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 12,
    elevation: 4,
  } : {
    boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.05)",
  };

  return (
    <ScrollView style={[{ backgroundColor: colors.bg }]} contentContainerStyle={styles.container}>
      {/* Header Profile */}
      <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle]}>
        <View style={styles.avatarContainer}>
          <Text style={{ fontSize: 40 }}>{user?.avatarUrl || "👤"}</Text>
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>{user?.name || "Memuat..."}</Text>
        <Text style={[styles.userNim, { color: colors.textSecondary }]}>{user?.nim || "-"}</Text>
        <View style={[styles.roleBadge, { backgroundColor: colors.accentLight }]}>
          <Text style={[styles.roleText, { color: colors.accent }]}>{user?.role?.toUpperCase() || "MAHASISWA"}</Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle]}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{user?.totalPoints || 0}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Poin</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle]}>
          <Text style={[styles.statNumber, { color: colors.danger }]}>Rp {user?.totalFines || 0}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Denda</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={[styles.menuList, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle]}>
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
          <View style={[styles.menuIcon, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="settings" size={20} color={colors.accent} />
          </View>
          <Text style={[styles.menuText, { color: colors.text }]}>Pengaturan Akun</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={[styles.menuIcon, { backgroundColor: "rgba(255,59,92,0.12)" }]}>
            <Ionicons name="log-out" size={20} color={colors.danger} />
          </View>
          <Text style={[styles.menuText, { color: colors.danger, fontWeight: "700" }]}>Keluar Aplikasi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  headerCard: { borderRadius: 24, padding: 30, alignItems: "center", borderWidth: 1, marginBottom: 16 },
  avatarContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#E6F4FE", justifyContent: "center", alignItems: "center", marginBottom: 16, shadowColor: "#007AFF", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 },
  userName: { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  userNim: { fontSize: 14, marginBottom: 12 },
  roleBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  roleText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  statsRow: { flexDirection: "row", gap: 16, marginBottom: 24 },
  statBox: { flex: 1, borderRadius: 20, padding: 20, alignItems: "center", borderWidth: 1 },
  statNumber: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: "500" },
  menuList: { borderRadius: 24, borderWidth: 1, paddingHorizontal: 6 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 18, paddingHorizontal: 14 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 14 },
  menuText: { flex: 1, fontSize: 16, fontWeight: "600" },
});

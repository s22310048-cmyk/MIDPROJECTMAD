import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";

export default function AdminDashboard() {
  const router = useRouter();
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

  const shadowStyle = Platform.OS !== "web" ? {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowRadius: 12,
    elevation: 6,
  } : {
    boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.08)",
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={40} color={colors.accent} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Admin Panel</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          ID Admin: {userNim || "Admin"}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Menu Utama</Text>
      <View style={styles.grid}>
        <TouchableOpacity 
          style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]}
          onPress={() => router.push("/(admin)/books/" as any)}
        >
          <View style={[styles.gridIcon, { backgroundColor: 'rgba(52,199,89,0.1)' }]}>
            <Ionicons name="book" size={28} color={colors.accent} />
          </View>
          <Text style={[styles.gridTitle, { color: colors.text }]}>Kelola Buku</Text>
          <Text style={[styles.gridDesc, { color: colors.textSecondary }]}>Tambah & Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]}
          onPress={() => router.push("/(admin)/transactions/" as any)}
        >
          <View style={[styles.gridIcon, { backgroundColor: 'rgba(52,199,89,0.1)' }]}>
            <Ionicons name="swap-horizontal" size={28} color={colors.accent} />
          </View>
          <Text style={[styles.gridTitle, { color: colors.text }]}>Transaksi</Text>
          <Text style={[styles.gridDesc, { color: colors.textSecondary }]}>Pantau Stok</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Sistem & Pengaturan</Text>
      <View style={styles.grid}>
        <TouchableOpacity style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]}>
          <View style={[styles.gridIcon, { backgroundColor: 'rgba(0,122,255,0.1)' }]}>
            <Ionicons name="people" size={28} color="#007AFF" />
          </View>
          <Text style={[styles.gridTitle, { color: colors.text }]}>User</Text>
          <Text style={[styles.gridDesc, { color: colors.textSecondary }]}>Daftar Member</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle as any]}
          onPress={() => router.push("/(admin)/adminlogout" as any)}
        >
          <View style={[styles.gridIcon, { backgroundColor: 'rgba(255,59,92,0.1)' }]}>
            <Ionicons name="log-out" size={28} color="#FF3B5C" />
          </View>
          <Text style={[styles.gridTitle, { color: colors.text }]}>Keluar</Text>
          <Text style={[styles.gridDesc, { color: colors.textSecondary }]}>Logout Sesi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerCard: { borderRadius: 24, padding: 30, alignItems: "center", borderWidth: 1, marginBottom: 24 },
  iconContainer: { width: 80, height: 80, borderRadius: 30, backgroundColor: "rgba(52,199,89,0.1)", justifyContent: "center", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 6 },
  subtitle: { fontSize: 14, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, marginLeft: 4 },
  grid: { flexDirection: "row", gap: 16 },
  gridItem: { flex: 1, padding: 20, borderRadius: 20, borderWidth: 1, alignItems: "center", gap: 8 },
  gridIcon: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  gridTitle: { fontSize: 15, fontWeight: "700" },
  gridDesc: { fontSize: 11, textAlign: "center" }
});

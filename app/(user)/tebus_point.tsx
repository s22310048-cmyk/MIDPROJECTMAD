import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export default function TebusPointScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    bg: isDark ? "#0A0A0F" : "#F0F2F8",
    card: isDark ? "#1A1A25" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1A1A2E",
    textSecondary: isDark ? "#9A9AB0" : "#6B6B80",
    accentLight: isDark ? "rgba(108,99,255,0.15)" : "rgba(108,99,255,0.08)",
    accent: "#6C63FF",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
        <View style={[styles.iconBox, { backgroundColor: colors.accentLight }]}>
          <Ionicons name="gift-outline" size={48} color={colors.accent} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Tebus Poin</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Fitur ini sedang dalam tahap pengembangan. Kumpulkan terus poin dari peminjaman buku!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  emptyCard: { width: "100%", padding: 40, borderRadius: 32, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 8 },
  iconBox: { width: 100, height: 100, borderRadius: 50, justifyContent: "center", alignItems: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 15, textAlign: "center", lineHeight: 24 },
});

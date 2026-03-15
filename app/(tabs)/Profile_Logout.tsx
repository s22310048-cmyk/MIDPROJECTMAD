import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useAuthStore } from "../store/authStore";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileLogout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { logout } = useAuthStore();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? "#0A0A0F" : "#F0F2F8" },
      ]}
    >
      <View style={[styles.content, { backgroundColor: isDark ? "#1A1A25" : "#FFF" }]}>
        <View style={styles.avatarPlaceholder}>
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>
        <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
          Profile
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? "#9A9AB0" : "#666" }]}>
          Kelola profil dan akun Anda
        </Text>
        
        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    padding: 30,
    borderRadius: 32,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(108,99,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 40,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B5C",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 10,
  },
  logoutText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  }
});

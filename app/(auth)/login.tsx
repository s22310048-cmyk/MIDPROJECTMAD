import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function LoginScreen() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Define hardcoded credentials
  const adminCredentials = { nim: "admin1", role: "admin" as const };
  const userCredentials = { nim: "22310048", role: "mahasiswa" as const };

  const handleLogin = async (type: "admin" | "user") => {
    setIsLoading(true);
    try {
      if (type === "admin") {
        login(adminCredentials.nim, adminCredentials.role);
        router.replace("/(admin)/dashboard");
      } else {
        login(userCredentials.nim, userCredentials.role);
        router.replace("/(user)/dashboard");
      }
    } catch (error) {
      Alert.alert("Login Gagal", "Terjadi kesalahan saat mencoba masuk.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="library" size={80} color="#007AFF" />
        </View>

        <Text style={styles.title}>Library System</Text>
        <Text style={styles.subtitle}>
          Silahkan pilih metode masuk untuk melanjutkan ke sistem perpustakaan.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.userButton]}
            onPress={() => handleLogin("user")}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons name="person" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Login as User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.adminButton]}
            onPress={() => handleLogin("admin")}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons name="shield-checkmark" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Login as Admin</Text>
          </TouchableOpacity>
        </View>

        {isLoading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 32,
    backgroundColor: "#E6F4FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  userButton: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
  },
  adminButton: {
    backgroundColor: "#34C759",
    shadowColor: "#34C759",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../convex/_generated/api";
import { useAuthStore } from "./store/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { login: authLogin } = useAuthStore();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Convex Mutation
  const login = useMutation(api.users.loginUser);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Username dan password wajib diisi");
      return;
    }

    setIsLoading(true);
    console.log("[Login] Attempting login for:", username.trim());
    
    try {
      const cleanUsername = username.trim().toLowerCase();
      const user = await login({ username: cleanUsername, password });
      
      console.log("[Login] Login successful for user:", user.name, "role:", user.role);
      authLogin(user.studentId, user.role as "student" | "admin");
      Alert.alert("Berhasil", `Selamat datang kembali, ${user.name}!`);
      
      // Role-based redirect
      if (user.role === "admin") {
        router.replace("/(admin)/dashboard" as any);
      } else {
        router.replace("/(user)/dashboard" as any);
      }
    } catch (error: any) {
      console.error("[Login] Error:", error);
      Alert.alert("Gagal Login", error.message || "Username atau password salah");
    } finally {
      setIsLoading(false);
    }
  };

  const colors = {
    bg: isDark ? "#0A0A0F" : "#F0F2F8",
    card: isDark ? "#1A1A25" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1A1A2E",
    textSecondary: isDark ? "#9A9AB0" : "#666",
    accent: "#6C63FF",
    accentLight: "rgba(108,99,255,0.1)",
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="library" size={40} color={colors.accent} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Library Management System</Text>
          
        </View>

        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>Masuk ke Akun</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Username</Text>
            <View style={[styles.inputContainer, { backgroundColor: isDark ? "#252535" : "#F8F9FE" }]}>
              <Ionicons name="person-outline" size={20} color={colors.accent} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Masukkan username"
                placeholderTextColor={isDark ? "#555" : "#CCC"}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: isDark ? "#252535" : "#F8F9FE" }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.accent} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Masukkan password"
                placeholderTextColor={isDark ? "#555" : "#CCC"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => router.push("/forgot-password" as any)}
            style={styles.forgotBtn}
          >
            <Text style={[styles.forgotText, { color: colors.accent }]}>Lupa Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginBtn, { backgroundColor: colors.accent }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginBtnText}>
              {isLoading ? "Memproses..." : "Masuk Sekarang"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Belum punya akun?</Text>
          <TouchableOpacity onPress={() => router.push("/register" as any)}>
            <Text style={[styles.registerText, { color: colors.accent }]}> Buat Akun Baru</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    padding: 24,
    borderRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
  },
  loginBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
  },
  registerText: {
    fontSize: 14,
    fontWeight: "700",
  },
});

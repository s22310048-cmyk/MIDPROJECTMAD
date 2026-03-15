import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"student" | "admin">("student");

  const register = useMutation(api.users.registerUser);

  const handleRegister = async () => {
    const { name, studentId, username, email, password, confirmPassword } = formData;
    
    console.log("[Register] Attempting registration for:", username);

    if (!name || !studentId || !username || !email || !password) {
      Alert.alert("Error", "Semua kolom wajib diisi");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Konfirmasi password tidak cocok");
      return;
    }

    setIsLoading(true);
    try {
      console.log("[Register] Sending data to Convex...");
      await register({
        name: name.trim(),
        studentId: studentId.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });
      console.log("[Register] Registration successful!");
      Alert.alert("Berhasil", "Akun berhasil dibuat! Silakan login.");
      router.replace("/login");
    } catch (error: any) {
      console.error("[Register] Error:", error);
      Alert.alert(
        "Gagal Registrasi", 
        error.message || "Terdapat kesalahan saat mendaftar. Pastikan koneksi internet aktif."
      );
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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Daftar Akun</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Bergabung dengan LibriHub hari ini
          </Text>
        </View>

        <View style={styles.rolePicker}>
          <TouchableOpacity 
            style={[styles.roleOption, role === "student" && { backgroundColor: colors.accent }]}
            onPress={() => setRole("student")}
          >
            <Ionicons name="school-outline" size={20} color={role === "student" ? "#FFF" : colors.textSecondary} />
            <Text style={[styles.roleText, { color: role === "student" ? "#FFF" : colors.textSecondary }]}>Mahasiswa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.roleOption, role === "admin" && { backgroundColor: colors.accent }]}
            onPress={() => setRole("admin")}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color={role === "admin" ? "#FFF" : colors.textSecondary} />
            <Text style={[styles.roleText, { color: role === "admin" ? "#FFF" : colors.textSecondary }]}>Admin</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Nama Lengkap</Text>
            <View style={[styles.inputContainer, { backgroundColor: isDark ? "#252535" : "#F8F9FE" }]}>
              <Ionicons name="person-outline" size={20} color={colors.accent} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Ex: Ahmad Rizky"
                placeholderTextColor={isDark ? "#555" : "#CCC"}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>NIM / Student ID</Text>
            <View style={[styles.inputContainer, { backgroundColor: isDark ? "#252535" : "#F8F9FE" }]}>
              <Ionicons name="card-outline" size={20} color={colors.accent} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Ex: 22310048"
                placeholderTextColor={isDark ? "#555" : "#CCC"}
                value={formData.studentId}
                onChangeText={(text) => setFormData({...formData, studentId: text})}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Username</Text>
            <View style={[styles.inputContainer, { backgroundColor: isDark ? "#252535" : "#F8F9FE" }]}>
              <Ionicons name="at-outline" size={20} color={colors.accent} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Ex: rizkyahead"
                placeholderTextColor={isDark ? "#555" : "#CCC"}
                value={formData.username}
                onChangeText={(text) => setFormData({...formData, username: text})}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <View style={[styles.inputContainer, { backgroundColor: isDark ? "#252535" : "#F8F9FE" }]}>
              <Ionicons name="mail-outline" size={20} color={colors.accent} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Ex: rizky@univ.id"
                placeholderTextColor={isDark ? "#555" : "#CCC"}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                keyboardType="email-address"
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
                placeholder="••••••••"
                placeholderTextColor={isDark ? "#555" : "#CCC"}
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Konfirmasi Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: isDark ? "#252535" : "#F8F9FE" }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.accent} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={isDark ? "#555" : "#CCC"}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.registerBtn, { backgroundColor: colors.accent }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerBtnText}>
              {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Sudah punya akun?</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={[styles.loginLabel, { color: colors.accent }]}> Masuk</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    marginBottom: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  rolePicker: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  roleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(108,99,255,0.2)",
    gap: 8,
  },
  roleText: {
    fontSize: 14,
    fontWeight: "700",
  },
  form: {
    padding: 24,
    borderRadius: 32,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  registerBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  registerBtnText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
  },
  loginLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
});

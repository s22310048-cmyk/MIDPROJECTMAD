import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BookButton from "../components/BookButton";

export default function TebusPoint() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedBook, setSelectedBook] = useState(
    "Membangun Karakter Mahasiswa",
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completionCode, setCompletionCode] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const books = [
    {
      id: "1",
      title: "Membangun Karakter Mahasiswa",
      icon: "people-outline",
      color: isDark ? "#60a5fa" : "#3b82f6",
    },
    {
      id: "2",
      title: "Leadership Mahasiswa",
      icon: "leaderboard-outline",
      color: isDark ? "#34d399" : "#10b981",
    },
    {
      id: "3",
      title: "Etika Mahasiswa",
      icon: "shield-checkmark-outline",
      color: isDark ? "#a78bfa" : "#8b5cf6",
    },
  ];
  const selectedBookData = books.find((b) => b.title === selectedBook);

  const handleSubmit = () => {
    Keyboard.dismiss();

    if (name.trim() === "" || nim.trim() === "") {
      Alert.alert(
        "Data belum lengkap",
        "Silakan isi nama dan NIM terlebih dahulu.",
      );
      return;
    }

    if (summary.trim().length < 50) {
      Alert.alert("Ringkasan terlalu singkat", "Minimal 50 karakter.");
      return;
    }

    const code =
      "TB-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    setCompletionCode(code);
    setHistory([...history, code]);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setName("");
    setNim("");
    setSummary("");
    setIsSubmitted(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDark ? "#000" : "#f4f4f4" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled" // Penting: Agar tombol bisa dipencet saat keyboard terbuka
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
              Tebus Poin Ibadah
            </Text>
            <Text
              style={[styles.subtitle, { color: isDark ? "#ccc" : "#666" }]}
            >
              Kompensasi dengan membaca dan merangkum buku
            </Text>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? "#1c1c1c" : "#fff" },
            ]}
          >
            <View style={styles.cardHeader}>
              <Ionicons
                name="book-outline"
                size={28}
                color={
                  selectedBookData?.color || (isDark ? "#4da6ff" : "#0066cc")
                }
              />
              <Text
                style={[styles.cardTitle, { color: isDark ? "#fff" : "#000" }]}
              >
                Pilih Buku
              </Text>
            </View>

            <View style={styles.booksGrid}>
              {books.map((book) => (
                <BookButton
                  key={book.id}
                  title={book.title}
                  icon={book.icon}
                  isSelected={selectedBook === book.title}
                  onPress={() => setSelectedBook(book.title)}
                  color={book.color}
                  dark={isDark}
                />
              ))}
            </View>

            <LinearGradient
              colors={
                selectedBookData
                  ? [
                      selectedBookData.color + "80",
                      selectedBookData.color + "40",
                    ]
                  : [isDark ? "#333" : "#f0f0f0", isDark ? "#444" : "#e0e0e0"]
              }
              style={styles.selectedBookBanner}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={
                  selectedBookData?.color || (isDark ? "#4da6ff" : "#0066cc")
                }
              />
              <Text
                style={[
                  styles.bookTitle,
                  {
                    color:
                      selectedBookData?.color ||
                      (isDark ? "#4da6ff" : "#0066cc"),
                  },
                ]}
              >
                ✓ Buku terpilih: {selectedBook}
              </Text>
            </LinearGradient>
          </View>

          {!isSubmitted ? (
            <View
              style={[
                styles.card,
                { backgroundColor: isDark ? "#1c1c1c" : "#fff" },
              ]}
            >
              <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
                Nama Mahasiswa
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? "#2c2c2c" : "#f9f9f9",
                    color: isDark ? "#fff" : "#000",
                    borderColor: isDark ? "#555" : "#ccc",
                  },
                ]}
                placeholder="Masukkan Nama"
                placeholderTextColor={isDark ? "#888" : "#999"}
                value={name}
                onChangeText={setName}
                returnKeyType="next"
              />

              <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
                NIM
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? "#2c2c2c" : "#f9f9f9",
                    color: isDark ? "#fff" : "#000",
                    borderColor: isDark ? "#555" : "#ccc",
                  },
                ]}
                placeholder="Masukkan NIM"
                placeholderTextColor={isDark ? "#888" : "#999"}
                value={nim}
                onChangeText={setNim}
                keyboardType="numeric"
                returnKeyType="next"
              />

              <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
                Ringkasan Buku
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: isDark ? "#2c2c2c" : "#f9f9f9",
                    color: isDark ? "#fff" : "#000",
                    borderColor: isDark ? "#555" : "#ccc",
                  },
                ]}
                placeholder="Tulis ringkasan minimal 50 karakter..."
                placeholderTextColor={isDark ? "#888" : "#999"}
                multiline
                textAlignVertical="top"
                value={summary}
                onChangeText={setSummary}
                blurOnSubmit={false}
              />

              <Text
                style={{
                  alignSelf: "flex-end",
                  marginBottom: 15,
                  color: isDark ? "#aaa" : "#555",
                  fontSize: 12,
                }}
              >
                {summary.length} / 50 karakter
              </Text>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor:
                      name && nim && summary.length >= 50
                        ? "#0066cc"
                        : isDark
                          ? "#444"
                          : "#ccc",
                  },
                ]}
                onPress={handleSubmit}
                disabled={!(name && nim && summary.length >= 50)}
              >
                <Text style={styles.buttonText}>Kirim Ringkasan</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
                <Text style={styles.buttonText}>Reset Form</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                styles.successCard,
                { backgroundColor: isDark ? "#1c1c1c" : "#fff" },
              ]}
            >
              <Ionicons name="checkmark-circle" size={60} color="#4caf50" />
              <Text
                style={[
                  styles.successTitle,
                  { color: isDark ? "#fff" : "#000" },
                ]}
              >
                Berhasil!
              </Text>

              <Text
                style={[
                  styles.successText,
                  { color: isDark ? "#ccc" : "#555" },
                ]}
              >
                Kode validasi Anda:
              </Text>

              <View
                style={[
                  styles.codeBox,
                  { backgroundColor: isDark ? "#333" : "#eef6ff" },
                ]}
              >
                <Text
                  style={[
                    styles.codeText,
                    { color: isDark ? "#4da6ff" : "#0066cc" },
                  ]}
                >
                  {completionCode}
                </Text>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={resetForm}>
                <Text style={styles.buttonText}>Tebus Lagi</Text>
              </TouchableOpacity>
            </View>
          )}

          {history.length > 0 && (
            <View
              style={[
                styles.card,
                { backgroundColor: isDark ? "#1c1c1c" : "#fff" },
              ]}
            >
              <Text
                style={[
                  styles.historyTitle,
                  { color: isDark ? "#fff" : "#000" },
                ]}
              >
                Riwayat Tebus Poin
              </Text>

              {history.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <Ionicons
                    name="pricetag-outline"
                    size={16}
                    color={isDark ? "#bbb" : "#666"}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{ color: isDark ? "#ddd" : "#333", fontSize: 16 }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  card: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  bookTitle: {
    marginTop: 15,
    fontWeight: "600",
    fontSize: 15,
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  selectedBookBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    height: 120,
    fontSize: 15,
    marginBottom: 5,
  },
  submitButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: "#e63946",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  successCard: {
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
  },
  successText: {
    marginTop: 10,
    fontSize: 16,
  },
  codeBox: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 20,
  },
  codeText: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
});

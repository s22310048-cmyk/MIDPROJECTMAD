import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ManageBooks() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const books = useQuery(api.books.getAllBooks, {}) || [];
  const addBook = useMutation(api.books.addBook);
  const updateBook = useMutation(api.books.updateBook);
  const deleteBook = useMutation(api.books.deleteBook);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [genre, setGenre] = useState("");
  const [totalCopies, setTotalCopies] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = {
    bg: isDark ? "#0A0A0F" : "#F0F2F8",
    card: isDark ? "#1A1A25" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1A1A2E",
    textSecondary: isDark ? "#9A9AB0" : "#6B6B80",
    accent: "#34C759",
    accentLight: isDark ? "rgba(52,199,89,0.15)" : "rgba(52,199,89,0.08)",
    danger: "#FF3B30",
    border: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
  };

  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setAuthor("");
    setIsbn("");
    setGenre("");
    setTotalCopies("1");
    setModalVisible(true);
  };

  const openEditModal = (book: any) => {
    setEditingId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn);
    setGenre(book.genre);
    setTotalCopies(book.totalCopies.toString());
    setModalVisible(true);
  };

  const handleDelete = (id: any) => {
    Alert.alert("Hapus Buku", "Yakin ingin menghapus buku ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => deleteBook({ bookId: id }) }
    ]);
  };

  const handleSave = async () => {
    if (!title || !author || !isbn) {
      Alert.alert("Gagal", "Isi judul, penulis, dan ISBN");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateBook({
          bookId: editingId,
          title,
          author,
          genre,
          totalCopies: parseInt(totalCopies) || 1
        });
      } else {
        await addBook({
          title,
          author,
          isbn,
          genre,
          totalCopies: parseInt(totalCopies) || 1,
          description: "Ditambahkan oleh Admin",
          publishYear: new Date().getFullYear(),
        });
      }
      setModalVisible(false);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.bookCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
        <Text style={[styles.bookAuthor, { color: colors.textSecondary }]}>{item.author}</Text>
        <View style={styles.badgeRow}>
          <Text style={[styles.badge, { backgroundColor: colors.accentLight, color: colors.accent }]}>
            Stok: {item.availableCopies}/{item.totalCopies}
          </Text>
          <Text style={[styles.badge, { backgroundColor: colors.border, color: colors.textSecondary }]}>
            {item.isbn}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(item)}>
          <Ionicons name="pencil" size={20} color={colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item._id)}>
          <Ionicons name="trash" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Kelola Buku</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.accent }]} onPress={openAddModal}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{editingId ? "Edit Buku" : "Tambah Buku"}</Text>
            
            <TextInput style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholder="Judul Buku" placeholderTextColor={colors.textSecondary} value={title} onChangeText={setTitle} />
            <TextInput style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholder="Penulis" placeholderTextColor={colors.textSecondary} value={author} onChangeText={setAuthor} />
            <TextInput style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholder="ISBN" placeholderTextColor={colors.textSecondary} value={isbn} onChangeText={setIsbn} />
            <TextInput style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholder="Genre" placeholderTextColor={colors.textSecondary} value={genre} onChangeText={setGenre} />
            <TextInput style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholder="Total Kopi" placeholderTextColor={colors.textSecondary} keyboardType="number-pad" value={totalCopies} onChangeText={setTotalCopies} />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)} disabled={isSubmitting}>
                <Text style={{ color: colors.textSecondary, fontWeight: "600" }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={handleSave} disabled={isSubmitting}>
                {isSubmitting ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.saveText}>Simpan</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, paddingTop: 40 },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  addButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 4 },
  addText: { color: "#FFF", fontWeight: "700" },
  bookCard: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  bookTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  bookAuthor: { fontSize: 13, marginBottom: 8 },
  badgeRow: { flexDirection: "row", gap: 8 },
  badge: { fontSize: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontWeight: "600", overflow: "hidden" },
  actions: { flexDirection: "row", gap: 8, marginLeft: 16 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(0,0,0,0.05)", justifyContent: "center", alignItems: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 16 },
  modalContent: { borderRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 20 },
  input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, marginBottom: 12 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 12 },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 12, justifyContent: "center" },
  saveBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, justifyContent: "center" },
  saveText: { color: "#FFF", fontWeight: "700" }
});

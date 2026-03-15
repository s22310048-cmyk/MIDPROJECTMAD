import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { generateCSVAndDownload } from "../../../features/transactions/TransactionReport";

export default function AdminTransactionHistoryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "borrow" | "return" | "fine_payment">("all");

  // Fetch data from Convex
  const transactions = useQuery(api.transactions.getTransactions, {
    filterType: filterType === "all" ? undefined : filterType,
    searchQuery: searchQuery || undefined,
  });

  const handleDownload = () => {
    if (!transactions || transactions.length === 0) return;
    generateCSVAndDownload(transactions);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "borrow":
        return <Ionicons name="book-outline" size={20} color="#007AFF" />;
      case "return":
        return <Ionicons name="return-down-back-outline" size={20} color="#34C759" />;
      case "fine_payment":
        return <Ionicons name="cash-outline" size={20} color="#FF9500" />;
      default:
        return <Ionicons name="document-text-outline" size={20} color="#8E8E93" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const renderTransactionItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.typeBadge}>
          {getTransactionIcon(item.transaction_type)}
          <Text style={styles.typeText}>
            {item.transaction_type === "borrow"
              ? "Peminjaman"
              : item.transaction_type === "return"
              ? "Pengembalian"
              : "Bayar Denda"}
          </Text>
        </View>
        <Text style={styles.dateText}>
          {new Date(item.transaction_date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color="#8E8E93" />
          <Text style={styles.infoText}>{item.user_name}</Text>
        </View>
        {item.book_title && (
          <View style={styles.infoRow}>
            <Ionicons name="library-outline" size={16} color="#8E8E93" />
            <Text style={styles.infoText}>{item.book_title}</Text>
          </View>
        )}
        {item.fine_amount > 0 && (
          <View style={styles.infoRow}>
            <Ionicons name="alert-circle-outline" size={16} color="#FF3B30" />
            <Text style={[styles.infoText, { color: "#FF3B30", fontWeight: "600" }]}>
              Denda: {formatCurrency(item.fine_amount)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={[styles.statusBadge, item.status === "completed" ? styles.statusSuccess : styles.statusPending]}>
          <Text style={[styles.statusText, item.status === "completed" ? styles.textSuccess : styles.textPending]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Transaksi</Text>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
          disabled={!transactions || transactions.length === 0}
        >
          <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          <Text style={styles.downloadText}>Unduh Laporan</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama pengguna atau buku..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8E8E93"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Badges */}
      <View style={styles.filterContainer}>
        {(["all", "borrow", "return", "fine_payment"] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterBadge, filterType === type && styles.filterBadgeActive]}
            onPress={() => setFilterType(type)}
          >
            <Text style={[styles.filterText, filterType === type && styles.filterTextActive]}>
              {type === "all"
                ? "Semua"
                : type === "borrow"
                ? "Pinjam"
                : type === "return"
                ? "Kembali"
                : "Denda"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <View style={styles.listContainer}>
        {transactions === undefined ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
        ) : transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={60} color="#C7C7CC" />
            <Text style={styles.emptyText}>Tidak ada riwayat transaksi</Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item._id}
            renderItem={renderTransactionItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  downloadText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 16,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E5EA",
  },
  filterBadgeActive: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
  filterTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    paddingBottom: 12,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  dateText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  cardBody: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 15,
    color: "#3A3A3C",
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusSuccess: {
    backgroundColor: "#E8F8F0",
  },
  statusPending: {
    backgroundColor: "#FFF4E5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  textSuccess: {
    color: "#34C759",
  },
  textPending: {
    color: "#FF9500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8E8E93",
  },
});

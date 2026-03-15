import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Ionicons key={`full-${i}`} name="star" size={12} color="#FFD700" />
    );
  }
  if (hasHalf) {
    stars.push(
      <Ionicons key="half" name="star-half" size={12} color="#FFD700" />
    );
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {stars}
      <Text style={{ fontSize: 11, color: "#8E8E93", marginLeft: 4 }}>
        {rating}
      </Text>
    </View>
  );
}

export function PopularBookCard({ book, colors, shadowStyle }: any) {
  return (
    <View style={[styles.bookCard, { backgroundColor: colors.card, borderColor: colors.border }, shadowStyle]}>
      <View style={[styles.bookCover, { backgroundColor: colors.accentLight }]}>
        {book.coverUrl ? (
          <Text style={{ fontSize: 36 }}>{book.coverUrl}</Text>
        ) : (
          <Text style={{ fontSize: 36 }}>📖</Text>
        )}
      </View>
      <View style={styles.bookInfo}>
        <Text style={[styles.bookGenre, { color: colors.accent }]}>
          {book.genre}
        </Text>
        <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={[styles.bookAuthor, { color: colors.textSecondary }]} numberOfLines={1}>
          {book.author}
        </Text>
        <StarRating rating={book.rating || 0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookCard: { width: 155, borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  bookCover: { height: 100, justifyContent: "center", alignItems: "center" },
  bookInfo: { padding: 12, gap: 3 },
  bookGenre: { fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  bookTitle: { fontSize: 14, fontWeight: "700", lineHeight: 18 },
  bookAuthor: { fontSize: 12, marginBottom: 4 },
});

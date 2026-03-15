import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/authStore";

interface ProfileStats {
  points: number;
  booksBorrowed: number;
}

interface MenuItemProps {
  icon: string;
  text: string;
  subtext?: string;
  color?: string;
  onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, subtext, color = Colors.light.tint, onPress }) => {
  const theme = useColorScheme();
  const textColor = useThemeColor({}, "text");
  const secondaryColor = theme === "dark" ? Colors.dark.icon : Colors.light.icon;

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>

      <View style={styles.menuContent}>
        <Text style={[styles.menuText, { color: textColor }]}>{text}</Text>
        {subtext && <Text style={[styles.menuSubText, { color: secondaryColor }]}>{subtext}</Text>}
      </View>

      <Ionicons name="chevron-forward" size={20} color={secondaryColor} />
    </TouchableOpacity>
  );
};

export default function ProfileLogout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { logout } = useAuthStore();

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  const [fadeAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
  }, []);

  const handleLogout = () => {
    Alert.alert("Konfirmasi Logout", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        onPress: () => {
          logout();
          router.replace("/");
        },
        style: "destructive",
      },
    ]);
  };

  const profileStats: ProfileStats = {
    points: 150,
    booksBorrowed: 5,
  };

  const handleMenuPress = (action: string) => {
    Alert.alert("Fitur", `${action} ditekan`);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.profileSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.avatarContainer}>
          {/* ICON PROFIL TANPA FOTO */}
          <Ionicons
            name="person-circle-outline"
            size={120}
            color={isDark ? "#aaa" : "#555"}
          />
        </View>

        <Text style={[styles.name, { color: textColor }]}>John Doe</Text>

        <Text style={styles.email}>john.doe@example.com</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: tintColor }]}>
              {profileStats.points}
            </Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: tintColor }]}>
              {profileStats.booksBorrowed}
            </Text>
            <Text style={styles.statLabel}>Books</Text>
          </View>
        </View>
      </Animated.View>

      <View style={[styles.card, { backgroundColor }]}>
        <MenuItem
          icon="person-outline"
          text="Edit Profil"
          subtext="Update data pribadi"
          onPress={() => handleMenuPress("Edit Profil")}
        />

        <View style={styles.divider} />

        <MenuItem
          icon="settings-outline"
          text="Pengaturan"
          subtext="Preferensi aplikasi"
          onPress={() => handleMenuPress("Pengaturan")}
        />

        <View style={styles.divider} />

        <MenuItem
          icon="help-circle-outline"
          text="Bantuan"
          subtext="FAQ & Support"
          color="#FF9500"
          onPress={() => handleMenuPress("Bantuan")}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={26} color="#fff" />
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 40,
  },

  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  name: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },

  email: {
    fontSize: 16,
    marginBottom: 32,
  },

  statsRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },

  statCard: {
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 80,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },

  statLabel: {
    fontSize: 12,
    opacity: 0.8,
  },

  card: {
    borderRadius: 20,
    marginBottom: 40,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  menuContent: {
    flex: 1,
  },

  menuText: {
    fontSize: 17,
    fontWeight: "600",
  },

  menuSubText: {
    fontSize: 14,
  },

  divider: {
    height: 1,
    opacity: 0.3,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: "#ff3b30",
  },

  logoutText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    marginLeft: 12,
  },
});
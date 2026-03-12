import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: isDark ? "#8E8E93" : "#C7C7CC",
        tabBarStyle: {
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderTopColor: isDark ? "#3A3A3C" : "#E5E5EA",
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          marginBottom: 40,
          paddingTop: 8,
          paddingHorizontal: 8,
          ...(Platform.OS !== "web" && {
            elevation: 12,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 8,
          }),
        },
        headerStyle: {
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderBottomColor: isDark ? "#3A3A3C" : "#E5E5EA",
          borderBottomWidth: 1,
          ...(Platform.OS !== "web" && {
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.2 : 0.05,
            shadowRadius: 4,
          }),
        },
        headerTintColor: isDark ? "#FFFFFF" : "#000000",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
          letterSpacing: 0.5,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          borderRadius: 12,
          marginHorizontal: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons name="home-outline" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Jelajah",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons name="compass-outline" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="katalog_pencarian_buku"
        options={{
          title: "Katalog",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons name="book-outline" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons name="time-outline" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tebus_point"
        options={{
          title: "Tebus Point",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons name="gift-outline" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Profile_Logout"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons name="person-outline" size={size} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    borderRadius: 10,
  },
  iconContainerFocused: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
});

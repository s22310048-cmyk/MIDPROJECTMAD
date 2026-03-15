import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";

export default function AdminTabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#1A1A25" : "#FFFFFF",
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#34C759", // Green for Admin context
        tabBarInactiveTintColor: isDark ? "#9A9AB0" : "#A0A0B0",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Admin",
          tabBarIcon: ({ color }) => <Ionicons name="shield-checkmark" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="books/index"
        options={{
          title: "Kelola Buku",
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions/index"
        options={{
          title: "Transaksi",
          tabBarIcon: ({ color }) => <Ionicons name="swap-horizontal" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="adminlogout"
        options={{
          title: "Keluar",
          tabBarIcon: ({ color }) => <Ionicons name="log-out" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

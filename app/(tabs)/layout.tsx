import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, View } from "react-native";

import Dashboard from "./dashboard";
import Explore from "./explore";
import KatalogPencarianBuku from "./katalog_pencarian_buku";
import ProfileLogout from "./Profile_Logout";
import Riwayat from "./riwayat";
import TebasPoint from "./tebus_point";

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const tabScreenOptions = (name: string, label: string, icon: string) => ({
    title: label,
    tabBarIcon: ({
      color,
      size,
      focused,
    }: {
      color: string;
      size: number;
      focused: boolean;
    }) => (
      <View
        style={[styles.iconContainer, focused && styles.iconContainerFocused]}
      >
        <Ionicons name={icon as any} size={size} color={color} />
      </View>
    ),
    headerShown: true,
    headerTitle: label,
    tabBarLabelStyle: {
      fontSize: 11,
      marginTop: 4,
      fontWeight: "600",
    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: isDark ? "#8E8E93" : "#C7C7CC",
        tabBarStyle: {
          backgroundColor: isDark ? "#ffffff" : "#FFFFFF",
          borderTopColor: isDark ? "#3A3A3C" : "#E5E5EA",
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          marginBottom: 40,
          paddingTop: 8,
          paddingHorizontal: 8,
          elevation: 12,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        headerStyle: {
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderBottomColor: isDark ? "#3A3A3C" : "#E5E5EA",
          borderBottomWidth: 1,
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 4,
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
        tabBarLabel: undefined,
      }}
    >
      <Tab.Screen
        name="dashboard"
        component={Dashboard}
        options={tabScreenOptions("dashboard", "Dashboard", "home-outline")}
      />
      <Tab.Screen
        name="explore"
        component={Explore}
        options={tabScreenOptions("explore", "Jelajah", "compass-outline")}
      />
      <Tab.Screen
        name="katalog"
        component={KatalogPencarianBuku}
        options={tabScreenOptions("katalog", "Katalog", "book-outline")}
      />
      <Tab.Screen
        name="riwayat"
        component={Riwayat}
        options={tabScreenOptions("riwayat", "Riwayat", "time-outline")}
      />
      <Tab.Screen
        name="tebus_point"
        component={TebasPoint}
        options={tabScreenOptions("tebus_point", "Tebus Point", "gift-outline")}
      />
      <Tab.Screen
        name="profile"
        component={ProfileLogout}
        options={tabScreenOptions("profile", "Profile", "person-outline")}
      />
    </Tab.Navigator>
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

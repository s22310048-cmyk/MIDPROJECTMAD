import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ConvexProvider } from "convex/react";
import { convexClient } from "./lib/convexClient";
import { useAuthStore } from "./store/authStore";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { userNim, userRole } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Redirect Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentGroup = segments[0] || "";
      const isAuthPath = ["login", "register", "forgot-password", "index", "(auth)", "(tabs)"].includes(currentGroup);
      const isUserGroup = currentGroup === "(user)";
      const isAdminGroup = currentGroup === "(admin)";

      if (!userNim) {
        // Not logged in -> go to login (unless already on auth page)
        if (!isAuthPath) {
          router.replace("/login" as any);
        }
      } else {
        // Logged in
        if (isAuthPath) {
          // On auth page -> redirect to correct dashboard based on role
          if (userRole === "admin") {
            router.replace("/(admin)/dashboard" as any);
          } else {
            router.replace("/(user)/dashboard" as any);
          }
        } else if (userRole === "student" && isAdminGroup) {
          // Student trying to access admin area -> redirect to user dashboard
          router.replace("/(user)/dashboard" as any);
        } else if (userRole === "admin" && isUserGroup) {
          // Admin trying to access user area -> redirect to admin dashboard
          router.replace("/(admin)/dashboard" as any);
        }
      }
    }, 1);

    return () => clearTimeout(timer);
  }, [userNim, userRole, segments]);

  return (
    <ConvexProvider client={convexClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(user)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </ConvexProvider>
  );
}

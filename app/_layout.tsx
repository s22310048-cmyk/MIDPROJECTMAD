import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ConvexProvider } from "convex/react";
import { convexClient } from "./lib/convexClient";
import { useAuthStore } from "./store/authStore";

export default function RootLayout() {
<<<<<<< HEAD
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { userStudentId } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Redirect Logic
  useEffect(() => {
    // Delay slightly to ensure navigation is ready
    const timer = setTimeout(() => {
      const inAuthGroup = segments[0] === "(tabs)";
      const isAuthPath = ["login", "register", "forgot-password"].includes(segments[0] || "");
      
      if (!userStudentId && !isAuthPath) {
        // Not logged in and not on an auth page -> go to login
        router.replace("/login");
      } else if (userStudentId && isAuthPath) {
        // Logged in and on an auth page -> go to dashboard
        router.replace("/(tabs)/dashboard");
      }
    }, 1);

    return () => clearTimeout(timer);
  }, [userStudentId, segments]);

  return (
    <ConvexProvider client={convexClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="(tabs)" />
=======
  return (
    <ConvexProvider client={convexClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(user)" />
        <Stack.Screen name="(admin)" />
>>>>>>> df3d2279fa1317ff3f70367447745f3900eab54c
      </Stack>
    </ConvexProvider>
  );
}

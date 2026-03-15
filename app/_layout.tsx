import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";
import React from "react";
import { ConvexProvider } from "convex/react";
import { convexClient } from "./lib/convexClient";

export default function RootLayout() {
  return (
    <ConvexProvider client={convexClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(user)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </ConvexProvider>
  );
}

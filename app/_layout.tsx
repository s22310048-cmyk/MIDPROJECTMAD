import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";
import React from "react";
import { ConvexProvider } from "convex/react";
import { convexClient } from "./lib/convexClient";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ConvexProvider client={convexClient}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ConvexProvider>
  );
}

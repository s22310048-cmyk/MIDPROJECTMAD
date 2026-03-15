import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "./store/authStore";

export default function Index() {
  const { userNim, userRole } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Add a slight delay to ensure Zustand has hydrated from AsyncStorage
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (!userNim || !userRole) {
      router.replace("/(auth)/login");
    } else if (userRole === "admin") {
      router.replace("/(admin)/dashboard");
    } else {
      router.replace("/(user)/dashboard");
    }
  }, [userNim, userRole, isReady]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

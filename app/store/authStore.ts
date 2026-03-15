import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  userNim: string | null;
  userRole: "student" | "admin" | null;
  setUserNim: (nim: string | null) => void;
  setUserRole: (role: "student" | "admin" | null) => void;
  login: (nim: string, role: "student" | "admin") => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userNim: null,
      userRole: null,
      setUserNim: (nim) => set({ userNim: nim }),
      setUserRole: (role) => set({ userRole: role }),
      login: (nim, role) => set({ userNim: nim, userRole: role }),
      logout: () => set({ userNim: null, userRole: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

import { useState, useEffect } from "react";

// Simple observer pattern to keep state in sync
let currentNim: string | null = "22310048";
const listeners = new Set<(nim: string | null) => void>();

export const useAuthStore = () => {
  const [nim, setNim] = useState(currentNim);

  useEffect(() => {
    const listener = (newNim: string | null) => setNim(newNim);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setUserNim = (newNim: string | null) => {
    currentNim = newNim;
    listeners.forEach((l) => l(newNim));
  };

  const logout = () => setUserNim(null);

  return { userNim: nim, setUserNim, logout };
};

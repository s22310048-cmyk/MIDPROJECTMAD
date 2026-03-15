import { useState, useEffect } from "react";

// Simple observer pattern to keep state in sync
let currentStudentId: string | null = null;
const listeners = new Set<(id: string | null) => void>();

export const useAuthStore = () => {
  const [studentId, setStudentId] = useState(currentStudentId);

  useEffect(() => {
    const listener = (newId: string | null) => setStudentId(newId);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setUserStudentId = (newId: string | null) => {
    currentStudentId = newId;
    listeners.forEach((l) => l(newId));
  };

  const logout = () => setUserStudentId(null);

  return { userStudentId: studentId, setUserStudentId, logout };
};

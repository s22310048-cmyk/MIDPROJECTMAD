import { router } from 'expo-router';
import { useAuthStore } from '../../app/store/authStore';

/**
 * handleLogout clears the authenticated user's session data
 * and navigates them back to the login screen.
 */
export const handleLogout = async () => {
  try {
    // Clear the authentication state in Zustand.
    // Zustand's persist middleware will automatically sync this to AsyncStorage.
    useAuthStore.getState().logout();

    // Redirect to login screen
    router.replace('/(auth)/login');
  } catch (error) {
    console.error('Error during logout:', error);
    router.replace('/(auth)/login');
  }
};


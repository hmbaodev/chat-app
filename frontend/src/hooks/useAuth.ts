import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/authService';

export const useAuth = () => {
  const { currentUser, isInitializing } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeAuthAction = async <T,>(action: () => Promise<T>): Promise<T | null> => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await action();
      return result;
    } catch (err: any) {
      // Provide user-friendly error messages based on Firebase error codes
      let errorMessage = 'An error occurred during authentication.';
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        default:
          if (err.message) errorMessage = err.message;
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = (name: string, email: string, password: string) => 
    executeAuthAction(() => authService.signUp(name, email, password));

  const signIn = (email: string, password: string) => 
    executeAuthAction(() => authService.signIn(email, password));

  const resetPassword = (email: string) => 
    executeAuthAction(() => authService.resetPassword(email));

  const logout = () => 
    executeAuthAction(() => authService.logout());

  return {
    currentUser,
    isInitializing, // True while Firebase checks if user is logged in on load
    isLoading,      // True while an auth network request (sign in/up) is happening
    error,
    signUp,
    signIn,
    resetPassword,
    logout
  };
};

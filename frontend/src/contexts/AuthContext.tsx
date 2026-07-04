import { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { userService } from '../services/userService';

interface AuthContextType {
  currentUser: User | null;
  isInitializing: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isInitializing: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          await userService.syncUser();
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};

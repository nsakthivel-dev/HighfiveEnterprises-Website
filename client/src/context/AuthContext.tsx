import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: FirebaseUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Predefined admin emails
const ADMIN_EMAILS = [
  'ajjigova111@gmail.com',
  'hiteshreem2007@gmail.com',
  'aaminathamiz@gmail.com',
  'fazeelaofficial1609@gmail.com',
  'hariharan.b17706@gmail.com',
  'nsakthiveldev@gmail.com'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase Auth state changed:', firebaseUser?.email);
      
      if (firebaseUser) {
        // Check if user is in our admin list
        if (firebaseUser.email && ADMIN_EMAILS.includes(firebaseUser.email)) {
          console.log('User is authorized admin:', firebaseUser.email);
          setUser(firebaseUser);
          setIsAuthenticated(true);
        } else {
          console.log('User is not authorized:', firebaseUser.email);
          // Sign out if not an admin
          await firebaseSignOut(auth);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting Firebase login for:', email);
      
      // Check if email is in our predefined list
      if (!ADMIN_EMAILS.includes(email)) {
        console.log('Email not in admin list:', email);
        return { success: false, error: 'Access denied. This email is not authorized.' };
      }

      // Attempt to sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        console.log('Login successful for:', userCredential.user.email);
        // Auth state listener handles the state updates
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Firebase Login error:', error);
      let message = 'Login failed';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please try again later.';
      }
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out from Firebase');
      await firebaseSignOut(auth);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
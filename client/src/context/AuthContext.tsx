import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Predefined admin emails (passwords will be handled by Supabase)
const ADMIN_EMAILS = [
  'ajjigova111@gmail.com',
  'hiteshreem2007@gmail.com',
  'aaminathamiz@gmail.com',
  'fazeelaofficial1609@gmail.com',
  'hariharan.b17706@gmail.com',
  'nsakthiveldev@gmail.com'
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session);
        if (session?.user) {
          // Check if user is in our admin list
          if (ADMIN_EMAILS.includes(session.user.email || '')) {
            console.log('User is authorized admin:', session.user.email);
            setIsAuthenticated(true);
            setUser(session.user);
          } else {
            console.log('User is not authorized:', session.user.email);
            // Sign out if not an admin
            await supabase.auth.signOut();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          console.log('No active session');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session);
      if (session?.user) {
        // Check if user is in our admin list
        if (ADMIN_EMAILS.includes(session.user.email || '')) {
          console.log('User is authorized admin:', session.user.email);
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          console.log('User is not authorized:', session.user.email);
          // Sign out if not an admin
          supabase.auth.signOut();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      // Check if email is in our predefined list
      if (!ADMIN_EMAILS.includes(email)) {
        console.log('Email not in admin list:', email);
        return { success: false, error: 'Access denied. This email is not authorized.' };
      }

      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Supabase login result:', { data, error });

      if (error) {
        console.log('Login error:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('Login successful for:', data.user.email);
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true };
      }

      console.log('Login failed - no user data');
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.log('Login exception:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out');
      await supabase.auth.signOut();
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
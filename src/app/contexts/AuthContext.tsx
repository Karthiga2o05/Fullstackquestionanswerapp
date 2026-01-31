import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/app/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, role: 'ADMIN' | 'USER') => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('xcyber_token');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          if (response.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('xcyber_token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const register = async (name: string, email: string, password: string, role: 'ADMIN' | 'USER') => {
    try {
      const response = await authAPI.register({ name, email, password, role });
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, message: 'Registration successful' };
      }
      
      return { success: false, message: response.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading }}>
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
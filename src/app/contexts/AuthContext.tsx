import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string, role: 'ADMIN' | 'USER') => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('xcyber_user');
    const storedToken = localStorage.getItem('xcyber_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const register = async (username: string, email: string, password: string, role: 'ADMIN' | 'USER') => {
    // Get existing users
    const usersStr = localStorage.getItem('xcyber_users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    // Check if email already exists
    if (users.some((u: any) => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      username,
      email,
      password, // In production, this would be hashed
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('xcyber_users', JSON.stringify(users));

    return { success: true, message: 'Registration successful' };
  };

  const login = async (email: string, password: string) => {
    // Get existing users
    const usersStr = localStorage.getItem('xcyber_users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    // Find user
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (!foundUser) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Create user session
    const sessionUser: User = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role,
    };

    // Generate mock JWT token
    const token = `jwt_${Date.now()}_${foundUser.id}`;

    // Store in localStorage
    localStorage.setItem('xcyber_user', JSON.stringify(sessionUser));
    localStorage.setItem('xcyber_token', token);

    setUser(sessionUser);
    setIsAuthenticated(true);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('xcyber_user');
    localStorage.removeItem('xcyber_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
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

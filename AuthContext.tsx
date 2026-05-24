import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';
import { demoUser, demoAdmin } from '@/data/products';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('nova-user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('nova-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    if (email === 'admin@nova.com' && password === 'admin123') {
      setUser(demoAdmin);
      localStorage.setItem('nova-user', JSON.stringify(demoAdmin));
      return true;
    }
    if (email === 'user@nova.com' && password === 'user123') {
      setUser(demoUser);
      localStorage.setItem('nova-user', JSON.stringify(demoUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    const newUser: User = {
      _id: `u_${Date.now()}`,
      name,
      email,
      role: 'user',
      addresses: [],
      preferences: { style: [], colors: [], sizes: [], categories: [] },
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('nova-user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nova-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

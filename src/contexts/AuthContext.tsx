import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (phone: string, password: string, name?: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('Saffari_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    try {
      // Check for admin credentials first
      if (phone === 'admin' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin',
          phone: 'admin',
          name: 'Administrator',
          email: 'admin@Saffari.com',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('Saffari_user', JSON.stringify(adminUser));
        return { success: true };
      }

      // Check customer database
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error || !data) {
        return { success: false, error: 'Invalid phone number or password' };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, data.password_hash);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid phone number or password' };
      }

      const userData: User = {
        id: data.id,
        phone: data.phone,
        name: data.name,
        email: data.email,
        role: 'user'
      };

      setUser(userData);
      localStorage.setItem('Saffari_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (phone: string, password: string, name?: string, email?: string) => {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', phone)
        .single();

      if (existingUser) {
        return { success: false, error: 'Phone number already registered' };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create new user
      const { data, error } = await supabase
        .from('customers')
        .insert({
          phone,
          password_hash: passwordHash,
          name: name || null,
          email: email || null
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      const userData: User = {
        id: data.id,
        phone: data.phone,
        name: data.name,
        email: data.email,
        role: 'user'
      };

      setUser(userData);
      localStorage.setItem('Saffari_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('Saffari_user');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
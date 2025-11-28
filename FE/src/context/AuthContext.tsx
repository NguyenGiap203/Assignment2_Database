// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axiosClient from '../api/axiosClient';

interface UserProfile {
  id: string;
  AccountName: string;
  name: string;
  role: 'Admin' | 'Teacher' | 'Student' | 'User';
  email: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 1. Kiểm tra session khi App khởi động (F5)
  useEffect(() => {
    const checkAuthOnMount = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axiosClient.get(`/Auth/Validate?token=${token}`);
          if (response.data.success) {
            setUser({
              id: response.data.userId || '',
              AccountName: response.data.username,
              name: response.data.fullname || response.data.username,
              role: response.data.role === 'Admin' ? 'Admin' : 'User',
              email: '',
            });
          } else {
            localStorage.removeItem('authToken');
            setUser(null);
          }
        } catch (error) {
          console.error('Validate failed', error);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setIsCheckingAuth(false);
    };
    checkAuthOnMount();
  }, []);

  // 2. Hàm Login
  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await axiosClient.post('/Auth/Login', { username, password });
      if (response.data.success) {
        const data = response.data;
        // Lưu token
        localStorage.setItem('authToken', data.token);
        
        // Cập nhật State Global ngay lập tức
        setUser({
          id: data.userId || '',
          AccountName: data.username,
          name: data.fullname || data.username,
          role: data.role === 'Admin' ? 'Admin' : 'User',
          email: '',
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  }, []);

  // 3. Hàm Logout
  const logout = useCallback(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        axiosClient.post('/Auth/Logout', { token }).catch(console.error);
    }
    localStorage.removeItem('authToken');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isCheckingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
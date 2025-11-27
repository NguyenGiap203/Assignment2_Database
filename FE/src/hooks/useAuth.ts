// hooks/useAuth.ts

import { useState, useCallback } from 'react';

interface UserProfile {
  id: string;
  name: string;
  role: 'Admin' | 'Teacher' | 'Student';
  email: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const defaultUser: UserProfile = {
  id: 'USR00001',
  name: 'Nguyễn Văn A',
  role: 'Admin',
  email: 'admin.a@lms.com'
};

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<UserProfile | null>(defaultUser);
  const isAuthenticated = !!user;

  const login = useCallback(async (username: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)); 

    if (username === 'admin' && password === 'admin') {
      setUser(defaultUser);
      localStorage.setItem('authToken', 'mock_admin_token');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authToken');
  }, []);

  return { user, isAuthenticated, login, logout };
};
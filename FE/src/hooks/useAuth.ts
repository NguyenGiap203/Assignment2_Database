// hooks/useAuth.ts (ĐÃ SỬA LỖI BỎ QUA ĐĂNG NHẬP)

import { useState, useCallback, useEffect } from 'react';

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
  isCheckingAuth: boolean;
}

const defaultUser: UserProfile = {
  id: 'USR00001',
  name: 'Nguyễn Văn A',
  role: 'Admin',
  email: 'admin.a@lms.com'
};

export const useAuth = (): AuthContextType => {
  // Khởi tạo trạng thái ban đầu là null (chưa đăng nhập)
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const isAuthenticated = !!user;

  // Khôi phục phiên làm việc từ Local Storage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Giả lập: Nếu có token, thiết lập lại user profile
      setUser(defaultUser);
    }
    setIsCheckingAuth(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    // await new Promise(resolve => setTimeout(resolve, 500)); 

    if (username === 'sManager' && password === 'sManager') {
      setUser(defaultUser);
      // Lưu token/flag vào Local Storage để giữ phiên
      localStorage.setItem('authToken', 'mock_admin_token'); 
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authToken'); // Xóa token khi đăng xuất
  }, []);

  return { user, isAuthenticated, login, logout, isCheckingAuth};
};
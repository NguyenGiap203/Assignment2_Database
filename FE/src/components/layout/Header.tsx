// components/layout/Header.tsx

import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Xóa trạng thái đăng nhập và token
    navigate('/login'); // <<< Chuyển hướng ngay lập tức đến trang login
  };
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      {/* Nút Toggle Sidebar và Tên dự án */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 hidden md:block">
          LMS Admin Portal
        </h1>
      </div>

      {/* Hành động bên phải (Thông báo, Người dùng) */}
      <div className="flex items-center space-x-4">
        {/* Nút Thông báo */}
        <button 
          className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Avatar Người dùng */}
        <div className="flex items-center space-x-2 cursor-pointer group">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src="https://via.placeholder.com/150" 
            alt="Admin Avatar"
          />
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            Admin Name
          </span>
        </div>

        {/* Nút Logout */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-1 hidden md:inline">Đăng xuất</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
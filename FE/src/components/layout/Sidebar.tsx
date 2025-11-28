// components/layout/Sidebar.tsx

import React from 'react';
import { LayoutDashboard, Users, BookOpen, BarChart2, MessageSquare, ListChecks } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean; 
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isSidebarOpen: boolean; 
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isSidebarOpen }) => {
  const isActive = window.location.pathname.startsWith(to); 
  
  return (
    <a 
      href={to} 
      className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 
        ${isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
        }
        ${!isSidebarOpen ? 'justify-center w-full' : ''} 
      `}
    >
      {icon}
      <span className={`ml-3 font-medium ${!isSidebarOpen ? 'hidden' : 'block'}`}>
        {label}
      </span>
    </a>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/users', icon: <Users className="w-5 h-5" />, label: 'Quản lý Người dùng' },
    { to: '/courses', icon: <BookOpen className="w-5 h-5" />, label: 'Quản lý Khóa học' },
    { to: '/exercises', icon: <ListChecks className="w-5 h-5" />, label: 'Bài tập bắt buộc' },
    { to: '/posts', icon: <MessageSquare className="w-5 h-5" />, label: 'Bài chia sẻ' },
    { to: '/reports', icon: <BarChart2 className="w-5 h-5" />, label: 'Báo cáo Doanh thu' }, // <<< MỤC MỚI
  ];

  return (
    <div className={`
      ${isOpen ? 'w-full' : 'w-16'} 
      bg-white min-h-screen p-4 flex flex-col transition-all duration-300
    `}>
      {/* Logo/Tên dự án */}
      <div className={`
        text-2xl font-extrabold text-blue-600 mb-8 px-2 overflow-hidden whitespace-nowrap 
        ${!isOpen ? 'hidden sm:block text-center' : 'block'}
      `}>
        {isOpen ? 'Elearning' : 'E'}
      </div>
      
      {/* Menu */}
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} isSidebarOpen={isOpen} />
        ))}
      </nav>
      
      {/* Footer/Version */}
      {isOpen && (
        <div className="mt-auto pt-4 border-t border-gray-100 text-xs text-gray-400 px-2">
          &copy; 2024 LMS.
        </div>
      )}
    </div>
  );
};

export default Sidebar;
// components/layout/MainLayout.tsx

import React, { useState } from 'react';
import Header from './Header'; 
import Sidebar from './Sidebar'; 

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 -ml-64 sm:w-16 sm:ml-0'
        } bg-white border-r border-gray-200 shadow-lg fixed sm:relative z-20`}
      >
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
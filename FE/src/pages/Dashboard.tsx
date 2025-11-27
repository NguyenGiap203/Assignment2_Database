// pages/Dashboard.tsx

import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Users, BookOpen, BarChart2, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
  <div className={`p-6 bg-white rounded-xl shadow-lg flex items-center space-x-4 border-l-4 ${color}`}>
    <div className={`p-3 rounded-full ${color.replace('border-', 'bg-')}/10 text-${color.replace('border-', '').replace('l-4 ', '').replace('-500', '-600')}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);


const Dashboard: React.FC = () => {
  const { user } = useAuth(); 

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng, {user?.name} 👋</h1>
      <p className="text-gray-600 mb-8">Tổng quan hoạt động của hệ thống LMS.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="w-6 h-6" />} 
          title="Tổng Học viên" 
          value="1,250" 
          color="border-blue-500" 
        />
        <StatCard 
          icon={<BookOpen className="w-6 h-6" />} 
          title="Khóa học đang mở" 
          value="45" 
          color="border-green-500" 
        />
        <StatCard 
          icon={<BarChart2 className="w-6 h-6" />} 
          title="Bài tập chưa duyệt" 
          value="12" 
          color="border-yellow-500" 
        />
        <StatCard 
          icon={<MessageSquare className="w-6 h-6" />} 
          title="Bài viết vi phạm" 
          value="5" 
          color="border-red-500" 
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg h-96 flex items-center justify-center">
        <p className="text-gray-500">Khu vực hiển thị Biểu đồ/Báo cáo</p>
      </div>

    </MainLayout>
  );
};

export default Dashboard; // <<<<< EXPORT DEFAULT
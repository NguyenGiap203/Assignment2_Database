// src/pages/Dashboard.tsx

import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Users, BookOpen, GraduationCap, MessageSquare, TrendingUp, UserPlus, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDashboardData } from '../hooks/useDashboardData';
import { formatDate } from '../utils/format';

// Component con cho Stat Card
const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string; color: string }> = ({ icon, title, value, color }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform hover:scale-105">
    <div className={`p-4 rounded-full ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
      {/* Lưu ý: Tailwind cần class đầy đủ để purgeCSS hoạt động, nên ta hardcode style ở component cha hoặc dùng style object */}
      <div className={color.replace('bg-', 'text-').replace('-100', '-600')}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    totalStudents, totalTeachers, totalCourses, totalPosts, 
    topStudents, popularCourses, recentUsers, loading 
  } = useDashboardData();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen text-blue-600">
          Đang tải dữ liệu tổng quan...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Xin chào, {user?.name || 'Admin'} 👋</h1>
        <p className="text-gray-500">Đây là báo cáo tổng quan hệ thống hôm nay.</p>
      </div>

      {/* 1. KHỐI THỐNG KÊ (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<Users className="w-6 h-6" />} 
          title="Tổng Học viên" 
          value={totalStudents} 
          color="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          icon={<GraduationCap className="w-6 h-6" />} 
          title="Tổng Giảng viên" 
          value={totalTeachers} 
          color="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          icon={<BookOpen className="w-6 h-6" />} 
          title="Khóa học" 
          value={totalCourses} 
          color="bg-green-100 text-green-600" 
        />
        <StatCard 
          icon={<MessageSquare className="w-6 h-6" />} 
          title="Bài thảo luận" 
          value={totalPosts} 
          color="bg-orange-100 text-orange-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. KHÓA HỌC NỔI BẬT (Chiếm 2 cột) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-red-500" /> Khóa học phổ biến nhất
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-gray-100">
                  <th className="pb-3 font-medium">Tên khóa học</th>
                  <th className="pb-3 font-medium">Giảng viên</th>
                  <th className="pb-3 font-medium text-center">Học viên</th>
                  <th className="pb-3 font-medium text-center">Đánh giá</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {popularCourses.map((course: any) => (
                  <tr key={course.courseID} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-700">{course.courseName}</td>
                    <td className="py-3 text-gray-500">{course.teacher?.user?.fullName || 'N/A'}</td>
                    <td className="py-3 text-center">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium text-xs">
                        {course.numStudents}
                      </span>
                    </td>
                    <td className="py-3 text-center text-yellow-500 font-bold flex justify-center items-center">
                      {course.averageRating.toFixed(1)} <Star className="w-3 h-3 ml-1 fill-current" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. THÀNH VIÊN MỚI (Chiếm 1 cột) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-blue-500" /> Thành viên mới
          </h3>
            <div className="space-y-4">
              {recentUsers.map((u: any) => (
                <div key={u.userID} className="flex items-center space-x-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                    {u.fullName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{u.fullName}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(u.enrollmentDate)}
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
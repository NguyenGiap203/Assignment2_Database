// App.tsx (Chỉ thay đổi phần routing)

import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Thêm import cho các thành phần mới
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserList = lazy(() => import('./pages/user/UserList'));
const UserDetail = lazy(() => import('./pages/user/UserDetail'));
const CourseList = lazy(() => import('./pages/course/courseList'));
const CourseDetail = lazy(() => import( './pages/course/courseDetail'));
const ExerciseList = lazy(() => import( './pages/exercise/ExerciseList'));
const PostList = lazy(() => import( './pages/post/PostList'));
const RevenueReport = lazy(() => import( './pages/RevenueReport'));
const LoginPage = lazy(() => import( './pages/LoginPage'));
const Statistics = lazy(() => import('./pages/Statistics'));
import { useAuth } from './hooks/useAuth';

const LoadingFallback: React.FC = () => (
    <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-blue-600">Đang tải trang...</p>
    </div>
);

// Component Wrapper để bảo vệ route Admin
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isCheckingAuth } = useAuth();
    if (isCheckingAuth) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-blue-600">Đang kiểm tra phiên làm việc...</p>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        // Nếu chưa đăng nhập, chuyển hướng đến trang login
        return <Navigate to="/login" replace />;
    }
    // Tùy chọn: Thêm kiểm tra vai trò nếu user.role !== 'Admin'
    return <>{children}</>;
};


const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Route đăng nhập công khai */}
          <Route path="/login" element={<LoginPage />} />

          {/* Các Route cần bảo vệ bởi ProtectedRoute */}
          <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/users/:id" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />

          <Route path="/courses" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
          <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />

          <Route path="/exercises" element={<ProtectedRoute><ExerciseList /></ProtectedRoute>} />
          <Route path="/posts" element={<ProtectedRoute><PostList /></ProtectedRoute>} />

          <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
          
          <Route path="/reports" element={<ProtectedRoute><RevenueReport /></ProtectedRoute>} />
          {/* Route 404 */}
          <Route path="*" element={<div className="p-8 text-center text-red-500">404 - Không tìm thấy trang</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
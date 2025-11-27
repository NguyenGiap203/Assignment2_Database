// App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import tất cả các Pages (Đã sửa lỗi TS2306 bằng cách đảm bảo các file này có export default)
import Dashboard from './pages/Dashboard';
import UserList from './pages/user/UserList';
import UserDetail from './pages/user/UserDetail';
import CourseList from './pages/course/CourseList';
import CourseDetail from './pages/course/CourseDetail';
import ExerciseList from './pages/exercise/ExerciseList';
import PostList from './pages/post/PostList';

// Giả lập màn hình đăng nhập
const Login: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold">LOGIN PAGE (DEMO)</h1>
        <p className="mt-4">Sử dụng Hook useAuth để bảo vệ các Route Admin.</p>
    </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* Các Route chính trong Admin Portal */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Quản lý Người dùng */}
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetail />} />

        {/* Quản lý Khóa học */}
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />

        {/* Quản lý Bài tập */}
        <Route path="/exercises" element={<ExerciseList />} />

        {/* Quản lý Bài chia sẻ */}
        <Route path="/posts" element={<PostList />} />

        {/* Route 404 */}
        <Route path="*" element={<div className="p-8 text-center text-red-500">404 - Không tìm thấy trang</div>} />
      </Routes>
    </Router>
  );
};

export default App; // Rất quan trọng!
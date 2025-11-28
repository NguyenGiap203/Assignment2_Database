// pages/user/UserDetail.tsx (Đã cập nhật logic Update)

import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import UserForm from '../../components/forms/UserForm'; // Import UserForm
import { ArrowLeft, Edit } from 'lucide-react';

// ... (Định nghĩa kiểu dữ liệu User nếu cần)
interface User {
  UserID: string;
  FullName: string;
  Email: string;
  Role: 'Admin' | 'Teacher' | 'Student';
  PhoneNumber: string;
  AccountState: boolean;
  EnrollmentDate: string;
}

const UserDetail: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Giả lập dữ liệu chi tiết từ API (thay vì fetch thực)
  const initialUser: User = {
    FullName: 'Phạm Minh C (Học viên)',
    Email: 'student.c@lms.com',
    Role: 'Student',
    AccountState: true,
    EnrollmentDate: '2024-03-10',
    UserID: 'USR00003',
    PhoneNumber: '0907778899'
  };

  const handleUpdate = (formData: User) => {
    console.log('Cập nhật người dùng:', formData);
    setIsSubmitting(true);
    // Giả lập API call
    setTimeout(() => {
        alert(`Cập nhật thành công User: ${formData.FullName}! (Mocked)`);
        setIsSubmitting(false);
        setIsEditing(false); // Quay lại chế độ xem
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Chi tiết Người dùng: {initialUser.UserID}</h1>
        <Button variant="secondary" onClick={() => window.history.back()}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-lg">
        {!isEditing ? (
          <>
            <div className="flex justify-end mb-4">
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                <Edit className="w-5 h-5 mr-2" /> Sửa thông tin
              </Button>
            </div>

            {/* Hiển thị chi tiết (View) */}
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div><span className="font-medium">Họ tên:</span> {initialUser.FullName}</div>
              <div><span className="font-medium">Email:</span> {initialUser.Email}</div>
              <div><span className="font-medium">Vai trò:</span> {initialUser.Role}</div>
              <div><span className="font-medium">Số điện thoại:</span> {initialUser.PhoneNumber}</div>
              <div><span className="font-medium">Trạng thái:</span> {initialUser.AccountState ? 'Hoạt động' : 'Đã bị Ban'}</div>
              <div><span className="font-medium">Ngày tham gia:</span> {initialUser.EnrollmentDate}</div>
            </div>
          </>
        ) : (
          /* Chế độ Sửa (Update) */
          <UserForm 
            initialData={initialUser} 
            onSubmit={handleUpdate} 
            onCancel={() => setIsEditing(false)} 
            isSubmitting={isSubmitting}
          />
        )}
      </div>

    </MainLayout>
  );
};

export default UserDetail;
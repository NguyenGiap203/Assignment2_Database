// pages/user/UserDetail.tsx (Đã cập nhật logic Update)

import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import UserForm from '../../components/forms/UserForm'; // Import UserForm
import { ArrowLeft, Edit } from 'lucide-react';
import { formatDate } from '../../utils/format'; // Import formatDate

// ... (Định nghĩa kiểu dữ liệu User nếu cần) - Đã đồng bộ với SQL
interface User {
  UserID: string;
  AccountName: string; // Thêm AccountName
  AccountPassword?: string;
  FullName: string;
  Email: string;
  Role: 'Admin' | 'Teacher' | 'Student';
  PhoneNumber: string;
  Nation?: string; // Thêm Nation
  Province?: string; // Thêm Province
  Ward?: string; // Thêm Ward
  AccountState: boolean;
  EnrollmentDate: string;
}

const UserDetail: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Giả lập dữ liệu chi tiết từ API (thay vì fetch thực) - Đã đồng bộ thêm AccountName và địa chỉ
  const initialUser: User = {
    UserID: 'USR00003',
    AccountName: 'student_pro', // Thêm AccountName
    FullName: 'Phạm Minh C (Học viên)',
    Email: 'student.c@lms.com',
    Role: 'Student',
    AccountState: true,
    EnrollmentDate: '2024-03-10',
    PhoneNumber: '0907778899',
    Nation: 'Việt Nam',
    Province: 'Hồ Chí Minh',
    Ward: 'Quận 1',
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
              <div><span className="font-medium">Tên tài khoản:</span> {initialUser.AccountName}</div>
              <div><span className="font-medium">Email:</span> {initialUser.Email}</div>
              <div><span className="font-medium">Vai trò:</span> {initialUser.Role}</div>
              <div><span className="font-medium">Số điện thoại:</span> {initialUser.PhoneNumber}</div>
              <div><span className="font-medium">Quốc gia:</span> {initialUser.Nation || 'N/A'}</div>
              <div><span className="font-medium">Tỉnh/TP:</span> {initialUser.Province || 'N/A'}</div>
              <div><span className="font-medium">Phường/Xã:</span> {initialUser.Ward || 'N/A'}</div>
              <div><span className="font-medium">Trạng thái:</span> {initialUser.AccountState ? 'Hoạt động' : 'Đã bị Ban'}</div>
              <div><span className="font-medium">Ngày tham gia:</span> {formatDate(initialUser.EnrollmentDate)}</div>
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
// pages/user/UserDetail.tsx

import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import { ArrowLeft, Ban } from 'lucide-react';

const UserDetail: React.FC = () => {
  const user = {
    FullName: 'Phạm Minh C (Học viên)',
    Email: 'student.c@lms.com',
    Role: 'Student',
    AccountState: true,
    EnrollmentDate: '2024-03-10',
    UserID: 'USR00003',
    PhoneNumber: '0907778899'
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Chi tiết Người dùng: {user.UserID}</h1>
        <Button variant="secondary" onClick={() => window.history.back()}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-end mb-4 space-x-3">
          <Button variant="secondary">Sửa Vai trò</Button>
          <Button variant={user.AccountState ? 'danger' : 'primary'}>
            <Ban className="w-5 h-5 mr-2" />
            {user.AccountState ? 'Ban Tài khoản' : 'Kích hoạt lại'}
          </Button>
        </div>

        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Thông tin cơ bản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div><span className="font-medium">Họ tên:</span> {user.FullName}</div>
          <div><span className="font-medium">Email:</span> {user.Email}</div>
          <div><span className="font-medium">Vai trò:</span> {user.Role}</div>
          <div><span className="font-medium">Số điện thoại:</span> {user.PhoneNumber}</div>
          <div><span className="font-medium">Trạng thái:</span> {user.AccountState ? 'Hoạt động' : 'Đã bị Ban'}</div>
          <div><span className="font-medium">Ngày tham gia:</span> {user.EnrollmentDate}</div>
        </div>
      </div>

    </MainLayout>
  );
};

export default UserDetail; // <<<<< EXPORT DEFAULT
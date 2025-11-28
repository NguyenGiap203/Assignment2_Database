// pages/user/UserDetail.tsx (Đã cập nhật logic Update)

import React, { useState, useCallback } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import UserForm from '../../components/forms/UserForm'; // Import UserForm
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { formatDate } from '../../utils/format'; 
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch'; // Import useFetch
import axiosClient from '../../api/axiosClient'; // Import axiosClient

// ... (Định nghĩa kiểu dữ liệu User nếu cần) - Đã đồng bộ với SQL
interface User {
  UserID: string;
  AccountName: string; // Thêm AccountName
  AccountPassword?: string;
  FullName: string;
  Email: string;
  Role: 'Admin' | 'Teacher' | 'Student' | string;
  PhoneNumber?: string;
  Nation?: string; 
  Province?: string; 
  Ward?: string; 
  AccountState: boolean;
  EnrollmentDate: string;
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // FIX: Fetch data thực tế
  const { data: user, isLoading, error, totalItems } = useFetch<User>(`/UserTable/${id}`);
  const initialUser = user;

  const handleUpdate = useCallback(async (formData: User) => {
    setIsSubmitting(true);
    try {
        // FIX: Gọi API Update User
        // Loại bỏ các trường không cần thiết cho PUT (như ID, Role nếu không muốn cập nhật)
        const updateData = {
            AccountName: formData.AccountName,
            FullName: formData.FullName,
            Email: formData.Email,
            PhoneNumber: formData.PhoneNumber,
            Nation: formData.Nation,
            Province: formData.Province,
            Ward: formData.Ward,
            AccountState: formData.AccountState,
            EnrollmentDate: formData.EnrollmentDate, // Dữ liệu ngày tháng cần được giữ nguyên định dạng
        };
        
        await axiosClient.put(`/UserTable/${formData.UserID}`, updateData);
        alert(`Cập nhật thành công User: ${formData.FullName}!`);
        setIsEditing(false); // Quay lại chế độ xem
        // Kích hoạt refetch dữ liệu (tự động vì useFetch phụ thuộc vào component state)
    } catch (err: any) {
        alert(`Lỗi cập nhật: ${err.response?.data?.message || err.message}`);
    } finally {
        setIsSubmitting(false);
    }
  }, []);

  if (isLoading) {
    return (
        <MainLayout>
             <div className="flex justify-center items-center h-48 text-blue-600">
                <Loader2 className="w-8 h-8 animate-spin mr-2" /> Đang tải chi tiết người dùng...
            </div>
        </MainLayout>
    );
  }

  if (error || !initialUser) {
    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <Button variant="secondary" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại danh sách
                </Button>
            </div>
            <div className="p-8 text-center text-red-600 bg-red-100 rounded-xl shadow-lg border border-red-300">
                Lỗi tải dữ liệu hoặc Không tìm thấy Người dùng {id}. {error}
            </div>
        </MainLayout>
    );
  }

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
              <div><span className="font-medium">Vai trò (Mock):</span> {initialUser.Role}</div>
              <div><span className="font-medium">Số điện thoại:</span> {initialUser.PhoneNumber || 'N/A'}</div>
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
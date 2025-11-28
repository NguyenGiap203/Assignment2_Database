// src/pages/user/UserDetail.tsx

import React, { useState, useCallback } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import UserForm from '../../components/forms/UserForm'; 
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { formatDate } from '../../utils/format'; 
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch'; 
import axiosClient from '../../api/axiosClient'; // 1. Import axiosClient

// Interface User (camelCase)
interface User {
  userID: string;
  accountName: string;
  accountPassword?: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  nation?: string; 
  province?: string; 
  ward?: string; 
  accountState: boolean;
  enrollmentDate: string;
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dùng refetchKey để load lại dữ liệu sau khi update thành công
  const [refetchKey, setRefetchKey] = useState(0);
  const { data: user, isLoading, error } = useFetch<User>(`/UserTable/${id}?refetch=${refetchKey}`);
  const initialUser = user;

  // --- HÀM CẬP NHẬT (UPDATE) ---
  const handleUpdate = useCallback(async (formData: User) => {
    setIsSubmitting(true);
    try {
        // 2. Chuẩn bị dữ liệu gửi đi
        // Backend ASP.NET Core thường không phân biệt hoa/thường (Case-insensitive)
        // nhưng ta cần đảm bảo Password không bị rỗng để vượt qua validate [Required]
        const updatePayload = {
            ...formData,
            // Logic xử lý Password:
            // Nếu người dùng nhập pass mới trong form -> lấy formData.accountPassword
            // Nếu không nhập (rỗng) -> lấy pass cũ từ initialUser hoặc gửi chuỗi "unchanged" để BE biết
            accountPassword: formData.accountPassword || initialUser?.accountPassword || "unchanged" 
        };
        
        console.log("Sending Update Payload:", updatePayload);

        // 3. Gọi API PUT
        await axiosClient.put(`/UserTable/${formData.userID}`, updatePayload);
        
        alert(`Cập nhật thành công User: ${formData.fullName}!`);
        setIsEditing(false); 
        setRefetchKey(prev => prev + 1); // Load lại dữ liệu mới nhất từ server
    } catch (err: any) {
        console.error("Update Error:", err);
        // Hiển thị thông báo lỗi chi tiết từ Backend trả về
        const message = err.response?.data?.message || err.response?.data?.title || "Lỗi không xác định";
        alert(`Lỗi cập nhật: ${message}`);
    } finally {
        setIsSubmitting(false);
    }
  }, [initialUser]);

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
        <h1 className="text-3xl font-bold text-gray-800">Chi tiết Người dùng: {initialUser.userID}</h1>
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

            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div><span className="font-medium">Họ tên:</span> {initialUser.fullName}</div>
              <div><span className="font-medium">Tên tài khoản:</span> {initialUser.accountName}</div>
              <div><span className="font-medium">Email:</span> {initialUser.email}</div>
              <div><span className="font-medium">Vai trò:</span> {initialUser.role || 'N/A'}</div>
              <div><span className="font-medium">Số điện thoại:</span> {initialUser.phoneNumber || 'N/A'}</div>
              <div><span className="font-medium">Quốc gia:</span> {initialUser.nation || 'N/A'}</div>
              <div><span className="font-medium">Tỉnh/TP:</span> {initialUser.province || 'N/A'}</div>
              <div><span className="font-medium">Phường/Xã:</span> {initialUser.ward || 'N/A'}</div>
              <div><span className="font-medium">Trạng thái:</span> {initialUser.accountState ? 'Hoạt động' : 'Đã bị Ban'}</div>
              <div><span className="font-medium">Ngày tham gia:</span> {formatDate(initialUser.enrollmentDate)}</div>
            </div>
          </>
        ) : (
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
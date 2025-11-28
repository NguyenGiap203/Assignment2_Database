// src/pages/user/UserList.tsx

import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Table, { Column } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal'; 
import UserForm from '../../components/forms/UserForm'; 
import { useFetch } from '../../hooks/useFetch';
import { Search, UserPlus, Trash2, Eye } from 'lucide-react';
import { formatDate } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

// FIX: Interface User đầy đủ (đã sửa lỗi TS2322)
interface User {
  UserID: string;
  FullName: string;
  Email: string;
  Role: 'Admin' | 'Teacher' | 'Student';
  AccountState: boolean;
  EnrollmentDate: string; // Bắt buộc phải có
  PhoneNumber?: string; // Tùy chọn
}

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: users, isLoading, error, totalItems, totalPages } = useFetch<User[]>('/api/users'); 

  const handleCreateUser = (formData: User) => {
    console.log('Tạo mới người dùng:', formData);
    setIsSubmitting(true);
    setTimeout(() => {
        alert(`Tạo mới thành công User: ${formData.FullName}! (Mocked)`);
        setIsSubmitting(false);
        setIsModalOpen(false);
    }, 1500);
  };

  const handleDelete = (user: User) => {
    setIsSubmitting(true);
    console.log('Xóa người dùng:', user.UserID);
    setTimeout(() => {
        alert(`Xóa thành công User: ${user.FullName} (Mocked)`);
        setIsSubmitting(false);
        setUserToDelete(null); 
    }, 1000);
  };


  const userColumns: Column<User>[] = [
    { key: 'UserID', header: 'ID' },
    { key: 'FullName', header: 'Họ Tên', sortable: true },
    { key: 'Email', header: 'Email' },
    { key: 'Role', header: 'Vai trò', sortable: true },
    { 
      key: 'AccountState', 
      header: 'Trạng thái',
      render: (user) => (
        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
          user.AccountState 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {user.AccountState ? 'Active' : 'Bị Ban'}
        </span>
      ),
    },
    { 
      key: 'EnrollmentDate', 
      header: 'Ngày tham gia',
      render: (user) => formatDate(user.EnrollmentDate), 
    },
    { 
      key: 'actions', 
      header: 'Hành động',
      render: (user) => (
        <div className="space-x-2 flex">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => navigate(`/users/${user.UserID}`)} 
          >
            <Eye className="w-4 h-4 mr-1" /> Chi tiết
          </Button> 
          <Button 
            size="sm" 
            variant="danger" 
            onClick={() => setUserToDelete(user)} 
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Người dùng</h2>
      
      {/* Thanh công cụ */}
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="w-1/3">
          <Input 
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            icon={<Search className="w-5 h-5" />}
            className="w-full"
          />
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}> 
          <UserPlus className="w-5 h-5 mr-2" />
          Tạo đối tượng mới
        </Button>
      </div>

      {isLoading && <div className="p-6 text-center text-blue-600">Đang tải dữ liệu...</div>}
      {error && <div className="p-6 text-center text-red-600">Lỗi: {error}</div>}

      {!isLoading && users && (
        <>
          {/* FIX: Bỏ Generic Type và ép kiểu cứng. Dùng cú pháp đơn giản nhất */}
          <Table<User> data={users} columns={userColumns} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* MODAL: Thêm người dùng mới */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Tạo Người dùng mới"
      >
        <UserForm onSubmit={handleCreateUser} onCancel={() => setIsModalOpen(false)} isSubmitting={isSubmitting} />
      </Modal>

      {/* MODAL: Xác nhận xóa người dùng */}
      <Modal 
        isOpen={!!userToDelete} 
        onClose={() => setUserToDelete(null)} 
        title="Xác nhận Xóa"
      >
        <p className="mb-4">Bạn có chắc chắn muốn xóa người dùng **{userToDelete?.FullName}** ({userToDelete?.UserID}) không? Hành động này không thể hoàn tác.</p>
        <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setUserToDelete(null)} disabled={isSubmitting}>Hủy</Button>
            <Button variant="danger" isLoading={isSubmitting} onClick={() => userToDelete && handleDelete(userToDelete)}>
                {isSubmitting ? 'Đang xóa...' : 'Xác nhận Xóa'}
            </Button>
        </div>
      </Modal>

    </MainLayout>
  );
};

export default UserList;
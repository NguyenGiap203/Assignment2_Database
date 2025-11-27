// pages/user/UserList.tsx

import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Table, { Column } from '../../components/ui/Table'; // Đã sửa lỗi Column export
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import { useFetch } from '../../hooks/useFetch';
import { Search, UserPlus, Ban, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/format';

interface User {
  UserID: string;
  FullName: string;
  Email: string;
  Role: 'Admin' | 'Teacher' | 'Student';
  AccountState: boolean;
  EnrollmentDate: string;
}

const UserList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data: users, isLoading, error, totalItems, totalPages } = useFetch<User[]>('/api/users'); 

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
          <Button size="sm" variant="secondary" onClick={() => console.log('View', user.UserID)}>Xem</Button>
          <Button size="sm" variant={user.AccountState ? 'danger' : 'primary'} onClick={() => console.log('Toggle State', user.UserID)}>
            {user.AccountState ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Người dùng</h2>
      
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="w-1/3">
          <Input 
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            icon={<Search className="w-5 h-5" />}
            className="w-full"
          />
        </div>
        <Button variant="primary" onClick={() => console.log('Add New User')}>
          <UserPlus className="w-5 h-5 mr-2" />
          Thêm người dùng mới
        </Button>
      </div>

      {isLoading && <div className="p-6 text-center text-blue-600">Đang tải dữ liệu...</div>}
      {error && <div className="p-6 text-center text-red-600">Lỗi: {error}</div>}

      {!isLoading && users && (
        <>
          <Table<User> 
            data={users} 
            columns={userColumns}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </MainLayout>
  );
};

export default UserList; // <<<<< EXPORT DEFAULT
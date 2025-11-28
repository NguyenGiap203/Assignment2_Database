// src/pages/exercise/ExerciseList.tsx

import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Table, { Column } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Input from '../../components/ui/Input';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import { Eye, Search } from 'lucide-react';

interface ExerciseAttempt {
  AttemptID: string;
  UserID: string;
  UserName: string;
  ExerciseID: string;
  ExerciseTitle: string;
  CourseName: string;
  StartTime: string;
  SubmitTime: string | null;
  Score: number | null;
  Status: 'Passed' | 'Failed' | 'In Progress';
}

const ExerciseList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { 
    data: attempts, 
    isLoading, 
    error, 
    totalItems, 
    totalPages 
  } = useFetch<ExerciseAttempt[]>(`/api/exercises/attempts?page=${currentPage}&limit=${itemsPerPage}`); 

  const attemptColumns: Column<ExerciseAttempt>[] = [
    { key: 'AttemptID', header: 'ID Lần làm' },
    { key: 'UserName', header: 'Học viên', sortable: true },
    { key: 'ExerciseTitle', header: 'Bài tập', sortable: true },
    { 
      key: 'CourseName', 
      header: 'Khóa học', 
    },
    { 
      key: 'SubmitTime', 
      header: 'Thời gian nộp',
      render: (item) => item.SubmitTime ? formatDate(item.SubmitTime) : 'Chưa nộp',
      sortable: true
    },
    { 
      key: 'Score', 
      header: 'Điểm',
      render: (item) => item.Score !== null ? `${item.Score.toFixed(1)}/100` : '-',
      sortable: true
    },
    { 
      key: 'Status', 
      header: 'Trạng thái',
      render: (item) => (
        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
          item.Status === 'Passed' ? 'bg-green-100 text-green-800' :
          item.Status === 'Failed' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {item.Status === 'Passed' ? 'Đạt' : item.Status === 'Failed' ? 'Không đạt' : 'Đang làm'}
        </span>
      ),
    },
    { 
      key: 'actions', 
      header: 'Hành động',
      render: (item) => (
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={() => console.log('View Attempt Detail', item.AttemptID)}
          disabled={item.Status === 'In Progress'}
        >
          <Eye className="w-4 h-4 mr-1" /> Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <MainLayout>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Lịch sử Bài tập bắt buộc</h2>
      
      {/* Thanh công cụ */}
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="w-1/3">
          <Input 
            type="text"
            placeholder="Tìm kiếm theo tên học viên, bài tập..."
            icon={<Search className="w-5 h-5" />}
            className="w-full"
          />
        </div>
      </div>

      {isLoading && <div className="p-6 text-center text-blue-600">Đang tải dữ liệu...</div>}
      {error && <div className="p-6 text-center text-red-600">Lỗi: {error}</div>}

      {!isLoading && attempts && (
        <>
          {/* FIX: Bỏ Generic Type và ép kiểu cứng. */}
          <Table<ExerciseAttempt> data={attempts} columns={attemptColumns} />
          
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

export default ExerciseList;
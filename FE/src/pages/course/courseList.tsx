// pages/course/CourseList.tsx

import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Table, { Column } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import { useFetch } from '../../hooks/useFetch';
import { Eye, EyeOff, Trash2, PlusCircle } from 'lucide-react';

// Định nghĩa kiểu dữ liệu Khóa học (phù hợp với course.json)
interface Course {
  CourseID: string;
  CourseName: string;
  CourseState: string;
  TeacherName: string;
  NumStudents: number;
  AverageRating: number;
}

const CourseList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Tải dữ liệu khóa học (dùng useFetch đã sửa)
  const { data: courses, isLoading, error, totalItems, totalPages } = useFetch<Course[]>(`/api/courses?page=${currentPage}&limit=${itemsPerPage}`); 

  const courseColumns: Column<Course>[] = [
    { key: 'CourseID', header: 'ID' },
    { key: 'CourseName', header: 'Tên Khóa học', sortable: true },
    { key: 'TeacherName', header: 'Giảng viên' },
    { 
      key: 'CourseState', 
      header: 'Trạng thái',
      render: (course) => (
        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
          course.CourseState === 'Đang mở' 
            ? 'bg-blue-100 text-blue-800' 
            : course.CourseState === 'Sắp ra mắt'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {course.CourseState}
        </span>
      ),
    },
    { key: 'NumStudents', header: 'Học viên', sortable: true },
    { key: 'AverageRating', header: 'Đánh giá (5)', sortable: true },
    { 
      key: 'actions', 
      header: 'Hành động',
      render: (course) => (
        <div className="space-x-2 flex">
          <Button size="sm" variant="secondary" onClick={() => console.log('View', course.CourseID)}>Chi tiết</Button>
          <Button size="sm" variant="ghost" onClick={() => console.log('Toggle State', course.CourseID)}>
            {course.CourseState === 'Đang mở' ? <EyeOff className="w-4 h-4 text-orange-500" /> : <Eye className="w-4 h-4 text-green-500" />}
          </Button>
          <Button size="sm" variant="danger" onClick={() => console.log('Delete', course.CourseID)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Khóa học</h2>
      
      {/* Thanh công cụ */}
      <div className="flex justify-end items-center mb-6">
        <Button variant="primary" onClick={() => console.log('Add New Course')}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Thêm Khóa học
        </Button>
      </div>

      {isLoading && <div className="p-6 text-center text-blue-600">Đang tải dữ liệu...</div>}
      {error && <div className="p-6 text-center text-red-600">Lỗi: {error}</div>}

      {!isLoading && courses && (
        <>
          <Table<Course> 
            data={courses}
            columns={courseColumns}
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

export default CourseList;
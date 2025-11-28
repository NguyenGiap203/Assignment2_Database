// src/pages/course/CourseList.tsx

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Eye, EyeOff, Trash2, PlusCircle, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import MainLayout from '../../components/layout/MainLayout';
import Table, { Column } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import { useFetch } from '../../hooks/useFetch';
import axiosClient from '../../api/axiosClient';

// Interface khớp với Course Model Backend + Teacher Info
interface Course {
  courseID: string;
  courseName: string;
  courseState: string;
  teacherID: string;
  teacher?: { 
      user?: { fullName: string } 
  }; 
  totalDuration: number;
  numStudents: number;
  averageRating: number;
}

// Các key được Backend hỗ trợ sort
type CourseSortKey = 'name' | 'students' | 'rating' | 'duration';

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // State quản lý Sort & Search
  const [sortKey, setSortKey] = useState<CourseSortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [refetchKey, setRefetchKey] = useState(0); // Để reload list khi xóa

  // Logic tạo URL Fetch API
  const fetchUrl = useMemo(() => {
    if (searchTerm) {
        return `/Course/search?keyword=${searchTerm}`;
    }
    return `/Course?sortBy=${sortKey}&sortOrder=${sortDirection}`;
  }, [searchTerm, sortKey, sortDirection, refetchKey]);

  // GỌI API LẤY DANH SÁCH TẠI ĐÂY
  const { data: courses, isLoading, error } = useFetch<Course[]>(fetchUrl);

  // Debug: Log dữ liệu nhận được để kiểm tra
  useEffect(() => {
      if (courses) console.log("Fetched Courses:", courses);
      if (error) console.error("Fetch Error:", error);
  }, [courses, error]);

  // Phân trang Client-side (Vì API hiện tại trả về all list)
  const { paginatedCourses, totalItems, totalPages } = useMemo(() => {
    const list = courses || [];
    const totalItems = list.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedCourses = list.slice(start, start + itemsPerPage);
    
    return { paginatedCourses, totalItems, totalPages };
  }, [courses, currentPage, itemsPerPage]);

  // Xử lý Xóa Khóa học
  const handleDelete = useCallback(async (courseID: string) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này? Hành động không thể hoàn tác.")) {
          try {
              await axiosClient.delete(`/Course/${courseID}`);
              alert("Xóa khóa học thành công!");
              setRefetchKey(prev => prev + 1); // Trigger fetch lại
          } catch (err: any) {
              alert(`Lỗi xóa: ${err.response?.data?.message || err.message}`);
          }
      }
  }, []);

  // Xử lý thay đổi Sort
  const handleTableSort = (key: string) => {
      let apiSortKey: CourseSortKey = 'name';
      if (key === 'courseName') apiSortKey = 'name';
      else if (key === 'numStudents') apiSortKey = 'students';
      else if (key === 'averageRating') apiSortKey = 'rating';
      else if (key === 'totalDuration') apiSortKey = 'duration';
      else return; 

      if (sortKey === apiSortKey) {
          setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
          setSortKey(apiSortKey);
          setSortDirection('asc');
      }
  };

  const courseColumns: Column<Course>[] = [
    { key: 'courseID', header: 'ID', sortable: false },
    { key: 'courseName', header: 'Tên Khóa học', sortable: true },
    { 
        key: 'teacherID', 
        header: 'Giảng viên', 
        sortable: false,
        render: (c) => c.teacher?.user?.fullName || 'N/A'
    },
    { 
        key: 'courseState', 
        header: 'Trạng thái', 
        render: (c) => (
            <span className={`px-2 py-1 rounded text-xs ${
                c.courseState === 'Đang mở' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
                {c.courseState}
            </span>
        )
    },
    { key: 'numStudents', header: 'Học viên', sortable: true },
    { key: 'averageRating', header: 'Đánh giá', sortable: true, render: (c) => c.averageRating.toFixed(1) },
    { key: 'totalDuration', header: 'Thời lượng (h)', sortable: true },
    { 
      key: 'actions', 
      header: 'Hành động',
      render: (course) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => navigate(`/courses/${course.courseID}`)}
          > Chi tiết</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(course.courseID)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Khóa học</h2>
      
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="w-1/3">
          <Input 
            type="text"
            placeholder="Tìm kiếm khóa học..."
            icon={<Search className="w-5 h-5" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="primary" onClick={() => console.log("Create modal open")}>
          <PlusCircle className="w-5 h-5 mr-2" /> Thêm Khóa học
        </Button>
      </div>

      {isLoading && <div className="p-12 text-center text-blue-600"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2"/>Đang tải dữ liệu...</div>}
      {error && <div className="p-6 text-center text-red-600">Lỗi kết nối: {error}</div>}

      {!isLoading && courses && (
        <>
          <Table<Course> 
            data={paginatedCourses}
            columns={courseColumns}
            onSort={(key) => handleTableSort(key as string)}
            sortKey={sortKey === 'name' ? 'courseName' : sortKey === 'students' ? 'numStudents' : sortKey === 'rating' ? 'averageRating' : 'totalDuration'}
            sortDirection={sortDirection}
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
// src/pages/course/CourseList.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { Eye, Trash2, PlusCircle, Search, Loader2, Filter } from 'lucide-react'; // Thêm icon Filter
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import MainLayout from '../../components/layout/MainLayout';
import Table, { Column } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import CourseForm, { CreateCourseData } from '../../components/forms/CourseForm';
import { useFetch } from '../../hooks/useFetch';
import axiosClient from '../../api/axiosClient';

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

type CourseSortKey = 'name' | 'students' | 'rating' | 'duration';

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [sortKey, setSortKey] = useState<CourseSortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // 1. STATE MỚI CHO FILTER
  const [filterStatus, setFilterStatus] = useState<string>('All'); 

  const [refetchKey, setRefetchKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUrl = useMemo(() => {
    if (searchTerm) return `/Course/search?keyword=${searchTerm}&refetch=${refetchKey}`;
    return `/Course?sortBy=${sortKey}&sortOrder=${sortDirection}&refetch=${refetchKey}`;
  }, [searchTerm, sortKey, sortDirection, refetchKey]);

  const { data: courses, isLoading } = useFetch<Course[]>(fetchUrl);

  // 2. CẬP NHẬT LOGIC LỌC DỮ LIỆU
  const { paginatedCourses, totalItems, totalPages } = useMemo(() => {
    const list = Array.isArray(courses) ? courses : [];
    
    // Lọc danh sách an toàn và áp dụng Filter Status
    const filteredList = list.filter(c => {
        const isValid = c && c.courseName;
        const matchesStatus = filterStatus === 'All' || c.courseState === filterStatus;
        return isValid && matchesStatus;
    });

    const totalItems = filteredList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    
    // Reset về trang 1 nếu trang hiện tại lớn hơn tổng số trang sau khi lọc
    // (Logic này nên xử lý ở useEffect, nhưng để đơn giản ta tính toán start index an toàn)
    const safePage = Math.min(currentPage, totalPages > 0 ? totalPages : 1);
    const start = (safePage - 1) * itemsPerPage;
    
    const paginatedCourses = filteredList.slice(start, start + itemsPerPage);
    
    return { paginatedCourses, totalItems, totalPages };
  }, [courses, currentPage, itemsPerPage, filterStatus]); // Thêm filterStatus vào dependency

  // Hàm xử lý khi thay đổi Filter
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterStatus(e.target.value);
      setCurrentPage(1); // Reset về trang 1 khi đổi bộ lọc
  };

  const handleCreateCourse = useCallback(async (formData: CreateCourseData) => {
    setIsSubmitting(true);
    try {
        await axiosClient.post('/Course', {
            CourseName: formData.courseName,
            CourseState: formData.courseState,
            TeacherID: formData.teacherID
        });

        alert('Tạo khóa học thành công!');
        setIsModalOpen(false);
        setRefetchKey(prev => prev + 1);
    } catch (err: any) {
        alert(`Lỗi tạo khóa học: ${err.response?.data?.message || err.message}`);
    } finally {
        setIsSubmitting(false);
    }
  }, []);

  const handleDelete = useCallback(async (courseID: string) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
          try {
              await axiosClient.delete(`/Course/${courseID}`);
              alert("Xóa thành công!");
              setRefetchKey(prev => prev + 1);
          } catch (err: any) {
              alert(`Lỗi xóa: ${err.response?.data?.message || err.message}`);
          }
      }
  }, []);

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
        key: 'teacherID', header: 'Giảng viên', sortable: false,
        render: (c) => c.teacher?.user?.fullName || 'N/A'
    },
    { 
        key: 'courseState', header: 'Trạng thái', 
        render: (c) => (
            <span className={`px-2 py-1 rounded text-xs ${
                c.courseState === 'Đang mở' ? 'bg-green-100 text-green-800' : c.courseState === 'Đã đóng' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
            }`}>{c.courseState}</span>
        )
    },
    { key: 'numStudents', header: 'Học viên', sortable: true },
    { key: 'averageRating', header: 'Đánh giá', sortable: true, render: (c) => c.averageRating?.toFixed(1) || '0.0' },
    { key: 'totalDuration', header: 'Thời lượng (h)', sortable: true },
    { 
      key: 'actions', header: 'Hành động',
      render: (course) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="secondary" onClick={() => navigate(`/courses/${course.courseID}`)}>Chi tiết</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(course.courseID)}><Trash2 className="w-4 h-4" /></Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý khóa học</h2>
      
      {/* 3. CẬP NHẬT GIAO DIỆN THANH CÔNG CỤ */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm gap-4"> 
        
        {/* Ô Tìm kiếm */}
        <div className="w-full md:w-1/3 -mb-4">
          <Input 
            type="text" 
            placeholder="Tìm kiếm khóa học..." 
            icon={<Search className="w-5 h-5" />}
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="mb-0" // Ghi đè margin-bottom mặc định của Input
          />
        </div>
        
        {/* Dropdown Filter */}
        <div className="flex space-x-2 min-w-[200px]">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
            >
                <option value="All">Tất cả trạng thái</option>
                <option value="Đang mở">Đang mở</option>
                <option value="Sắp ra mắt">Sắp ra mắt</option>
                <option value="Đã đóng">Đã đóng</option>
            </select>
        </div>
        
        {/* Nút mở Modal */}
        <div className="flex items-center space-x-2 min-w-[200px]">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}> 
            <PlusCircle className="w-5 h-5 mr-2" /> Thêm Khóa học 
          </Button>
        </div>
      </div>

      {isLoading && <div className="p-12 text-center text-blue-600"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2"/>Đang tải...</div>}
      
      {!isLoading && (
        <>
          <Table<Course> 
            data={paginatedCourses} columns={courseColumns}
            onSort={(key) => handleTableSort(key as string)}
            sortKey={sortKey === 'name' ? 'courseName' : sortKey === 'students' ? 'numStudents' : sortKey === 'rating' ? 'averageRating' : 'totalDuration'}
            sortDirection={sortDirection}
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm Khóa học mới"
      >
        <CourseForm 
            onSubmit={handleCreateCourse} 
            onCancel={() => setIsModalOpen(false)} 
            isSubmitting={isSubmitting} 
        />
      </Modal>

    </MainLayout>
  );
};

export default CourseList;
// pages/course/CourseList.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { Eye, EyeOff, Trash2, PlusCircle, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import MainLayout from '../../components/layout/MainLayout';
import Table, { Column } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import { useFetch } from '../../hooks/useFetch';

// Định nghĩa kiểu dữ liệu Khóa học
interface Course {
  CourseID: string;
  CourseName: string;
  CourseState: 'Đang mở' | 'Sắp ra mắt' | 'Đã đóng' | string;
  TeacherID: string; 
  Teacher: { User: { FullName: string } }; 
  TotalDuration: number;
  NumStudents: number;
  AverageRating: number;
  
  NumRatings: number;
  NumTests: number;
  NumTheoryLessons: number;
  NumExercises: number;
  NumVideos: number;
}

type CourseStatus = 'Tất cả' | 'Đang mở' | 'Sắp ra mắt' | 'Đã đóng';

// FIX: Chỉ cho phép các key được hỗ trợ bởi BE Controller
type CourseSortKey = 'CourseName' | 'NumStudents' | 'AverageRating' | 'TotalDuration';

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Khởi tạo state cho sorting
  const [sortKey, setSortKey] = useState<CourseSortKey>('CourseName'); 
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<CourseStatus>('Tất cả');

  // FIX: Logic tạo URL dựa trên Search và Sort
  const fetchUrl = useMemo(() => {
    // Mapping FE key sang BE key
    const beSortKey = (key: CourseSortKey) => {
        switch(key) {
            case 'CourseName': return 'name';
            case 'NumStudents': return 'students';
            case 'AverageRating': return 'rating';
            case 'TotalDuration': return 'duration'; // Đã thêm TotalDuration
            default: return 'name'; // Fallback
        }
    }
    
    if (searchTerm) {
        // Ưu tiên API Search nếu có keyword (BE có endpoint này)
        return `/Course/search?keyword=${searchTerm}`;
    }
    
    // API List/Sort (BE có endpoint này)
    const sortParameter = beSortKey(sortKey);
    return `/Course?sortBy=${sortParameter}&sortOrder=${sortDirection}`;

  }, [sortKey, sortDirection, searchTerm]);

  // Tải dữ liệu khóa học
  const { 
    data: courses, 
    isLoading, 
    error
  } = useFetch<Course[]>(fetchUrl); 

  const statusOptions: CourseStatus[] = ['Tất cả', 'Đang mở', 'Sắp ra mắt', 'Đã đóng'];

  // Lọc client-side cho trạng thái và xử lý phân trang
  const { paginatedCourses, totalItems, totalPages } = useMemo(() => {
    let filtered = courses || [];
    
    // Lọc theo trạng thái (Client-side)
    if (filterStatus !== 'Tất cả') {
        filtered = filtered.filter(course => course.CourseState === filterStatus);
    }
    
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    // Phân trang client-side
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedCourses = filtered.slice(start, start + itemsPerPage);

    return { paginatedCourses, totalItems, totalPages };
  }, [courses, filterStatus, currentPage, itemsPerPage]);


  // Hàm xử lý khi click vào header cột (chỉ cập nhật state để trigger useFetch lại)
  const handleSort = useCallback((key: CourseSortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }, [sortKey, sortDirection]);

  // Cập nhật handleTableSort cho Table (Chỉ cho phép sort các cột được BE hỗ trợ)
  const handleTableSort = useCallback((key: keyof Course) => {
      if (['CourseName', 'NumStudents', 'AverageRating', 'TotalDuration'].includes(key as string)) {
          handleSort(key as CourseSortKey);
      }
  }, [handleSort]);


  const courseColumns: Column<Course>[] = [
    { key: 'CourseID', header: 'ID', sortable: false }, // Không được hỗ trợ sort
    { key: 'CourseName', header: 'Tên Khóa học', sortable: true }, // Hỗ trợ sort: name
    { 
        key: 'Teacher', 
        header: 'Giảng viên', 
        sortable: false, // Không được hỗ trợ sort
        render: (course) => course.Teacher?.User?.FullName || 'N/A' 
    },
    { key: 'CourseState', header: 'Trạng thái', sortable: false }, // Không được hỗ trợ sort
    { key: 'NumStudents', header: 'Học viên', sortable: true }, // Hỗ trợ sort: students
    { key: 'AverageRating', header: 'Đánh giá (5)', sortable: true }, // Hỗ trợ sort: rating
    { key: 'TotalDuration', header: 'Thời lượng (giờ)', sortable: true }, // Hỗ trợ sort: duration
    { 
      key: 'actions', 
      header: 'Hành động',
      render: (course) => (
        <div className="space-x-2 flex">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => navigate(`/courses/${course.CourseID}`)}
          > Chi tiết</Button>
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
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="w-1/3">
          {/* Search Input: Giữ lại vì BE có API /Course/search */}
          <Input 
            type="text"
            placeholder="Tìm kiếm khóa học..."
            icon={<Search className="w-5 h-5" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex space-x-3 mb-4">
          {statusOptions.map(status => (
            <Button
              key={status}
              variant={filterStatus === status ? 'primary' : 'ghost'}
              onClick={() => setFilterStatus(status)}
              size="sm"
              className={filterStatus === status ? 'shadow-md' : 'text-gray-600'}
            >
              {status} ({courses?.filter(c => status === 'Tất cả' || c.CourseState === status).length || 0})
            </Button>
          ))}
        </div>

        <Button variant="primary" onClick={() => console.log('Add New Course')}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Thêm Khóa học
        </Button>
      </div>

      {isLoading && <div className="p-6 text-center text-blue-600 flex justify-center items-center"><Loader2 className="w-6 h-6 animate-spin mr-2" />Đang tải dữ liệu...</div>}
      {error && <div className="p-6 text-center text-red-600">Lỗi: {error}</div>}

      {!isLoading && (
        <>
          <Table<Course> 
            data={paginatedCourses}
            columns={courseColumns}
            onSort={handleTableSort as (key: keyof Course) => void}
            sortKey={sortKey as keyof Course}
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
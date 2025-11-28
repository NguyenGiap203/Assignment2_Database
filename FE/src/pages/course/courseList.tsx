// pages/course/CourseList.tsx

import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Trash2, PlusCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import MainLayout from '../../components/layout/MainLayout';
import Table, { Column } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import { useFetch } from '../../hooks/useFetch';

// Định nghĩa kiểu dữ liệu Khóa học (Đã đồng bộ với COURSE table và courseDetail)
interface Course {
  CourseID: string;
  CourseName: string;
  CourseState: 'Đang mở' | 'Sắp ra mắt' | 'Đã đóng'; // Thay string bằng union type
  TeacherID: string; // Thêm TeacherID
  TeacherName: string;
  TotalDuration: number;
  NumStudents: number;
  AverageRating: number;
  
  // Thêm các trường thống kê khác từ SQL Course table
  NumRatings: number;
  NumTests: number;
  NumTheoryLessons: number;
  NumExercises: number;
  NumVideos: number;
}

type CourseStatus = 'Tất cả' | 'Đang mở' | 'Sắp ra mắt' | 'Đã đóng';

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortKey, setSortKey] = useState<keyof Course | null>('CourseID');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  // Tải dữ liệu khóa học (dùng useFetch đã sửa)
  const [filterStatus, setFilterStatus] = useState<CourseStatus>('Tất cả');
  const { data: courses, isLoading, error, totalItems, totalPages } = useFetch<Course[]>(`/api/courses?page=${currentPage}&limit=${itemsPerPage}`); 

  const statusOptions: CourseStatus[] = ['Tất cả', 'Đang mở', 'Sắp ra mắt', 'Đã đóng'];

  const sortedAndFilteredCourses = useMemo(() => {
    let filtered = courses || [];
    // Lọc theo tên khóa học hoặc tên giảng viên
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.CourseName.toLowerCase().includes(lowerCaseSearch) ||
        course.TeacherName.toLowerCase().includes(lowerCaseSearch)
      );
    }

    if (filterStatus !== 'Tất cả') {
        filtered = filtered.filter(course => course.CourseState === filterStatus);
    }

    // Sắp xếp (Sort) - Client-side sorting
    if (sortKey) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey as keyof Course];
        const bValue = b[sortKey as keyof Course];

        // Xử lý giá trị rỗng/null
        if (aValue == null || bValue == null) return 0;

        // Xử lý sort số (VD: Rating, Duration)
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return (aValue - bValue) * (sortDirection === 'asc' ? 1 : -1);
        }
        
        // Xử lý sort chuỗi
        const valA = String(aValue).toLowerCase();
        const valB = String(bValue).toLowerCase();
        
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [courses, sortKey, sortDirection, searchTerm, filterStatus]); // Chạy lại logic khi một trong các dependency thay đổi

  // Hàm xử lý khi click vào header cột
  const handleSort = (key: keyof Course) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const courseColumns: Column<Course>[] = [
    { key: 'CourseID', header: 'ID', sortable: true },
    { key: 'CourseName', header: 'Tên Khóa học', sortable: true },
    { key: 'TeacherName', header: 'Giảng viên', sortable: true },
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
          {/* INPUT TÌM KIẾM MỚI */}
          <Input 
            type="text"
            placeholder="Tìm kiếm khóa học hoặc giảng viên..."
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

      {isLoading && <div className="p-6 text-center text-blue-600">Đang tải dữ liệu...</div>}
      {error && <div className="p-6 text-center text-red-600">Lỗi: {error}</div>}

      {!isLoading && courses && (
        <>
          <Table<Course> 
            // data={courses}
            // columns={courseColumns}
            data={sortedAndFilteredCourses}
            columns={courseColumns}
            // Truyền trạng thái sort xuống Table
            onSort={handleSort}
            // sortKey={sortKey}
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
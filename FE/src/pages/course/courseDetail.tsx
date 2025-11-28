// pages/course/CourseDetail.tsx

import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { 
    ArrowLeft, User, Star, Clock, BookOpen, 
    FileText, Video, ListChecks, MessageSquare, Award 
} from 'lucide-react';
import Button from '../../components/ui/Button';
import StatCardDetailed from '../../components/ui/StatCardDetailed'; // Import component mới
import DetailSection from '../../components/layout/DetailSection'; // Import component mới
import { useParams } from 'react-router-dom';

// --- INTERFACE ĐỒNG BỘ ---
interface Chapter {
    ChapterID: string;
    ChapterTitle: string;
    ChapterOrder: number;
    ChapterDescription?: string;
}

interface Course {
    // Core Course Details
    CourseID: string;
    CourseName: string;
    CourseState: 'Đang mở' | 'Sắp ra mắt' | 'Đã đóng';
    TeacherID: string;
    TeacherName: string;
    TotalDuration: number;
    Description?: string;

    // Stats
    AverageRating: number;
    NumRatings: number;
    NumStudents: number;
    
    // Content Counts
    NumTests: number;
    NumTheoryLessons: number;
    NumExercises: number;
    NumVideos: number;
    NumDiscussions: number;
    NumCertificates: number;

    // Nested Data
    Chapters: Chapter[];
}
// -------------------------

// --- MOCK DATA GIẢ LẬP FETCH DỰA TRÊN ID ---
// Giữ nguyên logic mock data
const mockFetchCourseDetail = (id: string): Course | null => {
    if (id === 'COU00001') {
        return {
            CourseID: 'COU00001',
            CourseName: 'Lập trình React cơ bản',
            CourseState: 'Đang mở',
            TeacherID: 'USR00002',
            TeacherName: 'Lê Thị B (Giảng viên)',
            TotalDuration: 15.5,
            Description: 'Khóa học này cung cấp kiến thức nền tảng và nâng cao về ReactJS, từ JSX, Components, State, Props đến React Hooks, Routing và quản lý trạng thái. Phù hợp cho người mới bắt đầu và những ai muốn nâng cao kỹ năng React.',
            AverageRating: 4.5,
            NumRatings: 150,
            NumStudents: 1250, 
            NumTests: 3,
            NumTheoryLessons: 10,
            NumExercises: 10,
            NumVideos: 25,
            NumDiscussions: 45,
            NumCertificates: 1000,
            Chapters: [
                { ChapterID: 'CHA00001', ChapterTitle: 'Giới thiệu React và JSX', ChapterOrder: 1, ChapterDescription: 'Tìm hiểu về thư viện React, cách thiết lập môi trường và cú pháp JSX.' },
                { ChapterID: 'CHA00002', ChapterTitle: 'Component, State và Props', ChapterOrder: 2, ChapterDescription: 'Nắm vững cách xây dựng component, quản lý dữ liệu với state và truyền dữ liệu với props.' },
                { ChapterID: 'CHA00003', ChapterTitle: 'Quản lý sự kiện và Forms', ChapterOrder: 3, ChapterDescription: 'Thực hành xử lý các sự kiện người dùng và xây dựng các biểu mẫu tương tác.' },
                { ChapterID: 'CHA00004', ChapterTitle: 'Lifecycle của Component', ChapterOrder: 4, ChapterDescription: 'Hiểu rõ các giai đoạn vòng đời của component và cách sử dụng chúng.' },
                { ChapterID: 'CHA00005', ChapterTitle: 'React Hooks (useState, useEffect)', ChapterOrder: 5, ChapterDescription: 'Khám phá sức mạnh của Hooks để quản lý state và side effects trong functional components.' },
                { ChapterID: 'CHA00006', ChapterTitle: 'Context API và Reducers', ChapterOrder: 6, ChapterDescription: 'Học cách chia sẻ dữ liệu giữa các component mà không cần prop drilling.' },
                { ChapterID: 'CHA00007', ChapterTitle: 'React Router Dom', ChapterOrder: 7, ChapterDescription: 'Xây dựng ứng dụng đa trang với thư viện định tuyến phổ biến React Router Dom.' },
                { ChapterID: 'CHA00008', ChapterTitle: 'Fetching Data với Axios/Fetch', ChapterOrder: 8, ChapterDescription: 'Kết nối ứng dụng React với các API backend để lấy và gửi dữ liệu.' },
                { ChapterID: 'CHA00009', ChapterTitle: 'Tối ưu hiệu suất React', ChapterOrder: 9, ChapterDescription: 'Các kỹ thuật tối ưu hóa để làm cho ứng dụng React của bạn nhanh hơn và hiệu quả hơn.' },
                { ChapterID: 'CHA00010', ChapterTitle: 'Xây dựng dự án cuối khóa', ChapterOrder: 10, ChapterDescription: 'Áp dụng tất cả kiến thức đã học để xây dựng một dự án hoàn chỉnh.' },
            ],
        };
    }
    if (id === 'COU00002') {
         return {
            CourseID: 'COU00002',
            CourseName: 'Cơ sở dữ liệu SQL Server',
            CourseState: 'Sắp ra mắt',
            TeacherID: 'USR00001',
            TeacherName: 'Nguyễn Văn A (Admin)',
            TotalDuration: 10.0,
            Description: 'Khóa học này bao gồm các kiến thức về thiết kế cơ sở dữ liệu, truy vấn SQL, stored procedures, functions và tối ưu hiệu suất trong SQL Server.',
            AverageRating: 0.0,
            NumRatings: 0,
            NumStudents: 0,
            NumTests: 2,
            NumTheoryLessons: 5,
            NumExercises: 5,
            NumVideos: 12,
            NumDiscussions: 0,
            NumCertificates: 0,
            Chapters: [
                 { ChapterID: 'CHA00011', ChapterTitle: 'Giới thiệu và Cài đặt SQL Server', ChapterOrder: 1 },
                 { ChapterID: 'CHA00012', ChapterTitle: 'Thiết kế cơ sở dữ liệu quan hệ', ChapterOrder: 2 },
                 { ChapterID: 'CHA00013', ChapterTitle: 'Truy vấn dữ liệu với SELECT', ChapterOrder: 3 },
                 { ChapterID: 'CHA00014', ChapterTitle: 'Thao tác dữ liệu (INSERT, UPDATE, DELETE)', ChapterOrder: 4 },
                 { ChapterID: 'CHA00015', ChapterTitle: 'Stored Procedures và Functions', ChapterOrder: 5 },
            ], 
        };
    }
    return null;
};
// -------------------------

const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const course = mockFetchCourseDetail(id || '');

    if (!course) {
        return (
            <MainLayout>
                <div className="flex justify-between items-center mb-6">
                    <Button variant="secondary" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
                    </Button>
                </div>
                <div className="p-8 text-center text-red-600 bg-white rounded-xl shadow-lg">
                    Không tìm thấy Khóa học {id}.
                </div>
            </MainLayout>
        );
    }

    const statusClass = course.CourseState === 'Đang mở' 
        ? 'bg-green-100 text-green-800' 
        : course.CourseState === 'Sắp ra mắt'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800';

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    {course.CourseName} 
                </h1>
                <Button variant="secondary" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại danh sách
                </Button>
            </div>

            <div className="space-y-8 pb-12">
                
                {/* 1. THÔNG TIN CHUNG & TRẠNG THÁI */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-gray-700">
                        <p><span className="font-semibold text-gray-800">Mã khóa học:</span> {course.CourseID}</p>
                        <p><span className="font-semibold text-gray-800">Giảng viên:</span> {course.TeacherName} ({course.TeacherID})</p>
                        <p>
                            <span className="font-semibold text-gray-800">Trạng thái:</span> 
                            <span className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold ml-3 ${statusClass}`}>
                                {course.CourseState}
                            </span>
                        </p>
                    </div>
                     {course.Description && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <p className="text-base text-gray-600 leading-relaxed">
                                <span className="font-semibold text-gray-800">Mô tả: </span>
                                {course.Description}
                            </p>
                        </div>
                    )}
                </div>

                {/* 2. TỔNG QUAN KHÓA HỌC (Sử dụng DetailSection) */}
                <DetailSection title="Tổng quan Khóa học">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCardDetailed 
                            icon={<User className="w-6 h-6" />} 
                            title="Học viên đã đăng ký" 
                            value={course.NumStudents.toLocaleString()} 
                            iconBgColor="bg-green-100" 
                            iconColor="text-green-600" 
                        />
                        <StatCardDetailed 
                            icon={<Star className="w-6 h-6" />} 
                            title="Đánh giá trung bình" 
                            value={`${course.AverageRating.toFixed(1)}/5.0`} 
                            description={`(${course.NumRatings} lượt đánh giá)`}
                            iconBgColor="bg-yellow-100" 
                            iconColor="text-yellow-600" 
                        />
                        <StatCardDetailed 
                            icon={<Clock className="w-6 h-6" />} 
                            title="Tổng thời lượng" 
                            value={`${course.TotalDuration} giờ`} 
                            iconBgColor="bg-blue-100" 
                            iconColor="text-blue-600" 
                        />
                        <StatCardDetailed 
                            icon={<Award className="w-6 h-6" />} 
                            title="Chứng chỉ đã cấp" 
                            value={course.NumCertificates.toLocaleString()} 
                            iconBgColor="bg-purple-100" 
                            iconColor="text-purple-600" 
                        />
                    </div>
                </DetailSection>

                {/* 3. THÀNH PHẦN NỘI DUNG (Sử dụng DetailSection) */}
                <DetailSection title="Thành phần Nội dung" borderTop={true}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <StatCardDetailed 
                            icon={<FileText className="w-6 h-6" />} 
                            title="Bài học lý thuyết" 
                            value={course.NumTheoryLessons} 
                            iconBgColor="bg-gray-100" 
                            iconColor="text-gray-600" 
                        />
                        <StatCardDetailed 
                            icon={<ListChecks className="w-6 h-6" />} 
                            title="Bài tập thực hành" 
                            value={course.NumExercises} 
                            iconBgColor="bg-orange-100" 
                            iconColor="text-orange-600" 
                        />
                        <StatCardDetailed 
                            icon={<Video className="w-6 h-6" />} 
                            title="Video bài giảng" 
                            value={course.NumVideos} 
                            iconBgColor="bg-red-100" 
                            iconColor="text-red-600" 
                        />
                        <StatCardDetailed 
                            icon={<FileText className="w-6 h-6" />} 
                            title="Bài kiểm tra" 
                            value={course.NumTests} 
                            iconBgColor="bg-cyan-100" 
                            iconColor="text-cyan-600" 
                        />
                         <StatCardDetailed 
                            icon={<MessageSquare className="w-6 h-6" />} 
                            title="Thảo luận" 
                            value={course.NumDiscussions} 
                            iconBgColor="bg-indigo-100" 
                            iconColor="text-indigo-600" 
                        />
                    </div>
                </DetailSection>

                {/* 4. CHI TIẾT CÁC CHƯƠNG HỌC (Sử dụng DetailSection) */}
                <DetailSection title={`Cấu trúc Khóa học (${course.Chapters.length} Chương)`} borderTop={true}>
                    <div className="bg-white rounded-2xl shadow-xl divide-y divide-gray-100">
                        {course.Chapters.length > 0 ? (
                            course.Chapters.map((chapter) => (
                                <div key={chapter.ChapterID} className="p-5 hover:bg-blue-50 transition-colors duration-200 flex justify-between items-center group">
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800 flex items-center">
                                            <BookOpen className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                                            Chương {chapter.ChapterOrder}: {chapter.ChapterTitle}
                                        </p>
                                        {chapter.ChapterDescription && (
                                            <p className="text-sm text-gray-600 mt-2 ml-8 italic">
                                                {chapter.ChapterDescription}
                                            </p>
                                        )}
                                    </div>
                                    <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        Xem chi tiết
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="p-5 text-gray-500 italic">Khóa học này chưa có chương nào được thêm vào.</p>
                        )}
                    </div>
                </DetailSection>
            </div>
        </MainLayout>
    );
};
export default CourseDetail;
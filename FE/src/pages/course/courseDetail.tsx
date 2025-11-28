// pages/course/CourseDetail.tsx

import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { 
    ArrowLeft, User, Star, Clock, BookOpen, 
    FileText, Video, ListChecks, MessageSquare, Award, Loader2 
} from 'lucide-react';
import Button from '../../components/ui/Button';
import StatCardDetailed from '../../components/ui/StatCardDetailed'; 
import DetailSection from '../../components/layout/DetailSection'; 
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch'; // Import useFetch

// --- INTERFACE ĐỒNG BỘ ---
interface Chapter {
    ChapterID: string;
    ChapterTitle: string;
    ChapterOrder: number;
    ChapterDescription?: string;
    // Thêm các trường thống kê nội dung từ BE ChapterController
    VideoLessons?: any[];
    TheoryLessons?: any[];
    Exercises?: any[];
    Tests?: any[];
}

interface Course {
    // Core Course Details
    CourseID: string;
    CourseName: string;
    CourseState: 'Đang mở' | 'Sắp ra mắt' | 'Đã đóng';
    TeacherID: string;
    // Thêm các trường cần thiết từ BE Course Model
    Teacher?: { User: { FullName: string } }; 
    TotalDuration: number;
    Description?: string; // Tạm thời dùng trường này nếu BE có

    // Stats
    AverageRating: number;
    NumRatings: number;
    NumStudents: number;
    
    // Content Counts (từ BE Course table)
    NumTests: number;
    NumTheoryLessons: number;
    NumExercises: number;
    NumVideos: number;
    
    // Nested Data
    Chapters: Chapter[];
    // Giả định NumDiscussions và NumCertificates vẫn là mock
    NumDiscussions: number;
    NumCertificates: number;
}
// -------------------------

const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    
    // FIX: Sử dụng useFetch thực tế để lấy chi tiết khóa học
    const { data: course, isLoading, error } = useFetch<Course>(`/Course/${id}`);

    // Dữ liệu mock bổ sung (vì BE Course model không chứa sẵn Description, NumDiscussions, NumCertificates)
    const teacherName = course?.Teacher?.User?.FullName || 'N/A';
    const descriptionMock = "Cần thêm trường Description vào BE Course Model nếu muốn hiển thị nội dung này từ API.";
    const numDiscussionsMock = 45;
    const numCertificatesMock = 1000;

    if (isLoading) {
        return (
            <MainLayout>
                 <div className="flex justify-center items-center h-48 text-blue-600">
                    <Loader2 className="w-8 h-8 animate-spin mr-2" /> Đang tải chi tiết khóa học...
                </div>
            </MainLayout>
        );
    }

    if (error) {
         return (
            <MainLayout>
                <div className="flex justify-between items-center mb-6">
                    <Button variant="secondary" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
                    </Button>
                </div>
                <div className="p-8 text-center text-red-600 bg-red-100 rounded-xl shadow-lg border border-red-300">
                    Lỗi tải dữ liệu: {error}
                </div>
            </MainLayout>
        );
    }
    
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

    // Determine status styling
    const statusClass = course.CourseState === 'Đang mở' 
        ? 'bg-green-100 text-green-800' 
        : course.CourseState === 'Sắp ra mắt'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800';

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
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
                        <p><span className="font-semibold text-gray-800">Giảng viên:</span> {teacherName} ({course.TeacherID})</p>
                        <p>
                            <span className="font-semibold text-gray-800">Trạng thái:</span> 
                            <span className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold ml-3 ${statusClass}`}>
                                {course.CourseState}
                            </span>
                        </p>
                    </div>
                     {descriptionMock && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <p className="text-base text-gray-600 leading-relaxed">
                                <span className="font-semibold text-gray-800">Mô tả (Mock): </span>
                                {descriptionMock}
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
                            title="Chứng chỉ đã cấp (Mock)" 
                            value={numCertificatesMock.toLocaleString()} 
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
                            title="Thảo luận (Mock)" 
                            value={numDiscussionsMock} 
                            iconBgColor="bg-indigo-100" 
                            iconColor="text-indigo-600" 
                        />
                    </div>
                </DetailSection>

                {/* 4. CHI TIẾT CÁC CHƯƠNG HỌC (Sử dụng DetailSection) */}
                <DetailSection title={`Cấu trúc Khóa học (${course.Chapters?.length || 0} Chương)`} borderTop={true}>
                    <div className="bg-white rounded-2xl shadow-xl divide-y divide-gray-100">
                        {course.Chapters && course.Chapters.length > 0 ? (
                            course.Chapters.map((chapter) => (
                                <div key={chapter.ChapterID} className="p-5 hover:bg-blue-50 transition-colors duration-200 flex justify-between items-center group">
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800 flex items-center">
                                            <BookOpen className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                                            Chương {chapter.ChapterOrder}: {chapter.ChapterTitle}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1 ml-8">
                                            Nội dung: {chapter.TheoryLessons?.length || 0} Lý thuyết, {chapter.VideoLessons?.length || 0} Video, {chapter.Exercises?.length || 0} Bài tập, {chapter.Tests?.length || 0} Bài kiểm tra
                                        </p>
                                        {chapter.ChapterDescription && (
                                            <p className="text-sm text-gray-500 mt-1 ml-8 italic">
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
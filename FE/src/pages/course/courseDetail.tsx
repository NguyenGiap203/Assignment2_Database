// src/pages/course/CourseDetail.tsx

import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { 
    ArrowLeft, User, Star, Clock, BookOpen, 
    FileText, Video, ListChecks, MessageSquare, Loader2, X 
} from 'lucide-react';
import Button from '../../components/ui/Button';
import StatCardDetailed from '../../components/ui/StatCardDetailed'; 
import DetailSection from '../../components/layout/DetailSection'; 
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import Modal from '../../components/ui/Modal';
import Table, { Column } from '../../components/ui/Table';
import { formatDate } from '../../utils/format';

// --- INTERFACES ---
interface Chapter {
    chapterID: string;
    chapterTitle: string;
    chapterOrder: number;
    chapterDescription?: string;
}

interface CourseDetailData {
    courseID: string;
    courseName: string;
    courseState: string;
    teacherID: string;
    teacher?: { 
        user?: { fullName: string; email: string } 
    };
    totalDuration: number;
    numStudents: number;
    averageRating: number;
    numRatings: number;
    numTests: number;
    numTheoryLessons: number;
    numExercises: number;
    numVideos: number;
    chapters?: Chapter[];
}

// Interface cho Enrollment
interface Enrollment {
    userID: string;
    user?: { fullName: string; email: string };
    enrollmentDate: string;
}

// Interface cho Rating
interface Rating {
    userID: string;
    user?: { fullName: string };
    ratingValue: number;
}

const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    
    // State quản lý Modal
    const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    // Fetch thông tin khóa học
    const { data: course, isLoading, error } = useFetch<CourseDetailData>(`/Course/${id}`);

    // --- Component con: Danh sách Enrollment (Fetch khi Modal mở) ---
    const EnrollmentList = () => {
        const { data: enrollments, isLoading: loadingEnrolls } = useFetch<Enrollment[]>(`/Enrollment/course/${id}`);
        
        const columns: Column<Enrollment>[] = [
            { key: 'userID', header: 'ID Học viên' },
            { key: 'user', header: 'Họ tên', render: (e) => e.user?.fullName || 'N/A' },
            { key: 'user', header: 'Email', render: (e) => e.user?.email || 'N/A' },
            { key: 'enrollmentDate', header: 'Ngày đăng ký', render: (e) => formatDate(e.enrollmentDate) },
        ];

        if (loadingEnrolls) return <div className="text-center p-4">Đang tải danh sách...</div>;
        
        return <Table<Enrollment> data={enrollments || []} columns={columns} />;
    };

    // --- Component con: Danh sách Rating (Fetch khi Modal mở) ---
    const RatingList = () => {
        const { data: ratings, isLoading: loadingRatings } = useFetch<Rating[]>(`/Rating/course/${id}`);

        const columns: Column<Rating>[] = [
            { key: 'userID', header: 'ID Học viên' },
            { key: 'user', header: 'Người đánh giá', render: (r) => r.user?.fullName || 'N/A' },
            { 
                key: 'ratingValue', 
                header: 'Điểm', 
                render: (r) => (
                    <div className="flex items-center text-yellow-500">
                        <span className="font-bold mr-1">{r.ratingValue}</span> <Star className="w-4 h-4 fill-current" />
                    </div>
                ) 
            },
        ];

        if (loadingRatings) return <div className="text-center p-4">Đang tải đánh giá...</div>;

        return <Table<Rating> data={ratings || []} columns={columns} />;
    };


    if (isLoading) {
        return (
            <MainLayout>
                 <div className="flex justify-center items-center h-48 text-blue-600">
                    <Loader2 className="w-8 h-8 animate-spin mr-2" /> Đang tải chi tiết khóa học...
                </div>
            </MainLayout>
        );
    }

    if (error || !course) {
         return (
            <MainLayout>
                <div className="flex justify-between items-center mb-6">
                    <Button variant="secondary" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
                    </Button>
                </div>
                <div className="p-8 text-center text-red-600 bg-red-100 rounded-xl shadow-lg border border-red-300">
                    {error ? `Lỗi: ${error}` : `Không tìm thấy khóa học với ID: ${id}`}
                </div>
            </MainLayout>
        );
    }

    const teacherName = course.teacher?.user?.fullName || 'Chưa cập nhật';
    const teacherEmail = course.teacher?.user?.email || '';

    return (
        <MainLayout>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 leading-tight w-2/3">
                    {course.courseName}
                </h1>
                <Button variant="secondary" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại danh sách
                </Button>
            </div>

            <div className="space-y-8 pb-12">
                
                {/* 1. THÔNG TIN CHUNG */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <p><span className="font-semibold">Mã khóa học:</span> {course.courseID}</p>
                        <p>
                            <span className="font-semibold">Trạng thái:</span> 
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                                course.courseState === 'Đang mở' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                            }`}>
                                {course.courseState}
                            </span>
                        </p>
                        <p><span className="font-semibold">Giảng viên:</span> {teacherName}</p>
                        <p><span className="font-semibold">Email GV:</span> {teacherEmail}</p>
                    </div>
                </div>

                {/* 2. THỐNG KÊ (STATS) - Có tương tác click */}
                <DetailSection title="Thống kê tổng quan">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Card Học viên -> Click mở Modal Enrollment */}
                        <div onClick={() => setIsEnrollmentModalOpen(true)} className="cursor-pointer transition-transform hover:scale-105">
                            <StatCardDetailed 
                                icon={<User className="w-6 h-6" />} 
                                title="Học viên" 
                                value={course.numStudents} 
                                iconBgColor="bg-green-100" 
                                iconColor="text-green-600" 
                            />
                        </div>

                        {/* Card Đánh giá -> Click mở Modal Rating */}
                        <div onClick={() => setIsRatingModalOpen(true)} className="cursor-pointer transition-transform hover:scale-105">
                            <StatCardDetailed 
                                icon={<Star className="w-6 h-6" />} 
                                title="Đánh giá" 
                                value={`${course.averageRating.toFixed(1)} / 5`} 
                                description={`(${course.numRatings} lượt)`}
                                iconBgColor="bg-yellow-100" 
                                iconColor="text-yellow-600" 
                            />
                        </div>

                        <StatCardDetailed 
                            icon={<Clock className="w-6 h-6" />} 
                            title="Thời lượng" 
                            value={`${course.totalDuration} giờ`} 
                            iconBgColor="bg-blue-100" 
                            iconColor="text-blue-600" 
                        />
                        <StatCardDetailed 
                            icon={<MessageSquare className="w-6 h-6" />} 
                            title="Chương học" 
                            value={course.chapters?.length || 0} 
                            iconBgColor="bg-purple-100" 
                            iconColor="text-purple-600" 
                        />
                    </div>
                </DetailSection>

                {/* 3. THÀNH PHẦN NỘI DUNG */}
                <DetailSection title="Nội dung chi tiết" borderTop>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCardDetailed icon={<FileText className="w-5 h-5"/>} title="Lý thuyết" value={course.numTheoryLessons} iconBgColor="bg-gray-100" iconColor="text-gray-600"/>
                        <StatCardDetailed icon={<Video className="w-5 h-5"/>} title="Video" value={course.numVideos} iconBgColor="bg-red-100" iconColor="text-red-600"/>
                        <StatCardDetailed icon={<ListChecks className="w-5 h-5"/>} title="Bài tập" value={course.numExercises} iconBgColor="bg-orange-100" iconColor="text-orange-600"/>
                        <StatCardDetailed icon={<FileText className="w-5 h-5"/>} title="Bài kiểm tra" value={course.numTests} iconBgColor="bg-cyan-100" iconColor="text-cyan-600"/>
                    </div>
                </DetailSection>

                {/* 4. DANH SÁCH CHƯƠNG (CHAPTERS) */}
                <DetailSection title="Danh sách các Chương" borderTop>
                    <div className="bg-white rounded-xl shadow border border-gray-100 divide-y divide-gray-100">
                        {course.chapters && course.chapters.length > 0 ? (
                            course.chapters.map((chap) => (
                                <div key={chap.chapterID} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                                            <BookOpen className="w-4 h-4 mr-2 text-blue-500"/>
                                            Chương {chap.chapterOrder}: {chap.chapterTitle}
                                        </h4>
                                        {chap.chapterDescription && (
                                            <p className="text-sm text-gray-500 mt-1 ml-6">{chap.chapterDescription}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-500 italic">Chưa có chương nào được tạo.</div>
                        )}
                    </div>
                </DetailSection>

            </div>

            {/* --- MODALS --- */}
            
            {/* Modal Danh sách Học viên */}
            <Modal 
                isOpen={isEnrollmentModalOpen} 
                onClose={() => setIsEnrollmentModalOpen(false)} 
                title={`Danh sách Học viên (${course.numStudents})`}
            >
                <EnrollmentList />
                <div className="mt-4 flex justify-end">
                    <Button variant="secondary" onClick={() => setIsEnrollmentModalOpen(false)}>Đóng</Button>
                </div>
            </Modal>

            {/* Modal Danh sách Đánh giá */}
            <Modal 
                isOpen={isRatingModalOpen} 
                onClose={() => setIsRatingModalOpen(false)} 
                title={`Danh sách Đánh giá (${course.numRatings})`}
            >
                <RatingList />
                <div className="mt-4 flex justify-end">
                    <Button variant="secondary" onClick={() => setIsRatingModalOpen(false)}>Đóng</Button>
                </div>
            </Modal>

        </MainLayout>
    );
};

export default CourseDetail;
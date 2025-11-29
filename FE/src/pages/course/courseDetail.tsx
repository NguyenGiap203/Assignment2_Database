// src/pages/course/CourseDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

// Components
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Table, { Column } from '../../components/ui/Table';

// Sub-components
import GeneralInfo from './components/GeneralInfo';
import StatsOverview from './components/StatsOverview';
import ContentOverview from './components/ContentOverview';
import ChapterList from './components/ChapterList';
import ContentListModal from './components/modals/ContentListModal'; // File modal bạn đã có

// Hooks & Utils
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import { CourseDetailData, Chapter } from '../../types/course';

interface Enrollment {
    userID: string;
    user?: { fullName: string; email: string };
    enrollmentDate: string;
}

interface Rating {
    userID: string;
    user?: { fullName: string };
    ratingValue: number;
}

const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    
    // --- STATE QUẢN LÝ ---
    const [currentStatus, setCurrentStatus] = useState<string>('');
    
    // State Modal
    const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    
    // State Modal Content (Theory, Video, Exercise, Test)
    const [contentModalType, setContentModalType] = useState<'theory' | 'video' | 'exercise' | 'test' | null>(null);

    // --- FETCH DATA ---
    // 1. Lấy thông tin cơ bản khóa học (CourseController)
    const { data: course, isLoading: loadingCourse, error } = useFetch<CourseDetailData>(`/Course/${id}`);

    // 2. Lấy danh sách Chương & Nội dung chi tiết (ChapterController)
    // Cần gọi API này vì API Course không trả về chi tiết Video/Exercise bên trong Chapter
    const { data: chapters, isLoading: loadingChapters } = useFetch<Chapter[]>(`/Chapter/course/${id}`);

    // --- EFFECT ---
    useEffect(() => {
        if (course) {
            setCurrentStatus(course.courseState);
        }
    }, [course]);

    // --- HANDLERS ---
    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        const oldStatus = currentStatus;
        setCurrentStatus(newStatus); 
        try {
            await axiosClient.put(`/Course/${id}`, { courseState: newStatus });
        } catch (err) {
            alert("Lỗi cập nhật trạng thái.");
            setCurrentStatus(oldStatus);
        }
    };

    // --- RENDER SUB-LISTS (Enrollment & Rating) ---
    const EnrollmentList = () => {
        const { data: enrollments, isLoading } = useFetch<Enrollment[]>(`/Enrollment/course/${id}`);
        const columns: Column<Enrollment>[] = [
            { key: 'userID', header: 'ID Học viên' },
            { key: 'user', header: 'Họ tên', render: (e) => e.user?.fullName || 'N/A' },
            { key: 'user', header: 'Email', render: (e) => e.user?.email || 'N/A' },
            { key: 'enrollmentDate', header: 'Ngày ĐK', render: (e) => formatDate(e.enrollmentDate) },
        ];
        if (isLoading) return <div className="p-4 text-center">Đang tải...</div>;
        return <Table<Enrollment> data={enrollments || []} columns={columns} />;
    };

    const RatingList = () => {
        const { data: ratings, isLoading } = useFetch<Rating[]>(`/Rating/course/${id}`);
        const columns: Column<Rating>[] = [
            { key: 'user', header: 'Người dùng', render: (r) => r.user?.fullName || 'N/A' },
            { key: 'ratingValue', header: 'Điểm', render: (r) => <span className="font-bold text-yellow-600">{r.ratingValue}/5</span> },
        ];
        if (isLoading) return <div className="p-4 text-center">Đang tải...</div>;
        return <Table<Rating> data={ratings || []} columns={columns} />;
    };

    // --- MAIN RENDER ---
    if (loadingCourse) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64 text-blue-600">
                    <Loader2 className="w-8 h-8 animate-spin mr-2" /> Đang tải dữ liệu...
                </div>
            </MainLayout>
        );
    }

    if (error || !course) {
        return (
            <MainLayout>
                <div className="text-red-600 p-8 text-center border border-red-300 bg-red-50 rounded-lg">
                    Lỗi: {error || "Không tìm thấy khóa học"}
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 w-2/3">{course.courseName}</h1>
                <Button variant="secondary" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
                </Button>
            </div>

            <div className="space-y-8 pb-12">
                {/* 1. Thông tin chung */}
                <GeneralInfo 
                    course={course} 
                    currentStatus={currentStatus} 
                    onStatusChange={handleStatusChange} 
                />

                {/* 2. Thống kê (Học viên, Đánh giá...) */}
                <StatsOverview 
                    course={course}
                    onOpenEnrollment={() => setIsEnrollmentModalOpen(true)}
                    onOpenRating={() => setIsRatingModalOpen(true)}
                />

                {/* 3. Nội dung chi tiết (Các khối click được) */}
                <ContentOverview 
                    counts={{
                        theory: course.numTheoryLessons,
                        video: course.numVideos,
                        exercise: course.numExercises,
                        test: course.numTests
                    }}
                    onOpen={(type) => setContentModalType(type)} // Mở modal theo loại
                />

                {/* 4. Danh sách chương */}
                <ChapterList 
                    chapters={chapters} 
                    isLoading={loadingChapters} 
                />
            </div>

            {/* --- MODALS --- */}
            
            {/* Modal danh sách nội dung chi tiết (Video, Bài tập...) */}
            {contentModalType && (
                <ContentListModal
                    isOpen={!!contentModalType}
                    onClose={() => setContentModalType(null)}
                    type={contentModalType}
                    chapters={chapters || []} // Truyền dữ liệu chapters lấy từ API vào
                />
            )}

            {/* Modal Học viên */}
            <Modal isOpen={isEnrollmentModalOpen} onClose={() => setIsEnrollmentModalOpen(false)} title={`Danh sách Học viên`}>
                <EnrollmentList />
            </Modal>

            {/* Modal Đánh giá */}
            <Modal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} title={`Danh sách Đánh giá`}>
                <RatingList />
            </Modal>

        </MainLayout>
    );
};

export default CourseDetail;
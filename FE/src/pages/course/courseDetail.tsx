// src/pages/course/CourseDetail.tsx

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { 
    ArrowLeft, User, Star, Clock, BookOpen, 
    FileText, Video, ListChecks, MessageSquare, Loader2, Save
} from 'lucide-react';
import Button from '../../components/ui/Button';
import StatCardDetailed from '../../components/ui/StatCardDetailed'; 
import DetailSection from '../../components/layout/DetailSection'; 
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import Modal from '../../components/ui/Modal';
import Table, { Column } from '../../components/ui/Table';
import { formatDate } from '../../utils/format';
import axiosClient from '../../api/axiosClient'; // 1. Import axiosClient để gọi API

// ... (Giữ nguyên các Interface Chapter, Enrollment, Rating...)
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
    teacher?: { user?: { fullName: string; email: string } };
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
    
    // State Modal
    const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    // 2. State quản lý Trạng thái hiển thị trên Select box
    const [currentStatus, setCurrentStatus] = useState<string>('');

    // Fetch data
    const { data: course, isLoading, error } = useFetch<CourseDetailData>(`/Course/${id}`);

    // 3. Cập nhật state local khi dữ liệu từ API tải về xong
    useEffect(() => {
        if (course) {
            setCurrentStatus(course.courseState);
        }
    }, [course]);

    // 4. HÀM GỌI API CẬP NHẬT DATABASE
    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        const oldStatus = currentStatus;
        
        // Cập nhật giao diện ngay lập tức cho mượt (Optimistic UI)
        setCurrentStatus(newStatus); 

        try {
            // Gọi API PUT: Cập nhật chỉ trường courseState
            await axiosClient.put(`/Course/${id}`, {
                courseState: newStatus
            });
            // (Tuỳ chọn) Thông báo thành công nhẹ nhàng hoặc console.log
            console.log("Cập nhật trạng thái thành công!");
        } catch (err: any) {
            console.error(err);
            alert("Lỗi khi cập nhật trạng thái. Đang hoàn tác...");
            // Nếu lỗi, quay về trạng thái cũ
            setCurrentStatus(oldStatus);
        }
    };

    // Hàm chọn màu sắc cho Select box dựa trên trạng thái
    const getStatusColor = (status: string) => {
        if (status === 'Đang mở') return 'bg-green-100 text-green-800 border-green-300';
        if (status === 'Sắp ra mắt') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        if (status === 'Đã đóng') return 'bg-red-100 text-red-800 border-red-300';
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }

    // Component con EnrollmentList và RatingList (Giữ nguyên như cũ)
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

    const RatingList = () => {
        const { data: ratings, isLoading: loadingRatings } = useFetch<Rating[]>(`/Rating/course/${id}`);
        const columns: Column<Rating>[] = [
            { key: 'userID', header: 'ID Học viên' },
            { key: 'user', header: 'Người đánh giá', render: (r) => r.user?.fullName || 'N/A' },
            { key: 'ratingValue', header: 'Điểm', render: (r) => (<div className="flex items-center text-yellow-500"><span className="font-bold mr-1">{r.ratingValue}</span> <Star className="w-4 h-4 fill-current" /></div>) },
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
                
                {/* 5. KHỐI THÔNG TIN CHUNG (Đã tích hợp Select Box) */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                        {/* Cột trái */}
                        <div className="space-y-3">
                            <p className="flex items-center">
                                <span className="font-bold w-32">Mã khóa học:</span> 
                                <span>{course.courseID}</span>
                            </p>
                            <p className="flex items-center">
                                <span className="font-bold w-32">Giảng viên:</span> 
                                <span>{teacherName}</span>
                            </p>
                        </div>

                        {/* Cột phải */}
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <span className="font-bold w-24">Trạng thái:</span> 
                                {/* SELECT BOX GỌI API */}
                                <select 
                                    value={currentStatus}
                                    onChange={handleStatusChange}
                                    className={`ml-2 px-3 py-1.5 rounded-lg border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors ${getStatusColor(currentStatus)}`}
                                >
                                    <option value="Đang mở">Đang mở</option>
                                    <option value="Sắp ra mắt">Sắp ra mắt</option>
                                    <option value="Đã đóng">Đã đóng</option>
                                </select>
                            </div>
                            <p className="flex items-center">
                                <span className="font-bold w-24">Email GV:</span> 
                                <span>{teacherEmail}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Các phần thống kê và nội dung chi tiết giữ nguyên ... */}
                <DetailSection title="Thống kê tổng quan">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div onClick={() => setIsEnrollmentModalOpen(true)} className="cursor-pointer transition-transform">
                            <StatCardDetailed 
                                icon={<User className="w-6 h-6" />} 
                                title="Học viên" 
                                value={course.numStudents} 
                                iconBgColor="bg-green-100" 
                                iconColor="text-green-600" 
                            />
                        </div>

                        <div onClick={() => setIsRatingModalOpen(true)} className="cursor-pointer transition-transform">
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

                {/* Nội dung chi tiết */}
                <DetailSection title="Nội dung chi tiết" borderTop>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCardDetailed icon={<FileText className="w-6 h-6"/>} title="Lý thuyết" value={course.numTheoryLessons} iconBgColor="bg-gray-100" iconColor="text-gray-600"/>
                        <StatCardDetailed icon={<Video className="w-6 h-6"/>} title="Video" value={course.numVideos} iconBgColor="bg-red-100" iconColor="text-red-600"/>
                        <StatCardDetailed icon={<ListChecks className="w-6 h-6"/>} title="Bài tập" value={course.numExercises} iconBgColor="bg-orange-100" iconColor="text-orange-600"/>
                        <StatCardDetailed icon={<FileText className="w-6 h-6"/>} title="Bài kiểm tra" value={course.numTests} iconBgColor="bg-cyan-100" iconColor="text-cyan-600"/>
                    </div>
                </DetailSection>

                {/* Danh sách chương */}
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

            {/* Modal */}
            <Modal isOpen={isEnrollmentModalOpen} onClose={() => setIsEnrollmentModalOpen(false)} title={`Danh sách Học viên (${course.numStudents})`}>
                <EnrollmentList />
                <div className="mt-4 flex justify-end"><Button variant="secondary" onClick={() => setIsEnrollmentModalOpen(false)}>Đóng</Button></div>
            </Modal>

            <Modal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} title={`Danh sách Đánh giá (${course.numRatings})`}>
                <RatingList />
                <div className="mt-4 flex justify-end"><Button variant="secondary" onClick={() => setIsRatingModalOpen(false)}>Đóng</Button></div>
            </Modal>

        </MainLayout>
    );
};

export default CourseDetail;
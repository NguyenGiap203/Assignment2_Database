// src/pages/course/CourseDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

// Components
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';

// Sub-components
import GeneralInfo from './components/GeneralInfo';
import StatsOverview from './components/StatsOverview';
import ContentOverview from './components/ContentOverview';
import ChapterList from './components/ChapterList';

// Modals
import ContentListModal from './components/modals/ContentListModal';
import StatsListModal, { StatsType } from './components/modals/StatsListModal'; // Modal mới

// Hooks & Utils
import { useFetch } from '../../hooks/useFetch';
import { CourseDetailData, Chapter } from '../../types/course';

const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    
    const [currentStatus, setCurrentStatus] = useState<string>('');
    
    // State quản lý Modal
    const [contentModalType, setContentModalType] = useState<'theory' | 'video' | 'exercise' | 'test' | null>(null);
    const [statsModalType, setStatsModalType] = useState<StatsType | null>(null); // State mới cho Stats Modal

    // FETCH DATA
    const { data: course, isLoading: loadingCourse, error } = useFetch<CourseDetailData>(`/Course/${id}`);
    const { data: chapters, isLoading: loadingChapters } = useFetch<Chapter[]>(`/Chapter/course/${id}`);
    const { data: comments } = useFetch<any[]>(`/Comment/course/${id}`);

    useEffect(() => {
        if (course) {
            setCurrentStatus(course.courseState);
        }
    }, [course]);

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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 w-2/3">{course.courseName}</h1>
                <Button variant="secondary" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
                </Button>
            </div>

            <div className="space-y-8 pb-12">
                <GeneralInfo 
                    course={course} 
                    currentStatus={currentStatus} 
                    onStatusChange={handleStatusChange} 
                />

                {/* Khối Thống kê Tổng quan - Dùng Modal chung StatsListModal */}
                <StatsOverview 
                    course={course}
                    commentCount={comments?.length || 0}
                    onOpen={(type) => setStatsModalType(type)} // Hàm mở modal chung
                />

                {/* Khối Nội dung chi tiết - Dùng Modal chung ContentListModal */}
                <ContentOverview 
                    counts={{
                        theory: course.numTheoryLessons,
                        video: course.numVideos,
                        exercise: course.numExercises,
                        test: course.numTests
                    }}
                    onOpen={(type) => setContentModalType(type)}
                />

                <ChapterList 
                    chapters={chapters} 
                    isLoading={loadingChapters} 
                />
            </div>

            {/* --- MODALS --- */}
            
            {/* 1. Modal cho Content (Video, Theory...) */}
            {contentModalType && (
                <ContentListModal
                    isOpen={!!contentModalType}
                    onClose={() => setContentModalType(null)}
                    type={contentModalType}
                    chapters={chapters || []}
                />
            )}

            {/* 2. Modal cho Stats (Student, Rating, Comment) */}
            {statsModalType && (
                <StatsListModal 
                    isOpen={!!statsModalType}
                    onClose={() => setStatsModalType(null)}
                    type={statsModalType}
                    courseId={id || ''}
                />
            )}

        </MainLayout>
    );
};

export default CourseDetail;
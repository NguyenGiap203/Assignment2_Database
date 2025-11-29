// src/pages/course/components/StatsOverview.tsx
import React from 'react';
import { User, Star, Clock, MessageSquare } from 'lucide-react';
import StatCardDetailed from '../../../components/ui/StatCardDetailed';
import DetailSection from '../../../components/layout/DetailSection';

interface StatsOverviewProps {
    course: any;
    onOpenEnrollment: () => void;
    onOpenRating: () => void;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ course, onOpenEnrollment, onOpenRating }) => {
    return (
        <DetailSection title="Thống kê tổng quan">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div onClick={onOpenEnrollment} className="cursor-pointer transition-transform hover:scale-105">
                    <StatCardDetailed 
                        icon={<User className="w-6 h-6" />} 
                        title="Học viên" 
                        value={course.numStudents} 
                        iconBgColor="bg-green-100" 
                        iconColor="text-green-600" 
                    />
                </div>

                <div onClick={onOpenRating} className="cursor-pointer transition-transform hover:scale-105">
                    <StatCardDetailed 
                        icon={<Star className="w-6 h-6" />} 
                        title="Đánh giá" 
                        value={`${course.averageRating?.toFixed(1) || 0} / 5`} 
                        description={`(${course.numRatings || 0} lượt)`}
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
                
                {/* Số lượng chương lấy từ course.chapters (nếu có) hoặc props truyền vào */}
                <StatCardDetailed 
                    icon={<MessageSquare className="w-6 h-6" />} 
                    title="Chương học" 
                    value={course.chapters?.length || 0} 
                    iconBgColor="bg-purple-100" 
                    iconColor="text-purple-600" 
                />
            </div>
        </DetailSection>
    );
};
export default StatsOverview;
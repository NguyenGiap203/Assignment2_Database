// src/pages/course/components/StatsOverview.tsx
import React from 'react';
import { User, Star, MessageCircle, MessageSquare } from 'lucide-react';
import StatCardDetailed from '../../../components/ui/StatCardDetailed';
import DetailSection from '../../../components/layout/DetailSection';
import { StatsType } from './modals/StatsListModal'; // Import type

interface StatsOverviewProps {
    course: any;
    commentCount: number;
    // Thay đổi prop onOpen nhận type thay vì từng hàm riêng lẻ
    onOpen: (type: StatsType) => void;
}

const CARD_HEIGHT_CLASS = "h-32"; 

const StatsOverview: React.FC<StatsOverviewProps> = ({ 
    course, 
    commentCount,
    onOpen, 
}) => {
    return (
        <DetailSection title="Thống kê tổng quan">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                
                {/* 1. Học viên */}
                <div onClick={() => onOpen('student')} className="cursor-pointer transition-transform hover:scale-105 w-full">
                    <StatCardDetailed 
                        icon={<User className="w-6 h-6" />} 
                        title="Học viên" 
                        value={course.numStudents} 
                        iconBgColor="bg-green-100" 
                        iconColor="text-green-600"
                        className={CARD_HEIGHT_CLASS}
                    />
                </div>

                {/* 2. Đánh giá */}
                <div onClick={() => onOpen('rating')} className="cursor-pointer transition-transform hover:scale-105 w-full">
                    <StatCardDetailed 
                        icon={<Star className="w-6 h-6" />} 
                        title="Đánh giá" 
                        value={`${course.averageRating?.toFixed(1) || 0} / 5`} 
                        description={`(${course.numRatings || 0} lượt)`}
                        iconBgColor="bg-yellow-100" 
                        iconColor="text-yellow-600"
                        className={CARD_HEIGHT_CLASS}
                    />
                </div>

                {/* 3. Bình luận */}
                <div onClick={() => onOpen('comment')} className="cursor-pointer transition-transform hover:scale-105 w-full">
                    <StatCardDetailed 
                        icon={<MessageCircle className="w-6 h-6" />} 
                        title="Bình luận" 
                        value={commentCount} 
                        iconBgColor="bg-blue-100" 
                        iconColor="text-blue-600"
                        className={CARD_HEIGHT_CLASS}
                    />
                </div>
                
                {/* 4. Chương học (Không có modal riêng, thường scroll xuống dưới) */}
                <div className="w-full">
                    <StatCardDetailed 
                        icon={<MessageSquare className="w-6 h-6" />} 
                        title="Chương học" 
                        value={course.chapters?.length || 0} 
                        iconBgColor="bg-purple-100" 
                        iconColor="text-purple-600"
                        className={CARD_HEIGHT_CLASS}
                    />
                </div>
            </div>
        </DetailSection>
    );
};
export default StatsOverview;
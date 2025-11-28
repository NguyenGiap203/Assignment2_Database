import React from 'react';
import StatCardDetailed from '../../../components/ui/StatCardDetailed';
import DetailSection from '../../../components/layout/DetailSection';
import { FileText, Video, ListChecks, FileDigit } from 'lucide-react'; // FileDigit icon for Test

interface ContentOverviewProps {
    course: any;
    onOpen: (type: 'theory' | 'video' | 'exercise' | 'test') => void;
}

const ContentOverview: React.FC<ContentOverviewProps> = ({ course, onOpen }) => {
    return (
        <DetailSection title="Nội dung chi tiết" borderTop>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div onClick={() => onOpen('theory')} className="cursor-pointer transition-transform hover:scale-105">
                    <StatCardDetailed icon={<FileText className="w-6 h-6"/>} title="Lý thuyết" value={course.numTheoryLessons} iconBgColor="bg-gray-100" iconColor="text-gray-600"/>
                </div>
                <div onClick={() => onOpen('video')} className="cursor-pointer transition-transform hover:scale-105">
                    <StatCardDetailed icon={<Video className="w-6 h-6"/>} title="Video" value={course.numVideos} iconBgColor="bg-red-100" iconColor="text-red-600"/>
                </div>
                <div onClick={() => onOpen('exercise')} className="cursor-pointer transition-transform hover:scale-105">
                    <StatCardDetailed icon={<ListChecks className="w-6 h-6"/>} title="Bài tập" value={course.numExercises} iconBgColor="bg-orange-100" iconColor="text-orange-600"/>
                </div>
                <div onClick={() => onOpen('test')} className="cursor-pointer transition-transform hover:scale-105">
                    <StatCardDetailed icon={<FileDigit className="w-6 h-6"/>} title="Bài kiểm tra" value={course.numTests} iconBgColor="bg-cyan-100" iconColor="text-cyan-600"/>
                </div>
            </div>
        </DetailSection>
    );
};
export default ContentOverview;
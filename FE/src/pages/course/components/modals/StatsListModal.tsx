// src/pages/course/components/modals/StatsListModal.tsx

import React from 'react';
import Modal from '../../../../components/ui/Modal';
import Button from '../../../../components/ui/Button';
import StudentList from '../StudentList';
import RatingList from '../RatingList';
import CommentList from '../CommentList';

export type StatsType = 'student' | 'rating' | 'comment';

interface StatsListModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: StatsType | null;
    courseId: string;
}

const StatsListModal: React.FC<StatsListModalProps> = ({ isOpen, onClose, type, courseId }) => {
    // Mapping tiêu đề
    const titles: Record<string, string> = {
        student: 'Danh sách Học viên',
        rating: 'Danh sách Đánh giá',
        comment: 'Danh sách Bình luận'
    };

    if (!type) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={titles[type] || 'Chi tiết'} 
            maxWidth="3xl" // Dùng size rộng như bạn yêu cầu
        >
            <div className="max-h-[60vh] overflow-y-auto min-h-[300px]">
                {type === 'student' && <StudentList courseId={courseId} />}
                {type === 'rating' && <RatingList courseId={courseId} />}
                {type === 'comment' && <CommentList courseId={courseId} />}
            </div>
            
            <div className="mt-4 flex justify-end">
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
            </div>
        </Modal>
    );
};

export default StatsListModal;
// src/pages/course/components/modals/RatingListModal.tsx

import React, { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import Table, { Column } from '../../../../components/ui/Table';
import Button from '../../../../components/ui/Button';
import { useFetch } from '../../../../hooks/useFetch';
import { Star } from 'lucide-react';

interface RatingListModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
}

interface Rating {
    userID: string;
    user?: { fullName: string };
    ratingValue: number;
}

const RatingListModal: React.FC<RatingListModalProps> = ({ isOpen, onClose, courseId }) => {
    const [sortKey, setSortKey] = useState('rating');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Gọi API Ratings
    const { data: ratings, isLoading } = useFetch<Rating[]>(
        isOpen ? `/Rating/course/${courseId}?sortBy=${sortKey}&sortOrder=${sortOrder}` : ''
    );

    const handleSort = (key: string) => {
        if (key === 'ratingValue') {
            setSortKey('rating'); // Khớp với switch case trong RatingController
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        }
    };

    const columns: Column<Rating>[] = [
        { key: 'userID', header: 'ID Học viên' },
        { key: 'user', header: 'Người đánh giá', render: (r) => r.user?.fullName || 'N/A' },
        { 
            key: 'ratingValue', 
            header: 'Điểm số', 
            render: (r) => (
                <div className="flex items-center text-yellow-600 font-bold">
                    {r.ratingValue} <Star className="w-4 h-4 fill-current ml-1" />
                </div>
            ),
            sortable: true
        },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Danh sách Đánh giá`}>
            {isLoading ? (
                <div className="text-center p-4">Đang tải dữ liệu...</div>
            ) : (
                <Table<Rating> 
                    data={ratings || []} 
                    columns={columns} 
                    sortKey={sortKey === 'rating' ? 'ratingValue' : undefined}
                    sortDirection={sortOrder}
                    onSort={(k) => handleSort(k as string)}
                />
            )}
            <div className="mt-4 flex justify-end">
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
            </div>
        </Modal>
    );
};

export default RatingListModal;
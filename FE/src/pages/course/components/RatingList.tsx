import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Table, { Column } from '../../../components/ui/Table';
import { useFetch } from '../../../hooks/useFetch';

interface RatingListProps {
    courseId: string;
}

interface Rating {
    userID: string;
    user?: { fullName: string };
    ratingValue: number;
}

const RatingList: React.FC<RatingListProps> = ({ courseId }) => {
    const [sortKey, setSortKey] = useState('rating');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data: ratings, isLoading } = useFetch<Rating[]>(
        `/Rating/course/${courseId}?sortBy=${sortKey}&sortOrder=${sortOrder}`
    );

    const handleSort = (key: string) => {
        if (key === 'ratingValue') {
            setSortKey('rating');
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

    if (isLoading) return <div className="text-center p-4">Đang tải dữ liệu...</div>;

    return (
        <Table<Rating> 
            data={ratings || []} 
            columns={columns} 
            sortKey={sortKey === 'rating' ? 'ratingValue' : undefined}
            sortDirection={sortOrder}
            onSort={(k) => handleSort(k as string)}
        />
    );
};

export default RatingList;
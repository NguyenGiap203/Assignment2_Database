// src/pages/course/components/lists/RatingList.tsx

import React, { useState, useCallback } from 'react';
import { Star, Trash2, Loader2 } from 'lucide-react';
import Table, { Column } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import { useFetch } from '../../../hooks/useFetch';
import axiosClient from '../../../api/axiosClient';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refetchKey, setRefetchKey] = useState(0); // Dùng để load lại dữ liệu sau khi xóa

    // Thêm refetchKey vào URL để trigger reload
    const { data: ratings, isLoading } = useFetch<Rating[]>(
        `/Rating/course/${courseId}?sortBy=${sortKey}&sortOrder=${sortOrder}&refetch=${refetchKey}`
    );

    const handleSort = (key: string) => {
        if (key === 'ratingValue') {
            setSortKey('rating');
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        }
    };

    // --- HÀM XÓA 1 ĐÁNH GIÁ ---
    const handleDeleteSingle = useCallback(async (rating: Rating) => {
        if (window.confirm(`Bạn muốn xóa đánh giá của ${rating.user?.fullName || rating.userID}?`)) {
            setIsSubmitting(true);
            try {
                // DELETE với Body (theo RatingController)
                await axiosClient.delete('/Rating', {
                    data: { 
                        UserID: rating.userID, 
                        CourseID: courseId 
                    }
                });
                alert('Xóa thành công!');
                setRefetchKey(prev => prev + 1);
            } catch (err: any) {
                alert(`Lỗi: ${err.response?.data?.message || err.message}`);
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [courseId]);

    // --- HÀM XÓA TẤT CẢ ---
    const handleDeleteAll = useCallback(async () => {
        if (!ratings || ratings.length === 0) return;
        if (window.confirm("CẢNH BÁO: Bạn có chắc muốn xóa TOÀN BỘ đánh giá của khóa học này không?")) {
            setIsSubmitting(true);
            try {
                // Gọi API xóa song song cho từng phần tử
                const deletePromises = ratings.map(r => 
                    axiosClient.delete('/Rating', {
                        data: { UserID: r.userID, CourseID: courseId }
                    })
                );
                await Promise.all(deletePromises);
                
                alert(`Đã xóa ${ratings.length} đánh giá!`);
                setRefetchKey(prev => prev + 1);
            } catch (err: any) {
                console.error(err);
                alert("Có lỗi xảy ra khi xóa một số đánh giá.");
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [ratings, courseId]);

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
        {
            key: 'actions',
            header: 'Hành động',
            render: (r) => (
                <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDeleteSingle(r)}
                    disabled={isSubmitting}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-4">
            {/* Header có nút Xóa tất cả */}
            <div className="flex justify-end">
                 <Button 
                    variant="danger" 
                    size="sm"
                    onClick={handleDeleteAll}
                    disabled={!ratings || ratings.length === 0 || isSubmitting}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Đang xử lý...' : 'Xóa Tất Cả'}
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center p-4 flex justify-center"><Loader2 className="animate-spin mr-2"/> Đang tải...</div>
            ) : (
                <Table<Rating> 
                    data={ratings || []} 
                    columns={columns} 
                    sortKey={sortKey === 'rating' ? 'ratingValue' : undefined}
                    sortDirection={sortOrder}
                    onSort={(k) => handleSort(k as string)}
                />
            )}
        </div>
    );
};

export default RatingList;
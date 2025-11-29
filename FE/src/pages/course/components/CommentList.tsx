// src/pages/course/components/lists/CommentList.tsx

import React, { useState, useCallback } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import Table, { Column } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import { useFetch } from '../../../hooks/useFetch';
import { formatDate } from '../../../utils/format';
import axiosClient from '../../../api/axiosClient';

interface CommentListProps {
    courseId: string;
}

interface Comment {
    commentID?: string;
    content: string;
    createdAt: string;
    user?: { userID: string, fullName: string; accountName: string };
    userID: string; // Cần userID để xóa
}

const CommentList: React.FC<CommentListProps> = ({ courseId }) => {
    const [sortKey, setSortKey] = useState('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refetchKey, setRefetchKey] = useState(0);

    const { data: comments, isLoading } = useFetch<Comment[]>(
        `/Comment/course/${courseId}?sortBy=${sortKey}&sortOrder=${sortOrder}&refetch=${refetchKey}`
    );

    const handleSort = (key: string) => {
        if (key === 'createdAt') {
            setSortKey('date');
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        }
    };

    // --- XÓA 1 BÌNH LUẬN ---
    const handleDeleteSingle = useCallback(async (comment: Comment) => {
        if (window.confirm("Bạn muốn xóa bình luận này?")) {
            setIsSubmitting(true);
            try {
                // DELETE Body theo CommentController: { UserID, CreatedAt }
                // Lưu ý: Controller yêu cầu đúng UserID và CreatedAt để tìm ra comment (Composite Key logic)
                await axiosClient.delete('/Comment', {
                    data: { 
                        UserID: comment.userID || comment.user?.userID, 
                        CreatedAt: comment.createdAt 
                    }
                });
                alert('Đã xóa bình luận.');
                setRefetchKey(prev => prev + 1);
            } catch (err: any) {
                alert(`Lỗi: ${err.response?.data?.message || err.message}`);
            } finally {
                setIsSubmitting(false);
            }
        }
    }, []);

    // --- XÓA TẤT CẢ ---
    const handleDeleteAll = useCallback(async () => {
        if (!comments || comments.length === 0) return;
        if (window.confirm("CẢNH BÁO: Xóa TOÀN BỘ bình luận trong khóa học này?")) {
            setIsSubmitting(true);
            try {
                const deletePromises = comments.map(c => 
                    axiosClient.delete('/Comment', {
                        data: { 
                            UserID: c.userID || c.user?.userID, 
                            CreatedAt: c.createdAt 
                        }
                    })
                );
                await Promise.all(deletePromises);
                
                alert(`Đã xóa ${comments.length} bình luận!`);
                setRefetchKey(prev => prev + 1);
            } catch (err: any) {
                console.error(err);
                alert("Có lỗi xảy ra khi xóa danh sách.");
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [comments]);

    const columns: Column<Comment>[] = [
        { 
            key: 'user', 
            header: 'Người bình luận', 
            render: (c) => (
                <div>
                    <p className="font-medium text-gray-800">{c.user?.fullName || 'N/A'}</p>
                    <p className="text-xs text-gray-500">@{c.user?.accountName}</p>
                </div>
            )
        },
        { key: 'content', header: 'Nội dung', render: (c) => <span className="text-gray-700">{c.content}</span> },
        { 
            key: 'createdAt', 
            header: 'Thời gian', 
            render: (c) => formatDate(c.createdAt),
            sortable: true
        },
        {
            key: 'actions',
            header: 'Hành động',
            render: (c) => (
                <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDeleteSingle(c)}
                    disabled={isSubmitting}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-4">
             <div className="flex justify-end">
                 <Button 
                    variant="danger" 
                    size="sm"
                    onClick={handleDeleteAll}
                    disabled={!comments || comments.length === 0 || isSubmitting}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Đang xử lý...' : 'Xóa Tất Cả'}
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center p-4 flex justify-center"><Loader2 className="animate-spin mr-2"/> Đang tải...</div>
            ) : (
                <Table<Comment> 
                    data={comments || []} 
                    columns={columns} 
                    sortKey={sortKey === 'date' ? 'createdAt' : undefined}
                    sortDirection={sortOrder}
                    onSort={(k) => handleSort(k as string)}
                />
            )}
        </div>
    );
};

export default CommentList;
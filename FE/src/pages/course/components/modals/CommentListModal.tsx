// src/pages/course/components/modals/CommentListModal.tsx

import React, { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import Table, { Column } from '../../../../components/ui/Table';
import Button from '../../../../components/ui/Button';
import { useFetch } from '../../../../hooks/useFetch';
import { formatDate } from '../../../../utils/format';

interface CommentListModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
}

interface Comment {
    commentID?: string; // Tùy thuộc vào model BE trả về
    content: string;
    createdAt: string;
    user?: { fullName: string; accountName: string };
}

const CommentListModal: React.FC<CommentListModalProps> = ({ isOpen, onClose, courseId }) => {
    const [sortKey, setSortKey] = useState('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Gọi API CommentController
    const { data: comments, isLoading } = useFetch<Comment[]>(
        isOpen ? `/Comment/course/${courseId}?sortBy=${sortKey}&sortOrder=${sortOrder}` : ''
    );

    const handleSort = (key: string) => {
        if (key === 'createdAt') {
            setSortKey('date');
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        }
    };

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
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Danh sách Bình luận (${comments?.length || 0})`} >
            {isLoading ? (
                <div className="text-center p-4">Đang tải dữ liệu...</div>
            ) : (
                <Table<Comment> 
                    data={comments || []} 
                    columns={columns} 
                    sortKey={sortKey === 'date' ? 'createdAt' : undefined}
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

export default CommentListModal;
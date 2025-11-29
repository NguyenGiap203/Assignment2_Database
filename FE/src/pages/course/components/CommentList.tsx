import React, { useState } from 'react';
import Table, { Column } from '../../../components/ui/Table';
import { useFetch } from '../../../hooks/useFetch';
import { formatDate } from '../../../utils/format';

interface CommentListProps {
    courseId: string;
}

interface Comment {
    commentID?: string;
    content: string;
    createdAt: string;
    user?: { fullName: string; accountName: string };
}

const CommentList: React.FC<CommentListProps> = ({ courseId }) => {
    const [sortKey, setSortKey] = useState('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data: comments, isLoading } = useFetch<Comment[]>(
        `/Comment/course/${courseId}?sortBy=${sortKey}&sortOrder=${sortOrder}`
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

    if (isLoading) return <div className="text-center p-4">Đang tải dữ liệu...</div>;

    return (
        <Table<Comment> 
            data={comments || []} 
            columns={columns} 
            sortKey={sortKey === 'date' ? 'createdAt' : undefined}
            sortDirection={sortOrder}
            onSort={(k) => handleSort(k as string)}
        />
    );
};

export default CommentList;
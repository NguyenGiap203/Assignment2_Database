// pages/post/PostList.tsx
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Table, { Column } from '../../components/ui/Table';
import { useFetch } from '../../hooks/useFetch';
import Button from '../../components/ui/Button';
// Tạm dùng kiểu dữ liệu đơn giản cho Post (dựa trên user mock)
interface Post { UserID: string; FullName: string; Title: string; }
const PostList: React.FC = () => {
    const { data: posts, isLoading } = useFetch<Post[]>('/api/posts');
    const columns: Column<Post>[] = [
        { key: 'UserID', header: 'ID Bài viết' },
        { key: 'Title', header: 'Tiêu đề' },
        { key: 'FullName', header: 'Người đăng' },
        { key: 'actions', header: 'Hành động', render: () => (<Button size="sm" variant="danger">Xóa bài vi phạm</Button>) }
    ];
    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-6">Quản lý Bài chia sẻ (Post)</h1>
            {isLoading ? <p>Đang tải...</p> : <Table<Post> data={posts || []} columns={columns} />}
        </MainLayout>
    );
};
export default PostList;
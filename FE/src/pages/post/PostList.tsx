// pages/post/PostList.tsx
import React from 'react';
import { Trash2 } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Table, { Column } from '../../components/ui/Table';
import { useFetch } from '../../hooks/useFetch';
import Button from '../../components/ui/Button';
// Tạm dùng kiểu dữ liệu đơn giản cho Post (dựa trên user mock)
interface Post { UserID: string; FullName: string; Title: string; }

const PostList: React.FC = () => {
    const { data: posts, isLoading } = useFetch<Post[]>('/api/posts');

    const handleBulkDelete = () => {
        if (!posts || posts.length === 0) {
            alert("Không có bài viết nào để xóa.");
            return;
        }

        if (window.confirm("BẠN CÓ CHẮC CHẮN MUỐN XÓA TẤT CẢ bài chia sẻ không? Hành động này không thể hoàn tác.")) {
            console.log("Xóa tất cả bài chia sẻ (Mocked API Call)");
            // Giả lập cuộc gọi API delete-all
            alert(`Đã gửi yêu cầu xóa ${posts.length} bài viết thành công (Mocked)!`);
            // Trong thực tế: Sau đó refetch data
        }
    };

    const columns: Column<Post>[] = [
        { key: 'UserID', header: 'ID Bài viết' },
        { key: 'Title', header: 'Tiêu đề' },
        { key: 'FullName', header: 'Người đăng' },
        { key: 'actions', header: 'Hành động', render: () => (<Button size="sm" variant="danger">Xóa</Button>) }
    ];
    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-6">Quản lý Bài chia sẻ (Post)</h1>
            <div className="flex justify-end mb-6">
                <Button 
                    variant="danger" 
                    onClick={handleBulkDelete} 
                    disabled={!posts || posts.length === 0}
                >
                    <Trash2 className="w-5 h-5 mr-2" /> Xóa Tất Cả Bài Viết
                </Button>
            </div>
            {isLoading ? <p>Đang tải...</p> : <Table<Post> data={posts || []} columns={columns} />}
        </MainLayout>
    );
};
export default PostList;
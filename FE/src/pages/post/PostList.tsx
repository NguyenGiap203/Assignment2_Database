// pages/post/PostList.tsx
import React, { useState, useCallback } from 'react';
import { Trash2, Loader2, Eye } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Table, { Column } from '../../components/ui/Table';
import { useFetch } from '../../hooks/useFetch';
import Button from '../../components/ui/Button';
import axiosClient from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';

// FIX: Interface Post theo BE Post Model
interface Post { 
    PostID: string;
    Title: string;
    Content: string;
    UserID: string;
    CreatedAt: string;
    User: {
        FullName: string;
    }
}

const PostList: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refetchKey, setRefetchKey] = useState(0);
    // FIX: Sử dụng API Post thực tế
    const { data: posts, isLoading, error } = useFetch<Post[]>(`/Post?refetch=${refetchKey}`);

    const handleBulkDelete = useCallback(async () => {
        if (!posts || posts.length === 0) {
            alert("Không có bài viết nào để xóa.");
            return;
        }

        if (window.confirm("BẠN CÓ CHẮC CHẮN MUỐN XÓA TẤT CẢ bài chia sẻ không? Hành động này không thể hoàn tác.")) {
            setIsSubmitting(true);
            try {
                // FIX: Xóa từng bài viết (vì không có API xóa tất cả)
                const deletePromises = posts.map(p => axiosClient.delete(`/Post/${p.PostID}`));
                await Promise.all(deletePromises);
                
                alert(`Đã xóa thành công ${posts.length} bài viết!`);
                setRefetchKey(prev => prev + 1); // Refetch
            } catch (err: any) {
                 alert(`Lỗi xóa: ${err.response?.data?.message || err.message}`);
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [posts]);

    // Thêm logic xóa từng bài viết (đã tồn tại trong BE)
    const handleDeleteSingle = useCallback(async (post: Post) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${post.Title}" không?`)) {
            setIsSubmitting(true);
            try {
                await axiosClient.delete(`/Post/${post.PostID}`);
                alert(`Đã xóa bài viết: ${post.Title}`);
                setRefetchKey(prev => prev + 1); // Refetch
            } catch (err: any) {
                 alert(`Lỗi xóa: ${err.response?.data?.message || err.message}`);
            } finally {
                setIsSubmitting(false);
            }
        }
    }, []);

    const columns: Column<Post>[] = [
        { key: 'PostID', header: 'ID Bài viết' },
        { key: 'Title', header: 'Tiêu đề' },
        { key: 'UserID', header: 'ID Người đăng' },
        { 
            key: 'FullName', 
            header: 'Người đăng',
            render: (post) => post.User?.FullName || 'N/A' // Lấy tên từ dữ liệu join
        },
        { 
            key: 'CreatedAt', 
            header: 'Ngày đăng',
            render: (post) => new Date(post.CreatedAt).toLocaleDateString()
        },
        { 
            key: 'actions', 
            header: 'Hành động', 
            render: (post) => (
                <div className='space-x-2'>
                    <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => navigate(`/posts/${post.PostID}`)}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                        size="sm" 
                        variant="danger"
                        onClick={() => handleDeleteSingle(post)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ) 
        }
    ];

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-6">Quản lý Bài chia sẻ (Post)</h1>
            <div className="flex justify-end mb-6">
                <Button 
                    variant="danger" 
                    onClick={handleBulkDelete} 
                    disabled={!posts || posts.length === 0 || isSubmitting}
                    isLoading={isSubmitting}
                >
                    <Trash2 className="w-5 h-5 mr-2" /> {isSubmitting ? 'Đang xóa...' : 'Xóa Tất Cả Bài Viết'}
                </Button>
            </div>
            {isLoading && <div className="p-6 text-center text-blue-600 flex justify-center items-center"><Loader2 className="w-6 h-6 animate-spin mr-2" />Đang tải dữ liệu...</div>}
            {error && <div className="p-6 text-center text-red-600">Lỗi: {error}</div>}
            
            {!isLoading && posts && (
                <Table<Post> 
                    data={posts || []} 
                    columns={columns as Column<Post>[]} // Ép kiểu vì PostList interface bị rút gọn
                />
            )}
        </MainLayout>
    );
};
export default PostList;
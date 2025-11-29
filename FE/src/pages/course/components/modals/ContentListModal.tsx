// src/pages/course/components/modals/ContentListModal.tsx

import React, { useState, useMemo } from 'react';
import Modal from '../../../../components/ui/Modal';
import Table, { Column } from '../../../../components/ui/Table';
import Button from '../../../../components/ui/Button';
import { Chapter } from '../../../../types/course';

interface ContentListModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'theory' | 'video' | 'exercise' | 'test';
    chapters: Chapter[];
}

const ContentListModal: React.FC<ContentListModalProps> = ({ isOpen, onClose, type, chapters }) => {
    // 1. Làm phẳng dữ liệu từ Chapters ra list items
    const data = useMemo(() => {
        if (!chapters) return [];
        
        // FIX: Thêm định kiểu ': any[]' cho tham số callback để TypeScript không báo lỗi union type
        return chapters.flatMap((chap): any[] => {
            const chapterName = `Chương ${chap.chapterOrder}`;
            switch (type) {
                case 'video': 
                    return chap.videoLessons.map(v => ({ ...v, chapterName }));
                case 'theory': 
                    return chap.theoryLessons.map(t => ({ ...t, chapterName }));
                case 'exercise': 
                    return chap.exercises.map(e => ({ ...e, chapterName }));
                case 'test': 
                    return chap.tests.map(t => ({ ...t, chapterName }));
                default: 
                    return [];
            }
        });
    }, [chapters, type]);

    // 2. Cấu hình cột dựa trên loại (type)
    const getColumns = (): Column<any>[] => {
        const baseCols: Column<any>[] = [
            { key: 'chapterName', header: 'Thuộc Chương', sortable: true },
            { key: 'title', header: 'Tiêu đề', sortable: true }, // Các bảng đều có title (hoặc testName được map sang title nếu cần, ở đây giữ nguyên logic cũ)
        ];

        if (type === 'video') {
            baseCols.push(
                { key: 'durationMinutes', header: 'Thời lượng (p)', sortable: true },
                { key: 'videoURL', header: 'Link', render: (i) => <a href={i.videoURL} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Xem</a> }
            );
        } else if (type === 'test') {
            // Test dùng TestName thay vì Title
            return [
                { key: 'chapterName', header: 'Thuộc Chương', sortable: true },
                { key: 'testName', header: 'Tên bài kiểm tra', sortable: true },
                { key: 'testDuration', header: 'Thời gian (p)', sortable: true },
            ];
        } else if (type === 'exercise') {
            baseCols.push({ key: 'minPassingScore', header: 'Điểm đạt', sortable: true });
        }
        
        return baseCols;
    };

    // 3. State sắp xếp (Client-side sorting vì dữ liệu đã load hết về rồi)
    const [sortKey, setSortKey] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    // Logic sort
    const sortedData = useMemo(() => {
        if (!sortKey) return data;
        return [...data].sort((a: any, b: any) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            
            // Xử lý sort số hoặc chuỗi an toàn
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortDirection === 'asc' ? valA - valB : valB - valA;
            }
            return sortDirection === 'asc' 
                ? String(valA || '').localeCompare(String(valB || '')) 
                : String(valB || '').localeCompare(String(valA || ''));
        });
    }, [data, sortKey, sortDirection]);

    const titles = { theory: 'Lý thuyết', video: 'Video bài giảng', exercise: 'Bài tập', test: 'Bài kiểm tra' };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Chi tiết ${titles[type]} (${data.length})`}>
            <div className="max-h-[60vh] overflow-y-auto">
                <Table 
                    data={sortedData} 
                    columns={getColumns()} 
                    sortKey={sortKey} 
                    sortDirection={sortDirection} 
                    onSort={(k) => handleSort(k as string)}
                />
            </div>
            <div className="mt-4 flex justify-end">
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
            </div>
        </Modal>
    );
};

export default ContentListModal;
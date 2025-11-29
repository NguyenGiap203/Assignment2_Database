import React, { useState, useMemo } from 'react';
import DetailSection from '../../../components/layout/DetailSection';
import Table, { Column } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import { Chapter } from '../../../types/course';

interface ContentListProps {
    chapters: Chapter[];
}

type ContentType = 'theory' | 'video' | 'exercise' | 'test';

const ContentList: React.FC<ContentListProps> = ({ chapters }) => {
    const [activeTab, setActiveTab] = useState<ContentType>('video');
    const [sortKey, setSortKey] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // 1. Làm phẳng dữ liệu dựa trên Tab đang chọn
    const data = useMemo(() => {
        if (!chapters) return [];
        return chapters.flatMap((chap): any[] => {
            const chapterName = `Chương ${chap.chapterOrder}`;
            switch (activeTab) {
                case 'video': return chap.videoLessons.map(v => ({ ...v, chapterName }));
                case 'theory': return chap.theoryLessons.map(t => ({ ...t, chapterName }));
                case 'exercise': return chap.exercises.map(e => ({ ...e, chapterName }));
                case 'test': return chap.tests.map(t => ({ ...t, chapterName }));
                default: return [];
            }
        });
    }, [chapters, activeTab]);

    // 2. Logic Sort
    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedData = useMemo(() => {
        if (!sortKey) return data;
        return [...data].sort((a: any, b: any) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortDirection === 'asc' ? valA - valB : valB - valA;
            }
            return sortDirection === 'asc' 
                ? String(valA || '').localeCompare(String(valB || '')) 
                : String(valB || '').localeCompare(String(valA || ''));
        });
    }, [data, sortKey, sortDirection]);

    // 3. Cấu hình cột
    const getColumns = (): Column<any>[] => {
        const baseCols: Column<any>[] = [
            { key: 'chapterName', header: 'Thuộc Chương', sortable: true },
            { key: 'title', header: 'Tiêu đề', sortable: true },
        ];

        if (activeTab === 'video') {
            baseCols.push(
                { key: 'durationMinutes', header: 'Thời lượng (p)', sortable: true },
                { key: 'videoURL', header: 'Link', render: (i) => <a href={i.videoURL} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Xem</a> }
            );
        } else if (activeTab === 'test') {
            return [
                { key: 'chapterName', header: 'Thuộc Chương', sortable: true },
                { key: 'testName', header: 'Tên bài kiểm tra', sortable: true },
                { key: 'testDuration', header: 'Thời gian (p)', sortable: true },
            ];
        } else if (activeTab === 'exercise') {
            baseCols.push({ key: 'minPassingScore', header: 'Điểm đạt', sortable: true });
        }
        return baseCols;
    };

    const tabs: { key: ContentType; label: string }[] = [
        { key: 'video', label: 'Video bài giảng' },
        { key: 'theory', label: 'Lý thuyết' },
        { key: 'exercise', label: 'Bài tập' },
        { key: 'test', label: 'Bài kiểm tra' },
    ];

    return (
        <DetailSection title="Chi tiết Tài nguyên khóa học" borderTop>
            {/* Tabs Navigation */}
            <div className="flex space-x-2 mb-4 border-b border-gray-200 pb-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => { setActiveTab(tab.key); setSortKey(''); }}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                            activeTab === tab.key
                                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <Table 
                    data={sortedData} 
                    columns={getColumns()} 
                    sortKey={sortKey} 
                    sortDirection={sortDirection} 
                    onSort={(k) => handleSort(k as string)}
                />
            </div>
        </DetailSection>
    );
};

export default ContentList;
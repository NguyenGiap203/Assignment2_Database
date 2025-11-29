// src/pages/course/components/ChapterList.tsx
import React from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import DetailSection from '../../../components/layout/DetailSection';
import { Chapter } from '../../../types/course';

interface ChapterListProps {
    chapters: Chapter[] | null;
    isLoading: boolean;
}

const ChapterList: React.FC<ChapterListProps> = ({ chapters, isLoading }) => {
    return (
        <DetailSection title="Danh sách các Chương" borderTop>
            <div className="bg-white rounded-xl shadow border border-gray-100 divide-y divide-gray-100">
                {isLoading ? (
                    <div className="p-6 text-center text-blue-600 flex justify-center"><Loader2 className="animate-spin mr-2"/> Đang tải danh sách chương...</div>
                ) : chapters && chapters.length > 0 ? (
                    chapters.map((chap) => (
                        <div key={chap.chapterID} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <BookOpen className="w-4 h-4 mr-2 text-blue-500"/>
                                    Chương {chap.chapterOrder}: {chap.chapterTitle}
                                </h4>
                                {chap.chapterDescription && (
                                    <p className="text-sm text-gray-500 mt-1 ml-6">{chap.chapterDescription}</p>
                                )}
                            </div>
                            <div className="text-xs text-gray-400">
                                {chap.videoLessons?.length || 0} Video • {chap.exercises?.length || 0} Bài tập
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500 italic">Chưa có chương nào được tạo.</div>
                )}
            </div>
        </DetailSection>
    );
};
export default ChapterList;
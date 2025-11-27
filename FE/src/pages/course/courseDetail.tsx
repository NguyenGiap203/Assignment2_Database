// pages/course/CourseDetail.tsx
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

const CourseDetail: React.FC = () => (
    <MainLayout>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Chi tiết Khóa học: COU00001</h1>
            <Button variant="secondary" onClick={() => window.history.back()}>
                <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
            </Button>
        </div>
        <div className="p-8 bg-white rounded-xl shadow-lg">
            <p className="text-xl font-semibold">Tên: Lập trình React cơ bản</p>
            <p className="mt-4 text-gray-600">Nội dung chi tiết của khóa học, các chương, bài giảng và video.</p>
        </div>
    </MainLayout>
);
export default CourseDetail;